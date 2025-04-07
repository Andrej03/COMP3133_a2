import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface SignupFormControls {
  username: FormControl<string | null>;
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  confirmPassword: FormControl<string | null>;
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm!: FormGroup<SignupFormControls>;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.createForm();
  }

  createForm(): void {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    }) as FormGroup<SignupFormControls>;
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password?.value !== confirmPassword?.value) {
      confirmPassword?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      if (confirmPassword?.errors) {
        const { passwordMismatch, ...otherErrors } = confirmPassword.errors;
        confirmPassword.setErrors(Object.keys(otherErrors).length ? otherErrors : null);
      }
      return null;
    }
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    if (this.signupForm.invalid) {
      return;
    }

    this.loading = true;

    const userData = {
      username: this.signupForm.get('username')?.value!,
      email: this.signupForm.get('email')?.value!,
      password: this.signupForm.get('password')?.value!
    };

    this.authService.signup(userData).subscribe({
      next: () => {
        this.router.navigate(['/employees']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Signup failed';
        this.loading = false;
      }
    });
  }
}
