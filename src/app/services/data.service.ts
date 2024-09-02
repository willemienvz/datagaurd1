import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, takeUntil, tap } from 'rxjs';
import { Data } from '../model/model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:3000/data';
  private dataSubject = new BehaviorSubject<any>(null);
  private destroy$ = new Subject<void>();
  data$: Observable<Data> = this.dataSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadData();
  }

  loadData(): void {
    this.http.get(this.apiUrl)
      .pipe(
        tap((response: any) => this.dataSubject.next(response)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        error: (error) => console.error('Error loading data:', error)
      });
  }

  updateData(data: Data): Observable<Data> {
    return this.http.put<Data>(this.apiUrl, data);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
