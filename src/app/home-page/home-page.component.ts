import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {Observable, Subject, Subscription} from 'rxjs';
import {UiService} from '../shared/services/ui.service';
import {IFilter, Question} from '../shared/interfaces/question.interface';
import {QuestionService} from '../shared/services/question.service';
import {User} from '../auth/user.model';
import {take} from 'rxjs/operators';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit, OnDestroy {
  questions: Question[] = [];
  qListSub: Subscription;
  currentUserName: string;
  userNameSub: Subscription;
  isLoading = false;
  loadingSub: Subscription;
  user: User;
  isFilterHidden = true;
  isSortHidden = true;
  isSettingsHidden = true;
  isAnswered: boolean | null = null;
  isNewFirst = true;
  isStringLayout = false;
  // typeOfCategories: string[] = ['html', 'css', 'js'];
  filters = [
    {
      name: 'status',
      fields: [{value: 'all', view: 'all'}, {value: 'answered', view: 'answered'}, {value: 'unanswered', view: 'unanswered'}]
    },
    {
      name: 'tag',
      fields: [{value: 'all', view: 'all'}, {value: 'html', view: 'html'}, {value: 'css', view: 'css'}, {value: 'js', view: 'js'}]
    },
    {
      name: 'time',
      fields: [{value: 'allTime', view: 'all time'}, {value: 'lastWeek', view: 'last week'}, {value: 'lastMonth', view: 'last month'}]
    }
  ];

  // appliedFilter: IFilter = {
  //   status: ['all'],
  //   tag: ['all'],
  //   time: ['allTime']
  // };

  appliedFilter: any = [
    {
      name: 'status',
      fields: ['all']
    },
    {
      name: 'tag',
      fields: ['all']
    },
    {
      name: 'time',
      fields: ['allTime']
    }
  ];


  constructor(private authService: AuthService,
              private uiService: UiService,
              private qService: QuestionService) {
  }

  ngOnInit() {
    // console.log('Home is created');
    this.loadingSub = this.uiService.isLoadingChange.subscribe(isLoading => {
      this.isLoading = isLoading;

    });
    this.authService.user$.pipe(take(2)).subscribe(user => {
      this.user = user;
      // console.log('USER', user);

      if (user) {
        this.qService.fetchQuestions();
        this.qListSub = this.qService.questionsChanged.subscribe((qList) => {
          if (this.user.roles.hasOwnProperty('admin')) {
            this.questions = qList;
          } else {
            const approvedQuestions = qList.filter(q => q.isApproved === true);
            const notApprovedQuestions = qList.filter(q => q.isApproved === false);
            const selfAndNotApprovedQuestions = notApprovedQuestions.filter(q => q.author === this.user.name);
            this.questions.push(...approvedQuestions, ...selfAndNotApprovedQuestions);
            // this.questions.push(...approvedQuestions);
            // console.log(this.questions);
          }
        });
      }
    });
  }

  deleteQuestion(question) {
    this.qService.deleteQuestion(question);
  }

  approveQuestion(question) {
    this.qService.approveQuestion(question);
  }

  filtersToggle() {
    this.isFilterHidden = !this.isFilterHidden;
    this.isSortHidden = true;
    this.isSettingsHidden = true;
  }

  sortToggle() {
    this.isSortHidden = !this.isSortHidden;
    this.isSettingsHidden = true;
    this.isFilterHidden = true;
  }

  settingsToggle() {
    this.isSettingsHidden = !this.isSettingsHidden;
    this.isFilterHidden = true;
    this.isSortHidden = true;
  }

  // isAnsweredList(value: boolean | null) {
  //   //   this.isAnswered = value;
  //   //   this.close();
  //   // }

  sortByDate(state: boolean) {
    this.isNewFirst = state;
    this.close();
  }

  changeLayout(state: boolean) {
    this.isStringLayout = state;
    this.close();
  }

  applyFilters(form: NgForm) {
    console.log(form.value);
    this.appliedFilter = form.value;
    console.log(this.appliedFilter);
  }

  private close() {
    this.isSettingsHidden = true;
    this.isFilterHidden = true;
    this.isSortHidden = true;
  }

  ngOnDestroy(): void {
    this.loadingSub.unsubscribe();
    this.qListSub.unsubscribe();
  }
}
