import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Customer } from './customer';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
})
export class CustomerComponent implements OnInit {
  customerForm!: FormGroup;
  customer = new Customer();

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.customerForm = this.formBuilder.group({
      firstname: ['', [Validators.required, Validators.minLength(3)]],
      lastname: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      phone: '',
      notification: 'email',
      sendCatalog: true,
    });
  }

  save(): void {
    console.log(this.customerForm);
    console.log('Saved: ' + JSON.stringify(this.customerForm.value));
  }

  populateTestData(): void {
    this.customerForm.patchValue({
      firstname: 'João',
      lastname: 'Bispo',
      sendCatalog: false,
    });
  }

  setNotification(notifyVia: string): void {
    const phoneControl = this.customerForm.get('phone');
    const notifyViaText = notifyVia === 'text';

    if (notifyViaText) {
      phoneControl?.setValidators(Validators.required);
    } else {
      phoneControl?.clearValidators();
    }

    phoneControl?.updateValueAndValidity();
  }
}
