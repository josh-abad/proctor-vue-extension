export interface Activity {
  url: string;
  time: string;
}

export interface ExamEvent {
  name: string;
  course: string;
  eventType: 'UPCOMING' | 'ACTIVE';
  date: Date;
}

export interface EventResponse {
  location: string;
  locationUrl: string;
  subject: string;
  subjectId: string;
  subjectUrl: string;
  action: string;
  date: Date;
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
