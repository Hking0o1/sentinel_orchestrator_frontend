import {useRef, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import * as authService from '@/services/authService';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';

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
import { AlertCircle, Loader2, ShieldCheck } from 'lucide-react';

// 1. Define the validation schema with Zod
const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
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
  const cardRef = useRef(null);
  const [apiError, setApiError] = useState<string | null>(null);

  // 3. Set up react-hook-form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
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
      // --- THIS IS THE REAL API CALL ---
      const { user, access_token } = await authService.login({
        username: values.email,
        password: values.password
      });
      // ---------------------------------

      // Use the login function from our AuthContext
      login(user, access_token);
      
      // Redirect to the dashboard
      navigate('/');

    } catch (error: any) {
      setApiError(error.message || 'An unknown error occurred.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-primary-dark p-4">
      <Card
        ref={cardRef}
        className="w-full max-w-md bg-primary-light border-border text-foreground shadow-2xl shadow-accent-gold/10"
      >
        <CardHeader className="text-center items-center">
          <div className="p-3 bg-primary-dark rounded-full mb-4 border border-border">
            <ShieldCheck className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold text-primary">
            Project Sentinel
          </CardTitle>
          <CardDescription className="text-muted-foreground pt-2">
            Please log in to access the security dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* API Error Message */}
              {apiError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Login Failed</AlertTitle>
                  <AlertDescription>{apiError}</AlertDescription>
                </Alert>
              )}

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="admin@example.com"
                        {...field}
                        className="bg-primary-dark border-border focus:ring-ring"
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
                    <FormLabel className="text-muted-foreground">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        className="bg-primary-dark border-border focus:ring-ring"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground font-bold hover:bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  'Log In'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" className="text-muted-foreground hover:text-primary">
            Forgot password?
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;