
export interface IDoc {
  name: string;
  pages: IDocPage[];
  annotations: IAnnotation[];
}

export interface IAnnotation {
  id: number | string;
  left: number;
  top: number;
  text: string;
}

export interface IDocPage {
  number: number,
  imageUrl: string,
}
