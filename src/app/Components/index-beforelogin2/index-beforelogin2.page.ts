import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlide, IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-index-beforelogin2',
  templateUrl: './index-beforelogin2.page.html',
  styleUrls: ['./index-beforelogin2.page.scss'],
})
export class IndexBeforelogin2Page implements OnInit {
  @ViewChild('slider', { static: true }) slides: IonSlides;
  constructor() { }


  sliderConfig = {
    slidesPerView: 1.6,
    spaceBetween: 10,
    centeredSlides: true,
    autoplay: true,
    speed: 500,
  };

  ngOnInit() {
  }

  swipeNext(){
    this.slides.slideNext();
    console.log("clicked")
  }
  
  slidesDidLoad(slides: IonSlides) {
    slides.startAutoplay();
  }
  
}
