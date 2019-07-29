import { Component, OnInit } from '@angular/core';
import {Subscription} from 'rxjs';
import {User} from '../auth/user.model';
import {UiService} from '../shared/services/ui.service';
import {QuestionService} from '../shared/services/question.service';
import {AuthService} from '../auth/auth.service';
import {NgForm} from '@angular/forms';
import {Question} from '../shared/interfaces/question.interface';
import {ActivatedRoute, Router} from '@angular/router';
import {AngularFirestore} from '@angular/fire/firestore';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.scss']
})
export class EditQuestionComponent implements OnInit {
  id: string;
  private subId: Subscription;
  question: Question;
  isLoading = false;
  loadingSub: Subscription;
  typeOfCategories: string[] = ['html', 'css', 'js'];
  user: User;

  constructor(private route: ActivatedRoute,
              private db: AngularFirestore,
              private uiService: UiService,
              private qService: QuestionService,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.loadingSub = this.uiService.isLoadingChange.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
    this.uiService.isLoadingChange.next(true);
    this.subId = this.route.params.pipe(take(1)).subscribe(params => {
      this.id = params.id;
      this.db.doc(`questions/${this.id}`).get().subscribe(data => {
        this.question = data.data() as Question;
        console.log(this.question);
        this.uiService.isLoadingChange.next(false);
      });

    });
    this.authService.user$.subscribe(user => this.user = user);
  }

  updateQuestion(form: NgForm) {
    console.log(form.value);
    // console.log(this.currentUserName);
    const updatedQuestion: Question = {
      title: form.value.title,
      description: form.value.description,
      categories: form.value.categories,
      id: this.id
    };
    this.qService.editQuestion(updatedQuestion);
    this.router.navigate([`/question/${this.id}`]);
  }

  isSelected(category) {
    return this.question.categories.indexOf( category ) !== -1;
  }

}
