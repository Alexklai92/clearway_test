import { Injector } from "@angular/core";


export interface IOverlayConfig {
  x?: number;
  y?: number;
  offsetX?: number;
  offsetY?: number;
  hasBackdrop?: boolean;
  injector?: Injector,
  data?: any,
}
