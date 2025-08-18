import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'speed',
  standalone: true
})

export class SpeedPipe implements PipeTransform {
  transform(value: number): string {
    if (value === null || value === undefined) return '0 B/s';
    if (value < 1024) return `${value} B/s`;
    if (value < 1024 * 1024) return `${(value / 1024).toFixed(2)} KB/s`;
    if (value < 1024 * 1024 * 1024) return `${(value / (1024 * 1024)).toFixed(2)} MB/s`;
    return `${(value / (1024 * 1024 * 1024)).toFixed(2)} GB/s`;
  }
}