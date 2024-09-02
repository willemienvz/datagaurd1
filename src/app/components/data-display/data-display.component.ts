import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';
import { Subject, takeUntil } from 'rxjs';
import { Data, TabData } from '../../model/model';

@Component({
  selector: 'app-data-display',
  templateUrl: './data-display.component.html',
  styleUrls: ['./data-display.component.scss']
})
export class DataDisplayComponent implements OnInit, OnDestroy {
  data: Data = {
    tabs: [],
    tabdata: {},
    plugins: {}
  };
  selectedTabData: TabData = {
    title: '',
    icon: '',
    active: [],
    disabled: [],
    inactive: []
  };
  private destroy$ = new Subject<void>();

  constructor(private dataService: DataService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.subscribeToData();
  }

  private subscribeToData(): void {
    this.dataService.data$.pipe(takeUntil(this.destroy$)).subscribe((response) => {
      if (response?.tabdata) {
        this.data = response;
        this.subscribeToRoute();
      } else {
        console.warn('Data or tabdata not available.');
      }
    });
  }

  private subscribeToRoute(): void {
    this.route.data.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      const tab = data['tab'];
      this.selectedTabData = this.data.tabdata?.[tab] || {};
      if (!this.selectedTabData) {
        console.warn('Tab data not available.');
      }
    });
  }

  getAllPlugins(tabData: TabData): string[] {
    const activePlugins = Array.isArray(tabData?.active) ? tabData.active : [];
    const inactivePlugins = Array.isArray(tabData?.inactive) ? tabData.inactive : [];
  
    return [...activePlugins, ...inactivePlugins]
      .sort((a, b) => {
        const pluginA = this.data.plugins?.[a];
        const pluginB = this.data.plugins?.[b];
        return pluginA?.title?.localeCompare(pluginB?.title) ?? 0;
      });
  }

  onToggleChange(event: any, pluginKey: string): void {
    const isActive = event.checked;

    if (this.selectedTabData) {
      this.updatePluginStates(pluginKey, isActive);

      const tab = this.route.snapshot.data['tab'];
      this.data.tabdata[tab] = { ...this.selectedTabData };

      this.dataService.updateData(this.data).pipe(takeUntil(this.destroy$)).subscribe({
        next: (response) => {
          console.log('Data updated successfully:', response);
        },
        error: (error) => {
          console.error('Error updating data:', error);
        }
      });
    }
  }

  private updatePluginStates(pluginKey: string, isActive: boolean): void {
    this.selectedTabData.active = this.selectedTabData.active.filter((key: string) => key !== pluginKey);
    this.selectedTabData.disabled = this.selectedTabData.disabled.filter((key: string) => key !== pluginKey);
    this.selectedTabData.inactive = this.selectedTabData.inactive.filter((key: string) => key !== pluginKey);

    if (isActive) {
      this.selectedTabData.active.push(pluginKey);
    } else {
      this.selectedTabData.inactive.push(pluginKey);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
