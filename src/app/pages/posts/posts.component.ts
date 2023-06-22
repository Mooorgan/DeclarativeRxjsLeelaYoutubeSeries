import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { IPost } from 'src/app/models/IPost';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostsComponent implements OnInit, OnDestroy {
  posts!: IPost[];
  // { categoryId: '123', id: '12', description: 'abc', title: 'haha' },
  postSubscription!: Subscription;
  constructor(
    private postService: PostService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.postService.getPostsWithCategory().subscribe((data) => {
      this.posts = data;
      this.ref.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.postSubscription && this.postSubscription.unsubscribe();
  }
}
