import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useGame } from '../contexts/GameContext';
import { slotSymbols, slotPayouts } from '../mock';

const SlotMachine = () => {
  const navigate = useNavigate();
  const { credits, placeBet, winAmount, loseGame, playGame } = useGame();
  
  const [reels, setReels] = useState(['🍒', '🍒', '🍒']);
  const [isSpinning, setIsSpinning] = useState(false);
  const [betAmount, setBetAmount] = useState(50);
  const [lastWin, setLastWin] = useState(0);
  const [winMessage, setWinMessage] = useState('');
  const [spinCount, setSpinCount] = useState(0);

  const spin = async () => {
    if (isSpinning || credits < betAmount) return;
    
    if (!placeBet(betAmount)) {
      alert('Créditos insuficientes!');
      return;
    }

    setIsSpinning(true);
    setLastWin(0);
    setWinMessage('');
    playGame('slot-machine');
    setSpinCount(prev => prev + 1);

    // Simulate spinning animation
    const spinDuration = 2000;
    const spinInterval = 100;
    let spinTime = 0;

    const spinAnimation = setInterval(() => {
      setReels([
        slotSymbols[Math.floor(Math.random() * slotSymbols.length)].symbol,
        slotSymbols[Math.floor(Math.random() * slotSymbols.length)].symbol,
        slotSymbols[Math.floor(Math.random() * slotSymbols.length)].symbol
      ]);
      
      spinTime += spinInterval;
      
      if (spinTime >= spinDuration) {
        clearInterval(spinAnimation);
        
        // Final result
        const finalReels = [
          slotSymbols[Math.floor(Math.random() * slotSymbols.length)].symbol,
          slotSymbols[Math.floor(Math.random() * slotSymbols.length)].symbol,
          slotSymbols[Math.floor(Math.random() * slotSymbols.length)].symbol
        ];
        
        setReels(finalReels);
        checkWin(finalReels);
        setIsSpinning(false);
      }
    }, spinInterval);
  };

  const checkWin = (finalReels) => {
    const [reel1, reel2, reel3] = finalReels;
    
    // Three of a kind
    if (reel1 === reel2 && reel2 === reel3) {
      const multiplier = slotPayouts.three_of_a_kind[reel1] || 0;
      const winnings = betAmount * multiplier;
      setLastWin(winnings);
      setWinMessage(`🎉 TRÊS IGUAIS! ${reel1} ${reel1} ${reel1} - Você ganhou ${winnings.toLocaleString('pt-BR')} créditos!`);
      winAmount(winnings);
      return;
    }
    
    // Two of a kind
    if (reel1 === reel2 || reel2 === reel3 || reel1 === reel3) {
      const matchingSymbol = reel1 === reel2 ? reel1 : (reel2 === reel3 ? reel2 : reel1);
      const multiplier = slotPayouts.two_of_a_kind[matchingSymbol] || 0;
      const winnings = betAmount * multiplier;
      setLastWin(winnings);
      setWinMessage(`🎊 DOIS IGUAIS! Você ganhou ${winnings.toLocaleString('pt-BR')} créditos!`);
      winAmount(winnings);
      return;
    }
    
    // No win
    setWinMessage('😞 Não foi dessa vez! Tente novamente.');
    loseGame();
  };

  const adjustBet = (change) => {
    const newBet = betAmount + change;
    if (newBet >= 10 && newBet <= Math.min(500, credits)) {
      setBetAmount(newBet);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-20 w-40 h-40 bg-yellow-400 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-pink-500 rounded-full blur-2xl animate-bounce" />
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Button
            onClick={() => navigate('/')}
            className="mb-4 bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-500 hover:to-gray-700"
          >
            ← Voltar ao Cassino
          </Button>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent mb-2">
            🎰 SLOT MACHINE 🎰
          </h1>
          <p className="text-xl text-white/90">O jogo mais emocionante do cassino!</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Slot Machine */}
            <div className="lg:col-span-2">
              <Card className="bg-gradient-to-br from-yellow-600 via-yellow-700 to-yellow-800 border-4 border-yellow-400 shadow-2xl">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-black font-bold">
                    💎 JACKPOT SLOTS 💎
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Reels Display */}
                  <div className="bg-black rounded-xl p-8 mb-6">
                    <div className="flex justify-center items-center space-x-4">
                      {reels.map((symbol, index) => (
                        <div
                          key={index}
                          className={`w-24 h-24 bg-white rounded-lg flex items-center justify-center text-4xl border-4 border-yellow-400 ${
                            isSpinning ? 'animate-spin' : 'animate-bounce'
                          }`}
                          style={{ animationDelay: `${index * 0.2}s` }}
                        >
                          {symbol}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Win Message */}
                  {winMessage && (
                    <div className={`text-center p-4 rounded-lg mb-4 ${
                      lastWin > 0 
                        ? 'bg-green-900/50 text-green-300 border-2 border-green-500' 
                        : 'bg-red-900/50 text-red-300 border-2 border-red-500'
                    }`}>
                      <p className="font-bold text-lg">{winMessage}</p>
                    </div>
                  )}

                  {/* Controls */}
                  <div className="space-y-4">
                    {/* Bet Amount */}
                    <div className="bg-black/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-bold">Aposta:</span>
                        <span className="text-yellow-400 font-bold text-xl">
                          {betAmount.toLocaleString('pt-BR')} créditos
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => adjustBet(-10)}
                          disabled={betAmount <= 10}
                          className="bg-red-600 hover:bg-red-700 text-white flex-1"
                        >
                          -10
                        </Button>
                        <Button
                          onClick={() => adjustBet(-50)}
                          disabled={betAmount <= 50}
                          className="bg-red-600 hover:bg-red-700 text-white flex-1"
                        >
                          -50
                        </Button>
                        <Button
                          onClick={() => adjustBet(50)}
                          disabled={betAmount + 50 > Math.min(500, credits)}
                          className="bg-green-600 hover:bg-green-700 text-white flex-1"
                        >
                          +50
                        </Button>
                        <Button
                          onClick={() => adjustBet(100)}
                          disabled={betAmount + 100 > Math.min(500, credits)}
                          className="bg-green-600 hover:bg-green-700 text-white flex-1"
                        >
                          +100
                        </Button>
                      </div>
                    </div>

                    {/* Spin Button */}
                    <Button
                      onClick={spin}
                      disabled={isSpinning || credits < betAmount}
                      className="w-full py-6 text-2xl font-bold bg-gradient-to-r from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 disabled:from-gray-500 disabled:to-gray-700"
                    >
                      {isSpinning ? '🎰 GIRANDO...' : '🎰 GIRAR AGORA!'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Side Panel */}
            <div className="space-y-6">
              
              {/* Stats */}
              <Card className="bg-gradient-to-br from-gray-900 to-black border-2 border-red-600">
                <CardHeader>
                  <CardTitle className="text-red-400 text-center">📊 ESTATÍSTICAS</CardTitle>
                </CardHeader>
                <CardContent className="text-white space-y-3">
                  <div className="flex justify-between">
                    <span>Giros:</span>
                    <span className="text-yellow-400 font-bold">{spinCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Última Vitória:</span>
                    <span className={`font-bold ${lastWin > 0 ? 'text-green-400' : 'text-gray-400'}`}>
                      {lastWin.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Aposta Atual:</span>
                    <span className="text-blue-400 font-bold">{betAmount.toLocaleString('pt-BR')}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Paytable */}
              <Card className="bg-gradient-to-br from-green-900 to-green-800 border-2 border-green-500">
                <CardHeader>
                  <CardTitle className="text-green-300 text-center">💰 TABELA DE PRÊMIOS</CardTitle>
                </CardHeader>
                <CardContent className="text-white space-y-2">
                  <div className="text-sm">
                    <div className="font-bold text-yellow-400 mb-2">TRÊS IGUAIS:</div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>🍒🍒🍒</span>
                        <span>x20</span>
                      </div>
                      <div className="flex justify-between">
                        <span>🔔🔔🔔</span>
                        <span>x80</span>
                      </div>
                      <div className="flex justify-between">
                        <span>💎💎💎</span>
                        <span>x150</span>
                      </div>
                      <div className="flex justify-between">
                        <span>7️⃣7️⃣7️⃣</span>
                        <span>x250</span>
                      </div>
                      <div className="flex justify-between">
                        <span>💰💰💰</span>
                        <span className="text-yellow-400 font-bold">x1000</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlotMachine;