import {Component, OnInit} from '@angular/core';
import {TopicService} from "../../services/topic.service";
import {ITopic} from "../../interfaces/topic.interface";
import {ActivatedRoute} from "@angular/router";
import {IUser} from "../../interfaces/user.interface";
import {UserService} from "../../services/user.service";
import {AngularEditorConfig} from "@kolkov/angular-editor";
import {IComment} from "../../interfaces/comment.interface";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";


@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss']
})
export class TopicComponent implements OnInit {

  constructor(private topicService: TopicService,
              private route: ActivatedRoute,
              private userService : UserService,
              private fb :FormBuilder) { }

  // @ts-ignore
  topicId: number;
  // @ts-ignore
  topic :ITopic | undefined;
  currentUser : IUser | undefined;

  comments:IComment[] | undefined = [];
  filteredComments: IComment[] = [];
  // @ts-ignore
  commentsForm: FormGroup;
  rndmUser:number =0;

  selectedComment : IComment | undefined;

  sortType: string = 'oldest';

  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPage: number = 0;
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.topicId = +params['id'];
    });
    this.getTopic();
    this.getCurrentUser();
    this.initForm();

  }
  initForm(): void {
    this.commentsForm = this.fb.group({
      cmmnt : ["",Validators.required],
    })
  }
  addComment() {
    console.log(this.selectedComment)
    if (this.selectedComment !== undefined){
      if (this.commentsForm.valid) {
        this.selectedComment.comment = this.commentsForm.value.cmmnt;
        this.topicService.updateTopic(this.topic!).subscribe(
          (response) => {
            console.log('Yorum başarıyla güncellendi.',response);
            this.getTopic();
            this.selectedComment = undefined;
          },
          (error) => {
            console.log('Yorum güncellenirken bir hata oluştu.',error);
          }
        );
        this.initForm();

      }
      else{
        this.commentsForm.markAllAsTouched();
      }
    }
    else {
      if (this.commentsForm.valid) {
        this.rndmUser = Math.floor(Math.random() * 5) + 1;
        let lastId:number;
        if (this.comments === undefined || this.comments.length === 0) {
          lastId = 0;
        }
        else {
          lastId = this.comments![this.comments!.length - 1].id;
        }
        const newComment: IComment = {
          id: lastId + 1,
          userId: this.rndmUser,
          comment: this.commentsForm.value.cmmnt,
          date: this.getFormatDate()
        }
        this.topic?.comments?.push(newComment);
        this.topicService.updateTopic(this.topic!).subscribe(
          (response) => {
            console.log('Yorum başarıyla eklendi.',response);
            this.getTopic();
          },
          (error) => {
            console.log('Yorum eklenirken bir hata oluştu.',error);
          }
        );
        this.initForm();
      }
      else{
        this.commentsForm.markAllAsTouched();
      }
    }
  }

  getTopic() {
    this.topicService.getTopic(this.topicId).subscribe((data: ITopic) => {
      this.topic = data;
      if (data.comments){
        this.comments = data.comments;
        this.filterComments();
         this.comments.forEach(comment => {
          this.getCommentedUser(comment.userId,comment);
          });
      }
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
      this.topicService.updateTopic(this.topic).subscribe();
    }
  }

  getCommentedUser(userId: number,comment:IComment | any) {
    this.userService.getUsers().subscribe(data => {
      comment.user = data.find(user => user.id === userId);
    })
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

  getFormatDate(): string {
    const Time = new Date();

    const year = Time.getFullYear().toString().padStart(4, '0');
    const month = (Time.getMonth() + 1).toString().padStart(2, '0');
    const day = Time.getDate().toString().padStart(2, '0');
    const hours = Time.getHours().toString().padStart(2, '0');
    const minutes = Time.getMinutes().toString().padStart(2, '0');
    const seconds = Time.getSeconds().toString().padStart(2, '0');

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  }

  deleteComment(crrntCmmnt: IComment) {
    this.selectedComment = crrntCmmnt;

    const newTopic:IComment[]|undefined = this.topic?.comments?.filter(comment => comment.id !== this.selectedComment?.id);
    if (newTopic !== undefined) {
      this.topic!.comments = newTopic;
      this.topicService.updateTopic(this.topic!).subscribe(
        (response) => {
          console.log('Yorum başarıyla silindi.',response);
          this.getTopic();
          this.selectedComment = undefined;
        },
        (error) => {
          console.log('Yorum silinirken bir hata oluştu.',error);
        }
      );
    }
  }
  closeModal() {
    this.selectedComment = undefined;
    this.initForm();
  }

  editComment(crrntCmmnt: IComment) {
    this.selectedComment = crrntCmmnt;
    this.commentsForm.patchValue({
      cmmnt: this.selectedComment.comment
    })
  }

  getOldestTopics() {
      this.sortType = 'oldest';
      this.filterComments();
  }
  getNewestTopics() {
      this.sortType = 'newest';
      this.filterComments();
  }

  filterComments() {
    this.filteredComments = [...this.comments!];
    if (this.sortType === 'oldest') {
      this.filteredComments.sort((a, b) => a.id - b.id);
    } else if (this.sortType === 'newest') {

      this.filteredComments.sort((a, b) => b.id - a.id);
    } else {
      this.filteredComments.sort((a, b) => a.id - b.id);
    }
  }

  get paginatedComments(): IComment[] {
    if (!this.filteredComments) return [];
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredComments.slice(startIndex, endIndex);
  }

  get totalPages(): number[] {
    if (!this.filteredComments) return [];
    const totalComments = this.filteredComments.length;
    this.totalPage = Math.ceil(totalComments / this.itemsPerPage);
    return Array(this.totalPage).fill(0).map((_, index) => index + 1);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages.length) {
      this.currentPage = page;
    }
  }
}
