import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-popover-radio',
  templateUrl: './popover-radio.component.html',
  styleUrls: ['./popover-radio.component.scss'],
})
export class PopoverRadioComponent implements OnInit {

  @Input() options: string[] = [];

  constructor() { }

  ngOnInit() {}

}
