import { PIECE_TYPES, COLORS } from '../utils/constants.js';
import { isValidPosition, cloneBoard } from '../utils/helpers.js';

// Obtenir tous les coups possibles pour une pièce
export const getPossibleMoves = (board, fromRow, fromCol, checkForCheck = true) => {
  const piece = board[fromRow][fromCol];
  if (!piece) return [];

  let moves = [];

  switch (piece.type) {
    case PIECE_TYPES.PAWN:
      moves = getPawnMoves(board, fromRow, fromCol, piece.color);
      break;
    case PIECE_TYPES.ROOK:
      moves = getRookMoves(board, fromRow, fromCol, piece.color);
      break;
    case PIECE_TYPES.KNIGHT:
      moves = getKnightMoves(board, fromRow, fromCol, piece.color);
      break;
    case PIECE_TYPES.BISHOP:
      moves = getBishopMoves(board, fromRow, fromCol, piece.color);
      break;
    case PIECE_TYPES.QUEEN:
      moves = getQueenMoves(board, fromRow, fromCol, piece.color);
      break;
    case PIECE_TYPES.KING:
      moves = getKingMoves(board, fromRow, fromCol, piece.color);
      break;
    default:
      moves = [];
  }

  // Filtrer les coups qui mettraient le roi en échec
  if (checkForCheck) {
    moves = moves.filter(move => {
      const newBoard = simulateMove(board, fromRow, fromCol, move.row, move.col);
      return !isKingInCheck(newBoard, piece.color);
    });
  }

  return moves;
};

// Simuler un coup sur le plateau
export const simulateMove = (board, fromRow, fromCol, toRow, toCol) => {
  const newBoard = cloneBoard(board);
  const piece = newBoard[fromRow][fromCol];
  newBoard[toRow][toCol] = piece;
  newBoard[fromRow][fromCol] = null;
  return newBoard;
};

// Vérifier si le roi est en échec
export const isKingInCheck = (board, color) => {
  // Trouver la position du roi
  let kingPos = null;
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.type === PIECE_TYPES.KING && piece.color === color) {
        kingPos = { row, col };
        break;
      }
    }
    if (kingPos) break;
  }

  if (!kingPos) return false;

  // Vérifier si une pièce adverse peut attaquer le roi
  const opponentColor = color === COLORS.WHITE ? COLORS.BLACK : COLORS.WHITE;
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === opponentColor) {
        const moves = getPossibleMoves(board, row, col, false);
        if (moves.some(move => move.row === kingPos.row && move.col === kingPos.col)) {
          return true;
        }
      }
    }
  }

  return false;
};

// Coups du pion
const getPawnMoves = (board, row, col, color) => {
  const moves = [];
  const direction = color === COLORS.WHITE ? -1 : 1;
  const startRow = color === COLORS.WHITE ? 6 : 1;

  // Avancer d'une case
  const newRow = row + direction;
  if (isValidPosition(newRow, col) && !board[newRow][col]) {
    moves.push({ row: newRow, col });

    // Avancer de deux cases depuis la position initiale
    if (row === startRow) {
      const doubleRow = row + 2 * direction;
      if (!board[doubleRow][col]) {
        moves.push({ row: doubleRow, col });
      }
    }
  }

  // Capturer en diagonale
  const captureCols = [col - 1, col + 1];
  for (const captureCol of captureCols) {
    if (isValidPosition(newRow, captureCol)) {
      const targetPiece = board[newRow][captureCol];
      if (targetPiece && targetPiece.color !== color) {
        moves.push({ row: newRow, col: captureCol });
      }
    }
  }

  return moves;
};

// Coups de la tour
const getRookMoves = (board, row, col, color) => {
  return getSlidingMoves(board, row, col, color, [
    [-1, 0], [1, 0], [0, -1], [0, 1]
  ]);
};

// Coups du cavalier
const getKnightMoves = (board, row, col, color) => {
  const moves = [];
  const knightMoves = [
    [-2, -1], [-2, 1], [-1, -2], [-1, 2],
    [1, -2], [1, 2], [2, -1], [2, 1]
  ];

  for (const [dRow, dCol] of knightMoves) {
    const newRow = row + dRow;
    const newCol = col + dCol;

    if (isValidPosition(newRow, newCol)) {
      const targetPiece = board[newRow][newCol];
      if (!targetPiece || targetPiece.color !== color) {
        moves.push({ row: newRow, col: newCol });
      }
    }
  }

  return moves;
};

// Coups du fou
const getBishopMoves = (board, row, col, color) => {
  return getSlidingMoves(board, row, col, color, [
    [-1, -1], [-1, 1], [1, -1], [1, 1]
  ]);
};

// Coups de la reine
const getQueenMoves = (board, row, col, color) => {
  return getSlidingMoves(board, row, col, color, [
    [-1, 0], [1, 0], [0, -1], [0, 1],
    [-1, -1], [-1, 1], [1, -1], [1, 1]
  ]);
};

// Coups du roi
const getKingMoves = (board, row, col, color) => {
  const moves = [];
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1]
  ];

  for (const [dRow, dCol] of directions) {
    const newRow = row + dRow;
    const newCol = col + dCol;

    if (isValidPosition(newRow, newCol)) {
      const targetPiece = board[newRow][newCol];
      if (!targetPiece || targetPiece.color !== color) {
        moves.push({ row: newRow, col: newCol });
      }
    }
  }

  return moves;
};

// Coups glissants (tour, fou, reine)
const getSlidingMoves = (board, row, col, color, directions) => {
  const moves = [];

  for (const [dRow, dCol] of directions) {
    let newRow = row + dRow;
    let newCol = col + dCol;

    while (isValidPosition(newRow, newCol)) {
      const targetPiece = board[newRow][newCol];

      if (!targetPiece) {
        moves.push({ row: newRow, col: newCol });
      } else {
        if (targetPiece.color !== color) {
          moves.push({ row: newRow, col: newCol });
        }
        break;
      }

      newRow += dRow;
      newCol += dCol;
    }
  }

  return moves;
};
