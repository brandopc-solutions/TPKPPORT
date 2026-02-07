"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Student } from "@/types/student";
import {
  GENDER_OPTIONS,
  YES_NO_OPTIONS,
  RESIDENCY_STATUS_OPTIONS,
} from "@/lib/constants";
import { Loader2, Save, Pencil, X } from "lucide-react";
import { toast } from "sonner";
import { SchoolCombobox } from "@/components/school-combobox";

interface StudentFormProps {
  student: Student;
  allowEdit?: boolean;
}

function formatDateAEST(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  const parts = new Intl.DateTimeFormat("en-AU", {
    timeZone: "Australia/Sydney",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).formatToParts(d);
  const day = parts.find((p) => p.type === "day")?.value ?? "";
  const month = parts.find((p) => p.type === "month")?.value ?? "";
  const year = parts.find((p) => p.type === "year")?.value ?? "";
  return `${day}-${month}-${year}`;
}

function toIsoDateAEST(iso: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-CA", { timeZone: "Australia/Sydney" });
}

export function StudentForm({ student, allowEdit = true }: StudentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(student);
  const dobPickerRef = useRef<HTMLInputElement>(null);

  const readOnly = !editing;

  const updateField = (field: keyof Student, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setFormData(student);
    setEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (readOnly) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/students/${student.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to update.");
      } else {
        toast.success("Student information updated successfully.");
        setEditing(false);
        router.refresh();
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-end gap-2">
        {!editing && allowEdit && (
          <Button type="button" onClick={() => setEditing(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
        )}
        {editing && (
          <>
            <Button type="button" variant="outline" onClick={handleCancel} disabled={loading}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Changes
            </Button>
          </>
        )}
      </div>

      {/* Personal Info */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                disabled={readOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="middleName">Middle Name</Label>
              <Input
                id="middleName"
                value={formData.middleName}
                onChange={(e) => updateField("middleName", e.target.value)}
                disabled={readOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                disabled={readOnly}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <div className="relative">
                <Input
                  value={formatDateAEST(formData.dateOfBirth)}
                  disabled={readOnly}
                  readOnly={!readOnly}
                  onClick={() => !readOnly && dobPickerRef.current?.showPicker()}
                  className={!readOnly ? "cursor-pointer" : ""}
                />
                {!readOnly && (
                  <input
                    ref={dobPickerRef}
                    type="date"
                    aria-label="Date of Birth"
                    value={toIsoDateAEST(formData.dateOfBirth)}
                    onChange={(e) => updateField("dateOfBirth", e.target.value)}
                    className="sr-only"
                    tabIndex={-1}
                  />
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={(v) => updateField("gender", v)}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {GENDER_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="residencyStatus">Residency Status</Label>
              <Select
                value={formData.residencyStatus}
                onValueChange={(v) => updateField("residencyStatus", v)}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {RESIDENCY_STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* School Info */}
      <Card>
        <CardHeader>
          <CardTitle>School Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2 rounded-md bg-yellow-100 p-2 ring-1 ring-yellow-300">
              <Label htmlFor="mainstreamYearLevel">Mainstream Year Level</Label>
              <Input
                id="mainstreamYearLevel"
                value={formData.mainstreamYearLevel}
                onChange={(e) => updateField("mainstreamYearLevel", e.target.value)}
                disabled={readOnly}
              />
            </div>
            <div className="space-y-2 rounded-md bg-yellow-100 p-2 ring-1 ring-yellow-300">
              <Label htmlFor="mainstreamSchoolName">Mainstream School</Label>
              {readOnly ? (
                <Input value={formData.mainstreamSchoolName} disabled />
              ) : (
                <SchoolCombobox
                  value={formData.mainstreamSchoolName}
                  onValueChange={(v) => updateField("mainstreamSchoolName", v)}
                  disabled={readOnly}
                />
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="otherSchoolName">Other School Name</Label>
              <Input
                id="otherSchoolName"
                value={formData.otherSchoolName}
                onChange={(e) => updateField("otherSchoolName", e.target.value)}
                disabled={readOnly}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Campus</Label>
              <Input value={formData.campus} disabled />
            </div>
            <div className="space-y-2">
              <Label>Current Class</Label>
              <Input value={formData.currentClass} disabled />
            </div>
            <div className="space-y-2">
              <Label>Roll Number</Label>
              <Input value={formData.rollNumber} disabled />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medical Info */}
      <Card>
        <CardHeader>
          <CardTitle>Medical Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="medicalCondition">Medical Condition</Label>
              <Select
                value={formData.medicalCondition}
                onValueChange={(v) => updateField("medicalCondition", v)}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {YES_NO_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="medication">Medication</Label>
              <Select
                value={formData.medication}
                onValueChange={(v) => updateField("medication", v)}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {YES_NO_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="medicalDescription">Medical Details</Label>
            <Textarea
              id="medicalDescription"
              value={formData.medicalDescription}
              onChange={(e) => updateField("medicalDescription", e.target.value)}
              disabled={readOnly}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="medicationDescription">Medication Details</Label>
            <Textarea
              id="medicationDescription"
              value={formData.medicationDescription}
              onChange={(e) => updateField("medicationDescription", e.target.value)}
              disabled={readOnly}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Status (read-only) */}
      <Card>
        <CardHeader>
          <CardTitle>Enrollment Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Status</Label>
              <Input value={formData.status} disabled />
            </div>
            <div className="space-y-2">
              <Label>Enrollment Status</Label>
              <Input value={formData.enrollmentStatus} disabled />
            </div>
            <div className="space-y-2">
              <Label>Student ID</Label>
              <Input value={formData.rollNumber} disabled />
            </div>
          </div>
        </CardContent>
      </Card>

    </form>
  );
}
