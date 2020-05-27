import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';

import { MatSnackBar } from '@angular/material/snack-bar';
import { egretAnimations } from 'app/shared/animations/egret-animations';
import { Subscription } from 'rxjs';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { UserService } from 'app/shared/services/user.service';
import { ListPopupComponent } from '../list-popup/list-popup.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-request',
  templateUrl: './list-request.component.html',
  styleUrls: ['./list-request.component.css'],
  animations: egretAnimations
})
export class ListRequestComponent implements OnInit {


  public items: any[];
  public getItemSub: Subscription;
  constructor(
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService,
    private userservices:UserService,
    private route:Router
  ) { }

  ngOnInit() {
    this.getItems();
    console.log(this.userservices.RequestLists);
  }
  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe()
    }
  }
  getItems() {
    
    // this.getItemSub = this.crudService.getItems()
    //   .subscribe(data => {
    //     this.items = data;
    //   })
    this.items=this.userservices.RequestLists;
  }

  openPopUp(data) {
    let title = 'Request';
    let dialogRef: MatDialogRef<any> = this.dialog.open(ListPopupComponent, {
      width: '1200px',
      height:'600px',
      disableClose: false,
      data: { title: title, payload: data }
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        if(!res) {
          // If user press cancel
          return;
        }
        this.loader.open();
        // if (isNew) {
        //   // this.crudService.addItem(res)
        //   //   .subscribe(data => {
        //   //     this.items = data;
        //   //     this.loader.close();
        //   //     this.snack.open('Member Added!', 'OK', { duration: 4000 })
        //   //   })
        // } else {
        //   // this.crudService.updateItem(data._id, res)
        //   //   .subscribe(data => {
        //   //     this.items = data;
        //   //     this.loader.close();
        //   //     this.snack.open('Member Updated!', 'OK', { duration: 4000 })
        //   //   })
        // }
      })
  }
  deleteItem(row) {
    this.confirmService.confirm({message: `Delete ${row.name}?`})
      .subscribe(res => {
        if (res) {
          this.loader.open();
          // this.crudService.removeItem(row)
          //   .subscribe(data => {
          //     this.items = data;
          //     this.loader.close();
          //     this.snack.open('Member deleted!', 'OK', { duration: 4000 })
          //   })
        }
      })
  }
  addrequest()
  {
    this.route.navigateByUrl('user/new-request');
  }
}
