import type { Participant } from "./Participant";

export interface Appointment {
  id: number;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  participants: Participant[];
}

export interface NewAppointment {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  participantIds: number[];
}
