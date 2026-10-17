import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'highlight',
  standalone: true,
})
export class HighlightPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  private escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  transform(value: string | null | undefined, searchTerm: string | null | undefined): SafeHtml {
    const safeValue = value ?? '';
    const normalizedTerm = searchTerm?.trim();

    if (!safeValue || !normalizedTerm) {
      return this.sanitizer.bypassSecurityTrustHtml(safeValue);
    }

    const regex = new RegExp(this.escapeRegExp(normalizedTerm), 'gi');
    const highlightedText = safeValue.replace(regex, (match) => `<span class="highlight">${match}</span>`);

    return this.sanitizer.bypassSecurityTrustHtml(highlightedText);
  }
}

