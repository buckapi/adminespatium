import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthPocketbaseService } from '../../services/auth-pocketbase.service';
import { RealtimeProjectsService } from '../../services/realtime-projects.service';
import { DataApiService } from '../../services/data-api.service';

@Component({
  selector: 'app-service',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './service.component.html'
})
export class ServiceComponent {
  showForm: boolean = false;
  serviceForm: FormGroup;
  constructor(
    public global: GlobalService,
    private fb: FormBuilder,
    public auth: AuthPocketbaseService,
    public realtimeProjects: RealtimeProjectsService,
    private pb: AuthPocketbaseService,
    public dataApi: DataApiService,
    private http: HttpClient
  ){
    this.serviceForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  showNewService(){
    this.showForm = true;
  }

  hideNewService(){
    this.showForm = false;
  }

  saveService(){
    console.log(this.serviceForm.value);
  }

  cancelService(){
    this.showForm = false;
  }
}
