import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function AdminLoginPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-128px)] bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="admin@example.com" required />
            </div>
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/admin/forgot-password" passHref>
                        <span className="text-sm underline cursor-pointer">
                            Forgot password?
                        </span>
                    </Link>
                </div>
              <Input id="password" type="password" required />
            </div>
            <Link href="/admin/dashboard" className="w-full">
              <Button className="w-full">Sign In</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
