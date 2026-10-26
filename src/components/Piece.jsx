import { useDraggable } from '@dnd-kit/core';
import { PIECE_SYMBOLS } from '../utils/constants.js';
import './Piece.css';

const Piece = ({ type, color, row, col, isDraggable }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `piece-${row}-${col}`,
    data: { row, col },
    disabled: !isDraggable
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDraggable ? 'grab' : 'default'
  } : {
    cursor: isDraggable ? 'grab' : 'default'
  };

  return (
    <div
      ref={setNodeRef}
      className={`piece ${color} ${isDragging ? 'dragging' : ''}`}
      style={style}
      {...listeners}
      {...attributes}
    >
      {PIECE_SYMBOLS[color][type]}
    </div>
  );
};

export default Piece;
