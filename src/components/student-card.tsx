import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Student } from "@/types/student";
import { GraduationCap } from "lucide-react";

interface StudentCardProps {
  student: Student;
  basePath?: string;
}

export function StudentCard({ student, basePath = "/dashboard/students" }: StudentCardProps) {
  return (
    <Link href={`${basePath}/${student.id}`}>
      <Card className="transition-colors hover:bg-muted/50 cursor-pointer">
        <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
          <div className="rounded-md bg-primary/10 p-2 text-primary">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-base">
              {student.firstName} {student.lastName}
            </CardTitle>
          </div>
          <Badge
            variant={student.enrollmentStatus === "Enrolled" ? "default" : "secondary"}
          >
            {student.enrollmentStatus || "Unknown"}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Roll No:</span>{" "}
            {student.rollNumber || "N/A"}
          </div>
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Email:</span>{" "}
            {student.azureAdEmail || "N/A"}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
