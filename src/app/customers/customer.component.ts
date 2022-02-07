import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidatorFn,
} from '@angular/forms';

import { Customer } from './customer';

function emailMatcherValidator(
  control: AbstractControl
): { [key: string]: boolean } | null {
  const emailControl = control.get('email');
  const confirmControl = control.get('confirmEmail');
  const emailsAreEqual = emailControl!.value === confirmControl!.value;

  const emailsNotTouched = emailControl!.pristine || confirmControl!.pristine;

  if (emailsNotTouched) {
    return null;
  }

  if (emailsAreEqual) {
    return null;
  }

  return { match: true };
}

// if it was reused in another classes, it is indicated to add the function into a single file
function ratingRangeValidator(minRange: number, maxRange: number): ValidatorFn {
  return (range: AbstractControl): { [key: string]: boolean } | null => {
    const notNull = range.value !== null;
    const isInvalidRange =
      isNaN(range.value) || range.value < minRange || range.value > maxRange;

    if (notNull && isInvalidRange) {
      return { range: true }; // validation name
    }

    return null; // if valid
  };
}

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
})
export class CustomerComponent implements OnInit {
  customerForm!: FormGroup;
  customer = new Customer();
  emailMessage: string = '';

  private validationEmailMessages = {
    required: 'Please enter your email address.',
    email: 'Please enter a valid email address.',
  };

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    //root form group
    this.customerForm = this.formBuilder.group({
      firstname: ['', [Validators.required, Validators.minLength(3)]],
      lastname: ['', [Validators.required, Validators.maxLength(50)]],
      //nested form group
      emailGroup: this.formBuilder.group(
        {
          email: ['', [Validators.required, Validators.email]],
          confirmEmail: ['', Validators.required],
        },
        { validator: emailMatcherValidator }
      ),
      phone: '',
      notification: 'email',
      rating: [null, ratingRangeValidator(1, 5)],
      sendCatalog: true,
    });

    this.customerForm
      .get('notification')!
      .valueChanges.subscribe((value: string) => {
        this.setNotification(value);
      });

    const emailControl = this.customerForm.get('emailGroup.email')!;
    emailControl!.valueChanges.subscribe((value: string) => {
      this.setMessage(emailControl);
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

  setMessage(c: AbstractControl): void {
    this.emailMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      this.emailMessage = Object.keys(c.errors)
        .map((key) => this.validationEmailMessages[key])
        .join(' ');
    }
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
