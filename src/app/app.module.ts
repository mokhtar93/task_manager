import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import { AppComponent } from './app.component';
import { TasksModule } from 'src/app/tasks/tasks.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { OrderModule } from 'ngx-order-pipe';
import { MyDatePickerModule } from 'mydatepicker';

@NgModule({
  declarations: [
    AppComponent,



  ],
  imports: [
    BrowserModule,
    TasksModule,
    HttpClientModule,
    NgbModule,
    OrderModule,
    MyDatePickerModule


  ],
  providers: [HttpClientModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
