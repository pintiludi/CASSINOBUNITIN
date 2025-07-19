import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
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

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
          
          {/* Slot Machine */}
          <Link to="/slot-machine" className="block">
            <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border-4 border-yellow-400 rounded-lg p-6 transform hover:scale-105 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:shadow-purple-500/25">
              <div className="text-center">
                <div className="text-6xl mb-4 animate-bounce">🎰</div>
                <h3 className="text-2xl font-bold text-white mb-2">Slot Machine</h3>
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-xs px-3 py-1 rounded-full mb-3">
                  ⭐ PRINCIPAL
                </div>
                <p className="text-gray-300 text-sm mb-4">Jogo principal de caça-níqueis com jackpots incríveis</p>
                <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-black font-bold py-3 px-6 rounded-lg">
                  🎰 JOGAR AGORA!
                </div>
              </div>
            </div>
          </Link>

          {/* Blackjack */}
          <Link to="/blackjack" className="block">
            <div className="bg-gradient-to-br from-gray-900 via-red-900 to-black border-2 border-red-600 rounded-lg p-6 transform hover:scale-105 transition-all duration-300 cursor-pointer hover:shadow-2xl">
              <div className="text-center">
                <div className="text-6xl mb-4 animate-bounce">♠️</div>
                <h3 className="text-2xl font-bold text-white mb-2">Blackjack</h3>
                <p className="text-gray-300 text-sm mb-4">O clássico 21 - vença o dealer!</p>
                <div className="bg-gradient-to-r from-red-600 to-red-800 text-white font-bold py-3 px-6 rounded-lg">
                  🎯 JOGAR
                </div>
              </div>
            </div>
          </Link>

          {/* Roulette */}
          <Link to="/roulette" className="block">
            <div className="bg-gradient-to-br from-gray-900 via-red-900 to-black border-2 border-red-600 rounded-lg p-6 transform hover:scale-105 transition-all duration-300 cursor-pointer hover:shadow-2xl">
              <div className="text-center">
                <div className="text-6xl mb-4 animate-bounce">🎲</div>
                <h3 className="text-2xl font-bold text-white mb-2">Roleta</h3>
                <p className="text-gray-300 text-sm mb-4">Aposte sua sorte na roda da fortuna</p>
                <div className="bg-gradient-to-r from-red-600 to-red-800 text-white font-bold py-3 px-6 rounded-lg">
                  🎯 JOGAR
                </div>
              </div>
            </div>
          </Link>

          {/* Poker */}
          <Link to="/poker" className="block">
            <div className="bg-gradient-to-br from-gray-900 via-red-900 to-black border-2 border-red-600 rounded-lg p-6 transform hover:scale-105 transition-all duration-300 cursor-pointer hover:shadow-2xl">
              <div className="text-center">
                <div className="text-6xl mb-4 animate-bounce">♥️</div>
                <h3 className="text-2xl font-bold text-white mb-2">Poker</h3>
                <p className="text-gray-300 text-sm mb-4">Video Poker - forme a melhor mão</p>
                <div className="bg-gradient-to-r from-red-600 to-red-800 text-white font-bold py-3 px-6 rounded-lg">
                  🎯 JOGAR
                </div>
              </div>
            </div>
          </Link>

          {/* Craps */}
          <Link to="/craps" className="block">
            <div className="bg-gradient-to-br from-gray-900 via-red-900 to-black border-2 border-red-600 rounded-lg p-6 transform hover:scale-105 transition-all duration-300 cursor-pointer hover:shadow-2xl">
              <div className="text-center">
                <div className="text-6xl mb-4 animate-bounce">🎯</div>
                <h3 className="text-2xl font-bold text-white mb-2">Dados</h3>
                <p className="text-gray-300 text-sm mb-4">Role os dados e ganhe grande!</p>
                <div className="bg-gradient-to-r from-red-600 to-red-800 text-white font-bold py-3 px-6 rounded-lg">
                  🎯 JOGAR
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Casino Info */}
        <div className="text-center mt-16">
          <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 border border-yellow-400/30 max-w-4xl mx-auto">
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