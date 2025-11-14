import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

interface AuthFormProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  submitText: string;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
  footer?: ReactNode;
  error?: string;
}

export function AuthForm({
  title,
  subtitle,
  children,
  submitText,
  onSubmit,
  isLoading = false,
  footer,
  error,
}: AuthFormProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">{title}</CardTitle>
          {subtitle && (
            <CardDescription className="text-center">
              {subtitle}
            </CardDescription>
          )}
        </CardHeader>
        
        <form onSubmit={onSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
                {error}
              </div>
            )}
            
            {children}
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : submitText}
            </Button>
            {footer}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
