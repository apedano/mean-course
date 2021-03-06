import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { mimeType } from './mime-type.validator';

@Component({
  templateUrl : './post-create.component.html',
  styleUrls : ['./post-create.component.css'],
  selector : 'app-post-create'
})
export class PostCreateComponent implements OnInit {

  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = 'create';
  private postId: string;


  constructor(public postsService: PostsService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.form = new FormGroup({
      'title': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      'content': new FormControl(null, {validators: [Validators.required]}),
      'image': new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]}) // we validate the file in asynch way
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath
          };
          this.isLoading = false;
          this.imagePreview = postData.imagePath;
          // set values of all form controls
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath
          });
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });

  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file}); // this is a file object
    this.form.get('image').updateValueAndValidity(); // re run validators
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);

  }

  onSavePost() {
    console.log('submit post');
    if (this.form.invalid) {
      console.log('form invalid');
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
        );
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
        );
    }
    this.form.reset();
  }
}
