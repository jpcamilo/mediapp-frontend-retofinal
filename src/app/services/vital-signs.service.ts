import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { VitalSign } from '../model/vitaSign';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class VitalSignsService extends GenericService<VitalSign>{

  private signChange: Subject<VitalSign[]> = new Subject<VitalSign[]>();
  private messageChange: Subject<string> = new Subject<string>();

  constructor(protected override http: HttpClient){
    super(http, `${environment.HOST}/signs`)
  }

  listPageable(p: number, s: number){
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }

  setSignChange(data: VitalSign[]){
    this.signChange.next(data);
  }

  getSignChange(){
    return this.signChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}
