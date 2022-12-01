import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainWindowComponent } from './main-window/main-window.component';
import { PictureComponent } from './picture/picture.component';
import { PictureDoneService } from './picture-done.service';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { SidebarModule } from 'ng-sidebar';
import { HistoryComponent } from './history/history.component';
import { ShowComponent } from './show/show.component';
import {MatTableModule} from '@angular/material/table';
import {MatSelectModule} from '@angular/material/select';


@NgModule({
  declarations: [
    AppComponent,
    MainWindowComponent,
    PictureComponent,
    HistoryComponent,
    ShowComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    SidebarModule,
    MatTableModule,
    MatSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
