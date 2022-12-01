import { Component, OnInit, Input, Inject, ElementRef, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { PictureDoneService } from '../picture-done.service';
import { Subscription } from 'rxjs';
import { ThisReceiver } from '@angular/compiler';
import { CanvasValuesService } from '../canvas-values.service';


@Component({
  selector: 'app-picture',
  templateUrl: './picture.component.html',
  styleUrls: ['./picture.component.css']
})
export class PictureComponent implements OnInit {
  private subscriptionName: Subscription;
 cnvsHeight:number = 120;
 cnvsWidth:number = 120;
  @ViewChild('can', { static: true })

  canvas: ElementRef<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D;

  constructor(@Inject(DOCUMENT) document: Document, private Service: PictureDoneService) {
    this.subscriptionName = this.Service.getUpdate().subscribe
      (message => {
        this.createPicture(message.text);
        this.cnvsHeight = message.height;
        this.cnvsWidth = message.width;
      });
  }

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
  }
  createPicture(img:string) {
      var pics = img.split(';');
      pics.forEach(x => {
        let temp = x.split(',');
        //(50 + 8 * (int)xyv.Item3) % 254, (200 + 5 * (int)xyv.Item3) % 254, (200 + 10 * (int)xyv.Item3) % 254)
        let r = (50 + 8 * parseInt(temp[2])) % 254;
        let g = 200 + 5 * parseInt(temp[2]) % 254;
        let b = 200 + 10 * parseInt(temp[2]) % 254;
        this.ctx.fillStyle = this.rgbToHex(r,g,b);
        this.ctx.fillRect(parseInt(temp[0]),parseInt(temp[1]),1,1);
      })
    }

  rgbToHex(r: number, g: number, b: number): string {
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
  }


  ngOnDestroy() { // It's a good practice to unsubscribe to ensure no memory leaks
    this.subscriptionName.unsubscribe();
  }
}
