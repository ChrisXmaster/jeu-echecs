import { COLORS, GAME_STATUS } from '../utils/constants.js';
import { getPossibleMoves, isKingInCheck } from './moves.js';

// Vérifier si un coup est valide
export const isValidMove = (board, fromRow, fromCol, toRow, toCol) => {
  const piece = board[fromRow][fromCol];
  if (!piece) return false;

  const possibleMoves = getPossibleMoves(board, fromRow, fromCol);
  return possibleMoves.some(move => move.row === toRow && move.col === toCol);
};

// Vérifier l'état du jeu
export const getGameStatus = (board, currentColor) => {
  const hasLegalMoves = hasAnyLegalMove(board, currentColor);
  const inCheck = isKingInCheck(board, currentColor);

  if (!hasLegalMoves) {
    if (inCheck) {
      return GAME_STATUS.CHECKMATE;
    } else {
      return GAME_STATUS.STALEMATE;
    }
  }

  if (inCheck) {
    return GAME_STATUS.CHECK;
  }

  return GAME_STATUS.PLAYING;
};

// Vérifier si le joueur a au moins un coup légal
export const hasAnyLegalMove = (board, color) => {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === color) {
        const moves = getPossibleMoves(board, row, col);
        if (moves.length > 0) {
          return true;
        }
      }
    }
  }
  return false;
};

// Obtenir tous les coups légaux pour un joueur
export const getAllLegalMoves = (board, color) => {
  const allMoves = [];
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === color) {
        const moves = getPossibleMoves(board, row, col);
        for (const move of moves) {
          allMoves.push({
            from: { row, col },
            to: { row: move.row, col: move.col }
          });
        }
      }
    }
  }
  
  return allMoves;
};

// Vérifier si c'est un échec et mat
export const isCheckmate = (board, color) => {
  return getGameStatus(board, color) === GAME_STATUS.CHECKMATE;
};

// Vérifier si c'est un pat
export const isStalemate = (board, color) => {
  return getGameStatus(board, color) === GAME_STATUS.STALEMATE;
};
