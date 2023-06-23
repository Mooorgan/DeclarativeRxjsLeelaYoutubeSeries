import { Component } from '@angular/core';
import { combineLatest, map, tap } from 'rxjs';
import { IPost } from 'src/app/models/IPost';
import { DeclarativePostService } from 'src/app/services/declarative-post.service';

@Component({
  selector: 'app-alt-posts',
  templateUrl: './alt-posts.component.html',
  styleUrls: ['./alt-posts.component.scss'],
})
export class AltPostsComponent {
  posts$ = this.postService.postWithCategory$.pipe(
    tap((posts) => {
      posts[0].id && this.postService.selectPost(posts[0].id);
    })
  );
  selectedPost$ = this.postService.post$;

  vm$ = combineLatest([this.posts$, this.selectedPost$]).pipe(
    map(([posts, selectedPost]) => {
      return { posts, selectedPost };
    })
  );
  constructor(private postService: DeclarativePostService) {}

  onSelectPost(post: IPost, event: Event) {
    event.preventDefault();
    console.log(post);
    this.postService.selectPost(post.id);
  }
}
