import { Injectable } from '@angular/core';
import { QueueClient, QueueServiceClient } from '@azure/storage-queue';

@Injectable({
  providedIn: 'root'
})
export class QueueServiceService {
  private queueServiceClient!: QueueServiceClient;
  public client!: QueueClient
  constructor() { }
  ngOnInit() {
    this.queueServiceClient = QueueServiceClient.fromConnectionString("DefaultEndpointsProtocol=https;AccountName=queuestorage2022;AccountKey=6gpbEog4UMyV93kavgeEJJfBTySSexyOh4+sfyC6r3++QOdSiiFDTTIPhRwiUrJq40qj/F/jWaxA+AStHnJhWw==;EndpointSuffix=core.windows.net");
    this.client = this.queueServiceClient.getQueueClient("queueclin")
  }
}
