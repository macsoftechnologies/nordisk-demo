import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { UserService } from 'app/shared/services/user.service';


@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.component.html',
  styleUrls: ['./new-request.component.css']
})
export class NewRequestComponent implements OnInit {

  Reqdate=new Date();
  minDate: Date;
  maxDate: Date;
  name: string;
  dropdownname: string;
  selectedsite: number;
  selectedbuilding: string;
  selectedfloor: string;
  selectedroom: string;
  nositemselect: boolean = true;
  nobuildingmselect: boolean = true;
  nofloorselected: boolean = true;
  isnewrequestcreated: boolean = false;
  iscmsyes: boolean = false;
  ishotworkyes: boolean = false;
  isLOTOPROCEDUREyes:boolean=false;
  RequestForm: FormGroup;
  siteslist: any[] = [
    {
      "siteId": 1, "siteName": 'SITE - ARZONE',
      "buildings": [
        {
          "bid": 11,
          "name": "B1",
          "floors": [
            {
              "fid": 101,
              "name": "F1",
              "rooms": [
                "R1",
                "R2",
                "R3"
              ]
            },
            {
              "fid": 102,
              "name": "F2",
              "rooms": [
                "R12",
                "R22",
                "R32"
              ]
            },
            {
              "fid": 103,
              "name": "F3",
              "rooms": [
                "R13",
                "R23"
              ]
            }
          ]
        },
        {
          "bid": 12,
          "name": "B2",
          "floors": [
            {
              "fid": 201,
              "name": "F1",
              "rooms": [
                "R1",
                "R2"
              ]
            },
            {
              "fid": 202,
              "name": "F2",
              "rooms": [
                "R12",
                "R22",
                "R32",
                "R42"
              ]
            }
          ]
        },
        {
          "bid": 13,
          "name": "B3",
          "floors": [
            {
              "fid": 301,
              "name": "F1",
              "rooms": [
                "R1"
              ]
            },
            {
              "fid": 302,
              "name": "F2",
              "rooms": [
                "R12",
                "R22"
              ]
            },
            {
              "fid": 303,
              "name": "F3",
              "rooms": [
                "R13",
                "R23",
                "R33",
                "R43",
                "R53"
              ]
            }
          ]
        }
      ]
    },
    {
      "siteId": 2,
      "siteName": 'SITE - DUESBAN',
      "buildings": [
        {
          "bid": 21,
          "name": "B1",
          "floors": [
            {
              "fid": 401,
              "name": "F0",
              "rooms": [
                "R01",
                "R02",
                "R03"
              ]
            },
            {
              "fid": 402,
              "name": "F1",
              "rooms": [
                "R11",
                "R12",
                "R13"
              ]
            },
            {
              "fid": 403,
              "name": "F2",
              "rooms": [
                "R12",
                "R22",
                "R32"
              ]
            },
            {
              "fid": 404,
              "name": "F3",
              "rooms": [
                "R13",
                "R23"
              ]
            }
          ]
        },
        {
          "bid": 22,
          "name": "B2",
          "floors": [
            {
              "fid": 501,
              "name": "F1",
              "rooms": [
                "R11",
                "R21"
              ]
            },
            {
              "fid": 502,
              "name": "F2",
              "rooms": [
                "R12",
                "R22"
              ]
            }
          ]
        }
      ]
    },
  ];
  Locations: any[] = [
    {
      "locid": 1,
      "locname": "Vizag"
    },
    {
      "locid": 2,
      "locname": "Hyd"
    },
    {
      "locid": 3,
      "locname": "skml"
    }
  ];
  Feedingpoints: any[] = [
    {
      "fedid": 1,
      "fedname": "feedingpoint1"
    },
    {
      "fedid": 2,
      "fedname": "feedingpoint2"
    },
    {
      "fedid": 3,
      "fedname": "feedingpoint3"
    }
  ];
  TechRooms: any[] = [
    {
      "techid": 1,
      "techname": "Yes"
    },
    {
      "techid": 2,
      "techname": "No"
    }
  ];
  Tracks: any[] = [
    {
      "Trackid": 1,
      "Trackname": "Trackname1"
    },
    {
      "Trackid": 2,
      "Trackname": "Trackname2"
    }
  ]
  Walkways: any[] = [
    {
      "Walkwayid": 1,
      "Walkwayname": "Walkwayname1"
    },
    {
      "Walkwayid": 2,
      "Walkwayname": "Walkwayname2"
    }
  ]
  Platforms: any[] = [
    {
      "Platformid": 1,
      "Platformname": "Platformname1"
    },
    {
      "Platformid": 2,
      "Platformname": "Platformname2"
    }
  ]
  Trackblockeds: any[] = [
    {
      "Trackblockedsid": 1,
      "Trackblockedsname": "Yes"
    },
    {
      "Trackblockedsid": 2,
      "Trackblockedsname": "No"
    }
  ]
  Motorbogies: any[] = [
    {
      "Motorbogieid": 1,
      "Motorbogiename": "Yes"
    },
    {
      "Motorbogieid": 2,
      "Motorbogiename": "No"
    }
  ]
  Vehicles: any[] = [
    {
      "Vehicleid": 1,
      "Vehiclename": "Yes"
    },
    {
      "Vehicleid": 2,
      "Vehiclename": "No"
    }
  ]
  Vehiclestestings: any[] = [
    {
      "Vehiclestestingid": 1,
      "Vehiclestestingname": "Yes"
    },
    {
      "Vehiclestestingid": 2,
      "Vehiclestestingname": "No"
    }
  ]
  WakingTeams: any[] = [
    {
      "WakingTeamid": 1,
      "WakingTeamname": "Yes"
    },
    {
      "WakingTeamid": 2,
      "WakingTeamname": "No"
    }
  ]
  CMTs: any[] = [
    {
      "CMTval": "Yes"
    },
    {
      "CMTval": "No"
    }
  ]
  Poweroffs: any[] = [
    {
      "Poweroffid": 1,
      "Poweroffname": "Poweroffname1"
    },
    {
      "Poweroffid": 2,
      "Poweroffname": "Poweroffname2"
    }
  ]
  Applicants: any[] = [
    {
      "Applicantid": 1,
      "Applicantname": "Applicantname1"
    },
    {
      "Applicantid": 2,
      "Applicantname": "Applicantname2"
    }
  ]
  HOTWORKs: any[] = [
    {
      "HOTWORKval": "Yes"
    },
    {
      "HOTWORKval": "No"
    }
  ]
  LOTOPROCEDUREs: any[] = [
    {
      "LOTOPROCEDUREval": "Yes"
    },
    {
      "LOTOPROCEDUREval": "No"
    }
  ]
  locationControl = new FormControl(this.Locations[1].value);
  feedingControl = new FormControl(this.Feedingpoints[1].value);
  TechRoomControl = new FormControl(this.TechRooms[1].value);
  TrackControl = new FormControl(this.Tracks[1].value);
  WalkwayControl = new FormControl(this.Walkways[1].value);
  PlatformControl = new FormControl(this.Platforms[1].value);
  TrackblockedControl = new FormControl(this.Trackblockeds[1].value);
  MotorbogieControl = new FormControl(this.Motorbogies[1].value);
  VehicleControl = new FormControl(this.Vehicles[1].value);
  VehiclestestingControl = new FormControl(this.Vehiclestestings[1].value);
  WakingTeamControl = new FormControl(this.WakingTeams[1].value);
  CMTControl = new FormControl(this.CMTs[1].value);
  PoweroffControl = new FormControl(this.Poweroffs[1].value);
  ApplicantControl = new FormControl(this.Applicants[1].value);
  HOTWORKControl = new FormControl(this.HOTWORKs[1].value);
  LOTOPROCEDUREControl= new FormControl(this.LOTOPROCEDUREs[1].value);

  RoomsList: any[] = [];
  constructor(private fb: FormBuilder, private route: Router,private datePipe: DatePipe, private userservices:UserService) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 20, 0, 1);
    this.maxDate = new Date(currentYear + 1, 11, 31);
  }

  ngOnInit(): void {
    this.name = "site";
    this.RequestForm = this.fb.group({
      Requestdate: ['', [Validators.required]],
      Companyname: ['', Validators.required],
      SubContractorname: ['', Validators.required],
      Foreman: ['', Validators.required],
      ForemanPhone: ['', Validators.required],
      Activity: ['', Validators.required],
      TypeofActivity: ['', Validators.required],
      Team: ['', Validators.required],
      Startdate: ['', Validators.required],
      StartTime: ['', Validators.required],
      Enddate: ['', Validators.required],
      EndTime: ['', Validators.required],
      Location: this.locationControl,
      Site: ['', Validators.required],
      Building: ['', Validators.required],
      FloorName: ['', Validators.required],
      RoomNo: ['', Validators.required],
      RoomType: ['', Validators.required],
      Status: ['', Validators.required],
      // MotorbogieNumber: ['', Validators.required],
      // VehicleNumber: ['', Validators.required],
      // Alarm: ['', Validators.required],
      Tools: ['', Validators.required],
      PhoneNumber: ['', Validators.required],
      //InvalidPersonnel: ['', Validators.required],
      peopleinvalidcount: ['2', Validators.required],
      //Badgetestarea: ['', Validators.required],
      //Accesskey: ['', Validators.required],
      Note: ['', Validators.required],
      CmtValue: ['', Validators.required],
      Machinery: ['', Validators.required],
      CertifiedPerson: ['', Validators.required],
      LOTONumber:['', Validators.required],
      //Fedding: this.feedingControl,
      //TechRoom: this.TechRoomControl,
      //Trackname: this.TrackControl,
     // Walkwayname: this.WalkwayControl,
     // Trackblockedname: this.TrackblockedControl,
      //Motorbogie: this.MotorbogieControl,
      //Vehicle: this.VehicleControl,
      //Vehiclestesting: this.VehiclestestingControl,
      //WakingTeam: this.WakingTeamControl,
      CMT: this.CMTControl,
      Poweroff: this.PoweroffControl,
      Applicant: this.ApplicantControl,
      Hotwork: this.HOTWORKControl,
      LOTOPROCEDURE:this.LOTOPROCEDUREControl
    });
  }

  Getselectedsiteitem(event) {
    this.selectedsite = event;
    this.nositemselect = false;
    this.name = "Building";
  }
  GetselectedBuildingitem(event) {
    this.selectedbuilding = event;
    this.nobuildingmselect = false;
    this.name = "Floor";
  }
  Getselectedflooritem(event) {
    this.selectedfloor = event;
    this.nofloorselected = false;
    this.name = "Room";
    console.log(event);
  }
  Getselectedroomitem(event) {
    this.selectedroom = event;
    let currentdate = this.datePipe.transform(this.Reqdate, 'dd-MM-yyyy');
    this.RequestForm.controls['Requestdate'].setValue(currentdate);
    this.RequestForm.controls['Status'].setValue('Active');
    this.siteslist.forEach(x => {
      if (x['siteId'] == this.selectedsite) {
        this.RequestForm.controls['Site'].setValue(x['siteName']);
        x['buildings'].forEach(y => {
          if (y['bid'] === this.selectedbuilding) {
            this.RequestForm.controls['Building'].setValue(y['name']);
            // this.isnewrequestcreated = true;
            //    return;
            y['floors'].forEach(f => {
              // console.log(f);

              if (Number.parseInt(f['fid']) == Number.parseInt(this.selectedfloor)) {
                this.RequestForm.controls['FloorName'].setValue(f['name']);
                this.RequestForm.controls['RoomNo'].setValue(this.selectedroom);
                this.isnewrequestcreated = true;
                return;
              }
            });
          }
        });
      }
    });
  }

  Getselectedcmtitem(event) {
    if (event === 'Yes') {
      this.iscmsyes = true;
    }
    else {
      this.iscmsyes = false;
    }
  }
  GetselectedHOTWORKitem(event) {
    if (event === 'Yes') {
      this.ishotworkyes = true;
    }
    else {
      this.ishotworkyes = false;
    }
  }
  GetselectedLOTOPROCEDUREitem(event) {
    if (event === 'Yes') {
      this.isLOTOPROCEDUREyes = true;
    }
    else {
      this.isLOTOPROCEDUREyes = false;
    }
  }

  SaveasDraft()
  {
    
      console.log(this.RequestForm.value);
      this.userservices.RequestLists.push(this.RequestForm.value);
    
  }
}
