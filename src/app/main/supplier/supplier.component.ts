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
  checkSearch: boolean = false;
  formAdd: FormGroup;
  formEdit: FormGroup;
  suppliers: any;
  id_Edit = 0;
  totalRecords: any;
  pageSize = 2;
  page = 1;
  txtSearchName = '';
  sortByName = '';
  sortByCreatedDate = 'desc';
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
    this.loadData(1);
  }
  loadData(page): void {
    this.spinner.show();
    if (this.checkSearch == true) this.page = 1;
    else this.page = page;
    var data = {
      page: this.page,
      pageSize: this.pageSize,
      nameSearch: this.txtSearchName,
      sortByName: this.sortByName,
      sortByCreatedDate: this.sortByCreatedDate,
    };
    setTimeout(() => {
      this.supplierService
        .pagination(data)
        .pipe(first())
        .subscribe({
          next: (model) => {
            this.suppliers = model.data;
            this.totalRecords = model.totalItems;
            this.checkSearch = false;
            this.spinner.hide();
          },
          error: (err) => {
            console.log(err);
            this.spinner.hide();
            this.messageService.add({
              severity: 'error',
              summary: 'Thông báo',
              detail: `Đã có lỗi !`,
            });
          },
        });
    }, 300);
  }
  onSearch(): void {
    this.checkSearch = true;
    this.loadData(1);
  }
  onAdd(): void {
    //console.log(this.formAdd.value);
    this.supplierService
      .addSupplier(this.formAdd.value)
      .pipe(first())
      .subscribe({
        next: (res) => {
          if (res > 0) {
            this.messageService.add({
              severity: 'success',
              summary: 'Thông báo',
              detail: 'Thêm thành công !',
            });
            this.displayAdd = false;
            this.clearModalAdd();
            this.loadData(1);
          }
        },
        error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Thông báo',
            detail: `Đã có lỗi !`,
          });
        },
      });
  }
  onDetail(id: any): void {
    this.displayDetail = true;
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
              this.loadData(1);
            }
          },
          error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Thông báo',
              detail: `Đã có lỗi !`,
            });
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
  onDelete(id: any) {
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
                this.loadData(1);
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
