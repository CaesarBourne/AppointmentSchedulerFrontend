import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type NewAppointment, type Appointment } from "@/models/Appointment";
import { type Participant } from "@/models/Participant";
import { toast } from "sonner";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface AppointmentFormProps {
  onSubmit: (appointment: NewAppointment) => Promise<void>;
  initialAppointment?: Appointment;
  participants: Participant[];
  onCancel?: () => void;
}

export default function AppointmentForm({
  onSubmit,
  initialAppointment,
  participants,
  onCancel,
}: AppointmentFormProps) {
  const [startDate, setStartDate] = useState(
    initialAppointment
      ? new Date(initialAppointment.startTime).toISOString().split("T")[0]
      : ""
  );
  const [startTime, setStartTime] = useState(
    initialAppointment
      ? new Date(initialAppointment.startTime).toTimeString().substring(0, 5)
      : ""
  );
  const [endDate, setEndDate] = useState(
    initialAppointment
      ? new Date(initialAppointment.endTime).toISOString().split("T")[0]
      : ""
  );
  const [endTime, setEndTime] = useState(
    initialAppointment
      ? new Date(initialAppointment.endTime).toTimeString().substring(0, 5)
      : ""
  );

  const [selectedParticipantId, setSelectedParticipantId] = useState<
    number | null
  >(initialAppointment ? initialAppointment.participant.id : null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!startDate || !startTime || !endDate || !endTime) {
      toast.error("Start and end date/time are required");
      return;
    }

    if (!selectedParticipantId) {
      toast.error("Please select a participant");
      return;
    }

    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);

    if (endDateTime <= startDateTime) {
      toast.error("End time must be after start time");
      return;
    }

    setIsSubmitting(true);

    try {
      const appointmentData: NewAppointment = {
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        participantId: selectedParticipantId,
      };

      await onSubmit(appointmentData);

      // Reset form if creating new
      if (!initialAppointment) {
        setStartDate("");
        setStartTime("");
        setEndDate("");
        setEndTime("");
        setSelectedParticipantId(null);
      }
    } catch {
      toast.error("Failed to save appointment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle>
          {initialAppointment ? "Edit Appointment" : "Schedule Appointment"}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="participant">Participant</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between"
                >
                  {selectedParticipantId
                    ? participants.find((p) => p.id === selectedParticipantId)
                        ?.name
                    : "Select a participant"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search participants..." />
                  <CommandList>
                    {participants.map((participant) => (
                      <CommandItem
                        key={participant.id}
                        value={participant.name}
                        onSelect={() =>
                          setSelectedParticipantId(participant.id)
                        }
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>
                            {participant.name} ({participant.email})
                          </span>
                          {selectedParticipantId === participant.id && (
                            <span className="text-primary font-medium">✓</span>
                          )}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between mt-4">
          {onCancel && (
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              type="button"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={isSubmitting || !selectedParticipantId}
          >
            {isSubmitting
              ? "Saving..."
              : initialAppointment
              ? "Update Appointment"
              : "Create Appointment"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
