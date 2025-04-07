// src/app/components/employee-list/employee-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EmployeeService, Employee } from '../../services/employee.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  loading = true;
  error = '';
  
  constructor(private employeeService: EmployeeService) { }
  
  ngOnInit(): void {
    this.loadEmployees();
  }
  
  loadEmployees(): void {
    this.loading = true;
    this.employeeService.getAllEmployees()
      .subscribe({
        next: (data) => {
          this.employees = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load employees';
          this.loading = false;
          console.error(err);
        }
      });
  }
  
  deleteEmployee(id: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id)
        .subscribe({
          next: () => {
            this.employees = this.employees.filter(employee => employee.id !== id);
          },
          error: (err) => {
            this.error = 'Failed to delete employee';
            console.error(err);
          }
        });
    }
  }
}