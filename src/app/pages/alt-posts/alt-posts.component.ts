import { Component } from '@angular/core';
import { IPost } from 'src/app/models/IPost';
import { DeclarativePostService } from 'src/app/services/declarative-post.service';

@Component({
  selector: 'app-alt-posts',
  templateUrl: './alt-posts.component.html',
  styleUrls: ['./alt-posts.component.scss'],
})
export class AltPostsComponent {
  posts$ = this.postService.postWithCategory$;
  constructor(private postService: DeclarativePostService) {}

  onSelectPost(post: IPost, event: Event) {
    event.preventDefault();
    console.log(post);
    this.postService.selectPost(post.id);
  }
}
