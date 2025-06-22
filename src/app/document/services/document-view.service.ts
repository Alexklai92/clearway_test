import { inject, Injectable } from '@angular/core';
import { map, Observable, startWith, Subject, switchMap, tap } from 'rxjs';
import { DocumentApi, IAnnotation, IDoc } from '@backend-api/document';
import { Title } from '@angular/platform-browser';

@Injectable()
export class DocumentViewService {
  private _documentApi = inject(DocumentApi);
  private _title = inject(Title);
  private _documentObj: IDoc | null = null;
  private _updateDocumentObj$ = new Subject<void>();

  public getDocument(id: number): Observable<IDoc> {
    return this._documentApi.getDoc(id).pipe(
      tap((docObj) => this._setDocumentObj(docObj)),
      switchMap(() => this._updateDocumentObj$.pipe(startWith(null))),
      map(() => this._documentObj!)
    );
  }

  private _setDocumentObj(docObj: IDoc): void {
    this._documentObj = docObj;
    this._title.setTitle(docObj.name);
  }

  public insertAnnotaion(annotation: IAnnotation): void {
    if (!this._documentObj) {
      console.error('Нельзя добавить аннотацию в несуществующий документ!');
      return;
    }

    if (!Array.isArray(this._documentObj.annotations)) {
      this._documentObj.annotations = [];
    }

    this._documentObj.annotations = [
      ...this._documentObj.annotations,
      annotation,
    ];
    this._updateDocumentObj$.next();
  }

  public removeAnnotation(annotation: IAnnotation) {
    if (!this._documentObj) {
      console.error('Нельзя удалить аннотацию в несуществующем документе!');
      return;
    }

    this._documentObj.annotations = this._documentObj.annotations?.filter(
      (anno) => anno.id !== annotation.id
    );
    this._updateDocumentObj$.next();
  }

  public patchCoordsAnnotations(annotationId: string | number, left: number, top: number): boolean {
    const annotation = this._documentObj?.annotations.find(anno => anno.id == annotationId);

    if (!annotation) return false;
    annotation.left = left;
    annotation.top = top;
    return true;
  }

  public saveDocument(): void {
    if (!this._documentObj) {
      console.error('Нет документа, который можно сохранить!');
      return;
    }

    const pages = this._documentObj.pages;
    const annotations = this._documentObj.annotations || [];
    // Можно было вывести просто объект наверно...
    console.group(this._documentObj.name);

    console.group(`Страницы (${this._documentObj.pages.length})`);
    pages.forEach((page) => console.log(page));
    console.groupEnd();

    console.group(
      `Аннотации к документу (${annotations.length})`
    );
    annotations.forEach((annotation) => console.log(annotation));
    console.groupEnd();
    console.groupEnd();
  }
}
