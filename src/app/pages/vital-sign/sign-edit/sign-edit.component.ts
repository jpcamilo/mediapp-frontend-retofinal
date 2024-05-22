import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MaterialModule } from '../../../material/material.module';
import { PatientService } from '../../../services/patient.service';
import { VitalSignsService } from '../../../services/vital-signs.service';
import { switchMap } from 'rxjs';
import { VitalSign } from '../../../model/vitaSign';
import { Patient } from '../../../model/patient';
import { format, formatISO } from 'date-fns';
import { MatDialog } from '@angular/material/dialog';
import { PatienDialogComponent } from '../patien-dialog/patien-dialog.component';

@Component({
  selector: 'app-sign-edit',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, RouterLink],
  templateUrl: './sign-edit.component.html',
  styleUrl: './sign-edit.component.css'
})
export class SignEditComponent implements OnInit {

  form: FormGroup;
  id: number;
  isEdit: boolean;
  patients: Patient[];
  patienSelected : Patient;
  dateTmp:Date ;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vitalSignService: VitalSignsService,
    private patientService: PatientService,
    private _dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      idSign: new FormControl(0),
      patient: new FormControl(),
      date: new FormControl(new Date()),
      temperature: new FormControl(''),
      pulse: new FormControl(''),
      rateRespiratory: new FormControl(''),
    });

    this.route.params.subscribe(data => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();      
    });
  }

  initForm() {
    this.patientService.findAll().subscribe(data => this.patients = data);    
    if (this.isEdit) {
      this.vitalSignService.findById(this.id).subscribe(data => {
        const indexPatient = this.patients.findIndex(
           (patientmp: Patient) => patientmp.dni === data.patient.dni);
        this.dateTmp = new Date(data.date);
        this.dateTmp.setDate(this.dateTmp.getDate() + 1);

        this.form = new FormGroup({
          idSign: new FormControl(data.idSign),
          patient: new FormControl(this.patients[indexPatient]),          
          date: new FormControl(this.dateTmp),
          temperature: new FormControl(data.temperature),
          pulse: new FormControl(data.pulse),
          rateRespiratory: new FormControl(data.rateRespiratory),
        })
      });
      
    }
  }


  operate() {
    const sign: VitalSign = new VitalSign();
    sign.idSign = this.form.value['idSign'];
    sign.patient = this.form.value['patient'];
    sign.date = format(this.form.value['date'], "yyyy-MM-dd'T'HH:mm:ss");
    sign.temperature = this.form.value['temperature'];
    sign.pulse = this.form.value['pulse'];
    sign.rateRespiratory = this.form.value['rateRespiratory'];



    if (this.isEdit) {
      //UPDATE
      //PRACTICA COMUN - NO IDEAL
      this.vitalSignService.update(this.id, sign)
        .pipe(switchMap(() => this.vitalSignService.findAll()))
        .subscribe(data => {
          this.vitalSignService.setSignChange(data);
          this.vitalSignService.setMessageChange('UPDATED!');
        });
    } else {
      //INSERT
      //PRACTICA IDEAL
      this.vitalSignService.save(sign)
        .pipe(switchMap(() => this.vitalSignService.findAll()))
        .subscribe(data => {
          this.vitalSignService.setSignChange(data);
          this.vitalSignService.setMessageChange('CREATED!');
        });
    }

    this.router.navigate(['/pages/sign']);
  }

  openDialog(){
    this._dialog.open(PatienDialogComponent, {
      width: '350px',
      disableClose: false
    });

    this._dialog.afterAllClosed.subscribe(data =>{
      this.patientService.findAll().subscribe(data => this.patients = data);
    });
  }


}
