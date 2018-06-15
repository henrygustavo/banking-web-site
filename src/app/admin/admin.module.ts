import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashBoardComponent } from './dashboard/dashboard.component';
import { adminRoutes } from './admin.routes';
import { AdminGuard } from './guards/admin.guard';

@NgModule({
  imports: [
    CommonModule,
    adminRoutes
  ],
  declarations: [DashBoardComponent],
  providers: [AdminGuard]

})
export class AdminModule { }

