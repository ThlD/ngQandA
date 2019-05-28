import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {AuthData} from './auth-data.model';
import {User} from './user.model';
import {UiService} from '../shared/services/ui.service';
import {Subject} from 'rxjs';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import {map} from 'rxjs/operators';

@Injectable()
export class AuthService {
  questions = new Subject<any>();
  userName = new Subject<string>();
  currentUserName = '';
  userId: string;

  constructor(private db: AngularFirestore,
              private afAuth: AngularFireAuth,
              private router: Router,
              private uiService: UiService) {
  }

  initAuthListener() {
    this.afAuth.authState.subscribe(user => {
      console.log('User', user);
      if (user) {
        this.userId = user.uid;
        console.log('UserID', this.userId);
        // console.log(user.displayName);
        this.currentUserName = user.displayName;
        // console.log('name', this.currentUserName);

      } else {
        this.currentUserName = '';
        this.router.navigate(['/login']);
      }
      this.userName.next(this.currentUserName);
    });
  }

  getUserName() {
    // const user = this.afAuth.auth.currentUser;
    const user = firebase.auth().currentUser;
    if (user) {
      this.currentUserName = user.displayName;
      this.userName.next(this.currentUserName);
    }
  }

  signup(authData: AuthData) {
    this.uiService.isLoadingChange.next(true);
    this.afAuth.auth.createUserWithEmailAndPassword(authData.email, authData.password)
      .then(() => {
        const user = this.afAuth.auth.currentUser;
        return user.updateProfile({
          displayName: authData.name
        });
      })
      .then(() => {
        return this.db.collection('users').add({
          name: authData.name,
          email: authData.email,
        });
      })
      .then(() => {
        this.currentUserName = authData.name;
        this.userName.next(authData.name);
        this.uiService.isLoadingChange.next(false);
        this.router.navigate(['/home']);
      });
  }

  login(authData: AuthData) {
    this.uiService.isLoadingChange.next(true);
    this.afAuth.auth.signInWithEmailAndPassword(authData.email, authData.password)
      .then(() => {
        this.uiService.isLoadingChange.next(false);
        this.router.navigate(['/home']);
      });
  }

  logout() {
    this.afAuth.auth.signOut();
    // this.router.navigate(['/login']);
  }

  socialLoginByGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    this.socialLogin(provider);
  }

  socialLoginByGithub() {
    const provider = new firebase.auth.GithubAuthProvider();
    this.socialLogin(provider);
  }

  private socialLogin(provider) {
    firebase.auth().signInWithPopup(provider)
      .then(() => this.router.navigate(['/home']));

  }

  createQ() {
    this.db.collection('questions').add({
      name: 'first question',
      description: `What's going on?`
    });
  }

  getQs() {
    this.db.collection(`questions`)
      .snapshotChanges()
      .pipe(
        map(data => {
          console.log('data', data);
          return data.map(qu => {
            console.log(qu.payload.doc.data());
            return qu.payload.doc.data();
          });
        })
      )
      .subscribe(questions => this.questions.next([...questions]));
  }
}
