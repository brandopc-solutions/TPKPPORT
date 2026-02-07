"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Separator } from "@/components/ui/separator";
import { Family } from "@/types/family";
import {
  RELATIONSHIP_OPTIONS,
  STATE_OPTIONS,
  YES_NO_OPTIONS,
  ALLOW_PHOTO_OPTIONS,
  PHOTO_SHARING_OPTIONS,
} from "@/lib/constants";
import { Loader2, Save, Pencil, X } from "lucide-react";
import { toast } from "sonner";

interface FamilyFormProps {
  family: Family;
  allowEdit?: boolean;
}

export function FamilyForm({ family, allowEdit = true }: FamilyFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(family);

  const readOnly = !editing;

  const updateField = (field: keyof Family, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setFormData(family);
    setEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (readOnly) return;
    setLoading(true);

    try {
      const res = await fetch("/api/family", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to update.");
      } else {
        toast.success("Family information updated successfully.");
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

      {/* Parent 1 */}
      <Card>
        <CardHeader>
          <CardTitle>Parent / Guardian 1</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="p1FirstName">First Name</Label>
              <Input
                id="p1FirstName"
                value={formData.p1FirstName}
                onChange={(e) => updateField("p1FirstName", e.target.value)}
                disabled={readOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p1MiddleName">Middle Name</Label>
              <Input
                id="p1MiddleName"
                value={formData.p1MiddleName}
                onChange={(e) => updateField("p1MiddleName", e.target.value)}
                disabled={readOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p1LastName">Last Name</Label>
              <Input
                id="p1LastName"
                value={formData.p1LastName}
                onChange={(e) => updateField("p1LastName", e.target.value)}
                disabled={readOnly}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="p1Mobile">Mobile</Label>
              <Input
                id="p1Mobile"
                value={formData.p1Mobile}
                onChange={(e) => updateField("p1Mobile", e.target.value)}
                disabled={readOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p1Email">Email</Label>
              <Input
                id="p1Email"
                type="email"
                value={formData.p1Email}
                onChange={(e) => updateField("p1Email", e.target.value)}
                disabled={readOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p1Relationship">Relationship</Label>
              <Select
                value={formData.p1Relationship}
                onValueChange={(v) => updateField("p1Relationship", v)}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {RELATIONSHIP_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="p1Street">Street</Label>
              <Input
                id="p1Street"
                value={formData.p1Street}
                onChange={(e) => updateField("p1Street", e.target.value)}
                disabled={readOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p1Suburb">Suburb</Label>
              <Input
                id="p1Suburb"
                value={formData.p1Suburb}
                onChange={(e) => updateField("p1Suburb", e.target.value)}
                disabled={readOnly}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="p1State">State</Label>
              <Select
                value={formData.p1State}
                onValueChange={(v) => updateField("p1State", v)}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {STATE_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="p1PostCode">Post Code</Label>
              <Input
                id="p1PostCode"
                value={formData.p1PostCode}
                onChange={(e) => updateField("p1PostCode", e.target.value)}
                disabled={readOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p1Country">Country</Label>
              <Input
                id="p1Country"
                value={formData.p1Country}
                onChange={(e) => updateField("p1Country", e.target.value)}
                disabled={readOnly}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parent 2 */}
      <Card>
        <CardHeader>
          <CardTitle>Parent / Guardian 2</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="p2FirstName">First Name</Label>
              <Input
                id="p2FirstName"
                value={formData.p2FirstName}
                onChange={(e) => updateField("p2FirstName", e.target.value)}
                disabled={readOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p2MiddleName">Middle Name</Label>
              <Input
                id="p2MiddleName"
                value={formData.p2MiddleName}
                onChange={(e) => updateField("p2MiddleName", e.target.value)}
                disabled={readOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p2LastName">Last Name</Label>
              <Input
                id="p2LastName"
                value={formData.p2LastName}
                onChange={(e) => updateField("p2LastName", e.target.value)}
                disabled={readOnly}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="p2Mobile">Mobile</Label>
              <Input
                id="p2Mobile"
                value={formData.p2Mobile}
                onChange={(e) => updateField("p2Mobile", e.target.value)}
                disabled={readOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p2Email">Email</Label>
              <Input
                id="p2Email"
                type="email"
                value={formData.p2Email}
                onChange={(e) => updateField("p2Email", e.target.value)}
                disabled={readOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p2Relationship">Relationship</Label>
              <Select
                value={formData.p2Relationship}
                onValueChange={(v) => updateField("p2Relationship", v)}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {RELATIONSHIP_OPTIONS.map((opt) => (
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

      {/* Emergency Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Emergency Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="emergencyFirstName">First Name</Label>
              <Input
                id="emergencyFirstName"
                value={formData.emergencyFirstName}
                onChange={(e) => updateField("emergencyFirstName", e.target.value)}
                disabled={readOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyMiddleName">Middle Name</Label>
              <Input
                id="emergencyMiddleName"
                value={formData.emergencyMiddleName}
                onChange={(e) => updateField("emergencyMiddleName", e.target.value)}
                disabled={readOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyLastName">Last Name</Label>
              <Input
                id="emergencyLastName"
                value={formData.emergencyLastName}
                onChange={(e) => updateField("emergencyLastName", e.target.value)}
                disabled={readOnly}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="emergencyMobile">Mobile</Label>
              <Input
                id="emergencyMobile"
                value={formData.emergencyMobile}
                onChange={(e) => updateField("emergencyMobile", e.target.value)}
                disabled={readOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyRelation">Relation</Label>
              <Input
                id="emergencyRelation"
                value={formData.emergencyRelation}
                onChange={(e) => updateField("emergencyRelation", e.target.value)}
                disabled={readOnly}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Consent */}
      <Card>
        <CardHeader>
          <CardTitle>Consent & Declarations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="allowPhoto">Allow Photo</Label>
              <Select
                value={formData.allowPhoto}
                onValueChange={(v) => updateField("allowPhoto", v)}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {ALLOW_PHOTO_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="photoSharing">Photo Sharing</Label>
              <Select
                value={
                  PHOTO_SHARING_OPTIONS.find(
                    (o) => o.toLowerCase() === formData.photoSharing.toLowerCase()
                  ) ?? formData.photoSharing
                }
                onValueChange={(v) => updateField("photoSharing", v)}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {PHOTO_SHARING_OPTIONS.map((opt) => (
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

      {/* Status (read-only) */}
      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Family Status</Label>
              <Input value={formData.status} disabled />
            </div>
            <div className="space-y-2">
              <Label>Number of Children</Label>
              <Input value={formData.numberOfChildren} disabled />
            </div>
            <div className="space-y-2">
              <Label>Family ID</Label>
              <Input value={formData.id} disabled />
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
