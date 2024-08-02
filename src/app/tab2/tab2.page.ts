import { Component, OnInit } from '@angular/core';
import { DocumentScanner, ResponseType } from 'capacitor-document-scanner'
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { AlertController, LoadingController, Platform, ToastController } from '@ionic/angular';
const IMAGE_DIR = 'stored-images';
interface LocalFile {
  filename: string;
  path: string;
  data: string;
}
import { Share } from '@capacitor/share';
/* import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as pdfMake from 'pdfmake/build/pdfmake'; */
import { style } from '@angular/animations';
import { DomSanitizer } from '@angular/platform-browser';
import { Capacitor } from '@capacitor/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  scannedImages: any[] = [];
  isModalOpen: boolean = false;
  docscaned: any[] = [];
  images: LocalFile[] = [];
  srcFile: any;

  imageUrls: string[] = [];
  grayscaleImageUrls: string[] = [];
  guestId: any;
  uid: any;
  sid: any;
  constructor(private loadingCtrl: LoadingController,
    private toaster: ToastController,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    public platform: Platform,
    private alertController: AlertController) {
    /* (<any>pdfMake).vfs = pdfFonts.pdfMake.vfs; */
  }



  async ngOnInit() {
    this.loadFiles();
  }

  ionViewWillEnter() {
    this.guestId = localStorage.getItem('guestId');
    this.uid = localStorage.getItem("loginid");
  }

  async loadFiles() {
    this.images = [];
    const loading = await this.loadingCtrl.create({
      message: 'Loading data...'
    });
    await loading.present();
    this.http.get(`https://app.smartdispatchsystem.com/api/driver-guestscanlist.php?uid=${this.uid}&guestid=${this.guestId}&device=${this.platform.is('ios') ? 'ios' : 'android'}`).subscribe((res: any) => {
      console.log(res);
      if (res) {
        this.images = res;
        loading.dismiss();
      }
    })


    /* Filesystem.readdir({
      path: IMAGE_DIR,
      directory: Directory.Documents
    })
      .then(
        (result) => {
          this.loadFileData(result.files.map((x) => x.name));
        },
        async (err) => {
          // Folder does not yet exists!
          await Filesystem.mkdir({
            path: IMAGE_DIR,
            directory: Directory.Documents
          });
        }
      )
      .then((_) => {
        loading.dismiss();
      }); */
  }


  /* async loadFileData(fileNames: string[]) {
    for (let f of fileNames) {
      const filePath = `${IMAGE_DIR}/${f}`;
      const readFile = await Filesystem.readFile({
        path: filePath,
        directory: Directory.Documents
      });

      this.images.push({
        name: f,
        path: filePath,
        data: `${readFile.data}`
      });
    }
  } */

  async scanDoc() {
    this.docscaned = [];
    this.sid = 'scan_' + this.makeid(6);
    let scannedImages: any = await DocumentScanner.scanDocument({ responseType: ResponseType.Base64 })
    console.log('get back an array with scanned image file paths', scannedImages.scannedImages);
    if (scannedImages.scannedImages && scannedImages.scannedImages.length > 0) {
      // for upload in server
      for (let i = 0; i < scannedImages.scannedImages.length; i++) {
        this.uploadImage(scannedImages.scannedImages[i]).then(res => {
          console.log('ressss', res);
        });
        this.loadFiles();
      }

      /* scannedImages.scannedImages.forEach((element: any, index: any) => {
        let ele = 'data:image/jpeg;base64,' + element;
        this.docscaned.push(ele);
        this.imageUrls.push(ele);

      });
      this.convertToGrayscale(this.imageUrls).then(
        (result) => {
          this.grayscaleImageUrls = result;
          this.saveImage();
        }) */


    }
  }
  uploadImage(ele: string): Promise<string> {
    console.log('ele ele ele ele', ele);
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('filedata', ele);
      let url = `https://app.smartdispatchsystem.com/api/driver-convertmc.php?guestid=${this.guestId}&uid=${this.uid}&sid=${this.sid}`;
      this.http.post(url, formData).subscribe((res: any) => {
        if (res) {
          console.log(res);
          resolve(res.status);
        }
      })
    })
  }

  /* async saveImage() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading data...'
    });
    await loading.present();
    const documentDefinition: any = this.getDocumentDefinition();
    console.log('documentDefinition', documentDefinition);
    pdfMake.createPdf(documentDefinition).getBase64(async res => {
      console.log('res generate pdf', res);
      const fileName = new Date().getTime() + '.pdf';
      const savedImage = await Filesystem.writeFile({
        path: `${IMAGE_DIR}/${fileName}`,
        data: res,
        directory: Directory.Documents
      });
      this.images.unshift({
        name: fileName,
        path: `${IMAGE_DIR}/${fileName}`,
        data: res
      });
      const toast = await this.toaster.create({
        message: 'Pdf saved!',
        duration: 1500,
        position: 'bottom',
      });

      await toast.present();
      this.loadingCtrl.dismiss();
      return savedImage;
    });
  } */

  async deleteImage(file: LocalFile) {
    /* await Filesystem.deleteFile({
      directory: Directory.Documents,
      path: file.path
    }); */
    const alert = await this.alertController.create({
      message: 'Are you sure want to delete?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Alert canceled');
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            let url = `https://app.smartdispatchsystem.com/api/driver-docdel.php?filename=${file.filename}&guestid=${this.guestId}`;
            this.http.get(url).subscribe((res: any) => {
              if (res.status == 'success') {
                this.loadFiles();
              }
            })
          },
        },
      ],
    });

    await alert.present();




  }

  async viewImage(file: any) {
    /* const fileUri: any = await Filesystem.getUri({
      directory: Directory.Documents,
      path: IMAGE_DIR + '/' + file.name
    });
    let uri: string = fileUri.uri;
    const fileOpenerOptions: FileOpenerOptions = {
      filePath: uri,
      contentType: 'application/pdf',
      openWithDefault: true,
    };
    await FileOpener.open(fileOpenerOptions); */


    window.open(file.path, '_blank'); //load from server
  }

  setOpen() {
    this.isModalOpen = false;
  }

  async share(file: any) {
    /* const fileUri: any = await Filesystem.getUri({
      directory: Directory.Documents,
      path: IMAGE_DIR + '/' + file.name
    });
    let uri: string = fileUri.uri; */
    Share.share({
      title: file.name,
      url: file.path,
    });
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

  getDocumentDefinition() {
    let filesData: any[] = [];
    let footerImage = 'data:image/jpeg;base64,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';
    let date = this.formatDate(new Date());
    for (let i = 0; i < this.grayscaleImageUrls.length; i++) {
      console.log('this.grayscaleImageUrls[i],', this.grayscaleImageUrls[i]);
      filesData.push({
        image: this.grayscaleImageUrls[i],
        width: 500, // Adjust width as needed
        //height: 300,
        margin: [0, 0, 10, 0]
      });
    }
    if (filesData && filesData.length > 0) {
      return {
        footer: function (currentPage: any, pageCount: any) {
          return {
            table: {
              widths: ['*', '*', '*'],
              body: [
                [
                  { text: date, alignment: 'left', margin: [10, 10, 0, 0] },
                  { image: footerImage, alignment: 'center', width: '100' },
                  { text: "Page -" + currentPage.toString(), alignment: 'right', margin: [0, 5, 10, 0] }
                ],
                [
                  { text: `Page - ${currentPage} of ${pageCount}`, colSpan: 3, alignment: 'right' }
                ]
              ]
            },
            layout: 'noBorders'  // Optional: adds lines between columns
          };
        },
        content: filesData,
        info: {
          title: 'sdsdriver' + '_pdf',
          author: 'sdsdriver',
          subject: 'sdsdriver',
          keywords: 'sdsdriver, online pdf',
        },
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            color: 'black' // Ensure text is black
          },
          normal: {
            fontSize: 12,
            color: 'black' // Ensure text is black
          }
        }
      };
    }
  }

  formatDate(date: any) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  /*  convertToGrayscale(imageUrls: string[]): Promise<string[]> {
     const promises = imageUrls.map(imageUrl => this.convertSingleToGrayscale(imageUrl));
     return Promise.all(promises);
   } */


  /* convertSingleToGrayscale(imageUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous'; // This is necessary if the image is from a different domain
      img.src = imageUrl;

      img.onload = () => {
        var canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        
        canvas.width = img.width;
        canvas.height = img.height;
        if (ctx) {
          ctx.fillStyle = 'transparent'
          ctx.drawImage(img, 0, 0);
          var imageData = ctx.getImageData(0, 0, img.width, img.height);
          for (var i = 0; i < imageData.data.length; i += 4) {
            // var avg = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
            const avg = 0.299 * imageData.data[i] + 0.587 * imageData.data[i + 1] + 0.114 * imageData.data[i + 2];
            imageData.data[i] = avg;
            imageData.data[i + 1] = avg;
            imageData.data[i + 2] = avg;
            imageData.data[i + 3] = 245;

          }
          ctx.putImageData(imageData, 0, 0, 0, 0, imageData.width, imageData.height);
          resolve(canvas.toDataURL('image/png'));
        } else {
          reject('Canvas context not available');
        }
      };

      img.onerror = () => {
        reject('Failed to load image');
      };
    });
  } */


}

