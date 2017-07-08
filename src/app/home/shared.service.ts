import { Injectable } from '@angular/core';

@Injectable()
export class SharedService {
  static promotion: boolean;
  static end: number;
  static playerName: string;
  static color: string;
}