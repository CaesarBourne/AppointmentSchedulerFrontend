import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { type Participant } from "@/models/Participant";
import { Edit, Trash, UserPlus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ParticipantListProps {
  participants: Participant[];
  onEdit: (participant: Participant) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
}

export default function ParticipantList({
  participants,
  onEdit,
  onDelete,
  onAdd,
}: ParticipantListProps) {
  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {participants.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-12">
                <div className="flex flex-col items-center gap-4">
                  <UserPlus className="h-12 w-12 text-muted-foreground" />
                  <div className="text-center space-y-2">
                    <p className="text-muted-foreground">
                      No participants found.
                    </p>
                    <Button onClick={onAdd}>Add Participant</Button>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            participants.map((participant) => (
              <TableRow key={participant.id}>
                <TableCell>{participant.name}</TableCell>
                <TableCell>{participant.email}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(participant)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Delete participant
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete {participant.name}?
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDelete(participant.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
