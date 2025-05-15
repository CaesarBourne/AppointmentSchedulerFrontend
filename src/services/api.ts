// import { Appointment, NewAppointment } from "@/models/Appointment";
// import { NewParticipant, Participant } from "@/models/Participant";
import type { NewParticipant, Participant } from "@/models/Participant";
import { getStoredData, storeData, STORAGE_KEYS } from "./storage";
import type { Appointment, NewAppointment } from "@/models/Appointment";

// Helper function to generate IDs
const generateId = (): number => {
  return Date.now() + Math.floor(Math.random() * 1000);
};

// Participants API
export const getParticipants = async (): Promise<Participant[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return getStoredData(STORAGE_KEYS.PARTICIPANTS, []);
};

export const createParticipant = async (
  participant: NewParticipant
): Promise<Participant> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const participants = await getParticipants();
  const newParticipant = {
    id: generateId(),
    ...participant,
  };

  const updatedParticipants = [...participants, newParticipant];
  storeData(STORAGE_KEYS.PARTICIPANTS, updatedParticipants);

  return newParticipant;
};

export const updateParticipant = async (
  participant: Participant
): Promise<Participant> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const participants = await getParticipants();
  const index = participants.findIndex((p) => p.id === participant.id);

  if (index === -1) {
    throw new Error("Participant not found");
  }

  participants[index] = participant;
  storeData(STORAGE_KEYS.PARTICIPANTS, participants);

  return participant;
};

export const deleteParticipant = async (id: number): Promise<void> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Delete the participant
  const participants = await getParticipants();
  const updatedParticipants = participants.filter((p) => p.id !== id);
  storeData(STORAGE_KEYS.PARTICIPANTS, updatedParticipants);

  // Also remove participant from all appointments
  const appointments = await getAppointments();
  const updatedAppointments = appointments.map((appointment) => ({
    ...appointment,
    participants: appointment.participants.filter((p) => p.id !== id),
  }));

  storeData(STORAGE_KEYS.APPOINTMENTS, updatedAppointments);
};

// Appointments API
export const getAppointments = async (): Promise<Appointment[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return getStoredData(STORAGE_KEYS.APPOINTMENTS, []);
};

export const createAppointment = async (
  appointment: NewAppointment
): Promise<Appointment | { error: string }> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const participants = await getParticipants();
  const appointments = await getAppointments();

  // Check for scheduling conflicts
  const conflict = checkSchedulingConflicts(
    appointment.participantIds,
    new Date(appointment.startTime),
    new Date(appointment.endTime),
    null,
    appointments,
    participants
  );

  if (conflict) {
    return { error: `Scheduling conflict: ${conflict}` };
  }

  // Create the appointment with full participant objects
  const selectedParticipants = participants.filter((p) =>
    appointment.participantIds.includes(p.id)
  );

  const newAppointment: Appointment = {
    id: generateId(),
    title: appointment.title,
    description: appointment.description,
    startTime: appointment.startTime,
    endTime: appointment.endTime,
    participants: selectedParticipants,
  };

  const updatedAppointments = [...appointments, newAppointment];
  storeData(STORAGE_KEYS.APPOINTMENTS, updatedAppointments);

  return newAppointment;
};

export const updateAppointment = async (
  id: number,
  appointment: NewAppointment
): Promise<Appointment | { error: string }> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const participants = await getParticipants();
  const appointments = await getAppointments();
  const index = appointments.findIndex((a) => a.id === id);

  if (index === -1) {
    throw new Error("Appointment not found");
  }

  // Check for scheduling conflicts (excluding this appointment)
  const conflict = checkSchedulingConflicts(
    appointment.participantIds,
    new Date(appointment.startTime),
    new Date(appointment.endTime),
    id,
    appointments,
    participants
  );

  if (conflict) {
    return { error: `Scheduling conflict: ${conflict}` };
  }

  // Update with full participant objects
  const selectedParticipants = participants.filter((p) =>
    appointment.participantIds.includes(p.id)
  );

  const updatedAppointment: Appointment = {
    id: id,
    title: appointment.title,
    description: appointment.description,
    startTime: appointment.startTime,
    endTime: appointment.endTime,
    participants: selectedParticipants,
  };

  appointments[index] = updatedAppointment;
  storeData(STORAGE_KEYS.APPOINTMENTS, appointments);

  return updatedAppointment;
};

export const deleteAppointment = async (id: number): Promise<void> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const appointments = await getAppointments();
  const updatedAppointments = appointments.filter((a) => a.id !== id);
  storeData(STORAGE_KEYS.APPOINTMENTS, updatedAppointments);
};

// Helper function to check for scheduling conflicts
function checkSchedulingConflicts(
  participantIds: number[],
  startTime: Date,
  endTime: Date,
  excludeAppointmentId: number | null,
  appointments: Appointment[],
  participants: Participant[]
): string | null {
  for (const participantId of participantIds) {
    const participant = participants.find((p) => p.id === participantId);
    if (!participant) continue;

    // Check if this participant has any overlapping appointments
    const conflict = appointments.find((appointment) => {
      // Skip the current appointment if we're updating
      if (
        excludeAppointmentId !== null &&
        appointment.id === excludeAppointmentId
      ) {
        return false;
      }

      // Check if this participant is in this appointment
      const isParticipantInAppointment = appointment.participants.some(
        (p) => p.id === participantId
      );

      if (!isParticipantInAppointment) {
        return false;
      }

      // Check for time overlap
      const appointmentStart = new Date(appointment.startTime);
      const appointmentEnd = new Date(appointment.endTime);

      return (
        (startTime >= appointmentStart && startTime < appointmentEnd) ||
        (endTime > appointmentStart && endTime <= appointmentEnd) ||
        (startTime <= appointmentStart && endTime >= appointmentEnd)
      );
    });

    if (conflict) {
      return `${
        participant.name
      } already has a meeting scheduled from ${new Date(
        conflict.startTime
      ).toLocaleString()} to ${new Date(conflict.endTime).toLocaleString()}`;
    }
  }

  return null;
}
