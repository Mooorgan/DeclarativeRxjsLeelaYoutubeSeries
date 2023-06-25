import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CRUDAction, IPost } from '../models/IPost';
import {
  BehaviorSubject,
  Observable,
  Subject,
  catchError,
  combineLatest,
  concatMap,
  delay,
  map,
  merge,
  of,
  scan,
  share,
  shareReplay,
  tap,
  throwError,
  timer,
} from 'rxjs';
import { CategoryService } from './category.service';
import { DeclarativeCategoryService } from './declarative-category.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class DeclarativePostService {
  posts$ = this.http
    .get<IPost[]>(
      `https://angular-rxjsreactive-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json`
    )
    .pipe(
      map((posts) => {
        let postsData: IPost[] = [];
        for (let id in posts) {
          postsData.push({ ...posts[id], id });
        }
        return postsData;
      }),
      // delay(2000),
      catchError(this.handleError),
      shareReplay(1)
      // share()
    );

  postWithCategory$ = combineLatest([
    //can also be done with forkJoin
    this.posts$,
    this.categoryService.categories$,
  ]).pipe(
    map(([posts, categories]) => {
      console.log(posts, 'hehe');
      return posts.map((post) => {
        return {
          ...post,
          categoryName: categories.find(
            (category) => category.id === post.categoryId
          )?.title,
        } as IPost;
      });
    }),
    catchError(this.handleError),
    shareReplay(1)
  );

  private postCRUDSubject = new Subject<CRUDAction<IPost>>();
  postCRUDAction$ = this.postCRUDSubject.asObservable();

  allPost$ = merge(
    this.postWithCategory$,
    this.postCRUDAction$.pipe(
      concatMap((postAction) =>
        this.savePosts(postAction).pipe(
          map((post) => {
            return {
              ...postAction,
              data: post,
            };
          })
        )
      )
    )
  ).pipe(
    // tap(console.log),
    scan((posts, value: IPost[] | CRUDAction<IPost>) => {
      // return [...posts, ...value];
      return this.modifyPosts(posts, value);
    }, [] as IPost[]),
    shareReplay(1)
    // map(([value1, value2]) => {
    //   console.log('HEYYY', value1, value2);
    //   return [...value1, ...value2];
    // })
  );

  modifyPosts(posts: IPost[], value: IPost[] | CRUDAction<IPost>) {
    if (!(value instanceof Array)) {
      if (value.action === 'add') {
        return [...posts, value.data];
      }
      if (value.action === 'update') {
        return posts.map((post) =>
          post.id === value.data.id ? value.data : post
        );
      }
      if (value.action === 'delete') {
        return posts.filter((post) => post.id !== value.data.id);
      }
    } else {
      return value;
    }
    return posts;
  }

  savePosts(postAction: CRUDAction<IPost>) {
    let postDetails$!: Observable<IPost>;
    if (postAction.action === 'add') {
      postDetails$ = this.addPostToServer(postAction.data).pipe(
        tap(() => {
          this.notificationService.setSuccessMessage('Post added Successfully');
        })
      );
    }
    if (postAction.action === 'update') {
      postDetails$ = this.updatePostToServer(postAction.data).pipe(
        tap(() => {
          this.notificationService.setSuccessMessage(
            'Post updated Successfully'
          );
        })
      );
    }
    if (postAction.action === 'delete') {
      return this.deletePostToServer(postAction.data).pipe(
        tap(() => {
          this.notificationService.setSuccessMessage(
            'Post deleted Successfully'
          );
        }),
        map((_) => {
          return postAction.data;
        })
      );
    }
    return postDetails$.pipe(
      concatMap((post) =>
        this.categoryService.categories$.pipe(
          map((categories) => {
            return {
              ...post,
              categoryName: categories.find(
                (category) => category.id === post.categoryId
              )?.title,
            };
          })
        )
      )
    );
  }

  deletePostToServer(post: IPost) {
    return this.http.delete(
      `https://angular-rxjsreactive-default-rtdb.asia-southeast1.firebasedatabase.app/posts/${post.id}.json`
    );
  }

  updatePostToServer(post: IPost) {
    return this.http.patch<IPost>(
      `https://angular-rxjsreactive-default-rtdb.asia-southeast1.firebasedatabase.app/posts/${post.id}.json`,
      post
    );
  }

  addPostToServer(post: IPost) {
    return this.http
      .post<{ name: string }>(
        `https://angular-rxjsreactive-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json`,
        post
      )
      .pipe(
        map((id) => {
          return {
            ...post,
            id: id.name,
          };
        })
      );
  }

  addPost(post: IPost) {
    this.postCRUDSubject.next({ action: 'add', data: post });
  }
  updatePost(post: IPost) {
    this.postCRUDSubject.next({ action: 'update', data: post });
  }

  deletePost(post: IPost) {
    this.postCRUDSubject.next({ action: 'delete', data: post });
  }

  private selectedPostSubject = new Subject<string>();
  selectedPostAction$ = this.selectedPostSubject.asObservable();

  constructor(
    private http: HttpClient,
    private categoryService: DeclarativeCategoryService,
    private notificationService: NotificationService
  ) {}

  post$ = combineLatest([this.allPost$, this.selectedPostAction$]).pipe(
    map(([posts, selectedPostId]) => {
      return posts.find((post) => post.id === selectedPostId);
    }),
    catchError(this.handleError),
    shareReplay(1)
  );

  selectPost(postId: string) {
    this.selectedPostSubject.next(postId);
  }

  handleError(error: Error) {
    console.log(error);
    return throwError(() => {
      return 'unknown error occurred. Please try again';
    });
  }
}
