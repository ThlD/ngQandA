import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './auth/login/login.component';
import {SignupComponent} from './auth/signup/signup.component';
import {AuthGuard} from './auth/auth.guard';
import {NewQuestionComponent} from './new-question/new-question.component';
import {HomePageComponent} from './home-page/home-page.component';
import {QuestionDetailsComponent} from './question-details/question-details.component';
import {EditQuestionComponent} from './edit-question/edit-question.component';

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  // {path: 'home', loadChildren: './home-page/home-page.module#HomePageModule', canLoad: [AuthGuard]},
  {path: 'home', component: HomePageComponent, canActivate: [AuthGuard]},
  {path: 'question/:id', component: QuestionDetailsComponent},
  {path: 'home/new-question', component: NewQuestionComponent},
  {path: 'home/edit-question/:id', component: EditQuestionComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
