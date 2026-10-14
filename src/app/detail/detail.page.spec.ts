import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DetailPage } from './detail.page';
import { WpService } from '../services/wp.service';

describe('DetailPage', () => {
  let component: DetailPage;
  let fixture: ComponentFixture<DetailPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DetailPage],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: { get: () => '12' },
              queryParams: { searchTerm: 'test' },
            },
          },
        },
        {
          provide: WpService,
          useValue: {
            getPost: () => of({
              id: 12,
              title: { rendered: 'Test title' },
              content: { rendered: 'Test content' },
              excerpt: { rendered: 'Excerpt' },
              date: '2024-01-01',
              categories: [1],
              _embedded: {},
            }),
            getComments: () => of([]),
            getCatName: () => 'Test category',
          },
        },
      ],
    });

    fixture = TestBed.createComponent(DetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
