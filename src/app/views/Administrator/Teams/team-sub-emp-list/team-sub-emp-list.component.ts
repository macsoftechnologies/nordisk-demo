import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeeService } from 'app/shared/services/employee.service';

@Component({
  selector: 'app-team-sub-emp-list',
  templateUrl: './team-sub-emp-list.component.html',
  styleUrls: ['./team-sub-emp-list.component.css']
})
export class TeamSubEmpListComponent implements OnInit {

  subcontrs:any[]=[];
  teamid:string="";
  emps:any[]=[];
  spinner:boolean=false;

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any[],
  private empservice:EmployeeService) {

   }

  ngOnInit(): void {
    this.spinner=true;
   this.empservice.GetAllEmployeesBySubContrId(this.data["payload"]["subContId"]).subscribe(res=>
    {

      this.emps=res["data"];
      this.spinner=false;
    });
  }

}
