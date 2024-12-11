import { Component } from '@angular/core';
import { AuthPocketbaseService } from '../../../services/auth-pocketbase.service';
import { GlobalService } from '../../../services/global.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-top-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-navbar.component.html',
  styleUrl: './top-navbar.component.css'
})
export class TopNavbarComponent {
  constructor (
    public auth:AuthPocketbaseService,
    public global: GlobalService
  ){
    this.auth.permision();

  }
}
