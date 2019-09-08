import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';

import {ModalPage} from './modal';
@NgModule({
     declarations: [
      ModalPage
     ],
     imports: [
       IonicModule,
       CommonModule
     ],
     entryComponents: [
      ModalPage
     ]
})
export class ModalPageModule {}
