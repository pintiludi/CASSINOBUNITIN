import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GameCard from '../components/GameCard';
import { games } from '../mock';
import { useGame } from '../contexts/GameContext';

const Home = () => {
  const navigate = useNavigate();
  const { setCurrentGame } = useGame();

  const handlePlayGame = (gameId) => {
    const game = games.find(g => g.id === gameId);
    setCurrentGame(game);
    navigate(`/${gameId}`);
  };

  useEffect(() => {
    setCurrentGame(null);
  }, [setCurrentGame]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-black via-purple-900 to-red-900 animate-pulse" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-400 rounded-full blur-3xl animate-bounce" />
          <div className="absolute top-32 right-20 w-24 h-24 bg-pink-500 rounded-full blur-2xl animate-pulse" />
          <div className="absolute bottom-20 left-32 w-40 h-40 bg-blue-500 rounded-full blur-3xl animate-bounce" style={{animationDelay: '1s'}} />
          <div className="absolute bottom-32 right-10 w-28 h-28 bg-green-400 rounded-full blur-2xl animate-pulse" style={{animationDelay: '0.5s'}} />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent mb-4 animate-pulse">
            🎰 LAS VEGAS CASINO 🎰
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-2 font-semibold">
            Bem-vindo ao melhor cassino online!
          </p>
          <div className="flex items-center justify-center space-x-4 text-yellow-400">
            <span className="text-lg">✨</span>
            <span className="text-lg font-bold">Jogos Premium • Créditos Grátis • Diversão Garantida</span>
            <span className="text-lg">✨</span>
          </div>
        </div>

        {/* Featured Game */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-white mb-6">
            🌟 JOGO EM DESTAQUE 🌟
          </h2>
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <GameCard 
                game={games.find(g => g.featured)} 
                onPlay={handlePlayGame}
              />
            </div>
          </div>
        </div>

        {/* All Games Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-white mb-8">
            🎯 TODOS OS JOGOS 🎯
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {games.map((game) => (
              <GameCard 
                key={game.id} 
                game={game} 
                onPlay={handlePlayGame}
              />
            ))}
          </div>
        </div>

        {/* Casino Info */}
        <div className="text-center">
          <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 border border-yellow-400/30">
            <h3 className="text-2xl font-bold text-yellow-400 mb-4">🎲 INFORMAÇÕES DO CASSINO 🎲</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
              <div className="space-y-2">
                <div className="text-3xl">🎁</div>
                <div className="font-bold">Créditos Grátis</div>
                <div className="text-sm opacity-75">10.000 créditos iniciais para começar</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl">🏆</div>
                <div className="font-bold">Conquistas</div>
                <div className="text-sm opacity-75">Desbloqueie prêmios especiais jogando</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl">🎯</div>
                <div className="font-bold">5 Jogos</div>
                <div className="text-sm opacity-75">Slot, Blackjack, Roleta, Poker e Dados</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-white/60">
          <p className="text-sm">
            ⚠️ Este é um jogo de entretenimento com créditos virtuais. Não envolve dinheiro real.
          </p>
          <p className="text-xs mt-2">
            🎰 Jogue com responsabilidade • Apenas para maiores de 18 anos 🎰
          </p>
        </div>
      </div>

      {/* Sparkle effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{animationDelay: '0s'}} />
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full animate-ping" style={{animationDelay: '1s'}} />
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-pink-400 rounded-full animate-ping" style={{animationDelay: '2s'}} />
        <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{animationDelay: '0.5s'}} />
      </div>
    </div>
  );
};

export default Home;