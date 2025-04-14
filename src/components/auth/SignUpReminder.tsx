
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SignUpReminderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SignUpReminder: React.FC<SignUpReminderProps> = ({ open, onOpenChange }) => {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-background border-border">
        <AlertDialogHeader>
          <div className="flex items-center justify-between">
            <AlertDialogTitle className="text-foreground">Join Talescapes Beta!</AlertDialogTitle>
            <span className="beta-badge">BETA</span>
          </div>
          <AlertDialogDescription className="text-muted-foreground">
            Sign up now to be part of our beta test and unlock features like:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Like and save your favorite stories</li>
              <li>Create and share your own interactive tales</li>
              <li>Connect with our community of storytellers</li>
              <li>Get early access to new beta features</li>
              <li>Help shape the future of Talescapes</li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-background text-foreground border-border hover:bg-muted">
            Maybe Later
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Link to="/signup" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Join Beta
            </Link>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SignUpReminder;
