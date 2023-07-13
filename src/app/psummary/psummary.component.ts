import { Component, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { PaymentService } from '../payment.services';
import { PaymentSummary } from '../payment.summary';

@Component({
  selector: 'app-psummary',
  templateUrl: './psummary.component.html',
  styleUrls: ['./psummary.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PsummaryComponent {

  paymentsArray: PaymentSummary[] = []
  dataSource: MatTableDataSource<PaymentSummary>;
  constructor(private http: HttpClient, private pService: PaymentService){}
  ngOnInit() {
    this.pService.getPayments().subscribe(payments => 
      {
        this.paymentsArray = payments;
        this.dataSource = new MatTableDataSource<PaymentSummary>(this.paymentsArray);
      });
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