import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

import { Subject } from 'rxjs';
import { routerNgProbeToken } from '@angular/router/src/router_module';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsupdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    /*return [...this.posts]; copy of array*/
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`; // template string - names used in the posts in the backend
    this.http
    .get<{message: string, posts: any}>('http://localhost:3000/api/posts' + queryParams)
    .pipe(map((postData) => {
      return postData.posts.map(post => {
        return {
          title: post.title,
          content: post.content,
          id: post._id,
          imagePath: post.imagePath
        };
      });
    }))
    .subscribe((transformedPosts) => {
      this.posts = transformedPosts; /*no need to duplicate the array from the sarver*/
      this.postsupdated.next([...this.posts]);
    }); /*the unsubscription will be handled by angular.*/
  }

  getPostUpdateListener() {
    return this.postsupdated.asObservable();
  }

  getPost(id: String) {
    // Returns the observable. The component using this request will subscribe to it
    return this.http.get<{_id: string, title: string, content: string, imagePath: string}>('http://localhost:3000/api/posts/' + id, );
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData(); // with FormaData we can combine text data and blob
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http.
    post<{message: string, post: Post }>(
      'http://localhost:3000/api/posts',
      postData)
    .subscribe((responseData) => {
      console.log(responseData.message);
      const post: Post = {
        id: responseData.post.id,
        title: title,
        content: content,
        imagePath: responseData.post.imagePath
      };
      this.posts.push(post);
      this.postsupdated.next([...this.posts]);
      this.router.navigate(['/']);
    });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if(typeof image === 'object') {
      // form data - in case it's a File object
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title); // title is the filename
    } else {
      // in case it's a string (Json), the file already exists on the serve
      postData = {id: id, title: title, content: content, imagePath: image};
    }
    this.http.put('http://localhost:3000/api/posts/' + id, postData)
    .subscribe(response => {
      const updatedPosts = [...this.posts];
      const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
      const post: Post = {id: id, title: title, content: content, imagePath: ''}
      updatedPosts[oldPostIndex] = post;
      this.posts = updatedPosts;
      this.postsupdated.next([...this.posts]);
      this.router.navigate(['/']);
    });
  }

  deletePost(postId: string) {
    /*subscribe is the method for triggering the request.*/
    this.http.delete('http://localhost:3000/api/posts/' + postId)
    .subscribe(() => {
      const updatedPost = this.posts.filter( post => post.id !== postId);
      this.posts = updatedPost;
      this.postsupdated.next([...this.posts]);
    });
  }

}
