// Mock data for Las Vegas Casino Games

export const initialCredits = 10000;

export const games = [
  {
    id: 'slot-machine',
    name: 'Slot Machine',
    description: 'Jogo principal de caça-níqueis com jackpots incríveis',
    minBet: 10,
    maxBet: 500,
    icon: '🎰',
    featured: true,
    category: 'slots'
  },
  {
    id: 'blackjack',
    name: 'Blackjack',
    description: 'O clássico 21 - vença o dealer!',
    minBet: 25,
    maxBet: 1000,
    icon: '♠️',
    featured: false,
    category: 'cards'
  },
  {
    id: 'roulette',
    name: 'Roleta',
    description: 'Aposte sua sorte na roda da fortuna',
    minBet: 5,
    maxBet: 2000,
    icon: '🎲',
    featured: false,
    category: 'wheel'
  },
  {
    id: 'poker',
    name: 'Poker',
    description: 'Video Poker - forme a melhor mão',
    minBet: 20,
    maxBet: 800,
    icon: '♥️',
    featured: false,
    category: 'cards'
  },
  {
    id: 'craps',
    name: 'Dados',
    description: 'Role os dados e ganhe grande!',
    minBet: 15,
    maxBet: 1500,
    icon: '🎯',
    featured: false,
    category: 'dice'
  }
];

export const slotSymbols = [
  { symbol: '🍒', value: 2, name: 'Cherry' },
  { symbol: '🍋', value: 3, name: 'Lemon' },
  { symbol: '🍊', value: 4, name: 'Orange' },
  { symbol: '🍇', value: 5, name: 'Grape' },
  { symbol: '🔔', value: 8, name: 'Bell' },
  { symbol: '⭐', value: 10, name: 'Star' },
  { symbol: '💎', value: 15, name: 'Diamond' },
  { symbol: '7️⃣', value: 25, name: 'Seven' },
  { symbol: '💰', value: 50, name: 'Jackpot' }
];

export const slotPayouts = {
  three_of_a_kind: {
    '🍒': 20,
    '🍋': 30,
    '🍊': 40,
    '🍇': 50,
    '🔔': 80,
    '⭐': 100,
    '💎': 150,
    '7️⃣': 250,
    '💰': 1000
  },
  two_of_a_kind: {
    '🍒': 2,
    '🍋': 3,
    '🍊': 4,
    '🍇': 5,
    '🔔': 8,
    '⭐': 10,
    '💎': 15,
    '7️⃣': 25,
    '💰': 50
  }
};

// Blackjack cards
export const blackjackCards = [
  'A♠', '2♠', '3♠', '4♠', '5♠', '6♠', '7♠', '8♠', '9♠', '10♠', 'J♠', 'Q♠', 'K♠',
  'A♥', '2♥', '3♥', '4♥', '5♥', '6♥', '7♥', '8♥', '9♥', '10♥', 'J♥', 'Q♥', 'K♥',
  'A♦', '2♦', '3♦', '4♦', '5♦', '6♦', '7♦', '8♦', '9♦', '10♦', 'J♦', 'Q♦', 'K♦',
  'A♣', '2♣', '3♣', '4♣', '5♣', '6♣', '7♣', '8♣', '9♣', '10♣', 'J♣', 'Q♣', 'K♣'
];

// Roulette numbers and colors
export const rouletteNumbers = [
  { number: 0, color: 'green' },
  { number: 1, color: 'red' }, { number: 2, color: 'black' }, { number: 3, color: 'red' },
  { number: 4, color: 'black' }, { number: 5, color: 'red' }, { number: 6, color: 'black' },
  { number: 7, color: 'red' }, { number: 8, color: 'black' }, { number: 9, color: 'red' },
  { number: 10, color: 'black' }, { number: 11, color: 'black' }, { number: 12, color: 'red' },
  { number: 13, color: 'black' }, { number: 14, color: 'red' }, { number: 15, color: 'black' },
  { number: 16, color: 'red' }, { number: 17, color: 'black' }, { number: 18, color: 'red' },
  { number: 19, color: 'red' }, { number: 20, color: 'black' }, { number: 21, color: 'red' },
  { number: 22, color: 'black' }, { number: 23, color: 'red' }, { number: 24, color: 'black' },
  { number: 25, color: 'red' }, { number: 26, color: 'black' }, { number: 27, color: 'red' },
  { number: 28, color: 'black' }, { number: 29, color: 'black' }, { number: 30, color: 'red' },
  { number: 31, color: 'black' }, { number: 32, color: 'red' }, { number: 33, color: 'black' },
  { number: 34, color: 'red' }, { number: 35, color: 'black' }, { number: 36, color: 'red' }
];

export const achievementsList = [
  { id: 'first_win', name: 'Primeira Vitória', description: 'Ganhe seu primeiro jogo', reward: 100 },
  { id: 'big_winner', name: 'Grande Vencedor', description: 'Ganhe mais de 1000 créditos em um jogo', reward: 500 },
  { id: 'slot_master', name: 'Mestre do Slot', description: 'Jogue 50 rodadas no slot machine', reward: 200 },
  { id: 'blackjack_21', name: '21 Perfeito', description: 'Faça um Blackjack natural', reward: 300 },
  { id: 'roulette_lucky', name: 'Sorte na Roleta', description: 'Acerte o número exato na roleta', reward: 400 }
];