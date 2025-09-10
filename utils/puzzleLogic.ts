export interface PuzzlePiece {
  id: number;
  row: number;
  col: number;
  correctRow: number;
  correctCol: number;
  rotation: number; // 0, 90, 180, 270 degrees
  color: string;
}

export interface PuzzleState {
  pieces: PuzzlePiece[];
  gridSize: number;
  gridRows: number;
  gridCols: number;
  isComplete: boolean;
  moves: number;
}

export function createPuzzle(colors: string[][], rows: number = 3, cols: number = 4): PuzzleState {
  const pieces: PuzzlePiece[] = [];
  let id = 0;

  // Create pieces from color grid
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      pieces.push({
        id: id++,
        row,
        col,
        correctRow: row,
        correctCol: col,
        rotation: 0,
        color: colors[row]?.[col] || '#CCCCCC'
      });
    }
  }

  return {
    pieces: scramblePuzzle(pieces, rows, cols),
    gridSize: Math.max(rows, cols), // Keep for backward compatibility
    gridRows: rows,
    gridCols: cols,
    isComplete: false,
    moves: 0
  };
}

export function scramblePuzzle(pieces: PuzzlePiece[], rows: number, cols: number): PuzzlePiece[] {
  const scrambled = [...pieces];
  
  // Fisher-Yates shuffle for positions only
  for (let i = scrambled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    
    // Swap positions
    const tempRow = scrambled[i].row;
    const tempCol = scrambled[i].col;
    scrambled[i].row = scrambled[j].row;
    scrambled[i].col = scrambled[j].col;
    scrambled[j].row = tempRow;
    scrambled[j].col = tempCol;
  }

  // Add random rotations
  scrambled.forEach(piece => {
    piece.rotation = [0, 90, 180, 270][Math.floor(Math.random() * 4)];
  });

  return scrambled;
}

export function rotatePiece(piece: PuzzlePiece): PuzzlePiece {
  return {
    ...piece,
    rotation: (piece.rotation + 90) % 360
  };
}

export function swapPieces(pieces: PuzzlePiece[], pieceId1: number, pieceId2: number): PuzzlePiece[] {
  const newPieces = [...pieces];
  const piece1Index = newPieces.findIndex(p => p.id === pieceId1);
  const piece2Index = newPieces.findIndex(p => p.id === pieceId2);

  if (piece1Index !== -1 && piece2Index !== -1) {
    const piece1 = newPieces[piece1Index];
    const piece2 = newPieces[piece2Index];

    // Swap positions only, keep rotations
    const tempRow = piece1.row;
    const tempCol = piece1.col;
    newPieces[piece1Index] = { ...piece1, row: piece2.row, col: piece2.col };
    newPieces[piece2Index] = { ...piece2, row: tempRow, col: tempCol };
  }

  return newPieces;
}

export function movePiece(pieces: PuzzlePiece[], pieceId: number, newRow: number, newCol: number): PuzzlePiece[] {
  const newPieces = [...pieces];
  const pieceIndex = newPieces.findIndex(p => p.id === pieceId);
  
  if (pieceIndex !== -1) {
    // Find piece currently at target position
    const targetPieceIndex = newPieces.findIndex(p => p.row === newRow && p.col === newCol);
    
    if (targetPieceIndex !== -1) {
      // Swap positions
      const piece = newPieces[pieceIndex];
      const targetPiece = newPieces[targetPieceIndex];
      
      newPieces[pieceIndex] = { ...piece, row: newRow, col: newCol };
      newPieces[targetPieceIndex] = { ...targetPiece, row: piece.row, col: piece.col };
    }
  }

  return newPieces;
}

export function checkWinCondition(pieces: PuzzlePiece[]): boolean {
  const isWin = pieces.every(piece => 
    piece.row === piece.correctRow && 
    piece.col === piece.correctCol &&
    piece.rotation === 0
  );
  
  return isWin;
}

export function getPieceAtPosition(pieces: PuzzlePiece[], row: number, col: number): PuzzlePiece | undefined {
  return pieces.find(piece => piece.row === row && piece.col === col);
}

export function getDifficultyGridSize(difficulty: number): number {
  // Difficulty 1-7 maps to grid sizes 3x3 to 9x9
  return Math.min(3 + difficulty - 1, 9);
}

export function getLevelGridDimensions(levelId: number): { rows: number; cols: number } {
  if (levelId >= 1 && levelId <= 4) {
    return { rows: 4, cols: 3 }; // 4x3 for levels 1-4 (portrait)
  } else if (levelId >= 5 && levelId <= 8) {
    return { rows: 5, cols: 4 }; // 5x4 for levels 5-8 (portrait)
  } else if (levelId >= 9 && levelId <= 12) {
    return { rows: 6, cols: 4 }; // 6x4 for levels 9-12 (portrait)
  } else if (levelId >= 13 && levelId <= 16) {
    return { rows: 6, cols: 5 }; // 6x5 for levels 13-16 (portrait)
  } else if (levelId >= 17 && levelId <= 20) {
    return { rows: 7, cols: 5 }; // 7x5 for levels 17-20 (portrait, highest difficulty)
  }
  
  // Default fallback
  return { rows: 4, cols: 3 };
}