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
import { ValueViewValuePair } from '../value-view-value-pair';


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
  selectedValue: number = 4;
  chunksArrived: number = 0;
  selectedSize: string;
  @Input() progress: number = 0;
  @Input() width: number;
  @Input() height: number;
  @Input() parts: string;
  partOptions: ValueViewValuePair[] = [
    { Value: 4, ViewValue: '4' },
    { Value: 16, ViewValue: '16' },

  ];

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
      this.Service.sendUpdate(obj as string, this.height, this.width);
      this.loading = false;
    });


    this.hubConnection.on("ProgressMessage", (obj) => {
      console.log("Current Progress: " + obj);
      this.chunksArrived + 1;
      this.progress = obj * 100;
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
    this.setSize();
    console.log("starting...");
    console.log(this.selectedSize);
    console.log(this.selectedValue);
    console.log(this.height)
    console.log(this.width)
    this.loading = true;
    this.chunksArrived = 0;
    this.progress = 0;

    var req = new CalculationRequest();
    req.Height = this.height;
    req.Width = this.width;
    req.RequestId = this.newGuid();
    req.CalculationId = this.hubConnection.connectionId!;
    req.Parts = this.selectedValue;
    req.XReminder = -2.0;
    req.YReminder = 1.0;
    req.Step = 0.03;
    req.MaxBetrag = 4,
      req.MaxIterations = 18;

    var jsonReq = JSON.stringify(req);

    const encode = btoa(jsonReq);
    this.client.sendMessage(encode);
  }
  setSize() {
    if (this.selectedSize == "1") {
      this.height = 120;
      this.width = 120;
    }
    if (this.selectedSize == "2") {
      this.height = 512;
      this.width = 512;
    }
    if (this.selectedSize == "3") {
      this.height = 1024;
      this.width = 1024;
    }
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
