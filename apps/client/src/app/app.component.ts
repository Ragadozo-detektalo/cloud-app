import { Component } from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyBQRO6WfRUakxEYmRnatOHvymCPO4dkfJY',
  authDomain: 'ragadozo-detektalo.firebaseapp.com',
  databaseURL:
    'https://ragadozo-detektalo-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'ragadozo-detektalo',
  storageBucket: 'ragadozo-detektalo.appspot.com',
  messagingSenderId: '448134490635',
  appId: '1:448134490635:web:fb5abe49d51efed13d750e',
  measurementId: 'G-0R3C86J0HN',
};

export interface AlertItem {
  date: string;
  time: string;
  animals: string;
}

@Component({
  selector: 'cloud-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private dbRef: firebase.database.Reference;
  todaysString: string;

  dataSource: AlertItem[];
  displayedColumns: string[] = ['date', 'time', 'animals'];

  constructor() {
    const now = new Date();
    this.todaysString = [
      now.getFullYear(),
      now.getMonth() < 9 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1,
      now.getDate() < 10 ? '0' + now.getDate() : now.getDate(),
    ].join('-');

    firebase.initializeApp(firebaseConfig);
    this.fetchPreviousItems();
  }

  fetchPreviousItems() {
    this.dbRef = firebase.database().ref(this.todaysString);
    this.dbRef.once('value', (snapshot) => {
      if (!snapshot.val()) {
        return;
      }

      const rawValues = snapshot.val();
      const timeList = Object.keys(rawValues);
      this.dataSource = timeList.map((time) => ({
        date: this.todaysString,
        time: time.replace('-', ':').replace('-', ':'),
        animals: rawValues[time].join(', '),
      })).reverse();
      this.fetchNewItems();
    });
  }

  fetchNewItems() {
    this.dbRef.limitToLast(1).on('child_added', (snapshot) => {
      this.dataSource = [
        {
          date: this.todaysString,
          time: snapshot.key.replace('-', ':').replace('-', ':'),
          animals: snapshot.val().join(', '),
        },
        ...this.dataSource,
      ];
    });
  }
}
