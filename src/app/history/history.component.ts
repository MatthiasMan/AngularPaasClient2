import { Component, OnInit } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { HubConnection, IHttpConnectionOptions } from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
import { Progress } from '../progress';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  public hubConnection: HubConnection;
  displayedColumns: string[] = ['Created', 'ConnectionId', 'Parts', 'Percentage', 'RequestId'];

  constructor() { }
  progress: Progress[];
  ngOnInit(): void {
    const options: IHttpConnectionOptions = {
      accessTokenFactory: () => {
        return environment.hubToken;
      }
    };

    this.hubConnection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl(environment.signalRUrl, options)
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().then(() => {
      console.log('SignalR Connected!');
      this.sendHistoryRequest()
    }).catch(function (err) {
      return console.error(err.toString());
    });

    this.hubConnection.on("HistoryMessage", (obj) => {
      console.log("HistoryMessage: " + obj);
      this.progress = JSON.parse(obj);

    });
  }

  sendHistoryRequest() {
    let base = btoa(this.hubConnection.connectionId!)
    this.hubConnection.send('GetHistory', this.hubConnection.connectionId).then((jj) => {

    });
  }

}
