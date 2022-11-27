import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';  
import { HubConnection, IHttpConnectionOptions } from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  public hubConnection!: HubConnection;
  constructor() { }

  ngOnInit():void{
    const options: IHttpConnectionOptions = {
      accessTokenFactory: () => {
        return "eyJhbGciOiJIUzI1NiIsIeyJhbGciOiJIUzI1NiIsImtpZCI6IjEzODcwMDc5NzMiLCJ0eXAiOiJKV1QifQ.eyJhc3JzLnMuYXV0IjoiV2ViSm9ic0F1dGhMZXZlbCIsIm5iZiI6MTY2ODI0OTI5OCwiZXhwIjoxNjY4MjUyODk4LCJpYXQiOjE2NjgyNDkyOTgsImF1ZCI6Imh0dHBzOi8vdmFtYXNpZ25hbHIuc2VydmljZS5zaWduYWxyLm5ldC9jbGllbnQvP2h1Yj12YW1haHViIn0.Bg6ceMyfXsyhE5axR8_-GFO6RtaNTaTHXgg_GYIMFoImtpZCI6IjEzODcwMDc5NzMiLCJ0eXAiOiJKV1QifQ";
      }
    };
console.log("da bin ich")
    this.hubConnection = new signalR.HubConnectionBuilder()  
      .configureLogging(signalR.LogLevel.Information)  
      .withUrl("https://vamahubserver.azurewebsites.net/vamahub", options)  
      .withAutomaticReconnect()
      .build();  
      
      this.hubConnection.start().then(function () {  
        console.log('SignalR Connected!');  
      }).catch(function (err) {  
        return console.error(err.toString());  
      });  
    console.log(this.hubConnection.connectionId);
  }
}

