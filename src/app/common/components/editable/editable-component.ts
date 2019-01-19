import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges
} from '@angular/core';

export class EditableComponent implements OnChanges {
  @Input() entity: any;

  @Input() set field(enitityField: string) {
    this.entityField = enitityField;
    this.setOriginValue();
  }

  @Input() className: string;

  @Input() style: any;

  @Output() entityUpdated = new EventEmitter();

  isActiveInput: boolean = false;

  public entityField: string;

  public originEnitityValue: any;

  constructor() {}

  ngOnInit() {}
  ngOnChanges() {
    this.setOriginValue();
    this.isActiveInput = false;
  }

  updateEntity() {
    const entityValue = this.entity[this.entityField];
    if (entityValue !== this.originEnitityValue) {
      this.entityUpdated.emit({
        [this.entityField]: this.entity[this.entityField]
      });
      this.setOriginValue();
    }
    this.isActiveInput = false;
  }

  cancelUpdate() {
    this.isActiveInput = false;

    this.entity[this.entityField] = this.originEnitityValue;
  }
  setOriginValue() {
    this.originEnitityValue = this.entity[this.entityField];
  }
}
