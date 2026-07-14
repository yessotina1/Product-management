import { Pipe, PipeTransform } from '@angular/core';
import { Category } from '../models';

@Pipe({ name: 'categoryName', standalone: true })
export class CategoryNamePipe implements PipeTransform {
  transform(categories: Category[], id: number | null): string {
    if (!id || !categories.length) return '—';
    return categories.find(c => c.id === id)?.name || '—';
  }
}
