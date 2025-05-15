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
import { type NewParticipant, type Participant } from "@/models/Participant";
import { toast } from "sonner";

interface ParticipantFormProps {
  onSubmit: (participant: NewParticipant) => Promise<void>;
  initialParticipant?: Participant;
  onCancel?: () => void;
}

export default function ParticipantForm({
  onSubmit,
  initialParticipant,
  onCancel,
}: ParticipantFormProps) {
  const [name, setName] = useState(initialParticipant?.name || "");
  const [email, setEmail] = useState(initialParticipant?.email || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      toast.error("Name and email are required");
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({ name, email });

      if (!initialParticipant) {
        // Reset form if adding new participant
        setName("");
        setEmail("");
      }

      toast.success(
        initialParticipant
          ? "Participant updated successfully"
          : "New participant added successfully"
      );
    } catch {
      toast.error("Failed to save participant");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>
          {initialParticipant ? "Edit Participant" : "Add Participant"}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              disabled={isSubmitting}
            />
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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : initialParticipant
              ? "Update"
              : "Add Participant"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
