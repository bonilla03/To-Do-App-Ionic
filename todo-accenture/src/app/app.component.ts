import { Component, OnInit } from '@angular/core';

import { FeatureFlagsService } from './core/services/feature-flags.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  constructor(private readonly featureFlagsService: FeatureFlagsService) {}

  ngOnInit(): void {
    void this.featureFlagsService.initialize();
  }
}
