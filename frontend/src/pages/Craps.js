import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useGame } from '../contexts/GameContext';

const Craps = () => {
  const navigate = useNavigate();
  const { credits, placeBet, winAmount, loseGame, playGame } = useGame();
  
  const [dice1, setDice1] = useState(1);
  const [dice2, setDice2] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [gamePhase, setGamePhase] = useState('come_out'); // come_out, point
  const [point, setPoint] = useState(null);
  const [selectedBets, setSelectedBets] = useState([]);
  const [betAmount, setBetAmount] = useState(50);
  const [gameResult, setGameResult] = useState('');
  const [rollHistory, setRollHistory] = useState([]);

  const betTypes = [
    { type: 'pass_line', label: 'Pass Line', payout: 1, color: 'bg-green-600' },
    { type: 'dont_pass', label: "Don't Pass", payout: 1, color: 'bg-red-600' },
    { type: 'field', label: 'Field', payout: 1, color: 'bg-blue-600' },
    { type: 'any_seven', label: 'Any 7', payout: 4, color: 'bg-purple-600' },
    { type: 'hard_six', label: 'Hard 6', payout: 9, color: 'bg-orange-600' },
    { type: 'hard_eight', label: 'Hard 8', payout: 9, color: 'bg-pink-600' },
  ];

  const rollDice = () => {
    if (selectedBets.length === 0) {
      alert('Faça pelo menos uma aposta!');
      return;
    }

    const totalBet = selectedBets.reduce((sum, bet) => sum + bet.amount, 0);
    if (credits < totalBet) {
      alert('Créditos insuficientes!');
      return;
    }

    // Place bets
    if (!placeBet(totalBet)) return;

    setIsRolling(true);
    setGameResult('');
    playGame('craps');

    // Animate dice rolling
    let rollCount = 0;
    const rollInterval = setInterval(() => {
      setDice1(Math.floor(Math.random() * 6) + 1);
      setDice2(Math.floor(Math.random() * 6) + 1);
      rollCount++;
      
      if (rollCount > 10) {
        clearInterval(rollInterval);
        
        // Final roll
        const finalDice1 = Math.floor(Math.random() * 6) + 1;
        const finalDice2 = Math.floor(Math.random() * 6) + 1;
        const total = finalDice1 + finalDice2;
        
        setDice1(finalDice1);
        setDice2(finalDice2);
        setRollHistory(prev => [...prev, { dice1: finalDice1, dice2: finalDice2, total }].slice(-10));
        
        evaluateRoll(finalDice1, finalDice2, total);
        setIsRolling(false);
      }
    }, 100);
  };

  const evaluateRoll = (d1, d2, total) => {
    let totalWinnings = 0;
    const winningBets = [];
    const losingBets = [];

    selectedBets.forEach(bet => {
      let isWinner = false;
      let payout = bet.payout;

      switch (bet.type) {
        case 'pass_line':
          if (gamePhase === 'come_out') {
            if (total === 7 || total === 11) {
              isWinner = true;
            } else if (total === 2 || total === 3 || total === 12) {
              // Lose
            } else {
              // Point established
              setPoint(total);
              setGamePhase('point');
              return; // Don't resolve bet yet
            }
          } else if (gamePhase === 'point') {
            if (total === point) {
              isWinner = true;
              setGamePhase('come_out');
              setPoint(null);
            } else if (total === 7) {
              setGamePhase('come_out');
              setPoint(null);
            }
          }
          break;

        case 'dont_pass':
          if (gamePhase === 'come_out') {
            if (total === 2 || total === 3) {
              isWinner = true;
            } else if (total === 12) {
              // Push (tie)
              totalWinnings += bet.amount; // Return bet
              return;
            } else if (total === 7 || total === 11) {
              // Lose
            } else {
              // Point established
              return; // Don't resolve bet yet
            }
          } else if (gamePhase === 'point') {
            if (total === 7) {
              isWinner = true;
              setGamePhase('come_out');
              setPoint(null);
            } else if (total === point) {
              setGamePhase('come_out');
              setPoint(null);
            }
          }
          break;

        case 'field':
          if ([2, 3, 4, 9, 10, 11, 12].includes(total)) {
            isWinner = true;
            if (total === 2 || total === 12) payout = 2; // Field pays double on 2 and 12
          }
          break;

        case 'any_seven':
          if (total === 7) {
            isWinner = true;
          }
          break;

        case 'hard_six':
          if (total === 6 && d1 === 3 && d2 === 3) {
            isWinner = true;
          } else if (total === 6 || total === 7) {
            // Lose on easy 6 or any 7
          }
          break;

        case 'hard_eight':
          if (total === 8 && d1 === 4 && d2 === 4) {
            isWinner = true;
          } else if (total === 8 || total === 7) {
            // Lose on easy 8 or any 7
          }
          break;

        default:
          break;
      }

      if (isWinner) {
        const winnings = bet.amount * (payout + 1); // Include original bet
        totalWinnings += winnings;
        winningBets.push({ ...bet, winnings });
      } else {
        losingBets.push(bet);
      }
    });

    // Clear resolved bets (keep point bets during point phase)
    if (gamePhase === 'point' && (total !== 7 && total !== point)) {
      // Keep pass/don't pass bets during point phase
      setSelectedBets(selectedBets.filter(bet => 
        bet.type === 'pass_line' || bet.type === 'dont_pass'
      ));
    } else {
      setSelectedBets([]);
    }

    if (totalWinnings > 0) {
      winAmount(totalWinnings);
      setGameResult(
        `🎲 ${d1} + ${d2} = ${total}! ` +
        `Você ganhou ${totalWinnings.toLocaleString('pt-BR')} créditos!`
      );
    } else if (losingBets.length > 0) {
      loseGame();
      setGameResult(`🎲 ${d1} + ${d2} = ${total}. Não foi dessa vez!`);
    } else {
      setGameResult(`🎲 ${d1} + ${d2} = ${total}. ${point ? `Point: ${point}` : ''}`);
    }
  };

  const placeBetOnType = (betType) => {
    const existingBet = selectedBets.find(bet => bet.type === betType.type);
    if (existingBet) {
      setSelectedBets(selectedBets.map(bet => 
        bet.type === betType.type 
          ? { ...bet, amount: bet.amount + betAmount }
          : bet
      ));
    } else {
      setSelectedBets([...selectedBets, { ...betType, amount: betAmount }]);
    }
  };

  const clearBets = () => {
    setSelectedBets([]);
  };

  const adjustBet = (change) => {
    const newBet = betAmount + change;
    if (newBet >= 15 && newBet <= Math.min(1500, credits)) {
      setBetAmount(newBet);
    }
  };

  const getDiceEmoji = (value) => {
    const diceEmojis = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
    return diceEmojis[value - 1];
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-20 w-40 h-40 bg-blue-400 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-20 w-32 h-32 bg-green-500 rounded-full blur-2xl animate-bounce" />
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
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-2">
            🎯 DADOS (CRAPS) 🎯
          </h1>
          <p className="text-xl text-white/90">Role os dados e ganhe grande!</p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Dice Table */}
            <div className="lg:col-span-3">
              <Card className="bg-gradient-to-br from-green-800 to-green-900 border-4 border-yellow-400 shadow-2xl">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-white font-bold">
                    🎲 MESA DE DADOS 🎲
                  </CardTitle>
                  {point && (
                    <p className="text-yellow-400 font-bold text-lg">Point: {point}</p>
                  )}
                </CardHeader>
                <CardContent>
                  
                  {/* Dice Display */}
                  <div className="text-center mb-8">
                    <div className="flex justify-center items-center space-x-6 mb-4">
                      <div className={`w-24 h-24 bg-white rounded-xl flex items-center justify-center text-4xl border-4 border-red-500 shadow-2xl ${isRolling ? 'animate-bounce' : ''}`}>
                        {getDiceEmoji(dice1)}
                      </div>
                      <div className="text-4xl text-yellow-400 font-bold">+</div>
                      <div className={`w-24 h-24 bg-white rounded-xl flex items-center justify-center text-4xl border-4 border-red-500 shadow-2xl ${isRolling ? 'animate-bounce' : ''}`}>
                        {getDiceEmoji(dice2)}
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-yellow-400 mb-2">
                      Total: {dice1 + dice2}
                    </div>
                    <div className="text-lg text-white">
                      Fase: <span className="text-yellow-400 font-bold">
                        {gamePhase === 'come_out' ? 'Come Out' : `Point (${point})`}
                      </span>
                    </div>
                  </div>

                  {/* Game Result */}
                  {gameResult && (
                    <div className="text-center mb-6">
                      <div className="bg-black/50 rounded-lg p-4">
                        <p className="text-white font-bold text-lg">{gameResult}</p>
                      </div>
                    </div>
                  )}

                  {/* Roll Button */}
                  <div className="text-center mb-6">
                    <Button
                      onClick={rollDice}
                      disabled={isRolling || selectedBets.length === 0}
                      className="px-12 py-4 text-2xl font-bold bg-gradient-to-r from-red-500 to-red-700 hover:from-red-400 hover:to-red-600"
                    >
                      {isRolling ? '🎲 ROLANDO...' : '🎲 ROLAR DADOS!'}
                    </Button>
                  </div>

                  {/* Roll History */}
                  {rollHistory.length > 0 && (
                    <div className="text-center">
                      <h3 className="text-white font-bold mb-2">Últimos Resultados:</h3>
                      <div className="flex justify-center space-x-2 flex-wrap">
                        {rollHistory.slice(-5).map((roll, index) => (
                          <div key={index} className="bg-black/30 rounded-lg p-2 text-white text-sm">
                            {getDiceEmoji(roll.dice1)} {getDiceEmoji(roll.dice2)} = {roll.total}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Betting Panel */}
            <div className="space-y-6">
              
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
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={() => adjustBet(-15)}
                        disabled={betAmount <= 15}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        -15
                      </Button>
                      <Button
                        onClick={() => adjustBet(15)}
                        disabled={betAmount + 15 > Math.min(1500, credits)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        +15
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
                        disabled={betAmount + 100 > Math.min(1500, credits)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        +100
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Betting Options */}
              <Card className="bg-gradient-to-br from-purple-900 to-purple-800 border-2 border-purple-500">
                <CardHeader>
                  <CardTitle className="text-purple-300 text-center">🎯 TIPOS DE APOSTA</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {betTypes.map((betType) => (
                      <Button
                        key={betType.type}
                        onClick={() => placeBetOnType(betType)}
                        disabled={isRolling}
                        className={`w-full ${betType.color} hover:opacity-80 text-white font-bold py-2 text-sm`}
                      >
                        {betType.label}
                        <br />
                        <span className="text-xs">Paga {betType.payout}:1</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Current Bets */}
              <Card className="bg-gradient-to-br from-yellow-900 to-yellow-800 border-2 border-yellow-500">
                <CardHeader>
                  <CardTitle className="text-yellow-300 text-center">🎫 SUAS APOSTAS</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedBets.length > 0 ? (
                    <div className="space-y-2">
                      {selectedBets.map((bet, index) => (
                        <div key={index} className="flex justify-between text-white text-sm bg-black/20 rounded p-2">
                          <span>{bet.label}</span>
                          <span className="text-yellow-400 font-bold">{bet.amount.toLocaleString('pt-BR')}</span>
                        </div>
                      ))}
                      <div className="border-t pt-2 flex justify-between text-white font-bold">
                        <span>Total:</span>
                        <span className="text-yellow-400">
                          {selectedBets.reduce((sum, bet) => sum + bet.amount, 0).toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <Button
                        onClick={clearBets}
                        disabled={isRolling}
                        className="w-full mt-2 bg-gray-600 hover:bg-gray-700 text-white"
                      >
                        🗑️ Limpar Apostas
                      </Button>
                    </div>
                  ) : (
                    <p className="text-center text-white">Nenhuma aposta feita</p>
                  )}
                </CardContent>
              </Card>

              {/* Rules */}
              <Card className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-gray-300 text-center">📖 REGRAS</CardTitle>
                </CardHeader>
                <CardContent className="text-white text-xs space-y-1">
                  <p><strong>Come Out:</strong> 7/11 ganha Pass, 2/3/12 ganha Don't Pass</p>
                  <p><strong>Point:</strong> Repita o point para ganhar Pass</p>
                  <p><strong>Field:</strong> 2,3,4,9,10,11,12 ganham</p>
                  <p><strong>Any 7:</strong> Próximo roll deve ser 7</p>
                  <p><strong>Hard Ways:</strong> Dados iguais (3+3, 4+4)</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Craps;