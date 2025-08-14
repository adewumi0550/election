
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { createAdminUser } from '@/lib/data';

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (password.length < 6) {
        toast({
            variant: 'destructive',
            title: 'Registration Failed',
            description: 'Password must be at least 6 characters long.',
        });
        setIsLoading(false);
        return;
    }

    try {
      const result = await createAdminUser(name, email, password);

      if (result.success) {
        toast({ title: 'Registration Successful', description: result.message });
        setIsSuccess(true);
      } else {
        toast({
          variant: 'destructive',
          title: 'Registration Failed',
          description: result.message,
        });
      }
    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Registration Failed',
            description: 'An unexpected error occurred during registration.',
        });
    }

    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
      <Card className="w-full max-w-sm">
        {isSuccess ? (
            <>
                <CardHeader className="text-center">
                    <UserPlus className="mx-auto h-12 w-12 text-primary" />
                    <CardTitle className="mt-4">Registration Successful!</CardTitle>
                    <CardDescription>Your account has been created. You can now log in to the admin panel.</CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button asChild className="w-full">
                        <Link href="/admin-login">Proceed to Sign In</Link>
                    </Button>
                </CardFooter>
            </>
        ) : (
            <form onSubmit={handleRegister}>
            <CardHeader className="text-center">
                <UserPlus className="mx-auto h-12 w-12 text-primary" />
                <CardTitle className="mt-4">Create Admin Account</CardTitle>
                <CardDescription>Fill in the details to create an administrator account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="John Doe"
                    />
                </div>
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
                <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                />
                </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Account
                </Button>
                 <Button asChild variant="link" className="w-full">
                    <Link href="/admin-login">
                        Already have an account? Sign In
                    </Link>
                </Button>
            </CardFooter>
            </form>
        )}
      </Card>
    </div>
  );
}
