import {Component, OnInit} from '@angular/core';
import {ITopic} from "../../interfaces/topic.interface";
import {TopicService} from "../../services/topic.service";
import {Observable} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { AngularEditorConfig } from '@kolkov/angular-editor';
import {Router} from "@angular/router";

@Component({
  selector: 'app-forum-topics',
  templateUrl: './forum-topics.component.html',
  styleUrls: ['./forum-topics.component.scss']
})
export class ForumTopicsComponent implements OnInit {


  topics$ :Observable<ITopic[]> | any =[];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPage: number = 0;
  randomUser:number =0;

  sortType: string = 'newest';

  isModalOpen: boolean = false;

  selectedCard : ITopic | undefined;
  messageFromCardComp = '';
  // @ts-ignore
  topicForm: FormGroup;
  constructor(private topicService : TopicService,private fb:FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.getTopics();
    this.initForm();

  }
  getTopics() {
    this.topics$ = this.topicService.topics.subscribe(
      (data : ITopic[]) => {
        this.topics$ = data;
        console.log(this.topics$[this.topics$.length - 1]);
      }
    );
  }
  initForm(): void {
    this.topicForm = this.fb.group({
        title : ["",Validators.required],
        description : ["",Validators.required],
        tags:this.fb.array([])
    })
  }
  get tags(): any {
    return this.topicForm.controls['tags'];
  }
  addTag() {
    const tagsForm = this.fb.group({
        tagName: ['', Validators.required]
    });
    this.tags.push(tagsForm);
  }

  deleteTag(index: number) {
    this.tags.removeAt(index);
  }

  openModal() {
    this.isModalOpen = true;
  }
  closeModal() {
    this.isModalOpen = false;
    this.initForm();
  }

  addNewTopic() {
    if(this.selectedCard !== undefined) {
      if (this.topicForm.valid) {
        const updateTopic: ITopic = {
          id: this.selectedCard.id,
          userId: this.selectedCard.userId,
          title: this.topicForm.value.title,
          description: this.topicForm.value.description,
          views: this.selectedCard.views,
          tags: this.topicForm.value.tags.map((tag: { tagName: string; }) => tag.tagName),
          date: this.selectedCard.date
        };

        this.topicService.updateTopic(updateTopic).subscribe(
          (response) => {
            console.log('Konu güncellendi:', response);
            this.topicService.topics.subscribe((topics) => {
              this.topics$ = topics;
            });
          },
          (error) => {
            console.error('Hata oluştu:', error);
          }
        );
        this.closeModal();
      } else {
        this.topicForm.markAllAsTouched();
      }
    }
    else {
      if (this.topicForm.valid){
        this.randomUser = Math.floor(Math.random() * 5) + 1;
        const lastTopicId = this.topics$[this.topics$.length - 1].id;

        const newTopic:ITopic = {
          id: lastTopicId + 1,
          userId: this.randomUser,
          title: this.topicForm.value.title,
          description :this.topicForm.value.description,
          views: 0,
          tags:this.topicForm.value.tags.map((tag: { tagName: string; }) => tag.tagName),
          date: this.getFormattedDate()
        };

        this.topicService.addTopic(newTopic).subscribe(
          (response) => {
            console.log('Yeni konu eklendi:', response);
            this.topicService.topics.subscribe((topics) => {
              this.topics$ = topics;
            });
          },
          (error) => {
            console.error('Hata oluştu:', error);
          }
        );

        this.closeModal();
      }
      else{
        this.topicForm.markAllAsTouched();
      }
    }
  }

  deleteTopic() {
    if (this.selectedCard !== undefined){
      this.topicService.deleteTopic(this.selectedCard.id).subscribe(data => {
        this.getTopics();
      })
    }

  }
  cardClick(topic:ITopic){
    this.router.navigate(['topic',topic.id])
        .then(() => {
          console.log('Yönlendirme başarılı.');
        })
        .catch((error) => {
          console.error('Yönlendirme hatası:', error);
        });


    console.log(this.selectedCard, this.messageFromCardComp);
  }
  deleteOrEditTopic(message: string,topic: ITopic) {
    this.selectedCard = topic;
    this.messageFromCardComp = message;
    if (this.messageFromCardComp === 'delete') {
      this.deleteTopic();
    }
    else if (this.messageFromCardComp === 'edit') {
      console.log(this.selectedCard);
      this.topicForm.patchValue({
        title: this.selectedCard?.title,
        description: this.selectedCard?.description,
      });
      if (this.selectedCard?.tags !== undefined) {
        this.selectedCard?.tags.forEach((tag) => {
          this.addTag();
        });
        this.topicForm.patchValue({
          tags: this.selectedCard.tags.map((tag) => { return { tagName: tag }; }),
        });
      }

      this.openModal();
    }
  }
  getFormattedDate(): string {
    const currentTime = new Date();

    const year = currentTime.getFullYear().toString().padStart(4, '0');
    const month = (currentTime.getMonth() + 1).toString().padStart(2, '0');
    const day = currentTime.getDate().toString().padStart(2, '0');
    const hours = currentTime.getHours().toString().padStart(2, '0');
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    const seconds = currentTime.getSeconds().toString().padStart(2, '0');

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  }
  getOldestTopics() {
    this.sortType = 'oldest';
  }
  getNewestTopics() {
    this.sortType = 'newest';
  }
  getViewsLowToHigh() {
      this.sortType = 'viewsLowToHigh';
  }
  getViewsHighToLow() {
    this.sortType = 'viewsHighToLow';
  }


  get paginatedTopics(): ITopic[] {
    if (!this.topics$) return [];
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.topics$.slice(startIndex, endIndex);
  }

  get totalPages(): number[] {
    if (!this.topics$) return [];
    const totalTopics = this.topics$.length;
    this.totalPage = Math.ceil(totalTopics / this.itemsPerPage);
    return Array(this.totalPage).fill(0).map((_, index) => index + 1);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages.length) {
      this.currentPage = page;
    }
  }



  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '15rem',
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
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
  };


}

