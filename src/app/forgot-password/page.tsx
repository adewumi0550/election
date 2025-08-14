'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const { sendPasswordResetEmail } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(email);
      toast({ title: 'Email Sent', description: 'Check your inbox for a password reset link.' });
      setIsEmailSent(true);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to send password reset email.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
     <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
      <Card className="w-full max-w-sm">
        {isEmailSent ? (
            <>
                <CardHeader className="text-center">
                    <Shield className="mx-auto h-12 w-12 text-primary" />
                    <CardTitle className="mt-4">Check Your Email</CardTitle>
                    <CardDescription>A password reset link has been sent to <strong>{email}</strong>. Please follow the instructions in the email to reset your password.</CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button asChild className="w-full">
                        <Link href="/login">Back to Sign In</Link>
                    </Button>
                </CardFooter>
            </>
        ) : (
            <form onSubmit={handleResetPassword}>
            <CardHeader className="text-center">
                <Shield className="mx-auto h-12 w-12 text-primary" />
                <CardTitle className="mt-4">Forgot Password?</CardTitle>
                <CardDescription>No problem. Enter your email address and we&apos;ll send you a link to reset it.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="admin@example.com"
                />
                </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Reset Link
                </Button>
                 <Button asChild variant="link" className="w-full">
                    <Link href="/login">
                        Back to Sign In
                    </Link>
                </Button>
            </CardFooter>
            </form>
        )}
      </Card>
    </div>
  )
}
