import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  BehaviorSubject,
  Subject,
  combineLatest,
  filter,
  from,
  map,
  mergeMap,
} from 'rxjs';
import { DeclarativeCategoryService } from 'src/app/services/declarative-category.service';
import { DeclarativePostService } from 'src/app/services/declarative-post.service';

@Component({
  selector: 'app-declarative-posts',
  templateUrl: './declarative-posts.component.html',
  styleUrls: ['./declarative-posts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeclarativePostsComponent {
  // posts$ = this.postService.posts$;
  posts$ = this.postService.postWithCategory$;
  categories$ = this.categoryService.categories$;

  selectedCategorySubject = new BehaviorSubject<string>('');
  selectedCategoryAction$ = this.selectedCategorySubject.asObservable();
  selectedCategoryId = '';

  filteredPost$ = combineLatest([
    this.posts$,
    this.selectedCategoryAction$,
  ]).pipe(
    map(([posts, selectedCategory]) => {
      return posts.filter((post) => {
        return selectedCategory ? post.categoryId === selectedCategory : true;
      });
    })
  );

  // .pipe(
  //   mergeMap((post) => {
  //     return post;
  //   }),
  //   filter((post) => {
  //     return this.selectedCategoryId
  //       ? post.categoryId === this.selectedCategoryId
  //       : true;
  //   })
  // );

  constructor(
    private postService: DeclarativePostService,
    private categoryService: DeclarativeCategoryService
  ) {}

  onCategoryChange(event: Event) {
    const selectedCategoryId = (event.target as HTMLSelectElement).value;
    // console.log('hello');
    console.log(selectedCategoryId);
    // this.selectedCategoryId = selectedCategoryId;
    this.selectedCategorySubject.next(selectedCategoryId);
  }
}
