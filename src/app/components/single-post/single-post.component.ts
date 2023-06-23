import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, EMPTY, catchError } from 'rxjs';
import { DeclarativePostService } from 'src/app/services/declarative-post.service';

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SinglePostComponent {
  errorMessageSubject = new BehaviorSubject<string>('');
  errorMessage$ = this.errorMessageSubject.asObservable();
  // errorMessage = '';
  post$ = this.postService.post$.pipe(
    catchError((error: string) => {
      this.errorMessageSubject.next(error);
      console.log(error);
      return EMPTY;
    })
  );

  constructor(private postService: DeclarativePostService) {}
}
