import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowTasksComponent } from './show-tasks/show-tasks.component';
import { TaskDetailsComponent } from './task-details/task-details.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddTaskComponent } from './add-task/add-task.component';
import { MyDatePickerModule } from 'mydatepicker';

@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MyDatePickerModule
  ],
  exports:[ShowTasksComponent],
  declarations: [ ShowTasksComponent, TaskDetailsComponent, AddTaskComponent ],
  entryComponents: [ TaskDetailsComponent , AddTaskComponent]

})
export class TasksModule { }
