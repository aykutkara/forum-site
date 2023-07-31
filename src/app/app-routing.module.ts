import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ForumTopicsComponent} from "./components/forum-topics/forum-topics.component";
import {TopicComponent} from "./components/topic/topic.component";
import {BestTagsComponent} from "./components/best-tags/best-tags.component";

const routes: Routes = [
  { path: '', redirectTo: '/topics', pathMatch: 'full' },
  { path: 'topics', component: ForumTopicsComponent },
  { path: 'topic/:id', component: TopicComponent },
  { path: 'best-tags/:index', component: BestTagsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
