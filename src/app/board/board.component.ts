import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TaskArraysService } from '../task-arrays.service';
import { RemotestorageService } from '../remotestorage.service';
@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  @ViewChild('floatingTaskContainer') floatingTaskContainer: ElementRef;

  selectedTask: any;

  constructor(
    public TaskArrayService: TaskArraysService,
    public RemotestorageService: RemotestorageService
  ) {}

  async ngOnInit() {}

  openTask(i: number) {
    this.selectedTask = this.TaskArrayService.tasks[i];
    this.floatingTaskContainer.nativeElement.classList.add(
      'show-floating-container'
    );
  }

  closeTask() {
    this.floatingTaskContainer.nativeElement.classList.toggle(
      'show-floating-container'
    );
  }
}
