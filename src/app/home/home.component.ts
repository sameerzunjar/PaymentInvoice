import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

import { TransferhistoryService } from '../transfer-history.service';
import { TransactionService } from '../transaction.service';
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
  mimeType: string;
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
    public userService: UserService,
    private transactionService: TransactionService,
    private transferService: TransferhistoryService,
    private router: Router,
    private http: HttpClient,
    private pService: PaymentService) {
  }

  ngOnInit(): void {

    this.userService.getUser(this.username).subscribe(res => {
      this.savingAcc = res.savingsAccno;
      this.primaryAcc = res.primaryAccno;
      this.savingBalanceLocal = res.savingsBalance;
      this.primaryBalanceLocal = res.primaryBalance;
      localStorage.setItem("savingAccNo", this.savingAcc.toString());
    });

    this.transactionService.getTransactions(this.accNo).subscribe((res) => {
      if (res) {
        this.transaction.count = res.length;
        res.forEach(item => {
          if (item.action == 'deposit') {
            this.transaction.deposit += item.amount;
          } else {
            this.transaction.withdrawl += item.amount;
          }
        });
        this.transaction.total = this.transaction.withdrawl + this.transaction.deposit;
      }
    });

    this.transferService.getTransferHistory(this.accNo).subscribe(res => {
      if (res) {
        res.forEach(item => {
          this.transfer += item.amount;
        })
      }
    });

    this.getPayments();
  }

  getPayments() {
    this.pService.getPayments().subscribe(payments => {
      this.paymentsArray = payments;
      this.dataSource = new MatTableDataSource<PaymentSummary>(this.paymentsArray);
    });
  }

  displayuserdetails() {
    this.userService.getUser(this.username).subscribe(() => this.ngOnInit());
  }
  addPayment(data: PaymentSummary) {
    this.pService.addPayment(data);
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

      let accessToken: String
      const authHeader = {'Metadata-Flavor':'Google'};
      this.http.get('http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token', {headers:authHeader})
      .subscribe(data => accessToken=data['access_token']);
      const headers = { 'Authorization': 'Bearer '+accessToken, 'Content-Type': 'application/json; charset=utf-8' };
      //const headers = { 'Authorization': 'Bearer ya29.a0AbVbY6M7yi2uwN5ItbaUsCGVs8BBlCd9b9E2xZOHdrvKu5ayso15H3N8XO6_rR49_VQ4f7eZoJe90j1fTg-hghs26wUjrqJZ7fIEf_OdTkFuac_9mYAFwVlccHnVFbjwjrNAab2imX7aujrG8xOzetqlGS0dtE93AzH03XGykCSixOr3qHfrVuXHWGZ10cbEN8nWNcJhVmH-sQahS25o8GS0UGW5Yx3Po_hFxeOJAbd3FFSLw8-Y17HbfuOtcXzHtMBjE5g_jNSko-s8EfXUj0KQ_0ywN-W23GDlsnnD9vWzZDrglkilWnrg9S3QqSUOP_bpIwqI2maBAvXRlvXrrvXGP97URk_ckExktHZlnmi8Ff1MQeZ0jprigli1-AGFO8TsZ9T7oEvGG45pWQGQP3A2Dr0aCgYKAZ0SARESFQFWKvPlqYHSvtVlZ1DKuOvoDrXaXg0418', 'Content-Type': 'application/json; charset=utf-8' };
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
          });
          this.pService.addPayment(
            new PaymentSummary(0, valueDate, totalAmount, currency, invoiceNumber,
              supplierName,invoiceDate,'Pending Approval')
          );
          this.pService.getPayments().subscribe(payments => console.log(payments));
      });
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