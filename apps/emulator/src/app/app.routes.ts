import {Route} from '@angular/router';
import {Emulator} from "./emulator.component";

export const appRoutes: Route[] = [
  {path: '', pathMatch: 'full', component: Emulator},
];
