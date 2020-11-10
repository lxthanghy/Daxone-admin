import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ProductCategoryComponent } from './product-category.component';

const routes: Routes = [
  {
    path: '',
    component: ProductCategoryComponent,
  },
];
@NgModule({
  declarations: [ProductCategoryComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class ProductCategoryModule {}
