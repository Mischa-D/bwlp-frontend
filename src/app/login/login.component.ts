import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material';
import {LoginDialogComponent} from '../login-dialog/login-dialog.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoginService} from '../login.service';
import {Router} from '@angular/router';
import { ThriftService } from '../thrift.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [ ]
})
export class LoginComponent implements OnInit {
  submitted = false;
  loginForm: FormGroup;
  loginfailed = false;
  satfailed = false;
  constructor(public dialog: MatDialog,
              private formBuilder: FormBuilder,
              private loginservice: LoginService,
              private thriftservice: ThriftService,
              private router: Router) { }

  openDialog(): void {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(address => {
      this.thriftservice.setSat(address).then((token: any) => {
          sessionStorage.setItem('sat', address);
          this.router.navigate([`/tb`]);
        }, error => {
          console.log(error.error);
          this.satfailed = true;
        });
    });
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      password: ['', Validators.required],
      user: ['', Validators.required]
    });
  }

  get form() {
    return this.loginForm.controls;
  }

  // login with fixed testaccount user
  login() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.loginservice.login(this.form.user.value, this.form.password.value).subscribe((clientSessionData: ClientSessionData) => {
      sessionStorage.setItem('user', JSON.stringify(clientSessionData));
      this.loginfailed = false;
      this.satfailed = false;
      this.openDialog();
    }, error => {
      console.log(error.error);
      this.loginfailed = true;
    });
  }

}
