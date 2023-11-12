import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FakeHttpService, randomCity } from '../data-access/fake-http.service';
import { CityStore } from '../data-access/store/city.store';
import { CardComponent } from '../ui/card/card.component';
import { ListItemComponent } from '../ui/list-item/list-item.component';

@Component({
  selector: 'app-city-card',
  template: `
    <app-card (add)="addCity()" [list]="cities$ | async" class="bg-light-blue">
      <img [style.aspect-ratio]="1" src="assets/img/city.jpeg" width="200px" />
      <ng-template #rowRef let-city>
        <app-list-item (delete)="deleteCity(city.id)">
          {{ city.name }}
        </app-list-item>
      </ng-template>
    </app-card>
  `,
  styles: [
    `
      .bg-light-blue {
        background-color: rgba(0, 0, 250, 0.1);
      }
    `,
  ],
  standalone: true,
  imports: [AsyncPipe, CardComponent, ListItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CityCardComponent implements OnInit {
  cities$ = this.store.cities$;

  constructor(private http: FakeHttpService, private store: CityStore) {}

  ngOnInit(): void {
    this.http.fetchCities$.subscribe((c) => {
      this.store.addAll(c);
    });
  }

  addCity() {
    this.store.addOne(randomCity());
  }

  deleteCity(id: number) {
    this.store.deleteOne(id);
  }
}
