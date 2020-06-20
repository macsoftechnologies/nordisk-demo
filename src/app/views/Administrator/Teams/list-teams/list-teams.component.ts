import { Component, OnInit } from '@angular/core';
import { TeamService } from 'app/shared/services/team.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TeamComponent } from '../team/team.component';
import { TeamSubEmpListComponent } from '../team-sub-emp-list/team-sub-emp-list.component';
import { DeleteOptionComponent } from '../../delete-option/delete-option.component';

@Component({
  selector: 'app-list-teams',
  templateUrl: './list-teams.component.html',
  styleUrls: ['./list-teams.component.css']
})
export class ListTeamsComponent implements OnInit {

  items:any[]=[];
  spinner:boolean=true;
  constructor(private teamsservice:TeamService,private dialog: MatDialog) { 
this. GetAllTeams();
    
  }

  ngOnInit(): void {
  }

  GetAllTeams()
  {
    this.teamsservice.GetAllTeams().subscribe(res=>
      {
        this.items=res["data"];
        this.spinner=false;
      });
  }
  EditTeam(row)
  {
    let title = 'Edit Team';
    let dialogRef: MatDialogRef<any> = this.dialog.open(TeamComponent, {
      width: '1000px',
      height: '300px',
      disableClose: false,
      data: { title: title, payload: row, editform: true }
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        this.GetAllTeams();
      });
  }

  onActivate(event) {
    if (event.type == 'click') {
      console.log(event.row);
      let title = 'Employees List By SubContractor';
      let dialogRef: MatDialogRef<any> = this.dialog.open(TeamSubEmpListComponent, {
        width: '1100px',
        
        disableClose: false,
        data: { title: title, payload: event.row }
      })
      dialogRef.afterClosed()
        .subscribe(res => {
        });
    }
  }

  DeleteTeam(row)
  {
    let title = 'Delete Team';
    let dialogRef: MatDialogRef<any> = this.dialog.open(DeleteOptionComponent, {
      width: '300px',
      height: '150px',
      disableClose: false,
      data: { title: title, payload: row, type: "team" }
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        this.GetAllTeams();
      });
    }
}
