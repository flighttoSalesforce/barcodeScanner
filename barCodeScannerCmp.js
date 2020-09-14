import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getBarcodeScanner } from 'lightning/mobileCapabilities';

export default class BarCodeScannerCmp extends LightningElement {
    myScanner;
    scanButtonDisabled = false;
    scannedBarcode = '';
    connectedCallback() {
        this.myScanner = getBarcodeScanner();
        if (this.myScanner == null || !this.myScanner.isAvailable()) {
            this.scanButtonDisabled = true;
        }
    }

    handleBeginScanClick(event) {
        this.scannedBarcode = '';
        if (this.myScanner != null && this.myScanner.isAvailable()) {
            const scanningOptions = {
                barcodeTypes: [this.myScanner.barcodeTypes.QR]
            };
            this.myScanner.beginCapture(scanningOptions).then((result) => {
                    this.scannedBarcode = decodeURIComponent(result.value);
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Successful Scan',
                            message: 'Barcode scanned successfully.',
                            variant: 'success'
                        })
                    );
                }).catch((error) => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Barcode Scanner Error',
                            message:
                                'There was a problem scanning the barcode: ' +
                                JSON.stringify(error) +
                                ' Please try again.',
                            variant: 'error',
                            mode: 'sticky'
                        })
                    );
                }).finally(() => {
                    this.myScanner.endCapture();
                });
        }else{
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Barcode Scanner Is Not Available',
                    message:
                        'Try again from the Salesforce app on a mobile device.',
                    variant: 'error'
                })
            );
        }
    }
}