import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private http: HttpClient) {
    this.setupFCM();
    if (!localStorage.getItem('guestId')) {
      this.getGuestUser();
    }

  }

  async setupFCM() {
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        console.log('Sucess ', result);
        PushNotifications.register();
      } else {
        console.log(result);
      }
    });

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration',
      (token: Token) => {
        // alert('Push registration success, token: ' + token.value);
        localStorage.setItem('push-token', token.value);
      }
    );

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError',
      (error: any) => {
        // alert('Error on registration: ' + JSON.stringify(error));
        console.log(error);
      }
    );

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        //alert('Push received: ' + JSON.stringify(notification));
      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        //alert('Push action performed: ' + JSON.stringify(notification));
      }
    );

  }

  getGuestUser() {
    this.http.get('https://app.smartdispatchsystem.com/api/driver-getguestid.php').subscribe((res: any) => {
      console.log(res);
      if (res) {
        localStorage.setItem('guestId', res);
      }

    })
  }
}
