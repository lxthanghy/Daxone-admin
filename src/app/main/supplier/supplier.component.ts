import { Component, OnInit } from '@angular/core';
import { SupplierService } from '../../services/supplier.service';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
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
  displayDetail: boolean = false;
  displayEdit: boolean = false;
  displayAdd: boolean = false;
  formAdd: FormGroup;
  formEdit: FormGroup;
  suppliers: any;
  id_Edit = 0;
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private supplierService: SupplierService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService
  ) {}
  ngOnInit(): void {
    this.formAdd = this.fb.group({
      name: this.fb.control('', [Validators.required]),
      address: this.fb.control('', [Validators.required]),
      email: this.fb.control('', [Validators.required, Validators.email]),
      phone: this.fb.control('', [Validators.required]),
      status: this.fb.control(true),
    });
    this.formEdit = this.fb.group({
      name: this.fb.control('', [Validators.required]),
      address: this.fb.control('', [Validators.required]),
      email: this.fb.control('', [Validators.required, Validators.email]),
      phone: this.fb.control('', [Validators.required]),
      status: this.fb.control(true),
    });
    this.getAll();
  }
  getAll(): void {
    this.spinner.show();
    this.supplierService
      .getAll()
      .pipe(first())
      .subscribe((data) => {
        this.suppliers = data;
        this.spinner.hide();
      });
  }
  onAdd(): void {
    //console.log(this.formAdd.value);
    this.supplierService
      .addSupplier(this.formAdd.value)
      .pipe(first())
      .subscribe((res) => {
        if (res > 0) {
          this.messageService.add({
            severity: 'success',
            summary: 'Thông báo',
            detail: 'Thêm thành công !',
          });
          this.displayAdd = false;
          this.clearModalAdd();
          this.getAll();
        }
      });
  }
  onEdit(id: any): void {
    this.spinner.show();
    this.supplierService
      .getSupplier(id)
      .pipe(first())
      .subscribe({
        next: (supplier) => {
          //console.log(supplier);
          this.displayEdit = true;
          this.id_Edit = supplier.id;
          this.formEdit = this.fb.group({
            name: this.fb.control(supplier.name, [Validators.required]),
            address: this.fb.control(supplier.address, [Validators.required]),
            email: this.fb.control(supplier.email, [
              Validators.required,
              Validators.email,
            ]),
            phone: this.fb.control(supplier.phone, [Validators.required]),
            status: this.fb.control(supplier.status),
          });
          this.spinner.hide();
        },
        error: (err) => {
          console.log(err);
          this.spinner.hide();
        },
      });
  }
  onSave(): void {
    if (this.id_Edit > 0) {
      this.supplierService
        .updateSupplier(this.id_Edit, this.formEdit.value)
        .pipe(first())
        .subscribe({
          next: (res) => {
            console.log(res);
            if (res > 0) {
              this.messageService.add({
                severity: 'success',
                summary: 'Thông báo',
                detail: 'Cập nhật thành công !',
              });
              this.displayEdit = false;
              this.getAll();
            }
          },
          error: (err) => {
            console.log(err);
          },
        });
    }
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
  confirmDelete(id: any) {
    this.confirmationService.confirm({
      header: 'Xoá nhà cung cấp ?',
      message: 'Bạn có chắc chắn xoá ?',
      accept: () => {
        this.supplierService
          .deleteSupplier(id)
          .pipe(first())
          .subscribe({
            next: (res) => {
              //console.log(res);
              if (res > 0) {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Thông báo',
                  detail: 'Đã xoá thành công !',
                });
                this.getAll();
              }
            },
            error: (err) => {
              console.log(err);
            },
          });
      },
    });
  }
}
