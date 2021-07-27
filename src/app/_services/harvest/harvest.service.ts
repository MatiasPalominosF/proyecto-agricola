import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RegisterUser } from 'src/app/_models/register-user';
import { Harvest } from '../../_models/harvest';
import { RegisterHarvest } from '../../_models/register-harvest';

@Injectable({
  providedIn: 'root'
})
export class HarvestService {

  private harvestCollection: AngularFirestoreCollection<Harvest>;
  private harvestDoc: AngularFirestoreDocument<Harvest>;
  private harvests: Observable<Harvest[]>;
  private registerHarvests: Observable<RegisterHarvest[]>;
  private registerUsers: Observable<RegisterUser[]>;
  constructor(
    public afs: AngularFirestore
  ) {
    this.harvestCollection = afs.collection<Harvest>('category');
    this.harvests = this.harvestCollection.valueChanges();
    this.registerHarvests = this.harvestCollection.valueChanges();
  }

  getFullInfoHarvest(): Observable<Harvest[]> {
    return this.harvests = this.afs.collection<Harvest>('category')
      .snapshotChanges()
      .pipe(map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as Harvest;
          data.id = action.payload.doc.id;
          return data;
        });
      }));
  }

  getFullInHarvest() {
    return this.afs.firestore.collection('category').get();
  }

  getFullInfoRegisterHarvest(id: string): Observable<RegisterHarvest[]> {
    return this.registerHarvests = this.afs.collection('category').doc(`${id}`).collection<RegisterHarvest>('registers')
      .snapshotChanges()
      .pipe(map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as RegisterHarvest;
          data.id = action.payload.doc.id;
          return data;
        });
      }));
  }

  getFullInfoRegisterUser(category: string, idUser: string): Observable<RegisterUser[]> {
    return this.registerUsers = this.afs.collection('category').doc(`${category}`).collection('registers').doc(`${idUser}`).collection<RegisterUser>('workerRegisters', ref => ref.where('category', '==', `${category}`))
      .snapshotChanges()
      .pipe(map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as RegisterUser;
          data.id = action.payload.doc.id;
          return data;
        });
      }));
  }
}
