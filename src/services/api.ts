import type { Participant, NewParticipant } from "@/models/Participant";
import type {
  Appointment,
  NewAppointment,
  BackendAppointmentResponse,
} from "@/models/Appointment";

const BASE_URL = "http://13.60.162.81:8000/api";

// --- PARTICIPANTS ---
export const getParticipants = async (): Promise<Participant[]> => {
  const res = await fetch(`${BASE_URL}/participants`);
  if (!res.ok) throw new Error("Failed to fetch participants");
  return await res.json();
};

export const getParticipant = async (id: number): Promise<Participant> => {
  const res = await fetch(`${BASE_URL}/participants/${id}`);
  if (!res.ok) throw new Error("Failed to fetch participant");
  return await res.json();
};

export const createParticipant = async (
  participant: NewParticipant
): Promise<Participant> => {
  const res = await fetch(`${BASE_URL}/participants`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(participant),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create participant");
  return data.participant;
};

export const deleteParticipant = async (id: number): Promise<void> => {
  const res = await fetch(`${BASE_URL}/participants/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete participant");
};

// --- APPOINTMENTS ---

export const getAppointments = async (): Promise<Appointment[]> => {
  const res = await fetch(`${BASE_URL}/appointments`);
  if (!res.ok) throw new Error("Failed to fetch appointments");

  const data: BackendAppointmentResponse[] = await res.json();

  return data.map((a) => ({
    id: a.id,
    title: `Meeting with ${a.participant}`,
    description: `Meeting with ${a.participant} starts at ${a.startTime} and ends at ${a.endTime}`,
    startTime: a.startTime,
    endTime: a.endTime,
    participant: {
      id: -1, // Since backend doesn’t return ID, fallback
      name: a.participant,
      email: a.email ?? "",
    },
  }));
};

export const createAppointment = async (
  appointment: NewAppointment
): Promise<Appointment | { error: string }> => {
  const participant = await getParticipant(appointment.participantId);

  const payload = {
    email: participant.email,
    startTime: appointment.startTime,
    endTime: appointment.endTime,
  };

  const res = await fetch(`${BASE_URL}/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok || data.status === "error") {
    return { error: data.message || "Failed to create appointment" };
  }

  return {
    id: data.appointment.id,
    title: `Meeting with ${data.appointment.participant}`,
    description: `Meeting with ${data.appointment.participant} starts at ${data.appointment.startTime} and ends at ${data.appointment.endTime}`,
    startTime: data.appointment.startTime,
    endTime: data.appointment.endTime,
    participant: {
      id: appointment.participantId,
      name: data.appointment.participant,
      email: participant.email,
    },
  };
};

export const deleteAppointment = async (id: number): Promise<void> => {
  const res = await fetch(`${BASE_URL}/appointments/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete appointment");
};
