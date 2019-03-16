import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  /*
  posts = [
    {title : 'First post', content : 'This is the first post\s content'},
    {title : 'Second post', content : 'This is the second post\s content'},
    {title : 'Third post', content : 'This is the third post\s content'},
  ];
  */
  posts: Post[] = [];
  isLoading = false;
  totalPosts = 10;
  postsPerPage = 2;
  pageSizeOptions = [1, 2, 5, 10];
  currentPage = 1;
  private postsSub: Subscription;

  constructor(public postsService: PostsService) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage); /*initialization*/
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((posts: Post[]) => {
          this.posts = posts;
          this.isLoading = false;
      });
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

  onChangePage(pageData: PageEvent) {
    //console.log(pageData);
    this.currentPage = pageData.pageIndex + 1; // 0-based
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

}
