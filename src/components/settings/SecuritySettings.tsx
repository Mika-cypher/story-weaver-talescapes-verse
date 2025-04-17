
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function SecuritySettings() {
  const { logout } = useAuth();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Security</CardTitle>
        <CardDescription>
          Manage account security settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-4">
          <Shield className="h-6 w-6 text-muted-foreground" />
          <div className="space-y-1">
            <h4 className="text-sm font-medium">Account Verification</h4>
            <p className="text-sm text-muted-foreground">
              Your account is verified and secure
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button variant="outline" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={logout}>
          Sign out from all devices
        </Button>
      </CardFooter>
    </Card>
  );
}
