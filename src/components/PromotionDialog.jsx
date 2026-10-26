import { PIECE_TYPES, PIECE_SYMBOLS } from '../utils/constants.js';
import './PromotionDialog.css';

const PromotionDialog = ({ color, onSelect }) => {
  const promotionPieces = [
    PIECE_TYPES.QUEEN,
    PIECE_TYPES.ROOK,
    PIECE_TYPES.BISHOP,
    PIECE_TYPES.KNIGHT
  ];

  return (
    <div className="promotion-overlay">
      <div className="promotion-dialog">
        <h2 className="promotion-title">Promotion du pion</h2>
        <p className="promotion-subtitle">Choisissez une pièce :</p>
        <div className="promotion-options">
          {promotionPieces.map((pieceType) => (
            <button
              key={pieceType}
              className="promotion-option"
              onClick={() => onSelect(pieceType)}
              title={pieceType}
            >
              <span className={`promotion-piece ${color}`}>
                {PIECE_SYMBOLS[color][pieceType]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromotionDialog;
