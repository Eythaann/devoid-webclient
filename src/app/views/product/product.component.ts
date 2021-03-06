import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core'
import { isPlatformBrowser, isPlatformServer } from '@angular/common'
import { ApiService } from '../../services/api/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { carI, productI } from '../../models/store.interface';
import { MatDialog } from '@angular/material/dialog';
import { ProductConfirmComponent } from '../../layouts/product-confirm/product-confirm.component';
import { MetaService } from 'src/app/services/meta.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
 
  product!: productI[];
  colors!: any;
  sizes!: any;
  img!: string;
  rutpro: any = this.activatedrouter.snapshot.paramMap.get('rutpro');

  carForm = this.fb.group({
    id:     ['', Validators.required], 
    color:  ['', Validators.required],
    size:   ['', Validators.required],
    amount: ['1', Validators.required],
  });

  constructor(
    @Inject(PLATFORM_ID) private platformid: object,
    public dialog: MatDialog,
    private router: Router,
    private fb: FormBuilder,
    private activatedrouter: ActivatedRoute,
    private api: ApiService,
    private title: Title,
    private meta: MetaService,
  ) {
    this.title.setTitle('Devoid Online Store - '+ this.rutpro);
    this.meta.generateTags({
      title:`${this.rutpro} - devoid`,
      description:`${this.rutpro}, producto de devoid aprovecha para comprarlo ya!`
    })
  }
  
  ngOnInit(): void { 
    if(isPlatformBrowser(this.platformid)){
    this.api.getProduct(this.rutpro).subscribe((data) => {
      this.product = data;
      //console.log(data)
      if(this.product[0].error){
        this.router.navigate([this.rutpro])
      }else{
      //console.log(this.product[0])
      this.title.setTitle('Devoid Online Store - '+ this.product[0].product_name);
      this.carForm.get('id')?.setValue(this.product[0].product_id)
      this.img = `/assets/img/pro/${this.product[0].product_route}.jpg`;
      this.colors = JSON.parse(this.product[0].color)
      this.sizes = JSON.parse(this.product[0].size)
      }
    });
    }
  }

  onAddCar(form:carI){
    if (this.carForm.valid) {
      this.api.addCar(form).subscribe((data:any)=>{
        console.log(data)
        if(data.res===true){
          const dialogRef = this.dialog.open(ProductConfirmComponent, {});
          dialogRef.afterClosed().subscribe(res=>{
          })
        }
      })
    }else{
      this.carForm.markAllAsTouched();
    }
  }
  

  imgChange(color:any){
    this.img = `/assets/img/pro/${this.product[0].product_route}_${color}.jpg`;
  }
}
