import { Component, OnInit, ViewChild, ElementRef, Inject, Optional } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { UserService } from 'app/shared/services/user.service';
import { number } from 'ngx-custom-validators/src/app/number/validator';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RequestSaveOptionsDialogComponent } from '../request-save-options-dialog/request-save-options-dialog.component';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Observable, forkJoin } from 'rxjs';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { startWith, map } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { RequestService } from 'app/shared/services/request.service';
import { SubcontractorService } from 'app/shared/services/subcontractor.service';
import { EmployeeService } from 'app/shared/services/employee.service';
import { RequestDto, EditRequestDto } from 'app/views/Models/RequestDto';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';


@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.component.html',
  styleUrls: ['./new-request.component.css']
})
export class NewRequestComponent implements OnInit {
  // pdfSrc = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
  //pdfSrc ="https://macsof.com/safesite/1complete_plan.pdf";

  spinner=false;

  pdfSrc = "../assets/images/complete-plan/1complete_plan.pdf";

  NewRequestData: any = {};
  selectedbuildimg: string = "";
  selectedholdbtnoption: string = "";
  Reqdate = new Date();
  minDate: Date;
  maxDate: Date;
  name: string;
  dropdownname: string;
  selectedsite: number;
  selected_site_name:string="";
  selectedbuilding: string;
  selectedfloor: string;
  selectedroom: string;
  nositemselect: boolean = true;
  nobuildingmselect: boolean = true;
  nofloorselected: boolean = true;
  isnewrequestcreated: boolean = false;
  iscmsyes: boolean = false;
  ishotworkyes: boolean = false;
  isLOTOPROCEDUREyes: boolean = false;
  RequestForm: FormGroup;
  beamimg: string = "";

  visible = true;
  selectable = true;
  rselectable = true;
  removable = true;
  rmremovable = true;
  editform: boolean = false;
  seditform:boolean=false;
  issubcontr:boolean=false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredBadges: Observable<string[]>;
  filteredRooms: Observable<string[]>;
  data: any = {};
  Rooms: any[] = [];
  RoomsList: any[] = [];
  Badges: string[] = [];
  EditbadgeArray:string[]=[];
  BADGENUMBERS: any[] = [];
  @ViewChild('badgeInput') badgeInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @ViewChild('roomInput') roomInput: ElementRef<HTMLInputElement>;
  @ViewChild('roomauto') roomatAutocomplete: MatAutocomplete;
  siteslist: any[] = [];
  buildings: any[] = [];
  floors: any[] = [];

  SubContractors: any[] = [];
  TypeofActivites: any[] = [
    {
      "Actid": "1",
      "Actname": "Actname1"
    },
    {
      "Actid": "2",
      "Actname": "Actname2"
    },
    {
      "Actid": "3",
      "Actname": "Actname3"
    },
    {
      "Actid": "4",
      "Actname": "Actname4"
    }
  ];

  CMTs: any[] = [
    {
      "id": "1",
      "CMTval": "Yes"
    },
    {
      "id": "0",
      "CMTval": "No"
    }
  ]

  Poweroffs: any[] = [
    {
      "Poweroffid": "1",
      "Poweroffname": "Yes"
    },
    {
      "Poweroffid": "0",
      "Poweroffname": "No"
    }
  ]

  HOTWORKs: any[] = [
    {
      "id": "1",
      "HOTWORKval": "Yes"
    },
    {
      "id": "0",
      "HOTWORKval": "No"
    }
  ]
  LOTOPROCEDUREs: any[] = [
    {
      "id": "1",
      "LOTOPROCEDUREval": "Yes"
    },
    {
      "id": "0",
      "LOTOPROCEDUREval": "No"
    }
  ]
  Status: any[] = [
    {
      "Statusid": "Hold",
      "Statusname": "Hold"
    },
    {
      "Statusid": "Draft",
      "Statusname": "Draft"
    },
    {
      "Statusid": "Approved",
      "Statusname": "Approved"
    },
    {
      "Statusid": "Rejected",
      "Statusname": "Rejected"
    },
    {
      "Statusid": "Opened",
      "Statusname": "Opened"
    },
    {
      "Statusid": "Closed",
      "Statusname": "Closed"
    }
  ]
  OperatorStatus: any[] = [
    {
      "Statusid": "Hold",
      "Statusname": "Hold"
    },
    {
      "Statusid": "Approved",
      "Statusname": "Approved"
    },
    {
      "Statusid": "Rejected",
      "Statusname": "Rejected"
    },
    {
      "Statusid": "Opened",
      "Statusname": "Opened"
    },
    {
      "Statusid": "Closed",
      "Statusname": "Closed"
    }
  ]
  subStatus:any[] = [
    {
      "Statusid": "Hold",
      "Statusname": "Hold"
    },
    {
      "Statusid": "Draft",
      "Statusname": "Draft"
    },
    {
      "Statusid": "Opened",
      "Statusname": "Opened"
    },
    {
      "Statusid": "Closed",
      "Statusname": "Closed"
    }
  ]
  Requestdata: RequestDto =
    {
      userId:null,
      Request_Date: null,
      Company_Name: null,
      Sub_Contractor_Id: null,
      Foreman: null,
      Foreman_Phone_Number: null,
      Activity: null,
      Type_Of_Activity_Id: null,
      Working_Date: null,
      Start_Time: null,
      End_Time: null,
      Site_Id: null,
      Building_Id: null,
      Floor_Id: null,
      Room_Nos: null,
      Room_Type: null,
      Crane_Requested: null,
      Crane_Number: null,
      Tools: null,
      Machinery: null,
      Hot_work: null,
      Certified_Person: null,
      LOTO_Procedure: null,
      LOTO_Number: null,
      Power_Off_Required: null,
      Number_Of_Workers: null,
      Badge_Numbers: null,
      Notes: null,
      Request_status: null,
      PermitNo: "1234"
    }

  updaterequestdata: EditRequestDto =
    {
      userId:null,
      Request_Date: null,
      Company_Name: null,
      Sub_Contractor_Id: null,
      Foreman: null,
      Foreman_Phone_Number: null,
      Activity: null,
      Type_Of_Activity_Id: null,
      Working_Date: null,
      Start_Time: null,
      End_Time: null,
      Site_Id: null,
      Building_Id: null,
      Floor_Id: null,
      Room_Nos: null,
      Room_Type: null,
      Crane_Requested: null,
      Crane_Number: null,
      Tools: null,
      Machinery: null,
      Hot_work: null,
      Certified_Person: null,
      LOTO_Procedure: null,
      LOTO_Number: null,
      Power_Off_Required: null,
      Number_Of_Workers: null,
      Badge_Numbers: null,
      Notes: null,
      Request_status: null,
      PermitNo: null,
      id: null,
      Assign_End_Time: null,
      Assign_Start_Time: null,
      Special_Instructions: null,
      Safety_Precautions: null
    }

    userdata:any={};
  constructor(private fb: FormBuilder, private route: Router, private datePipe: DatePipe,
    private userservices: UserService, private dialog: MatDialog, private loader: AppLoaderService,
    private requestsserivies: RequestService, private subcntrservice: SubcontractorService,
    private empservice: EmployeeService, private _snackBar: MatSnackBar,
    private jwtauth:JwtAuthService
  ) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 20, 0, 1);
    this.maxDate = new Date(currentYear + 1, 11, 31);
    this.spinner=true;

    this.requestsserivies.GetAllSites().subscribe(res => {
      
    });


  }

  ngOnInit(): void {

    this.RequestForm = this.fb.group({
      Requestdate: ['', [Validators.required]],
      Companyname: ['', Validators.required],
      Permitnumber: [''],
      Foreman: ['', Validators.required],
      ForemanPhone: ['', Validators.required],
      Activity: ['', Validators.required],
      Startdate: ['', Validators.required],
      StartTime: ['', Validators.required],
      EndTime: ['', Validators.required],
      Site: ['', Validators.required],
      Building: ['', Validators.required],
      FloorName: ['', Validators.required],
      //  RoomNo: ['', Validators.required],
      RoomType: ['', Validators.required],
      Status: ['', Validators.required],
      Tools: ['', Validators.required],
      peopleinvalidcount: ['', Validators.required],
      Note: ['', Validators.required],
      CmtValue: ['', Validators.required],
      Machinery: ['', Validators.required],
      CertifiedPerson: ['', Validators.required],
      LOTONumber: ['', Validators.required],
      SubContractor: ['', Validators.required],
      BADGENUMBER: ['', Validators.required],
      //Edit form
      AssignStartTime: ['', Validators.required],
      AssignEndTime: ['', Validators.required],
      Safetyprecaustion: ['', Validators.required],
      SpecialInstruction: ['', Validators.required],
      TypeActivity: ['', Validators.required],
      //Fedding: this.feedingControl,
      //TechRoom: this.TechRoomControl,
      //Trackname: this.TrackControl,
      // Walkwayname: this.WalkwayControl,
      // Trackblockedname: this.TrackblockedControl,
      //Motorbogie: this.MotorbogieControl,
      //Vehicle: this.VehicleControl,
      //Vehiclestesting: this.VehiclestestingControl,
      //WakingTeam: this.WakingTeamControl,
      CMTdata: ['', Validators.required],
      Poweroff: ['', Validators.required],
      //Applicant: this.ApplicantControl,
      HOTWORK: ['', Validators.required],
      LOTOPROCEDURE: ['', Validators.required],
      //AccesstoOtherRoom:this.AccesstoroomControl,
      //Keysneeded:this.KeysneedControl,

      Room: ['', Validators.required],
      SubContractorname:['', Validators.required],
      //Departconfs:this.departconfControl,
      //RequiredDocument:this.RequiredDocumentControl
    });
    this.userdata=this.jwtauth.getUser();
    forkJoin(this.requestsserivies.GetAllSites(),this.subcntrservice.GetAllSubContractors()).subscribe(res=>{
      this.spinner=false;
      this.selectedsite=res[0]["data"][1]["site_id"];
      this.selected_site_name=res[0]["data"][1]["site_name"];
      this.siteslist = res[0]["data"];
      this.Getselectedsiteitem(this.selectedsite);
      this.SubContractors = res[1]["data"];
      console.log(this.SubContractors)
      if(this.userdata["role"]=="Subcontractor")
      {
        this.issubcontr=true;
        this.RequestForm.controls["SubContractor"].setValue(this.userdata["typeId"]);
        console.log(this.SubContractors);
        this.SubContractors.forEach(x=>{
          if(x["id"]==this.userdata["typeId"])
          {
            this.RequestForm.controls["SubContractorname"].setValue(x["subContractorName"]);
          }
        });
      }
      else  if(this.userdata["role"]=="Admin")
        {
          this.issubcontr=false;
        }
        else  if(this.userdata["role"]=="Operator")
        {
          this.issubcontr=false;
        }
    });

    this.data = this.requestsserivies.SelectedRequestData;
    if (this.data["editform"] == true) { 
      this.updaterequestdata.userId=this.userdata["typeId"];     
      if(this.userdata["role"]=="Subcontractor")
      {
        this.editform = false;
        this.seditform=false;
        this.Status=this.subStatus;
        
        this.SubContractors.forEach(x=>{
          if(x["id"]==this.userdata["typeId"])
          {
            this.RequestForm.controls["SubContractorname"].setValue(x["subContractorName"]);
          }
        });
      }

      else  if(this.userdata["role"]=="Admin")
      {
        this.editform = true;
      }
      else  if(this.userdata["role"]=="Operator")
      {
        this.editform = true;
        this.Status=this.OperatorStatus;
        this.seditform=true;
      }


      this.isnewrequestcreated = true;
     
      this.NewRequestData = this.data["payload"];
      this.EditFormDataBinding(this.data["payload"]);
    }
    this.name = "site";
  }
  GetAllSubContractorsData() {
    this.spinner=true;
    this.subcntrservice.GetAllSubContractors().subscribe(res => {
      this.spinner=false;
      this.SubContractors = res["data"];
    });
  }
  Getselectedsiteitem(event) {
    this.selectedsite = event;
    this.nositemselect = false;
    this.name = "Building";

    this.siteslist.forEach(x => {
      if (x["site_id"] == event) {
        this.Requestdata.Site_Id = x["site_id"];
        this.RequestForm.controls['Site'].setValue(x['site_name']);
      }
    });
    this.spinner=true;
    this.requestsserivies.GetAllBuildingsbyid(this.selectedsite).subscribe(res => {
      this.spinner=false;
      this.buildings = res["data"];
    });
  }
  GetselectedBuildingitem(event) {
    this.selectedbuilding = event;
    this.Requestdata.Building_Id = event;
    this.buildings.forEach(x => {
      if (x['build_id'] == event) {
        this.RequestForm.controls['Building'].setValue(x['building_name']);
      }
    });
    this.spinner=true;
    this.requestsserivies.GetAllFloorsbyid(event).subscribe(res => {
      this.spinner=false;
      this.floors = res["data"];
    })
    this.nobuildingmselect = false;
    this.name = "Floor";
  }
  Getselectedflooritem(event) {
    this.spinner=true;
    this.selectedfloor = event;
    this.Requestdata.Floor_Id = event;
    this.nofloorselected = false;
    this.floors.forEach(x => {
      if (x['fl_id'] == event) {
        this.RequestForm.controls['FloorName'].setValue(x['floor_status']);
      }
    })
    this.requestsserivies.GetAllRoomsbyid(event).subscribe(res => {
      this.spinner=false;
      this.RoomsList = res["data"];
    });

    this.nobuildingmselect = false;
    this.name = "Room";
  }
  Getselectedroomitem(event) {
    this.RoomsList.forEach(x => {
      if (x["room_id"] == event) {
        this.Rooms.push(x);
      }
    });
    this.selectedroom = event;
    let currentdate = this.datePipe.transform(this.Reqdate, 'yyyy-MM-dd');
    this.RequestForm.controls['Requestdate'].setValue(currentdate);
    this.RequestForm.controls['Companyname'].setValue('Beam');
    //this.RequestForm.controls['Status'].setValue('Active');
    this.isnewrequestcreated = true;
    this.filteredRooms = this.RequestForm.controls["Room"].valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => fruit ? this._roomsfilter(fruit) : this.RoomsList.slice()));

   // this.GetAllSubContractorsData();

  }

  Getselectedcmtitem(event) {
    if (event === "1") {
      this.iscmsyes = true;
    }
    else {
      this.iscmsyes = false;
    }
  }
  GetselectedHOTWORKitem(event) {
    if (event === "1") {
      this.ishotworkyes = true;
    }
    else {
      this.ishotworkyes = false;
    }
  }
  GetselectedLOTOPROCEDUREitem(event) {
    if (event === "1") {
      this.isLOTOPROCEDUREyes = true;
    }
    else {
      this.isLOTOPROCEDUREyes = false;
    }
  }

  SaveasDraft(statusdata) {

    this.Requestdata.Request_status = "Draft";
    console.log(this.Requestdata);
    this.CreateRequest();
    //this.requestsserivies.CreateNewRequest()

  }

  CreateRequest() {
    this.spinner=true;
    var badarray = [];
    var roomoarr = [];
    this.Badges.forEach(x => {
      badarray.push(x["badgeId"]);
    });
    this.Rooms.forEach(x => {
      roomoarr.push(x["room_id"]);
    });

    this.Requestdata.Activity = this.RequestForm.controls["Activity"].value;

    this.Requestdata.Badge_Numbers = this.RequestForm.controls["BADGENUMBER"].value;
    this.Requestdata.Badge_Numbers = badarray.toString();

    this.Requestdata.Request_Date = this.RequestForm.controls["Requestdate"].value;
    this.Requestdata.Company_Name = this.RequestForm.controls["Companyname"].value;
    this.Requestdata.Sub_Contractor_Id = this.RequestForm.controls["SubContractor"].value;
    this.Requestdata.Foreman = this.RequestForm.controls["Foreman"].value;
    this.Requestdata.Foreman_Phone_Number = this.RequestForm.controls["ForemanPhone"].value;
    // this.Requestdata.Type_Of_Activity_Id=this.RequestForm.controls["TypeActivity"].value;
    this.Requestdata.Type_Of_Activity_Id = "4";
    let workdate = this.datePipe.transform(this.RequestForm.controls["Startdate"].value, 'yyyy-MM-dd');

    this.Requestdata.Working_Date = workdate;
    this.Requestdata.Start_Time = this.RequestForm.controls["StartTime"].value;
    this.Requestdata.End_Time = this.RequestForm.controls["EndTime"].value;
    //this.Requestdata.Site_Id = this.RequestForm.controls["Site"].value;
    // this.Requestdata.Building_Id = this.RequestForm.controls["Building"].value;
    // this.Requestdata.Floor_Id = this.RequestForm.controls["FloorName"].value;
    this.Requestdata.Room_Nos = roomoarr.toString();
    this.Requestdata.Room_Type = this.RequestForm.controls["RoomType"].value;
    this.Requestdata.Crane_Requested = this.RequestForm.controls["CMTdata"].value;
    this.Requestdata.Crane_Number = this.RequestForm.controls["CmtValue"].value;
    this.Requestdata.Tools = this.RequestForm.controls["Tools"].value;
    this.Requestdata.Machinery = this.RequestForm.controls["Machinery"].value;
    this.Requestdata.Hot_work = this.RequestForm.controls["HOTWORK"].value;
    this.Requestdata.Certified_Person = this.RequestForm.controls["CertifiedPerson"].value;
    this.Requestdata.LOTO_Procedure = this.RequestForm.controls["LOTOPROCEDURE"].value;
    this.Requestdata.LOTO_Number = this.RequestForm.controls["LOTONumber"].value;

    this.Requestdata.Power_Off_Required = this.RequestForm.controls["Poweroff"].value;
    this.Requestdata.Number_Of_Workers = this.RequestForm.controls["peopleinvalidcount"].value;
    this.Requestdata.Notes = this.RequestForm.controls["Note"].value;
   
    this.requestsserivies.CreateNewRequest(this.Requestdata).subscribe(res => {
      this.spinner=false;
      this.openSnackBar("Request Created Successfully");
    },
      error => {
        this.openSnackBar("Something went wrong. Plz try again later...");
      });
  }

  UpdateRequest() {

    this.spinner=true;

    this.updaterequestdata.Assign_Start_Time=this.RequestForm.controls["AssignStartTime"].value;
    this.updaterequestdata.Assign_End_Time=this.RequestForm.controls["AssignEndTime"].value;
    this.updaterequestdata.Special_Instructions=this.RequestForm.controls["SpecialInstruction"].value;
    this.updaterequestdata.Safety_Precautions=this.RequestForm.controls["Safetyprecaustion"].value;
   this.updaterequestdata.Request_status=this.RequestForm.controls['Status'].value;
    var badarray = [];
    var roomoarr = [];
    this.Badges.forEach(x => {
      badarray.push(x["badgeId"]);
    });
    this.Rooms.forEach(x => {
      roomoarr.push(x["room_id"]);
    });

    this.updaterequestdata.Activity = this.RequestForm.controls["Activity"].value;
    this.updaterequestdata.Badge_Numbers = this.RequestForm.controls["BADGENUMBER"].value;
    this.updaterequestdata.Badge_Numbers = badarray.toString();
    this.updaterequestdata.Site_Id=this.RequestForm.controls["Site"].value;
    this.updaterequestdata.Building_Id=this.RequestForm.controls["Building"].value;
    this.updaterequestdata.Floor_Id=this.RequestForm.controls["FloorName"].value;
   // this.updaterequestdata.Request_Date = this.RequestForm.controls["Requestdate"].value;
    this.updaterequestdata.Company_Name = this.RequestForm.controls["Companyname"].value;
    this.updaterequestdata.Sub_Contractor_Id = this.RequestForm.controls["SubContractor"].value;
    this.updaterequestdata.Foreman = this.RequestForm.controls["Foreman"].value;
    this.updaterequestdata.Foreman_Phone_Number = this.RequestForm.controls["ForemanPhone"].value;
    // this.Requestdata.Type_Of_Activity_Id=this.RequestForm.controls["TypeActivity"].value;
    this.updaterequestdata.Type_Of_Activity_Id = "4";
    let workdate = this.datePipe.transform(this.RequestForm.controls["Startdate"].value, 'yyyy-MM-dd');

    this.updaterequestdata.Working_Date = workdate;
    this.updaterequestdata.Start_Time = this.RequestForm.controls["StartTime"].value;
    this.updaterequestdata.End_Time = this.RequestForm.controls["EndTime"].value;
    //this.Requestdata.Site_Id = this.RequestForm.controls["Site"].value;
    // this.Requestdata.Building_Id = this.RequestForm.controls["Building"].value;
    // this.Requestdata.Floor_Id = this.RequestForm.controls["FloorName"].value;
    this.updaterequestdata.Room_Nos = roomoarr.toString();
    this.updaterequestdata.Room_Type = this.RequestForm.controls["RoomType"].value;
    this.updaterequestdata.Crane_Requested = this.RequestForm.controls["CMTdata"].value;
    this.updaterequestdata.Crane_Number = this.RequestForm.controls["CmtValue"].value;
    this.updaterequestdata.Tools = this.RequestForm.controls["Tools"].value;
    this.updaterequestdata.Machinery = this.RequestForm.controls["Machinery"].value;
    this.updaterequestdata.Hot_work = this.RequestForm.controls["HOTWORK"].value;
    this.updaterequestdata.Certified_Person = this.RequestForm.controls["CertifiedPerson"].value;
    this.updaterequestdata.LOTO_Procedure = this.RequestForm.controls["LOTOPROCEDURE"].value;
    this.updaterequestdata.LOTO_Number = this.RequestForm.controls["LOTONumber"].value;

    this.updaterequestdata.Power_Off_Required = this.RequestForm.controls["Poweroff"].value;
    this.updaterequestdata.Number_Of_Workers = this.RequestForm.controls["peopleinvalidcount"].value;
    this.updaterequestdata.Notes = this.RequestForm.controls["Note"].value;
   console.log(this.updaterequestdata)

   this.requestsserivies.UpdateRequest(this.updaterequestdata).subscribe(res=>
    {
      this.spinner=false;
      this.openSnackBar("Request Updated Successfully");
      this.requestsserivies.SelectedRequestData={};
    },
      error => {
        this.openSnackBar("Something went wrong. Plz try again later...");
      }
    )
  }

  openPopUp() {
    let title = 'Submitted Method Statement and Risk assessment for this activity';

    let dialogRef: MatDialogRef<any> = this.dialog.open(RequestSaveOptionsDialogComponent, {
      width: '500px',
      height: '200px',
      disableClose: false,
      data: { title: title, listitemsstatus:false }
    })
    dialogRef.afterClosed().subscribe(result => {
      this.RequestForm.controls['Status'].setValue(result.data);

      this.Requestdata.Request_status = result.data;
      this.CreateRequest();
      //this.userservices.RequestLists.push(this.RequestForm.value);
    });

  }
  private _filter(value: string): string[] {
    const filterValue = value;

    return this.BADGENUMBERS.filter(fruit => fruit["badgeId"] === filterValue);
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.Badges.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.RequestForm.controls["BADGENUMBER"].setValue(null);
  }

  remove(fruit: string): void {
    const index = this.Badges.indexOf(fruit);

    if (index >= 0) {
      this.Badges.splice(index, 1);
    }
  }

  // private _roomfilter(value: string): string[] {
  //   const filterValue = value;

  //   return this.BADGENUMBERS.filter(fruit => fruit["badgeno"] === filterValue);
  // }

  addroom(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.Rooms.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.RequestForm.controls["Room"].setValue(null);
  }

  removeroom(fruit: string): void {
    const index = this.Rooms.indexOf(fruit);

    if (index >= 0) {
      this.Rooms.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.BADGENUMBERS.forEach(x => {
      if (x["badgeId"] == event.option.value) {
        this.Badges.push(x);
      }
    });
    this.roomInput.nativeElement.value = '';
    this.RequestForm.controls["BADGENUMBER"].setValue(null);
  }

  selectedroomno(event: MatAutocompleteSelectedEvent): void {
    this.RoomsList.forEach(x => {
      if (x["room_id"] == event.option.value) {
        this.Rooms.push(x);
      }
    })
    //this.Rooms.push(event.option.viewValue);
    this.roomInput.nativeElement.value = '';
    this.RequestForm.controls["Room"].setValue(null);
  }
  private _roomsfilter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.RoomsList.filter(room => room === filterValue);
  }


  EditFormDataBinding(data) {
    var roomarrstr = [];
    this.spinner=true;
    roomarrstr = data["Room_Nos"].split(",");
    this.requestsserivies.GetAllRoomsbyid(data["Floor_Id"]).subscribe(res => {
      this.spinner=false;
      if(res["message"]=="No Floors Found")
      {
        this.RoomsList=[];
      }
      else
      {
        this.RoomsList = res["data"];
      }
      if(this.RoomsList.length>0)
      {
        this.RoomsList.forEach(x => {
          roomarrstr.forEach(y=>
            {
              if (x["room_id"] == y) {
                this.Rooms.push(x);
              }
            });
        });
      
      }
      this.filteredRooms = this.RequestForm.controls["Room"].valueChanges.pipe(
        startWith(null),
        map((fruit: string | null) => fruit ? this._roomsfilter(fruit) : this.RoomsList.slice())); 
      
      });


    var badarrstr = [];
 //   this.Badges=data["Badge_Numbers"];
    badarrstr = data["Badge_Numbers"].split(",");
    this.EditbadgeArray=badarrstr;
     this.GetEmployees(data["Sub_Contractor_Id"]);
    
     this.updaterequestdata.id = data["id"];
     this.updaterequestdata.PermitNo=data["PermitNo"];
    // this.updaterequestdata.Request_status=data["Request_status"];
     this.updaterequestdata.Request_Date=data["Request_Date"];
    //this.RequestForm.controls['Requestdate'].setValue(data["Request_Date"]);
    this.RequestForm.controls['Companyname'].setValue(data["Company_Name"]);
    this.RequestForm.controls['Requestdate'].setValue(data['Request_Date']);
    this.RequestForm.controls['SubContractor'].setValue(data["Sub_Contractor_Id"]);
    this.RequestForm.controls['Status'].setValue(data["Request_status"]);

    this.RequestForm.controls['Foreman'].setValue(data["Foreman"]);
    this.RequestForm.controls['ForemanPhone'].setValue(data["Foreman_Phone_Number"]);
    this.RequestForm.controls['Site'].setValue(data["Site_Id"]);
    this.RequestForm.controls['Activity'].setValue(data["Activity"]);
    this.RequestForm.controls['TypeActivity'].setValue(data["Type_Of_Activity_Id"]);
    this.RequestForm.controls['Building'].setValue(data["Building_Id"]);
    this.RequestForm.controls['CMTdata'].setValue(data["Crane_Requested"]);
    this.RequestForm.controls['CmtValue'].setValue(data["Crane_Number"]);
    this.RequestForm.controls['CertifiedPerson'].setValue(data["Certified_Person"]);
    this.RequestForm.controls['EndTime'].setValue(data["End_Time"]);
    this.RequestForm.controls['FloorName'].setValue(data["Floor_Id"]);
    this.RequestForm.controls['Foreman'].setValue(data["Foreman"]);
    this.RequestForm.controls['ForemanPhone'].setValue(data["Foreman_Phone_Number"]);
    this.RequestForm.controls['HOTWORK'].setValue(data["Hot_work"]);
    this.RequestForm.controls['LOTONumber'].setValue(data["LOTO_Number"]);
    this.RequestForm.controls['LOTOPROCEDURE'].setValue(data["LOTO_Procedure"]);
    this.RequestForm.controls['Machinery'].setValue(data["Machinery"]);

    var assstarttimestr = data["Assign_Start_Time"].split(':');
    this.RequestForm.controls['AssignStartTime'].setValue(assstarttimestr[0] + ":" + assstarttimestr[1]);
    
   
  //  this.RequestForm.controls['AssignStartTime'].setValue(data["Assign_Start_Time"]);
  var assendtimestr = data["Assign_End_Time"].split(':');
  this.RequestForm.controls['AssignEndTime'].setValue(assendtimestr[0] + ":" + assendtimestr[1]);
 
    this.RequestForm.controls['Safetyprecaustion'].setValue(data["Safety_Precautions"]);
    this.RequestForm.controls['SpecialInstruction'].setValue(data["Special_Instructions"]);



    this.RequestForm.controls['Note'].setValue(data["Notes"]);
    // this.RequestForm.controls['Permitnumber'].setValue(data["Certified_Person"]);
    this.RequestForm.controls['Poweroff'].setValue(data["Power_Off_Required"]);
    //this.RequestForm.controls['Requestdate'].setValue(data["Certified_Person"]);
    // var roomarrstr = [];
    // roomarrstr = data["Room_Nos"].split(",");
    // this.RequestForm.controls['Room'].setValue(roomarrstr);
    this.RequestForm.controls['RoomType'].setValue(data["Room_Type"]);
    console.log(data["Start_Time"]);
    var starttimestr = data["Start_Time"].split(':');

    this.RequestForm.controls['StartTime'].setValue(starttimestr[0] + ":" + starttimestr[1]);
    var endtimestr = data["End_Time"].split(':');
    this.RequestForm.controls['EndTime'].setValue(endtimestr[0] + ":" + endtimestr[1]);
    this.RequestForm.controls['Startdate'].setValue(data["Working_Date"]);
    this.RequestForm.controls['Tools'].setValue(data["Tools"]);
    this.RequestForm.controls['peopleinvalidcount'].setValue(data["Number_Of_Workers"]);
    if (data["Crane_Requested"] === "1") {
      this.iscmsyes = true;
      //this.RequestForm.controls['CmtValue'].setValue(data["CmtValue"]);
    }
    else {
      this.iscmsyes = false;
    }

    if (data["Hot_work"] === "1") {
      this.ishotworkyes = true;
    }
    else {
      this.ishotworkyes = false;
    }

    if (data["LOTO_Procedure"] === "1") {
      this.isLOTOPROCEDUREyes = true;
    }
    else {
      this.isLOTOPROCEDUREyes = false;
    }

  }

  GetEmployees(event) {
    this.spinner=true;
    this.empservice.GetAllEmployeesBySubContrId(event).subscribe(res => {
      this.spinner=false;
      if(res["data"]!=undefined)
      {
        this.BADGENUMBERS = res["data"];
      }

      if(this.editform==true && this.BADGENUMBERS.length>0)
      {
        
        this.BADGENUMBERS.forEach(x => {
          this.EditbadgeArray.forEach(y=>
            {
              if (x["badgeId"] == y) {
                this.Badges.push(x);
              }
            });
          });
      }
      this.filteredBadges = this.RequestForm.controls["BADGENUMBER"].valueChanges.pipe(
        startWith(null),
        map((fruit: string | null) => fruit ? this._filter(fruit) : this.BADGENUMBERS.slice()));
    });
  }


  openSnackBar(msg) {
    this._snackBar.open(msg, "Close", {
      duration: 2000,

    });
  }
  BacktoList()
  {
    this.route.navigateByUrl("/user/list-request")
  }
}



