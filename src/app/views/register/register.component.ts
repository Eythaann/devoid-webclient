import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { ApiService } from '../../services/api/api.service';
import { Title } from '@angular/platform-browser';
import { registeri } from '../../models/login.interface';
import { Router } from '@angular/router'
import { MetaService } from 'src/app/services/meta.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {

  public registerForm: FormGroup;

  constructor(
    private api: ApiService,
    private title: Title,
    private meta: MetaService,
    private router: Router,
    ) {
      this.title.setTitle('Register - Devoid')
      this.meta.generateTags({
        title:'Registro en Devoid',
        description:'Registrate en Devoid, la mejor tienda de hodies de latinoamerica'
    })
  
    this.registerForm = new FormGroup({
      username: new FormControl('', [Validators.required,Validators.minLength(3), Validators.maxLength(30)]),
      email: new FormControl('', [Validators.required,Validators.email,Validators.maxLength(40)]),
      password: new FormControl('', [Validators.required,Validators.minLength(8),Validators.maxLength(30)]),
    });

    }

  

  registerError!:any;
  
  ngOnInit(): void {}

  onRegister(form: registeri) {
    if(this.registerForm.valid){
      this.api.registerByEmail(form).subscribe((data) => {
        console.log(data);
        let {auth,token,user,error} = data;
        if(auth === true){ 
          localStorage.setItem('token', token);
          localStorage.setItem('user', user);
          this.router.navigate(['store']);
        }else{
          this.registerError = error
        }
      });
    } else{
      this.registerForm.markAllAsTouched();
    }
  }

}
