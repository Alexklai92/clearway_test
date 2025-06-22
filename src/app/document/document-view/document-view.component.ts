import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  Injector,
  signal,
  viewChild,
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import {
  catchError,
  distinctUntilChanged,
  filter,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';

import { NotFoundComponent, ToolbarComponent } from '@shared/components';
import { DocumentViewService } from 'app/document/services/document-view.service';
import { OverlayService } from '@shared/overlay';
import {
  DocumentCreateAnnotationComponent,
  DocumentPageComponent,
} from '../components/';
import { DocumentAnnotationComponent } from '../components/document-annotation/document-annotation.component';
import { ScrollableDirective } from '@shared/directives/scrollable.directive';
import { ZoomBlockDirective } from '@shared/directives/zoom-block.directive';

@Component({
  imports: [
    AsyncPipe,
    ZoomBlockDirective,
    ScrollableDirective,
    NotFoundComponent,
    ToolbarComponent,
    DocumentPageComponent,
    DocumentAnnotationComponent,
  ],
  selector: 'app-document-view',
  templateUrl: 'document-view.component.html',
  styleUrl: 'document-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DocumentViewService],
})
export class DocumentViewComponent {
  private _documentViewService = inject(DocumentViewService);
  private _activatedRoute = inject(ActivatedRoute);
  private _destroyRef = inject(DestroyRef);
  private _overlayService = inject(OverlayService);
  private _scrollable = viewChild(ScrollableDirective);

  private _currentId$ = this._activatedRoute.params.pipe(
    takeUntilDestroyed(this._destroyRef),
    filter((params) => !!params['id']),
    distinctUntilChanged(),
    map((params) => params['id'])
  );

  protected _isOpenContextMenu = signal(false);
  protected _isDocNotFound = signal(false);
  protected _doc$ = this._currentId$.pipe(
    switchMap((docId: number) => this._documentViewService.getDocument(docId)),
    // Любую ошибку считаем за notFound
    catchError(() => of(null)),
    tap((result) => this._isDocNotFound.set(!result))
  );

  public onSaveBtnClick(): void {
    this._documentViewService.saveDocument();
  }

  public onContextmenu(event: MouseEvent) {
    event.preventDefault();
    event.stopImmediatePropagation();

    this._overlayService.openComponentOverlay(
      DocumentCreateAnnotationComponent,
      {
        injector: Injector.create({
          providers: [
            {
              provide: DocumentViewService,
              useValue: this._documentViewService,
            },
            {
              provide: ScrollableDirective,
              useValue: this._scrollable(),
            }
          ],
        }),
        hasBackdrop: false,
        x: event.clientX,
        y: event.clientY,
      }
    );
  }
}
