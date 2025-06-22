import {
  ApplicationRef,
  createComponent,
  EnvironmentInjector,
  inject,
  Injectable,
  Injector,
} from '@angular/core';
import { IOverlayConfig } from './types';
import { OverlayRef } from './overlay-ref';
import { OVERLAY_DATA } from './overlay-data';
import { OverlayContainerComponent } from './overlay-container.component';

@Injectable({ providedIn: 'root' })
export class OverlayService {
  private _injector = inject(Injector);
  private _envInjector = inject(EnvironmentInjector);
  private _overlayId = 0;
  private _container: OverlayContainerComponent | null = null;
  private _appRef = inject(ApplicationRef);

  public openComponentOverlay(
    component: any,
    config: IOverlayConfig,
    containerElement?: HTMLElement
  ) {
    const _hostElement = this._createHostElement(containerElement);
    const overlayRef = this._createOverlayRef(config!);
    const injector = Injector.create({
      providers: [
        { provide: OVERLAY_DATA, useValue: config.data },
        { provide: OverlayRef, useValue: overlayRef },
      ],
      parent: config.injector || this._injector,
    });
    const host = createComponent(component, {
      environmentInjector: this._envInjector,
      elementInjector: injector,
      hostElement: _hostElement,
    });
    host.changeDetectorRef.detectChanges();
    overlayRef.attach(host!);
    this._appRef.attachView(host.hostView);
    return overlayRef;
  }

  private _createOverlayRef(config: IOverlayConfig): OverlayRef {
    const overlayId = this._overlayId++;
    const overlayRef = new OverlayRef(overlayId, this._appRef, config!);
    return overlayRef;
  }

  private _createHostElement(containerElement?: HTMLElement): HTMLElement {
      let host: HTMLElement;
      if (!containerElement) {
        host = this._tryCreateContainer().getHostElement();
      } else {
        host = document.createElement('div');
        containerElement.appendChild(host);
      }
      return host;
  }

  private _tryCreateContainer(): OverlayContainerComponent {
    if (this._container) return this._container;

    const div = document.createElement('div');
    document.body.appendChild(div);
    const componentRef = createComponent(OverlayContainerComponent, {
      environmentInjector: this._envInjector,
      elementInjector: this._injector,
      hostElement: div,
    });
    this._container = componentRef.instance;
    return this._container;
  }
}
