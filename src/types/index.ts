export interface Activity {
  url: string;
  time: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  verified: string;
  role: 'student' | 'coordinator' | 'admin';
  token: string;
  tracking: boolean;
}

export interface Course {
  id: string;
  name: string;
}

export interface Exam {
  id: string;
  label: string;
  course: Course;
  startDate: Date;
  endDate: Date;
}
