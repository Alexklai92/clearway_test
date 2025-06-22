import {
  AfterViewInit,
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  OnInit,
  output,
  Renderer2,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, Subject, take, takeUntil } from 'rxjs';
import { ScrollableDirective } from './scrollable.directive';
import { DOCUMENT } from '@angular/common';
import { ZoomBlockDirective } from './zoom-block.directive';

@Directive({
  selector: '[draggable-element]',
})
export class DraggableDirective implements AfterViewInit {
  private _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private _destroyRef = inject(DestroyRef);
  private _renderer = inject(Renderer2);
  private _scrollable = inject(ScrollableDirective, { optional: true });
  private _zoom = inject(ZoomBlockDirective, { optional: true });
  private _doc = inject(DOCUMENT);
  private _takeUntilMouseMove$ = new Subject<void>();

  // control - events
  private _dragStart$ = new Subject<void>();
  private _dragEnd$ = new Subject<void>();

  public dragStart$ = this._dragStart$.asObservable();
  public dragEnd$ = this._dragEnd$.asObservable();

  public initialPosX = input<number>(0);
  public initialPosY = input<number>(0);

  public getElementPos(): { x: number; y: number } {
    const { x, y } = this._elementRef.nativeElement.getBoundingClientRect();
    return { x, y };
  }

  public ngAfterViewInit(): void {
    this._initSettings();
    this._bindListeners();
  }

  private _initSettings(): void {
    const element = this._elementRef.nativeElement;
    this._renderer.setAttribute(element, 'draggable', 'true');
    this._renderer.setStyle(element, 'position', 'absolute');
    this._renderer.setStyle(element, 'z-index', '999');
    this._renderer.setStyle(element, 'cursor', 'move');
    this._renderer.setStyle(element, 'left', `${this.initialPosX()}px`);
    this._renderer.setStyle(element, 'top', `${this.initialPosY()}px`);
  }

  private _bindListeners(): void {
    const onDragStarted = (e: DragEvent) => {
      e.preventDefault();
      this._dragStart$.next();
      this._bindMouseMove();
      this._bindMouseUp();
    };

    fromEvent<DragEvent>(this._elementRef.nativeElement, 'dragstart')
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(onDragStarted);
  }

  private _bindMouseMove(): void {
    this._takeUntilMouseMove$.next();
    fromEvent<MouseEvent>(this._doc, 'mousemove')
      .pipe(takeUntil(this._takeUntilMouseMove$))
      .subscribe((e) => this._onMouseMove(e));
  }

  private _bindMouseUp(): void {
    fromEvent(this._doc, 'mouseup')
      .pipe(take(1))
      .subscribe(() => {
        this._takeUntilMouseMove$.next();
        this._dragEnd$.next();
      });
  }

  private _onMouseMove(event: MouseEvent): void {
    const element = this._elementRef.nativeElement;
    let offsetX = event.clientX - element.offsetWidth / 2;
    let offsetY = event.clientY - element.offsetHeight / 2;

    if (this._scrollable) {
      const rect = this._scrollable.getRect() || { x: 0, y: 0 };
      offsetX += this._scrollable.getScrollLeft() - rect.x;
      offsetY += this._scrollable.getScrollTop() - rect.y;
    }

    if (this._zoom) {
      offsetX /= this._zoom.currentValue;
      offsetY /= this._zoom.currentValue;
    }

    this._renderer.setStyle(
      this._elementRef.nativeElement,
      'left',
      `${offsetX}px`
    );
    this._renderer.setStyle(
      this._elementRef.nativeElement,
      'top',
      `${offsetY}px`
    );
  }
}
