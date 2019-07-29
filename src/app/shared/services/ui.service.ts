import {Injectable} from '@angular/core';
import {Subject, Subscription} from 'rxjs';

@Injectable()
export class UiService {
  isLoadingChange = new Subject<boolean>();
  isNewLoadingChage: Subscription;

  constructor() {
  }
}
