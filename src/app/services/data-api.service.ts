import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Project } from './project.service';
import PocketBase from 'pocketbase';

export interface ProjectService{
}

@Injectable({
  providedIn: 'root'
})
export class DataApiService { 
  private baseUrl = 'https://db.buckapi.com:8096/api';
  public pb: PocketBase;

  constructor(
    private http: HttpClient,           
    public global: GlobalService,
    private fb: FormBuilder,
    private httpClient: HttpClient
  ) { 
    this.pb = new PocketBase('https://db.buckapi.com:8096');
  }

  headers : HttpHeaders = new HttpHeaders({  		
    "Content-Type":"application/json"	
  });

  getAllProjects(): Observable<ProjectService []> {
    return this.http.get<ProjectService[]>(`${this.baseUrl}/collections/projects/records`);
  }

  saveProject(request: Project) {
    const url_api = this.baseUrl + '/collections/projects/records';
    return this.http.post<Project>(url_api, request).pipe(
      map(data => data)
    );
  }

  saveCotizacion(request: any) {
    return this.pb.collection('cotizaciones').create(request);
  }

  updateProject(updatedProject: any) {
    if (!updatedProject.id) {
      throw new Error('ID es requerido para actualizar el proyecto');
    }
    const url_api = `${this.baseUrl}/collections/projects/records/${updatedProject.id}`;
    
    console.log('URL de actualización:', url_api);
    console.log('Datos a enviar:', updatedProject);

    return this.http.put<any>(url_api, updatedProject, { headers: this.headers })
      .pipe(
        catchError(error => {
          console.error('Error en la actualización:', error);
          if (error.status === 404) {
            throw new Error(`No se encontró el proyecto con ID: ${updatedProject.id}`);
          }
          throw error;
        })
      );
  }
}
