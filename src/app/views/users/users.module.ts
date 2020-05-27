import { NgModule } from '@angular/core';
import { CommonModule,DatePipe } from '@angular/common';
import { usersRoutes } from './users-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NewRequestComponent } from './Requests/new-request/new-request.component';
import { ListRequestComponent } from './Requests/list-request/list-request.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { PlansComponent } from './plans/plans.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { NgxEchartsModule } from 'ngx-echarts';
import { ChartsModule } from 'ng2-charts';
import { ListPopupComponent } from './Requests/list-popup/list-popup.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [DashboardComponent, NewRequestComponent, ListRequestComponent, NotificationsComponent, PlansComponent, ListPopupComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatSelectModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatDividerModule,
    MatGridListModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatTableModule,
    MatMenuModule,
    MatProgressBarModule,
    ChartsModule,
    NgxEchartsModule,
    NgxMaterialTimepickerModule,
    NgxDatatableModule,
    MatChipsModule,
    MatListModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    TranslateModule,
    RouterModule.forChild(usersRoutes)
  ],
  
  providers: [
    DatePipe,
    
  ],
  entryComponents: [ListPopupComponent]
})
export class UsersModule { }
