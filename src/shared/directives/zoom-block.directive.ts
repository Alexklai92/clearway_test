import { computed, Directive, input, signal } from "@angular/core";


@Directive({
  selector: 'app-zoom-block',
  exportAs: 'zoomBlock',
  host: {
    '[class.scaled-block]': 'true',
    '[style.--scale-value]': '_curentValue()',
  }
})
export class ZoomBlockDirective {
  private readonly MIN_SCALE_PCT = .5;
  private readonly MAX_SCALE_PCT = 2;
  private _curentValue = signal(1);

  public cuurentValuePct = computed(() => Math.round(this._curentValue() * 100));
  public step = input(.1);
  public get currentValue(): number {
    return this._curentValue();
  }

  public zoomIn() {
    let newValue = this._curentValue() + this.step();
    if (newValue >= this.MAX_SCALE_PCT) {
      newValue = this.MAX_SCALE_PCT;
    }
    this._curentValue.set(newValue);
  }

  public zoomOut() {
    let newValue = this._curentValue() - this.step();
    if (newValue <= this.MIN_SCALE_PCT) {
      newValue = this.MIN_SCALE_PCT;
    }
    this._curentValue.set(newValue);
  }
}
