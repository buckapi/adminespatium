import { Injectable, OnDestroy } from '@angular/core';
import PocketBase from 'pocketbase';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RealtimeCiudadesService implements OnDestroy {
  private pb: PocketBase;
  private ciudadesSubject = new BehaviorSubject<any[]>([]);

  // Esta es la propiedad que expondrá el Observable para que los componentes puedan suscribirse a ella
  public ciudades$: Observable<any[]> =
    this.ciudadesSubject.asObservable();

  constructor() {
    this.pb = new PocketBase('https://db.buckapi.com:8096');
    this.subscribeToCiudades();
  }

  private async subscribeToCiudades() {
    // (Opcional) Autenticación
    await this.pb
      .collection('users')
      .authWithPassword('admin@email.com', 'admin1234');

    // Suscribirse a cambios en cualquier registro de la colección 'supervisors'
    this.pb.collection('ciudades').subscribe('*', (e) => {
      this.handleRealtimeEvent(e);
    });

    // Inicializar la lista de esupervisoras
    this.updateCiudadesList();
  }

  private handleRealtimeEvent(event: any) {
    // Aquí puedes manejar las acciones 'create', 'update' y 'delete'
    console.log(event.action);
    console.log(event.record);

    // Actualizar la lista de esupervisoras
    this.updateCiudadesList();
  }

  private async updateCiudadesList() {
    // Obtener la lista actualizada de esupervisoras
    const records = await this.pb
      .collection('ciudades')
      .getFullList(200 /* cantidad máxima de registros */, {
        sort: '-created', // Ordenar por fecha de creación
      });
    this.ciudadesSubject.next(records);
  }

  ngOnDestroy() {
    // Desuscribirse cuando el servicio se destruye
    this.pb.collection('ciudades').unsubscribe('*');
  }

  getCiudadesCount(): number {
    return this.ciudadesSubject.value.length;
  }
}
