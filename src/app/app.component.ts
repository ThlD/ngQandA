import {Component, OnInit} from '@angular/core';
import {AuthService} from './auth/auth.service';
import {NavigationEnd, Router} from '@angular/router';
import {User} from './auth/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  isButtonVisible = false;
  isAuth: boolean;
  user: User;

  constructor(private authService: AuthService,
              private router: Router) {}

  ngOnInit() {
    this.authService.initAuthListener();
    // this.isAuth = this.authService.isAuth();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isButtonVisible = event.url === '/home';
      }
    });
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.isAuth = !!user;
      // console.log(this.isAuth);

      // return this.user = user;

    });
  }

  logout() {
    this.authService.logout();
  }
}
