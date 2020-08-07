import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IReport } from './models/report.interface';

@Injectable({
  providedIn: 'root'
})
export class VideosService {

  constructor(private http: HttpClient) { }

  getVideos() {
    return this.http.get('/assets/videos.json');
  }

  sendReport(report: IReport) {
    // Mock report service. should be replaced by http.post method.
    return new Observable(observer => observer.next(console.log(report)));
  }
}
