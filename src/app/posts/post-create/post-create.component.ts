import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Post } from '../post.module';
import { PostsService } from '../posts.service';
import { format } from 'util';

@Component({
  templateUrl : './post-create.component.html',
  styleUrls : ['./post-create.component.css'],
  selector : 'app-post-create'
})
export class PostCreateComponent {

  constructor(public postsService: PostsService) {}

  onAddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.postsService.addPost(form.value.title, form.value.content);
    form.resetForm();
  }
}
