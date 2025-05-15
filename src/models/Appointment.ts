export interface Appointment {
  id: number;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  participant: {
    id: number;
    name: string;
    email: string;
  };
}

export interface NewAppointment {
  participantId: number;
  startTime: string;
  endTime: string;
}

export interface BackendAppointmentResponse {
  id: number;
  participant: string;
  email?: string;
  startTime: string;
  endTime: string;
}
