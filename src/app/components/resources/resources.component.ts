import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DataApiService } from '../../services/data-api.service';
import { AuthPocketbaseService } from '../../services/auth-pocketbase.service';
import { RealtimeProjectsService } from '../../services/realtime-projects.service';

@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './resources.component.html',
  styleUrl: './resources.component.css'
})
export class ResourcesComponent {
  showForm: boolean = false;
  resourceForm: FormGroup;
constructor(public global: GlobalService,
  private fb: FormBuilder,
  public auth: AuthPocketbaseService,
  public realtimeProjects: RealtimeProjectsService,
  private pb: AuthPocketbaseService,
  public dataApi: DataApiService,
  private http: HttpClient
){
  this.resourceForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
  });
}

showNewResource(){
  this.showForm = true;
}

hideNewResource(){
  this.showForm = false;
}

saveResource(){
  console.log(this.resourceForm.value);
}

cancelResource(){
  this.showForm = false;
}

}