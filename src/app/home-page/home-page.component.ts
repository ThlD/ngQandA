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


  constructor(private authService: AuthService,
              private uiService: UiService) { }

  ngOnInit() {
    this.userNameSub = this.authService.userName.subscribe(userName => {
      this.currentUserName = userName;
      this.authService.questions.subscribe(questions => this.questions = questions);
    });
    this.authService.getUserName();
  }

  createQ() {
    this.authService.createQ();
  }

  getQs() {
    this.authService.getQs();
  }
}
