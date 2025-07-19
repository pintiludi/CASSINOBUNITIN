import React from 'react';
import { Card } from './ui/card';
import { useGame } from '../contexts/GameContext';

const CreditDisplay = () => {
  const { credits, gameStats } = useGame();

  const formatCredits = (amount) => {
    return amount.toLocaleString('pt-BR');
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <Card className="p-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black border-2 border-yellow-300 shadow-2xl">
        <div className="flex items-center space-x-3">
          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">💰</span>
              <div className="text-right">
                <div className="text-xs font-semibold opacity-80">CRÉDITOS</div>
                <div className="text-xl font-bold">{formatCredits(credits)}</div>
              </div>
            </div>
          </div>
          <div className="border-l border-yellow-700 pl-3 flex flex-col items-center">
            <div className="text-xs font-semibold opacity-80">VITÓRIAS</div>
            <div className="text-lg font-bold">{gameStats.totalWins}</div>
          </div>
        </div>
        
        {gameStats.biggestWin > 0 && (
          <div className="mt-2 pt-2 border-t border-yellow-700 text-center">
            <div className="text-xs font-semibold opacity-80">MAIOR VITÓRIA</div>
            <div className="text-sm font-bold">{formatCredits(gameStats.biggestWin)}</div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CreditDisplay;