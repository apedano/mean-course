import { Post } from './post.module';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsupdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  getPosts() {
    /*return [...this.posts]; copy of array*/
    this.http.get<{message: string, posts: Post[]}>('http://localhost:3000/api/posts')
    .subscribe((postData) => {
      this.posts = postData.posts; /*no need to duplicate the array from the sarver*/
      this.postsupdated.next([...this.posts]);
    }); /*the unsubscription will be handled by angular.*/
  }

  getPostUpdateListener() {
    return this.postsupdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = {id: null, title : title, content : content};
    this.posts.push(post);
    this.postsupdated.next([...this.posts]);
  }

}
