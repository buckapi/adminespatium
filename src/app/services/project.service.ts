import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Project {
  title: string;
  description: string;
  location: string;
  square_meters: number;
  category: string;
  team: string;
  challenge: string;
  concept: string;
  execution: string;
/*   image: File | null;
 */  date: string;
  status: string;
}
@Injectable({
  providedIn: 'root'
})
export class ProjectService {
    private baseUrl = 'https://db.buckapi.com:8096/api';

  constructor(private http: HttpClient) { }

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.baseUrl + '/collections/projects/records')
      .pipe(
        catchError(error => {
          console.error('Error fetching projects:', error);
          return throwError(() => error);
        })
      );
  }
  updateProject(id: string, data: Partial<Project>): Observable<Project> {
      return this.http.patch<Project>(`${this.baseUrl}/collections/projects/records/${id}`, data)
      .pipe(
        catchError(error => {
          console.error('Error actualizando project:', error);
          return throwError(() => error);
        })
      );
  }
} 