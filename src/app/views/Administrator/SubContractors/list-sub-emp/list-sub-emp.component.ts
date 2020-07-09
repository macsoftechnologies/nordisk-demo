import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubcontractorService } from 'app/shared/services/subcontractor.service';
import { EmployeeService } from 'app/shared/services/employee.service';

@Component({
  selector: 'app-list-sub-emp',
  templateUrl: './list-sub-emp.component.html',
  styleUrls: ['./list-sub-emp.component.css']
})
export class ListSubEmpComponent implements OnInit {

  EmpList: any[] = [];
  spinner = false;
  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any[],private empservice:EmployeeService) { }

  ngOnInit(): void {
    this.spinner = true;
    this.empservice.GetAllEmployeesBySubContrId(this.data["payload"]["id"]).subscribe(res=>
      {
        this.spinner = false;
        this.EmpList = res["data"];
      });
  }

}
