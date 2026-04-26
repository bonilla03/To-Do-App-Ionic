import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  fetchAndActivate,
  getRemoteConfig,
  getValue,
  isSupported,
  RemoteConfig,
} from 'firebase/remote-config';
import { BehaviorSubject } from 'rxjs';

import { environment } from '../../../environments/environment';
import { FeatureFlags } from '../models/feature-flags.model';

const DEFAULT_FLAGS: FeatureFlags = {
  enableTaskEditing: true,
  showStatusFilters: true,
};

@Injectable({
  providedIn: 'root',
})
export class FeatureFlagsService {
  private readonly flagsSubject = new BehaviorSubject<FeatureFlags>(DEFAULT_FLAGS);
  readonly flags$ = this.flagsSubject.asObservable();

  async initialize(): Promise<void> {
    if (!this.hasFirebaseConfig()) {
      return;
    }

    try {
      const supported = await isSupported();

      if (!supported) {
        return;
      }

      const app = initializeApp(environment.firebase);
      const remoteConfig = getRemoteConfig(app);

      this.configureRemoteConfig(remoteConfig);
      await fetchAndActivate(remoteConfig);

      this.flagsSubject.next({
        enableTaskEditing: this.readBoolean(remoteConfig, 'enable_task_editing'),
        showStatusFilters: this.readBoolean(remoteConfig, 'show_status_filters'),
      });
    } catch {
      this.flagsSubject.next(DEFAULT_FLAGS);
    }
  }

  private configureRemoteConfig(remoteConfig: RemoteConfig): void {
    remoteConfig.settings.minimumFetchIntervalMillis =
      environment.remoteConfig.minimumFetchIntervalMillis;

    remoteConfig.defaultConfig = {
      enable_task_editing: String(DEFAULT_FLAGS.enableTaskEditing),
      show_status_filters: String(DEFAULT_FLAGS.showStatusFilters),
    };
  }

  private readBoolean(remoteConfig: RemoteConfig, key: string): boolean {
    return getValue(remoteConfig, key).asBoolean();
  }

  private hasFirebaseConfig(): boolean {
    return Boolean(
      environment.firebase.apiKey &&
        environment.firebase.appId &&
        environment.firebase.projectId
    );
  }
}
