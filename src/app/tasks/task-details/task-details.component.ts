import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { TasksService } from 'src/app/tasks/tasks.service';
import { log } from 'util';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IMyDpOptions } from 'mydatepicker';
import { FormArray } from "@angular/forms";


@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css'],
})
export class TaskDetailsComponent implements OnInit {
  @Input() public task;
  @Input() public categories;
  @Input() public priorities;

  editTaskForm;
  editSubTaskForm;
  addSubTaskForm;
  taskDetails;
  selectedSubTask;
  editTaskInfo = false;
  newSubTask = false;
  Date = new Date();
  year = this.Date.getFullYear();
  month = this.Date.getMonth() + 1;
  day = this.Date.getDate();

  public myDatePickerOptions: IMyDpOptions = {
    todayBtnTxt: 'Today',
    dateFormat: 'yyyy-mm-dd',
    disableUntil: { year: this.year, month: this.month, day: this.day },
  };
  constructor(
    public activeModal: NgbActiveModal,
    private tasksService: TasksService,
    private modalService: NgbModal,
  ) { }
  ngOnInit() {
    this.getSubTasks();
    this.editTaskForm = new FormGroup({
      name: new FormControl(this.task.name, Validators.compose([Validators.required])),
      priority: new FormControl(this.task.priority, Validators.compose([Validators.required])),
      categoryId: new FormControl(this.task.categoryId),
      dueDate: new FormControl(null, Validators.compose([Validators.required])),
    });

    this.addSubTaskForm = new FormGroup({
      item: new FormControl(null, Validators.compose([Validators.required])),
      done: new FormControl(false),
      optional: new FormControl(false)
    });

    this.editSubTaskForm = new FormGroup({
      item: new FormControl(null, Validators.compose([Validators.required])),
    });
  }
  //fetch a single task
  getTask(id) {
    this.tasksService.viewTask(id).subscribe(result => {
      this.task = result;
    })
  }
  // fetch all subtasks
  getSubTasks() {
    this.tasksService.getSubTask(this.task.id).subscribe(
      res => {
        this.taskDetails = res;
      }
    );
  }
  // submit the edited task
  submitEditTask() {
    if (this.editTaskForm.valid) {
      this.editTaskForm.value['dueDate'] = this.editTaskForm.value['dueDate']['formatted'],
        this.editTaskForm.value['categoryId'] = parseInt(this.editTaskForm.value['categoryId']);
      this.tasksService.editTask(this.task.id, this.editTaskForm.value).subscribe(
        res => {
          this.tasksService.updateParent({ "refetech": "true" });
          this.getTask(this.task.id);
          this.editTaskInfo = false;
        }
      );
    } else {
      this.validateAllFormFields(this.editTaskForm);
    }
  }
  // toggle edit form flag
  editForm() {
    this.editTaskInfo = true;
  }
  // edit subtask function
  editSubTask(id) {
    if (this.editSubTaskForm.valid) {
      this.tasksService.editSubTask(id, this.editSubTaskForm.value).subscribe(
        result => {
          this.selectedSubTask = null;
          this.ngOnInit();
        }
      );
    }
  }
  // toggle and submit subtask checkbox
  toggleCheck(id, toggledValue) {
    toggledValue = !toggledValue;
    this.tasksService.toggleSubTask(id, toggledValue).subscribe(
      result => {
        this.getSubTasks();
      }
    );
  }
  // select subtask to edit
  selectSubTask(id) {
    this.selectedSubTask = id;
  }
  // create new subtask to be added
  addSubTask() {
    this.newSubTask = true;
  }
  // submit a new subtask
  submitNewSubTask() {
    if (this.addSubTaskForm.valid) {
      this.tasksService.addSubTask(this.task.id, this.addSubTaskForm.value).subscribe(
        res => {
          this.ngOnInit();
          this.newSubTask = false;
        }
      );
    } else {
      this.validateAllFormFields(this.addSubTaskForm);
    }
  }
  // function to validate input fields of the forms
  validateAllFormFields(formGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      } else if (control instanceof FormArray) {
        for (let i = 0; i < control.controls.length; i++) {
          this.validateAllFormFields(control.controls[i]);
        }
      }
    });
  }
}

