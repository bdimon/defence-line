import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'categoryColor',
  standalone: true,
})
export class CategoryColorPipe implements PipeTransform {
  private colorMap: { [key: number]: string } = {
    1: 'primary',
    2: 'danger',
    8: 'tertiary',
    19: 'tertiary',
    27: 'success',
    26: 'success',
    9: 'warning',
    6: 'dark',
    21: 'secondary',
    25: 'warning'

    // Add more mappings as needed
  };

  transform(catId: number): string {
    return this.colorMap[catId] || 'medium'; // Default to 'medium' if no mapping exists
  }
}
