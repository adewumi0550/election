import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-128px)] bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
          <CardDescription>Enter your email to receive a password reset link.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="admin@example.com" required />
            </div>
            <Button className="w-full">Send Reset Link</Button>
            <div className="text-center text-sm">
                <Link href="/admin" className="underline">
                    Back to Login
                </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
