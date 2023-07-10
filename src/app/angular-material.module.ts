import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar'; 
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
const materialModules = [
  MatIconModule,
  MatListModule,
  MatDividerModule,
  MatTableModule,
  MatPaginatorModule,
  MatButtonModule,
  MatInputModule,
  MatFormFieldModule,
  MatProgressBarModule,
  MatToolbarModule
];
@NgModule({
  imports: [CommonModule, ...materialModules],
  exports: [...materialModules],
})
export class AngularMaterialModule {}