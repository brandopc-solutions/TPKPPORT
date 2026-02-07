import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreditCard } from "lucide-react";

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Payments & Invoices</h1>
        <p className="text-muted-foreground">
          View payment history and outstanding invoices.
        </p>
      </div>

      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto rounded-full bg-muted p-4 w-fit">
            <CreditCard className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            Payment history and invoice management will be available in a future
            update.
          </CardDescription>
        </CardHeader>
        <CardContent />
      </Card>
    </div>
  );
}
