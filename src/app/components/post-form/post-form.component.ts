import { Component } from '@angular/core';
import { DeclarativeCategoryService } from 'src/app/services/declarative-category.service';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss'],
})
export class PostFormComponent {
  categories$ = this.categoryService.categories$;

  constructor(private categoryService: DeclarativeCategoryService) {}
}
