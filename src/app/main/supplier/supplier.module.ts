import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ReactiveFormsModule } from '@angular/forms';
import {
  NgbPaginationModule,
  NgbAlertModule,
} from '@ng-bootstrap/ng-bootstrap';
import { SupplierComponent } from './supplier.component';
const routes: Routes = [
  {
    path: '',
    component: SupplierComponent,
  },
];
@NgModule({
  declarations: [SupplierComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    RadioButtonModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    NgbAlertModule,
  ],
})
export class SupplierModule {}
