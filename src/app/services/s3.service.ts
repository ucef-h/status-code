import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApplicationDeployment } from '../models/deployment.model';

@Injectable({
  providedIn: 'root'
})
export class S3Service {

  constructor(private http: HttpClient) { }

  fetchDeploymentData(url?: string): Observable<ApplicationDeployment> {
    const dataUrl = url || environment.mockDataUrl;
    return this.http.get<ApplicationDeployment>(dataUrl);
  }

  fetchDeploymentHistory(application: string, environment: string, timestamps: string[]): Observable<any[]> {
    const requests = timestamps.map(timestamp => 
      this.http.get<ApplicationDeployment>(`assets/mock/history/${timestamp}/cost.json`).pipe(
        map(data => ({
          application,
          environment,
          timestamp,
          applicationDeployment: data
        }))
      )
    );

    return forkJoin(requests); 
  }
}
