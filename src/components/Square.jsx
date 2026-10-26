import { useDroppable } from '@dnd-kit/core';
import './Square.css';

const Square = ({ row, col, isLight, isSelected, isPossibleMove, children, onClick }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `${row}-${col}`,
    data: { row, col }
  });

  const getSquareClass = () => {
    let classes = ['square'];
    classes.push(isLight ? 'light' : 'dark');
    
    if (isSelected) classes.push('selected');
    if (isPossibleMove) classes.push('possible-move');
    if (isOver) classes.push('drag-over');
    
    return classes.join(' ');
  };

  return (
    <div
      ref={setNodeRef}
      className={getSquareClass()}
      onClick={onClick}
    >
      {children}
      {isPossibleMove && <div className="move-indicator" />}
    </div>
  );
};

export default Square;
