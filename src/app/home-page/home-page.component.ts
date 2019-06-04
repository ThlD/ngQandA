import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {Observable, Subject, Subscription} from 'rxjs';
import {UiService} from '../shared/services/ui.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  questions: any;
  currentUserName: string;
  userNameSub: Subscription;
  isLoading = false;
  loadingSub: Subscription;


  constructor(private authService: AuthService,
              private uiService: UiService) { }

  ngOnInit() {
    this.loadingSub = this.uiService.isLoadingChange.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
    this.authService.fethUserName();
    this.userNameSub = this.authService.userName.subscribe(name => this.currentUserName = name);
  }
}
