import { Component, inject, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ERROR_PAGE_TITLE } from "@shared/constants";


@Component({
  selector: 'app-not-found',
  template: `
  `,
  styles: `
    :host {
      display: block;
      height: 100vh;
      width: 100vw;
      background-image: url('/404-errors.png');
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
    }
  `
})
export class NotFoundComponent implements OnInit {
  private _title = inject(Title);

  public ngOnInit(): void {
    this._title.setTitle(ERROR_PAGE_TITLE);
  }
}
