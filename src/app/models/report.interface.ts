import { IVideo } from './video.interface';

export interface IReport {
  type: REPORT_TYPE;
  video: IVideo;
  playedTime: number;
}

export enum REPORT_TYPE {
  next = 'NEXT',
  prev = 'PREV',
}
