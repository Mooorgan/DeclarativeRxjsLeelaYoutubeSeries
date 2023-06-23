import { Component } from '@angular/core';
import { LoaderService } from './services/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'reactiveDeclarative';
  showLoader$ = this.loaderService.loadingAction$;

  constructor(private loaderService: LoaderService) {}
}
