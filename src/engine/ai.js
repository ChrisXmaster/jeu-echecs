import { PIECE_VALUES, PIECE_TYPES, COLORS } from '../utils/constants.js';
import { getAllLegalMoves, getGameStatus } from './validation.js';
import { simulateMove, isKingInCheck } from './moves.js';
import { cloneBoard, oppositeColor } from '../utils/helpers.js';

// Tables de position pour l'évaluation
const POSITION_VALUES = {
  [PIECE_TYPES.PAWN]: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5, 5, 10, 25, 25, 10, 5, 5],
    [0, 0, 0, 20, 20, 0, 0, 0],
    [5, -5, -10, 0, 0, -10, -5, 5],
    [5, 10, 10, -20, -20, 10, 10, 5],
    [0, 0, 0, 0, 0, 0, 0, 0]
  ],
  [PIECE_TYPES.KNIGHT]: [
    [-50, -40, -30, -30, -30, -30, -40, -50],
    [-40, -20, 0, 0, 0, 0, -20, -40],
    [-30, 0, 10, 15, 15, 10, 0, -30],
    [-30, 5, 15, 20, 20, 15, 5, -30],
    [-30, 0, 15, 20, 20, 15, 0, -30],
    [-30, 5, 10, 15, 15, 10, 5, -30],
    [-40, -20, 0, 5, 5, 0, -20, -40],
    [-50, -40, -30, -30, -30, -30, -40, -50]
  ],
  [PIECE_TYPES.BISHOP]: [
    [-20, -10, -10, -10, -10, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 10, 10, 5, 0, -10],
    [-10, 5, 5, 10, 10, 5, 5, -10],
    [-10, 0, 10, 10, 10, 10, 0, -10],
    [-10, 10, 10, 10, 10, 10, 10, -10],
    [-10, 5, 0, 0, 0, 0, 5, -10],
    [-20, -10, -10, -10, -10, -10, -10, -20]
  ],
  [PIECE_TYPES.ROOK]: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [5, 10, 10, 10, 10, 10, 10, 5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [0, 0, 0, 5, 5, 0, 0, 0]
  ],
  [PIECE_TYPES.QUEEN]: [
    [-20, -10, -10, -5, -5, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 5, 5, 5, 0, -10],
    [-5, 0, 5, 5, 5, 5, 0, -5],
    [0, 0, 5, 5, 5, 5, 0, -5],
    [-10, 5, 5, 5, 5, 5, 0, -10],
    [-10, 0, 5, 0, 0, 0, 0, -10],
    [-20, -10, -10, -5, -5, -10, -10, -20]
  ],
  [PIECE_TYPES.KING]: [
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-20, -30, -30, -40, -40, -30, -30, -20],
    [-10, -20, -20, -20, -20, -20, -20, -10],
    [20, 20, 0, 0, 0, 0, 20, 20],
    [20, 30, 10, 0, 0, 10, 30, 20]
  ]
};

// Évaluer une position
export const evaluatePosition = (board, color) => {
  let score = 0;

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece) {
        const pieceValue = PIECE_VALUES[piece.type];
        const positionValue = getPositionValue(piece.type, row, col, piece.color);
        const totalValue = pieceValue + positionValue;

        if (piece.color === color) {
          score += totalValue;
        } else {
          score -= totalValue;
        }
      }
    }
  }

  // Bonus pour la mobilité
  const mobility = getAllLegalMoves(board, color).length;
  const opponentMobility = getAllLegalMoves(board, oppositeColor(color)).length;
  score += (mobility - opponentMobility) * 10;

  // Pénalité pour être en échec
  if (isKingInCheck(board, color)) {
    score -= 50;
  }
  if (isKingInCheck(board, oppositeColor(color))) {
    score += 50;
  }

  return score;
};

// Obtenir la valeur positionnelle d'une pièce
const getPositionValue = (pieceType, row, col, color) => {
  if (!POSITION_VALUES[pieceType]) return 0;
  
  // Inverser les lignes pour les noirs
  const adjustedRow = color === COLORS.WHITE ? row : 7 - row;
  return POSITION_VALUES[pieceType][adjustedRow][col];
};

// Algorithme Minimax avec élagage Alpha-Beta
export const minimax = (board, depth, alpha, beta, maximizingPlayer, color) => {
  if (depth === 0) {
    return evaluatePosition(board, color);
  }

  const currentColor = maximizingPlayer ? color : oppositeColor(color);
  const moves = getAllLegalMoves(board, currentColor);

  // Vérifier la fin du jeu
  if (moves.length === 0) {
    if (isKingInCheck(board, currentColor)) {
      // Échec et mat
      return maximizingPlayer ? -100000 : 100000;
    } else {
      // Pat
      return 0;
    }
  }

  if (maximizingPlayer) {
    let maxEval = -Infinity;
    for (const move of moves) {
      const newBoard = simulateMove(board, move.from.row, move.from.col, move.to.row, move.to.col);
      const evaluation = minimax(newBoard, depth - 1, alpha, beta, false, color);
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break; // Élagage Beta
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      const newBoard = simulateMove(board, move.from.row, move.from.col, move.to.row, move.to.col);
      const evaluation = minimax(newBoard, depth - 1, alpha, beta, true, color);
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break; // Élagage Alpha
    }
    return minEval;
  }
};

// Obtenir le meilleur coup pour l'IA
export const getBestMove = (board, color, depth = 3) => {
  const moves = getAllLegalMoves(board, color);
  
  if (moves.length === 0) return null;

  let bestMove = null;
  let bestValue = -Infinity;

  // Ordre des coups : captures d'abord
  const orderedMoves = orderMoves(board, moves);

  for (const move of orderedMoves) {
    const newBoard = simulateMove(board, move.from.row, move.from.col, move.to.row, move.to.col);
    const moveValue = minimax(newBoard, depth - 1, -Infinity, Infinity, false, color);

    if (moveValue > bestValue) {
      bestValue = moveValue;
      bestMove = move;
    }
  }

  return bestMove;
};

// Ordonner les coups pour améliorer l'élagage alpha-beta
const orderMoves = (board, moves) => {
  return moves.sort((a, b) => {
    const captureA = board[a.to.row][a.to.col] ? PIECE_VALUES[board[a.to.row][a.to.col].type] : 0;
    const captureB = board[b.to.row][b.to.col] ? PIECE_VALUES[board[b.to.row][b.to.col].type] : 0;
    return captureB - captureA;
  });
};
