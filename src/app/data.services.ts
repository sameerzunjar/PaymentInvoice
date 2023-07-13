import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { InMemoryDbService } from 'angular-in-memory-web-api';
@Injectable({
  providedIn: 'root'
})
export class DataService implements InMemoryDbService {
  constructor(private datePipe: DatePipe) { }
  createDb() {
    return {
      payment_request: [
        {
            valueDate: this.datePipe.transform('07/13/2023','MM-dd-yyyy'),
            totalAmount: 10021,
            currency: 'EUR',
            invoiceNumber: 'INV12121',
            supplierName: 'Inv International Ltd',
            invoiceDate: this.datePipe.transform('07/08/2023','MM-dd-yyyy'),
            status: 'Approved'
        }
      ]
    }
 }
}