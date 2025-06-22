import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IAnnotation } from '@backend-api/document';
import { DraggableDirective } from '@shared/directives/draggable.directive';
import { DocumentViewService } from 'app/document/services/document-view.service';
import { distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-document-annotation',
  template: `
    <button (click)="onCloseBtnClick()" title="Удалить"></button>
    <div class="annotation">
      {{ annotation().text }}
    </div>
  `,
  styleUrl: 'document-annotation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: DraggableDirective, inputs: ['initialPosX', 'initialPosY']}],
})
export class DocumentAnnotationComponent implements OnInit {
  private _draggableDirective = inject(DraggableDirective);
  private _destroyRef = inject(DestroyRef);
  private _documentViewService = inject(DocumentViewService);

  public annotation = input.required<IAnnotation>();

  public ngOnInit(): void {
    this._draggableDirective.dragEnd$.pipe(
      distinctUntilChanged(),
      takeUntilDestroyed(this._destroyRef),
    ).subscribe(() => this._onDragEnd());
  }

  private _onDragEnd(): void {
    const {x, y} = this._draggableDirective.getElementPos();
    this._documentViewService.patchCoordsAnnotations(this.annotation().id!, x, y)
  }

  public onCloseBtnClick(): void {
    this._documentViewService.removeAnnotation(this.annotation());
  }
}
