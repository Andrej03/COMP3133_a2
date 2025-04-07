// src/app/components/employee-details/employee-details.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { EmployeeService, Employee } from '../../services/employee.service';

interface EmployeeFormControls {
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  email: FormControl<string | null>;
  gender: FormControl<string | null>;
  salary: FormControl<number | null>;
  position: FormControl<string | null>;
  department: FormControl<string | null>;
  joiningDate: FormControl<string | null>;
}

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css']
})
export class EmployeeDetailsComponent implements OnInit {
  employeeId: string | null = null;
  isNewEmployee = false;
  loading = true;
  saving = false;
  error = '';
  employeeForm!: FormGroup<EmployeeFormControls>;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  existingProfilePicture: string | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private employeeService: EmployeeService
  ) {
    this.createForm();
  }
  
  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id');
    this.isNewEmployee = this.employeeId === 'new';
    
    if (!this.isNewEmployee && this.employeeId) {
      this.loadEmployee(this.employeeId);
    } else {
      this.loading = false;
    }
  }
  
  createForm(): void {
    this.employeeForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      gender: [''],
      salary: [0, [Validators.min(0)]],
      position: [''],
      department: [''],
      joiningDate: ['']
    }) as FormGroup<EmployeeFormControls>;
  }
  
  loadEmployee(id: string): void {
    this.employeeService.getEmployeeById(id)
      .subscribe({
        next: (employee) => {
          this.employeeForm.patchValue({
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email,
            gender: employee.gender,
            salary: employee.salary,
            position: employee.position,
            department: employee.department,
            joiningDate: employee.joiningDate ? this.formatDate(employee.joiningDate) : ''
          });
          
          this.existingProfilePicture = employee.profilePicture || null;
          if (this.existingProfilePicture && this.existingProfilePicture !== 'default-profile.jpg') {
            this.previewUrl = `http://localhost:3000/uploads/${this.existingProfilePicture}`;
          }
          
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load employee details';
          this.loading = false;
          console.error(err);
        }
      });
  }
  
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }
  
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      this.previewImage();
    }
  }
  
  previewImage(): void {
    if (!this.selectedFile) return;
    
    const reader = new FileReader();
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
    };
    reader.readAsDataURL(this.selectedFile);
  }
  
onSubmit(): void {
  if (this.employeeForm.invalid) {
    Object.keys(this.employeeForm.controls).forEach(key => {
      const control = this.employeeForm.get(key);
      control?.markAsTouched();
    });
    return;
  }
  
  this.saving = true;
  this.error = '';
  
  const employeeData: Partial<Employee> = {
    ...this.employeeForm.value
  } as Partial<Employee>;
  
  if (this.selectedFile) {
    this.employeeService.uploadProfilePicture(this.selectedFile)
      .subscribe({
        next: (result) => {
          employeeData.profilePicture = result.filename;
          this.saveEmployee(employeeData);
        },
        error: (err) => {
          this.error = 'Failed to upload profile picture';
          this.saving = false;
          console.error(err);
        }
      });
  } else {
    employeeData.profilePicture = this.existingProfilePicture || undefined;
    this.saveEmployee(employeeData);
  }
}

private saveEmployee(employeeData: Partial<Employee>): void {
  if (this.isNewEmployee) {
    this.employeeService.createEmployee(employeeData as Omit<Employee, 'id'>)
      .subscribe({
        next: () => {
          this.router.navigate(['/employees']);
        },
        error: (err) => {
          this.error = 'Failed to create employee';
          this.saving = false;
          console.error(err);
        }
      });
  } else if (this.employeeId) {
    this.employeeService.updateEmployee(this.employeeId, employeeData)
      .subscribe({
        next: () => {
          this.router.navigate(['/employees']);
        },
        error: (err) => {
          this.error = 'Failed to update employee';
          this.saving = false;
          console.error(err);
        }
      });
  }
}
  
  getProfileImageUrl(): string {
    if (this.previewUrl) {
      return this.previewUrl as string;
    }
    return 'assets/default-profile.jpg';
  }
}