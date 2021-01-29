import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TenSecTimerComponent } from './ten-sec-timer.component';



@NgModule({
  declarations: [TenSecTimerComponent],
  exports: [TenSecTimerComponent],
  imports: [
    CommonModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TenSecTimerModule { }
