import { PIECE_TYPES, COLORS } from '../utils/constants.js';
import { isKingInCheck } from './moves.js';
import { cloneBoard } from '../utils/helpers.js';

// Vérifier si le roque est possible
export const canCastle = (board, color, side, moveHistory) => {
  const row = color === COLORS.WHITE ? 7 : 0;
  const king = board[row][4];

  // Vérifier que le roi est bien en place
  if (!king || king.type !== PIECE_TYPES.KING || king.color !== color) {
    return false;
  }

  // Vérifier que le roi n'a pas bougé
  const kingMoved = moveHistory.some(move => 
    move.from.row === row && move.from.col === 4 && 
    move.piece.type === PIECE_TYPES.KING && move.piece.color === color
  );
  if (kingMoved) return false;

  // Vérifier que le roi n'est pas en échec
  if (isKingInCheck(board, color)) return false;

  if (side === 'kingside') {
    // Roque côté roi (petit roque)
    const rook = board[row][7];
    if (!rook || rook.type !== PIECE_TYPES.ROOK || rook.color !== color) {
      return false;
    }

    // Vérifier que la tour n'a pas bougé
    const rookMoved = moveHistory.some(move => 
      move.from.row === row && move.from.col === 7 && 
      move.piece.type === PIECE_TYPES.ROOK && move.piece.color === color
    );
    if (rookMoved) return false;

    // Vérifier que les cases entre le roi et la tour sont vides
    if (board[row][5] || board[row][6]) return false;

    // Vérifier que le roi ne passe pas par une case attaquée
    for (let col = 5; col <= 6; col++) {
      const testBoard = cloneBoard(board);
      testBoard[row][col] = king;
      testBoard[row][4] = null;
      if (isKingInCheck(testBoard, color)) return false;
    }

    return true;
  } else if (side === 'queenside') {
    // Roque côté dame (grand roque)
    const rook = board[row][0];
    if (!rook || rook.type !== PIECE_TYPES.ROOK || rook.color !== color) {
      return false;
    }

    // Vérifier que la tour n'a pas bougé
    const rookMoved = moveHistory.some(move => 
      move.from.row === row && move.from.col === 0 && 
      move.piece.type === PIECE_TYPES.ROOK && move.piece.color === color
    );
    if (rookMoved) return false;

    // Vérifier que les cases entre le roi et la tour sont vides
    if (board[row][1] || board[row][2] || board[row][3]) return false;

    // Vérifier que le roi ne passe pas par une case attaquée
    for (let col = 2; col <= 3; col++) {
      const testBoard = cloneBoard(board);
      testBoard[row][col] = king;
      testBoard[row][4] = null;
      if (isKingInCheck(testBoard, color)) return false;
    }

    return true;
  }

  return false;
};

// Exécuter le roque
export const performCastle = (board, color, side) => {
  const newBoard = cloneBoard(board);
  const row = color === COLORS.WHITE ? 7 : 0;

  if (side === 'kingside') {
    // Déplacer le roi
    newBoard[row][6] = newBoard[row][4];
    newBoard[row][4] = null;
    // Déplacer la tour
    newBoard[row][5] = newBoard[row][7];
    newBoard[row][7] = null;
  } else if (side === 'queenside') {
    // Déplacer le roi
    newBoard[row][2] = newBoard[row][4];
    newBoard[row][4] = null;
    // Déplacer la tour
    newBoard[row][3] = newBoard[row][0];
    newBoard[row][0] = null;
  }

  return newBoard;
};

// Vérifier si un coup est une prise en passant
export const isEnPassant = (board, fromRow, fromCol, toRow, toCol, lastMove) => {
  const piece = board[fromRow][fromCol];
  
  if (!piece || piece.type !== PIECE_TYPES.PAWN) return false;
  if (!lastMove) return false;

  // Vérifier que le dernier coup était un déplacement de pion de deux cases
  const lastPiece = board[lastMove.to.row][lastMove.to.col];
  if (!lastPiece || lastPiece.type !== PIECE_TYPES.PAWN) return false;
  if (Math.abs(lastMove.from.row - lastMove.to.row) !== 2) return false;

  // Vérifier que le pion est à côté
  if (fromRow !== lastMove.to.row || Math.abs(fromCol - lastMove.to.col) !== 1) return false;

  // Vérifier que le coup est une capture en diagonale sur la case vide
  const direction = piece.color === COLORS.WHITE ? -1 : 1;
  return toRow === fromRow + direction && toCol === lastMove.to.col;
};

// Exécuter une prise en passant
export const performEnPassant = (board, fromRow, fromCol, toRow, toCol) => {
  const newBoard = cloneBoard(board);
  newBoard[toRow][toCol] = newBoard[fromRow][fromCol];
  newBoard[fromRow][fromCol] = null;
  // Retirer le pion capturé
  newBoard[fromRow][toCol] = null;
  return newBoard;
};

// Vérifier si un pion doit être promu
export const shouldPromote = (board, row, col) => {
  const piece = board[row][col];
  if (!piece || piece.type !== PIECE_TYPES.PAWN) return false;
  
  return (piece.color === COLORS.WHITE && row === 0) || 
         (piece.color === COLORS.BLACK && row === 7);
};

// Promouvoir un pion
export const promotePawn = (board, row, col, newType) => {
  const newBoard = cloneBoard(board);
  const piece = newBoard[row][col];
  if (piece) {
    newBoard[row][col] = { ...piece, type: newType };
  }
  return newBoard;
};
