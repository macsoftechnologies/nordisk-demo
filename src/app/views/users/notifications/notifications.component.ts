import { Component, OnInit } from '@angular/core';
import { RequestService } from 'app/shared/services/request.service';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';
import { RequestsbyId } from 'app/views/Models/RequestDto';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  RequestList:any[]=[];
  userdata: any = {};
  spinner:boolean=false;
  RequestsbyidDto:RequestsbyId=
  {
    userId:null
  }
  constructor(private reqservice:RequestService, private jwtauth:JwtAuthService) {
    this.userdata = this.jwtauth.getUser();
   }

  ngOnInit(): void {
    this.spinner=true;
    this.RequestsbyidDto.userId=this.userdata["id"];
    this.reqservice.GetAllRequestsByid(this.RequestsbyidDto).subscribe(res=>
      {
        console.log(res);
        let FilterList=[];
        let AllList=[];
        AllList=res["data"];
        AllList.forEach(x=>
          {
            if(x["Request_status"]=='Approve' || x["Request_status"]=='Reject')
            {
              FilterList.push(x);
            }
          });
          this.RequestList=FilterList;
          this.spinner=false;
      });
  }

}
