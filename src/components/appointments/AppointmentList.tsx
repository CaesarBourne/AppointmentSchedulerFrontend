import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type Appointment } from "@/models/Appointment";
import { Edit, Trash, CalendarPlus } from "lucide-react";
import { format } from "date-fns";
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

interface AppointmentListProps {
  appointments: Appointment[];
  onEdit: (appointment: Appointment) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
}

export default function AppointmentList({
  appointments,
  onEdit,
  onDelete,
  onAdd,
}: AppointmentListProps) {
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy h:mm a");
  };

  const sortedAppointments = [...appointments].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {sortedAppointments.length === 0 ? (
        <div className="col-span-full text-center py-12 bg-muted/40 rounded-lg">
          <div className="flex flex-col items-center gap-4">
            <CalendarPlus className="h-12 w-12 text-muted-foreground" />
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">
                No appointments scheduled yet.
              </p>
              <Button onClick={onAdd}>Schedule Appointment</Button>
            </div>
          </div>
        </div>
      ) : (
        sortedAppointments.map((appointment) => (
          <Card key={appointment.id} className="appointment-card">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="mr-2">{appointment.title}</CardTitle>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(appointment)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete appointment</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{appointment.title}"?
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(appointment.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              <CardDescription className="flex flex-col gap-1">
                <span>{formatDateTime(appointment.startTime)}</span>
                <span>to {formatDateTime(appointment.endTime)}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {appointment.description && (
                <p className="text-sm text-muted-foreground mb-4">
                  {appointment.description}
                </p>
              )}
              <div>
                <h4 className="text-sm font-medium mb-2">Participants:</h4>
                <div className="flex flex-wrap gap-1">
                  {appointment.participants.map((participant) => (
                    <Badge key={participant.id} variant="secondary">
                      {participant.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
