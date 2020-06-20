import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-edit-request',
  templateUrl: './edit-request.component.html',
  styleUrls: ['./edit-request.component.css']
})
export class EditRequestComponent implements OnInit {
  ngOnInit(): void
  {}

  // RequestForm: FormGroup;
  // siteslist: any[] = [
  //   {
  //     "siteId": 1, "siteName": 'SITE - ARZONE',
  //     "buildings": [
  //       {
  //         "bid": 11,
  //         "name": "B1",
  //         "img": "assets/images/plan.pdf",
  //         "floors": [
  //           {
  //             "fid": 101,
  //             "name": "F1",
  //             "img": "assets//images//complete-plan//3_first floor.pdf",
  //             "rooms": [
  //               "R1",
  //               "R2",
  //               "R3"
  //             ]
  //           },
  //           {
  //             "fid": 102,
  //             "name": "F2",
  //             "img": "assets//images//complete-plan//4_second floor.pdf",
  //             "rooms": [
  //               "R12",
  //               "R22",
  //               "R32"
  //             ]
  //           },
  //           {
  //             "fid": 103,
  //             "name": "F3",
  //             "img": "assets//images//complete-plan//3_first floor.pdf",
  //             "rooms": [
  //               "R13",
  //               "R23"
  //             ]
  //           }
  //         ]
  //       },
  //       {
  //         "bid": 12,
  //         "name": "B2",
  //         "img": "assets//images//complete-plan//2_groundloor.pdf",
  //         "floors": [
  //           {
  //             "fid": 201,
  //             "name": "F1",
  //             "img": "assets//images//complete-plan//3_first floor.pdf",
  //             "rooms": [
  //               "R1",
  //               "R2"
  //             ]
  //           },
  //           {
  //             "fid": 202,
  //             "name": "F2",
  //             "img": "assets//images//complete-plan//4_second floor.pdf",
  //             "rooms": [
  //               "R12",
  //               "R22",
  //               "R32",
  //               "R42"
  //             ]
  //           }
  //         ]
  //       },
  //       {
  //         "bid": 13,
  //         "name": "B3",
  //         "img": "assets//images//complete-plan//2_groundloor.pdf",
  //         "floors": [
  //           {
  //             "fid": 301,
  //             "name": "F1",
  //             "img": "assets//images//complete-plan//4_second floor.pdf",
  //             "rooms": [
  //               "R1"
  //             ]
  //           },
  //           {
  //             "fid": 302,
  //             "name": "F2",
  //             "img": "assets//images//complete-plan//3_first floor.pdf",
  //             "rooms": [
  //               "R12",
  //               "R22"
  //             ]
  //           },
  //           {
  //             "fid": 303,
  //             "name": "F3",
  //             "img": "assets//images//complete-plan//4_second floor.pdf",
  //             "rooms": [
  //               "R13",
  //               "R23",
  //               "R33",
  //               "R43",
  //               "R53"
  //             ]
  //           }
  //         ]
  //       }
  //     ]
  //   },
  //   {
  //     "siteId": 2,
  //     "siteName": 'SITE - DUESBAN',
  //     "buildings": [
  //       {
  //         "bid": 21,
  //         "name": "B1",
  //         "img": "assets//images//complete-plan//1_complete_plan.pdf",
  //         "floors": [
  //           {
  //             "fid": 401,
  //             "name": "F0",
  //             "img": "assets//images//complete-plan//3_first floor.pdf",
  //             "rooms": [
  //               "R01",
  //               "R02",
  //               "R03"
  //             ]
  //           },
  //           {
  //             "fid": 402,
  //             "name": "F1",
  //             "img": "assets//images//complete-plan//4_second floor.pdf",
  //             "rooms": [
  //               "R11",
  //               "R12",
  //               "R13"
  //             ]
  //           },
  //           {
  //             "fid": 403,
  //             "name": "F2",
  //             "img": "assets//images//complete-plan//3_first floor.pdf",
  //             "rooms": [
  //               "R12",
  //               "R22",
  //               "R32"
  //             ]
  //           },
  //           {
  //             "fid": 404,
  //             "name": "F3",
  //             "img": "assets//images//complete-plan//4_second floor.pdf",
  //             "rooms": [
  //               "R13",
  //               "R23"
  //             ]
  //           }
  //         ]
  //       },
  //       {
  //         "bid": 22,
  //         "name": "B2",
  //         "img": "assets//images//complete-plan//1_complete_plan.pdf",
  //         "floors": [
  //           {
  //             "fid": 501,
  //             "name": "F1",
  //             "img": "assets//images//complete-plan//4_second floor.pdf",
  //             "rooms": [
  //               "R11",
  //               "R21"
  //             ]
  //           },
  //           {
  //             "fid": 502,
  //             "name": "F2",
  //             "img": "assets//images//complete-plan//3_first floor.pdf",
  //             "rooms": [
  //               "R12",
  //               "R22"
  //             ]
  //           }
  //         ]
  //       }
  //     ]
  //   },
  // ];
  // SubContractors: any[] = [
  //   {
  //     "SubContractorid": 1,
  //     "SubContractorname": "SubContractorname1"
  //   },
  //   {
  //     "SubContractorid": 2,
  //     "SubContractorname": "SubContractorname2"
  //   },
  //   {
  //     "SubContractorid": 3,
  //     "SubContractorname": "SubContractorname3"
  //   }
  // ];
  // TypeofActivites: any[] = [
  //   {
  //     "Actid": 1,
  //     "Actname": "Actname1"
  //   },
  //   {
  //     "Actid": 2,
  //     "Actname": "Actname2"
  //   },
  //   {
  //     "Actid": 3,
  //     "Actname": "Actname3"
  //   }
  // ];
  // Locations: any[] = [
  //   {
  //     "locid": 1,
  //     "locname": "Vizag"
  //   },
  //   {
  //     "locid": 2,
  //     "locname": "Hyd"
  //   },
  //   {
  //     "locid": 3,
  //     "locname": "skml"
  //   }
  // ];
  // Feedingpoints: any[] = [
  //   {
  //     "fedid": 1,
  //     "fedname": "feedingpoint1"
  //   },
  //   {
  //     "fedid": 2,
  //     "fedname": "feedingpoint2"
  //   },
  //   {
  //     "fedid": 3,
  //     "fedname": "feedingpoint3"
  //   }
  // ];
  // TechRooms: any[] = [
  //   {
  //     "techid": 1,
  //     "techname": "Yes"
  //   },
  //   {
  //     "techid": 2,
  //     "techname": "No"
  //   }
  // ];
  // Tracks: any[] = [
  //   {
  //     "Trackid": 1,
  //     "Trackname": "Trackname1"
  //   },
  //   {
  //     "Trackid": 2,
  //     "Trackname": "Trackname2"
  //   }
  // ]
  // Walkways: any[] = [
  //   {
  //     "Walkwayid": 1,
  //     "Walkwayname": "Walkwayname1"
  //   },
  //   {
  //     "Walkwayid": 2,
  //     "Walkwayname": "Walkwayname2"
  //   }
  // ]
  // Platforms: any[] = [
  //   {
  //     "Platformid": 1,
  //     "Platformname": "Platformname1"
  //   },
  //   {
  //     "Platformid": 2,
  //     "Platformname": "Platformname2"
  //   }
  // ]
  // Trackblockeds: any[] = [
  //   {
  //     "Trackblockedsid": 1,
  //     "Trackblockedsname": "Yes"
  //   },
  //   {
  //     "Trackblockedsid": 2,
  //     "Trackblockedsname": "No"
  //   }
  // ]
  // Motorbogies: any[] = [
  //   {
  //     "Motorbogieid": 1,
  //     "Motorbogiename": "Yes"
  //   },
  //   {
  //     "Motorbogieid": 2,
  //     "Motorbogiename": "No"
  //   }
  // ]
  // Vehicles: any[] = [
  //   {
  //     "Vehicleid": 1,
  //     "Vehiclename": "Yes"
  //   },
  //   {
  //     "Vehicleid": 2,
  //     "Vehiclename": "No"
  //   }
  // ]
  // Vehiclestestings: any[] = [
  //   {
  //     "Vehiclestestingid": 1,
  //     "Vehiclestestingname": "Yes"
  //   },
  //   {
  //     "Vehiclestestingid": 2,
  //     "Vehiclestestingname": "No"
  //   }
  // ]
  // WakingTeams: any[] = [
  //   {
  //     "WakingTeamid": 1,
  //     "WakingTeamname": "Yes"
  //   },
  //   {
  //     "WakingTeamid": 2,
  //     "WakingTeamname": "No"
  //   }
  // ]
  // CMTs: any[] = [
  //   {
  //     "CMTval": "Yes"
  //   },
  //   {
  //     "CMTval": "No"
  //   }
  // ]

  // RequiredDocuments: any[] = [
  //   {
  //     "Reqdocval": "Yes"
  //   },
  //   {
  //     "Reqdocval": "No"
  //   }
  // ]
  // Departmentconfirmations: any[] = [
  //   {
  //     "Departmentval": "Yes"
  //   },
  //   {
  //     "Departmentval": "No"
  //   }
  // ]
  // Poweroffs: any[] = [
  //   {
  //     "Poweroffid": 1,
  //     "Poweroffname": "Yes"
  //   },
  //   {
  //     "Poweroffid": 2,
  //     "Poweroffname": "No"
  //   }
  // ]
  // AccesstootherRooms: any[] = [
  //   {
  //     "accsval": "Yes"
  //   },
  //   {
  //     "accsval": "No"
  //   }
  // ]
  // Keysneeds: any[] = [
  //   {
  //     "keysval": "Yes"
  //   },
  //   {
  //     "keysval": "No"
  //   }
  // ]
  // BADGENUMBERS: any[] = [
  //   {
  //     "badgeno": "1"
  //   },
  //   {
  //     "badgeno": "2"
  //   },
  //   {
  //     "badgeno": "3"
  //   },
  //   {
  //     "badgeno": "4"
  //   },
  //   {
  //     "badgeno": "5"
  //   },
  //   {
  //     "badgeno": "6"
  //   }
  // ]
  // Applicants: any[] = [
  //   {
  //     "Applicantid": 1,
  //     "Applicantname": "Applicantname1"
  //   },
  //   {
  //     "Applicantid": 2,
  //     "Applicantname": "Applicantname2"
  //   }
  // ]
  // HOTWORKs: any[] = [
  //   {
  //     "HOTWORKval": "Yes"
  //   },
  //   {
  //     "HOTWORKval": "No"
  //   }
  // ]
  // LOTOPROCEDUREs: any[] = [
  //   {
  //     "LOTOPROCEDUREval": "Yes"
  //   },
  //   {
  //     "LOTOPROCEDUREval": "No"
  //   }
  // ]

  // SubContractorControl = new FormControl(this.SubContractors[1].value);
  // TypeActivityControl = new FormControl(this.TypeofActivites[1].value);

  // locationControl = new FormControl(this.Locations[1].value);
  // feedingControl = new FormControl(this.Feedingpoints[1].value);
  // TechRoomControl = new FormControl(this.TechRooms[1].value);
  // TrackControl = new FormControl(this.Tracks[1].value);
  // WalkwayControl = new FormControl(this.Walkways[1].value);
  // PlatformControl = new FormControl(this.Platforms[1].value);
  // TrackblockedControl = new FormControl(this.Trackblockeds[1].value);
  // MotorbogieControl = new FormControl(this.Motorbogies[1].value);
  // VehicleControl = new FormControl(this.Vehicles[1].value);
  // VehiclestestingControl = new FormControl(this.Vehiclestestings[1].value);
  // WakingTeamControl = new FormControl(this.WakingTeams[1].value);
  // CMTControl = new FormControl(this.CMTs[1].value);
  // AccesstoroomControl = new FormControl(this.AccesstootherRooms[1].value);
  // KeysneedControl = new FormControl(this.Keysneeds[1].value);
  // RequiredDocumentControl = new FormControl(this.RequiredDocuments[1].value);
  // PoweroffControl = new FormControl(this.Poweroffs[1].value);
  // ApplicantControl = new FormControl(this.Applicants[1].value);
  // HOTWORKControl = new FormControl(this.HOTWORKs[1].value);
  // LOTOPROCEDUREControl = new FormControl(this.LOTOPROCEDUREs[1].value);
  // BADGENUMBERControl = new FormControl(this.BADGENUMBERS[1].value);
  // RoomNoControl = new FormControl(this.RoomsList[1].value);
  // departconfControl = new FormControl(this.Departmentconfirmations[1].value);
  // constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  // public dialogRef: MatDialogRef<EditRequestComponent>,private fb: FormBuilder) { }

  // ngOnInit(): void {
  //   console.log(this.data.payload);
  //   this.RequestForm = this.fb.group({
  //     Requestdate: ['', [Validators.required]],
  //     Companyname: ['', Validators.required],
  //     Permitnumber: ['S 1234556789'],
  //     Foreman: ['', Validators.required],
  //     ForemanPhone: ['', Validators.required],
  //     Activity: ['', Validators.required],
  //     //      TypeofActivity: ['', Validators.required],
  //     // Team: ['', Validators.required],
  //     Startdate: ['', Validators.required],
  //     StartTime: ['', Validators.required],
  //     //Enddate: ['', Validators.required],
  //     EndTime: ['', Validators.required],
  //     //Location: this.locationControl,
  //     Site: ['', Validators.required],
  //     Building: ['', Validators.required],
  //     FloorName: ['', Validators.required],
  //     RoomNo: ['', Validators.required],
  //     RoomType: ['', Validators.required],
  //     Status: ['', Validators.required],
  //     // MotorbogieNumber: ['', Validators.required],
  //     // VehicleNumber: ['', Validators.required],
  //     // Alarm: ['', Validators.required],
  //     Tools: ['', Validators.required],
  //     //PhoneNumber: ['', Validators.required],
  //     //InvalidPersonnel: ['', Validators.required],
  //     peopleinvalidcount: ['2', Validators.required],
  //     //Badgetestarea: ['', Validators.required],
  //     //Accesskey: ['', Validators.required],
  //     Note: ['', Validators.required],
  //     CmtValue: ['', Validators.required],
  //     Machinery: ['', Validators.required],
  //     CertifiedPerson: ['', Validators.required],
  //     LOTONumber: ['', Validators.required],
  //     //Safetyprecaustion: ['', Validators.required],
  //     //SpecialInstruction: ['', Validators.required],
  //     //Fedding: this.feedingControl,
  //     //TechRoom: this.TechRoomControl,
  //     //Trackname: this.TrackControl,
  //     // Walkwayname: this.WalkwayControl,
  //     // Trackblockedname: this.TrackblockedControl,
  //     //Motorbogie: this.MotorbogieControl,
  //     //Vehicle: this.VehicleControl,
  //     //Vehiclestesting: this.VehiclestestingControl,
  //     //WakingTeam: this.WakingTeamControl,
  //     SubContractor: this.SubContractorControl,
  //     TypeofActivity: this.TypeActivityControl,

  //     CMT: this.CMTControl,
  //     Poweroff: this.PoweroffControl,
  //     //Applicant: this.ApplicantControl,
  //     Hotwork: this.HOTWORKControl,
  //     LOTOPROCEDURE: this.LOTOPROCEDUREControl,
  //     //AccesstoOtherRoom:this.AccesstoroomControl,
  //     //Keysneeded:this.KeysneedControl,
  //     BADGENUMBER: this.BADGENUMBERControl,
  //     Room:this.RoomNoControl
  //     //Departconfs:this.departconfControl,
  //     //RequiredDocument:this.RequiredDocumentControl
  //   });
  // }

}
