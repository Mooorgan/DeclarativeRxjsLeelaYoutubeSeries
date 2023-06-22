import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPost } from '../models/IPost';
import { CategoryService } from './category.service';
import { map, merge, mergeMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(
    private http: HttpClient,
    private categoryService: CategoryService
  ) {}

  getPosts() {
    return this.http.get<IPost[]>(
      `https://angular-rxjsreactive-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json`
    );
  }

  getPostsWithCategory() {
    return this.getPosts().pipe(
      mergeMap((posts) => {
        return this.categoryService.getCategories().pipe(
          map((categories) => {
            return posts.map((post) => {
              return {
                ...post,
                categoryName: categories.find(
                  (category) => category.id === post.categoryId
                )?.title,
              };
            });
          })
        );
      })
    );
  }
}
