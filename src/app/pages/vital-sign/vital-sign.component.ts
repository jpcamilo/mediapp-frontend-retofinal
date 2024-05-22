import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { MaterialModule } from '../../material/material.module';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { switchMap } from 'rxjs';
import { Patient } from '../../model/patient';
import { PatientService } from '../../services/patient.service';
import { VitalSign } from '../../model/vitaSign';
import { VitalSignsService } from '../../services/vital-signs.service';
import { MatDialog } from '@angular/material/dialog';
import { PatienDialogComponent } from './patien-dialog/patien-dialog.component';

@Component({
  selector: 'app-vital-sign',
  standalone: true,
  imports: [MaterialModule, RouterLink, RouterOutlet],
  templateUrl: './vital-sign.component.html',
  styleUrl: './vital-sign.component.css'
})
export class VitalSignComponent implements OnInit{

  //patients: Patient[];
  dataSource: MatTableDataSource<VitalSign>;
  columnDefinitions = [
    { def: 'idSign', label: 'idSign', hide: true},
    { def: 'patient', label: 'Patient', hide: false},
    { def: 'date', label: 'Date', hide: false},
    { def: 'temperature', label: 'Temperature', hide: false},
    { def: 'pulse', label: 'Pulse', hide: false},
    { def: 'rateRespiratory', label: 'Rate Respiratory', hide: false},
    { def: 'actions', label: 'actions', hide: false}
  ]

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  totalElements: number = 0;

  constructor(
    private vitalSignService: VitalSignsService,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute
    ) {}

  ngOnInit(): void {
    /*this.patientService.findAll().subscribe((data) => {
      this.createTable(data);
    });*/

    this.vitalSignService.listPageable(0, 2).subscribe(data => {
      this.totalElements = data.totalElements;
      this.createTable(data.content);
    });

    this.vitalSignService.getSignChange().subscribe((data) => {
      this.createTable(data);
    });

    this.vitalSignService.getMessageChange().subscribe(data => {
      this._snackBar.open(data, 'INFO', {duration: 2000, verticalPosition: 'top', horizontalPosition: 'right'});
    })
  }

  delete(idSign: number){
    this.vitalSignService.delete(idSign)
    .pipe(switchMap( ()=> this.vitalSignService.findAll() ))
    .subscribe(data => {
      this.vitalSignService.setSignChange(data);
      this.vitalSignService.setMessageChange('DELETED!');
    })
  }

  createTable(data: VitalSign[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
  }

  getDisplayedColumns():string[] {
    return this.columnDefinitions.filter(cd=>!cd.hide).map(cd=>cd.def);
  }

  applyFilter(e: any){
    this.dataSource.filter = e.target.value.trim().toLowerCase();
    this.dataSource.filterPredicate = (data: VitalSign, filter: string) => 
    {
      if (data.patient.firstName.toLowerCase().includes(filter) || data.patient.lastName.toLowerCase().includes(filter)
      || data.date.includes(filter) || data.pulse.includes(filter) || data.rateRespiratory.includes(filter) || data.temperature.includes(filter)) 
      {
        return true;
      } else {
        return false;
      };
    }
  }

  showMore(e: any){
    this.vitalSignService.listPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.totalElements = data.totalElements;
      this.createTable(data.content);
    });
  }
  
  checkChildren(): boolean{
    return this.route.children.length > 0;
  }  


}
