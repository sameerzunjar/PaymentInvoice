import { Component, OnInit } from '@angular/core';
import { PaymentSummary } from '../payment.summary';
import { PaymentService } from '../payment.services';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  data: PaymentSummary;
  username: String;
  paymentsArray: PaymentSummary[];
  ngOnInit(): void {

    this.data = history.state.data;
    this.username = history.state.username;
  }

  constructor(private pService: PaymentService) {}

  approvePayment(data: PaymentSummary) {
    data.status='Approved';
    this.pService.editPayment(data);
    this.pService.getPayments().subscribe(payments => 
      {
        this.paymentsArray = payments;
      });
      this.paymentsArray.forEach(payment => 
        {
          if(payment.id === data.id) {
            this.data=payment;
          }
        });
  }

  rejectPayment(data: PaymentSummary) {
    data.status='Rejected';
    this.pService.editPayment(data);
    this.pService.getPayments().subscribe(payments => 
      {
        this.paymentsArray = payments;
      });
      this.paymentsArray.forEach(payment => 
        {
          if(payment.id === data.id) {
            this.data=payment;
          }
        });
  }
  // invoice: Invoice;
  // customer: Customer;

  // constructor(
  //   private loadingService: TdLoadingService,
  //   private invoicesService: InvoicesService,
  //   private customersService: CustomersService,
  //   private route: ActivatedRoute) { }

  // ngOnInit() {
  //   this.loadingService.register('invoice');
  //   this.route.params
  //     .map((params: Params) => params.invoiceId)
  //     .switchMap(invoiceId => this.invoicesService.get<Invoice>(invoiceId))
  //     .map(invoice => {
  //       this.invoice = invoice;
  //       return invoice.customerId;
  //     })
  //     .switchMap(customerId => this.customersService.get<Customer>(customerId))
  //     .subscribe(customer => {
  //       this.customer = customer;
  //       this.loadingService.resolve('invoice');
  //     });
  // }
}
