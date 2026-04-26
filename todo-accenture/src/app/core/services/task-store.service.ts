import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Task } from '../models/task.model';
import { LocalStorageService } from './local-storage.service';

const TASKS_STORAGE_KEY = 'todo-app.tasks';

@Injectable({
  providedIn: 'root',
})
export class TaskStoreService {
  private readonly tasksSubject = new BehaviorSubject<Task[]>(
    this.storage.getItem<Task[]>(TASKS_STORAGE_KEY, this.createSeedTasks())
  );

  readonly tasks$ = this.tasksSubject.asObservable();

  constructor(private readonly storage: LocalStorageService) {}

  createTask(title: string, categoryId: string | null): void {
    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      return;
    }

    const now = new Date().toISOString();
    const task: Task = {
      id: this.createId(),
      title: normalizedTitle,
      completed: false,
      categoryId,
      createdAt: now,
      updatedAt: now,
    };

    this.updateTasks([task, ...this.tasksSubject.value]);
  }

  toggleTask(taskId: string): void {
    const updatedTasks = this.tasksSubject.value.map((task) =>
      task.id === taskId
        ? {
            ...task,
            completed: !task.completed,
            updatedAt: new Date().toISOString(),
          }
        : task
    );

    this.updateTasks(updatedTasks);
  }

  deleteTask(taskId: string): void {
    this.updateTasks(this.tasksSubject.value.filter((task) => task.id !== taskId));
  }

  updateTask(taskId: string, title: string, categoryId: string | null): void {
    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      return;
    }

    const updatedTasks = this.tasksSubject.value.map((task) =>
      task.id === taskId
        ? {
            ...task,
            title: normalizedTitle,
            categoryId,
            updatedAt: new Date().toISOString(),
          }
        : task
    );

    this.updateTasks(updatedTasks);
  }

  clearCategoryFromTasks(categoryId: string): void {
    const updatedTasks = this.tasksSubject.value.map((task) =>
      task.categoryId === categoryId
        ? {
            ...task,
            categoryId: null,
            updatedAt: new Date().toISOString(),
          }
        : task
    );

    this.updateTasks(updatedTasks);
  }

  private updateTasks(tasks: Task[]): void {
    this.tasksSubject.next(tasks);
    this.storage.setItem(TASKS_STORAGE_KEY, tasks);
  }

  private createSeedTasks(): Task[] {
    const now = new Date().toISOString();

    return [
      {
        id: this.createId(),
        title: 'Preparar entorno Ionic y Angular',
        completed: true,
        categoryId: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: this.createId(),
        title: 'Implementar lista de tareas con almacenamiento local',
        completed: false,
        categoryId: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: this.createId(),
        title: 'Conectar Firebase Remote Config',
        completed: false,
        categoryId: null,
        createdAt: now,
        updatedAt: now,
      },
    ];
  }

  private createId(): string {
    return `task-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
  }
}
