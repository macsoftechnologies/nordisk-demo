import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-list-popup',
  templateUrl: './list-popup.component.html',
  styleUrls: ['./list-popup.component.css']
})
export class ListPopupComponent implements OnInit {

  constructor( @Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<ListPopupComponent>,) { }

  Requestdata:any;
  ngOnInit() {
    this.buildItemForm(this.data.payload)
  }
  buildItemForm(item)
  {
    this.Requestdata=item;
  }

}
