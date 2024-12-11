import { Component } from '@angular/core';
import { GlobalService } from '../../../services/global.service';
import { AuthPocketbaseService } from '../../../services/auth-pocketbase.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sider.component.html',
  styleUrl: './sider.component.css'
})
export class SiderComponent {
  constructor(
    public global: GlobalService,
    public auth: AuthPocketbaseService
  ){
    this.auth.permision();
  }
}
