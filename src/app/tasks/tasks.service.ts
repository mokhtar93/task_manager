import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import {
  HttpClient,
  HttpParams,
  HttpHeaders,
  HttpRequest
} from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class TasksService {
   httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  constructor(private http: HttpClient) {}
  private tabsObj = new BehaviorSubject(null);
  tabsObjValue = this.tabsObj.asObservable();

  updateParent(obj: object) {
    this.tabsObj.next(obj);
  }

  getTasks() {
    return this.http.get("/tasks");
  }

  getCategories() {
    return this.http.get("/categories");
  }

  viewTask(id){
    return this.http.get(`/tasks/${id}`);
  }

  addSubTask(taskId, newSubTask){
    return this.http.post(`/tasks/${taskId}/subtasks`, newSubTask, this.httpOptions);
  }

  getSubTask(id) {
    return this.http.get(`/tasks/${id}/subtasks`);
  }

  editSubTask(id, newTitle) {
    return this.http.patch(`/subtasks//${id}`, newTitle, this.httpOptions);
  }

  toggleSubTask(id, toggledValue) {
    return this.http.patch(`/subtasks/${id}`, { "done": toggledValue }, this.httpOptions);
  }

  addTask(task) {
    return this.http.post(`/tasks`, task, this.httpOptions);
  }

  editTask(id, body) {
    return this.http.patch(`/tasks/${id}`, body, this.httpOptions);
  }
}
