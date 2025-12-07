import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-primary-dark text-neutral-100 p-4">
      <ShieldAlert className="h-24 w-24 text-accent-gold mb-6" />
      <h1 className="text-4xl font-bold mb-2 text-center">404</h1>
      <h2 className="text-2xl font-semibold mb-4 text-center">Page Not Found</h2>
      <p className="text-neutral-400 mb-8 text-center max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Button 
        onClick={() => navigate('/app/dashboard')}
        className="bg-accent-gold text-primary-dark hover:bg-accent-gold/90 font-bold px-8"
      >
        Back to Dashboard
      </Button>
    </div>
  );
};

export default NotFoundPage;