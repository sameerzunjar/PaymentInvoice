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
      this.uploadFileEvt(this.imgBase64Path)
    };
    this.fileInput.nativeElement.value = '';
  } else {
    this.fileAttr = 'Choose File';
  }
}

  uploadFileEvt(imgBase64Path: String) {
    let valueDate: Date;
    let totalAmount: number;
    let currency: String;
    let invoiceNumber: String;
    let supplierName: String;
    let invoiceDate: Date;
    const headers = { 'Authorization': 'Bearer ya29.a0AbVbY6P9IbmuIDvK3GVBTy0KP-E_wSjGxqqMyXDRZqIE5CkCWm1OAWVDSEQ4t3dgLFlma3G2LEzNGddMAysfvyB3kvJS09iizXkEJkBjRKcQIRWadf2asDc5P9ii0FpCHNjD1RtAyEGA8creUskR1OEjbPMYpakaCgYKAX0SARESFQFWKvPlgtlSWq3TayFM1eF-bpGMGA0166', 'Content-Type': 'application/json; charset=utf-8' };
    const body = { "inlineDocument": {"mimeType": this.mimeType , "content": imgBase64Path} };
    this.http.post<any>('https://us-documentai.googleapis.com/v1/projects/367518486544/locations/us/processors/37135df78beb4591:process', body, { headers }).subscribe(data => {
        console.log(data.document);
        data.document.entities.forEach(function(entity) {
          if (entity.type == 'due_date') {
            valueDate=entity.normalizedValue.text
          }
          if (entity.type == 'invoice_date') {
            invoiceDate = entity.normalizedValue.text;
         }
        });
        this.pService.addPayment(
          new PaymentSummary(0, valueDate, totalAmount, currency, invoiceNumber,
            supplierName,invoiceDate,'Pending Approval')
        );
        this.pService.getPayments().subscribe(payments => console.log(payments));
    });
  }
}