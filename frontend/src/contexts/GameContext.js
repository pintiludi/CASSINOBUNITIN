import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialCredits, achievementsList } from '../mock';

const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider = ({ children }) => {
  const [credits, setCredits] = useState(initialCredits);
  const [currentGame, setCurrentGame] = useState(null);
  const [gameStats, setGameStats] = useState({
    totalGamesPlayed: 0,
    totalWins: 0,
    totalLosses: 0,
    biggestWin: 0,
    gamesPlayedByType: {}
  });
  const [achievements, setAchievements] = useState([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedCredits = localStorage.getItem('casino_credits');
    const savedStats = localStorage.getItem('casino_stats');
    const savedAchievements = localStorage.getItem('casino_achievements');

    if (savedCredits) {
      setCredits(parseInt(savedCredits));
    }
    if (savedStats) {
      setGameStats(JSON.parse(savedStats));
    }
    if (savedAchievements) {
      setUnlockedAchievements(JSON.parse(savedAchievements));
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('casino_credits', credits.toString());
  }, [credits]);

  useEffect(() => {
    localStorage.setItem('casino_stats', JSON.stringify(gameStats));
  }, [gameStats]);

  useEffect(() => {
    localStorage.setItem('casino_achievements', JSON.stringify(unlockedAchievements));
  }, [unlockedAchievements]);

  const placeBet = (amount) => {
    if (amount > credits) {
      return false; // Not enough credits
    }
    setCredits(prev => prev - amount);
    return true;
  };

  const winAmount = (amount) => {
    setCredits(prev => prev + amount);
    
    // Update stats
    setGameStats(prev => ({
      ...prev,
      totalWins: prev.totalWins + 1,
      biggestWin: Math.max(prev.biggestWin, amount)
    }));

    // Check for achievements
    checkAchievements(amount);
  };

  const loseGame = () => {
    setGameStats(prev => ({
      ...prev,
      totalLosses: prev.totalLosses + 1
    }));
  };

  const playGame = (gameType) => {
    setGameStats(prev => ({
      ...prev,
      totalGamesPlayed: prev.totalGamesPlayed + 1,
      gamesPlayedByType: {
        ...prev.gamesPlayedByType,
        [gameType]: (prev.gamesPlayedByType[gameType] || 0) + 1
      }
    }));
  };

  const checkAchievements = (winAmount = 0) => {
    const newAchievements = [];

    // First Win Achievement
    if (gameStats.totalWins === 0 && !unlockedAchievements.includes('first_win')) {
      newAchievements.push('first_win');
    }

    // Big Winner Achievement
    if (winAmount > 1000 && !unlockedAchievements.includes('big_winner')) {
      newAchievements.push('big_winner');
    }

    // Slot Master Achievement
    if ((gameStats.gamesPlayedByType['slot-machine'] || 0) >= 50 && !unlockedAchievements.includes('slot_master')) {
      newAchievements.push('slot_master');
    }

    // Add new achievements
    if (newAchievements.length > 0) {
      setUnlockedAchievements(prev => [...prev, ...newAchievements]);
      
      // Award credits for achievements
      newAchievements.forEach(achievementId => {
        const achievement = achievementsList.find(a => a.id === achievementId);
        if (achievement) {
          setCredits(prev => prev + achievement.reward);
        }
      });

      // Show achievement notification (could be enhanced with toast)
      console.log('New achievements unlocked:', newAchievements);
    }
  };

  const resetGame = () => {
    setCredits(initialCredits);
    setGameStats({
      totalGamesPlayed: 0,
      totalWins: 0,
      totalLosses: 0,
      biggestWin: 0,
      gamesPlayedByType: {}
    });
    setUnlockedAchievements([]);
    localStorage.removeItem('casino_credits');
    localStorage.removeItem('casino_stats');
    localStorage.removeItem('casino_achievements');
  };

  const value = {
    credits,
    currentGame,
    setCurrentGame,
    gameStats,
    achievements,
    unlockedAchievements,
    placeBet,
    winAmount,
    loseGame,
    playGame,
    resetGame,
    checkAchievements
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};