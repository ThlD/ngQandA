import {Injectable} from '@angular/core';
import {Question, Comment} from '../interfaces/question.interface';
import {AngularFirestore} from '@angular/fire/firestore';
import {UiService} from './ui.service';
import {map} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Injectable()
export class QuestionService {
  questionsChanged = new Subject<Question[]>();

  constructor(private db: AngularFirestore,
              private uiService: UiService) {
  }

  addQuestionOnConfirmation(question: Question) {
    this.db.collection('questions').add(question);
  }

  fetchQuestions() {
    this.uiService.isLoadingChange.next(true);
    return this.db
      .collection('questions')
      .snapshotChanges()
      .pipe(
        map(questionsListData => {
          return questionsListData.map(data => {
            return {
              id: data.payload.doc.id,
              ...data.payload.doc.data()
            } as Question;
          });
        })
      )
      .subscribe((questions: Question[]) => {
        this.uiService.isLoadingChange.next(false);
        this.questionsChanged.next([...questions]);
      });
  }

  editQuestion(question: Question) {
    this.db
      .collection('questions')
      .doc(question.id)
      .update({
        title: question.title,
        description: question.description,
        categories: question.categories,
        isApproved: false
      });
  }

  deleteQuestion(question: Question) {
    this.db
      .collection('questions')
      .doc(question.id)
      .delete();
  }

  approveQuestion(question: Question) {
    this.db
      .collection('questions')
      .doc(question.id)
      .update({
        isApproved: true,
      });
  }

  updateIsAnsweredStatus(state: boolean, qid: string) {
    this.db
      .collection('questions')
      .doc(qid)
      .update({
        isAnswered: state
      });
  }

  updateCommentsInDatabase(comments: Comment[], qid: string) {
    this.db
      .collection('questions')
      .doc(qid)
      .update({
        comments
      });
  }
}
