import { Injectable, OnDestroy } from '@angular/core';
import PocketBase from 'pocketbase';
import { BehaviorSubject, Observable } from 'rxjs';
interface Project {
    title: string;
    description: string;
    location: string;
    square_meters: number;
    category: string;
    team: string;
    challenge: string;
    concept: string;
    execution: string;
/*     image: File | null;
 */    date: string;
    status: string;
  }
@Injectable({
  providedIn: 'root'
})
export class RealtimeProjectsService implements OnDestroy {
  private pb: PocketBase;
  private projectsSubject = new BehaviorSubject<any[]>([]);

  // Esta es la propiedad que expondrá el Observable para que los componentes puedan suscribirse a ella
  public projects$: Observable<any[]> =
    this.projectsSubject.asObservable();

  constructor() {
    this.pb = new PocketBase('https://db.buckapi.com:8096');
    this.subscribeToProjects();
  }

  private async subscribeToProjects() {
    // (Opcional) Autenticación
    await this.pb
      .collection('users')
      .authWithPassword('admin@email.com', 'admin1234');

    // Suscribirse a cambios en cualquier registro de la colección 'supervisors'
    this.pb.collection('projects').subscribe('*', (e) => {
      this.handleRealtimeEvent(e);
    });

    // Inicializar la lista de esupervisoras
    this.updateProjectsList();
  }

  private handleRealtimeEvent(event: any) {
    // Aquí puedes manejar las acciones 'create', 'update' y 'delete'
    console.log(event.action);
    console.log(event.record);

    // Actualizar la lista de esupervisoras
    this.updateProjectsList();
  }

  private async updateProjectsList() {
    // Obtener la lista actualizada de esupervisoras
    const records = await this.pb
      .collection('projects')
      .getFullList(200 /* cantidad máxima de registros */, {
        sort: '-created', // Ordenar por fecha de creación
      });
    this.projectsSubject.next(records);
  }

  ngOnDestroy() {
    // Desuscribirse cuando el servicio se destruye
    this.pb.collection('projects').unsubscribe('*');
  }

  getProjectsCount(): number {
    return this.projectsSubject.value.length;
  }
 /*  addProject(project: Project): Observable<any> {
    return new Observable(observer => {
      this.pb.collection('projects').create(project)
        .then(record => {
          observer.next(record);
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  } */
}
