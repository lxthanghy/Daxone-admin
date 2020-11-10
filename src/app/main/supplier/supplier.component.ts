import { Component, OnInit } from '@angular/core';
import { SupplierService } from '../../services/supplier.service';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { first } from 'rxjs/operators';
@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css'],
  providers: [MessageService, ConfirmationService, FormBuilder],
})
export class SupplierComponent implements OnInit {
  displayEdit: boolean = false;
  displayAdd: boolean = false;
  formAdd: FormGroup;
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private supplierService: SupplierService,
    private fb: FormBuilder
  ) {}
  ngOnInit(): void {
    this.formAdd = this.fb.group({
      name: this.fb.control('', [Validators.required]),
      address: this.fb.control('', [Validators.required]),
      email: this.fb.control('', [Validators.required, Validators.email]),
      phone: this.fb.control('', [Validators.required]),
      status: this.fb.control(true),
    });
  }
  onAdd(): void {
    this.displayAdd = false;
    this.clearModalAdd();
    //console.log(this.formAdd.value);
    // this.supplierService
    //   .addSupplier(this.formAdd.value)
    //   .pipe(first())
    //   .subscribe((res) => {
    //     if (res > 0) {
    //       this.messageService.add({
    //         severity: 'success',
    //         summary: 'Thông báo',
    //         detail: 'Thêm thành công !',
    //       });
    //     }
    //   });
  }
  clearModalAdd() {
    this.formAdd = this.fb.group({
      name: this.fb.control('', [Validators.required]),
      address: this.fb.control('', [Validators.required]),
      email: this.fb.control('', [Validators.required, Validators.email]),
      phone: this.fb.control('', [Validators.required]),
      status: this.fb.control(true),
    });
  }
  confirmDelete() {
    this.confirmationService.confirm({
      header: 'Xoá nhà cung cấp ?',
      message: 'Bạn có chắc chắn xoá ?',
      accept: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Thông báo',
          detail: 'Đã xoá thành công !',
        });
      },
    });
  }
}
