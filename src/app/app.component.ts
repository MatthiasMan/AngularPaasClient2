import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AngularPaaSClient';
  opened:boolean = false;

  openSideBar(){

    this.opened = !this.opened;
  }
}
