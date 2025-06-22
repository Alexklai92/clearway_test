import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DraggableDirective } from '@shared/directives/draggable.directive';
import { distinctUntilChanged } from 'rxjs';
import { AnnotationChangeEnum, TAnnotatioChangeOutput } from '../types';

@Component({
  selector: 'app-document-annotation',
  template: `
    <button (click)="onCloseBtnClick()" title="Удалить"></button>
    <div class="annotation">
      {{ text() }}
    </div>
  `,
  styleUrl: 'document-annotation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    { directive: DraggableDirective, inputs: ['initialPosX', 'initialPosY'] },
  ],
})
export class DocumentAnnotationComponent implements OnInit {
  private _draggableDirective = inject(DraggableDirective);
  private _destroyRef = inject(DestroyRef);

  public text = input.required<string>();
  public annotationChange = output<TAnnotatioChangeOutput>();

  public ngOnInit(): void {
    this._draggableDirective.dragEnd$
      .pipe(distinctUntilChanged(), takeUntilDestroyed(this._destroyRef))
      .subscribe(() => this._onDragEnd());
  }

  private _onDragEnd(): void {
    const { x, y } = this._draggableDirective.getElementPos();
    this.annotationChange.emit({
      type: AnnotationChangeEnum.UpdateCoords,
      x,
      y,
    });
  }

  public onCloseBtnClick(): void {
    this.annotationChange.emit({ type: AnnotationChangeEnum.Remove });
  }
}
