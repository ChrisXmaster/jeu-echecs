import { GAME_STATUS, COLORS } from '../utils/constants.js';
import './GameStatus.css';

const GameStatus = ({ status, currentPlayer }) => {
  const getStatusMessage = () => {
    switch (status) {
      case GAME_STATUS.CHECK:
        return `Échec ! ${currentPlayer === COLORS.WHITE ? 'Blancs' : 'Noirs'} au trait`;
      case GAME_STATUS.CHECKMATE:
        const winner = currentPlayer === COLORS.WHITE ? 'Noirs' : 'Blancs';
        return `Échec et mat ! Les ${winner} ont gagné !`;
      case GAME_STATUS.STALEMATE:
        return 'Pat ! Match nul';
      case GAME_STATUS.DRAW:
        return 'Match nul';
      case GAME_STATUS.PLAYING:
      default:
        return `${currentPlayer === COLORS.WHITE ? 'Blancs' : 'Noirs'} au trait`;
    }
  };

  const getStatusClass = () => {
    if (status === GAME_STATUS.CHECKMATE) return 'checkmate';
    if (status === GAME_STATUS.CHECK) return 'check';
    if (status === GAME_STATUS.STALEMATE || status === GAME_STATUS.DRAW) return 'draw';
    return currentPlayer;
  };

  return (
    <div className={`game-status ${getStatusClass()}`}>
      <div className="status-icon">
        {status === GAME_STATUS.CHECK && '⚠️'}
        {status === GAME_STATUS.CHECKMATE && '👑'}
        {(status === GAME_STATUS.STALEMATE || status === GAME_STATUS.DRAW) && '🤝'}
        {status === GAME_STATUS.PLAYING && (currentPlayer === COLORS.WHITE ? '⚪' : '⚫')}
      </div>
      <div className="status-message">{getStatusMessage()}</div>
    </div>
  );
};

export default GameStatus;
