// Types de pièces
export const PIECE_TYPES = {
  PAWN: 'pawn',
  ROOK: 'rook',
  KNIGHT: 'knight',
  BISHOP: 'bishop',
  QUEEN: 'queen',
  KING: 'king'
};

// Couleurs
export const COLORS = {
  WHITE: 'white',
  BLACK: 'black'
};

// Symboles Unicode pour les pièces
export const PIECE_SYMBOLS = {
  white: {
    king: '♔',
    queen: '♕',
    rook: '♖',
    bishop: '♗',
    knight: '♘',
    pawn: '♙'
  },
  black: {
    king: '♚',
    queen: '♛',
    rook: '♜',
    bishop: '♝',
    knight: '♞',
    pawn: '♟'
  }
};

// Valeurs des pièces pour l'évaluation
export const PIECE_VALUES = {
  [PIECE_TYPES.PAWN]: 100,
  [PIECE_TYPES.KNIGHT]: 320,
  [PIECE_TYPES.BISHOP]: 330,
  [PIECE_TYPES.ROOK]: 500,
  [PIECE_TYPES.QUEEN]: 900,
  [PIECE_TYPES.KING]: 20000
};

// Position initiale du jeu
export const INITIAL_BOARD = [
  [
    { type: PIECE_TYPES.ROOK, color: COLORS.BLACK },
    { type: PIECE_TYPES.KNIGHT, color: COLORS.BLACK },
    { type: PIECE_TYPES.BISHOP, color: COLORS.BLACK },
    { type: PIECE_TYPES.QUEEN, color: COLORS.BLACK },
    { type: PIECE_TYPES.KING, color: COLORS.BLACK },
    { type: PIECE_TYPES.BISHOP, color: COLORS.BLACK },
    { type: PIECE_TYPES.KNIGHT, color: COLORS.BLACK },
    { type: PIECE_TYPES.ROOK, color: COLORS.BLACK }
  ],
  Array(8).fill(null).map(() => ({ type: PIECE_TYPES.PAWN, color: COLORS.BLACK })),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null).map(() => ({ type: PIECE_TYPES.PAWN, color: COLORS.WHITE })),
  [
    { type: PIECE_TYPES.ROOK, color: COLORS.WHITE },
    { type: PIECE_TYPES.KNIGHT, color: COLORS.WHITE },
    { type: PIECE_TYPES.BISHOP, color: COLORS.WHITE },
    { type: PIECE_TYPES.QUEEN, color: COLORS.WHITE },
    { type: PIECE_TYPES.KING, color: COLORS.WHITE },
    { type: PIECE_TYPES.BISHOP, color: COLORS.WHITE },
    { type: PIECE_TYPES.KNIGHT, color: COLORS.WHITE },
    { type: PIECE_TYPES.ROOK, color: COLORS.WHITE }
  ]
];

// Modes de jeu
export const GAME_MODES = {
  PVP: 'pvp',
  PVE: 'pve'
};

// Niveaux de difficulté de l'IA
export const AI_DIFFICULTY = {
  EASY: { name: 'easy', depth: 2 },
  MEDIUM: { name: 'medium', depth: 3 },
  HARD: { name: 'hard', depth: 4 }
};

// États du jeu
export const GAME_STATUS = {
  PLAYING: 'playing',
  CHECK: 'check',
  CHECKMATE: 'checkmate',
  STALEMATE: 'stalemate',
  DRAW: 'draw'
};
