import { Injectable, OnDestroy } from '@angular/core';
import PocketBase from 'pocketbase';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RealtimeTamañosService implements OnDestroy {
  private pb: PocketBase;
  private tamañosSubject = new BehaviorSubject<any[]>([]);

  // Esta es la propiedad que expondrá el Observable para que los componentes puedan suscribirse a ella
  public tamaños$: Observable<any[]> =
    this.tamañosSubject.asObservable();

  constructor() {
    this.pb = new PocketBase('https://db.buckapi.com:8096');
    this.subscribeToTamaños();
  }

  private async subscribeToTamaños() {
    // (Opcional) Autenticación
    await this.pb
      .collection('users')
      .authWithPassword('admin@email.com', 'admin1234');

    // Suscribirse a cambios en cualquier registro de la colección 'supervisors'
    this.pb.collection('tamanos').subscribe('*', (e) => {
      this.handleRealtimeEvent(e);
    });

    // Inicializar la lista de esupervisoras
    this.updateTamañosList();
  }

  private handleRealtimeEvent(event: any) {
    // Aquí puedes manejar las acciones 'create', 'update' y 'delete'
    console.log(event.action);
    console.log(event.record);

    // Actualizar la lista de esupervisoras
    this.updateTamañosList();
  }

  private async updateTamañosList() {
    // Obtener la lista actualizada de esupervisoras
    const records = await this.pb
      .collection('tamanos')
      .getFullList(200 /* cantidad máxima de registros */, {
        sort: '-created', // Ordenar por fecha de creación
      });
    this.tamañosSubject.next(records);
  }

  ngOnDestroy() {
    // Desuscribirse cuando el servicio se destruye
    this.pb.collection('tamanos').unsubscribe('*');
  }

  getTamañosCount(): number {
    return this.tamañosSubject.value.length;
  }
}
