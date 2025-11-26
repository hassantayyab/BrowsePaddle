import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SettingsService } from '../../core/services';
import {
  GreetingComponent,
  SearchBarComponent,
  QuickLinksComponent,
  WeatherWidgetComponent,
  NewsFeedComponent,
  ReadingListWidgetComponent,
} from '../../shared/components';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    GreetingComponent,
    SearchBarComponent,
    QuickLinksComponent,
    WeatherWidgetComponent,
    NewsFeedComponent,
    ReadingListWidgetComponent,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  readonly settings = inject(SettingsService);
}
