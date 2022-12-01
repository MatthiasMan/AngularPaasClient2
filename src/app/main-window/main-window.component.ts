import { Component, OnInit, Input } from '@angular/core';
import { QueueClient, QueueServiceClient } from '@azure/storage-queue';
import * as signalR from '@microsoft/signalr';
import { HubConnection, IHttpConnectionOptions } from '@microsoft/signalr';
import { Guid } from 'guid-typescript';
import { CalculationRequest } from '../calculation-request';
import { PictureDoneService } from '../picture-done.service';
import { QueueServiceService } from '../queue-service.service';
import { SignalRService } from '../signal-r.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-main-window',
  templateUrl: './main-window.component.html',
  styleUrls: ['./main-window.component.css']
})
export class MainWindowComponent implements OnInit {

  private queueServiceClient: QueueServiceClient;
  public client: QueueClient
  constructor(private Service: PictureDoneService) { }
  public hubConnection: HubConnection;
  public loading: boolean = false;

  chunksArrived: number = 0;
  @Input() progress: number = 0;
  @Input() width: string;
  @Input() height: string;

  CreatePicture(): void {
    this.Service.sendUpdate('Message from Sender Component to Receiver Component!');
  }

  ngOnInit(): void {
    const { setLogLevel } = require("@azure/logger");
    setLogLevel("info");

    this.queueServiceClient = new QueueServiceClient(`https://${environment.account}.queue.core.windows.net${environment.sas}`);
    this.client = this.queueServiceClient.getQueueClient(environment.accountName)

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

    this.hubConnection.start().then(function () {
      console.log('SignalR Connected!');
    }).catch(function (err) {
      return console.error(err.toString());
    });

    this.hubConnection.on("CalculatedMessage", (obj) => {
      console.log("CalculationFinished");
      console.log(obj);
      this.Service.sendUpdate(obj as string);
      this.loading = false;
    });


    this.hubConnection.on("ProgressMessage", (obj) => {
      console.log("Current Progress: " + obj);
      this.chunksArrived + 1;
      this.progress = this.progress + 25;
    });

    this.hubConnection.onclose(x => {
      console.log("connection closed...");
    });
    this.hubConnection.onreconnecting(x => {
      console.log("reconnecting...");
    });
    this.hubConnection.onreconnected(x => {
      console.log("reconnected...")
    });
  }

  run() {


    console.log("starting...");
    this.loading = true;
    this.chunksArrived = 0;
    this.progress = 0;

    var req = new CalculationRequest();

    req.Height = parseInt(this.height);
    req.Width = parseInt(this.width);
    req.RequestId = this.newGuid();
    req.CalculationId = this.hubConnection.connectionId!;
    req.Parts = 4.0;
    req.XReminder = -2.0;
    req.YReminder = 1.0;
    req.Step = 0.03;
    req.MaxBetrag = 4,
    req.MaxIterations = 18;

    var jsonReq = JSON.stringify(req);

    const encode = btoa(jsonReq);
    this.client.sendMessage(encode);
  }

  newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-9xxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  calcProgress(): number {
    return this.chunksArrived * 25;
  }

}
