import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Harvest } from '../../_models/harvest'

@Injectable({
  providedIn: 'root'
})
export class HarvestService {

  private harvestCollection: AngularFirestoreCollection<Harvest>;
  private harvestDoc: AngularFirestoreDocument<Harvest>;
  private harvests: Observable<Harvest[]>;
  constructor(
    public afs: AngularFirestore
  ) {
    this.harvestCollection = afs.collection<Harvest>('category');
    this.harvests = this.harvestCollection.valueChanges();
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
}
