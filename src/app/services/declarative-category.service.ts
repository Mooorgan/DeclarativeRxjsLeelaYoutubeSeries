import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICategory } from '../models/ICategory';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeclarativeCategoryService {
  categories$ = this.http
    .get<{ [id: string]: ICategory }>(
      `https://angular-rxjsreactive-default-rtdb.asia-southeast1.firebasedatabase.app/categories.json`
    )
    .pipe(
      map((categories) => {
        const categoriesData: ICategory[] = [];
        for (let id in categories) {
          categoriesData.push({ ...categories[id], id });
        }
        return categoriesData;
      })
    );
  constructor(private http: HttpClient) {}
}
