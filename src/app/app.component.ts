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
    this.play(this.playingVideoIndex + 1);
  }
  prev() {
    const isFirst = 0 === this.playingVideoIndex;
    if (!isFirst) {
      this.pause(this.playingVideoIndex);
    }
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
    (this.videosContainer.nativeElement.children.item(
      index
    ) as HTMLVideoElement).play();
  }

  pause(index) {
    (this.videosContainer.nativeElement.children.item(
      index
    ) as HTMLVideoElement).pause();
  }

  show(index) {
    window.scroll({ top: index * (this.videoHeight + 4), behavior: 'smooth' });
  }

  private createVideoElement(video: IVideo) {
    const videoEL = document.createElement('video');
    videoEL.src = video.file;
    videoEL.loop = true;
    videoEL.muted = true;
    // videoEL.width = this.videoWidth;
    videoEL.height = this.videoHeight;
    this.videosContainer.nativeElement.append(videoEL);
  }
}
