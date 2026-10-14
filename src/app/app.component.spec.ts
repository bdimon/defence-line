import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { MenuController } from '@ionic/angular/standalone';

import { AppComponent } from './app.component';
import { WpService } from './services/wp.service';

describe('AppComponent', () => {
  const wpServiceMock = {
    activeSiteIndex: 0,
    loadCategories: () => of([{ id: 1, name: 'Тестова категорія', slug: 'test-category' }]),
    getAvailableSites: () => [{ name: 'Test Site', url: 'https://example.com/wp-json/wp/v2' }],
    setActiveSite: () => undefined,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        { provide: WpService, useValue: wpServiceMock },
        { provide: MenuController, useValue: { close: () => Promise.resolve() } },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the default menu items', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.nativeElement as HTMLElement;
    const menuItems = Array.from(app.querySelectorAll('ion-item'));

    expect(menuItems.some((item) => item.textContent?.includes('Switch Site'))).toBeTrue();
    expect(menuItems.some((item) => item.textContent?.includes('Все'))).toBeTrue();
    expect(menuItems.some((item) => item.textContent?.includes('Тестова категорія'))).toBeTrue();
  });
});
