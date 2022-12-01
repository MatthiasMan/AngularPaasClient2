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
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  
  ELEMENT_DATA= [
    {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
    {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
    {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
    {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
    {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
    {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
    {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
    {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
    {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
    {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  ];
  dataSource = this.ELEMENT_DATA;
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
    let base = btoa(this.hubConnection.connectionId!)
  this.hubConnection.send('GetHistory',btoa(this.hubConnection.connectionId!));
  //this.hubConnection.invoke('GetHistory',[btoa(this.hubConnection.connectionId!)])

}

}
