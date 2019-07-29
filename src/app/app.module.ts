import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import {AuthService} from './auth/auth.service';
import {FormsModule} from '@angular/forms';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireAuthModule} from '@angular/fire/auth';
import { HomePageComponent } from './home-page/home-page.component';
import {UiService} from './shared/services/ui.service';
import { NewQuestionComponent } from './new-question/new-question.component';
import {QuestionService} from './shared/services/question.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatCheckboxModule, MatListModule} from '@angular/material';
import {MomentPipe} from './shared/pipes/moment.pipe';
import { QuestionDetailsComponent } from './question-details/question-details.component';
import { EditQuestionComponent } from './edit-question/edit-question.component';
import {IsAnsweredPipe} from './shared/pipes/is-answered.pipe';
import {SortByDatePipe} from './shared/pipes/sort-by-date.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    NewQuestionComponent,
    HomePageComponent,
    MomentPipe,
    IsAnsweredPipe,
    SortByDatePipe,
    QuestionDetailsComponent,
    EditQuestionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatListModule
  ],
  providers: [AuthService, UiService, QuestionService],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
