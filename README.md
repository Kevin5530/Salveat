# La parte que no funciona es esta 
##        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link" 
            routerLink="/inicio" 
            routerLinkActive="active">
            Home</a>     
          </li>
          <li *ngIf="!userLoginOn" class="nav-item">
            <a class="nav-link" 
               routerLink="/iniciar-sesion" 
               routerLinkActive="active">Iniciar sesión</a>
          </li>
          <li *ngIf="userLoginOn" class="nav-item">
            <a class="nav-link" routerLink="inicio">Cerrar sesion</a>
          </li>
        </ul>
## esta en src/app/shared/nav/
