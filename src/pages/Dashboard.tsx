import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type Appointment } from "@/models/Appointment";
import { type Participant } from "@/models/Participant";
import { getAppointments, getParticipants } from "@/services/api";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

export default function Dashboard() {
  const navigate = useNavigate();

  const { data: appointments = [], isLoading: isLoadingAppointments } =
    useQuery<Appointment[]>({
      queryKey: ["appointments"],
      queryFn: async () => {
        try {
          return await getAppointments();
        } catch {
          toast.error("Failed to load appointments");
          return [];
        }
      },
    });

  const { data: participants = [], isLoading: isLoadingParticipants } =
    useQuery<Participant[]>({
      queryKey: ["participants"],
      queryFn: async () => {
        try {
          return await getParticipants();
        } catch {
          toast.error("Failed to load participants");
          return [];
        }
      },
    });

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy h:mm a");
  };

  const getUpcomingAppointments = (): Appointment[] => {
    const now = new Date();
    return appointments
      .filter((a) => new Date(a.startTime) > now)
      .sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      )
      .slice(0, 3);
  };

  const upcomingAppointments = getUpcomingAppointments();
  const isLoading = isLoadingAppointments || isLoadingParticipants;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Appointment Management System</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{appointments.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Participants</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{participants.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Upcoming Meetings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{upcomingAppointments.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button
              onClick={() => navigate("/appointments")}
              disabled={participants.length === 0}
            >
              New Appointment
            </Button>
            <Button variant="outline" onClick={() => navigate("/participants")}>
              Add Participant
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Your next scheduled meetings</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-8 text-center">
                <p>Loading appointments...</p>
              </div>
            ) : upcomingAppointments.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">
                  No upcoming appointments
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <Card key={appointment.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">
                        {appointment.title}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {formatDateTime(appointment.startTime)} to{" "}
                        {formatDateTime(appointment.endTime)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">
                          {appointment.participant.name}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/appointments")}
            >
              View All Appointments
            </Button>
          </CardFooter>
        </Card>

        <Card className="h-full">
          <CardHeader>
            <CardTitle>Participants</CardTitle>
            <CardDescription>People in your organization</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-8 text-center">
                <p>Loading participants...</p>
              </div>
            ) : participants.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">
                  No participants added yet
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {participants.slice(0, 5).map((participant) => (
                  <div
                    key={participant.id}
                    className="p-2 border rounded-md flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{participant.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {participant.email}
                      </p>
                    </div>
                  </div>
                ))}
                {participants.length > 5 && (
                  <div className="text-center pt-2">
                    <p className="text-sm text-muted-foreground">
                      And {participants.length - 5} more...
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/participants")}
            >
              Manage Participants
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
