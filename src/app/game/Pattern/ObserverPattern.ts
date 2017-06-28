import { ChessPiece } from "./../ChessPieces/ChessPiece"

export interface Observer {
    update(pieces: ChessPiece[]);
}

export interface Observed {
    addObserver(o: Observed);
    removeObserver(o: Observed);
    event();
}