import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from '../user.service';

@Component({
  selector: 'app-workout-list',
  templateUrl: './workout-list.component.html',
  styleUrls: ['./workout-list.component.css'],
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatInputModule, MatSelectModule]
})
export class WorkoutListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['name', 'workouts', 'workoutsNumber', 'totalWorkoutLength'];
  dataSource: MatTableDataSource<any>;
  workoutTypes: string[] = ['Running', 'Cycling', 'Swimming', 'Yoga'];
  pageSizeOptions: number[] = [5, 10, 15, 20];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  nameFilter: string = '';
  workoutTypeFilter: string = '';

  constructor(private userService: UserService) {
    const users = JSON.parse(localStorage.getItem('userData') || '[]');
    this.dataSource = new MatTableDataSource(users);
  }

  ngOnInit(): void {
    this.userService.getUserData().subscribe(users => {
      this.dataSource.data = users;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  calculateTotalMinutes(workouts: any[]): number {
    return workouts.reduce((total, workout) => total + workout.minutes, 0);
  }

  combineWorkoutTypes(workouts: any[]): string {
    return workouts.map(workout => workout.type).join(', ');
  }

  applyFilter(event: Event | any, type: string): void {
    if (type === 'name') {
      this.nameFilter = (event?.target as HTMLInputElement)?.value.trim().toLowerCase() || '';
    } else if (type === 'workoutType') {
      this.workoutTypeFilter = event?.value.toLowerCase() || '';
    }

    this.dataSource.filterPredicate = (data: any, filter: string): boolean => {
      const nameMatch = data.name.toLowerCase().includes(this.nameFilter);
      const workoutTypeMatch = !this.workoutTypeFilter || data.workouts.some((workout: any) => workout.type.toLowerCase() === this.workoutTypeFilter);
      return nameMatch && workoutTypeMatch;
    };

    this.dataSource.filter = `${this.nameFilter}${this.workoutTypeFilter}`;
  }

  onPageSizeChange(event: any): void {
    this.paginator.pageSize = event.value;
    this.paginator._changePageSize(event.value);
  }
}
