import { Component } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { CommonModule } from '@angular/common';
import { AuthPocketbaseService } from '../../services/auth-pocketbase.service';

@Component({
  selector: 'app-homedash',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './homedash.component.html',
  styleUrl: './homedash.component.css'
})
export class HomedashComponent {
constructor(public global: GlobalService, public auth: AuthPocketbaseService){}
}
