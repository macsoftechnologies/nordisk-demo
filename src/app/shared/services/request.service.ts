import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { RequestDto, EditRequestDto, DeleteRequestDto, UpdateRequestStatusListDto, CopyRequestDto, UpdateClose_Status, RequestsbyId, RequestBySubcontractorId } from 'app/views/Models/RequestDto';
import { PlansDto } from 'app/views/Models/PlansDto';
import { SearchRequestDto } from 'app/views/Models/SearchRequestDto';
import { UpdateNotes, UpdateSafety, UpdateTime } from 'app/views/Models/MultiRequestUpdateDto';
import { EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  SelectedRequestData: any = {};
  bulidingFloorData: any = [];

  catDialogservice = new EventEmitter<any>();
  DeleteActivityEmitter = new EventEmitter<any>();

  constructor(private http: HttpClient) { }

  generateBulidFloorData() {
    this.bulidingFloorData = [
      {
        planType: "JF - Ground Floor",
        zoneList: [
          {
            floorName: 'ZONE A',
            zoneSubList: [
              {
                value: 'S.102',
                className: "zoneA-1",
                isSelected: false
              },
              {
                value: 'S.106',
                className: "zoneA-2",
                isSelected: false
              }
            ]
          },
          {
            floorName: 'ZONE B',
            zoneSubList: [
              {
                value: 'TR02.S',
                className: "zoneB-1",
                isSelected: false,
              },
              {
                value: 'EL02.S',
                className: "zoneB-2",
                isSelected: false,
              },
              {
                value: 'S.218',
                className: "zoneB-3",
                isSelected: false,
              },
              {
                value: 'S.216',
                className: "zoneB-4",
                isSelected: false,
              },
              {
                value: 'S.214',
                className: "zoneB-5",
                isSelected: false,
              },
              {
                value: 'S.212',
                className: "zoneB-6",
                isSelected: false,
              },
              {
                value: 'S.210',
                className: "zoneB-7",
                isSelected: false,
              },
              {
                value: 'S.208',
                className: "zoneB-8",
                isSelected: false,
              },
              {
                value: 'S.207',
                className: "zoneB-9",
                isSelected: false,
              },
              {
                value: 'S.206',
                className: "zoneB-10",
                isSelected: false,
              },
              {
                value: 'S.204',
                className: "zoneB-11",
                isSelected: false,
              },
              {
                value: 'S.552',
                className: "zoneB-12",
                isSelected: false,
              },
              {
                value: 'S.202',
                className: "zoneB-13",
                isSelected: false,
              },
              {
                value: 'TR01.S',
                className: "zoneB-14",
                isSelected: false,
              },
              {
                value: 'S.550',
                className: "zoneB-15",
                isSelected: false,
              },
              {
                value: 'EL01.S',
                className: "zoneB-16",
                isSelected: false,
              },
              {
                value: 'S.201',
                className: "zoneB-17",
                isSelected: false,
              }
      
            ]
          },
          {
            floorName: 'ZONE C',
            zoneSubList: [
              {
                value: 'PAU-301-06',
                className: "zoneC-1",
                isSelected: false,
              },
              {
                value: 'PAU-301-05',
                className: "zoneC-2",
                isSelected: false,
              },
              {
                value: 'PAU-301-04',
                className: "zoneC-3",
                isSelected: false,
              },
              {
                value: 'PAU-301-03',
                className: "zoneC-4",
                isSelected: false,
              },
              {
                value: 'PAU-301-02',
                className: "zoneC-5",
                isSelected: false,
              },
              {
                value: 'S.540',
                className: "zoneC-6",
                isSelected: false,
              },
              {
                value: 'S.542',
                className: "zoneC-7",
                isSelected: false,
              },
              {
                value: 'S.554',
                className: "zoneC-8",
                isSelected: false,
              },
              {
                value: 'S.546',
                className: "zoneC-9",
                isSelected: false,
              },
              {
                value: 'S.556',
                className: "zoneC-10",
                isSelected: false,
              },
              {
                value: 'S.558',
                className: "zoneC-11",
                isSelected: false,
              },
              {
                value: 'S.560',
                className: "zoneC-12",
                isSelected: false,
              },
              {
                value: 'S.562',
                className: "zoneC-13",
                isSelected: false,
              },
              {
                value: 'S.501',
                className: "zoneC-14",
                isSelected: false,
              },
              {
                value: 'PAU-292-01',
                className: "zoneC-15",
                isSelected: false,
              },
              {
                value: 'PAU-251-01',
                className: "zoneC-16",
                isSelected: false,
              },
              {
                value: 'PAU-241-01',
                className: "zoneC-17",
                isSelected: false,
              },
              {
                value: 'PAU-231-01',
                className: "zoneC-18",
                isSelected: false,
              },
              {
                value: 'PAU-291-01',
                className: "zoneC-19",
                isSelected: false,
              },
              {
                value: 'PAU-153-01',
                className: "zoneC-20",
                isSelected: false,
              },
              {
                value: 'PAU-221-01',
                className: "zoneC-21",
                isSelected: false,
              }
            ]
          },
          {
            floorName: 'ZONE D',
            zoneSubList: [
              {
                value: 'TR03.S',
                className: "zoneD-1",
                isSelected: false
              },
              {
                value: 'S.336',
                className: "zoneD-2",
                isSelected: false
              },
              {
                value: 'S.334',
                className: "zoneD-3",
                isSelected: false
              },
              {
                value: 'S.330',
                className: "zoneD-4",
                isSelected: false
              },
              {
                value: 'S.332',
                className: "zoneD-5",
                isSelected: false
              },
              {
                value: 'S.322',
                className: "zoneD-6",
                isSelected: false
              },
              {
                value: 'S.324',
                className: "zoneD-7",
                isSelected: false
              },
              {
                value: 'S.320',
                className: "zoneD-8",
                isSelected: false
              },
              {
                value: 'S.316',
                className: "zoneD-9",
                isSelected: false
              },
              {
                value: 'S.314',
                className: "zoneD-10",
                isSelected: false
              },
              {
                value: 'S.315',
                className: "zoneD-11",
                isSelected: false
              },
              {
                value: 'S.312',
                className: "zoneD-12",
                isSelected: false
              },
              {
                value: 'S.310.1',
                className: "zoneD-13",
                isSelected: false
              },
              {
                value: 'S.310',
                className: "zoneD-14",
                isSelected: false
              },
              {
                value: 'S.306',
                className: "zoneD-15",
                isSelected: false
              },
              {
                value: 'S.302',
                className: "zoneD-16",
                isSelected: false
              },
              {
                value: 'S.304',
                className: "zoneD-17",
                isSelected: false
              },
              {
                value: 'S.304.4',
                className: "zoneD-18",
                isSelected: false
              },
              {
                value: 'S.304.3',
                className: "zoneD-19",
                isSelected: false
              },
              {
                value: 'S.304.2',
                className: "zoneD-20",
                isSelected: false,
              },
              {
                value: 'S.304.1',
                className: "zoneD-21",
                isSelected: false
              }
            ]
          },
          {
            floorName: 'ZONE E',
            zoneSubList: [
              {
                value: '111X',
                className: "zoneE-1",
                isSelected: false
              },
              {
                value: 'PAU-112-01',
                className: "zoneE-2",
                isSelected: false
              },
              {
                value: 'S.512',
                className: "zoneE-3",
                isSelected: false
              },
              {
                value: 'S.510',
                className: "zoneE-4",
                isSelected: false
              },
              {
                value: 'PAU-312-01',
                className: "zoneE-5",
                isSelected: false
              },
              {
                value: 'PAU-312-02',
                className: "zoneE-6",
                isSelected: false
              },
              {
                value: 'PAU-312-03',
                className: "zoneE-7",
                isSelected: false
              },
              {
                value: '312F',
                className: "zoneE-8",
                isSelected: false
              },
              {
                value: '312G',
                className: "zoneE-9",
                isSelected: false
              },
              {
                value: 'PAU-312-04',
                className: "zoneE-10",
                isSelected: false
              },
              {
                value: 'PAU-313-02',
                className: "zoneE-11",
                isSelected: false
              },
              {
                value: 'PAU-313-01',
                className: "zoneE-12",
                isSelected: false
              },
              {
                value: 'S.528',
                className: "zoneE-13",
                isSelected: false
              },
              {
                value: 'S.530',
                className: "zoneE-14",
                isSelected: false
              },
              {
                value: 'S.532',
                className: "zoneE-15",
                isSelected: false
              },
              {
                value: 'S.534',
                className: "zoneE-16",
                isSelected: false
              },
              {
                value: 'S.536',
                className: "zoneE-17",
                isSelected: false
              },
              {
                value: 'S.537',
                className: "zoneE-18",
                isSelected: false
              },
              {
                value: 'S.539',
                className: "zoneE-19",
                isSelected: false
              },
              {
                value: 'S.538',
                className: "zoneE-20",
                isSelected: false
              },
              {
                value: 'PAU-311-02',
                className: "zoneE-21",
                isSelected: false
              },
              {
                value: 'PAU-311-01',
                className: "zoneE-22",
                isSelected: false
              },
              {
                value: 'PAU-191-01',
                className: "zoneE-23",
                isSelected: false
              },
              {
                value: 'PAU-061-02',
                className: "zoneE-24",
                isSelected: false
              },
              {
                value: '063/064-01',
                className: "zoneE-25",
                isSelected: false
              },
              {
                value: '105C',
                className: "zoneE-26",
                isSelected: false
              },
              {
                value: 'PAU-392-01',
                className: "zoneE-27",
                isSelected: false
              },
              {
                value: 'PAU-391-01',
                className: "zoneE-28",
                isSelected: false
              },
              {
                value: 'PAU-105-01',
                className: "zoneE-29",
                isSelected: false
              },
              {
                value: 'PAU-301-01',
                className: "zoneE-30",
                isSelected: false
              }
      
      
            ]
          },
          {
            floorName: 'ZONE F1',
            zoneSubList: [
              {
                value: 'S.404',
                className: "zoneF1-1",
                isSelected: false
              },
              {
                value: 'S.406',
                className: "zoneF1-2",
                isSelected: false
              },
              {
                value: 'S.412.1',
                className: "zoneF1-3",
                isSelected: false
              },
              {
                value: 'S.338',
                className: "zoneF1-4",
                isSelected: false
              },
              {
                value: 'S.504',
                className: "zoneF1-5",
                isSelected: false
              },
              {
                value: 'S.503',
                className: "zoneF1-6",
                isSelected: false
              },
              {
                value: 'S.507',
                className: "zoneF1-7",
                isSelected: false
              },
              {
                value: 'S.509',
                className: "zoneF1-8",
                isSelected: false
              },
   
      
            ]
          },
          {
            floorName: 'ZONE F2',
            zoneSubList: [
              {
                value: 'TR05.S',
                className: "zoneF2-1",
                isSelected: false
              },
              {
                value: 'S.602',
                className: "zoneF2-2",
                isSelected: false
              },
              {
                value: 'S.606',
                className: "zoneF2-3",
                isSelected: false
              },
              {
                value: 'S.604',
                className: "zoneF2-4",
                isSelected: false
              },
              {
                value: 'S.608',
                className: "zoneF2-5",
                isSelected: false
              },
              {
                value: 'EL03.S',
                className: "zoneF2-6",
                isSelected: false
              },
              {
                value: 'TR06.S',
                className: "zoneF2-7",
                isSelected: false
              },
              {
                value: 'S.402',
                className: "zoneF2-8",
                isSelected: false
              },
              {
                value: 'S.410',
                className: "zoneF2-9",
                isSelected: false
              },
              {
                value: 'S.408',
                className: "zoneF2-10",
                isSelected: false
              },
              {
                value: 'S.412.1',
                className: "zoneF2-11",
                isSelected: false
              },
              {
                value: 'S.411',
                className: "zoneF2-12",
                isSelected: false
              }
      
            ]
          },
        ]
      },
      {
        planType: "JF - 1st Floor",
        zoneList: [
          {
            floorName: 'ZONE A',
            zoneSubList: [
              {
                value: '1.104',
                className: "first-zoneA-1",
                isSelected: false
              },
              {
                value: '1.102',
                className: "first-zoneA-2",
                isSelected: false
              },
              {
                value: '1.105',
                className: "first-zoneA-3",
                isSelected: false
              }
      
            ]
          },
          {
            floorName: 'ZONE B',
            zoneSubList: [
              {
                value: 'TR02.1',
                className: "first-zoneB-1",
                isSelected: false
              },
              {
                value: '1.220',
                className: "first-zoneB-2",
                isSelected: false
              },
              {
                value: 'EL02.1',
                className: "first-zoneB-3",
                isSelected: false
              },
              {
                value: '1.228',
                className: "first-zoneB-4",
                isSelected: false
              },
              {
                value: '1.226',
                className: "first-zoneB-5",
                isSelected: false
              },
              {
                value: '1.224',
                className: "first-zoneB-6",
                isSelected: false
              },
              {
                value: '1.222',
                className: "first-zoneB-7",
                isSelected: false
              },
              {
                value: '1.218',
                className: "first-zoneB-8",
                isSelected: false
              },
              {
                value: '1.218.4',
                className: "first-zoneB-9",
                isSelected: false
              },
              {
                value: '1.218.3',
                className: "first-zoneB-10",
                isSelected: false
              },
              {
                value: '1.218.2',
                className: "first-zoneB-11",
                isSelected: false
              },
              {
                value: '1.218.1',
                className: "first-zoneB-12",
                isSelected: false
              },
              {
                value: '1.210',
                className: "first-zoneB-13",
                isSelected: false
              },
              // {
              //   value: 'TR01.S',
              //   className: "first-zoneB-14",
              //   isSelected: false
              // },
              {
                value: '1.208',
                className: "first-zoneB-14",
                isSelected: false
              },
              {
                value: '1.552',
                className: "first-zoneB-15",
                isSelected: false
              },
              {
                value: '1.206',
                className: "first-zoneB-16",
                isSelected: false
              },
              {
                value: '1.550',
                className: "first-zoneB-17",
                isSelected: false
              },
              {
                value: 'TR01.1',
                className: "first-zoneB-18",
                isSelected: false
              },
              {
                value: '1.204',
                className: "first-zoneB-19",
                isSelected: false
              },
              {
                value: 'EL01.1',
                className: "first-zoneB-20",
                isSelected: false
              },
              {
                value: '1.202',
                className: "first-zoneB-21",
                isSelected: false
              }
      
            ]
          },
          {
            floorName: 'ZONE C',
            zoneSubList: [
              {
                value: '1.544',
                className: "first-zoneC-1",
                isSelected: false
              },
              {
                value: '1.540',
                className: "first-zoneC-2",
                isSelected: false
              }
            ]
          },
          {
            floorName: 'ZONE D',
            zoneSubList: [
              {
                value : 'TR03.1',
                className : "first-zoneD-1",
                isSelected : false
              },
              {
                value : '1.328',
                className : "first-zoneD-2",
                isSelected : false
              },
              {
                value : '1.326',
                className : "first-zoneD-3",
                isSelected : false
              },
              {
                value : '1.320',
                className : "first-zoneD-4",
                isSelected : false
              },
              {
                value : '1.324',
                className : "first-zoneD-5",
                isSelected : false
              },
              {
                value : '1.323',
                className : "first-zoneD-6",
                isSelected : false
              },
              {
                value : '1.322',
                className : "first-zoneD-7",
                isSelected : false
              },
              {
                value : '1.316',
                className : "first-zoneD-8",
                isSelected : false
              },
              {
                value : '1.314',
                className : "first-zoneD-9",
                isSelected : false
              },
              {
                value : '1.310',
                className : "first-zoneD-10",
                isSelected : false
              },
              {
                value : '1.312',
                className : "first-zoneD-11",
                isSelected : false
              },
              {
                value : '1.308',
                className : "first-zoneD-12",
                isSelected : false
              },
              {
                value : '1.307',
                className : "first-zoneD-13",
                isSelected : false
              },
              {
                value : '1.306',
                className : "first-zoneD-14",
                isSelected : false
              },
              {
                value : '1.305',
                className : "first-zoneD-15",
                isSelected : false
              },
              {
                value : '1.220',
                className : "first-zoneD-16",
                isSelected : false
              },
              {
                value : '1.302',
                className : "first-zoneD-17",
                isSelected : false
              },
              {
                value : '1.304',
                className : "first-zoneD-18",
                isSelected : false
              },
              {
                value : '1.302.2',
                className : "first-zoneD-19",
                isSelected : false
              },
              {
                value : '1.302.1',
                className : "first-zoneD-20",
                isSelected : false
              }
              
            ]
          },
          {
            floorName: 'ZONE E',
            zoneSubList: [
              {
                value : '1.532',
                className : "first-zoneE-1",
                isSelected : false
              },
              {
                value : '1.530',
                className : "first-zoneE-2",
                isSelected : false
              },
              {
                value : 'PAU-313',
                className : "first-zoneE-3",
                isSelected : false
              }
              
            ]
          },
          {
            floorName: 'ZONE F1',
            zoneSubList: [
              {
                value : '1.338',
                className : "first-zoneF1-1",
                isSelected : false
              },
              {
                value : '1.502',
                className : "first-zoneF1-2",
                isSelected : false
              },
              {
                value : '1.504',
                className : "first-zoneF1-3",
                isSelected : false
              },
              {
                value : 'TR04.1',
                className : "first-zoneF1-4",
                isSelected : false
              }
              
            ]
          },
          {
            floorName: 'ZONE F2',
            zoneSubList: [
              {
                value : 'TR05.1',
                className : "first-zoneF2-1",
                isSelected : false
              },
              {
                value : '1.616',
                className : "first-zoneF2-2",
                isSelected : false
              },
              {
                value : 'EL03.1',
                className : "first-zoneF2-3",
                isSelected : false
              },
              {
                value : ' TR06._',
                className : "first-zoneF2-4",
                isSelected : false
              },
              {
                value : '1.602',
                className : "first-zoneF2-5",
                isSelected : false
              },
              {
                value : '1.404',
                className : "first-zoneF2-6",
                isSelected : false
              },
              {
                value : '1.402',
                className : "first-zoneF2-7",
                isSelected : false
              },
              {
                value : '1.604',
                className : "first-zoneF2-8",
                isSelected : false
              },
              {
                value : '1.606',
                className : "first-zoneF2-9",
                isSelected : false
              },
              {
                value : '1.410',
                className : "first-zoneF2-10",
                isSelected : false
              },
              {
                value : '1.608',
                className : "first-zoneF2-11",
                isSelected : false
              },
              {
                value : '1.610',
                className : "first-zoneF2-12",
                isSelected : false
              },
              {
                value : '1.412',
                className : "first-zoneF2-13",
                isSelected : false
              },
              {
                value : '1.414',
                className : "first-zoneF2-14",
                isSelected : false
              },
              {
                value : '1.614',
                className : "first-zoneF2-15",
                isSelected : false
              }
            ]
          },
        ]
      },
      {
        planType: "JF- 2nd Floor",
        zoneList: [
          {
            floorName: 'ZONE A',
            zoneSubList: [
              {
                value : 'ZONE A',
                className : "second-zoneA",
                isSelected : false
              },
      
            ]
          },
          {
            floorName: 'ZONE B',
            zoneSubList: [
              {
                value : ' TR02.2',
                className : "second-zoneB-1",
                isSelected : false
              },
              {
                value : 'EL02.2',
                className : "second-zoneB-2",
                isSelected : false
               },
              {
                 value : 'JF5743',
                 className : "second-zoneB-3",
                 isSelected : false
               },
              {
                 value : '2.202',
                 className : "second-zoneB-4",
                 isSelected : false
               },
              {
                 value : 'JF5745',
                 className : "second-zoneB-5",
                 isSelected : false
               },
              {
                 value : 'JF5744',
                 className : "second-zoneB-6",
                 isSelected : false
               },
              {
                 value : 'TR01.2',
                 className : "second-zoneB-7",
                 isSelected : false
               },
              {
                 value : 'EL01.2',
                 className : "second-zoneB-8",
                 isSelected : false
               }
      
            ]
          },
          {
            floorName: 'ZONE C',
            zoneSubList: [
              {
                value : '2.501',
                className : "second-zoneC-1",
                isSelected : false
              },
              {
                value : '2.550',
                className : "second-zoneC-2",
                isSelected : false
              }
            
            ]
          },
          {
            floorName: 'ZONE D',
            zoneSubList: [
              {
                value : 'TR03.2',
                className : "second-zoneD-1",
                isSelected : false
              },
              {
                value : 'JF5741',
                className : "second-zoneD-2",
                isSelected : false
              },
              {
                value : 'JF5746',
                className : "second-zoneD-3", 
                isSelected : false
              },
              {
                value : 'JF5742',
                className : "second-zoneD-4",
                isSelected : false
              },
              {
                value : '2.302',
                className : "second-zoneD-5",
                isSelected : false
              },
              {
                value : '2.300',
                className : "second-zoneD-6",
                isSelected : false
              }
              
            ]
          },
          {
            floorName: 'ZONE E',
            zoneSubList: [
              {
                value : '2.501',
                className : "second-zoneE-1",
                isSelected : false
              }
            ]
          },
          {
            floorName: 'ZONE F1',
            zoneSubList: [
              {
                value : '2.402',
                className : "second-zoneF1-1",
                isSelected : false
              },
              {
                value : '2.502',
                className : "second-zoneF1-2",
                isSelected : false
              },
              {
                value : 'TR04.2',
                className : "second-zoneF1-3",
                isSelected : false
              },
              {
                value : '2.503',
                className : "second-zoneF1-4",
                isSelected : false
              },
              {
                value : '2.509',
                className : "second-zoneF1-5",
                isSelected : false
              }
              
            ]
          },
          {
            floorName: 'ZONE F2',
            zoneSubList: [
              {
                value : 'TR05.2',
                className : "second-zoneF2-1",
                isSelected : false
              },
              {
                value : '2.602',
                className : "second-zoneF2-2",
                isSelected : false
              },
              {
                value : 'JF5740',
                className : "second-zoneF2-3",
                isSelected : false
              },
              {
                value : '2.402',
                className : "second-zoneF2-4",
                isSelected : false
              },
              {
                value : '2.410',
                className : "second-zoneF2-5",
                isSelected : false
              },
              {
                value : '2.606',
                className : "second-zoneF2-6",
                isSelected : false
              },
              {
                value : '2.612',
                className : "second-zoneF2-7",
                isSelected : false
              },
              {
                value : '2.608',
                className : "second-zoneF2-8",
                isSelected : false
              },
              {
                value : 'EL03.2',
                className : "second-zoneF2-9",
                isSelected : false
              },
              {
                value : 'TR06.1',
                className : "second-zoneF2-10",
                isSelected : false
              },
              {
                value : '2.610',
                className : "second-zoneF2-11",
                isSelected : false
              },
              {
                value : '2.604',
                className : "second-zoneF2-12",
                isSelected : false
              },
              {
                value : '2.601',
                className : "second-zoneF2-13",
                isSelected : false
              },
              {
                value : '2.411',
                className : "second-zoneF2-14",
                isSelected : false
              },
              {
                value : '2.415',
                className : "second-zoneF2-15",
                isSelected : false
              }
            ]
          },
        ]
      },
      {
        planType: "JF - Roof Plan",
        zoneList: [
          {
            floorName: 'ZONE A',
            zoneSubList: [
              {
                value : 'ZONE A',
                className : "roof-zoneA",
                isSelected : false
              },
            ]
          },
          {
            floorName: 'ZONE B',
            zoneSubList: [
              {
                value : 'ZONE B',
                className : "roof-zoneB",
                isSelected : false
              },
              {
                value : 'DT-3.TR01.3.EXT',
                className : "roof-zoneB-1",
                isSelected : false
              },
              
            ]
          },
          {
            floorName: 'ZONE C',
            zoneSubList: [
              {
                value : 'ZONE C',
                className : "roof-zoneC",
                isSelected : false
              },
           
            ]
          },
          {
            floorName: 'ZONE D',
            zoneSubList: [
              {
                value : 'ZONE D',
                className : "roof-zoneD",
                isSelected : false
              },
            ]
          },
          {
            floorName: 'ZONE E',
            zoneSubList: [
              {
                value : 'ZONE E',
                className : "roof-zoneE",
                isSelected : false
              },
            
            ]
          },
          {
            floorName: 'ZONE F1',
            zoneSubList: [
              {
                value : 'ZONE F1',
                className : "roof-zoneF1",
                isSelected : false
              },
              
            ]
          },
          {
            floorName: 'ZONE F2',
            zoneSubList: [
              {
                value : 'ZONE F2',
                className : "roof-zoneF2",
                isSelected : false
              },
            ]
          },
        ]
      },
      {
        planType: "External Areas",
        zoneList: [
          {
            floorName: 'JE',
            zoneSubList: [
              {
                value: 'Area JE/1',
                className: "external-areas-je-1",
                isSelected: false
                },
                {
                value: 'Area JE/2',
                className: "external-areas-je-2",
                isSelected: false
                },
                {
                value: 'Area JE/3',
                className: "external-areas-je-3",
                isSelected: false
                },
                {
                value: 'Area JE/4',
                className: "external-areas-je-4",
                isSelected: false
                },
                {
                value: 'Area JE/5',
                className: "external-areas-je-5",
                isSelected: false
                },
                {
                value: 'Area JE/6',
                className: "external-areas-je-6",
                isSelected: false
                },
                {
                value: 'Area JE/7',
                className: "external-areas-je-7",
                isSelected: false
                },
                {
                value: 'Area JE/8',
                className: "external-areas-je-8",
                isSelected: false
                },
                {
                value: 'Area JE/9',
                className: "external-areas-je-9",
                isSelected: false
                },
                {
                value: 'Area JE/10',
                className: "external-areas-je-10",
                isSelected: false
                },
                {
                  value: 'Area JE/11',
                  className: "external-areas-je-11",
                  isSelected: false
                },
                {
                value: 'JE-Zone 1',
                className: "external-areas-je-12",
                isSelected: false
                },
                {
                value: 'JE-Zone 2',
                className: "external-areas-je-13",
                isSelected: false
                },
                {
                value: 'JE-Zone 3',
                className: "external-areas-je-14",
                isSelected: false
                },
                {
                value: 'JE-Zone 4',
                className: "external-areas-je-15",
                isSelected: false
                },
            ]
          },
          {
            floorName: 'JF',
            zoneSubList: [
              {
                value: 'Area JF/2',
                className: "external-areas-jf-1",
                isSelected: false
                },
                {
                value: 'Area JF/3',
                className: "external-areas-jf-2",
                isSelected: false
                },
                {
                value: 'Area JF/4',
                className: "external-areas-jf-3",
                isSelected: false
                },
                {
                value: 'Area JF/5',
                className: "external-areas-jf-4",
                isSelected: false
                },
                {
                value: 'Area JF/6',
                className: "external-areas-jf-5",
                isSelected: false
                },
                {
                value: 'Area JF/7',
                className: "external-areas-jf-6",
                isSelected: false
                },
                {
                value: 'Area JF/8',
                className: "external-areas-jf-7",
                isSelected: false
                },
                        
            ]
          },
          {
            floorName: 'JG',
            zoneSubList: [
              {
                value: 'Area JG/3',
                className: "external-areas-jg-1",
                isSelected: false
                },
                
                {
                value: 'Area JG/4',
                className: "external-areas-jg-2",
                isSelected: false
                },
                {
                value: 'Area JG/5',
                className: "external-areas-jg-3",
                isSelected: false
                },
                {
                value: 'Area JG/6',
                className: "external-areas-jg-4",
                isSelected: false
                },
                {
                value: 'Area JG/7',
                className: "external-areas-jg-5",
                isSelected: false
                },
                {
                value: 'Area JG/8',
                className: "external-areas-jg-6",
                isSelected: false
                },
                {
                value: 'Area JG/9',
                className: "external-areas-jg-7",
                isSelected: false
                },
                {
                value: 'Area JG/10',
                className: "external-areas-jg-8",
                isSelected: false
                },
            ]
          },
          {
            floorName: 'JH-JX-JS',
            zoneSubList: [
              {
                value: 'Area N2/1',
                className: "external-areas-jh-jx-js-1",
                isSelected: false
                },
                
                {
                value: 'Area N2/2',
                className: "external-areas-jh-jx-js-2",
                isSelected: false
                },
                
                {
                value: 'Area JH/1',
                className: "external-areas-jh-jx-js-3",
                isSelected: false
                },
                {
                value: 'Area JH/2',
                className: "external-areas-jh-jx-js-4",
                isSelected: false
                },
                {
                value: 'Area JH/3',
                className: "external-areas-jh-jx-js-5",
                isSelected: false
                },
                {
                value: 'Area JH/4',
                className: "external-areas-jh-jx-js-6",
                isSelected: false
                },
                {
                value: 'Area JH/5',
                className: "external-areas-jh-jx-js-7",
                isSelected: false
                },
                {
                value: 'Area JX/1',
                className: "external-areas-jh-jx-js-8",
                isSelected: false
                },
                {
                value: 'Area JX/2',
                className: "external-areas-jh-jx-js-9",
                isSelected: false
                },
                {
                value: 'Area JX/3',
                className: "external-areas-jh-jx-js-10",
                isSelected: false
                }
            ]
          },
          {
            floorName: 'JJ',
            zoneSubList: [
              {
                value: 'Area JJ/1',
                className: "external-areas-jj-1",
                isSelected: false
                },
                
                {
                value: 'Area JJ/2',
                className: "external-areas-jj-2",
                isSelected: false
                },
                
                {
                value: 'Area JJ/3',
                className: "external-areas-jj-3",
                isSelected: false
                },
                
                {
                value: 'JJ-Zone 1',
                className: "external-areas-jj-4",
                isSelected: false
                },
                
                {
                value: 'JJ-Zone 2',
                className: "external-areas-jj-5",
                isSelected: false
                }
            ]
          },
          {
            floorName: 'MP',
            zoneSubList: [
              {
                value: 'Area MP/1',
                className: "external-areas-mp-1",
                isSelected: false
                },
                {
                value: 'Area MP/2',
                className: "external-areas-mp-2",
                isSelected: false
                },
                {
                value: 'Area MP/3',
                className: "external-areas-mp-3",
                isSelected: false
                },
                {
                value: 'Area MP/4',
                className: "external-areas-mp-4",
                isSelected: false
                },
                {
                value: 'Area MP/5',
                className: "external-areas-mp-5",
                isSelected: false
                }
              
            ]
          },
          {
            floorName: 'NH3-KF-MF',
            zoneSubList: [
              {
                value: 'Area MF/1',
                className: "external-areas-nh3-kf-mf-1",
                isSelected: false
                },
                
                {
                value: 'Area MF/2',
                className: "external-areas-nh3-kf-mf-2",
                isSelected: false
                },
                
                {
                value: 'Area NH3/1',
                className: "external-areas-nh3-kf-mf-3",
                isSelected: false
                },
                {
                value: 'Area NH3/2',
                className: "external-areas-nh3-kf-mf-4",
                isSelected: false
                },
                {
                value: 'Area KF/0',
                className: "external-areas-nh3-kf-mf-5",
                isSelected: false
                },
                {
                value: 'Area KF/1',
                className: "external-areas-nh3-kf-mf-6",
                isSelected: false
                },
                {
                value: 'Area KF/2',
                className: "external-areas-nh3-kf-mf-7",
                isSelected: false
                },
                {
                value: 'Area KF/3',
                className: "external-areas-nh3-kf-mf-8",
                isSelected: false
                },
                {
                value: 'Area KF/4',
                className: "external-areas-nh3-kf-mf-9",
                isSelected: false
                }
                   
            ]
          },
          {
            floorName: 'Roads',
            zoneSubList: [
              {
                value: 'Road JF-North/1',
                className: "external-areas-roads-1",
                isSelected: false
                },
                {
                value: 'Road JF-North/2',
                className: "external-areas-roads-2",
                isSelected: false
                },
                {
                value: 'Road JF-West',
                className: "external-areas-roads-3",
                isSelected: false
                },
                {
                value: 'Road JG-West',
                className: "external-areas-roads-4",
                isSelected: false
                },
                {
                value: 'Junction JF',
                className: "external-areas-roads-5",
                isSelected: false
                },
                {
                value: 'Road JF-South',
                className: "external-areas-roads-6",
                isSelected: false
                },
                {
                value: 'Junction JH',
                className: "external-areas-roads-7",
                isSelected: false
                },
                
                {
                value: 'Road JG-South',
                className: "external-areas-roads-8",
                isSelected: false
                },
                {
                value: 'Bus Stop',
                className: "external-areas-roads-9",
                isSelected: false
                },
                {
                value: 'Road JH-South',
                className: "external-areas-roads-10",
                isSelected: false
                },
                {
                value: 'Junction JX',
                className: "external-areas-roads-11",
                isSelected: false
                },
                {
                value: 'Road JG-East',
                className: "external-areas-roads-12",
                isSelected: false
                },
                
                {
                value: 'Road MR-West',
                className: "external-areas-roads-13",
                isSelected: false
                },
                {
                value: 'Road MR-South',
                className: "external-areas-roads-14",
                isSelected: false
                },
                {
                value: 'Road MP-South',
                className: "external-areas-roads-15",
                isSelected: false
                },
                
                {
                value: 'Junction KF',
                className: "external-areas-roads-16",
                isSelected: false
                },
                {
                value: 'Road KF',
                className: "external-areas-roads-17",
                isSelected: false
                },
                {
                value: 'Road MR-East',
                className: "external-areas-roads-18",
                isSelected: false
                }
            ]
          },
          {
            floorName: 'Welfare',
            zoneSubList: [
              {
                value: 'Area WFC/3',
                className: "external-areas-welfare-1",
                isSelected: false
                },
                {
                value: 'Area WFC/1',
                className: "external-areas-welfare-2",
                isSelected: false
                },
                {
                value: 'Area WFC/2',
                className: "external-areas-welfare-3",
                isSelected: false
                }      
            ]
          },
          {
            floorName: 'CM',
            zoneSubList: [
              {
                value: 'Area CM/1',
                className: "external-areas-cm-1",
                isSelected: false
                },
                {
                value: 'Area CM/2',
                className: "external-areas-cm-2",
                isSelected: false
                },
                {
                value: 'Area CM/3',
                className: "external-areas-cm-3",
                isSelected: false
                },
                {
                value: 'Area CM/4',
                className: "external-areas-cm-4",
                isSelected: false
                },
                {
                value: 'Area JF/5',
                className: "external-areas-cm-5",
                isSelected: false
                },
                {
                value: 'Area CM/6',
                className: "external-areas-cm-6",
                isSelected: false
                },
                {
                value: 'Area CM/7',
                className: "external-areas-cm-7",
                isSelected: false
                },
                {
                value: 'Area CM/8',
                className: "external-areas-cm-8",
                isSelected: false
                },
                {
                value: 'Area CM/9',
                className: "external-areas-cm-9",
                isSelected: false
                },
                {
                value: 'Area CM/10',
                className: "external-areas-cm-10",
                isSelected: false
                },   
            ]
          },
        ]
      }


    ]
    return this.bulidingFloorData;
  }

  public GetAllSites(): Observable<any[]> {
    return this.http.get<any[]>(environment.API_URL + 'common/sites.php');
  }
  public GetAllBuildingsbyid(siteid): Observable<any[]> {
    return this.http.get<any[]>(environment.API_URL + 'common/buildings.php?siteid=' + siteid);
  }
  public GetAllFloorsbyid(bid): Observable<any[]> {
    return this.http.get<any[]>(environment.API_URL + 'common/floors.php?bid=' + bid);
  }
  public GetAllRoomsbyid(flid): Observable<any[]> {
    return this.http.get<any[]>(environment.API_URL + 'common/rooms.php?flid=' + flid);
  }

  public GetAllRequests(): Observable<any[]> {
    return this.http.get<any[]>(environment.API_URL + 'request/read.php');
  }
  public GetAllRequestsByid(res: RequestBySubcontractorId): Observable<any[]> {
    return this.http.post<any[]>(environment.API_URL + 'request/readrequestid.php', res);
  }

  public GetRequestsImagesByid(id): Observable<any[]> {
    return this.http.get<any>(environment.API_URL + 'request/readImageslist.php?requestId=' + id);
  }

  public GetRequestsLogs(id: RequestsbyId): Observable<any[]> {
    return this.http.post<any>(environment.API_URL + 'request/readLogs.php', id);
  }

  public CreateNewRequest(req): Observable<any> {
    return this.http.post<any>(environment.API_URL + 'request/create.php', req);
  }
  public UpdateRequest(req: EditRequestDto): Observable<any> {
    return this.http.post<any>(environment.API_URL + 'request/update.php', req);
  }
  public UpdateListStatusRequest(req: UpdateRequestStatusListDto): Observable<any> {
    return this.http.post<any>(environment.API_URL + 'request/update_status.php', req);
  }
  public DeleteRequest(req: DeleteRequestDto): Observable<any> {
    return this.http.post<any>(environment.API_URL + 'request/delete.php', req);
  }
  public GetPlans(req: PlansDto): Observable<any> {
    return this.http.post<any>(environment.API_URL + 'request/planslist.php', req);
  }
  public CopyRequest(req: CopyRequestDto): Observable<any> {
    return this.http.post<any>(environment.API_URL + 'request/createbycount.php', req);
  }

  public SearchRequest(req: SearchRequestDto): Observable<any> {
    // req: readrequestinfo
    return this.http.post<any>(environment.API_URL + 'request/searchlist.php', req);
  }

  public CloseRequest(formData): Observable<any> {
    return this.http.post<any>(environment.API_URL + 'request/upload.php', formData);
  }


  public UpdateListReqstNote(req: UpdateNotes): Observable<any> {
    return this.http.post<any>(environment.API_URL + 'request/updateNotes.php', req);
  }
  public UpdateListReqstSafety(req: UpdateSafety): Observable<any> {
    return this.http.post<any>(environment.API_URL + 'request/updateSafety.php', req);
  }
  public UpdateListReqstTime(req: UpdateTime): Observable<any> {
    return this.http.post<any>(environment.API_URL + 'request/updateStartTime.php', req);
  }

  // pagination
  public listpagination(data): Observable<any> {
    return this.http.post<any>(environment.API_URL + 'request/readrequestinfo.php', data);
  }

  public addCategory(data): Observable<any> {
    return this.http.post<any>(environment.API_URL + "category/create.php", data);
  }

  public readCategory(): Observable<any> {
    return this.http.get(environment.API_URL + "category/read.php");
  }

  public deleteActivity(data): Observable<any> {
    return this.http.post(environment.API_URL + "category/delete.php", data);
  }



  // public SetselectedRequest(row)
  // {
  //   this.SelectedRequestData=row;
  // }
  // public GetSelectedRequestData():Observable<any[]> {
  //   return this.SelectedRequestData;
  // }
}
