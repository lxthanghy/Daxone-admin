import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ProductComponent } from '../product/product.component';
const routes: Routes = [
  {
    path: '',
    component: ProductComponent,
  },
];
@NgModule({
  declarations: [ProductComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class ProductModule {}
