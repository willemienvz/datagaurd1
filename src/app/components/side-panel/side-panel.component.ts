import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { AllPlugins, Data, Tabs } from '../../model/model';
import { Subject, Subscription, takeUntil } from 'rxjs';


@Component({
  selector: 'app-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.scss']
})
export class SidePanelComponent implements OnInit, OnDestroy {
  tabs: Tabs[] = [];
  checked = true;
  allPlugins:  AllPlugins = {};
  private destroy$ = new Subject<void>();
  private dataSubscription: Subscription | undefined;
  data: Data = {
    tabs: [],
    tabdata: {},
    plugins: {}
  };
  constructor(private dataService: DataService) {}


  ngOnInit(): void {
    this.dataService.data$
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        if (!response) return;
  
        this.data = response;
        this.allPlugins = response.tabdata;
  
        this.checked = !this.areAllPluginsDisabled();
  
        this.tabs = this.createTabs(response.tabs, response.tabdata);
      });
  }
  
  private createTabs(tabs: string[], tabData: any): any[] {
    return tabs.map((tab) => ({
      name: tab,
      title: tabData[tab].title,
      icon: tabData[tab].icon,
    }));
  }
  

  getIcon(icon:string): string{
    switch (icon) {
      case 'icon-marketing':
        return 'linked_services'; 
      case 'icon-finance':
        return 'account_balance'; 
      case 'icon-people':
        return 'fact_check';
      default:
        return 'other_admission'; 
    }
  }

  onToggleChange(event: any) {
    this.checked = event.checked;
    if (!this.checked) {
      this.movePluginsToDisabled();
    }else{
      this.clearData();
    }
    this.saveData();
  }

  movePluginsToDisabled() {
    this.clearData();
    Object.keys(this.allPlugins).forEach(tab => {
      const tabInfo = this.allPlugins[tab];

      const allPlugins = [
        ...tabInfo.active,
        ...tabInfo.inactive,
        ...tabInfo.disabled
      ];

      tabInfo.disabled = allPlugins;
    });
  }

  clearData() {
    Object.keys(this.allPlugins).forEach(tab => {
      const tabInfo = this.allPlugins[tab];
      tabInfo.disabled = [];
    });
  }

  saveData() {
    this.dataService.updateData(this.data).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        console.log('Data updated successfully:', response);
        this.dataService.loadData();
      },
      error: (error) => {
        console.error('Error updating data:', error);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  areAllPluginsDisabled(): boolean {
    return Object.values(this.allPlugins).every(tabInfo => {
      const allPlugins = [
        ...tabInfo.active,
        ...tabInfo.inactive,
        ...tabInfo.disabled
      ];
  
      return allPlugins.every(plugin => tabInfo.disabled.includes(plugin));
    });
  }
}
