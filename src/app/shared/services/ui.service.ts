import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable()
export class UiService {
  isLoadingChange = new Subject<boolean>();

  constructor() {
  }
}
