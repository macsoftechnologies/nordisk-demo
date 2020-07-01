import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UpdateRequestStatusListDto } from 'app/views/Models/RequestDto';
import { RequestService } from 'app/shared/services/request.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-request-save-options-dialog',
  templateUrl: './request-save-options-dialog.component.html',
  styleUrls: ['./request-save-options-dialog.component.css']
})
export class RequestSaveOptionsDialogComponent implements OnInit {

  activityvalues:any[]=["Yes","No"];
  selectedValue:string="";
  title:string="";
  status:string="";
  Listitemsstatus:boolean=false;
  req_ids:"";

  UpdateRequestStatusList:UpdateRequestStatusListDto=
  {
    Request_status:null,
    id:null
  }
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<RequestSaveOptionsDialogComponent>,
    private reqservice:RequestService,
    private _snackBar: MatSnackBar) { }


  ngOnInit(): void {
    this.title=this.data["title"];
    this.status=this.data["statustype"];
    this.Listitemsstatus=this.data["listitemsstatus"];
    this.req_ids=this.data["payload"];
  }

  SaveHold(status): void {
  
    this.dialogRef.close({data:status});
  }
  ChangeListStaus()
  {

    this.UpdateRequestStatusList.Request_status=this.status;
    this.UpdateRequestStatusList.id=this.req_ids;

    this.reqservice.UpdateListStatusRequest(this.UpdateRequestStatusList).subscribe(res=>
      {
        this.openSnackBar("Requests Status Updated Successfully");
      },
      error=>
      {
        this.openSnackBar("something went wrong please try again later...");
      });
  }
  openSnackBar(msg) {
    this._snackBar.open(msg, "Close", {
      duration: 2000,
    });
  }
}
