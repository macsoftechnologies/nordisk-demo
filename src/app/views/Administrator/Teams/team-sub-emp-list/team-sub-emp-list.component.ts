import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeeService } from 'app/shared/services/employee.service';
import { TeamService } from 'app/shared/services/team.service';

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
  private empservice:EmployeeService, private teamservice:TeamService) {

   }

  ngOnInit(): void {
    this.spinner=true;
  //  this.empservice.GetAllEmployeesBySubContrId(this.data["payload"]["subContId"]).subscribe(res=>
  //   {
  //     this.emps=res["data"];
  //     this.spinner=false;
  //   });
  this.teamservice.GetAllTeamsById(Number.parseInt(this.data["payload"]["id"])).subscribe(res => {
    let empslist = res["employeeIds"].split(",");
    let selectedempsList=[];
    this.empservice.GetAllEmployees().subscribe(x => {
      let allemps = [];
      allemps = x["data"];
      allemps.forEach(x => {
        empslist.forEach(y => {
          if (y == x["id"]) {
            selectedempsList.push(x);
          }
        });
      });
      this.emps=selectedempsList;
      this.spinner = false;
    });
  });
}
}
