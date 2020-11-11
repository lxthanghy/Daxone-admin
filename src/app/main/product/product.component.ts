import {
  Component,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ProductService } from '../../services/product.service';
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
import { of as observableOf, fromEvent, Subject } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { FileUpload } from 'primeng/fileupload';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  providers: [MessageService, ConfirmationService, FormBuilder],
})
export class ProductComponent implements OnInit {
  displayDetail: boolean = false;
  displayEdit: boolean = false;
  displayAdd: boolean = false;
  checkSearch: boolean = false;
  formAdd: FormGroup;
  formEdit: FormGroup;
  products: any;
  id_Edit = 0;
  totalRecords: any;
  pageSize = 5;
  page = 1;
  txtSearchName = '';
  sortByName = '';
  sortByCreatedDate = 'desc';
  sortByPrice = '';
  dataSelectSupplier: any;
  dataSelectProductCategory: any;
  img_url_edit = '';
  @ViewChildren(FileUpload) files: QueryList<FileUpload>;
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private productService: ProductService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.formAdd = this.fb.group({
      name: this.fb.control('', [Validators.required]),
      price: this.fb.control(0, [Validators.required]),
      quantity: this.fb.control(0, [Validators.required]),
      supplierId: this.fb.control(null, [Validators.required]),
      categoryId: this.fb.control(null, [Validators.required]),
      promotionPrice: this.fb.control(0),
      warranty: this.fb.control(0),
      frame: this.fb.control('', [Validators.required]),
      rims: this.fb.control('', [Validators.required]),
      tires: this.fb.control('', [Validators.required]),
      weight: this.fb.control('', [Validators.required]),
      weightLimit: this.fb.control('', [Validators.required]),
      description: this.fb.control(''),
      status: this.fb.control(true),
      showOnHome: this.fb.control(true),
    });
    this.formEdit = this.fb.group({
      name: this.fb.control('', [Validators.required]),
      price: this.fb.control(0, [Validators.required]),
      quantity: this.fb.control(0, [Validators.required]),
      supplierId: this.fb.control(null, [Validators.required]),
      categoryId: this.fb.control(null, [Validators.required]),
      promotionPrice: this.fb.control(0),
      warranty: this.fb.control(0),
      frame: this.fb.control('', [Validators.required]),
      rims: this.fb.control('', [Validators.required]),
      tires: this.fb.control('', [Validators.required]),
      weight: this.fb.control('', [Validators.required]),
      weightLimit: this.fb.control('', [Validators.required]),
      description: this.fb.control(''),
      status: this.fb.control(true),
      showOnHome: this.fb.control(true),
    });
    this.loadData(1);
    this.loadDataSelectSupplier();
    this.loadDataSelectProductCategory();
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
      sortByPrice: this.sortByPrice,
    };
    setTimeout(() => {
      this.productService
        .pagination(data)
        .pipe(first())
        .subscribe({
          next: (model) => {
            this.products = model.data;
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
  loadDataSelectSupplier(): void {
    this.productService
      .getDataSelectSupplier()
      .pipe(first())
      .subscribe({
        next: (data) => {
          //console.log(data);
          this.dataSelectSupplier = data;
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
  loadDataSelectProductCategory(): void {
    this.productService
      .getDataSelectProductCategory()
      .pipe(first())
      .subscribe({
        next: (data) => {
          //console.log(data);
          this.dataSelectProductCategory = data;
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
  onSearch(): void {
    this.checkSearch = true;
    this.loadData(1);
  }
  onAdd(): void {
    this.getEncodeFromImage(this.files.first).subscribe((data: any): void => {
      let data_image = data == '' ? null : data;
      var product = this.formAdd.value;
      product.imageUrl = data_image;
      product.supplierId = parseInt(this.formAdd.get('supplierId').value);
      product.categoryId = parseInt(this.formAdd.get('categoryId').value);
      this.productService
        .addProduct(product)
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
    });
  }
  onEdit(id: any): void {
    this.spinner.show();
    this.productService
      .getEdit(id)
      .pipe(first())
      .subscribe({
        next: (product) => {
          //console.log(product);
          this.displayEdit = true;
          this.id_Edit = product.id;
          this.img_url_edit = product.imageUrl;
          this.formEdit = this.fb.group({
            name: this.fb.control(product.name, [Validators.required]),
            price: this.fb.control(product.price, [Validators.required]),
            quantity: this.fb.control(product.quantity, [Validators.required]),
            supplierId: this.fb.control(product.supplierId, [
              Validators.required,
            ]),
            categoryId: this.fb.control(product.categoryId, [
              Validators.required,
            ]),
            promotionPrice: this.fb.control(product.promotionPrice),
            warranty: this.fb.control(product.warranty),
            frame: this.fb.control(product.frame, [Validators.required]),
            rims: this.fb.control(product.rims, [Validators.required]),
            tires: this.fb.control(product.tires, [Validators.required]),
            weight: this.fb.control(product.weight, [Validators.required]),
            weightLimit: this.fb.control(product.weightLimit, [
              Validators.required,
            ]),
            description: this.fb.control(product.description),
            status: this.fb.control(product.status),
            showOnHome: this.fb.control(product.showOnHome),
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
      this.getEncodeFromImage(this.files.last).subscribe((data: any): void => {
        console.log(data);
        console.log(this.img_url_edit);
        let data_image = data == '' ? this.img_url_edit : data;
        var product = this.formEdit.value;
        product.imageUrl = data_image;
        product.supplierId = parseInt(this.formEdit.get('supplierId').value);
        product.categoryId = parseInt(this.formEdit.get('categoryId').value);
        this.productService
          .updateProduct(this.id_Edit, product)
          .pipe(first())
          .subscribe({
            next: (res) => {
              //console.log(res);
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
      });
    }
  }
  onDelete(id: any) {
    this.confirmationService.confirm({
      header: 'Xoá nhà cung cấp ?',
      message: 'Bạn có chắc chắn xoá ?',
      accept: () => {
        this.productService
          .deleteProduct(id)
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
  clearModalAdd() {
    this.formAdd = this.fb.group({
      name: this.fb.control('', [Validators.required]),
      price: this.fb.control(0, [Validators.required]),
      quantity: this.fb.control(0, [Validators.required]),
      supplierId: this.fb.control(null, [Validators.required]),
      categoryId: this.fb.control(null, [Validators.required]),
      promotionPrice: this.fb.control(0),
      warranty: this.fb.control(0),
      frame: this.fb.control('', [Validators.required]),
      rims: this.fb.control('', [Validators.required]),
      tires: this.fb.control('', [Validators.required]),
      weight: this.fb.control('', [Validators.required]),
      weightLimit: this.fb.control('', [Validators.required]),
      description: this.fb.control(''),
      status: this.fb.control(true),
      showOnHome: this.fb.control(true),
    });
  }
  public getEncodeFromImage(fileUpload: FileUpload) {
    if (fileUpload) {
      if (fileUpload.files == null || fileUpload.files.length == 0) {
        return observableOf('');
      }
      let file: File = fileUpload.files[0];
      let reader: FileReader = new FileReader();
      reader.readAsDataURL(file);
      return fromEvent(reader, 'load').pipe(
        map((e) => {
          let result = '';
          let tmp: any = reader.result;
          let baseCode = tmp.substring(tmp.indexOf('base64,', 0) + 7);
          result = file.name + ';' + file.size + ';' + baseCode;
          return result;
        })
      );
    } else {
      return observableOf(null);
    }
  }
}
