import { useState } from "react";
import ParticipantForm from "@/components/participants/ParticipantForm";
import ParticipantList from "@/components/participants/ParticipantList";
import { type Participant, type NewParticipant } from "@/models/Participant";
import {
  getParticipants,
  createParticipant,
  deleteParticipant,
} from "@/services/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

export default function ParticipantsPage() {
  const queryClient = useQueryClient();
  const [editingParticipant, setEditingParticipant] =
    useState<Participant | null>(null);
  const [activeTab, setActiveTab] = useState("list");

  const { data: participants = [], isLoading } = useQuery<Participant[]>({
    queryKey: ["participants"],
    queryFn: getParticipants,
  });

  const createMutation = useMutation({
    mutationFn: createParticipant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["participants"] });
      toast.success("Participant added successfully");
      setActiveTab("list");
    },
    onError: () => {
      toast.error("Failed to create participant");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteParticipant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["participants"] });
      toast.success("Participant deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete participant");
    },
  });

  const handleAddParticipant = async (participant: NewParticipant) => {
    createMutation.mutate(participant);
  };

  const handleEditParticipant = (participant: Participant) => {
    setEditingParticipant(participant);
    setActiveTab("edit");
  };

  // const handleCancelEdit = () => {
  //   setEditingParticipant(null);
  //   setActiveTab("list");
  // };

  const handleDeleteParticipant = (id: number) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Manage Participants</h1>

      <div className="mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="list">Participant List</TabsTrigger>
            <TabsTrigger value="add">Add Participant</TabsTrigger>
            {editingParticipant && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger value="edit">Edit Participant</TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  Editing not yet supported in backend
                </TooltipContent>
              </Tooltip>
            )}
          </TabsList>

          <TabsContent value="list" className="pt-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <p>Loading participants...</p>
              </div>
            ) : (
              <ParticipantList
                participants={participants}
                onEdit={handleEditParticipant}
                onDelete={handleDeleteParticipant}
                onAdd={() => setActiveTab("add")}
              />
            )}
          </TabsContent>

          <TabsContent value="add" className="pt-4 flex justify-center">
            <ParticipantForm
              onSubmit={handleAddParticipant}
              onCancel={() => setActiveTab("list")}
            />
          </TabsContent>

          <TabsContent value="edit" className="pt-4 flex justify-center">
            <div className="text-muted-foreground text-center text-sm italic">
              Edit is not yet supported in the backend.
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
