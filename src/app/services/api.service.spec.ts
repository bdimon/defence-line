/// <reference types="jasmine" />

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { WpService } from './wp.service';

describe('WpService', () => {
  let service: WpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(WpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should sanitize search input and use rest_route for active site', () => {
    service.setActiveSite(0);

    service.getPosts(2, 3, '  <script>alert(1)</script>  ').subscribe();

    const request = httpMock.expectOne((req) => {
      return req.method === 'GET'
        && req.params.get('rest_route') === '/wp/v2/posts'
        && req.params.get('search') === 'scriptalert(1)/script';
    });

    expect(request.request.params.get('page')).toBe('2');
    expect(request.request.params.get('categories')).toBe('3');
    expect(request.request.params.get('search')).toBe('scriptalert(1)/script');
    request.flush([]);
  });
});
