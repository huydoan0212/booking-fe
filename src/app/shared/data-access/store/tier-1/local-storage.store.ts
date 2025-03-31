import { Injectable } from '@angular/core';
import { NullableString } from '../../interface/nullable-string.interface';
import { signalStore, withState } from '@ngrx/signals';

export interface LocalStorageState {
  // persist or nonPersist base on which key to be cleared after log out
  persist: {
    chosenLang: 0; //not have interface yet
  };
  nonPersist: {
    token: NullableString;
    currentUser: NullableString; //not have model yet
    customerSearch: NullableString; //not have model yet
  };
}

const initialState: LocalStorageState = {
  persist: {
    chosenLang: 0,
  },
  nonPersist: {
    token: null,
    currentUser: null,
    customerSearch: null,
  },
};

export const LocalStorageStore = signalStore(
  { providedIn: 'root' },
  withState(initialState)
);

@Injectable({ providedIn: 'root' })
export class LocalStorage {
  get(key: string) {
    return this.#GetKey<string>(key);
  }
  set(key: string, token: string) {
    this.#SetKey<string>(key, token);
  }
  remove(key: string) {
    this.#RemoveKey(key);
  }
  #GetKey<T>(key: string): T | null {
    if (typeof window === 'undefined') {
      return null;
    }
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  }
  #RemoveKey(key: string) {
    localStorage.removeItem(key);
  }
  #SetKey<T>(key: string, value: T) {
    const jsonValue = JSON.stringify(value);
    localStorage.setItem(key, jsonValue);
  }
}
