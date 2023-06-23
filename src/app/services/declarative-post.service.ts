import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPost } from '../models/IPost';
import { Subject, combineLatest, map } from 'rxjs';
import { CategoryService } from './category.service';
import { DeclarativeCategoryService } from './declarative-category.service';

@Injectable({
  providedIn: 'root',
})
export class DeclarativePostService {
  posts$ = this.http.get<IPost[]>(
    `https://angular-rxjsreactive-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json`
  );

  postWithCategory$ = combineLatest([
    //can also be done with forkJoin
    this.posts$,
    this.categoryService.categories$,
  ]).pipe(
    map(([posts, categories]) => {
      return posts.map((post) => {
        return {
          ...post,
          categoryName: categories.find(
            (category) => category.id === post.categoryId
          )?.title,
        } as IPost;
      });
    })
  );

  private selectedPostSubject = new Subject<string>();
  selectedPostAction$ = this.selectedPostSubject.asObservable();

  constructor(
    private http: HttpClient,
    private categoryService: DeclarativeCategoryService
  ) {}

  post$ = combineLatest([
    this.postWithCategory$,
    this.selectedPostAction$,
  ]).pipe(
    map(([posts, selectedPostId]) => {
      return posts.find((post) => post.id === selectedPostId);
    })
  );

  selectPost(postId: string) {
    this.selectedPostSubject.next(postId);
  }
}
