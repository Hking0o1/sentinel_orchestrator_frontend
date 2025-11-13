import React, { useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import gsap from 'gsap';

// Validation Schema for Profile Form
const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
});

// Validation Schema for Password Form
const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1, { message: 'Current password is required.' }),
    newPassword: z.string().min(8, {
      message: 'New password must be at least 8 characters.',
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords don't match.",
    path: ['confirmPassword'],
  });

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;

/**
 * ProfileSettingsTab Component
 */
const ProfileSettingsTab = () => {
  const { user } = useAuth();
  // Placeholder for mutation
  const [isUpdating, setIsUpdating] = React.useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    console.log('Updating profile...', data);
    setIsUpdating(true);
    // Placeholder: await useUpdateProfile.mutateAsync(data);
    setTimeout(() => {
      toast.success('Profile updated successfully!');
      setIsUpdating(false);
    }, 1000);
  };

  return (
    <Card className="bg-primary-light border-neutral-700 text-neutral-100">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription className="text-neutral-400">
          Manage your public profile and personal information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-300">Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Name" {...field} className="bg-primary-dark border-neutral-600" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-300">Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="your@email.com" {...field} className="bg-primary-dark border-neutral-600" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="bg-accent-blue text-neutral-100 hover:bg-accent-blue/90"
              disabled={isUpdating}
            >
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

/**
 * SecuritySettingsTab Component
 */
const SecuritySettingsTab = () => {
  // Placeholder for mutation
  const [isUpdating, setIsUpdating] = React.useState(false);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: PasswordFormValues) => {
    console.log('Updating password...', data);
    setIsUpdating(true);
    // Placeholder: await useChangePassword.mutateAsync(data);
    setTimeout(() => {
      if (data.currentPassword === 'wrong') {
        toast.error('Current password is incorrect.');
        form.setError('currentPassword', { message: 'Incorrect password.' });
      } else {
        toast.success('Password changed successfully!');
        form.reset();
      }
      setIsUpdating(false);
    }, 1000);
  };

  return (
    <Card className="bg-primary-light border-neutral-700 text-neutral-100">
      <CardHeader>
        <CardTitle>Security</CardTitle>
        <CardDescription className="text-neutral-400">
          Manage your password, two-factor authentication, and account security.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Change Password */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <h3 className="text-lg font-medium text-neutral-200">
              Change Password
            </h3>
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-300">Current Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} className="bg-primary-dark border-neutral-600" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-300">New Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} className="bg-primary-dark border-neutral-600" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-300">Confirm New Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} className="bg-primary-dark border-neutral-600" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="bg-accent-blue text-neutral-100 hover:bg-accent-blue/90"
              disabled={isUpdating}
            >
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Password
            </Button>
          </form>
        </Form>

        <Separator className="bg-neutral-700" />

        {/* Two-Factor Authentication */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-neutral-200">
            Two-Factor Authentication (2FA)
          </h3>
          <div className="flex items-center justify-between p-4 bg-primary-dark rounded-md border border-neutral-700">
            <p className="text-neutral-300">Enable 2FA</p>
            <Switch id="2fa-switch" className="data-[state=checked]:bg-accent-gold" />
          </div>
        </div>

        <Separator className="bg-neutral-700" />

        {/* Delete Account */}
        <div>
          <h3 className="text-lg font-medium text-red-500">Delete Account</h3>
          <p className="text-neutral-400 mb-4">
            Permanently delete your account and all associated data. This action
            cannot be undone.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="bg-red-700 hover:bg-red-800">
                Delete My Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-primary-dark border-neutral-700 text-neutral-100">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-accent-gold">
                  Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-neutral-400">
                  This action cannot be undone. This will permanently delete your
                  account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-neutral-700 border-neutral-600 hover:bg-neutral-800">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction className="bg-red-700 hover:bg-red-800">
                  Yes, delete account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * SettingsPage Component
 * This is the main container for all settings, organized by tabs.
 */
export const SettingsPage = () => {
  const tabsRef = useRef(null);

  // GSAP animation for tab content
  useEffect(() => {
    // Select the TabsContent elements
    const tabsContent = gsap.utils.toArray('.settings-tab-content');
    
    // Set initial state
    gsap.set(tabsContent, { opacity: 0, y: 20 });
    
    // Animate the default tab
    gsap.to(tabsContent[0], {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power3.out',
    });
    
  }, []);
  
  // Animate tab changes
  const onTabChange = (value: string) => {
    const tabsContent = gsap.utils.toArray('.settings-tab-content');
    const target = tabsContent.find((el: any) => el.dataset.state === 'active');
    
    if (target) {
      gsap.fromTo(target, 
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power3.out',
        }
      );
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* --- 1. Page Header --- */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-100">Settings</h1>
        <p className="text-lg text-neutral-400">
          Manage your account and application settings.
        </p>
      </div>

      {/* --- 2. Tabs for Content --- */}
      <Tabs defaultValue="profile" className="w-full text-neutral-300" onValueChange={onTabChange}>
        <TabsList className="grid w-full grid-cols-2 max-w-lg bg-primary-light border-neutral-700">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <div ref={tabsRef}>
          <TabsContent value="profile" className="mt-6 settings-tab-content">
            <ProfileSettingsTab />
          </TabsContent>

          <TabsContent value="security" className="mt-6 settings-tab-content">
            <SecuritySettingsTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default SettingsPage;

