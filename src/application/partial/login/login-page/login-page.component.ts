import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginInfo } from 'src/application/shared/interface/login-info';
import { PublicVarService } from 'src/application/shared/services/public-var.service';
import { LoginVarService } from '../login-var.service';

@Component({
 selector: 'app-login-page',
 templateUrl: './login-page.component.html',
 styleUrls: [ './login-page.component.scss' ],
})
export class LoginPageComponent implements OnInit {
 @ViewChild('userName', { static: false })
 userName: ElementRef;
 loginForm: FormGroup;
 passwordShown: boolean = false;
 isLoginDataValid = true;
 valueUsername = '';
 constructor(public publicVar: PublicVarService, private httpClient: HttpClient, public loginVar: LoginVarService) {}

 ngOnInit() {
  this.loginForm = new FormGroup({
   userName: new FormControl('', [
    Validators.required,
    Validators.pattern('^(0{1}9{1}[0-9]{9})|([A-Za-z0-9._%+-]+@[a-z0-9.-]+[.]+[a-z]{2,3})$'),
   ]),
   password: new FormControl('', [ Validators.required, Validators.minLength(6) ]),
   noRobat: new FormControl(false, Validators.requiredTrue),
  });
 }
 // --- effect for password show ----

 onSubmitLogin(user, pass) {
  console.log(this.loginForm);
  const userName = user;
  const password = pass;
  const url =
   this.publicVar.baseUrl +
   ':' +
   this.publicVar.portApi +
   '/api/user/LoadUser?Username=' +
   userName +
   '&UserPassword=' +
   password;
  console.log(url);

  this.httpClient.get(url).toPromise().then((response) => {
   console.log('responsePrimery: ' + response);
   console.log('typeof==>...' + typeof response);
   if (response !== 'null') {
    const result: LoginInfo = JSON.parse(response.toString());
    console.log('loginfooo==>' + result);

    localStorage.setItem('login', response as string);
    const lenResult = Object.keys(result).length;
    this.loginVar.loginValue = result;
    if (lenResult > 0) {
     this.publicVar.isOpenLogin = false;
     this.publicVar.isauthenticate = true;
     this.isLoginDataValid = true;
    }
   } else {
    console.log('?????? ???????????? ???? ?????? ???????? ???????????? ??????.');
    this.isLoginDataValid = false;
    this.publicVar.isauthenticate = false;
   }
  });
 }

 showForgetPass() {
  this.loginForm.reset();
  this.loginVar.isOpenLoginPage = false;
  this.loginVar.isOpenForgetPass = true;
 }

 showSignIn() {
  this.loginForm.reset();
  this.loginVar.isOpenSignin = true;
 }

 uncheckRobot() {
  this.loginForm.controls['noRobat'].setValue(null);
 }
}
