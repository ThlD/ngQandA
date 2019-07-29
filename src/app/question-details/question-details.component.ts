import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {take} from 'rxjs/operators';
import {AngularFirestore} from '@angular/fire/firestore';
import {Question, Comment} from '../shared/interfaces/question.interface';
import {UiService} from '../shared/services/ui.service';
import {User} from '../auth/user.model';
import {AuthService} from '../auth/auth.service';
import {QuestionService} from '../shared/services/question.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-question-details',
  templateUrl: './question-details.component.html',
  styleUrls: ['./question-details.component.scss']
})
export class QuestionDetailsComponent implements OnInit {
  id: string;
  private subId: Subscription;
  question: Question;
  comments: Comment[];
  isLoading = true;
  loadingSub: Subscription;
  user: User;
  visibility = false;

  constructor(private route: ActivatedRoute,
              private db: AngularFirestore,
              private uiService: UiService,
              private authService: AuthService,
              private qService: QuestionService,
              private router: Router) {
  }

  ngOnInit() {
    // this.loadingSub = this.uiService.isLoadingChange.subscribe(isLoading => {
    //   this.isLoading = isLoading;
    // });
    // this.uiService.isLoadingChange.next(true);
    this.subId = this.route.params.pipe(take(1)).subscribe(params => {
      this.id = params.id;
      this.db.doc(`questions/${this.id}`).get().subscribe(data => {
        this.question = {...data.data(), id: this.id} as Question;
        this.comments = this.question.comments;
        // this.uiService.isLoadingChange.next(false);
        this.isLoading = false;
      });

    });
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  deleteQuestion(question) {
    this.qService.deleteQuestion(question);
    this.router.navigate([`/home`]);
  }

  approveQuestion(question) {
    console.log(this.question);
    this.qService.approveQuestion(question);
    this.question.isApproved = true;
    console.log(this.question);
  }

  toggle() {
    this.visibility = !this.visibility;
  }

  close(form: NgForm) {
    this.visibility = false;
    form.reset();
  }

  addNewComment(form: NgForm) {
    const newComment: Comment = {
      body: form.value.comment,
      author: this.user.name,
      date: new Date(),
      isResolved: false
    };
    this.question.comments.push(newComment);
    const comments = this.question.comments;
    console.log('comments', comments);
    this.qService.updateCommentsInDatabase(comments, this.id);
    this.close(form);
  }

  changeResolveState(target, cid: number) {
    if ('checked'.indexOf(target)) {
      this.comments[cid].isResolved = target.checked;
      this.qService.updateCommentsInDatabase(this.comments, this.id);
      let isAnswered = false;
      console.log(this.comments);
      this.comments.forEach(comment => {
        if (comment.isResolved) {
          isAnswered = comment.isResolved;
        }
      });
      this.qService.updateIsAnsweredStatus(isAnswered, this.id);
    }
  }

  // console.log(state);
  // this.comments[cid].isResolved = state;
  // console.log(this.comments);
  // this.qService.updateCommentsInDatabase(this.comments, this.id);


}
