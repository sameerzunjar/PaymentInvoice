import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from './auth.service';
import { LoginService } from './login.service';
import { RegisterService } from './register.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { ChequeBookRequestComponent } from './cheque-book-request/cheque-book-request.component';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';
import { TransferBetweenAccountsComponent } from './transfer-between-accounts/transfer-between-accounts.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { TransferHistoryComponent } from './transfer-history/transfer-history.component';
import { DepositComponent } from './deposit/deposit.component';
import { WithdrawComponent } from './withdraw/withdraw.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { AgGridModule } from 'ag-grid-angular';
import { AngularMaterialModule } from './angular-material.module';
import { UploadComponent } from './upload/upload.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { PsummaryComponent } from './psummary/psummary.component';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { DataService } from './data.services';
import { PaymentService } from './payment.services';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ChequeBookRequestComponent,
    TransactionHistoryComponent,
    TransferBetweenAccountsComponent,
    EditProfileComponent,
    TransferHistoryComponent,
    DepositComponent,
    WithdrawComponent,
    UploadComponent,
    InvoiceComponent,
    PsummaryComponent,
    FooterComponent,
    HeaderComponent,  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AgGridModule,
    HttpClientInMemoryWebApiModule.forRoot(DataService),
    AngularMaterialModule
  ],
  providers: [RegisterService, LoginService, AuthService, PaymentService, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }