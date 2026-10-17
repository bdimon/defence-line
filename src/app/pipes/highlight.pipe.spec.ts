import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';

import { HighlightPipe } from './highlight.pipe';

describe('HighlightPipe', () => {
  let pipe: HighlightPipe;

  beforeEach(() => {
    const sanitizer = TestBed.inject(DomSanitizer);
    pipe = new HighlightPipe(sanitizer);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('highlights a plain search term case-insensitively', () => {
    const result = pipe.transform('Defense Line News', 'line');
    expect(String(result).toString()).toContain('<span class="highlight">Line</span>');
  });

  it('treats special regex characters literally', () => {
    const result = pipe.transform('Alpha (beta) gamma', '(beta)');
    expect(String(result).toString()).toContain('<span class="highlight">(beta)</span>');
  });
});
