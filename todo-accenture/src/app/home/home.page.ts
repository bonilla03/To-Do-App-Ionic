import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';

import { FeatureFlagsService } from '../core/services/feature-flags.service';
import { CategoryStoreService } from '../core/services/category-store.service';
import { TaskStoreService } from '../core/services/task-store.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  protected readonly currentYear = new Date().getFullYear();
  protected taskTitle = '';
  protected taskCategoryId?: string;
  protected categoryName = '';
  protected editingTaskId: string | null = null;
  protected editingTaskTitle = '';
  protected editingTaskCategoryId?: string;
  protected editingCategoryId: string | null = null;
  protected editingCategoryName = '';

  private readonly selectedCategoryIdSubject = new BehaviorSubject<string>('all');
  private readonly selectedStatusSubject = new BehaviorSubject<'all' | 'pending' | 'completed'>(
    'all'
  );
  protected readonly selectedCategoryId$ = this.selectedCategoryIdSubject.asObservable();
  protected readonly selectedStatus$ = this.selectedStatusSubject.asObservable();

  protected readonly vm$ = combineLatest([
    this.taskStore.tasks$,
    this.categoryStore.categories$,
    this.selectedCategoryId$,
    this.selectedStatus$,
    this.featureFlagsService.flags$,
  ]).pipe(
    map(([tasks, categories, selectedCategoryId, selectedStatus, flags]) => {
      const categoryFilteredTasks =
        selectedCategoryId === 'all'
          ? tasks
          : tasks.filter((task) => task.categoryId === selectedCategoryId);

      const filteredTasks =
        selectedStatus === 'all'
          ? categoryFilteredTasks
          : categoryFilteredTasks.filter((task) =>
              selectedStatus === 'completed' ? task.completed : !task.completed
            );

      const completedTasks = filteredTasks.filter((task) => task.completed).length;

      return {
        categories,
        filteredTasks: filteredTasks.map((task) => ({
          ...task,
          categoryName:
            categories.find((category) => category.id === task.categoryId)?.name ?? 'Sin categoria',
        })),
        selectedCategoryId,
        selectedStatus,
        flags,
        stats: {
          total: tasks.length,
          pending: tasks.filter((task) => !task.completed).length,
          completed: tasks.filter((task) => task.completed).length,
          visibleCompleted: completedTasks,
          visiblePending: filteredTasks.length - completedTasks,
        },
      };
    })
  );

  constructor(
    private readonly taskStore: TaskStoreService,
    private readonly categoryStore: CategoryStoreService,
    private readonly featureFlagsService: FeatureFlagsService
  ) {}

  protected createTask(): void {
    this.taskStore.createTask(this.taskTitle, this.taskCategoryId ?? null);
    this.taskTitle = '';
    this.taskCategoryId = undefined;
  }

  protected toggleTask(taskId: string): void {
    this.taskStore.toggleTask(taskId);
  }

  protected deleteTask(taskId: string): void {
    this.taskStore.deleteTask(taskId);
  }

  protected startTaskEdition(taskId: string, title: string, categoryId: string | null): void {
    this.editingTaskId = taskId;
    this.editingTaskTitle = title;
    this.editingTaskCategoryId = categoryId ?? undefined;
  }

  protected saveTaskEdition(): void {
    if (!this.editingTaskId) {
      return;
    }

    this.taskStore.updateTask(
      this.editingTaskId,
      this.editingTaskTitle,
      this.editingTaskCategoryId ?? null
    );
    this.cancelTaskEdition();
  }

  protected cancelTaskEdition(): void {
    this.editingTaskId = null;
    this.editingTaskTitle = '';
    this.editingTaskCategoryId = undefined;
  }

  protected selectCategory(categoryId: string): void {
    this.selectedCategoryIdSubject.next(categoryId);
  }

  protected selectStatus(status: 'all' | 'pending' | 'completed'): void {
    this.selectedStatusSubject.next(status);
  }

  protected createCategory(): void {
    this.categoryStore.createCategory(this.categoryName);
    this.categoryName = '';
  }

  protected startCategoryEdition(categoryId: string, currentName: string): void {
    this.editingCategoryId = categoryId;
    this.editingCategoryName = currentName;
  }

  protected saveCategoryEdition(): void {
    if (!this.editingCategoryId) {
      return;
    }

    this.categoryStore.updateCategory(this.editingCategoryId, this.editingCategoryName);
    this.cancelCategoryEdition();
  }

  protected cancelCategoryEdition(): void {
    this.editingCategoryId = null;
    this.editingCategoryName = '';
  }

  protected deleteCategory(categoryId: string): void {
    this.categoryStore.deleteCategory(categoryId);
    this.taskStore.clearCategoryFromTasks(categoryId);

    if (this.selectedCategoryIdSubject.value === categoryId) {
      this.selectedCategoryIdSubject.next('all');
    }

    if (this.editingCategoryId === categoryId) {
      this.cancelCategoryEdition();
    }
  }

  protected trackById(_: number, item: { id: string }): string {
    return item.id;
  }
}
