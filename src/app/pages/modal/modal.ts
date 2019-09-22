import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'modal-page',
  templateUrl: 'modal.html',
  styleUrls: ['./modal.scss'],
})
export class ModalPage implements OnInit {
  @Input() title: string;
  @Input() subTitle: string;
  @Input() message: string;

  constructor(private modalCtrl: ModalController, private navParams: NavParams) {}

  audio: any;

  dismiss() {
    // let callback = this.navParams.get("callback");
    this.modalCtrl.dismiss({
      dismissed: true,
    });
    this.stopAudio();
  }

  playAudio() {
    this.audio.play();
    this.audio.loop = true;
  }

  ngOnInit() {
    this.audio = new Audio();
    this.audio.src = '../../../assets/audio/acliff.mp3';
    this.audio.load();
    this.playAudio();
  }

  ngOnDestroy() {
    if(this.audio) {
      this.audio.pause();
      this.audio = null;
    }
  }
  stopAudio() {
    this.audio.pause();
  }
}
