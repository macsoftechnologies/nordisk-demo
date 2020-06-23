import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'app/shared/services/user.service';
import { DepartmentService } from 'app/shared/services/department.service';
import { SubcontractorDto, UpdateSubcontractorDto } from 'app/views/Models/Subcontractor';
import { SubcontractorService } from 'app/shared/services/subcontractor.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-sub-contractor',
  templateUrl: './sub-contractor.component.html',
  styleUrls: ['./sub-contractor.component.css']
})
export class SubContractorComponent implements OnInit {
  spinner = false;
  SubcontractorForm: FormGroup;
  croppedImage:string="";
  Departments:any[]=[];
  Editform:boolean=false;
  subcontr:SubcontractorDto={
    subContractorName:null,
    logo:null,
    departId:null,
    // username:null,
    // password:null
  }
  updatesubcontr:UpdateSubcontractorDto={
    id:null,
    subContractorName:null,
    logo:null,
    departId:null,
    // username:null,
    // password:null
  }

  constructor(private fb: FormBuilder, private empservice: UserService,private _snackBar: MatSnackBar,
    private depservice:DepartmentService, private subcservice:SubcontractorService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any[], ) {
      this.spinner = true;
      this.depservice.GetAllDepartments().subscribe(res=>
        {
          this.spinner = false;
          this.Departments=res["data"];
        });
        
      this.SubcontractorForm = this.fb.group({
        subname: ['', [Validators.required]],
        department:['',Validators.required],
        // username:['',Validators.required],
        // password:['',Validators.required],
        
        sublogo: ['', Validators.required],
  
      });
     }

  ngOnInit(): void {

    if (this.data != null && this.data["editform"] == true) {
      this.Editform = true;
      var deptarr=this.data["payload"]["departId"];
      this.updatesubcontr.id=this.data["payload"]["id"];
      //this.SubcontractorForm.controls["DeptId"].setValue(this.data["payload"]["id"]);
      this.SubcontractorForm.controls["subname"].setValue(this.data["payload"]["subContractorName"]);
     // this.SubcontractorForm.controls["username"].setValue(this.data["payload"]["username"]);
     // this.SubcontractorForm.controls["password"].setValue(this.data["payload"]["password"]);
      this.SubcontractorForm.controls["sublogo"].setValue(this.data["payload"]["logo"]);
      this.SubcontractorForm.controls["department"].setValue(deptarr.split(','));
    }
  }
  csvInputChange(fileInputEvent: any) {
    var file=fileInputEvent.target.files[0];
    var reader = new FileReader();
  
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }
  _handleReaderLoaded(e) {
    let reader = e.target;
    this.croppedImage = reader.result;
  }
  Createsubcontractors()
  {
    let depts=this.SubcontractorForm.controls["department"].value;
    this.subcontr.departId=depts.toString();
    this.subcontr.subContractorName=this.SubcontractorForm.controls["subname"].value;
    this.subcontr.logo=this.croppedImage;

  //  this.subcontr.username=this.SubcontractorForm.controls["username"].value;
    //this.subcontr.password=this.SubcontractorForm.controls["password"].value;
    this.spinner = true;
    this.subcservice.CreateSubContractor(this.subcontr).subscribe(res=>
      {
        this.spinner = false;
        this.openSnackBar("Subcontractor Created Successfully");
        this.SubcontractorForm.reset();
      },
      error=>
      {
        this.openSnackBar("Something went wrong. Plz try again later...");
      }
      ); 
    
  }
  Updatesubcrt()
  {
    this.spinner = true;
    let depts=this.SubcontractorForm.controls["department"].value;
    this.updatesubcontr.departId=depts.toString();
    this.updatesubcontr.subContractorName=this.SubcontractorForm.controls["subname"].value;
    //this.updatesubcontr.username=this.SubcontractorForm.controls["username"].value;
    //this.updatesubcontr.password=this.SubcontractorForm.controls["password"].value;
    this.updatesubcontr.logo=this.croppedImage;

    this.subcservice.UpdateSubContractor(this.updatesubcontr).subscribe(res=>
      {
        if(res["status"]=="200")
     {
      this.openSnackBar("Subcontractor Updated Successfully");
      this.spinner = false;
     }
      //  this.SubcontractorForm.reset();
      },
      error=>
      {
        this.openSnackBar("Something went wrong. Plz try again later...");
      }
      )
   // this.subcservice.UpdateSubContractor()
  }

  openSnackBar(msg) {
    this._snackBar.open(msg, "Close", {
      duration: 2000,

    });
  }
}
