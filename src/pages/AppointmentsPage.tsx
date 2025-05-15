import { useState } from "react";
import AppointmentForm from "@/components/appointments/AppointmentForm";
import AppointmentList from "@/components/appointments/AppointmentList";
import { type NewAppointment } from "@/models/Appointment";
import { type Participant } from "@/models/Participant";
import {
  getAppointments,
  createAppointment,
  deleteAppointment,
  getParticipants,
} from "@/services/api";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AppointmentsPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("list");

  const { data: appointments = [], isLoading: isLoadingAppointments } =
    useQuery({
      queryKey: ["appointments"],
      queryFn: getAppointments,
    });

  const { data: participants = [], isLoading: isLoadingParticipants } =
    useQuery<Participant[]>({
      queryKey: ["participants"],
      queryFn: getParticipants,
    });

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
      }
    } catch {
      toast.error("Failed to create appointment");
    }
  };

  const handleDeleteAppointment = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleEditAppointment = () => {
    toast.info("Editing  feature is coming soon");
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
        </Tabs>
      </div>
    </div>
  );
}
