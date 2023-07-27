import {Component, OnInit} from '@angular/core';
import {ITopic} from "../../interfaces/topic.interface";
import {TopicService} from "../../services/topic.service";
import {Observable} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";


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


  // @ts-ignore
  topicForm: FormGroup;
  constructor(private topicService : TopicService,private fb:FormBuilder) { }

  ngOnInit(): void {
    this.topics$ = this.topicService.topics.subscribe(
      (data : ITopic[]) => {
        this.topics$ = data;
        console.log(this.topics$[this.topics$.length - 1]);
      }
    );

    this.initForm();

  }
  initForm(): void {
    this.topicForm = this.fb.group({
        title : ["",Validators.required],
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
    if (this.topicForm.valid){
      this.randomUser = Math.floor(Math.random() * 5) + 1;
      const lastTopicId = this.topics$[this.topics$.length - 1].id;

      const newTopic:ITopic = {
        id: lastTopicId + 1,
        userId: this.randomUser,
        title: this.topicForm.value.title,
        views: 0,
        tags:this.topicForm.value.tags,
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

  // Get ile paginatedTopics oluşturarak sayfalama işlevselliğini sağlamak
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


}

