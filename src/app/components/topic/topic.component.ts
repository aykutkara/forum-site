import {Component, OnInit} from '@angular/core';
import {TopicService} from "../../services/topic.service";
import {ITopic} from "../../interfaces/topic.interface";
import {ActivatedRoute} from "@angular/router";
import {IUser} from "../../interfaces/user.interface";
import {UserService} from "../../services/user.service";
import {AngularEditorConfig} from "@kolkov/angular-editor";

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss']
})
export class TopicComponent implements OnInit {

  constructor(private topicService: TopicService,
              private route: ActivatedRoute,
              private userService : UserService) { }

  // @ts-ignore
  topicId: number;
  // @ts-ignore
  topic :ITopic | undefined;
  currentUser : IUser | undefined;

  isOpenModal: boolean = false;
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.topicId = +params['id'];
    });
    this.getTopic();
    this.getCurrentUser();

  }
  getTopic() {
    this.topicService.getTopic(this.topicId).subscribe((data: ITopic) => {
      this.topic = data;



      this.updateViewCount();
    });
  }

  getCurrentUser() {
    this.userService.getUsers().subscribe(data => {
      this.currentUser = data.find(user => user.id === this.topic?.userId);
    });
  }

  updateViewCount() {
    if (this.topic){
      this.topic.views++;
      console.log(this.topic.views,"views");
      this.topicService.updateTopic(this.topic).subscribe();
    }
  }

  openModal() {
    this.isOpenModal = true;
    console.log("click")
  }
  closeModal() {
    this.isOpenModal = false;
  }
  Config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '20rem',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter description here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      {class: 'arial', name: 'Arial'},
      {class: 'times-new-roman', name: 'Times New Roman'},
      {class: 'calibri', name: 'Calibri'},
      {class: 'comic-sans-ms', name: 'Comic Sans MS'}
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
  };
  protected readonly top = top;
  protected readonly JSON = JSON;
}
