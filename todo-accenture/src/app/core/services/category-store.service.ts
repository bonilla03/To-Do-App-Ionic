import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Category } from '../models/category.model';
import { LocalStorageService } from './local-storage.service';

const CATEGORIES_STORAGE_KEY = 'todo-app.categories';

@Injectable({
  providedIn: 'root',
})
export class CategoryStoreService {
  private readonly categoriesSubject = new BehaviorSubject<Category[]>(
    this.storage.getItem<Category[]>(CATEGORIES_STORAGE_KEY, [
      this.createSeedCategory('Personal'),
      this.createSeedCategory('Trabajo'),
      this.createSeedCategory('Estudio'),
    ])
  );

  readonly categories$ = this.categoriesSubject.asObservable();

  constructor(private readonly storage: LocalStorageService) {}

  createCategory(name: string): void {
    const normalizedName = name.trim();

    if (!normalizedName) {
      return;
    }

    const category: Category = {
      id: this.createId(),
      name: normalizedName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.updateCategories([...this.categoriesSubject.value, category]);
  }

  updateCategory(categoryId: string, name: string): void {
    const normalizedName = name.trim();

    if (!normalizedName) {
      return;
    }

    const updatedCategories = this.categoriesSubject.value.map((category) =>
      category.id === categoryId
        ? {
            ...category,
            name: normalizedName,
            updatedAt: new Date().toISOString(),
          }
        : category
    );

    this.updateCategories(updatedCategories);
  }

  deleteCategory(categoryId: string): void {
    this.updateCategories(
      this.categoriesSubject.value.filter((category) => category.id !== categoryId)
    );
  }

  private updateCategories(categories: Category[]): void {
    this.categoriesSubject.next(categories);
    this.storage.setItem(CATEGORIES_STORAGE_KEY, categories);
  }

  private createSeedCategory(name: string): Category {
    const now = new Date().toISOString();

    return {
      id: this.createId(),
      name,
      createdAt: now,
      updatedAt: now,
    };
  }

  private createId(): string {
    return `cat-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
  }
}
