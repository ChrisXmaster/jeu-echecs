import { useState, useCallback } from 'react';
import { INITIAL_BOARD, COLORS, GAME_STATUS, GAME_MODES, PIECE_TYPES } from '../utils/constants.js';
import { cloneBoard, toAlgebraic } from '../utils/helpers.js';
import { getPossibleMoves } from '../engine/moves.js';
import { getGameStatus } from '../engine/validation.js';
import { getBestMove } from '../engine/ai.js';
import { canCastle, performCastle, isEnPassant, performEnPassant, shouldPromote, promotePawn } from '../engine/special-moves.js';

export const useChessGame = (gameMode = GAME_MODES.PVP, aiDifficulty = 3) => {
  const [board, setBoard] = useState(() => cloneBoard(INITIAL_BOARD));
  const [currentPlayer, setCurrentPlayer] = useState(COLORS.WHITE);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [gameStatus, setGameStatus] = useState(GAME_STATUS.PLAYING);
  const [moveHistory, setMoveHistory] = useState([]);
  const [capturedPieces, setCapturedPieces] = useState({ white: [], black: [] });
  const [pendingPromotion, setPendingPromotion] = useState(null);

  // Sélectionner une case
  const selectSquare = useCallback((row, col) => {
    const piece = board[row][col];

    // Si une case est déjà sélectionnée
    if (selectedSquare) {
      const { row: fromRow, col: fromCol } = selectedSquare;
      const selectedPiece = board[fromRow][fromCol];

      // Si on clique sur une autre pièce de la même couleur
      if (piece && piece.color === selectedPiece.color) {
        setSelectedSquare({ row, col });
        setPossibleMoves(getPossibleMoves(board, row, col));
        return;
      }

      // Tenter de déplacer la pièce
      const isValidMove = possibleMoves.some(move => move.row === row && move.col === col);
      if (isValidMove) {
        makeMove(fromRow, fromCol, row, col);
      }

      setSelectedSquare(null);
      setPossibleMoves([]);
    } else {
      // Sélectionner une nouvelle pièce
      if (piece && piece.color === currentPlayer) {
        setSelectedSquare({ row, col });
        setPossibleMoves(getPossibleMoves(board, row, col));
      }
    }
  }, [board, selectedSquare, possibleMoves, currentPlayer]);

  // Effectuer un coup
  const makeMove = useCallback((fromRow, fromCol, toRow, toCol) => {
    const piece = board[fromRow][fromCol];
    if (!piece) return false;

    let newBoard = cloneBoard(board);
    const capturedPiece = newBoard[toRow][toCol];

    // Vérifier les coups spéciaux
    const lastMove = moveHistory[moveHistory.length - 1];

    // Roque
    if (piece.type === PIECE_TYPES.KING && Math.abs(toCol - fromCol) === 2) {
      const side = toCol > fromCol ? 'kingside' : 'queenside';
      if (canCastle(newBoard, piece.color, side, moveHistory)) {
        newBoard = performCastle(newBoard, piece.color, side);
      } else {
        return false;
      }
    }
    // Prise en passant
    else if (isEnPassant(newBoard, fromRow, fromCol, toRow, toCol, lastMove)) {
      newBoard = performEnPassant(newBoard, fromRow, fromCol, toRow, toCol);
      const capturedPawn = board[lastMove.to.row][lastMove.to.col];
      if (capturedPawn) {
        setCapturedPieces(prev => ({
          ...prev,
          [piece.color]: [...prev[piece.color], capturedPawn]
        }));
      }
    }
    // Coup normal
    else {
      newBoard[toRow][toCol] = piece;
      newBoard[fromRow][fromCol] = null;

      if (capturedPiece) {
        setCapturedPieces(prev => ({
          ...prev,
          [piece.color]: [...prev[piece.color], capturedPiece]
        }));
      }
    }

    // Vérifier la promotion
    if (shouldPromote(newBoard, toRow, toCol)) {
      setPendingPromotion({ row: toRow, col: toCol, board: newBoard });
      return true;
    }

    // Mettre à jour l'historique
    const move = {
      from: { row: fromRow, col: fromCol },
      to: { row: toRow, col: toCol },
      piece: { ...piece },
      captured: capturedPiece,
      notation: getMoveNotation(fromRow, fromCol, toRow, toCol, piece, capturedPiece)
    };

    setBoard(newBoard);
    setMoveHistory(prev => [...prev, move]);

    // Changer de joueur
    const nextPlayer = piece.color === COLORS.WHITE ? COLORS.BLACK : COLORS.WHITE;
    setCurrentPlayer(nextPlayer);

    // Vérifier l'état du jeu
    const status = getGameStatus(newBoard, nextPlayer);
    setGameStatus(status);

    return true;
  }, [board, moveHistory]);

  // Promouvoir un pion
  const handlePromotion = useCallback((pieceType) => {
    if (!pendingPromotion) return;

    const { row, col, board: promotionBoard } = pendingPromotion;
    const piece = promotionBoard[row][col];
    const newBoard = promotePawn(promotionBoard, row, col, pieceType);

    const lastHistoryMove = moveHistory[moveHistory.length - 1] || { from: { row, col }, to: { row, col } };
    const move = {
      from: lastHistoryMove.from,
      to: { row, col },
      piece: { ...piece },
      captured: null,
      promotion: pieceType,
      notation: getMoveNotation(lastHistoryMove.from.row, lastHistoryMove.from.col, row, col, piece, null) + '=' + pieceType.charAt(0).toUpperCase()
    };

    setBoard(newBoard);
    setMoveHistory(prev => [...prev, move]);
    setPendingPromotion(null);

    // Changer de joueur
    const nextPlayer = piece.color === COLORS.WHITE ? COLORS.BLACK : COLORS.WHITE;
    setCurrentPlayer(nextPlayer);

    // Vérifier l'état du jeu
    const status = getGameStatus(newBoard, nextPlayer);
    setGameStatus(status);
  }, [pendingPromotion, moveHistory]);

  // Coup de l'IA
  const makeAIMove = useCallback(() => {
    if (gameMode !== GAME_MODES.PVE || currentPlayer !== COLORS.BLACK) return;
    if (gameStatus !== GAME_STATUS.PLAYING && gameStatus !== GAME_STATUS.CHECK) return;

    setTimeout(() => {
      const bestMove = getBestMove(board, COLORS.BLACK, aiDifficulty);
      if (bestMove) {
        makeMove(bestMove.from.row, bestMove.from.col, bestMove.to.row, bestMove.to.col);
      }
    }, 500);
  }, [board, currentPlayer, gameMode, gameStatus, aiDifficulty, makeMove]);

  // Notation algébrique du coup
  const getMoveNotation = (fromRow, fromCol, toRow, toCol, piece, captured) => {
    let notation = '';

    if (piece.type !== PIECE_TYPES.PAWN) {
      notation += piece.type.charAt(0).toUpperCase();
    }

    notation += toAlgebraic(fromRow, fromCol);
    notation += captured ? 'x' : '-';
    notation += toAlgebraic(toRow, toCol);

    return notation;
  };

  // Réinitialiser le jeu
  const resetGame = useCallback(() => {
    setBoard(cloneBoard(INITIAL_BOARD));
    setCurrentPlayer(COLORS.WHITE);
    setSelectedSquare(null);
    setPossibleMoves([]);
    setGameStatus(GAME_STATUS.PLAYING);
    setMoveHistory([]);
    setCapturedPieces({ white: [], black: [] });
    setPendingPromotion(null);
  }, []);

  // Annuler le dernier coup
  const undoMove = useCallback(() => {
    if (moveHistory.length === 0) return;

    const lastMove = moveHistory[moveHistory.length - 1];
    const newBoard = cloneBoard(board);

    // Restaurer la pièce à sa position d'origine
    newBoard[lastMove.from.row][lastMove.from.col] = lastMove.piece;
    newBoard[lastMove.to.row][lastMove.to.col] = lastMove.captured || null;

    // Restaurer les pièces capturées
    if (lastMove.captured) {
      setCapturedPieces(prev => ({
        ...prev,
        [lastMove.piece.color]: prev[lastMove.piece.color].slice(0, -1)
      }));
    }

    setBoard(newBoard);
    setMoveHistory(prev => prev.slice(0, -1));
    setCurrentPlayer(lastMove.piece.color);
    setGameStatus(GAME_STATUS.PLAYING);
    setSelectedSquare(null);
    setPossibleMoves([]);
  }, [board, moveHistory]);

  return {
    board,
    currentPlayer,
    selectedSquare,
    possibleMoves,
    gameStatus,
    moveHistory,
    capturedPieces,
    pendingPromotion,
    selectSquare,
    makeMove,
    handlePromotion,
    makeAIMove,
    resetGame,
    undoMove
  };
};
