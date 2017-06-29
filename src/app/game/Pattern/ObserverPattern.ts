import { IChessPiece } from "./../Interface/IChessPiece"

export interface Observer {
    update(pieces: IChessPiece[]);
}

export interface Observed {
    addObserver(o: Observed);
    removeObserver(o: Observed);
    event();
}