import { useEffect } from 'react';
import { useChessGame } from './hooks/useChessGame.js';
import { GAME_MODES, GAME_STATUS } from './utils/constants.js';
import Board from './components/Board.jsx';
import GameStatus from './components/GameStatus.jsx';
import GameControls from './components/GameControls.jsx';
import MoveHistory from './components/MoveHistory.jsx';
import PromotionDialog from './components/PromotionDialog.jsx';
import './App.css';

function App() {
  const {
    board,
    currentPlayer,
    selectedSquare,
    possibleMoves,
    gameStatus,
    moveHistory,
    pendingPromotion,
    selectSquare,
    makeMove,
    handlePromotion,
    makeAIMove,
    resetGame,
    undoMove
  } = useChessGame(GAME_MODES.PVE, 3);

  // Déclencher le coup de l'IA
  useEffect(() => {
    if (gameStatus === GAME_STATUS.PLAYING || gameStatus === GAME_STATUS.CHECK) {
      makeAIMove();
    }
  }, [currentPlayer, gameStatus, makeAIMove]);

  const handleMove = (fromRow, fromCol, toRow, toCol) => {
    makeMove(fromRow, fromCol, toRow, toCol);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">♔ Jeu d'Échecs ♚</h1>
        <p className="app-subtitle">Jouez contre l'IA ou un ami</p>
      </header>

      <main className="app-main">
        <GameStatus status={gameStatus} currentPlayer={currentPlayer} />
        
        <Board
          board={board}
          currentPlayer={currentPlayer}
          selectedSquare={selectedSquare}
          possibleMoves={possibleMoves}
          onSquareClick={selectSquare}
          onMove={handleMove}
        />

        <GameControls
          onReset={resetGame}
          onUndo={undoMove}
          canUndo={moveHistory.length > 0}
        />

        <MoveHistory moves={moveHistory} />
      </main>

      {pendingPromotion && (
        <PromotionDialog
          color={board[pendingPromotion.row][pendingPromotion.col]?.color}
          onSelect={handlePromotion}
        />
      )}
    </div>
  );
}

export default App;
