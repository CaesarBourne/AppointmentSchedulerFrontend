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
import { Textarea } from "@/components/ui/textarea";

import { type Appointment, type NewAppointment } from "@/models/Appointment";
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
  const [title, setTitle] = useState(initialAppointment?.title || "");
  const [description, setDescription] = useState(
    initialAppointment?.description || ""
  );
  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  const formatTimeForInput = (date: Date): string => {
    return date.toTimeString().substring(0, 5);
  };

  const [startDate, setStartDate] = useState(
    initialAppointment
      ? formatDateForInput(new Date(initialAppointment.startTime))
      : ""
  );
  const [startTime, setStartTime] = useState(
    initialAppointment
      ? formatTimeForInput(new Date(initialAppointment.startTime))
      : ""
  );
  const [endDate, setEndDate] = useState(
    initialAppointment
      ? formatDateForInput(new Date(initialAppointment.endTime))
      : ""
  );
  const [endTime, setEndTime] = useState(
    initialAppointment
      ? formatTimeForInput(new Date(initialAppointment.endTime))
      : ""
  );
  const [selectedParticipants, setSelectedParticipants] = useState<number[]>(
    initialAppointment ? initialAppointment.participants.map((p) => p.id) : []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!title.trim()) {
      toast.error("Title is required", {
        description: "Validation Error",
      });
      return;
    }

    if (!startDate || !startTime || !endDate || !endTime) {
      toast.error("Validation Error", {
        description: "Start and end date/time are required",
      });
      return;
    }

    if (selectedParticipants.length === 0) {
      toast.error("Validation error", {
        description: "Please select at least one participant",
      });
      return;
    }

    // Combine date and time strings to create ISO date strings
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);

    // Validate that end time is after start time
    if (endDateTime <= startDateTime) {
      toast.error("Validation Error", {
        description: "End time must be after start time",
      });

      return;
    }

    setIsSubmitting(true);

    try {
      const appointmentData: NewAppointment = {
        title,
        description,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        participantIds: selectedParticipants,
      };

      await onSubmit(appointmentData);

      // Reset form if creating a new appointment
      if (!initialAppointment) {
        setTitle("");
        setDescription("");
        setStartDate("");
        setStartTime("");
        setEndDate("");
        setEndTime("");
        setSelectedParticipants([]);
      }
    } catch {
      toast.error("Error", {
        description: "Failed to save appointment",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleParticipant = (participantId: number) => {
    setSelectedParticipants((current) =>
      current.includes(participantId)
        ? current.filter((id) => id !== participantId)
        : [...current, participantId]
    );
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
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Meeting title"
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Meeting details"
              disabled={isSubmitting}
            />
          </div>
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
            <Label htmlFor="participants">Participants</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between"
                >
                  {selectedParticipants.length > 0
                    ? `${selectedParticipants.length} selected`
                    : "Select participants"}
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
                        onSelect={() => toggleParticipant(participant.id)}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>
                            {participant.name} ({participant.email})
                          </span>
                          {selectedParticipants.includes(participant.id) && (
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

        <CardFooter className="flex justify-between">
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
            disabled={isSubmitting || participants.length === 0}
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
