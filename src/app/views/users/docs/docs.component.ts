import { Component, OnInit, ElementRef, ViewChild, Optional, Inject } from '@angular/core';
import { Mydocs } from 'app/views/Models/DocsDto';
import { SubcontractorService } from 'app/shared/services/subcontractor.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';
import { DeleteSubcontractorDto, MydocsDto } from 'app/views/Models/Subcontractor';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { DeleteOptionComponent } from 'app/views/Administrator/delete-option/delete-option.component';
import { CategoryComponent } from '../categories/category/category.component';
import { CategoryService } from 'app/shared/services/category.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.css']
})
export class DocsComponent implements OnInit {

  @ViewChild("fileInput", { static: false }) fileInput: ElementRef;
  files = [];
  index:number=0;
  uploaded_filename:any[]=[];
  spinner: boolean = false;
  isimguploaded: boolean = false;
  isSubCntrSelected:boolean=false;
  isCategorySelected:boolean=false;
  categoryType:string=null;
  userdata: any = {};
  Contractors:any[]=[];
  CategoriesList:any[]=[];
  my_docs: Mydocs =
    {
      userId: null,
      userType: null,
      docs: []
    }
  sub_id: DeleteSubcontractorDto =
    {
      id: null
    }
  my_docs_dto: MydocsDto =
    {
      subcontractorId: null
    }
  Mydocs: any[] = [];
  Mydocs_Category: any[] = [];

  constructor(private subcntrservice: SubcontractorService, private _snackBar: MatSnackBar, private dialog: MatDialog,
    private catservice:CategoryService,
    private authservice: JwtAuthService, @Optional() @Inject(MAT_DIALOG_DATA) public data: any[]) { }

  ngOnInit(): void {
    this.userdata = this.authservice.getUser();
    
   this.GetAllCategories();
      
   // this.GetMyDocs();
  }

  GetAllCategories()
  {
    this.spinner=true;
    forkJoin( this.subcntrservice.GetAllSubContractors(),this.catservice.GetAllCategories()).subscribe(x=>
      {
        this.Contractors=x[0]["data"];
        this.CategoriesList=x[1]["data"];
        this.spinner=false;
      });
  }
  GetMyDocs() {
    this.spinner = true;
    this.subcntrservice.GetSubContractorsDocs(this.my_docs_dto).subscribe(res => {
      if(res["data"])
      {
        this.Mydocs = res["data"];
        this.Mydocs.forEach(x=>
          {
            x["docName"]=x["docName"].substring(x["docName"].indexOf("docs") + 3 , x.length())
          });
      }
      this.spinner = false;

    });
  }

  GetSelectedSubctr(event)
  {

    this.spinner = true;
    this.Mydocs.length=0;
    this.Mydocs=[];
    this.Mydocs_Category.length=0;
    this.Mydocs_Category=[];
    this.categoryType="";
    this.my_docs_dto.subcontractorId = Number.parseInt(event);
    this.subcntrservice.GetSubContractorsDocs(this.my_docs_dto).subscribe(res => {
      
      if(res["data"])
      {
        this.Mydocs = res["data"];
        this.Mydocs.forEach(x=>
          {
            x["docName"]=x["docName"].substring(x["docName"].indexOf("docs")+5 , x["docName"].length)
          });
      }
      this.isSubCntrSelected=true;
      this.spinner = false;
    });
  }
  csvInputChange(e) {
    this.isimguploaded = true;
    for (var i = 0; i < e.target.files.length; i++) {
      console.log(e.target.files[i]);
      this.files.push(e.target.files[i]);
    }
  }

  Changestatusbysubcontractor(status) {
    const formData = new FormData();
    this.spinner = true;

    for (var i = 0; i < this.files.length; i++) {
      formData.append("docs[]", this.files[i]);
    }

    formData.append('userId', this.my_docs_dto.subcontractorId.toString());
    formData.append('userType', "Subcontractor");
    formData.append('category',  this.categoryType);

    this.subcntrservice.UploadDocs(formData).subscribe(res => {
      this.openSnackBar("Docs Updated Successfully");
      this.isimguploaded=false;
      this.files.length=0;
      this.files=[];
      this.GetSelectedSubctr(this.my_docs_dto.subcontractorId); 
     // this.spinner = false;
    },
      error => {
        this.spinner = false;
        this.openSnackBar("Something went wrong. Plz try again later...");
      }
    )
  }
  AddCategory()
  {
    let title = 'Edit SubContractor';
    let dialogRef: MatDialogRef<any> = this.dialog.open(CategoryComponent, {
      width: '500px',
      height: '200px',
      disableClose: false,
      data: { title: title, }
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        this.ngOnInit();
        if (!res) {

          // If user press cancel
          return;
        }
      })
    
  }
  GetSelectedCategory(event)
  {
    debugger
    this.categoryType=event;
    this.spinner = true;
    this.Mydocs_Category.length=0;
    this.Mydocs_Category=[];
    this.Mydocs.forEach(x=>
      {
        if(Number.parseInt(x["categoryType"])==Number.parseInt(this.categoryType))
        {
          this.Mydocs_Category.push(x);
        }
      });
      this.isCategorySelected=true;
      this.spinner = false;
  }
  openSnackBar(msg) {
    this._snackBar.open(msg, "Close", {
      duration: 2000,
    });
  }

  OpenDoc(filename) {
    window.open("https://beam.safesiteworks.com/beamapi/services/subcontractor/docs/" + filename);
    console.log("test Data");
  }
  Deletedoc(row)
  {
    let title = 'Delete Request';
    let dialogRef: MatDialogRef<any> = this.dialog.open(DeleteOptionComponent, {
      width: '300px',
      height: '150px',
      disableClose: false,
      data: { title: title, payload: row, type: "docs" }
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        this.GetSelectedSubctr(this.my_docs_dto.subcontractorId); 
      });
  }
  
}
