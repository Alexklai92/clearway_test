export enum AnnotationChangeEnum {
  UpdateCoords,
  Remove,
}

export interface IAnnotationChange {
  type: AnnotationChangeEnum;
}

export interface IAnnotationCoordsChange extends IAnnotationChange {
  type: AnnotationChangeEnum.UpdateCoords,
  x: number;
  y: number;
}

export interface IAnnotationRemoveChange extends IAnnotationChange {
  type: AnnotationChangeEnum.Remove
}

export type TAnnotatioChangeOutput = IAnnotationCoordsChange | IAnnotationRemoveChange;
