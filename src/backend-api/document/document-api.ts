import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable, shareReplay } from "rxjs";
import { IDoc } from "./types";


@Injectable({ providedIn: 'root' })
export class DocumentApi {

  private _httpClient = inject(HttpClient);

  getDoc(docNumber: number): Observable<IDoc> {
    return this._httpClient.get<IDoc>(`/${docNumber}.json`).pipe(
      shareReplay(1),
    );
  }
}
