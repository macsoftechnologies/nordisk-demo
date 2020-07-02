import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UpdateNotes, UpdateSafety, UpdateTime } from 'app/views/Models/MultiRequestUpdateDto';
import { RequestService } from 'app/shared/services/request.service';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SafetyprecautionService } from 'app/shared/services/safetyprecautionservice';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips/chip-input';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { ENTER, COMMA } from '@angular/cdk/keycodes';


@Component({
  selector: 'app-edit-request',
  templateUrl: './edit-request.component.html',
  styleUrls: ['./edit-request.component.css']
})
export class EditRequestComponent implements OnInit {
  precaution:string="";
  Notes:string="";
  StartTime:any;
  EndTime:string="";
  minDate: Date;
  maxDate: Date;
  IsNotes:boolean=false;
  IsSafety:boolean=false;
  IsTime:boolean=false;
  spinner:boolean=false;

  Safetypreselectable = true;
  safetyprecdata: any[] = [];
  safetyList: any[] = [];
  filteredsafety: Observable<any[]>;
  RequestForm: FormGroup;
  @ViewChild('badgeInput') badgeInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  updatenotes:UpdateNotes=
  {
  id:null,
  Notes:null
  }
updatesafety:UpdateSafety=
{
  id:null,
  safety:null
}
updatetimes:UpdateTime=
{
  id:null,
  Start_Time:null,
  End_Time:null
}

  constructor(private reqservice:RequestService,@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<EditRequestComponent>, private safetyservice: SafetyprecautionService,
  private datePipe: DatePipe,private _snackBar: MatSnackBar,private fb: FormBuilder)
  {
    
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 20, 0, 1);
    this.maxDate = new Date(currentYear + 1, 11, 31);
   
    this.safetyservice.GetSafetyprecautions().subscribe(res=>{
      this.safetyList=res["data"];
    });
  }
  ngOnInit(): void
  {

    this.RequestForm = this.fb.group({
      Safetyprecaustion: ['', Validators.required],
    });

    
    if(this.data["title"]=="notes")
    {
       this.IsNotes=true;
    }
    else if(this.data["title"]=="safetyPrecaution")
    {
      // this.filteredsafety = this.RequestForm.controls["Safetyprecaustion"].valueChanges
      // .pipe(
      //   startWith(''),
      //   map(val => val.length >= 1 ? this.filter(val) : [])
      // );

      // this.filteredsafety = this.RequestForm.controls["Safetyprecaustion"].valueChanges.pipe(
      //   startWith(null),
      //   map((fruit: string | null) => fruit ? this._filter(fruit) : this.safetyList.slice()));
      
       this.IsSafety=true; 
    }
    else if(this.data["title"]=="Time")
    {
       this.IsTime=true;
    }
  }

  // filter(val: string) {
  //   return this.safetyList.filter(option =>
  //     option.precaution.toLowerCase().indexOf(val.toLowerCase()) === 0);
  // }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.safetyList.filter(fruit => fruit.precaution.toLowerCase().indexOf(filterValue) === 0);
  }

  CreateNotes()
  {
   
    this.spinner=true;
    this.updatenotes.Notes=this.Notes;
    this.updatenotes.id=this.data["payload"];
    console.log(this.updatenotes);
    this.reqservice.UpdateListReqstNote(this.updatenotes).subscribe(res=>
      {
        console.log(res);
        this.openSnackBar("Notes updated Successfully");
      this.spinner=false;
      });
  }
  CreateSafety()
  {
    // let safty=[];
    // this.safetyprecdata.forEach(res=>
    //   {
    //     safty.push(res["id"]);
    //   });
    // this.spinner=true;
    // this.updatesafety.safety=safty.toString();
     this.updatesafety.id=this.data["payload"];
    // console.log(this.updatesafety);
    this.updatesafety.safety=(this.RequestForm.controls["Safetyprecaustion"].value).toString();


    this.reqservice.UpdateListReqstSafety(this.updatesafety).subscribe(res=>
      {
        this.openSnackBar("Safety updated Successfully");
        this.spinner=false;
      });
  }

  CreateTime()
  {
    this.spinner=true;
    this.updatetimes.Start_Time=this.datePipe.transform(this.StartTime,'HH:mm');
    this.updatetimes.End_Time=this.datePipe.transform(this.EndTime,'HH:mm');
    this.updatetimes.id=this.data["payload"];
    console.log(this.updatetimes);

    this.reqservice.UpdateListReqstTime(this.updatetimes).subscribe(res=>
      {
        this.openSnackBar("Time updated Successfully");
        console.log(res);
        this.spinner=false;
      })
  }

  openSnackBar(msg) {
    this._snackBar.open(msg, "Close", {
      duration: 2000,

    });
    this.dialogRef.close();
  }
  selectedsafety(event: MatAutocompleteSelectedEvent): void {
    this.safetyList.forEach(x => {
      if (x["id"] == event.option.value) {
        this.safetyprecdata.push(x);
      }
    })
    //this.Rooms.push(event.option.viewValue);
   // this.badgeInput.nativeElement.value = '';
    this.RequestForm.controls["Safetyprecaustion"].setValue(null);
  }
  addsafety(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.safetyprecdata.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    // this.RequestForm.controls["Safetyprecaustion"].setValue(null);
    this.RequestForm.controls["Safetyprecaustion"].setValue(this.safetyprecdata);
  }

  removesafety(fruit: string): void {
    const index = this.safetyprecdata.indexOf(fruit);

    if (index >= 0) {
      this.safetyprecdata.splice(index, 1);
    }
  }


}

