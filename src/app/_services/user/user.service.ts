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

  constructor(private firestore: AngularFirestore) {
    this.usersCollection = firestore.collection<UserInterface>('users');
    this.users = this.usersCollection.valueChanges();
  }

  getUsers() {
    return this.firestore.collection('users').snapshotChanges(); // use only for login.
  }

  createUser(user) {
    return firebase.firestore().collection("users").doc(user.uid).set(user);
  }

  getOneUser(userId: string) {
    this.userDoc = this.firestore.doc<UserInterface>(`users/${userId}`);
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

}
