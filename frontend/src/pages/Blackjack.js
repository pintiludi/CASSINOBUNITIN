import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useGame } from '../contexts/GameContext';
import { blackjackCards } from '../mock';

const Blackjack = () => {
  const navigate = useNavigate();
  const { credits, placeBet, winAmount, loseGame, playGame } = useGame();
  
  const [deck, setDeck] = useState([]);
  const [playerCards, setPlayerCards] = useState([]);
  const [dealerCards, setDealerCards] = useState([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);
  const [gameState, setGameState] = useState('betting'); // betting, playing, dealer_turn, game_over
  const [betAmount, setBetAmount] = useState(100);
  const [gameResult, setGameResult] = useState('');
  const [dealerHiddenCard, setDealerHiddenCard] = useState(true);

  const createShuffledDeck = () => {
    const newDeck = [...blackjackCards];
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }
    return newDeck;
  };

  const getCardValue = (card) => {
    const value = card.slice(0, -1);
    if (value === 'A') return 11;
    if (['J', 'Q', 'K'].includes(value)) return 10;
    return parseInt(value);
  };

  const calculateScore = (cards) => {
    let score = 0;
    let aces = 0;
    
    cards.forEach(card => {
      const value = getCardValue(card);
      if (value === 11) aces++;
      score += value;
    });
    
    // Adjust for aces
    while (score > 21 && aces > 0) {
      score -= 10;
      aces--;
    }
    
    return score;
  };

  const dealCard = (currentDeck) => {
    if (currentDeck.length === 0) {
      const newDeck = createShuffledDeck();
      return { card: newDeck.pop(), newDeck };
    }
    const card = currentDeck.pop();
    return { card, newDeck: [...currentDeck] };
  };

  const startNewGame = () => {
    if (!placeBet(betAmount)) {
      alert('Créditos insuficientes!');
      return;
    }

    const newDeck = createShuffledDeck();
    let currentDeck = [...newDeck];
    
    // Deal initial cards
    const { card: playerCard1, newDeck: deck1 } = dealCard(currentDeck);
    const { card: dealerCard1, newDeck: deck2 } = dealCard(deck1);
    const { card: playerCard2, newDeck: deck3 } = dealCard(deck2);
    const { card: dealerCard2, newDeck: finalDeck } = dealCard(deck3);

    const newPlayerCards = [playerCard1, playerCard2];
    const newDealerCards = [dealerCard1, dealerCard2];

    setDeck(finalDeck);
    setPlayerCards(newPlayerCards);
    setDealerCards(newDealerCards);
    setPlayerScore(calculateScore(newPlayerCards));
    setDealerScore(calculateScore([dealerCard1])); // Only count visible card
    setGameState('playing');
    setGameResult('');
    setDealerHiddenCard(true);
    playGame('blackjack');

    // Check for natural blackjack
    const playerBJ = calculateScore(newPlayerCards) === 21;
    const dealerBJ = calculateScore(newDealerCards) === 21;
    
    if (playerBJ || dealerBJ) {
      setDealerHiddenCard(false);
      setDealerScore(calculateScore(newDealerCards));
      
      if (playerBJ && dealerBJ) {
        setGameResult('🤝 Empate! Ambos fizeram Blackjack!');
        winAmount(betAmount); // Return bet
        setGameState('game_over');
      } else if (playerBJ) {
        setGameResult('🎉 BLACKJACK! Você ganhou!');
        winAmount(betAmount * 2.5); // Blackjack pays 3:2
        setGameState('game_over');
      } else {
        setGameResult('😞 Dealer fez Blackjack! Você perdeu.');
        loseGame();
        setGameState('game_over');
      }
    }
  };

  const hit = () => {
    if (gameState !== 'playing') return;

    const { card, newDeck } = dealCard(deck);
    const newPlayerCards = [...playerCards, card];
    const newScore = calculateScore(newPlayerCards);

    setDeck(newDeck);
    setPlayerCards(newPlayerCards);
    setPlayerScore(newScore);

    if (newScore > 21) {
      setGameResult('💥 Estourou! Você perdeu.');
      loseGame();
      setGameState('game_over');
    }
  };

  const stand = () => {
    if (gameState !== 'playing') return;

    setGameState('dealer_turn');
    setDealerHiddenCard(false);
    
    let currentDealerCards = [...dealerCards];
    let currentDeck = [...deck];
    let dealerCurrentScore = calculateScore(currentDealerCards);
    setDealerScore(dealerCurrentScore);

    // Dealer hits on 16, stands on 17
    const dealerPlay = () => {
      if (dealerCurrentScore < 17) {
        setTimeout(() => {
          const { card, newDeck } = dealCard(currentDeck);
          currentDealerCards = [...currentDealerCards, card];
          currentDeck = newDeck;
          dealerCurrentScore = calculateScore(currentDealerCards);
          
          setDealerCards([...currentDealerCards]);
          setDealerScore(dealerCurrentScore);
          setDeck([...currentDeck]);
          
          if (dealerCurrentScore > 21) {
            setGameResult('🎉 Dealer estourou! Você ganhou!');
            winAmount(betAmount * 2);
            setGameState('game_over');
          } else if (dealerCurrentScore < 17) {
            dealerPlay();
          } else {
            // Final comparison
            if (playerScore > dealerCurrentScore) {
              setGameResult('🎉 Você ganhou!');
              winAmount(betAmount * 2);
            } else if (playerScore < dealerCurrentScore) {
              setGameResult('😞 Dealer ganhou!');
              loseGame();
            } else {
              setGameResult('🤝 Empate!');
              winAmount(betAmount); // Return bet
            }
            setGameState('game_over');
          }
        }, 1000);
      }
    };

    dealerPlay();
  };

  const adjustBet = (change) => {
    const newBet = betAmount + change;
    if (newBet >= 25 && newBet <= Math.min(1000, credits)) {
      setBetAmount(newBet);
    }
  };

  const resetGame = () => {
    setGameState('betting');
    setPlayerCards([]);
    setDealerCards([]);
    setPlayerScore(0);
    setDealerScore(0);
    setGameResult('');
    setDealerHiddenCard(true);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-green-800 to-green-700">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-20 w-32 h-32 bg-red-500 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-yellow-400 rounded-full blur-2xl animate-bounce" />
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <Button
            onClick={() => navigate('/')}
            className="mb-4 bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-500 hover:to-gray-700"
          >
            ← Voltar ao Cassino
          </Button>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-red-400 to-yellow-500 bg-clip-text text-transparent mb-2">
            ♠️ BLACKJACK ♠️
          </h1>
          <p className="text-xl text-white/90">Chegue o mais próximo de 21!</p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Game Table */}
            <div className="lg:col-span-3">
              <Card className="bg-green-800 border-4 border-yellow-400 shadow-2xl">
                <CardContent className="p-8">
                  
                  {/* Dealer Section */}
                  <div className="mb-8">
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-bold text-white">🎩 DEALER</h3>
                      <p className="text-yellow-400 font-bold text-lg">
                        Pontos: {gameState === 'betting' ? '-' : dealerScore}
                      </p>
                    </div>
                    <div className="flex justify-center space-x-2 min-h-[120px]">
                      {dealerCards.map((card, index) => (
                        <div
                          key={index}
                          className="w-20 h-28 bg-white rounded-lg flex items-center justify-center text-2xl font-bold border-2 border-gray-300 shadow-lg"
                        >
                          {index === 1 && dealerHiddenCard ? '🂠' : card}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Player Section */}
                  <div>
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-bold text-white">👤 VOCÊ</h3>
                      <p className="text-yellow-400 font-bold text-lg">
                        Pontos: {gameState === 'betting' ? '-' : playerScore}
                      </p>
                    </div>
                    <div className="flex justify-center space-x-2 min-h-[120px]">
                      {playerCards.map((card, index) => (
                        <div
                          key={index}
                          className="w-20 h-28 bg-white rounded-lg flex items-center justify-center text-2xl font-bold border-2 border-gray-300 shadow-lg"
                        >
                          {card}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Game Result */}
                  {gameResult && (
                    <div className="text-center mt-6">
                      <div className="bg-black/50 rounded-lg p-4">
                        <p className="text-2xl font-bold text-white">{gameResult}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Controls Panel */}
            <div className="space-y-6">
              
              {/* Betting */}
              {gameState === 'betting' && (
                <Card className="bg-gradient-to-br from-blue-900 to-blue-800 border-2 border-blue-500">
                  <CardHeader>
                    <CardTitle className="text-blue-300 text-center">💰 APOSTAR</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-yellow-400 font-bold text-xl mb-2">
                        {betAmount.toLocaleString('pt-BR')} créditos
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          onClick={() => adjustBet(-25)}
                          disabled={betAmount <= 25}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          -25
                        </Button>
                        <Button
                          onClick={() => adjustBet(25)}
                          disabled={betAmount + 25 > Math.min(1000, credits)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          +25
                        </Button>
                        <Button
                          onClick={() => adjustBet(-100)}
                          disabled={betAmount <= 100}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          -100
                        </Button>
                        <Button
                          onClick={() => adjustBet(100)}
                          disabled={betAmount + 100 > Math.min(1000, credits)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          +100
                        </Button>
                      </div>
                    </div>
                    <Button
                      onClick={startNewGame}
                      disabled={credits < betAmount}
                      className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-black font-bold text-lg"
                    >
                      🎴 COMEÇAR JOGO
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Game Actions */}
              {gameState === 'playing' && (
                <Card className="bg-gradient-to-br from-red-900 to-red-800 border-2 border-red-500">
                  <CardHeader>
                    <CardTitle className="text-red-300 text-center">🎯 AÇÕES</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      onClick={hit}
                      className="w-full py-3 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-400 hover:to-green-600 text-white font-bold"
                    >
                      🃏 PEDIR CARTA
                    </Button>
                    <Button
                      onClick={stand}
                      className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 text-white font-bold"
                    >
                      ✋ PARAR
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* New Game */}
              {gameState === 'game_over' && (
                <Card className="bg-gradient-to-br from-purple-900 to-purple-800 border-2 border-purple-500">
                  <CardHeader>
                    <CardTitle className="text-purple-300 text-center">🔄 NOVO JOGO</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={resetGame}
                      className="w-full py-3 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-400 hover:to-purple-600 text-white font-bold"
                    >
                      🆕 JOGAR NOVAMENTE
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Rules */}
              <Card className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-gray-300 text-center">📖 REGRAS</CardTitle>
                </CardHeader>
                <CardContent className="text-white text-sm space-y-2">
                  <p>• Chegue o mais próximo de 21</p>
                  <p>• Ás vale 11 ou 1</p>
                  <p>• Figuras valem 10</p>
                  <p>• Dealer para em 17</p>
                  <p>• Blackjack paga 3:2</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blackjack;