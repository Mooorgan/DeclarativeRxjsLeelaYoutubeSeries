import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPost } from '../models/IPost';
import {
  Subject,
  catchError,
  combineLatest,
  delay,
  map,
  share,
  shareReplay,
  throwError,
  timer,
} from 'rxjs';
import { CategoryService } from './category.service';
import { DeclarativeCategoryService } from './declarative-category.service';

@Injectable({
  providedIn: 'root',
})
export class DeclarativePostService {
  posts$ = this.http
    .get<IPost[]>(
      `https://angular-rxjsreactive-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json`
    )
    .pipe(
      delay(2000),
      catchError(this.handleError),
      // shareReplay(1)
      share()
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
    }),
    catchError(this.handleError)
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
    }),
    catchError(this.handleError)
  );

  selectPost(postId: string) {
    this.selectedPostSubject.next(postId);
  }

  handleError(error: Error) {
    return throwError(() => {
      return 'unknown error occurred. Please try again';
    });
  }
}
