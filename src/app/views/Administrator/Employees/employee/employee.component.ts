import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { UserService } from 'app/shared/services/user.service';
import { DepartmentService } from 'app/shared/services/department.service';
import { EmployeesDto, UpdateEmployeesDto, EmployeeSubDto, EmployeeDeptDto, UpdateEmployeeSubDto, UpdateEmployeeDeptDto } from 'app/views/Models/EmployeesDto';
import { EmployeeService } from 'app/shared/services/employee.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SubcontractorService } from 'app/shared/services/subcontractor.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { validateBasis } from '@angular/flex-layout';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  spinner: boolean = false;

  EmployeeForm: FormGroup;
  Departments: any[] = [];
  SubContractor: any[] = [];
  Roles: any[] = [];
  radioselectvalname: string = "Subcontractor";
  selectedradioval = "Subcontractor";
  radiooptions: string[] = ["Subcontractor", "Departments"];
  useraccess: boolean = false;
  editform: boolean = false;
  Empdata: EmployeesDto = {
    roleId: null,
    departId: null,
    badgeId: null,
    phonenumber: null,
    employeeName: null,
    designation: null,
    subContId: null,
    username: null,
    password: null,
    access: "1"
  }
  UpdateEmpdata: UpdateEmployeesDto = {
    id: null,
    roleId: null,
    departId: null,
    badgeId: null,
    phonenumber: null,
    employeeName: null,
    designation: null,
    subContId: null,
    username: null,
    password: null,
    access: "0"
  }
  empwithsub: EmployeeSubDto =
    {
      roleId: null,
      badgeId: null,
      phonenumber: null,
      employeeName: null,
      designation: null,
      subContId: null,
      username: null,
      password: null,
      access: "1"
    }

  empwithdept: EmployeeDeptDto =
    {
      roleId: null,
      departId: null,
      badgeId: null,
      phonenumber: null,
      employeeName: null,
      designation: null,
      username: null,
      password: null,
      access: "1"
    }

  UpdateEmpsubdata: UpdateEmployeeSubDto = {
    id: null,
    roleId: null,
    badgeId: null,
    phonenumber: null,
    employeeName: null,
    designation: null,
    subContId: null,
    username: null,
    password: null,
    access: "0"
  }

  UpdateEmpdeptdata: UpdateEmployeeDeptDto = {
    id: null,
    departId: null,
    roleId: null,
    badgeId: null,
    phonenumber: null,
    employeeName: null,
    designation: null,
    username: null,
    password: null,
    access: "0"
  }

  //Departmentcontrol = new FormControl(this.Departments[1].value);

  constructor(private fb: FormBuilder, private empservice: EmployeeService,
    private suctservice: SubcontractorService, @Optional() @Inject(MAT_DIALOG_DATA) public data: any[],
    private deptservice: DepartmentService, private _snackBar: MatSnackBar) {
    //this.spinner=true;
    // this.deptservice.GetAllDepartments().subscribe(res => {
    //   this.Departments = res["data"];
    // });
    // this.suctservice.GetAllSubContractors().subscribe(res => {
    //   this.SubContractor = res["data"];
    // })
    // this.deptservice.GetAllRoles().subscribe(res => {
    //   this.Roles = res["data"];
    // });
    this.spinner = true;

    forkJoin(this.deptservice.GetAllDepartments(), this.suctservice.GetAllSubContractors(), this.deptservice.GetAllRoles()).subscribe(res => {
      this.spinner = false;

      this.Departments = res[0]["data"];
      this.SubContractor = res[1]["data"];
      this.Roles = res[2]["data"];
    });
  }

  ngOnInit(): void {

    this.useraccess = true;
    this.EmployeeForm = this.fb.group({
      badge: ['', [Validators.required]],
      EmpName: ['', Validators.required],
      Role: ['', Validators.required],
      EmpDept: ['', Validators.required],
      subcontrid: ['', Validators.required],
      Designation: ['', Validators.required],
      PhonenNumber: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      options: ['Subcontractor']
    });

    if (this.data != null && this.data["editform"] == true) {
      this.editform = true;
      this.EmployeeForm.controls["EmpName"].setValue(this.data["payload"]["employeeName"]);
      this.EmployeeForm.controls["Designation"].setValue(this.data["payload"]["designation"]);
      this.EmployeeForm.controls["badge"].setValue(this.data["payload"]["badgeId"]);
      this.EmployeeForm.controls["PhonenNumber"].setValue(this.data["payload"]["phonenumber"]);
      this.EmployeeForm.controls["username"].setValue(this.data["payload"]["username"]);
      this.EmployeeForm.controls["password"].setValue(atob(this.data["payload"]["password"]));

      this.EmployeeForm.controls["EmpDept"].setValue(this.data["payload"]["departId"]);
      this.EmployeeForm.controls["Role"].setValue(this.data["payload"]["roleId"]);
      this.EmployeeForm.controls["subcontrid"].setValue(this.data["payload"]["subContId"]);
      this.UpdateEmpdata.id = this.data["payload"]["id"];
      this.UpdateEmpsubdata.access =this.data["payload"]["access"];

      if (this.data["payload"]["access"] == "1") {
        this.useraccess = true;
        
      }
      else {
        this.useraccess = false;
      }
      if (this.data["payload"]["subContId"] == null || this.data["payload"]["subContId"] == "" || this.data["payload"]["subContId"] == "0") {
        this.EmployeeForm.controls["options"].setValue("Departments");
        this.selectedradioval = "Departments";

      }
      else {
        this.EmployeeForm.controls["options"].setValue("Subcontractor");
        this.selectedradioval = "Subcontractor";
      }

    }
  }

  radioChange(event) {
    if (event.value === 'Subcontractor') {
      this.selectedradioval = "Subcontractor";
    }
    else if (event.value === 'Departments') {
      this.selectedradioval = "Departments";
    }
  }
  toggle(event) {
    this.useraccess = event.checked;

    if (this.useraccess == true) {
      this.Empdata.access = "1";
      this.UpdateEmpsubdata.access =this.Empdata.access;

    }
    else if (this.useraccess == false) {
      this.Empdata.access = "0";
      this.UpdateEmpsubdata.access =this.Empdata.access;

    }
  }


  CreateEmp() {
    this.Empdata.subContId = this.EmployeeForm.controls["subcontrid"].value;;
    this.Empdata.roleId = this.EmployeeForm.controls["Role"].value;
    this.Empdata.departId = this.EmployeeForm.controls["EmpDept"].value;
    this.Empdata.designation = this.EmployeeForm.controls["Designation"].value;
    this.Empdata.employeeName = this.EmployeeForm.controls["EmpName"].value;
    this.Empdata.phonenumber = this.EmployeeForm.controls["PhonenNumber"].value;
    this.Empdata.badgeId = this.EmployeeForm.controls["badge"].value;
    this.Empdata.username = this.EmployeeForm.controls["username"].value;
    this.Empdata.password = this.EmployeeForm.controls["password"].value;
    this.spinner = true;
    if ( this.Empdata.subContId != "") {
      this.empwithsub.badgeId = this.Empdata.badgeId;
      this.empwithsub.designation = this.Empdata.designation;
      this.empwithsub.employeeName = this.Empdata.employeeName;
      this.empwithsub.password = this.Empdata.password;
      this.empwithsub.phonenumber = this.Empdata.phonenumber;
      this.empwithsub.roleId = this.Empdata.roleId;
      this.empwithsub.subContId = this.Empdata.subContId;
      this.empwithsub.username = this.Empdata.username;

      this.empservice.CreateEmployeeswithSub(this.empwithsub).subscribe(res => {
        this.spinner = false;

        this.openSnackBar("Employee Created Successfully");
        this.EmployeeForm.reset();
      },
        error => {
          this.openSnackBar("Something went wrong. Plz try again later...");
        }
      )
    }
    else if (this.Empdata.departId != "") {
      this.empwithdept.access = this.Empdata.access;
      this.empwithdept.badgeId = this.Empdata.badgeId;
      this.empwithdept.designation = this.Empdata.designation;
      this.empwithdept.employeeName = this.Empdata.employeeName;
      this.empwithdept.password = this.Empdata.password;
      this.empwithdept.phonenumber = this.Empdata.phonenumber;
      this.empwithdept.roleId = this.Empdata.roleId;
      this.empwithdept.departId = this.Empdata.departId;
      this.empwithdept.username = this.Empdata.username;

      this.empservice.CreateEmployeeswithDept(this.empwithdept).subscribe(res => {
        this.spinner = false;

        this.openSnackBar("Employee Created Successfully");
        this.EmployeeForm.reset();
      },
        error => {
          this.openSnackBar("Something went wrong. Plz try again later...");
        }
      )
    }
    // else if(this.Empdata.access=="0" && this.Empdata.subContId != "")
    // {
    //   this.empwithsub.access = this.Empdata.access;
    //   this.empwithsub.badgeId = this.Empdata.badgeId;
    //   this.empwithsub.designation = this.Empdata.designation;
    //   this.empwithsub.employeeName = this.Empdata.employeeName;
    //   this.empwithsub.password ="";
    //   this.empwithsub.phonenumber = this.Empdata.phonenumber;
    //   this.empwithsub.roleId = this.Empdata.roleId;
    //   this.empwithsub.subContId = this.Empdata.subContId;
    //   this.empwithsub.username ="";

    //   this.empservice.CreateEmployeeswithSub(this.empwithsub).subscribe(res => {
    //     this.spinner = false;

    //     this.openSnackBar("Employee Created Successfully");
    //     this.EmployeeForm.reset();
    //   })
    // }
  

  }

  UpdateEmp() {
    this.spinner = true;
console.log(this.UpdateEmpdata);
    this.UpdateEmpdata.subContId = this.EmployeeForm.controls["subcontrid"].value;;
    this.UpdateEmpdata.roleId = this.EmployeeForm.controls["Role"].value;
    this.UpdateEmpdata.departId = this.EmployeeForm.controls["EmpDept"].value;
    this.UpdateEmpdata.designation = this.EmployeeForm.controls["Designation"].value;
    this.UpdateEmpdata.employeeName = this.EmployeeForm.controls["EmpName"].value;
    this.UpdateEmpdata.phonenumber = this.EmployeeForm.controls["PhonenNumber"].value;
    this.UpdateEmpdata.badgeId = this.EmployeeForm.controls["badge"].value;
    this.UpdateEmpdata.username = this.EmployeeForm.controls["username"].value;
    this.UpdateEmpdata.password = this.EmployeeForm.controls["password"].value;
    console.log(this.UpdateEmpdata)
   
   // if (this.UpdateEmpdata.subContId != "" && this.UpdateEmpdata.subContId !="0") {
    if (this.selectedradioval=="Subcontractor") {

      this.UpdateEmpsubdata.id = this.UpdateEmpdata.id;
      this.UpdateEmpsubdata.badgeId = this.UpdateEmpdata.badgeId;
      this.UpdateEmpsubdata.designation = this.UpdateEmpdata.designation;
      this.UpdateEmpsubdata.employeeName = this.UpdateEmpdata.employeeName;
      this.UpdateEmpsubdata.password = btoa(this.UpdateEmpdata.password);
      this.UpdateEmpsubdata.phonenumber = this.UpdateEmpdata.phonenumber;
      this.UpdateEmpsubdata.roleId = this.UpdateEmpdata.roleId;
      this.UpdateEmpsubdata.subContId = this.UpdateEmpdata.subContId;
      this.UpdateEmpsubdata.username = this.UpdateEmpdata.username;


      this.UpdateEmpdeptdata.id = this.UpdateEmpdata.id;
      this.UpdateEmpdeptdata.badgeId = this.UpdateEmpdata.badgeId;
      this.UpdateEmpdeptdata.designation = this.UpdateEmpdata.designation;
      this.UpdateEmpdeptdata.employeeName = this.UpdateEmpdata.employeeName;
      this.UpdateEmpdeptdata.password = btoa(this.UpdateEmpdata.password);
      this.UpdateEmpdeptdata.phonenumber = this.UpdateEmpdata.phonenumber;
      this.UpdateEmpdeptdata.roleId = this.UpdateEmpdata.roleId;
      this.UpdateEmpdeptdata.departId = "";
      this.UpdateEmpdeptdata.username = this.UpdateEmpdata.username;

      forkJoin(this.empservice.UpdateEmployeeswithDept(this.UpdateEmpdeptdata), this.empservice.UpdateEmployeeswithSub(this.UpdateEmpsubdata)).subscribe(res => {
      
        this.openSnackBar("Employee updated Successfully");
        this.spinner = false;
        //this.EmployeeForm.reset();
      },
        error => {
          this.openSnackBar("Something went wrong. Plz try again later...");
        } 
        );
      // this.empservice.UpdateEmployeeswithSub(this.UpdateEmpsubdata).subscribe(res => {
      //   this.spinner = false;
      //   this.openSnackBar("Employee updated Successfully");
      //   //this.EmployeeForm.reset();
      // },
      //   error => {
      //     this.openSnackBar("Something went wrong. Plz try again later...");
      //   }
      // );

            //this.UpdateEmpdeptdata.access = this.Empdata.access;
    
      
    }
   // else if (this.UpdateEmpdata.departId != "" && this.UpdateEmpdata.departId != "0") 
    else if (this.selectedradioval == "Departments") 
    {
      this.UpdateEmpsubdata.id = this.UpdateEmpdata.id;
      this.UpdateEmpsubdata.badgeId = this.UpdateEmpdata.badgeId;
      this.UpdateEmpsubdata.designation = this.UpdateEmpdata.designation;
      this.UpdateEmpsubdata.employeeName = this.UpdateEmpdata.employeeName;
      this.UpdateEmpsubdata.password = btoa(this.UpdateEmpdata.password);
      this.UpdateEmpsubdata.phonenumber = this.UpdateEmpdata.phonenumber;
      this.UpdateEmpsubdata.roleId = this.UpdateEmpdata.roleId;
      this.UpdateEmpsubdata.subContId = "";
      this.UpdateEmpsubdata.username = this.UpdateEmpdata.username;


      this.UpdateEmpdeptdata.id = this.UpdateEmpdata.id;
      this.UpdateEmpdeptdata.badgeId = this.UpdateEmpdata.badgeId;
      this.UpdateEmpdeptdata.designation = this.UpdateEmpdata.designation;
      this.UpdateEmpdeptdata.employeeName = this.UpdateEmpdata.employeeName;
      this.UpdateEmpdeptdata.password = btoa(this.UpdateEmpdata.password);
      this.UpdateEmpdeptdata.phonenumber = this.UpdateEmpdata.phonenumber;
      this.UpdateEmpdeptdata.roleId = this.UpdateEmpdata.roleId;
      this.UpdateEmpdeptdata.departId = this.UpdateEmpdata.departId;
      this.UpdateEmpdeptdata.username = this.UpdateEmpdata.username;
      //this.UpdateEmpdeptdata.access = this.Empdata.access;
      this.empservice.UpdateEmployeeswithDept(this.UpdateEmpdeptdata).subscribe(res => {
        this.empservice.UpdateEmployeeswithSub(this.UpdateEmpsubdata).subscribe(x=>
          {
            this.spinner = false;
            this.openSnackBar("Employee updated Successfully");
          
          });
         //this.EmployeeForm.reset();
      },
        error => {
          this.openSnackBar("Something went wrong. Plz try again later...");
        }
      );
    }

    // this.empservice.UpdateEmployees(this.UpdateEmpdata).subscribe(res => {
    //   this.spinner = false;
    //   this.openSnackBar("Employee updated Successfully");
    //   //this.EmployeeForm.reset();
    // },
    //   error => {
    //     this.openSnackBar("Something went wrong. Plz try again later...");
    //   }
    // );
  }

  openSnackBar(msg) {
    this._snackBar.open(msg, "Close", {
      duration: 2000,

    });
  }
}
