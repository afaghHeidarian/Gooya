import { Component, OnInit, DoCheck } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LoginVarService } from '../login-var.service';
import { LoginComponent } from '../login.component';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit, DoCheck {
  changePassForm: FormGroup;
  passwordShownNew = false;
  passwordShownRepeat = false;
  passwordShownOld = false;
  errorMessage = '';
  constructor(
    private httpClient: HttpClient,
    public loginVar: LoginVarService,
    private logincomp: LoginComponent
  ) {}

  ngOnInit() {
    this.fromValidator();
  }
  ngDoCheck() {
    if (this.changePassForm.touched && this.changePassForm.valueChanges) {
      this.showErrorMessage();
    }
  }
  MatchValidatorPass(confirmInput: string) {
    let confirmControls: FormControl;
    let Controls: FormControl;

    return (control: FormControl) => {
      if (!control.parent) {
        return null;
      }

      if (!confirmControls) {
        confirmControls = control;
        Controls = control.parent.get(confirmInput) as FormControl;
        Controls.valueChanges.subscribe(() => {
          confirmControls.updateValueAndValidity();
        });
      }

      if (Controls.value !== confirmControls.value) {
        return {
          notMatch: true,
        };
      }
      return null;
    };
  }
  fromValidator() {
    this.changePassForm = new FormGroup({
      oldPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      newPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      repeatNewPassword: new FormControl('', [
        Validators.required,
        this.MatchValidatorPass('newPassword'),
      ]),
      noRobat: new FormControl(false, Validators.requiredTrue),
    });
  }
  showErrorMessage() {
    const form = this.changePassForm;
    if (
      form.controls.newPassword.invalid &&
      form.controls.newPassword.touched
    ) {
      if (form.controls.newPassword.getError('required')) {
        this.errorMessage = '???????? ???????? ?????? ???????? ???????????? ?????? .';
      } else if (form.controls.newPassword.getError('minlength')) {
        this.errorMessage = '?????????????? ???????? ?????????? 6 ?????????????? ????????.';
      }
    } else if (
      form.controls.repeatNewPassword.invalid &&
      form.controls.repeatNewPassword.touched
    ) {
      if (form.controls.repeatNewPassword.getError('required')) {
        this.errorMessage = '???????? ???????? ?????????? ?????????????? ???????????? ?????? . ';
      } else if (form.controls.repeatNewPassword.getError('notMatch')) {
        this.errorMessage = '?????????????? ?? ?????????? ????  ?????????? ?????? ????????.';
      }
    }
  }
  onSubmitChangePass() {
    this.logincomp.closeLogin();
  }
}
