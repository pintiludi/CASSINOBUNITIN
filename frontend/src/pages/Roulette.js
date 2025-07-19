import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useGame } from '../contexts/GameContext';
import { rouletteNumbers } from '../mock';

const Roulette = () => {
  const navigate = useNavigate();
  const { credits, placeBet, winAmount, loseGame, playGame } = useGame();
  
  const [betAmount, setBetAmount] = useState(50);
  const [selectedBets, setSelectedBets] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastWinningNumber, setLastWinningNumber] = useState(null);
  const [gameResult, setGameResult] = useState('');
  const [wheelRotation, setWheelRotation] = useState(0);

  const betTypes = [
    { type: 'red', label: 'Vermelho', payout: 2, color: 'bg-red-600' },
    { type: 'black', label: 'Preto', payout: 2, color: 'bg-black' },
    { type: 'even', label: 'Par', payout: 2, color: 'bg-blue-600' },
    { type: 'odd', label: 'Ímpar', payout: 2, color: 'bg-purple-600' },
    { type: 'low', label: '1-18', payout: 2, color: 'bg-green-600' },
    { type: 'high', label: '19-36', payout: 2, color: 'bg-orange-600' },
  ];

  const placeBetOnType = (betType) => {
    const existingBet = selectedBets.find(bet => bet.type === betType.type);
    if (existingBet) {
      // Increase existing bet
      setSelectedBets(selectedBets.map(bet => 
        bet.type === betType.type 
          ? { ...bet, amount: bet.amount + betAmount }
          : bet
      ));
    } else {
      // Add new bet
      setSelectedBets([...selectedBets, { ...betType, amount: betAmount }]);
    }
  };

  const placeBetOnNumber = (number) => {
    const existingBet = selectedBets.find(bet => bet.number === number);
    if (existingBet) {
      setSelectedBets(selectedBets.map(bet => 
        bet.number === number 
          ? { ...bet, amount: bet.amount + betAmount }
          : bet
      ));
    } else {
      setSelectedBets([...selectedBets, { 
        type: 'number', 
        number: number, 
        amount: betAmount, 
        payout: 36,
        label: `Número ${number}`
      }]);
    }
  };

  const clearBets = () => {
    setSelectedBets([]);
  };

  const getTotalBetAmount = () => {
    return selectedBets.reduce((total, bet) => total + bet.amount, 0);
  };

  const spin = async () => {
    const totalBet = getTotalBetAmount();
    if (totalBet === 0) {
      alert('Faça pelo menos uma aposta!');
      return;
    }

    if (credits < totalBet) {
      alert('Créditos insuficientes!');
      return;
    }

    // Place all bets
    if (!placeBet(totalBet)) return;

    setIsSpinning(true);
    setGameResult('');
    playGame('roulette');

    // Animate wheel spinning
    const spins = 5 + Math.random() * 5; // 5-10 full rotations
    const finalRotation = wheelRotation + (spins * 360);
    setWheelRotation(finalRotation);

    setTimeout(() => {
      // Determine winning number
      const winningNumber = rouletteNumbers[Math.floor(Math.random() * rouletteNumbers.length)];
      setLastWinningNumber(winningNumber);
      
      // Calculate winnings
      let totalWinnings = 0;
      let winningBets = [];

      selectedBets.forEach(bet => {
        let isWinner = false;
        
        if (bet.type === 'number' && bet.number === winningNumber.number) {
          isWinner = true;
        } else if (bet.type === 'red' && winningNumber.color === 'red') {
          isWinner = true;
        } else if (bet.type === 'black' && winningNumber.color === 'black') {
          isWinner = true;
        } else if (bet.type === 'even' && winningNumber.number !== 0 && winningNumber.number % 2 === 0) {
          isWinner = true;
        } else if (bet.type === 'odd' && winningNumber.number % 2 === 1) {
          isWinner = true;
        } else if (bet.type === 'low' && winningNumber.number >= 1 && winningNumber.number <= 18) {
          isWinner = true;
        } else if (bet.type === 'high' && winningNumber.number >= 19 && winningNumber.number <= 36) {
          isWinner = true;
        }

        if (isWinner) {
          const winAmount = bet.amount * bet.payout;
          totalWinnings += winAmount;
          winningBets.push({ ...bet, winAmount });
        }
      });

      if (totalWinnings > 0) {
        winAmount(totalWinnings);
        setGameResult(
          `🎉 Número ${winningNumber.number} (${winningNumber.color === 'green' ? 'Verde' : winningNumber.color === 'red' ? 'Vermelho' : 'Preto'})! ` +
          `Você ganhou ${totalWinnings.toLocaleString('pt-BR')} créditos!`
        );
      } else {
        loseGame();
        setGameResult(
          `😞 Número ${winningNumber.number} (${winningNumber.color === 'green' ? 'Verde' : winningNumber.color === 'red' ? 'Vermelho' : 'Preto'}). ` +
          `Não foi dessa vez!`
        );
      }

      setIsSpinning(false);
      setSelectedBets([]);
    }, 3000);
  };

  const adjustBet = (change) => {
    const newBet = betAmount + change;
    if (newBet >= 5 && newBet <= Math.min(2000, credits)) {
      setBetAmount(newBet);
    }
  };

  const getNumberColor = (number) => {
    const rouletteNumber = rouletteNumbers.find(n => n.number === number);
    if (!rouletteNumber) return 'bg-green-600';
    return rouletteNumber.color === 'red' ? 'bg-red-600' : 
           rouletteNumber.color === 'black' ? 'bg-black' : 'bg-green-600';
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-black to-green-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-20 w-40 h-40 bg-yellow-400 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-20 w-32 h-32 bg-red-500 rounded-full blur-2xl animate-bounce" />
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
          <h1 className="text-5xl font-bold bg-gradient-to-r from-red-400 to-green-400 bg-clip-text text-transparent mb-2">
            🎲 ROLETA 🎲
          </h1>
          <p className="text-xl text-white/90">Aposte sua sorte na roda da fortuna!</p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Roulette Wheel */}
            <div className="lg:col-span-2">
              <Card className="bg-gradient-to-br from-green-800 to-green-900 border-4 border-yellow-400 shadow-2xl">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-white font-bold">
                    🎯 RODA DA ROLETA 🎯
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  
                  {/* Wheel */}
                  <div className="relative mb-6">
                    <div 
                      className={`w-64 h-64 rounded-full bg-gradient-to-r from-red-600 via-black to-green-600 border-8 border-yellow-400 ${
                        isSpinning ? 'animate-spin' : ''
                      }`}
                      style={{ 
                        transform: `rotate(${wheelRotation}deg)`,
                        transition: isSpinning ? 'transform 3s cubic-bezier(0.23, 1, 0.320, 1)' : 'none'
                      }}
                    >
                      <div className="absolute inset-4 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center">
                        <div className="text-4xl font-bold text-black">
                          {lastWinningNumber ? lastWinningNumber.number : '🎲'}
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                      <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-yellow-400"></div>
                    </div>
                  </div>

                  {/* Last Result */}
                  {lastWinningNumber && (
                    <div className="text-center mb-4">
                      <div className="text-white font-bold text-lg mb-2">Último Número:</div>
                      <div className={`inline-block px-6 py-3 rounded-full text-white font-bold text-xl ${getNumberColor(lastWinningNumber.number)}`}>
                        {lastWinningNumber.number}
                      </div>
                    </div>
                  )}

                  {/* Game Result */}
                  {gameResult && (
                    <div className="bg-black/50 rounded-lg p-4 max-w-md">
                      <p className="text-white font-bold text-center">{gameResult}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Betting Panel */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Bet Amount */}
              <Card className="bg-gradient-to-br from-blue-900 to-blue-800 border-2 border-blue-500">
                <CardHeader>
                  <CardTitle className="text-blue-300 text-center">💰 VALOR DA APOSTA</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div className="text-yellow-400 font-bold text-xl mb-2">
                      {betAmount.toLocaleString('pt-BR')} créditos
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      <Button
                        onClick={() => adjustBet(-5)}
                        disabled={betAmount <= 5}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        -5
                      </Button>
                      <Button
                        onClick={() => adjustBet(-25)}
                        disabled={betAmount <= 25}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        -25
                      </Button>
                      <Button
                        onClick={() => adjustBet(25)}
                        disabled={betAmount + 25 > Math.min(2000, credits)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        +25
                      </Button>
                      <Button
                        onClick={() => adjustBet(100)}
                        disabled={betAmount + 100 > Math.min(2000, credits)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        +100
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Outside Bets */}
              <Card className="bg-gradient-to-br from-purple-900 to-purple-800 border-2 border-purple-500">
                <CardHeader>
                  <CardTitle className="text-purple-300 text-center">🎯 APOSTAS SIMPLES</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {betTypes.map((betType) => (
                      <Button
                        key={betType.type}
                        onClick={() => placeBetOnType(betType)}
                        disabled={isSpinning}
                        className={`${betType.color} hover:opacity-80 text-white font-bold py-2 px-3 text-sm`}
                      >
                        {betType.label}
                        <br />
                        <span className="text-xs">Paga {betType.payout}:1</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Number Bets */}
              <Card className="bg-gradient-to-br from-green-900 to-green-800 border-2 border-green-500">
                <CardHeader>
                  <CardTitle className="text-green-300 text-center">🔢 NÚMEROS (Paga 36:1)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-6 gap-1 max-h-48 overflow-y-auto">
                    {rouletteNumbers.map((rouletteNumber) => (
                      <Button
                        key={rouletteNumber.number}
                        onClick={() => placeBetOnNumber(rouletteNumber.number)}
                        disabled={isSpinning}
                        className={`${getNumberColor(rouletteNumber.number)} hover:opacity-80 text-white font-bold text-xs p-2 h-8`}
                      >
                        {rouletteNumber.number}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Current Bets & Controls */}
              <Card className="bg-gradient-to-br from-yellow-900 to-yellow-800 border-2 border-yellow-500">
                <CardHeader>
                  <CardTitle className="text-yellow-300 text-center">🎫 SUAS APOSTAS</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedBets.length > 0 ? (
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {selectedBets.map((bet, index) => (
                        <div key={index} className="flex justify-between text-white text-sm bg-black/20 rounded p-2">
                          <span>{bet.label}</span>
                          <span className="text-yellow-400 font-bold">{bet.amount.toLocaleString('pt-BR')}</span>
                        </div>
                      ))}
                      <div className="border-t pt-2 flex justify-between text-white font-bold">
                        <span>Total:</span>
                        <span className="text-yellow-400">{getTotalBetAmount().toLocaleString('pt-BR')}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-white">Nenhuma aposta feita</p>
                  )}
                  
                  <div className="space-y-2">
                    <Button
                      onClick={spin}
                      disabled={isSpinning || selectedBets.length === 0}
                      className="w-full py-3 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 text-white font-bold text-lg"
                    >
                      {isSpinning ? '🎲 GIRANDO...' : '🎲 GIRAR ROLETA!'}
                    </Button>
                    <Button
                      onClick={clearBets}
                      disabled={isSpinning || selectedBets.length === 0}
                      className="w-full bg-gray-600 hover:bg-gray-700 text-white"
                    >
                      🗑️ Limpar Apostas
                    </Button>
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

export default Roulette;