import { IChessPiece } from "./../Interface/IChessPiece"

export interface Observer {
    update(observed: Observed);
}

export interface Observed {
    observers: Observer[];

    addObserver(o: Observer);
    removeObserver(o: Observer);
    event();
}