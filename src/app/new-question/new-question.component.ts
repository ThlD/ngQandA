import { Component, OnInit } from '@angular/core';
import {UiService} from '../shared/services/ui.service';
import {Subscription} from 'rxjs';
import {NgForm} from '@angular/forms';
import {QuestionService} from '../shared/services/question.service';
import {Question} from '../shared/interfaces/question.interface';
import {AuthService} from '../auth/auth.service';
import {User} from '../auth/user.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-new-question',
  templateUrl: './new-question.component.html',
  styleUrls: ['./new-question.component.scss']
})
export class NewQuestionComponent implements OnInit {
  isLoading = false;
  loadingSub: Subscription;
  typeOfCategories: string[] = ['html', 'css', 'js'];
  user: User;

  constructor(private uiService: UiService,
              private qService: QuestionService,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.loadingSub = this.uiService.isLoadingChange.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
    this.authService.user$.subscribe(user => this.user = user);
  }

  addNewQuestion(form: NgForm) {
    console.log(form.value);
    // console.log(this.currentUserName);
    const newQuestion: Question = {
      title: form.value.title,
      description: form.value.description,
      categories: form.value.categories,
      author: this.user.name,
      date: new Date(),
      isApproved: false,
      isAnswered: false,
      comments: []
    };
    this.qService.addQuestionOnConfirmation(newQuestion);
    this.router.navigate([`/home`]);
  }

}
