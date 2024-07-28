import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'interest-calculator';
  apyForm!: FormGroup;
  yield!: string;


  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.apyForm = this.createApyForm();
  }

  createApyForm() {
    return this.fb.group({
      apy: this.fb.control('', [Validators.required, this.nonNegativeValidator]),
      interestType: this.fb.control('', [Validators.required]),
      capital: this.fb.control('', [Validators.required, this.nonNegativeValidator]),
      interestDuration: this.fb.control('', [Validators.required, this.nonNegativeValidator]),
      interestDurationType: this.fb.control('', Validators.required),
    });
  }

  calculate() {
    const apy = this.apyForm.value['apy'];
    const interestType = this.apyForm.value['interestType'];
    const capital = this.apyForm.value['capital'];
    const interestDuration = this.apyForm.value['interestDuration'];
    const interestDurationType = this.apyForm.value['interestDurationType'];
    console.log(
      apy +
        '\n' +
        interestType +
        '\n' +
        capital +
        '\n' +
        interestDuration +
        '\n' +
        interestDurationType
    );

    let durationInYears = 0;
    switch (interestDurationType) {
      case 'day':
        durationInYears = interestDuration / 365;
        break;
      case 'month':
        durationInYears = interestDuration / 12;
        break;
      case 'year':
        durationInYears = interestDuration;
        break;
    }

    let totalAmount = capital;
    const apyDecimal = apy / 100;

    if (interestType === 'simple') {
      totalAmount = capital * (1 + apyDecimal * durationInYears);
    } else if (interestType === 'compound-d') {
      totalAmount = capital * Math.pow((1 + apyDecimal / 365), 365 * durationInYears);
    } else if (interestType === 'compound-m') {
      totalAmount = capital * Math.pow((1 + apyDecimal / 12), 12 * durationInYears);
    }
    this.yield = (totalAmount-capital).toFixed(2)
    console.log('Total Amount:', totalAmount);
  }

  nonNegativeValidator(control: AbstractControl): ValidationErrors | null {
    return control.value < 0 ? { nonNegative: true } : null;
  }

  isFormInvalid() {
    return this.apyForm.invalid;
  }
}
