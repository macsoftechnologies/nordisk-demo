import { Component, OnInit } from '@angular/core';
import { UserService } from 'app/shared/services/user.service';
import { EmployeeService } from 'app/shared/services/employee.service';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { EmployeeComponent } from '../employee/employee.component';
import { DeleteOptionComponent } from '../../delete-option/delete-option.component';

@Component({
  selector: 'app-list-employee',
  templateUrl: './list-employee.component.html',
  styleUrls: ['./list-employee.component.css']
})
export class ListEmployeeComponent implements OnInit {

  spinner = false;
  public items: any[];

  constructor(private empservice: EmployeeService,private dialog: MatDialog) { 

    this.GetAllEmployees();
  }
  ngOnInit(): void {
  }

  GetAllEmployees()
  {
    this.spinner = true;
    this.empservice.GetAllEmployees().subscribe(res=>
      {
        this.spinner = false;
        this.items=res["data"];
      });
  }

  Editemp(row)
  {
    let title = 'Edit Employee';
    let dialogRef: MatDialogRef<any> = this.dialog.open(EmployeeComponent, {
      width: '1200px',
      height: '600px',
      disableClose: false,
      data: { title: title, payload: row, editform: true }
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        this.GetAllEmployees();
      });
  }

  DeleteEmp(row)
  {
    let title = 'Delete Employee';
    let dialogRef: MatDialogRef<any> = this.dialog.open(DeleteOptionComponent, {
      width: '300px',
      height: '150px',
      disableClose: false,
      data: { title: title, payload: row, type: "emp" }
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        this.GetAllEmployees();
      });
    }
}
