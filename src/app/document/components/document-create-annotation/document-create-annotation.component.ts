import { ChangeDetectionStrategy, Component, inject, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IAnnotation } from '@backend-api/document';
import { TextInputComponent } from '@shared/components';
import { ScrollableDirective } from '@shared/directives/scrollable.directive';
import { ZoomBlockDirective } from '@shared/directives/zoom-block.directive';
import { OverlayRef } from '@shared/overlay';
import { DocumentViewService } from 'app/document/services/document-view.service';
import { take } from 'rxjs';

@Component({
  imports: [ReactiveFormsModule, TextInputComponent],
  template: `
    <div class="create-annotation">
      <div class="header">Добавить аннотацию</div>
      <app-text-input
        placeholder="Введите аннотацию"
        [formControl]="textInputControl"
      ></app-text-input>

      <button (click)="onCancelBtnClick()">Отмена</button>
      <button (click)="onAddBtnClick()">Добавить</button>
    </div>
  `,
  styleUrl: 'document-create-annotation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentCreateAnnotationComponent implements OnInit {
  private _documentViewService = inject(DocumentViewService);
  private _scrollable = inject(ScrollableDirective);
  private _zoom = inject(ZoomBlockDirective);
  private _overlayRef = inject(OverlayRef);

  public textInputControl = new FormControl();

  public ngOnInit(): void {
    this._overlayRef.hasBackdropClick$.pipe(take(1)).subscribe(() => this._overlayRef.detach());
  }

  public onCancelBtnClick() {
    this._overlayRef.detach();
  }

  public onAddBtnClick() {
    if (!this.textInputControl.value) return;
    const left = (this._overlayRef.getXPos() + this._scrollable.getScrollLeft()) / this._zoom.currentValue;
    const top = (this._overlayRef.getYPos() + this._scrollable.getScrollTop()) / this._zoom.currentValue;

    const annotation: IAnnotation = {
      text: this.textInputControl.value,
      left,
      top,
      id: Date.now(),
    };
    this._documentViewService.insertAnnotaion(annotation);
    this._overlayRef.detach();
  }
}
