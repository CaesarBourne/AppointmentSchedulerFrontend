import { useState } from "react";
import AppointmentForm from "@/components/appointments/AppointmentForm";
import AppointmentList from "@/components/appointments/AppointmentList";
import { type Appointment, type NewAppointment } from "@/models/Appointment";
import { type Participant } from "@/models/Participant";
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getParticipants,
} from "@/services/api";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AppointmentsPage() {
  const queryClient = useQueryClient();

  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);
  const [activeTab, setActiveTab] = useState<string>("list");

  // Fetch appointments
  const { data: appointments = [], isLoading: isLoadingAppointments } =
    useQuery({
      queryKey: ["appointments"],
      queryFn: getAppointments,
    });

  // Fetch participants
  const { data: participants = [], isLoading: isLoadingParticipants } =
    useQuery<Participant[]>({
      queryKey: ["participants"],
      queryFn: getParticipants,
    });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Appointment created successfully");
      setActiveTab("list");
    },
    onError: () => {
      toast.error("Failed to create appointment");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: NewAppointment }) =>
      updateAppointment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Appointment updated successfully");
      setEditingAppointment(null);
      setActiveTab("list");
    },
    onError: () => {
      toast.error("Failed to update appointment");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Appointment deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete appointment");
    },
  });

  const handleCreateAppointment = async (
    appointment: NewAppointment
  ): Promise<void> => {
    try {
      const result = await createMutation.mutateAsync(appointment);

      if ("error" in result) {
        toast.error("Scheduling Conflict", {
          description: result.error,
        });
        return;
      }
    } catch {
      toast.error("Failed to create appointment");
    }
  };

  const handleUpdateAppointment = async (
    appointment: NewAppointment
  ): Promise<void> => {
    if (!editingAppointment) return;

    try {
      const result = await updateMutation.mutateAsync({
        id: editingAppointment.id,
        data: appointment,
      });

      if ("error" in result) {
        toast.error("Scheduling Conflict", {
          description: result.error,
        });
        return;
      }
    } catch {
      toast.error("Failed to update appointment");
    }
  };

  const handleDeleteAppointment = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setActiveTab("edit");
  };

  const handleCancelEdit = () => {
    setEditingAppointment(null);
    setActiveTab("list");
  };

  const isLoading = isLoadingAppointments || isLoadingParticipants;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Manage Appointments</h1>

      <div className="mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="list">Appointment List</TabsTrigger>
            <TabsTrigger value="add">Schedule New</TabsTrigger>
            {editingAppointment && (
              <TabsTrigger value="edit">Edit Appointment</TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="list" className="pt-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <p>Loading appointments...</p>
              </div>
            ) : (
              <AppointmentList
                appointments={appointments}
                onEdit={handleEditAppointment}
                onDelete={handleDeleteAppointment}
                onAdd={() => setActiveTab("add")}
              />
            )}
          </TabsContent>
          <TabsContent value="add" className="pt-4 flex justify-center">
            <AppointmentForm
              onSubmit={handleCreateAppointment}
              participants={participants}
              onCancel={() => setActiveTab("list")}
            />
          </TabsContent>
          <TabsContent value="edit" className="pt-4 flex justify-center">
            {editingAppointment && (
              <AppointmentForm
                onSubmit={handleUpdateAppointment}
                initialAppointment={editingAppointment}
                participants={participants}
                onCancel={handleCancelEdit}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
