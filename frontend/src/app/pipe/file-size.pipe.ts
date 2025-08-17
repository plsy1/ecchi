import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileSize',
  standalone: true
})
export class FileSizePipe implements PipeTransform {
  transform(value: number): string {
    if (!value && value !== 0) return '';

    if (value >= 1_073_741_824) {
      return (value / 1_073_741_824).toFixed(2) + ' GB';
    } else if (value >= 1_048_576) {
      return (value / 1_048_576).toFixed(2) + ' MB';
    } else if (value >= 1024) {
      return (value / 1024).toFixed(2) + ' KB';
    } else {
      return value + ' bytes';
    }
  }
}