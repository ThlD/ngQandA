import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import * as firebase from 'firebase/app';
import 'firebase/auth';

import {AuthData} from './auth-data.model';
import {UiService} from '../shared/services/ui.service';

@Injectable()
export class AuthService {
  userName = new Subject<string>();
  currentUserName = '';
  userId: string;
  private isAuthenticated = false;

  constructor(private db: AngularFirestore,
              private afAuth: AngularFireAuth,
              private router: Router,
              private uiService: UiService) {
  }

  initAuthListener() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.isAuthenticated = true;
        this.router.navigate(['/home']);
      } else {
        this.currentUserName = '';
        this.router.navigate(['/login']);
        this.isAuthenticated = false;
      }
    });
  }

  fethUserName() {
    this.uiService.isLoadingChange.next(true);
    const user = this.afAuth.auth.currentUser;
    return this.db.collection('users').doc(user.uid).get().subscribe(doc => {
      this.currentUserName = doc.data().name;
      console.log('getUserName', this.currentUserName);
      this.userName.next(this.currentUserName);
      this.uiService.isLoadingChange.next(false);
    });
  }

  getUserName() {
    return this.currentUserName;
  }

  signup(authData: AuthData) {
    this.uiService.isLoadingChange.next(true);
    this.afAuth.auth.createUserWithEmailAndPassword(authData.email, authData.password)
      .then((cred) => this.db.collection('users').doc(cred.user.uid).set({
          name: authData.name,
          email: authData.email,
          bio: 'Something about user'
        })
      )
      .then(() => {
        this.uiService.isLoadingChange.next(false);
      });
  }

  login(authData: AuthData) {
    this.uiService.isLoadingChange.next(true);
    this.afAuth.auth.signInWithEmailAndPassword(authData.email, authData.password)
      .then(() => {
        this.uiService.isLoadingChange.next(false);
      });
  }

  logout() {
    this.afAuth.auth.signOut();
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

  isAuth() {
    return this.isAuthenticated;
  }
}
