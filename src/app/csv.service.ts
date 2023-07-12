import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CsvService {

  public userArray: User[];

  constructor(private http: HttpClient) { }

  readCsv() {
    this.http.get('assets/test.csv', {responseType: 'text'})
    .subscribe(
        data => {
            let csvToRowArray = data.split("\n");
            for (let index = 1; index < csvToRowArray.length - 1; index++) {
              let row = csvToRowArray[index].split(",");
              this.userArray.push(new User( parseInt( row[0], 10), row[1], row[2].trim()));
            }
            console.log('users are ', this.userArray);
        },
        error => {
            console.log(error);
        }
    );
    return this.userArray;
  }
}

export class User{
  id: number;
  name: String;
  lastName: String;

  constructor(id: number, name: String, lastName: String){
    this.id = id;
    this.name = name;
    this.lastName = lastName;
  }
}
