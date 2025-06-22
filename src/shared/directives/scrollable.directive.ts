import {
  AfterViewInit,
  Directive,
  ElementRef,
  inject,
  OnInit,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[scrollable]',
  exportAs: 'scrollable',
})
export class ScrollableDirective implements AfterViewInit {
  private _renderer = inject(Renderer2);
  private _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  public ngAfterViewInit(): void {
    this._initStyles();
  }

  public getRect(): Readonly<{ x: number; y: number }> | null {
    const { x, y } = this._elementRef.nativeElement.getBoundingClientRect();
    return {x, y};
  }

  public getScrollTop(): number {
    return this._elementRef.nativeElement?.scrollTop;
  }

  public getScrollLeft(): number {
    return this._elementRef.nativeElement?.scrollLeft;
  }

  private _initStyles(): void {
    const element = this._elementRef.nativeElement;
    this._renderer.addClass(element, 'scrollable');
  }
}
