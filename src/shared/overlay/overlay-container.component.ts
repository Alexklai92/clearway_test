import { Component, ElementRef, inject } from '@angular/core';

@Component({
  selector: 'app-overlay-container',
  template: ``,
  host: {
    '[class.overlay-container]': 'true',
  },
})
export class OverlayContainerComponent {
  private _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  public getHostElement(): HTMLElement {
    const hostElement = document.createElement('div');
    this._elementRef.nativeElement.appendChild(hostElement);
    return hostElement;
  }
}
