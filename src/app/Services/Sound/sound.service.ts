import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {

  constructor() { }


  audio = new Audio();




  playAudio(soundName, loop) {
    this.audio.src = `../../assets/audio/${soundName}.wav`;
    this.audio.load();
    if (loop) {
      this.audio.loop = true;
    }
    // this.audio.volume = 20;
    this.audio.play();
  }



}
