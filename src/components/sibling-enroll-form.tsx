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
import {
  GENDER_OPTIONS,
  YES_NO_OPTIONS,
  RESIDENCY_STATUS_OPTIONS,
} from "@/lib/constants";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { SchoolCombobox } from "@/components/school-combobox";

interface EnrollFormData {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  mainstreamYearLevel: string;
  mainstreamSchoolName: string;
  otherSchoolPrevious: string;
  otherSchoolName: string;
  otherSchoolPast: string;
  residencyStatus: string;
  medicalCondition: string;
  medicalDescription: string;
  medication: string;
  medicationDescription: string;
}

const emptyForm: EnrollFormData = {
  firstName: "",
  middleName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "",
  mainstreamYearLevel: "",
  mainstreamSchoolName: "",
  otherSchoolPrevious: "",
  otherSchoolName: "",
  otherSchoolPast: "",
  residencyStatus: "",
  medicalCondition: "",
  medicalDescription: "",
  medication: "",
  medicationDescription: "",
};

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
  return new Date(iso).toLocaleDateString("en-CA", {
    timeZone: "Australia/Sydney",
  });
}

export function SiblingEnrollForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<EnrollFormData>(emptyForm);
  const dobPickerRef = useRef<HTMLInputElement>(null);

  const updateField = (field: keyof EnrollFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to enroll student.");
      } else {
        toast.success("Sibling enrolled successfully! Enrollment status: Pending.");
        router.push("/dashboard/students");
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
      <div className="flex justify-between gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/students")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Students
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Enroll Sibling
        </Button>
      </div>

      {/* Personal Info */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="middleName">Middle Name</Label>
              <Input
                id="middleName"
                value={formData.middleName}
                onChange={(e) => updateField("middleName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                required
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">
                Date of Birth <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  value={formatDateAEST(formData.dateOfBirth)}
                  readOnly
                  onClick={() => dobPickerRef.current?.showPicker()}
                  className="cursor-pointer"
                  placeholder="Select date"
                />
                <input
                  ref={dobPickerRef}
                  type="date"
                  aria-label="Date of Birth"
                  value={
                    formData.dateOfBirth
                      ? toIsoDateAEST(formData.dateOfBirth)
                      : ""
                  }
                  onChange={(e) => updateField("dateOfBirth", e.target.value)}
                  className="sr-only"
                  tabIndex={-1}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">
                Gender <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.gender}
                onValueChange={(v) => updateField("gender", v)}
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
            <div className="space-y-2">
              <Label htmlFor="mainstreamYearLevel">Mainstream Year Level</Label>
              <Input
                id="mainstreamYearLevel"
                value={formData.mainstreamYearLevel}
                onChange={(e) =>
                  updateField("mainstreamYearLevel", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mainstreamSchoolName">Mainstream School</Label>
              <SchoolCombobox
                value={formData.mainstreamSchoolName}
                onValueChange={(v) =>
                  updateField("mainstreamSchoolName", v)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="otherSchoolName">Other School Name</Label>
              <Input
                id="otherSchoolName"
                value={formData.otherSchoolName}
                onChange={(e) => updateField("otherSchoolName", e.target.value)}
              />
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
              onChange={(e) =>
                updateField("medicalDescription", e.target.value)
              }
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="medicationDescription">Medication Details</Label>
            <Textarea
              id="medicationDescription"
              value={formData.medicationDescription}
              onChange={(e) =>
                updateField("medicationDescription", e.target.value)
              }
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
