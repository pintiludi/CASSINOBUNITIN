import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useGame } from '../contexts/GameContext';
import { blackjackCards } from '../mock';

const Poker = () => {
  const navigate = useNavigate();
  const { credits, placeBet, winAmount, loseGame, playGame } = useGame();
  
  const [hand, setHand] = useState([]);
  const [heldCards, setHeldCards] = useState([]);
  const [gameState, setGameState] = useState('betting'); // betting, first_deal, holding, second_deal, game_over
  const [betAmount, setBetAmount] = useState(100);
  const [gameResult, setGameResult] = useState('');
  const [handRank, setHandRank] = useState('');

  const createShuffledDeck = () => {
    const deck = [...blackjackCards];
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  };

  const getCardValue = (card) => {
    const value = card.slice(0, -1);
    if (value === 'A') return 14;
    if (value === 'K') return 13;
    if (value === 'Q') return 12;
    if (value === 'J') return 11;
    return parseInt(value);
  };

  const getCardSuit = (card) => {
    return card.slice(-1);
  };

  const analyzeHand = (cards) => {
    const values = cards.map(getCardValue).sort((a, b) => a - b);
    const suits = cards.map(getCardSuit);
    
    const valueCounts = {};
    values.forEach(value => {
      valueCounts[value] = (valueCounts[value] || 0) + 1;
    });
    
    const counts = Object.values(valueCounts).sort((a, b) => b - a);
    const isFlush = suits.every(suit => suit === suits[0]);
    const isConsecutive = values.every((value, index) => index === 0 || value === values[index - 1] + 1);
    
    // Special case for A-2-3-4-5 straight
    const isLowStraight = values.join(',') === '2,3,4,5,14';
    const isStraight = isConsecutive || isLowStraight;
    
    if (isFlush && isStraight && values[4] === 14) {
      return { rank: 'Royal Flush', payout: 800 };
    }
    if (isFlush && isStraight) {
      return { rank: 'Straight Flush', payout: 50 };
    }
    if (counts[0] === 4) {
      return { rank: 'Quadra', payout: 25 };
    }
    if (counts[0] === 3 && counts[1] === 2) {
      return { rank: 'Full House', payout: 9 };
    }
    if (isFlush) {
      return { rank: 'Flush', payout: 6 };
    }
    if (isStraight) {
      return { rank: 'Sequência', payout: 4 };
    }
    if (counts[0] === 3) {
      return { rank: 'Trinca', payout: 3 };
    }
    if (counts[0] === 2 && counts[1] === 2) {
      return { rank: 'Dois Pares', payout: 2 };
    }
    if (counts[0] === 2) {
      // Check if it's Jacks or Better
      const pairValue = Object.keys(valueCounts).find(key => valueCounts[key] === 2);
      if (parseInt(pairValue) >= 11) {
        return { rank: 'Par de Valetes ou Melhor', payout: 1 };
      }
    }
    
    return { rank: 'Carta Alta', payout: 0 };
  };

  const dealInitialHand = () => {
    if (!placeBet(betAmount)) {
      alert('Créditos insuficientes!');
      return;
    }

    const deck = createShuffledDeck();
    const newHand = deck.slice(0, 5);
    setHand(newHand);
    setHeldCards(new Array(5).fill(false));
    setGameState('first_deal');
    setGameResult('');
    setHandRank('');
    playGame('poker');
  };

  const toggleHoldCard = (index) => {
    if (gameState !== 'first_deal') return;
    
    const newHeldCards = [...heldCards];
    newHeldCards[index] = !newHeldCards[index];
    setHeldCards(newHeldCards);
  };

  const drawCards = () => {
    if (gameState !== 'first_deal') return;

    const deck = createShuffledDeck();
    let deckIndex = 0;
    const newHand = hand.map((card, index) => {
      if (heldCards[index]) {
        return card; // Keep held cards
      } else {
        // Replace with new card
        while (hand.includes(deck[deckIndex])) {
          deckIndex++;
        }
        return deck[deckIndex++];
      }
    });

    setHand(newHand);
    setGameState('game_over');
    
    // Analyze final hand
    const analysis = analyzeHand(newHand);
    setHandRank(analysis.rank);
    
    if (analysis.payout > 0) {
      const winnings = betAmount * analysis.payout;
      setGameResult(`🎉 ${analysis.rank}! Você ganhou ${winnings.toLocaleString('pt-BR')} créditos!`);
      winAmount(winnings);
    } else {
      setGameResult(`😞 ${analysis.rank}. Não foi dessa vez!`);
      loseGame();
    }
  };

  const newGame = () => {
    setGameState('betting');
    setHand([]);
    setHeldCards([]);
    setGameResult('');
    setHandRank('');
  };

  const adjustBet = (change) => {
    const newBet = betAmount + change;
    if (newBet >= 20 && newBet <= Math.min(800, credits)) {
      setBetAmount(newBet);
    }
  };

  const payoutTable = [
    { hand: 'Royal Flush', payout: 800 },
    { hand: 'Straight Flush', payout: 50 },
    { hand: 'Quadra', payout: 25 },
    { hand: 'Full House', payout: 9 },
    { hand: 'Flush', payout: 6 },
    { hand: 'Sequência', payout: 4 },
    { hand: 'Trinca', payout: 3 },
    { hand: 'Dois Pares', payout: 2 },
    { hand: 'Par J/Q/K/A', payout: 1 },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-20 w-32 h-32 bg-pink-500 rounded-full blur-3xl animate-pulse" />
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
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
            ♥️ VIDEO POKER ♥️
          </h1>
          <p className="text-xl text-white/90">Forme a melhor mão possível!</p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Game Area */}
            <div className="lg:col-span-2">
              <Card className="bg-gradient-to-br from-green-800 to-green-900 border-4 border-yellow-400 shadow-2xl">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-white font-bold">
                    🃏 MESA DE POKER 🃏
                  </CardTitle>
                  {handRank && (
                    <p className="text-yellow-400 font-bold text-lg">{handRank}</p>
                  )}
                </CardHeader>
                <CardContent>
                  
                  {/* Cards */}
                  <div className="flex justify-center space-x-4 mb-6">
                    {hand.length > 0 ? (
                      hand.map((card, index) => (
                        <div key={index} className="text-center">
                          <div
                            className={`w-20 h-28 bg-white rounded-lg flex items-center justify-center text-lg font-bold border-4 cursor-pointer transition-all ${
                              heldCards[index] 
                                ? 'border-yellow-400 bg-yellow-100 transform -translate-y-2' 
                                : 'border-gray-300 hover:border-blue-400'
                            }`}
                            onClick={() => toggleHoldCard(index)}
                          >
                            {card}
                          </div>
                          {gameState === 'first_deal' && (
                            <div className="mt-1">
                              {heldCards[index] ? (
                                <span className="text-yellow-400 text-xs font-bold">SEGURA</span>
                              ) : (
                                <span className="text-gray-400 text-xs">Clique para segurar</span>
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="flex space-x-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="w-20 h-28 bg-blue-800 rounded-lg border-4 border-blue-600 flex items-center justify-center">
                            <span className="text-4xl">🂠</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Game Result */}
                  {gameResult && (
                    <div className="text-center mb-4">
                      <div className="bg-black/50 rounded-lg p-4">
                        <p className="text-white font-bold text-lg">{gameResult}</p>
                      </div>
                    </div>
                  )}

                  {/* Game Controls */}
                  <div className="space-y-4">
                    {gameState === 'betting' && (
                      <div className="space-y-4">
                        <div className="bg-black/30 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-bold">Aposta:</span>
                            <span className="text-yellow-400 font-bold text-xl">
                              {betAmount.toLocaleString('pt-BR')} créditos
                            </span>
                          </div>
                          <div className="grid grid-cols-4 gap-2">
                            <Button
                              onClick={() => adjustBet(-20)}
                              disabled={betAmount <= 20}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              -20
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
                              disabled={betAmount + 100 > Math.min(800, credits)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              +100
                            </Button>
                            <Button
                              onClick={() => adjustBet(200)}
                              disabled={betAmount + 200 > Math.min(800, credits)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              +200
                            </Button>
                          </div>
                        </div>
                        <Button
                          onClick={dealInitialHand}
                          disabled={credits < betAmount}
                          className="w-full py-4 text-xl font-bold bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-400 hover:to-purple-600"
                        >
                          🎴 COMEÇAR JOGO
                        </Button>
                      </div>
                    )}

                    {gameState === 'first_deal' && (
                      <Button
                        onClick={drawCards}
                        className="w-full py-4 text-xl font-bold bg-gradient-to-r from-green-500 to-green-700 hover:from-green-400 hover:to-green-600"
                      >
                        🔄 TROCAR CARTAS
                      </Button>
                    )}

                    {gameState === 'game_over' && (
                      <Button
                        onClick={newGame}
                        className="w-full py-4 text-xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600"
                      >
                        🆕 NOVO JOGO
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Side Panel */}
            <div className="space-y-6">
              
              {/* Payout Table */}
              <Card className="bg-gradient-to-br from-yellow-900 to-yellow-800 border-2 border-yellow-500">
                <CardHeader>
                  <CardTitle className="text-yellow-300 text-center">💰 TABELA DE PAGAMENTOS</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {payoutTable.map((item, index) => (
                      <div key={index} className="flex justify-between text-white">
                        <span className={handRank === item.hand ? 'text-yellow-400 font-bold' : ''}>
                          {item.hand}
                        </span>
                        <span className={handRank === item.hand ? 'text-yellow-400 font-bold' : ''}>
                          {item.payout}:1
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-yellow-600">
                    <div className="text-center">
                      <div className="text-yellow-400 font-bold text-lg">
                        Aposta Atual: {betAmount.toLocaleString('pt-BR')}
                      </div>
                      <div className="text-xs text-white mt-1">
                        Ganho máximo: {(betAmount * 800).toLocaleString('pt-BR')}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Instructions */}
              <Card className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-gray-300 text-center">📖 COMO JOGAR</CardTitle>
                </CardHeader>
                <CardContent className="text-white text-sm space-y-2">
                  <p>1. Faça sua aposta</p>
                  <p>2. Receba 5 cartas</p>
                  <p>3. Escolha quais segurar</p>
                  <p>4. Troque as outras cartas</p>
                  <p>5. Ganhe com par de valetes ou melhor!</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Poker;