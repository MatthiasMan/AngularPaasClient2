import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PictureDoneService {
  private subjectName = new Subject<any>();
  constructor() { }
  sendUpdate(message: string,height:number,width:number) {  
    this.subjectName.next({ text: message,height:height,width:width }); //next() will feed the value in Subject
}

getUpdate(): Observable<any> { //the receiver component calls this function 
    return this.subjectName.asObservable(); //it returns as an observable to which the receiver funtion will subscribe
}
}
