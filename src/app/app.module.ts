import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ForumTopicsComponent } from './components/forum-topics/forum-topics.component';
import { TopicCardComponent } from './components/topic-card/topic-card.component';
import {TruncatePipe} from "./pipes/truncate.pipe";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AngularEditorModule} from "@kolkov/angular-editor";
import { TopicComponent } from './components/topic/topic.component';
import { BestTagsComponent } from './components/best-tags/best-tags.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ForumTopicsComponent,
    TopicCardComponent,
    TruncatePipe,
    TopicComponent,
    BestTagsComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        AngularEditorModule,
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
