import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarDays } from "lucide-react";

export default function SchedulePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Schedule & Attendance</h1>
        <p className="text-muted-foreground">
          View class schedules and attendance records.
        </p>
      </div>

      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto rounded-full bg-muted p-4 w-fit">
            <CalendarDays className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            Class schedules and attendance tracking will be available in a future
            update.
          </CardDescription>
        </CardHeader>
        <CardContent />
      </Card>
    </div>
  );
}
