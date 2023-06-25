import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, map, tap } from 'rxjs';
import { DeclarativeCategoryService } from 'src/app/services/declarative-category.service';
import { DeclarativePostService } from 'src/app/services/declarative-post.service';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostFormComponent {
  postId = '';
  postForm = new UntypedFormGroup({
    title: new UntypedFormControl(''),
    description: new UntypedFormControl(''),
    categoryId: new UntypedFormControl(''),
  });
  selectedPostId$ = this.route.paramMap.pipe(
    map((paramMap) => {
      const id = paramMap.get('id')!;
      id && (this.postId = id);
      this.postService.selectPost(id);
      return id;
    })
  );

  post$ = this.postService.post$.pipe(
    tap((post) => {
      post &&
        this.postForm.setValue({
          title: post?.title,
          description: post?.description,
          categoryId: post?.categoryId,
        });
    })
  );
  categories$ = this.categoryService.categories$;

  vm$ = combineLatest([this.selectedPostId$, this.post$]);

  // ngOnInit() {
  //   console.log(this.route);
  // }

  constructor(
    private categoryService: DeclarativeCategoryService,
    private route: ActivatedRoute, // private ref: ChangeDetectorRef
    private postService: DeclarativePostService
  ) {}

  onPostSubmit() {
    // console.log(this.postForm.value);
    let postDetails = this.postForm.value;
    if (this.postId) {
      // console.log('update post');
      postDetails = { ...postDetails, id: this.postId };
      this.postService.updatePost(postDetails);
    } else {
      // console.log('add post');
      this.postService.addPost(postDetails);
    }
  }
}