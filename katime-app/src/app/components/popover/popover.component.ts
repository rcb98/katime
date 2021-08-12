import { Component, OnInit } from '@angular/core';
import { FuenteService } from 'src/app/services/fuente.service';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {

  constructor(private fuenteService: FuenteService) { }

  ngOnInit() {}

  deleteAll(){
    this.fuenteService.deleteTable();
  }

}
