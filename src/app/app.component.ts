import {
  Component,
  ViewChild,
  AfterViewInit,
  ElementRef,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { VideosService } from './videos.service';
import { IVideo } from './models';
import { REPORT_TYPE } from './models/report.interface';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements AfterViewInit {
  @ViewChild('videos') videosContainer: ElementRef<HTMLDivElement>;

  videos: IVideo[] = [];
  playingVideoIndex = 0;
  bufferedVideos: number[] = [];
  videoWidth = window.innerWidth;
  videoHeight = window.innerHeight;

  constructor(private videosService: VideosService) {}

  ngAfterViewInit() {
    this.videosService.getVideos().subscribe((videos: IVideo[]) => {
      this.videos = videos;
      this.play(0);
    });
  }

  next() {
    const isLast = this.videos.length - 1 === this.playingVideoIndex;
    if (!isLast) {
      this.pause(this.playingVideoIndex);
    }
    this.report(REPORT_TYPE.next, this.playingVideoIndex);
    this.play(this.playingVideoIndex + 1);
  }
  prev() {
    const isFirst = 0 === this.playingVideoIndex;
    if (!isFirst) {
      this.pause(this.playingVideoIndex);
    }
    this.report(REPORT_TYPE.prev, this.playingVideoIndex);
    this.play(this.playingVideoIndex - 1);
  }

  play(index: number) {
    const video = this.videos[index];
    if (!video) {
      console.log('end of videos');
      return;
    }

    this.playingVideoIndex = index;
    if (!this.bufferedVideos.includes(index)) {
      this.bufferedVideos.push(index);
      this.createVideoElement(video);
    }

    this.show(index);
    this.getVideoElementByIndex(index).play();
  }

  pause(index) {
    this.getVideoElementByIndex(index).pause();
  }

  show(index) {
    window.scroll({ top: index * (this.videoHeight + 4), behavior: 'smooth' });
  }

  private createVideoElement(video: IVideo) {
    const videoEL = document.createElement('video');
    videoEL.src = video.file;
    videoEL.muted = true;
    videoEL.height = this.videoHeight;
    videoEL.onended = this.next.bind(this);
    this.videosContainer.nativeElement.append(videoEL);
  }

  private report(type: REPORT_TYPE, index) {
    const videoEL = this.getVideoElementByIndex(index);
    this.videosService.sendReport({type, video: this.videos[index], playedTime: videoEL.currentTime }).toPromise();
  }

  private getVideoElementByIndex(index) {
    return this.videosContainer.nativeElement.children.item(
      index
    ) as HTMLVideoElement;
  }
}
