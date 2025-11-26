import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SettingsService } from '../../../core/services';

@Component({
  selector: 'app-greeting',
  imports: [DatePipe],
  template: `
    <div class="text-center space-y-2">
      <p class="text-lg text-surface-400 dark:text-surface-500">
        {{ currentDate() | date : 'EEEE, MMMM d' }}
      </p>
      <h1 class="text-5xl md:text-6xl font-light tracking-tight">
        {{ currentTime() }}
      </h1>
      <p class="text-xl md:text-2xl text-surface-300 dark:text-surface-400 mt-4">
        {{ greeting() }}@if (userName()) {<span class="text-surface-100 dark:text-surface-200">, {{ userName() }}</span>}
      </p>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class GreetingComponent implements OnInit, OnDestroy {
  private readonly settings = inject(SettingsService);
  private intervalId: ReturnType<typeof setInterval> | null = null;

  readonly currentTime = signal(this.formatTime());
  readonly currentDate = signal(new Date());
  readonly userName = this.settings.userName;

  readonly greeting = signal(this.getGreeting());

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.currentTime.set(this.formatTime());
      this.currentDate.set(new Date());
      this.greeting.set(this.getGreeting());
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private formatTime(): string {
    const now = new Date();
    return now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }

  private getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    if (hour < 21) return 'Good evening';
    return 'Good night';
  }
}

