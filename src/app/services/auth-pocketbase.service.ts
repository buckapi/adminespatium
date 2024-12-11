import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase';
import { Observable, from, tap, map, BehaviorSubject } from 'rxjs';
import { GlobalService } from './global.service';
import { UserInterface } from '../interface/user-interface'; 

@Injectable({
  providedIn: 'root'
})

export class AuthPocketbaseService {
  private pb: PocketBase;
  complete: boolean = false;
  private userTypeSubject = new BehaviorSubject<string | null>(this.getUserTypeFromStorage());
  userType$ = this.userTypeSubject.asObservable();
  
  constructor( 
    public global: GlobalService
   ) 
  { 
    this.pb = new PocketBase('https://db.buckapi.com:8096');
  }
 
    generateRandomPassword(length: number = 8): string {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let password = '';
      for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return password;
    }

 

    private isLocalStorageAvailable(): boolean {
      return typeof localStorage !== 'undefined';
    }
  
    // Obtener el tipo de usuario desde el almacenamiento local
    private getUserTypeFromStorage(): string | null {
      if (this.isLocalStorageAvailable()) {
        return localStorage.getItem('type');
      }
      return null;
    }
    setUserType(type: string): void {
      if (this.isLocalStorageAvailable()) {
        localStorage.setItem('type', type);
      }
      this.userTypeSubject.next(type);
    }
  
    clearUserType(): void {
      if (this.isLocalStorageAvailable()) {
        localStorage.removeItem('type');
      }
      this.userTypeSubject.next(null);
    }
 
 /*    isLogin() {
    return localStorage.getItem('isLoggedin');
  } */
    isLogin(): boolean {
      if (this.isLocalStorageAvailable()) {
        return localStorage.getItem('isLoggedin') === 'true';
      }
      return false;
    }

  isAdmin() {
    const userType = localStorage.getItem('type');
    return userType === '"admin"';
  }

 

  registerUser(email: string, password: string, type: string, name: string, username: string, company: string
    ): Observable<any> 
    {
    const userData = {
      email: email,
      password: password,
      passwordConfirm: password,
      type: type,
      username: username,
      name: name,
      company: company,
    };

    // Create user
    return from(
      this.pb
        .collection('users')
        .create(userData)
        .then((user) => {
          const data = {
            name: name,
            phone: '', // Agrega los campos correspondientes aquí
            userId: user.id, // Utiliza el ID del usuario recién creado
            status: 'pending', // Opcional, establece el estado del cliente
            images: {}, // Agrega los campos correspondientes aquí
          };
          if (type === 'cliente') {
            return this.pb.collection('customers').create(data);
          } else if (type === 'supervisor') {
            return this.pb.collection('supervisor').create(data);
          } else if (type === 'tecnico') {
            return this.pb.collection('technical').create(data);
          } else {
            throw new Error('Tipo de usuario no válido');
          }
        })
      );  
    }
  loginUser(email: string, password: string): Observable<any> {
    return from(this.pb.collection('users').authWithPassword(email, password))
      .pipe(
        map((authData) => {
          const pbUser = authData.record;
          const user: UserInterface = {
            id: pbUser.id,
            email: pbUser['email'],
            name: pbUser['name'],
            password: '', // No almacenamos la contraseña por seguridad
            phone: pbUser['phone'],
            images: pbUser['images'] || {},
            type: pbUser['type'],
            username: pbUser['username'],
            address: pbUser['address'],
            created: pbUser['created'],
            updated: pbUser['updated'],
            avatar: pbUser['avatar'] || '',
            status: pbUser['status'] || 'active',
            company: pbUser['company'] || '',
            // Añade aquí cualquier otro campo necesario
          };
          return { ...authData, user };
        }),
        tap((authData) => {
          this.setUser(authData.user);
          this.setToken(authData.token);
          localStorage.setItem('isLoggedin', 'true');
          localStorage.setItem('userId', authData.user.id);
        })
      );
  }

  logoutUser(): Observable<any> {
    // Limpiar la autenticación almacenada
    localStorage.removeItem('accessToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedin');
    localStorage.removeItem('dist');
    localStorage.removeItem('userId');
    localStorage.removeItem('type');
    localStorage.removeItem('clientCard');
    localStorage.removeItem('clientFicha');
    localStorage.removeItem('memberId');
    localStorage.removeItem('status');

    this.pb.authStore.clear();
    this.global.setRoute('login');
    
    // this.virtualRouter.routerActive = "home";
    return new Observable<any>((observer) => {
      observer.next(); // Indicar que la operación de cierre de sesión ha completado
      observer.complete();
    });
  }

  setUser(user: UserInterface): void {
    let user_string = JSON.stringify(user);
    let type = JSON.stringify(user.type);
    localStorage.setItem('currentUser', user_string);
    localStorage.setItem('type', type);
  }
  setToken(token: any): void {
    localStorage.setItem('accessToken', token);
  }

  getCurrentUser(): UserInterface | null {
    if (this.isLocalStorageAvailable()) {
      const user = localStorage.getItem('currentUser');
      return user ? JSON.parse(user) : null; // Devuelve el usuario actual o null si no existe
    }
    return null; // Retorna null si no está en un entorno cliente
  }
  
  getUserId(): string {
    if (this.isLocalStorageAvailable()) {
      const userId = localStorage.getItem('userId');
      return userId ? userId : ''; // Devuelve el usuario actual o null si no existe
    }
    return ''; // Retorna vacío si no está en un entorno cliente
  }
  
  getFullName(): string {
    const userString = localStorage.getItem('currentUser');
    if (userString) {
      const user = JSON.parse(userString);
      return user.name || 'Usuario';
    }
    return 'Usuario';
  }
  profileStatus() {
    return this.complete;
  }
 

/* permision() {
  const currentUser = this.getCurrentUser();
  if (!currentUser || !currentUser.type) {
    this.global.setRoute('home');
    return;
  }

  const userType = currentUser.type.replace(/"/g, '');

  switch (userType) {
    case 'admin':
      this.global.setRoute('homedash');
      break;
    
    default:
      console.warn('Tipo de usuario no reconocido');
      this.global.setRoute('login');
  }
} */
  permision() {
    // Primero verificamos si hay una sesión iniciada
    if (!this.isLogin()) {
      this.global.setRoute('home');
      return;
    }
  
    const currentUser = this.getCurrentUser();
    if (!currentUser || !currentUser.type) {
      this.global.setRoute('homedash');
      return;
    }
  
    const userType = currentUser.type.replace(/"/g, '');
  
    switch (userType) {
      case 'admin':
        this.global.setRoute('homedash');
        break;
      default:
        this.global.setRoute('homedash');
    }
  }





  
}
