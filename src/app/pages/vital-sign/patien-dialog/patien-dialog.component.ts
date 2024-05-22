import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material/material.module';
import { Patient } from '../../../model/patient';
import { PatientService } from '../../../services/patient.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { switchMap } from 'rxjs';
import { SignEditComponent } from '../sign-edit/sign-edit.component';
import { VitalSignsService } from '../../../services/vital-signs.service';

@Component({
  selector: 'app-patien-dialog',
  standalone: true,
  imports: [MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './patien-dialog.component.html',
  styleUrl: './patien-dialog.component.css'
})
export class PatienDialogComponent implements OnInit {

  patient: Patient;
  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Patient,
    private _dialogRef: MatDialogRef<SignEditComponent>,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    //this.patient = { ...this.data }; //spread operator
    this.form = new FormGroup({
      idPatient: new FormControl(0),
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      dni: new FormControl(''),
      address: new FormControl(''),
      phone: new FormControl(''),
      email: new FormControl(''),
    });
  }

  close() {
    this._dialogRef.close();
  }

  operate() {
    const patient: Patient = new Patient();
    patient.idPatient = this.form.value['idPatient'];
    //const x = this.form.controls['idPatient'].value;
    //const y = this.form.get('idPatient').value;
    patient.firstName = this.form.value['firstName'];
    patient.lastName = this.form.value['lastName'];
    patient.dni = this.form.value['dni'];
    patient.address = this.form.value['address'];
    patient.phone = this.form.value['phone'];
    patient.email = this.form.value['email']
      //INSERT
      this.patientService
        .save(patient)
        .pipe(switchMap(() => this.patientService.findAll()))
        .subscribe((data) => {
          this.patientService.setPatientChange(data);
          this.patientService.setMessageChange('CREATED!');
        });
    
    this.close();
  }

}
