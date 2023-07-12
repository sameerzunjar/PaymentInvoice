import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

import { TransferhistoryService } from '../transfer-history.service';
import { TransactionService } from '../transaction.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';

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
  ],
})
export class HomeComponent implements OnInit {

  msg: string;
  imgBase64Path: string;
  mimeType: string;
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
  @ViewChild('fileInput') fileInput: ElementRef;
  fileAttr = 'Choose File';

  title = 'angularmaterial';
  //Columns names, table data from datasource, pagination and sorting
  columnsToDisplay: string[] = ['Position', 'Value Date', 'Total Amount', 'Invoice Number','Invoice Date'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  @ViewChild(MatPaginator, {static: true}) paginator:any = MatPaginator;
  expandedElement: PeriodicElement | null | undefined;
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];

  constructor(public authService: AuthService,
    public userService: UserService,
    private transactionService: TransactionService,
    private transferService: TransferhistoryService,
    private router: Router,
    private http: HttpClient) {
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
    this.dataSource.paginator = this.paginator;
  }

  displayuserdetails() {
    this.userService.getUser(this.username).subscribe(() => this.ngOnInit());
  }

  getMsgFromBaby($event: any) {
    this.msg = $event;
    console.log('event fired '+ this.msg);
  }

  uploadFileEvt(imgFile: any) {
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
        //  let image = new Image();
        //  image.src = e.target.result;
        //  image.onload = (rs) => {
        //    this.imgBase64Path = e.target.result;
        //    console.log('base 64 ' + this.imgBase64Path)
        //  };
        this.imgBase64Path = reader.result.toString().split(',')[1];
      };
      //console.log('base 64: '+ reader.result);
      
      
      // Reset if duplicate image uploaded again
      this.fileInput.nativeElement.value = '';
    } else {
      this.fileAttr = 'Choose File';
    }
    
  }

  uploadFile() {
    const headers = { 'Authorization': 'Bearer ya29.a0AbVbY6O3cVuMHl9IcPjbj_dyFuXq0_eIBijkybAs-RuuogaKYj4aMbh_t9IgEzB8l4rEiORiqmpqxO5TCLrKKDmtp7GeU2YZkT_L4t-L-CgjMmhy_Ff5V3I1woJ7idhtsYJFjVBUsCCZ0KNEb3A_qgRLKM3SecIaCgYKAYASARISFQFWKvPlRQVVjenqqx6a7l2Vgbb0Iw0166', 'Content-Type': 'application/json; charset=utf-8' };
    const body = { "inlineDocument": {"mimeType": this.mimeType , "content": this.imgBase64Path} };
    this.http.post<FileDocument>('https://us-documentai.googleapis.com/v1/projects/603856389498/locations/us/processors/764144681327f99c:process', body, { headers }).subscribe(data => {
        console.log(data.document);
        const ELEMENT_DATA: PeriodicElement[] = []; 
        let valDate = '';
        let invoiceDate = '';
        data.document.entities.forEach(function(entity) {
          if (entity.type == 'due_date') {
            valDate = entity.normalizedValue.text;
          }
          if (entity.type == 'invoice_date') {
            invoiceDate = entity.normalizedValue.text;
         }

        });
        ELEMENT_DATA.push({
          position: 1,
          valueDate: valDate, 
          totalAmount: '1000.0$',
          invoiceNumber: 'INV1212',
          supplierName: 'Aaditya',
          invoiceDate: invoiceDate
        }); 
        this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
    });
  }
}

  //Columns data types
export interface PeriodicElement {
  position: number;
  valueDate: string;
  totalAmount: string;
  invoiceNumber: string;
  supplierName: string;
  invoiceDate: string;
}
// const ELEMENT_DATA: PeriodicElement[] = [
//   {
//     position: 1,
//     name: 'Hydrogen',
//     weight: 1.0079,
//     symbol: 'H',
//     description: `Hydrogen is a chemical element with symbol H and atomic number 1. With a standard
//         atomic weight of 1.008, hydrogen is the lightest element on the periodic table.`
//   }, {
//     position: 2,
//     name: 'Helium',
//     weight: 4.0026,
//     symbol: 'He',
//     description: `Helium is a chemical element with symbol He and atomic number 2. It is a
//         colorless, odorless, tasteless, non-toxic, inert, monatomic gas, the first in the noble gas
//         group in the periodic table. Its boiling point is the lowest among all the elements.`
//   }, {
//     position: 3,
//     name: 'Lithium',
//     weight: 6.941,
//     symbol: 'Li',
//     description: `Lithium is a chemical element with symbol Li and atomic number 3. It is a soft,
//         silvery-white alkali metal. Under standard conditions, it is the lightest metal and the
//         lightest solid element.`
//   }, {
//     position: 4,
//     name: 'Beryllium',
//     weight: 9.0122,
//     symbol: 'Be',
//     description: `Beryllium is a chemical element with symbol Be and atomic number 4. It is a
//         relatively rare element in the universe, usually occurring as a product of the spallation of
//         larger atomic nuclei that have collided with cosmic rays.`
//   }, {
//     position: 5,
//     name: 'Boron',
//     weight: 10.811,
//     symbol: 'B',
//     description: `Boron is a chemical element with symbol B and atomic number 5. Produced entirely
//         by cosmic ray spallation and supernovae and not by stellar nucleosynthesis, it is a
//         low-abundance element in the Solar system and in the Earth's crust.`
//   }, {
//     position: 6,
//     name: 'Carbon',
//     weight: 12.0107,
//     symbol: 'C',
//     description: `Carbon is a chemical element with symbol C and atomic number 6. It is nonmetallic
//         and tetravalent—making four electrons available to form covalent chemical bonds. It belongs
//         to group 14 of the periodic table.`
//   }, {
//     position: 7,
//     name: 'Nitrogen',
//     weight: 14.0067,
//     symbol: 'N',
//     description: `Nitrogen is a chemical element with symbol N and atomic number 7. It was first
//         discovered and isolated by Scottish physician Daniel Rutherford in 1772.`
//   }, {
//     position: 8,
//     name: 'Oxygen',
//     weight: 15.9994,
//     symbol: 'O',
//     description: `Oxygen is a chemical element with symbol O and atomic number 8. It is a member of
//          the chalcogen group on the periodic table, a highly reactive nonmetal, and an oxidizing
//          agent that readily forms oxides with most elements as well as with other compounds.`
//   }, {
//     position: 9,
//     name: 'Fluorine',
//     weight: 18.9984,
//     symbol: 'F',
//     description: `Fluorine is a chemical element with symbol F and atomic number 9. It is the
//         lightest halogen and exists as a highly toxic pale yellow diatomic gas at standard
//         conditions.`
//   }, {
//     position: 10,
//     name: 'Neon',
//     weight: 20.1797,
//     symbol: 'Ne',
//     description: `Neon is a chemical element with symbol Ne and atomic number 10. It is a noble gas.
//         Neon is a colorless, odorless, inert monatomic gas under standard conditions, with about
//         two-thirds the density of air.`
//   },
// ];

export interface FileDocument {
  document: Document;
} 
export interface Document {
   entities: Entities[];
}

export interface Entities {
  type: string,
  normalizedValue: NormalizedValue
}

export interface NormalizedValue {
  text: string;
}