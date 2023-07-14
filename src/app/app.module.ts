import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from './auth.service';
import { LoginService } from './login.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
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
    HomeComponent,
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
    HttpClientInMemoryWebApiModule.forRoot(DataService, {passThruUnknownUrl: true}),
    AngularMaterialModule
  ],
  providers: [LoginService, AuthService, PaymentService, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }