import {
  Component,
  Input,
  ChangeDetectorRef,
  OnDestroy,
  OnInit
} from '@angular/core';
import { MapService } from './map.service';

import { Subject } from 'rxjs';

@Component({
  selector: 'bnb-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {
  @Input() location: string;
  isPositionError: boolean = false;
  lat: number;
  lng: number;

  @Input() locationSubject: Subject<any>;

  constructor(private mapService: MapService, private ref: ChangeDetectorRef) {}

  ngOnInit() {
    if (this.locationSubject) {
      this.locationSubject.subscribe((location: string) => {
        this.getLocation(location);
      });
    }
  }

  ngOnDestroy() {
    if (this.locationSubject) {
      this.locationSubject.unsubscribe();
    }
  }

  getLocation(location) {
    this.mapService.getGeoLocation(location).subscribe(
      coordinates => {
        this.lat = coordinates.lat;
        this.lng = coordinates.lng;

        this.ref.detectChanges;
      },
      () => {
        this.isPositionError = true;
      }
    );
  }

  mapReadyHandler() {
    this.getLocation(this.location);
  }
}
