import './GameControls.css';

const GameControls = ({ onReset, onUndo, canUndo }) => {
  return (
    <div className="game-controls">
      <button 
        className="control-button undo-button" 
        onClick={onUndo}
        disabled={!canUndo}
        title="Annuler le dernier coup"
      >
        ↶ Annuler
      </button>
      <button 
        className="control-button reset-button" 
        onClick={onReset}
        title="Nouvelle partie"
      >
        ⟳ Nouvelle partie
      </button>
    </div>
  );
};

export default GameControls;
