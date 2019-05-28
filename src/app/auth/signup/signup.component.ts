import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';
import {UiService} from '../../shared/services/ui.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  isLoading = false;
  private loadingSub: Subscription;

  constructor(private authService: AuthService,
              private uiService: UiService) { }

  ngOnInit() {
    this.loadingSub = this.uiService.isLoadingChange.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
  }

  signup(form: NgForm) {
    this.authService.signup({
      name: form.value.name,
      email: form.value.email,
      password: form.value.password
    });
  }



}
