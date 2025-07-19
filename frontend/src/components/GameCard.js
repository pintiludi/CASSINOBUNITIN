import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const GameCard = ({ game, onPlay }) => {
  return (
    <Card className={`group relative overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer ${
      game.featured 
        ? 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border-2 border-yellow-400' 
        : 'bg-gradient-to-br from-gray-900 via-red-900 to-black border border-red-600'
    } hover:shadow-2xl hover:shadow-purple-500/25`}>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)]" />
      </div>

      {/* Shine Effect */}
      <div className="absolute -top-4 -left-4 w-8 h-8 bg-white/20 rounded-full blur-lg group-hover:animate-pulse" />
      <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-purple-500/20 rounded-full blur-lg group-hover:animate-pulse" />

      <CardHeader className="relative pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-4xl animate-bounce">{game.icon}</span>
            <div>
              <CardTitle className="text-xl font-bold text-white">{game.name}</CardTitle>
              {game.featured && (
                <Badge className="mt-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-xs">
                  ⭐ PRINCIPAL
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative">
        <CardDescription className="text-gray-300 mb-4 text-sm leading-relaxed">
          {game.description}
        </CardDescription>

        <div className="flex justify-between items-center mb-4 text-sm">
          <div className="text-green-400">
            <span className="font-semibold">Mín:</span> {game.minBet.toLocaleString('pt-BR')}
          </div>
          <div className="text-red-400">
            <span className="font-semibold">Máx:</span> {game.maxBet.toLocaleString('pt-BR')}
          </div>
        </div>

        <Button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Button clicked for game:', game.id);
            onPlay(game.id);
          }}
          style={{ cursor: 'pointer', pointerEvents: 'auto' }}
          className={`w-full font-bold text-lg py-3 transition-all duration-300 transform hover:scale-105 ${
            game.featured
              ? 'bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-400 hover:via-orange-400 hover:to-red-400 text-black shadow-lg hover:shadow-yellow-500/25'
              : 'bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white shadow-lg hover:shadow-red-500/25'
          }`}
        >
          {game.featured ? '🎰 JOGAR AGORA!' : '🎯 JOGAR'}
        </Button>

        {/* Neon border effect */}
        <div className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
          game.featured ? 'shadow-[0_0_20px_rgba(255,215,0,0.5)]' : 'shadow-[0_0_15px_rgba(220,38,127,0.3)]'
        }`} />
      </CardContent>
    </Card>
  );
};

export default GameCard;