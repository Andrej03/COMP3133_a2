// src/app/services/employee.service.ts
import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Use the same Employee interface as in your mock service
export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender?: string;
  salary?: number;
  position?: string;
  department?: string;
  joiningDate?: string;
  profilePicture?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  constructor(private apollo: Apollo) {}

  // Fetch all employees
  getAllEmployees(): Observable<Employee[]> {
    const GET_ALL_EMPLOYEES_QUERY = gql`
      query GetAllEmployees {
        employees {
          id
          firstName
          lastName
          email
          gender
          salary
          position
          department
          joiningDate
          profilePicture
        }
      }
    `;
    return this.apollo.watchQuery<{ employees: Employee[] }>({
      query: GET_ALL_EMPLOYEES_QUERY
    }).valueChanges.pipe(
      map(result => result.data.employees)
    );
  }

  // Fetch a single employee by id
  getEmployeeById(id: string): Observable<Employee> {
    const GET_EMPLOYEE_QUERY = gql`
      query GetEmployee($id: ID!) {
        employee(id: $id) {
          id
          firstName
          lastName
          email
          gender
          salary
          position
          department
          joiningDate
          profilePicture
        }
      }
    `;
    return this.apollo.watchQuery<{ employee: Employee }>({
      query: GET_EMPLOYEE_QUERY,
      variables: { id }
    }).valueChanges.pipe(
      map(result => result.data.employee)
    );
  }

  // Create a new employee. Expect an employee object without the id.
  createEmployee(employee: Omit<Employee, 'id'>): Observable<Employee> {
    const CREATE_EMPLOYEE_MUTATION = gql`
      mutation CreateEmployee(
        $firstName: String!, 
        $lastName: String!, 
        $email: String!, 
        $gender: String, 
        $salary: Float, 
        $position: String, 
        $department: String, 
        $joiningDate: String
      ) {
        createEmployee(
          firstName: $firstName,
          lastName: $lastName,
          email: $email,
          gender: $gender,
          salary: $salary,
          position: $position,
          department: $department,
          joiningDate: $joiningDate
        ) {
          id
          firstName
          lastName
          email
          gender
          salary
          position
          department
          joiningDate
          profilePicture
        }
      }
    `;
    return this.apollo.mutate<{ createEmployee: Employee }>({
      mutation: CREATE_EMPLOYEE_MUTATION,
      // Ensure the variables match your GraphQL mutation’s expected parameters.
      variables: employee
    }).pipe(
      map(result => result.data!.createEmployee)
    );
  }

  // Update an existing employee (using a partial update object)
  updateEmployee(id: string, employee: Partial<Employee>): Observable<Employee> {
    // Assumes a GraphQL input type "EmployeeUpdateInput" exists
    const UPDATE_EMPLOYEE_MUTATION = gql`
      mutation UpdateEmployee($id: ID!, $employee: EmployeeUpdateInput!) {
        updateEmployee(id: $id, employee: $employee) {
          id
          firstName
          lastName
          email
          gender
          salary
          position
          department
          joiningDate
          profilePicture
        }
      }
    `;
    return this.apollo.mutate<{ updateEmployee: Employee }>({
      mutation: UPDATE_EMPLOYEE_MUTATION,
      variables: { id, employee }
    }).pipe(
      map(result => result.data!.updateEmployee)
    );
  }

  // Delete an employee by id; returns true if deletion was successful.
  deleteEmployee(id: string): Observable<boolean> {
    const DELETE_EMPLOYEE_MUTATION = gql`
      mutation DeleteEmployee($id: ID!) {
        deleteEmployee(id: $id)
      }
    `;
    return this.apollo.mutate<{ deleteEmployee: boolean }>({
      mutation: DELETE_EMPLOYEE_MUTATION,
      variables: { id }
    }).pipe(
      map(result => result.data!.deleteEmployee)
    );
  }

  // Upload a profile picture. Assumes your GraphQL server supports file uploads.
  uploadProfilePicture(file: File): Observable<{ filename: string }> {
    const UPLOAD_PROFILE_PICTURE_MUTATION = gql`
      mutation UploadProfilePicture($file: Upload!) {
        uploadProfilePicture(file: $file) {
          filename
        }
      }
    `;
    return this.apollo.mutate<{ uploadProfilePicture: { filename: string } }>({
      mutation: UPLOAD_PROFILE_PICTURE_MUTATION,
      variables: { file }
    }).pipe(
      map(result => result.data!.uploadProfilePicture)
    );
  }
}
