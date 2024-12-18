import { Injectable, OnDestroy } from '@angular/core';
import PocketBase from 'pocketbase';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RealtimeTypeConstructorsService implements OnDestroy {
  private pb: PocketBase;
  private typeConstructorsSubject = new BehaviorSubject<any[]>([]);

  // Esta es la propiedad que expondrá el Observable para que los componentes puedan suscribirse a ella
  public typeConstructors$: Observable<any[]> =
    this.typeConstructorsSubject.asObservable();

  constructor() {
    this.pb = new PocketBase('https://db.buckapi.com:8096');
    this.subscribeToTypeConstructors();
  }

  private async subscribeToTypeConstructors() {
    // (Opcional) Autenticación
    await this.pb
      .collection('users')
      .authWithPassword('admin@email.com', 'admin1234');

    // Suscribirse a cambios en cualquier registro de la colección 'supervisors'
    this.pb.collection('typeConstructor').subscribe('*', (e) => {
      this.handleRealtimeEvent(e);
    });

    // Inicializar la lista de esupervisoras
    this.updateTypeConstructorsList();
  }

  private handleRealtimeEvent(event: any) {
    // Aquí puedes manejar las acciones 'create', 'update' y 'delete'
    console.log(event.action);
    console.log(event.record);

    // Actualizar la lista de esupervisoras
    this.updateTypeConstructorsList();
  }

  private async updateTypeConstructorsList() {
    // Obtener la lista actualizada de esupervisoras
    const records = await this.pb
      .collection('typeConstructor')
      .getFullList(200 /* cantidad máxima de registros */, {
        sort: '-created', // Ordenar por fecha de creación
      });
    this.typeConstructorsSubject.next(records);
  }

  ngOnDestroy() {
    // Desuscribirse cuando el servicio se destruye
    this.pb.collection('typeConstructor').unsubscribe('*');
  }

  getTypeConstructorsCount(): number {
    return this.typeConstructorsSubject.value.length;
  }
}
