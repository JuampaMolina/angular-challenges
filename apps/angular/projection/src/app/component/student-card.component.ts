import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FakeHttpService, randStudent } from '../data-access/fake-http.service';
import { StudentStore } from '../data-access/store/student.store';
import { CardComponent } from '../ui/card/card.component';
import { ListItemComponent } from '../ui/list-item/list-item.component';

@Component({
  selector: 'app-student-card',
  template: `
    <app-card
      (add)="addStudent()"
      [list]="students$ | async"
      class="bg-light-green">
      <img src="assets/img/student.webp" width="200px" />
      <ng-template #rowRef let-student>
        <app-list-item (delete)="deleteStudent(student.id)">
          {{ student.firstname }}
        </app-list-item>
      </ng-template>
    </app-card>
  `,
  standalone: true,
  styles: [
    `
      .bg-light-green {
        background-color: rgba(0, 250, 0, 0.1);
      }
    `,
  ],
  imports: [AsyncPipe, CardComponent, ListItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentCardComponent implements OnInit {
  students$ = this.store.students$;

  constructor(private http: FakeHttpService, private store: StudentStore) {}

  ngOnInit(): void {
    this.http.fetchStudents$.subscribe((t) => {
      this.store.addAll(t);
    });
  }

  addStudent() {
    this.store.addOne(randStudent());
  }
  deleteStudent(id: number) {
    this.store.deleteOne(id);
  }
}
