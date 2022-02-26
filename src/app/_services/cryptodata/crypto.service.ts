import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { UserInterface } from 'src/app/_models/user';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private encryptSecretKey: string;
  constructor() {
    this.encryptSecretKey = '4bYb7PT:f*-X+:i9=UFt';
  }

  encryptData(data): string {
    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), this.encryptSecretKey).toString();
    } catch (e) {
      console.log(e);
    }
  }

  decryptData(data): UserInterface {
    try {
      const bytes = CryptoJS.AES.decrypt(data, this.encryptSecretKey);
      if (bytes.toString()) {
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8)) as UserInterface;
      }
      return data;
    } catch (e) {
      console.log(e);
    }
  }

  setInfoStorage(data) {
    if (data) {
      localStorage.setItem('contract', data);
    }
  }
}
