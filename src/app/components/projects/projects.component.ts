import { Component } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { GlobalService } from '../../services/global.service';
import { FormBuilder } from '@angular/forms';
import { AuthPocketbaseService } from '../../services/auth-pocketbase.service';
import { RealtimeProjectsService } from '../../services/realtime-projects.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { DataApiService } from '../../services/data-api.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Project {
  title: string;
  description: string;
  location: string;
  square_meters: number;
  category: string;
  team: string;
  challenge: string;
  concept: string;
  execution: string;
/*   image: File | null;
 */  date: string;
  status: string;
}
@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent {
  showForm: boolean = false;
  projectForm: FormGroup;
  previewImage: string = 'assets/images/thumbs/setting-profile-img.jpg';
  projects: Project[] = [];
  constructor(
    public global: GlobalService,
    private fb: FormBuilder,
    public auth: AuthPocketbaseService,
    public realtimeProjects: RealtimeProjectsService,
    private pb: AuthPocketbaseService,
    public dataApi: DataApiService,
    private http: HttpClient
  ){
    this.realtimeProjects.projects$;

    this.projectForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      location: ['', Validators.required],
      square_meters: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      team: ['', Validators.required],
      challenge: ['', Validators.required],
      concept: ['', Validators.required],
      execution: ['', Validators.required],
      date: [new Date().toISOString().split('T')[0], Validators.required], // Formato correcto para input date
      status: ['active', Validators.required] // Valor por defecto
    });
  }
   // Alternar la visibilidad del formulario
   showNewProject() {
    this.showForm = !this.showForm;
  }

  // Manejar la selección de archivo e imagen de vista previa
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.projectForm.patchValue({ image: file });
      this.previewImage = URL.createObjectURL(file);
    }
  }
  addNewProject() {
    if (this.projectForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Formulario inválido',
        text: 'Por favor complete todos los campos correctamente.'
      });
      return;
    }
  
    const nuevoProyecto: Project = {
      title: this.projectForm.value.title,
      description: this.projectForm.value.description,
      location: this.projectForm.value.location,
      square_meters: this.projectForm.value.square_meters,
      category: this.projectForm.value.category,
      team: this.projectForm.value.team,
      challenge: this.projectForm.value.challenge,
      concept: this.projectForm.value.concept,
      execution: this.projectForm.value.execution,      
/*       image: this.projectForm.value.image,
 */      date: new Date().toISOString(),
      status: 'active'
    };
  
    // Cambiar el método de envío
    this.dataApi.saveProject(nuevoProyecto).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Proyecto creado',
          text: 'El proyecto se ha creado exitosamente'
        });
        this.projectForm.reset();
        this.previewImage = 'assets/images/thumbs/setting-profile-img.jpg';
        this.showForm = false;
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al crear el proyecto.'
        });
        console.error('Error al crear el proyecto:', error);
      }
    });
  }
  // Enviar el formulario para agregar un nuevo supervisor
  /* addNewProject() {
    if (this.projectForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Formulario inválido',
        text: 'Por favor complete todos los campos correctamente.'
      });
      return;
    }
  
    const nuevoProyecto: Project = {
      title: this.projectForm.value.title,
      description: this.projectForm.value.description,
      location: this.projectForm.value.location,
      square_meters: this.projectForm.value.square_meters,
      category: this.projectForm.value.category,
      team: this.projectForm.value.team,
      challenge: this.projectForm.value.challenge,
      concept: this.projectForm.value.concept,
      execution: this.projectForm.value.execution,      
      image: this.projectForm.value.image,
      date: new Date().toISOString(),
      status: 'active'
    };
  
    this.realtimeProjects.addProject(nuevoProyecto).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Proyecto creado',
          text: 'El proyecto se ha creado exitosamente'
        });
        this.projectForm.reset();
        this.previewImage = 'assets/images/thumbs/setting-profile-img.jpg';
        this.showForm = false;
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al crear el proyecto.'
        });
        console.error('Error al crear el proyecto:', error);
      }
    });
  } */
}
