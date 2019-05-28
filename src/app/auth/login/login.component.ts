import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../auth.service';
import {Subscription} from 'rxjs';
import {UiService} from '../../shared/services/ui.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isLoading = false;
  private loadingSub: Subscription;

  constructor(private authService: AuthService,
              private uiService: UiService) { }

  ngOnInit() {
    this.loadingSub = this.uiService.isLoadingChange.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
  }

  login(form: NgForm) {
    this.authService.login({
      email: form.value.email,
      password: form.value.password
    });
  }

  socialLoginByGoogle() {
    this.authService.socialLoginByGoogle();
  }

  socialLoginByGithub() {
    this.authService.socialLoginByGithub();
  }

}
