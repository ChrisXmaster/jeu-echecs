import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useState } from 'react';
import Square from './Square.jsx';
import Piece from './Piece.jsx';
import './Board.css';

const Board = ({ board, currentPlayer, selectedSquare, possibleMoves, onSquareClick, onMove }) => {
  const [activeId, setActiveId] = useState(null);
  const [activePiece, setActivePiece] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    const [row, col] = active.id.replace('piece-', '').split('-').map(Number);
    const piece = board[row][col];
    
    if (piece && piece.color === currentPlayer) {
      setActiveId(active.id);
      setActivePiece({ ...piece, row, col });
      onSquareClick(row, col);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over) {
      const [fromRow, fromCol] = active.id.replace('piece-', '').split('-').map(Number);
      const [toRow, toCol] = over.id.split('-').map(Number);

      if (fromRow !== toRow || fromCol !== toCol) {
        onMove(fromRow, fromCol, toRow, toCol);
      }
    }

    setActiveId(null);
    setActivePiece(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setActivePiece(null);
  };

  const isSquareLight = (row, col) => (row + col) % 2 === 0;
  const isSquareSelected = (row, col) => 
    selectedSquare && selectedSquare.row === row && selectedSquare.col === col;
  const isSquarePossibleMove = (row, col) => 
    possibleMoves.some(move => move.row === row && move.col === col);

  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="board-container">
        <div className="board">
          {board.map((row, rowIndex) => (
            row.map((piece, colIndex) => {
              const isDragging = activeId === `piece-${rowIndex}-${colIndex}`;
              
              return (
                <Square
                  key={`${rowIndex}-${colIndex}`}
                  row={rowIndex}
                  col={colIndex}
                  isLight={isSquareLight(rowIndex, colIndex)}
                  isSelected={isSquareSelected(rowIndex, colIndex)}
                  isPossibleMove={isSquarePossibleMove(rowIndex, colIndex)}
                  onClick={() => onSquareClick(rowIndex, colIndex)}
                >
                  {piece && !isDragging && (
                    <Piece
                      type={piece.type}
                      color={piece.color}
                      row={rowIndex}
                      col={colIndex}
                      isDraggable={piece.color === currentPlayer}
                    />
                  )}
                </Square>
              );
            })
          ))}
          
          {/* Coordonnées */}
          <div className="coordinates">
            {files.map((file, index) => (
              <div key={file} className="file-label" style={{ left: `${12.5 + index * 12.5}%` }}>
                {file}
              </div>
            ))}
            {ranks.map((rank, index) => (
              <div key={rank} className="rank-label" style={{ top: `${6.25 + index * 12.5}%` }}>
                {rank}
              </div>
            ))}
          </div>
        </div>

        <DragOverlay>
          {activePiece && (
            <div style={{ cursor: 'grabbing', fontSize: '3.5rem' }}>
              <Piece
                type={activePiece.type}
                color={activePiece.color}
                row={activePiece.row}
                col={activePiece.col}
                isDraggable={false}
              />
            </div>
          )}
        </DragOverlay>
      </div>
    </DndContext>
  );
};

export default Board;
