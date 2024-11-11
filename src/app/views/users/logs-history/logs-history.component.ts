import { Component, OnInit } from '@angular/core';
import { LogsService } from 'app/shared/services/logs.service';

@Component({
  selector: 'app-logs-history',
  templateUrl: './logs-history.component.html',
  styleUrls: ['./logs-history.component.css']
})
export class LogsHistoryComponent implements OnInit {
  items: any;
  spinner = false;

  constructor(private logDetails: LogsService) { }

  ngOnInit(): void {
    this.GetAllLogsHistory();
  }

  GetAllLogsHistory() {
    this.spinner = true;
    this.logDetails.GetAllLogsDetails().subscribe(res => {
      this.items = res["data"];
      // console.log("logs",this.items)
      this.spinner = false;
    });
  }

}
