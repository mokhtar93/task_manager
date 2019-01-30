import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ShowTasksComponent } from "src/app/tasks/show-tasks/show-tasks.component";

const routes: Routes = [
  { path: "", component: ShowTasksComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TasksRoutingModule {}
