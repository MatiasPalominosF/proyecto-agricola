import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserInterface } from '../../_models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usersCollection: AngularFirestoreCollection<UserInterface>;
  private users: Observable<UserInterface[]>;
  private userDoc: AngularFirestoreDocument<UserInterface>;
  private user: Observable<UserInterface>;

  constructor(private afs: AngularFirestore) {
    this.usersCollection = afs.collection<UserInterface>('users');
    this.users = this.usersCollection.valueChanges();
  }

  getUsers() {
    return this.afs.collection('users').snapshotChanges(); // use only for login.
  }

  getUsersCompany(): Observable<UserInterface[]> {
    return this.users = this.afs.collection<UserInterface>('users', ref => ref.where('rol', '==', 'company'))
      .snapshotChanges()
      .pipe(map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as UserInterface;
          data.uid = action.payload.doc.id;
          return data;
        });
      }));
  }

  getAllUsers(cuid: string, uid: string): Observable<UserInterface[]> {
    return this.users = this.afs.collection<UserInterface>('users', ref => ref.where('uid', '!=', uid).where('cuid', '==', `${cuid}`))
      .snapshotChanges()
      .pipe(map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as UserInterface;
          data.uid = action.payload.doc.id;
          return data;
        });
      }));
  }

  createUser(user): Promise<void> {
    return firebase.firestore().collection("users").doc(user.uid).set(user);
  }

  updateUser(user: UserInterface): Promise<void> {
    this.userDoc = this.afs.collection<UserInterface>("users").doc(user.uid);
    return this.userDoc.update(user);
  }

  getOneUser(userId: string): Observable<UserInterface> {
    this.userDoc = this.afs.doc<UserInterface>(`users/${userId}`);
    return this.user = this.userDoc.snapshotChanges().pipe(map(action => {
      if (action.payload.exists === false) {
        return null;
      } else {
        const data = action.payload.data() as UserInterface;
        data.uid = action.payload.id;
        return data;
      }
    }));
  }

  async getUserToGuard(userId: string): Promise<firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>> {
    return await this.afs.firestore.collection('users').doc(userId).get();
  }

}
