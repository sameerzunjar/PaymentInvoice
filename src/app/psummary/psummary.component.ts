import { Component, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { HttpClient } from '@angular/common/http';
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
  public userArray: User[] = [];
  dataSource: MatTableDataSource<User>;


  constructor(private http: HttpClient){}

  ngOnInit() {
    this.http.get('../assets/test.csv', {responseType: 'text'})
    .subscribe(
        data => {
            let csvToRowArray = data.split("\n");
            for (let index = 1; index < csvToRowArray.length - 1; index++) {
              let row = csvToRowArray[index].split(",");
              this.userArray.push(new User( parseInt( row[0], 10), row[1], row[2].trim()));
            }
            console.log(this.userArray);
            this.dataSource = new MatTableDataSource<User>(this.userArray);
            this.dataSource.paginator = this.paginator;
        },
        error => {
            console.log(error);
        }
    );
  }

  title = 'angularmaterial';
  //Columns names, table data from datasource, pagination and sorting
  columnsToDisplay: string[] = ['id', 'name', 'lastname', 'symbol','valueDate','invoiceDate'];
  @ViewChild(MatPaginator, {static: true}) paginator:any = MatPaginator;
  expandedElement: User | null | undefined;
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  
}
//Columns data types
export class User{
  id: number;
  name: String;
  lastname: String;

  constructor(id: number, name: String, lastname: String){
    this.id = id;
    this.name = name;
    this.lastname = lastname;
  }
}