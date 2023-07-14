import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PaymentService } from '../payment.services';
import { PaymentSummary } from '../payment.summary';

const GCP_DOC_API = 'https://us-documentai.googleapis.com/v1/projects/367518486544/locations/us/processors/37135df78beb4591:process';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class HomeComponent implements OnInit {

  imgBase64Path: string;
  accessToken: String = '';
  mimeType: string;
  loading = false;
  @ViewChild('fileInput') fileInput: ElementRef;
  fileAttr = 'Choose File';
  paymentsArray: PaymentSummary[] = []
  dataSource: MatTableDataSource<PaymentSummary>;
  username = localStorage.getItem("username");
  private accNo: number = +localStorage.getItem("savingAccNo");
  savingAcc: number;
  primaryAcc: number;
  savingBalanceLocal: number;
  primaryBalanceLocal: number;
  transaction: any = {
    count: 0,
    deposit: 0,
    withdrawl: 0,
    total: 0
  };
  transfer = 0;

  constructor(public authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private pService: PaymentService) {
  }

  ngOnInit(): void {

    this.getPayments();
  }

  getPayments() {
    this.pService.getPayments().subscribe(payments => {
      this.paymentsArray = payments;
      this.dataSource = new MatTableDataSource<PaymentSummary>(this.paymentsArray);
    });
  }

  approvePayment(data: PaymentSummary) {
    data.status='Approved';
    this.pService.editPayment(data);
    this.pService.getPayments().subscribe(payments => 
      {
        this.paymentsArray = payments;
        this.dataSource = new MatTableDataSource<PaymentSummary>(this.paymentsArray);
      });
  }

  rejectPayment(data: PaymentSummary) {
    data.status='Rejected';
    this.pService.editPayment(data);
    this.pService.getPayments().subscribe(payments => 
      {
        this.paymentsArray = payments;
        this.dataSource = new MatTableDataSource<PaymentSummary>(this.paymentsArray);
      });
  }

  getColumnName(data: String){
    return this.columnsMap.get(data);
  }

  uploadFile(imgFile: any) {
    this.loading = true;
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
    this.loading = false;
  }
  
    async uploadFileEvt(imgBase64Path: String) {
      let valueDate: Date;
      let totalAmount: number;
      let currency: String;
      let invoiceNumber: String;
      let supplierName: String;
      let invoiceDate: Date;
      let receiverAddress: String;
      let supplierAddress: String;
      let receiverName: String;
      let supplierAccountNumber: String;
      let supplierBankName: String;
      let supplierBic: String;

      
      //const authHeader = {'Content-Type':'application/text'};
      this.getAuthToken();
      await new Promise(f => setTimeout(f, 1000));
      console.log('token', this.accessToken);
      const headers = { 'Authorization': 'Bearer '+ this.accessToken, 'Content-Type': 'application/json; charset=utf-8' };
      //const headers = { 'Authorization': 'Bearer ya29.a0AbVbY6MINGiyZvBEFIAaVxlPmiFdqhOBCj8PovcbejcK7_GATrAPeug2lhKacfFBq-9-AtgKG4vnNqIQJEpPfJNloNHsq1h8DkiR4F-8KQ4DY6QhYhfuzS5takyWb68iqbX8V9ekQVY9cxv3DWbalGju21njHqgeqcqQh2QL5QvS3RpNhhhweu2rMDRNOH5PEhrKqWMQYwBUxztUAxTkXU2m62rsAfDJztMJUqoUbGDP8HKBexXu9nCIJ5iZUF2OnK62No4LAt8h3at4LOVJzyNHVCAngHL6s5-DJZYVGkKDJxldyfEdbq4mMLAGTS79zM65KMuSOYAsY4eEFG01kUzBNjyBtbwRbQCbvW3qQBDz_Gh0cg-Ht4fHvNq92-1JgiR83YyJJ2mP63nUBBzfHqiFcY8aCgYKAeoSARMSFQFWKvPldP8h--7tc3cdb5JOpIJDWw0418', 'Content-Type': 'application/json; charset=utf-8' };
      const body = { "inlineDocument": {"mimeType": this.mimeType , "content": imgBase64Path} };
      this.http.post<any>('https://us-documentai.googleapis.com/v1/projects/367518486544/locations/us/processors/37135df78beb4591:process', body, { headers }).subscribe(data => {
          data.document.entities.forEach(function(entity) {
            if (entity.type == 'due_date') {
              valueDate=entity.normalizedValue.text
            }
            if (entity.type == 'invoice_date') {
              invoiceDate = entity.normalizedValue.text;
            }
            if (entity.type == 'currency') {
              currency = entity.normalizedValue.text;
            }
            if (entity.type == 'invoice_id') {
              invoiceNumber = entity.mentionText;
            }
            if (entity.type == 'total_amount') {
              totalAmount = entity.normalizedValue.text;
            }
            if (entity.type == 'supplier_name') {
              supplierName = entity.mentionText;
            }
            if (entity.type == 'receiver_address') {
              receiverAddress = entity.mentionText;
            }
            if (entity.type == 'supplier_address') {
              supplierAddress = entity.mentionText;
            }
            if (entity.type == 'receiver_name') {
              receiverName = entity.mentionText;
            }
          });
          this.readMl(supplierName).subscribe(data =>
            {
              console.log(data)
              supplierAccountNumber = JSON.parse(data).iban;
              supplierBic=JSON.parse(data).bic;
              supplierBankName=JSON.parse(data).bankName;

            console.log('receiverAccountNumber', JSON.parse(data).iban);
            this.pService.addPayment(
            new PaymentSummary(0, valueDate, totalAmount, currency, invoiceNumber,
              supplierName,invoiceDate,'Pending Approval', receiverAddress, supplierAddress, receiverName, supplierAccountNumber,
              supplierBankName, supplierBic)
          );
          this.pService.getPayments().subscribe(payments => console.log(payments));
            }
            );
      });
    }

  private getAuthToken(): any {
    this.http.get('https://us-central1-hack-team-ainomads.cloudfunctions.net/function-2', { responseType: 'text' })
      .subscribe(data => this.accessToken = data.toString());
  }

    viewInvoice(data: PaymentSummary){
      this.router.navigateByUrl('/viewInvoice', { state: {data: data, username: this.username }});
    }

    readMl(supplierName: String){
      const requestbody = {"name":supplierName,"address":"","mobile":"","email":""};
      console.log('requestbody', requestbody);
      const rheaders = {'Content-Type': 'application/json; charset=utf-8' ,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods':'POST',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '600' };
    return this.http.post<any>('https://enrichment-service-3fqmg2esia-uc.a.run.app', requestbody, { headers: rheaders });
    }

  title = 'angularmaterial';
  //Columns names, table data from datasource, pagination and sorting
  columnsMap: Map<String, String> = new Map<string, string>([
    ['valueDate','Value Date'],
    ['totalAmount','Total Amount'],
    ['currency', 'Currency'],
    ['invoiceNumber','Invoice Number(s)'],
    ['supplierName','Supplier Name'],
    ['invoiceDate','Invoice Date'],
    ['status','Status']
  ]);
  columnsToDisplay: string[] = ['valueDate', 'totalAmount', 'currency', 'invoiceNumber', 'supplierName','invoiceDate','status'];
  @ViewChild(MatPaginator, {static: true}) paginator:any = MatPaginator;
  expandedElement: PaymentSummary | null | undefined;
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];

}