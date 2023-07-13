import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, catchError, retry, throwError } from "rxjs";
import { PaymentSummary } from './payment.summary';

@Injectable({
    providedIn: 'root'
  })
export class PaymentService{

    private paymentsUrl = 'api/payment_request/';
    public paymentsArray: PaymentSummary[] = [];

    constructor(private http: HttpClient){}

    getPayments(): Observable<PaymentSummary[]> {
        return this.http.get<PaymentSummary[]>(this.paymentsUrl).pipe(
          retry(2),
          catchError((error: HttpErrorResponse) => {
            console.error(error);
            return throwError(error);
          })
        );
      }
    
      addPayment(data: PaymentSummary) {
        data.id=Math.floor((Math.random()*6)+1);
        console.log(data)
        data.invoiceDate=data.invoiceDate
        data.valueDate=data.valueDate
        this.http.post<PaymentSummary>(this.paymentsUrl, data).pipe(
          catchError((error: HttpErrorResponse) => {
            console.error(error);
            return throwError(error);
          })
        ).subscribe();
      }  
    }