import { Component } from '@angular/core';
import { GlobalService } from '../../../services/global.service';

@Component({
  selector: 'app-sider',
  standalone: true,
  imports: [],
  templateUrl: './sider.component.html',
  styleUrl: './sider.component.css'
})
export class SiderComponent {
  constructor(
    public global: GlobalService
  ){}
}
