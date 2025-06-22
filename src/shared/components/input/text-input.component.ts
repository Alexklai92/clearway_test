import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  model,
  signal,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  imports: [FormsModule],
  selector: 'app-text-input',
  template: `
    <textarea
      type="text"
      [placeholder]="placeholder()"
      [ngModel]="value()"
      (ngModelChange)="onModelChange($event)"
    ></textarea>
  `,
  styleUrl: 'text-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextInputComponent),
      multi: true,
    },
  ],
})
export class TextInputComponent implements ControlValueAccessor {
  public value = model<string | null>(null);
  public placeholder = input('Введите текст');

  protected _changeFn: Function | null = null;
  protected _touchFn: Function | null = null;
  protected _disabled = signal<boolean>(false);

  public writeValue(obj: any): void {
    this.value.set(obj);
  }

  public registerOnChange(fn: Function): void {
    this._changeFn = fn;
  }

  public registerOnTouched(fn: Function): void {
    this._touchFn = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
  }

  public onModelChange(event: string | null) {
    this.value.set(event);
    this._changeFn?.(this.value());
    this._touchFn?.();
  }
}
