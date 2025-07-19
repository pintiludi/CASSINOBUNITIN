import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GameProvider } from './contexts/GameContext';
import Home from './pages/Home';
import SlotMachine from './pages/SlotMachine';
import Blackjack from './pages/Blackjack';
import Roulette from './pages/Roulette';
import Poker from './pages/Poker';
import Craps from './pages/Craps';
import CreditDisplay from './components/CreditDisplay';

function App() {
  return (
    <div className="App min-h-screen bg-gradient-to-br from-black via-purple-900 to-red-900">
      <GameProvider>
        <BrowserRouter>
          <CreditDisplay />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/slot-machine" element={<SlotMachine />} />
            <Route path="/blackjack" element={<Blackjack />} />
            <Route path="/roulette" element={<Roulette />} />
            <Route path="/poker" element={<Poker />} />
            <Route path="/craps" element={<Craps />} />
          </Routes>
        </BrowserRouter>
      </GameProvider>
    </div>
  );
}

export default App;