import { Component, OnInit } from '@angular/core';
import { RequestService } from 'app/shared/services/request.service';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';
import { RequestsbyId, RequestBySubcontractorId } from 'app/views/Models/RequestDto';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  RequestList:any[]=[];
  userdata: any = {};
  spinner:boolean=false;
  RequestsbyidDto:RequestBySubcontractorId=
  {
    SubContractorId:null
  }
  constructor(private reqservice:RequestService, private jwtauth:JwtAuthService) {
    this.userdata = this.jwtauth.getUser();
   }

  ngOnInit(): void {
    this.spinner=true;

    if (this.userdata["role"] == "Subcontractor") {
      this.RequestsbyidDto.SubContractorId=this.userdata["typeId"];
      this.reqservice.GetAllRequestsByid(this.RequestsbyidDto).subscribe(res=>
        {
          let FilterList=[];
          let AllList=[];
          if(res["data"])
          {
            AllList=res["data"];
            AllList.forEach(x=>
              {
                if(x["Request_status"]=='Approve' || x["Request_status"]=='Reject')
                {
                  FilterList.push(x);
                }
              });
              this.RequestList=FilterList;
          }
         
            this.spinner=false;
        });
    }
    else if (this.userdata["role"] == "Admin") {
     
      this.reqservice.GetAllRequests().subscribe(res=>
        {
          let FilterList=[];
          let AllList=[];
          if(res["data"])
          {
            AllList=res["data"];
            AllList.forEach(x=>
              {
                if(x["Request_status"]=='Approve' || x["Request_status"]=='Reject')
                {
                  FilterList.push(x);
                }
              });
              this.RequestList=FilterList;
          }
            this.spinner=false;
        });

    } 
  }

}
