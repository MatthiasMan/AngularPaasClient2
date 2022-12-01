import { Component, OnInit } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { HubConnection, IHttpConnectionOptions } from '@microsoft/signalr';
import { Progress } from '../progress';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  public hubConnection: HubConnection;
  constructor() { }

  ngOnInit(): void {
    const options: IHttpConnectionOptions = {
      accessTokenFactory: () => {
        return "eyJhbGciOiJIUzI1NiIsIeyJhbGciOiJIUzI1NiIsImtpZCI6IjEzODcwMDc5NzMiLCJ0eXAiOiJKV1QifQ.eyJhc3JzLnMuYXV0IjoiV2ViSm9ic0F1dGhMZXZlbCIsIm5iZiI6MTY2ODI0OTI5OCwiZXhwIjoxNjY4MjUyODk4LCJpYXQiOjE2NjgyNDkyOTgsImF1ZCI6Imh0dHBzOi8vdmFtYXNpZ25hbHIuc2VydmljZS5zaWduYWxyLm5ldC9jbGllbnQvP2h1Yj12YW1haHViIn0.Bg6ceMyfXsyhE5axR8_-GFO6RtaNTaTHXgg_GYIMFoImtpZCI6IjEzODcwMDc5NzMiLCJ0eXAiOiJKV1QifQ";
      }
    };

    this.hubConnection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl("https://vamahubserver.azurewebsites.net/vamahub", options)
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().then(()=> {
      console.log('SignalR Connected!');
      this.sendHistoryRequest()
    }).catch(function (err) {
      return console.error(err.toString());
    });
    
    this.hubConnection.on("HistoryMessage", (obj) => {
      console.log(obj);
      let progress = JSON.parse(obj);
      
    });
  }
  
  sendHistoryRequest(){
  //this.hubConnection.send('GetHistory',[this.hubConnection.connectionId,false]);
  this.hubConnection.invoke('GetHistory',[this.hubConnection.connectionId,false])

}

}
