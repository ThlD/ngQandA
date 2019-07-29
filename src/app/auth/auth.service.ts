import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {Observable, of, Subject} from 'rxjs';
import * as firebase from 'firebase/app';
import 'firebase/auth';

import {AuthData} from './auth-data.model';
import {UiService} from '../shared/services/ui.service';
import {User} from './user.model';
import {switchMap, take} from 'rxjs/operators';

@Injectable()
export class AuthService {
  user$: Observable<User>;
  // userName = new Subject<string>();
  // currentUserName = '';
  userId: string;
  private isAuthenticated = false;

  constructor(private db: AngularFirestore,
              private afAuth: AngularFireAuth,
              private router: Router,
              private uiService: UiService) {
    // this.uiService.isLoadingChange.next(true);
    this.user$ = this.afAuth.authState
      .pipe(
        // take(1),
        switchMap(user => {
          // console.log(user);

          if (user) {
            // this.uiService.isLoadingChange.next(false);
            // console.log('start loading user');
            return this.db.doc<User>(`users/${user.uid}`).valueChanges();
          } else {
            // this.uiService.isLoadingChange.next(false);
            return of(null);
          }
        }));
  }

  initAuthListener() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.isAuthenticated = true;
        this.router.navigate(['/home']);
        // console.log('USERINIT', user);

      } else {
        this.isAuthenticated = false;
        this.router.navigate(['/login']);
      }
    });
  }

  // fethUserName() {
  //   this.uiService.isLoadingChange.next(true);
  //   const user = this.afAuth.auth.currentUser;
  //   return this.db.collection('users').doc(user.uid).get().subscribe(doc => {
  //     console.log(doc.data());
  //     if (doc.data()) {
  //       this.currentUserName = doc.data().name;
  //     } else {
  //       this.currentUserName = doc.data().email.split('@')[0];
  //     }
  //     // this.currentUserName = doc.data().name;
  //     console.log('getUserName', this.currentUserName);
  //     this.userName.next(this.currentUserName);
  //     this.uiService.isLoadingChange.next(false);
  //   });
  // }

  // getUserName() {
  //   return this.currentUserName;
  // }

  // signup(authData: AuthData) {
  //   this.uiService.isLoadingChange.next(true);
  //   this.afAuth.auth.createUserWithEmailAndPassword(authData.email, authData.password)
  //     .then((credential) => this.db.collection('users').doc(credential.user.uid).set({
  //         name: authData.name,
  //         email: authData.email,
  //         bio: 'Something about user'
  //       })
  //     )
  //     .then(() => {
  //       this.uiService.isLoadingChange.next(false);
  //     });
  // }

  login(authData: AuthData) {
    this.uiService.isLoadingChange.next(true);
    this.afAuth.auth.signInWithEmailAndPassword(authData.email, authData.password)
      .then(() => {
        this.uiService.isLoadingChange.next(false);
        this.router.navigate(['/home']);
      }).catch(error => {
      // console.log(error);
      this.uiService.isLoadingChange.next(false);
    });
  }

  logout() {
    this.afAuth.auth.signOut();
    // this.router.navigate(['/login']);
  }

  socialLoginByGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  socialLoginByGithub() {
    const provider = new firebase.auth.GithubAuthProvider();
    return this.oAuthLogin(provider);
  }

  signup(authData: AuthData) {
    this.uiService.isLoadingChange.next(true);

    this.afAuth.auth.createUserWithEmailAndPassword(authData.email, authData.password)
      .then((credential) => {
        const userRef: AngularFirestoreDocument<any> = this.db.doc(`users/${credential.user.uid}`);
        const data: User = {
          uid: credential.user.uid,
          email: credential.user.email,
          name: authData.name,
          roles: {
            reader: true,
            author: true
          }
        };
        // this.db.collection('users').doc(credential.user.uid).set(data, {merge: true});
        return userRef.set(data, {merge: true});
      })
      .then(() => {
        this.uiService.isLoadingChange.next(false);
        // this.router.navigate(['/home']);
      });
  }

  private oAuthLogin(provider) {
    console.log(provider);
    firebase.auth().signInWithPopup(provider)
      .then((credential) => {
        // console.log(credential.user);
        this.updateUserData(credential.user);
      });
      // .then(() => this.router.navigate(['/home']));
  }

  private updateUserData(user) {
    // console.log('UpdateUserDataUSER: ', user);
    const userRef: AngularFirestoreDocument<any> = this.db.doc(`users/${user.uid}`);
    // console.log('UserRef: ', userRef);
    const data: User = {
      uid: user.uid,
      email: user.email,
      name: user.email.split('@')[0],
      roles: {
        reader: true,
        author: true,
        admin: true
      }
    };
    return userRef.set(data, {merge: true});
    // return userRef.update(data);
    // return this.db.collection('users').doc(credential.user.uid).set({
    //   name: credential.user.email.split('@')[0],
    //   email: credential.user.email,
    //   bio: 'Something about user'
    // });
  }

  // Assign roles to an ability method
  canRead(user: User): boolean {
    const allowed = ['reader', 'author', 'admin'];
    return this.checkAuthorization(user, allowed);
  }

  canEditOrResolve(user: User): boolean {
    const allowed = ['author', 'admin'];
    return this.checkAuthorization(user, allowed);
  }

  canDeleteOrApprove(user: User): boolean {
    const allowed = ['admin'];
    return this.checkAuthorization(user, allowed);
  }


  // check AuthState
  isAuth() {
    return this.isAuthenticated;
  }

  // check if user has matching role
  private checkAuthorization(user: User, allowedRoles: string[]): boolean {
    if (!user) {
      return false;
    }
    for (const role of allowedRoles) {
      if (user.roles[role]) {
        return true;
      }
    }
    return false;
  }

}
