import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { GlobalService } from './services/global.service';
import { LoadStyleService } from './services/load-style.service';
import { ScriptLoaderService } from './services/script-loader.service';
import { SiderComponent } from './components/ui/sider/sider.component';
import { TopNavbarComponent } from './components/ui/top-navbar/top-navbar.component';
import { LoginComponent } from './components/login/login.component';
import { HomedashComponent } from './components/homedash/homedash.component';
import { AuthPocketbaseService } from './services/auth-pocketbase.service';
import { ProjectsComponent } from './components/projects/projects.component';
import { QuotesComponent } from './components/quotes/quotes.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ResourcesComponent } from './components/resources/resources.component';
import { ServiceComponent } from './components/service/service.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HomeComponent,
    SiderComponent,
    TopNavbarComponent,
    LoginComponent,
    HomedashComponent,
    ProjectsComponent,
    QuotesComponent,
    SettingsComponent,
    ResourcesComponent,
    ServiceComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {
  title = 'adminspatium';

  constructor(
    public global: GlobalService,
    public loadStyle: LoadStyleService,
    public scriptLoader: ScriptLoaderService,
    public auth: AuthPocketbaseService
  ) { 
    this.auth.permision();
  }
  ngOnInit(): void {
    this.theme();

  }
  theme() {
    this.loadStyle.loadStyle('assets/css/bootstrap.min.css');
    this.loadStyle.loadStyle('assets/css/file-upload.css');
    this.loadStyle.loadStyle('assets/css/plyr.css');
    this.loadStyle.loadStyle('assets/css/full-calendar.css');
    this.loadStyle.loadStyle('assets/css/jquery-ui.css');
    this.loadStyle.loadStyle('assets/css/editor-quill.css');
    this.loadStyle.loadStyle('assets/css/apexcharts.css');
    this.loadStyle.loadStyle('assets/css/calendar.css');
    this.loadStyle.loadStyle('assets/css/jquery-jvectormap-2.0.5.css');
    this.loadStyle.loadStyle('assets/css/main.css');

    if (typeof document !== 'undefined') {
      this.scriptLoader
        .loadScripts([
          /* 'assets/js/jquery-3.7.1.min.js',
          'assets/js/boostrap.bundle.min.js', */
          'assets/js/phosphor-icon.js',
          'assets/js/file-upload.js',
          'assets/js/plyr.js',
          'assets/js/full-calendar.js',
          'assets/js/jquery-ui.js',
          'assets/js/editor-quill.js',
          'assets/js/apexcharts.min.js',
          'assets/js/jquery-jvectormap-2.0.5.min.js',
          'assets/js/jquery-jvectormap-world-mill-en.js',
          'assets/js/main.js',
        ])
        .then((data) => {
          console.log('Todos los scripts se han cargado correctamente', data);
        })
        .catch((error) => console.error('Error al cargar los scripts', error));
    }

  }
}
