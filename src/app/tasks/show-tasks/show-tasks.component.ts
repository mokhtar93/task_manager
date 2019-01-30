import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { TasksService } from 'src/app/tasks/tasks.service';
import { TaskDetailsComponent } from 'src/app/tasks/task-details/task-details.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderModule } from 'ngx-order-pipe';
import { BehaviorSubject, combineLatest } from "rxjs";
import { FormControl, FormArray } from "@angular/forms";
import { startWith } from "rxjs/operators";
import { debug, log } from 'util';
import { FormGroup } from '@angular/forms';
import { AddTaskComponent } from 'src/app/tasks/add-task/add-task.component';


@Component({
  selector: 'app-show-tasks',
  templateUrl: './show-tasks.component.html',
  styleUrls: ['./show-tasks.component.css']
})
export class ShowTasksComponent implements OnInit {
  categories: any = [];
  items: any = [];
  priorities = ['high', 'medium', 'low'];
  itemsSeparated = [];
  itemDetails;
  moda = false;
  items$ = new BehaviorSubject<any[]>([]);
  filteredItems$ = new BehaviorSubject<any[]>([]);
  sortedItems = new BehaviorSubject<any[]>([]);
  nameFilter = new FormControl();
  prioritiesFilter = new FormArray([]);
  submitForm;
  constructor(private TasksService: TasksService,
    private modalService: NgbModal,
  ) {
    this.submitForm = new FormGroup({
      nameFilter: this.nameFilter,
      prioritiesFilter: this.prioritiesFilter
    })
  }

  ngOnInit() {
    this.getCategories();
    this.getItems();
    this.updateData();
    this.filter();
    this.sparateItems();
  }
  //fetch all categories
  getCategories() {
    this.TasksService.getCategories().subscribe(
      result => {
        this.categories = result;
      }
    );
  }
  //fetch all items
  getItems() {
    this.TasksService.getTasks().subscribe(
      result => {
        this.items = result;
        this.items$.next(this.items);
        this.sparateItems();
      }
    );
  }
  //view item function
  viewItem(item) {
    const modalRef = this.modalService.open(TaskDetailsComponent);
    modalRef.componentInstance.task = item;
    modalRef.componentInstance.categories = this.categories;
    modalRef.componentInstance.priorities = this.priorities;
  }
  //checker for changes on filters
  onCheckChange(event, array) {
    const formArray: FormArray = array;
    if (event.target.checked) {
      // Add a new control in the arrayForm
      formArray.push(new FormControl(event.target.value));
    } else {
      // find the unselected element
      let i: number = 0;
      formArray.controls.forEach((ctrl: FormControl) => {
        if (ctrl.value == event.target.value) {
          // Remove the unselected element from the arrayForm
          formArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }
  //filter function by name and priorities
  filter() {
    this.filteredItems$.next(this.items$.value);
    combineLatest(
      this.items$,
      this.nameFilter.valueChanges.pipe(startWith("")),
      this.prioritiesFilter.valueChanges.pipe(startWith("")),
    ).subscribe(
      ([
        items,
        FilterByName,
        Filterpriorities,
      ]) => {
        let filteredTasks = [...items];
        if (FilterByName) {
          filteredTasks = filteredTasks.filter(
            item =>
              item.name.toLowerCase().includes(FilterByName)
          );
        }
        if (Filterpriorities) {
          let main = filteredTasks;
          let data = [];
          for (let i = 0; i < Filterpriorities.length; i++) {
            filteredTasks.forEach(
              item => {
                if (item.priority === Filterpriorities[i]) {
                  if (!data.includes(item)) {
                    data.push(item);
                  }
                }
              }
            )
          }
          if (data.length > 0) {
            filteredTasks = data;
          } else {
            filteredTasks = main;
          }
        }
        this.filteredItems$.next(filteredTasks);
        }
      );
  }
  //add new item
  addNewItem() {
    const modalRef = this.modalService.open(AddTaskComponent);
    modalRef.componentInstance.categories = this.categories;
    modalRef.componentInstance.priorities = this.priorities;
  }
  //separating items into different arrays according to categories
  sparateItems() {
    let option = {};
    let observer2Subject = this.filteredItems$
      .subscribe(item => {
        this.sortedItems.next(item);
        this.itemsSeparated = [];
        for (let i = 0; i < this.categories.length; i++) {
          option["name"] = this.categories[i]["name"];
          option["items"] = this.sortedItems.getValue().filter(item => item.categoryId == this.categories[i]["id"]);
          this.itemsSeparated.push(option);
          option = {};
        }
        option["name"] = "No Category";
        option["items"] = this.sortedItems.getValue().filter(item => item.categoryId == null);
        this.itemsSeparated.push(option);
      }
    );
  }
  //sort each array category
  sort(index, array, sortType) {
    let sortOrder
    if (sortType == 'up') {
      sortOrder = ['high', 'medium', 'low'];
    } else if (sortType == 'down') {
      sortOrder = ['low', 'medium', 'high'];
    }
    const ordering = {};
    for (var i = 0; i < sortOrder.length; i++) {
      ordering[sortOrder[i]] = i;
    }
    array.sort(function (a, b) {
      return (ordering[a.priority] - ordering[b.priority]);
    });
    this.itemsSeparated[index]['items'] = array;
  }
  //update data after edit item or adding item
  updateData() {
    this.TasksService.tabsObjValue.subscribe(val => {
        this.getItems();
    });
  }
}
