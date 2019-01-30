import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TasksService } from 'src/app/tasks/tasks.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IMyDpOptions } from 'mydatepicker';
import { FormArray } from '@angular/forms';



@Component({
  selector: 'app-add',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {
  @Input() public categories;
  @Input() public priorities;
  addTaskForm;
  Date = new Date();
  year = this.Date.getFullYear();
  month = this.Date.getMonth() + 1;
  day = this.Date.getDate();

  public myDatePickerOptions: IMyDpOptions = {
    todayBtnTxt: 'Today',
    dateFormat: 'yyyy-mm-dd',
    disableUntil: { year: this.year, month: this.month, day: this.day },
  };
  constructor(private TasksService: TasksService,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,

  ) {
    this.addTaskForm = new FormGroup({
      name: new FormControl(null, Validators.compose([Validators.required])),
      dueDate: new FormControl(null, Validators.compose([Validators.required])),
      priority: new FormControl(null, Validators.compose([Validators.required])),
      categoryId: new FormControl(null),
    })
  }

  ngOnInit() {
  }

  submit() {
    if (this.addTaskForm.valid) {
      this.addTaskForm.value['dueDate'] = this.addTaskForm.value['dueDate']['formatted'],
      this.TasksService.addTask(this.addTaskForm.value).subscribe(
        res => {
            this.TasksService.updateParent({"refresh" :"true"})
            this.activeModal.dismiss();
        },
        err => {

        });
    } else {
      this.validateAllFormFields(this.addTaskForm);

    }

  }

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
