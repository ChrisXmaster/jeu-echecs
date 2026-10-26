// Vérifier si une position est dans les limites de l'échiquier
export const isValidPosition = (row, col) => {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
};

// Convertir position (row, col) en notation algébrique (ex: e4)
export const toAlgebraic = (row, col) => {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const rank = 8 - row;
  return `${files[col]}${rank}`;
};

// Cloner profondément le plateau
export const cloneBoard = (board) => {
  return board.map(row => row.map(piece => piece ? { ...piece } : null));
};

// Obtenir la couleur opposée
export const oppositeColor = (color) => {
  return color === 'white' ? 'black' : 'white';
};

// Trouver la position du roi pour une couleur donnée
export const findKing = (board, color) => {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.type === 'king' && piece.color === color) {
        return { row, col };
      }
    }
  }
  return null;
};
