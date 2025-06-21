import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@Pipe({
  name: 'highlight',
  standalone: true
})
export class HighlightPipe implements PipeTransform {

 
constructor(private sanitizer: DomSanitizer) {}

  transform(value: string, searchTerm: string): SafeHtml {
    if (!value || !searchTerm) {
      return this.sanitizer.bypassSecurityTrustHtml(value);
    }

    const regex = new RegExp(searchTerm, 'gi'); // 'gi' для глобального и регистронезависимого поиска
    const highlightedText = value.replace(regex, (match) => `<span class="highlight">${match}</span>`);

    return this.sanitizer.bypassSecurityTrustHtml(highlightedText);
  }
}

