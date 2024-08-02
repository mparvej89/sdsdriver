import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { DocumentScanner, ResponseType } from 'capacitor-document-scanner'
@Component({
  selector: 'app-load',
  templateUrl: './load.page.html',
  styleUrls: ['./load.page.scss'],

})
export class LoadPage implements OnInit {
  scannedImages: any[] = [];
  isModalOpen: boolean = false;
  docscaned: any[] = [];
  uid: any;
  lid: any;
  sid:any;
  constructor(private http: HttpClient,
    private toastController: ToastController) { }

  ngOnInit() {
    this.uid = localStorage.getItem("loginid");
    this.lid = localStorage.getItem("loadid");
  }

  async scanDoc() {
    let scannedImages: any = await DocumentScanner.scanDocument({ responseType: ResponseType.Base64 })
    console.log('get back an array with scanned image file paths', scannedImages.scannedImages);
    if (scannedImages.scannedImages && scannedImages.scannedImages.length > 0) {
      scannedImages.scannedImages.forEach((element: any) => {
        this.docscaned.push(element);
      });
      this.isModalOpen = true;
    }
  }
  setOpen() {
    this.isModalOpen = false;
  }

  scaneMore() {
    this.isModalOpen = false;
    this.scanDoc();
  }

  upload() {
    this.sid = 'scan_' + this.makeid(6);
    for (let i = 0; i <= this.docscaned.length; i++) {
      if (i == this.docscaned.length) {
        this.presentToast();
        this.docscaned = [];
        this.isModalOpen = false;
      }
      else {
        let scanId = 'scan_' + this.makeid(6);
        this.uploadImage(this.docscaned[i], scanId).subscribe();
      }

    }
  }

  uploadImage(ele: any, scanId: string) {
    const formData = new FormData();
    formData.append('filedata', ele);
    let url = `https://app.smartdispatchsystem.com/api/scan2.php?uid=${this.uid}&lid=${this.lid}&filename=${scanId}&sid=${this.sid}`;
    return this.http.post(url, formData);
  }

  remove(i: number) {
    this.docscaned.splice(i, 1);
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'File uploaded successfully',
      duration: 1500,
      position: 'bottom',
    });

    await toast.present();
  }

  makeid(length: any) {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

}
