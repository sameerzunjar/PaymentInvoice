import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { PaymentSummary } from '../payment.summary';
import { PaymentService } from '../payment.services';
import { Router } from '@angular/router';
const GCP_DOC_API = 'https://us-documentai.googleapis.com/v1/projects/367518486544/locations/us/processors/37135df78beb4591:process';
@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})

export class UploadComponent {
  imgBase64Path: string;
  mimeType: string;
  constructor(private http: HttpClient, private pService: PaymentService, private router: Router) {}

  @ViewChild('fileInput') fileInput: ElementRef;
  fileAttr = 'Choose File';
payment: PaymentSummary;

uploadFile(imgFile: any) {
  if (imgFile.target.files && imgFile.target.files[0]) {
    this.fileAttr = '';
    this.mimeType = imgFile.target.files[0].type;
    Array.from(imgFile.target.files).forEach((file: any) => {
      this.fileAttr += file.name + ' - ';
    });
    let imgBase64Path = '';
    // HTML5 FileReader API
    let reader = new FileReader();
    reader.readAsDataURL(imgFile.target.files[0]);
    
     reader.onload = (e: any) => {
      this.imgBase64Path = reader.result.toString().split(',')[1];
      this.uploadFileEvt()
      //this.uploadFileEvt1(this.imgBase64Path)
    };
    this.fileInput.nativeElement.value = '';
  } else {
    this.fileAttr = 'Choose File';
  }
}

uploadFileEvt() {
const headers = { 'Authorization': 'Bearer ya29.a0AbVbY6MupPqkR80EZwkTMY7Qc7oKE5lN5zL5WIWdzIKOr-OeCoy2Zt5fQ387SvNR-7SAR1N32FhaFCRWA9AQB2euSYRoZohCK_aZZEvp8q5cIXUe8mKrgBOHX8MkSDUdg74iwNwpEJZx8TNytbU4D5hRugY2z6UaCgYKAeQSARESFQFWKvPlpmXHLuudDIjf1pTAgO84mA0166', 'Content-Type': 'application/json; charset=utf-8' };
    const body = { "inlineDocument": {"mimeType": this.mimeType , "content": this.imgBase64Path} };
    this.http.post<any>(GCP_DOC_API,
    body, { headers }).subscribe(data => {
        console.log(data.document)});
    }

  uploadFileEvt1(imgBase64Path: String) {
    const headers = { 'Authorization': 'Bearer a0AbVbY6MupPqkR80EZwkTMY7Qc7oKE5lN5zL5WIWdzIKOr-OeCoy2Zt5fQ387SvNR-7SAR1N32FhaFCRWA9AQB2euSYRoZohCK_aZZEvp8q5cIXUe8mKrgBOHX8MkSDUdg74iwNwpEJZx8TNytbU4D5hRugY2z6UaCgYKAeQSARESFQFWKvPlpmXHLuudDIjf1pTAgO84mA0166', 'Content-Type': 'application/json; charset=utf-8' };
    const body = { "inlineDocument": {"mimeType": this.mimeType , "content": imgBase64Path} };
    this.http.post<any>('https://us-documentai.googleapis.com/v1/projects/367518486544/locations/us/processors/37135df78beb4591:process', body, { headers }).subscribe(data => {
        console.log(data.document);
        data.document.entities.forEach(function(entity) {
          if (entity.type == 'due_date') {
            this.payment.valueDate=entity.normalizedValue.text
          }
          if (entity.type == 'invoice_date') {
            this.payment.invoiceDate = entity.normalizedValue.text;
         }
        });
        this.pService.addPayment(this.payment);
    });
  }
}