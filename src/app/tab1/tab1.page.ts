import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  uid: any;
  token: any = '';
  constructor(private http: HttpClient) {
    this.uid = localStorage.getItem("loginid");
    this.token = localStorage.getItem('push-token');

    setTimeout(() => {
      if (this.uid && this.token) {
        this.updateToken().subscribe(res => {
          console.log('fff', res);
        })
      }
    }, 5000);
  }



  updateToken() {
    let url = `https://app.smartdispatchsystem.com/api/driver-token.php?uid=${this.uid}&token=${this.token}`;
    return this.http.get(url);
  }

}
