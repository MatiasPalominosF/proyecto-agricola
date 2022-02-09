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
    return this.harvests = this.afs.collection<Harvest>('category', ref => ref.orderBy('dateEnd'))
      .snapshotChanges()
      .pipe(map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as Harvest;
          data.id = action.payload.doc.id;
          return data;
        });
      }));
  }

  test(uid: string, idCategory: string): Observable<RegisterHarvest[]> {
    return this.registerHarvests = this.afs.collection('category', ref => ref.where('uid', '==', `${uid}`)).doc(`${idCategory}`)
      .collection<RegisterHarvest>('registers')
      .snapshotChanges()
      .pipe(map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as RegisterHarvest;
          data.id = action.payload.doc.id;
          return data;
        });
      }));
  }

  getFullInfoHarvestWithUid(uid: string): Observable<Harvest[]> {
    return this.harvests = this.afs.collection<Harvest>('category', ref => ref.where('cuid', '==', `${uid}`).orderBy('dateEnd'))
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

  getFullInfoRegisterHarvestWithUid(uid: string, id: string): Observable<RegisterHarvest[]> {
    return this.registerHarvests = this.afs.collection('category', ref => ref.where('cuid', '==', `${uid}`)).doc(`${id}`).collection<RegisterHarvest>('registers')
      .snapshotChanges()
      .pipe(map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as RegisterHarvest;
          data.id = action.payload.doc.id;
          return data;
        });
      }));
  }


  getFullInfoRegisterHarvestCondition2(idCategory: string, idUser: string, dateInit: Date, dateEnd: Date) {
    return this.afs.firestore.collection('category').doc(`${idCategory}`).collection('registers').doc(`${idUser}`)
      .collection('workerRegisters').where('category', '==', `${idCategory}`)
      .where('date', '>=', dateInit)
      .where('date', '<', dateEnd).get();
  }

  getFullInfoRegisterHarvestCondition(idCategory: string, idUser: string, dateInit: Date, dateEnd: Date): Observable<RegisterUser[]> {
    return this.registerHarvests = this.afs.collection('category').doc(`${idCategory}`).collection('registers').doc(`${idUser}`)
      .collection<RegisterUser>('workerRegisters', ref => ref
        .where('category', '==', `${idCategory}`)
        .where('date', '>=', dateInit)
        .where('date', '<=', dateEnd))
      .snapshotChanges()
      .pipe(map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as RegisterUser;
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

  async deleteProduct(idCategory: string, idUser: string, idRegister: string) {
    /*this.afs.collection('category').doc(`${idCategory}`).collection('registers').doc(`${idUser}`).collection<RegisterUser>('workerRegisters').doc(`${idRegister}`);
    return await this.harvestDoc.delete();*/
    console.log("Si entra");
    this.harvestDoc = this.afs.collection('category').doc(`${idCategory}`).collection('registers').doc(`${idUser}`).collection<RegisterUser>('workerRegisters').doc(`${idRegister}`);
    this.harvestDoc.delete();
  }

  updateFieldInRegisterUsers(idCategory: string, idUser: string, acumulate: number) {
    this.afs.collection('category').doc(`${idCategory}`).collection('registers').doc(`${idUser}`).update({ "acumulate": acumulate });
  }

  updateFieldInRegisters(idCategory: string, idUser: string, idRegister: string, weight: number) {
    this.afs.collection('category').doc(`${idCategory}`).collection('registers').doc(`${idUser}`).collection('workerRegisters').doc(`${idRegister}`).update({ "weight": weight });
  }

  addNewProduct(harvest: Harvest) {
    let id = this.afs.createId();
    harvest.dateEnd = null;
    harvest.id = id;
    this.afs.collection<Harvest>('category').doc(id).set(harvest);
  }
}
