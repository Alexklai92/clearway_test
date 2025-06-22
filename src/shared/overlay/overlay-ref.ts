import { ApplicationRef, ComponentRef } from '@angular/core';
import { IOverlayConfig } from './types';
import { filter, fromEvent, skip, Subject, takeUntil } from 'rxjs';

export class OverlayRef {
  private readonly _OVERLAY_CLASSNAME = 'overlay-element';
  private _takeUntilBackdrop$ = new Subject<void>();
  private _host: ComponentRef<unknown> | null = null;

  public hasBackdropClick$ = new Subject<MouseEvent>();

  constructor(
    private _overlayId: number,
    private _appRef: ApplicationRef,
    private _config: IOverlayConfig
  ) {}

  public attach(host: ComponentRef<unknown>) {
    this._host = host;
    this._appRef.attachView(host.hostView);
    this._initStyles();
    this._initPositions();
    this._bindOutsideClick();
    this._host.changeDetectorRef.detectChanges();
  }

  private _initStyles(): void {
    const hostElement = this._getHostElement();
    hostElement.style.position = 'absolute';
    hostElement.classList.add(
      this.overlayUniqClassName,
      this._OVERLAY_CLASSNAME
    );
  }

  private _initPositions(): void {
    if (typeof this._config.x === 'number') {
      this.setXPos(this._config.x);
    }

    if (typeof this._config.y === 'number') {
      this.setYPos(this._config.y);
    }
  }

  private _bindOutsideClick(): void {
    const onOutsideClick = (event: MouseEvent) => {
      if (!event.target) {
        return;
      }

      const target = event.target as Element;
      if (!target.closest(`.${this.overlayUniqClassName}`)) {
        this.hasBackdropClick$.next(event);
        this._host?.changeDetectorRef.detectChanges();
      }
    };

    fromEvent<MouseEvent>(document, 'mousedown')
      .pipe(
        takeUntil(this._takeUntilBackdrop$),
        filter((e) => !!e.target)
      )
      .subscribe(onOutsideClick);
  }

  public setXPos(x: number) {
    const hostElement = this._getHostElement();
    hostElement.style.left = `${x}px`;
  }

  public setYPos(y: number) {
    const hostElement = this._getHostElement();
    hostElement.style.top = `${y}px`;
  }

  public getXPos(): number {
    const hostElement = this._getHostElement();
    return hostElement.getBoundingClientRect()?.left;
  }

  public getYPos(): number {
    const hostElement = this._getHostElement();
    return hostElement.getBoundingClientRect()?.top;
  }

  private _getHostElement(): HTMLElement {
    return this._host!.location.nativeElement;
  }

  public get overlayUniqClassName(): string {
    return `${this._OVERLAY_CLASSNAME}-${this._overlayId}`;
  }

  private _destroyHost(): void {
    this._appRef.detachView(this._host?.hostView!);
    this._host?.destroy();
  }

  public detach(): void {
    this._takeUntilBackdrop$.next();
    this._destroyHost();
  }
}
