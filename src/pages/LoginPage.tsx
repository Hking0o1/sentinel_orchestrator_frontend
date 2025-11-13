import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import * as authService from '@/services/authService';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';

// 1. Define the validation schema with Zod
const formSchema = z.object({
  username: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z
    .string()
    .min(1, { message: 'Password is required.' }),
});

// 2. Define the type for the form data
type LoginFormValues = z.infer<typeof formSchema>;

/**
 * LoginPage Component
 * A fully functional login page with form validation,
 * API calls, and error handling.
 */
export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const cardRef = React.useRef(null);
  const [apiError, setApiError] = React.useState<string | null>(null);

  // 3. Set up react-hook-form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const { isSubmitting } = form.formState;

  // 4. Set up GSAP animation
  useGSAP(
    () => {
      gsap.from(cardRef.current, {
        duration: 0.7,
        opacity: 0,
        y: 50,
        ease: 'power3.out',
      });
    },
    { scope: cardRef }
  );

  // 5. Handle form submission
  const onSubmit = async (values: LoginFormValues) => {
    setApiError(null);
    try {
      const { user, access_token } = await authService.login({
        username: values.username,
        password: values.password,
      });
      login(user, access_token);
      navigate('/');
    } catch (error: any) {
      setApiError(error.message || 'An unknown error occurred.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-primary-dark p-4">
      <Card
        ref={cardRef}
        className="w-full max-w-md bg-primary-light border-neutral-700 text-neutral-100 shadow-2xl shadow-accent-gold/10"
      >
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-accent-gold">
            Sentinel
          </CardTitle>
          <CardDescription className="text-neutral-400 pt-2">
            Welcome back. Please log in to access the dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* API Error Message */}
              {apiError && (
                <Alert variant="destructive" className="bg-red-900/50 border-red-700">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Login Failed</AlertTitle>
                  <AlertDescription>{apiError}</AlertDescription>
                </Alert>
              )}

              {/* Email Field */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-neutral-300">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="admin@example.com"
                        {...field}
                        className="bg-primary-dark border-neutral-600 focus:border-accent-gold"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-neutral-300">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        className="bg-primary-dark border-neutral-600 focus:border-accent-gold"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-accent-gold text-primary-dark font-bold hover:bg-accent-gold/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" className="text-neutral-400 hover:text-accent-gold">
            Forgot password?
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;

