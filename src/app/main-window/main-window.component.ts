import { Component, OnInit,Input } from '@angular/core';
import { QueueClient, QueueServiceClient } from '@azure/storage-queue';
import * as signalR from '@microsoft/signalr';
import { HubConnection, IHttpConnectionOptions } from '@microsoft/signalr';
import { CalculationRequest } from '../calculation-request';
import { PictureDoneService } from '../picture-done.service';
import { QueueServiceService } from '../queue-service.service';
import { SignalRService } from '../signal-r.service';


@Component({
  selector: 'app-main-window',
  templateUrl: './main-window.component.html',
  styleUrls: ['./main-window.component.css']
})
export class MainWindowComponent implements OnInit {
  private queueServiceClient: QueueServiceClient;
  public client: QueueClient
  constructor(private Service : PictureDoneService) { }
  public hubConnection: HubConnection;
  account:string ="queuestorage2022";
  sas:string="?sv=2021-06-08&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2022-12-30T21:25:30Z&st=2022-11-26T13:25:30Z&spr=https&sig=yTS3k8yPAkdmYva8UfhMapkwi%2BsKDuGAX%2FPhYeJakS0%3D";
@Input() width:string;
@Input() height:string;
  CreatePicture(): void {
    console.log(this.height);
    console.log(this.width);
    this.Service.sendUpdate('Message from Sender Component to Receiver Component!');
}

  ngOnInit(): void {
    const { setLogLevel } = require("@azure/logger");

    setLogLevel("info");

    this.queueServiceClient = new QueueServiceClient( `https://${this.account}.queue.core.windows.net${this.sas}`)
    this.client = this.queueServiceClient.getQueueClient("queueclin")

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
      
      this.hubConnection.start().then(function () {  
        console.log('SignalR Connected!');  
      }).catch(function (err) {  
        return console.error(err.toString());  
      });  
    this.hubConnection.on("CalculatedMessage", (obj) =>
    {
        console.log("CalculationFinished");
        this.Service.sendUpdate(obj as string);
        //Saver.SaveImage(Saver.Convert((string)obj), "C:\\temp" + $"/Picture74.bmp");
        //exit = true;
    });
  

    this.hubConnection.on("ProgressMessage", (obj) =>
    {
        console.log("Current Progress: " + obj.ToString());
    });
  
    this.hubConnection.onclose(x =>
    {
        console.log("connection closed...");
    });
    this.hubConnection.onreconnecting(x =>
    {
        console.log("reconnecting...");
    });
    this.hubConnection.onreconnected(x =>
    {
        console.log("reconnected...")
    });
  }

  run() {
    this.Service.sendUpdate('hallo');
    console.log("starting...")
    console.log(this.height);
    console.log(this.width);
    var req = new CalculationRequest();

    req.Height = 120;
    req.Width = 120;
    req.CalculationId = this.hubConnection.connectionId!;
    req.Parts = 4;
    req.XReminder = -2.0;
    req.YReminder = 1.0;
    req.Step = 0.03;

    var jsonReq = JSON.stringify(req);

    this.client.sendMessage(jsonReq);
  }
}
