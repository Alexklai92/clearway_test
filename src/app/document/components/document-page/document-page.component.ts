import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IDocPage } from '@backend-api/document';

@Component({
  selector: 'app-document-page',
  template: `
    @if (docPage()?.imageUrl) {
    <img [src]="docPage()!.imageUrl" />
    }
  `,
  styles: `
    :host {
      display: block;
      margin-left: auto;
      margin-right: auto;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentPageComponent {
  public docPage = input<IDocPage | null>(null);
}
