import { Component, OnInit } from '@angular/core';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';
import { LogsService } from 'app/shared/services/logs.service';

@Component({
  selector: 'app-logs-history',
  templateUrl: './logs-history.component.html',
  styleUrls: ['./logs-history.component.css']
})
export class LogsHistoryComponent implements OnInit {
  [x: string]: any;
  items: any;
  spinner = false;
  isUserLoggedIn: any;
  paginationCount: any;
  pagedatainfo: any;
  Countresult = [];

  currentPage : any;

  constructor(private logDetails: LogsService, private jwtauth: JwtAuthService) { }

  ngOnInit(): void {
    // this.GetAllLogsHistory();
    this.isUserLoggedIn = JSON.parse(localStorage.getItem('EGRET_USER'));
    this.currentPage = 1;

    this.startValue = 1;
    this.getPermits(this.currentPage, this.startValue);
  }

  // GetAllLogsHistory() {
  //   this.spinner = true;
  //   this.logDetails.GetAllLogsDetails().subscribe(res => {
  //     this.items = res["data"];
  //     // console.log("logs",this.items)
  //     this.spinner = false;
  //   });
  // }

  getPermits(page,value) {

    this.pagedatainfo = {
      LoginType: this.isUserLoggedIn.role,
      Type: this.isUserLoggedIn.typeId,
      Start: value,
      End: 30,
      Page: page,
    };

    console.log("Get Permits called start", this.pagedatainfo.Start);
    console.log("get page", this.pagedatainfo.Page)

    this.logDetails.listpagination(this.pagedatainfo).subscribe((res) => {
      console.log('pageresp', res);
      this.spinner = false;

      if (res[0]['message'] == 'No Requests Found') {
        this.items = [];
        this.Filtertab = false;
      } else {
        this.Filtertab = true;
        this.userdata = this.jwtauth.getUser();

        if (this.userdata['role'] == 'Subcontractor') {
          this.isoperator = false;
          this.IsNotSubCntr = false;
          this.RequestlistForm.controls['Contractor'].setValue(
            this.userdata['typeId']
          );
          this.RequestsbyidDto.SubContractorId = this.userdata['typeId'];
          // this.requestservice
          //   .GetAllRequestsByid(this.RequestsbyidDto)
          //   .subscribe((res) => {
          this.items = res[0]['data'];
          console.log("Total Data", this.items)
          // });
          this.paginationCount = res[1].count;
          console.log(this.paginationCount);
        } else if (this.userdata['role'] == 'Admin') {
          this.IsNotSubCntr = true;
          this.items = res[0]['data'];
          this.isoperator = true;
          this.isoperator = true;
          var filteritems = [];
          this.items.forEach((x) => {
            if (x['Request_status'] != 'Draft') {
              filteritems.push(x);
            }
          });
          // this.items = [];
          // this.items.length = 0;
          // this.items = filteritems;

          this.paginationCount = res[1].count;
          console.log(this.paginationCount);
        } else if (this.userdata['role'] == 'Department') {
          this.IsNotSubCntr = false;
          this.items = res[0]['data'];
          this.isoperator = true;
          var filteritems = [];
          this.items.forEach((x) => {
            if (x['Request_status'] != 'Draft') {
              filteritems.push(x);
            }
          });
          this.paginationCount = res[1].count;
          console.log(this.paginationCount);
          this.items = [];
          this.items.length = 0;
          this.items = filteritems;
        }
      }

      this.Contractors = res[2]['subcontractors'];
      this.Sites = res[0]['data'];
      // this.Getbuilding(this.Sites[0]['site_id']);
      this.Typeofactivitys = res[3]['activities'];
      this.totalCount = res[1]['count']
      console.log(this.totalCount, "Count Total")
    });
  }

  onPagination(event) {
    this.Countresult.length = 0
    this.currentPage = event.page;
    let start;
    console.log("Event Value", event)
    console.log("pagination",event.page)
    console.log("Current Page", this.currentPage)
    let offset = event.page - 1;
    console.log("Page Number", offset)
    if (offset === 0) {
      start = 1;
    } else if (offset > 0) {
      start = offset * 30 + 1;
    }
    console.log(offset, 'Set Value');
    console.log(start, 'start value');
    this.pagedatainfo = {
      LoginType: this.isUserLoggedIn.role,
      Type: this.isUserLoggedIn.typeId,
      Start: start,
      End: 30,
      Page: this.currentPage,
    };

    console.log("PAGENUM", this.pagedatainfo.Page)
    console.log("startValue", this.pagedatainfo.Start)

    if (this.api == 'listpagination') {
      this.requestservice[this.api](this.pagedatainfo).subscribe((res) => {
        console.log('pageresp', res);
        this.spinner = false;

        // if (res[0]["message"] == "No Requests Found") {
        //   this.items = [];
        //   this.Filtertab = false;
        // }
        if (res.length > 0) {
          this.Filtertab = true;
          this.userdata = this.jwtauth.getUser();

          if (this.userdata['role'] == 'Subcontractor') {
            this.isoperator = false;
            this.IsNotSubCntr = false;
            this.RequestlistForm.controls['Contractor'].setValue(
              this.userdata['typeId']
            );
            this.RequestsbyidDto.SubContractorId = this.userdata['typeId'];
            // this.requestservice
            //   .GetAllRequestsByid(this.RequestsbyidDto)
            //   .subscribe((res) => {
            this.items = res[0]['data'];
            // });
            this.paginationCount = res[1].count;
            console.log(this.paginationCount);
          } else if (this.userdata['role'] == 'Admin') {
            this.IsNotSubCntr = true;
            this.items = res[0]['data'];
            this.isoperator = true;
            this.isoperator = true;
            var filteritems = [];
            this.items.forEach((x) => {
              if (x['Request_status'] != 'Draft') {
                filteritems.push(x);
              }
            });

            this.paginationCount = res[1].count;
            console.log(this.paginationCount);
          } else if (this.userdata['role'] == 'Department') {
            this.IsNotSubCntr = true;
            this.items = res[0]['data'];
            this.isoperator = true;
            var filteritems = [];
            this.items.forEach((x) => {
              if (x['Request_status'] != 'Draft') {
                filteritems.push(x);
              }
            });
            this.items = [];
            this.items.length = 0;
            this.items = filteritems;
          }
        }

        this.Contractors = res['data'];
        this.Sites = res['data'];
        // this.Getbuilding(this.Sites["site_id"]);
        this.Typeofactivitys = res['data'];
      });
    } else if (this.api == 'SearchRequest') {
      this.SearchRequest.Request_status =
        this.RequestlistForm.controls['Status'].value;
      this.SearchRequest.Activity =
        this.RequestlistForm.controls['Keyword'].value;
      this.SearchRequest.PermitNo =
        this.RequestlistForm.controls['Permitnumber'].value;
      this.SearchRequest.Site_Id = this.RequestlistForm.controls['Site'].value;
      this.SearchRequest.Building_Id =
        this.RequestlistForm.controls['Building'].value;
      this.SearchRequest.Sub_Contractor_Id =
        this.RequestlistForm.controls['Contractor'].value;
      var mydate = this.datePipe.transform(
        this.RequestlistForm.controls['WorkingDateFrom'].value,
        'yyyy-MM-dd'
      );
      var todate = this.datePipe.transform(
        this.RequestlistForm.controls['WorkingDateTo'].value,
        'yyyy-MM-dd'
      );
      this.SearchRequest.Type_Of_Activity_Id =
        this.RequestlistForm.controls['TypeOfActivity'].value;
      this.SearchRequest.Room_Type =
        this.RequestlistForm.controls['Level'].value;
      this.SearchRequest.Start = start;
      console.log("start", start)
      this.SearchRequest.End = '30';
      this.SearchRequest.Page = this.currentPage;
      console.log("value", this.currentPage)

      this.requestservice[this.api](this.SearchRequest).subscribe((res) => {
        console.log('pageresp', res);
        this.spinner = false;

        // if (res[0]["message"] == "No Requests Found") {
        //   this.items = [];
        //   this.Filtertab = false;
        // }
        if (res.length > 0) {
          this.Filtertab = true;
          this.userdata = this.jwtauth.getUser();

          if (this.userdata['role'] == 'Subcontractor') {
            this.isoperator = false;
            this.IsNotSubCntr = false;
            this.RequestlistForm.controls['Contractor'].setValue(
              this.userdata['typeId']
            );
            this.RequestsbyidDto.SubContractorId = this.userdata['typeId'];
            // this.requestservice
            //   .GetAllRequestsByid(this.RequestsbyidDto)
            //   .subscribe((res) => {
                this.items = res[0]['data'];
              // });
            this.paginationCount = res[1].count;
            console.log(this.paginationCount);
          } else if (this.userdata['role'] == 'Admin') {
            this.IsNotSubCntr = true;
            this.items = res[0]['data'];
            this.isoperator = true;
            this.isoperator = true;
            var filteritems = [];
            this.items.forEach((x) => {
              if (x['Request_status'] != 'Draft') {
                filteritems.push(x);
              }
            });

            this.paginationCount = res[1].count;
            console.log(this.paginationCount);
          } else if (this.userdata['role'] == 'Department') {
            this.IsNotSubCntr = true;
            this.items = res[0]['data'];
            this.isoperator = true;
            var filteritems = [];
            this.items.forEach((x) => {
              if (x['Request_status'] != 'Draft') {
                filteritems.push(x);
              }
            });
            this.items = [];
            this.items.length = 0;
            this.items = filteritems;
          }
        }

        this.Contractors = res[2]['subcontractors'];
        this.Sites = res['data'];
        // this.Getbuilding(this.Sites["site_id"]);
        this.Typeofactivitys = res[3]['activities'];
      });
    }
  }

}
