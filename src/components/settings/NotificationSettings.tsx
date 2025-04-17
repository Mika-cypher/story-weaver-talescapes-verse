
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function NotificationSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          Manage how we contact you
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <label className="text-sm font-medium">Email Notifications</label>
            <p className="text-sm text-muted-foreground">
              Receive email notifications about story updates and activity
            </p>
          </div>
          <Switch 
            checked={emailNotifications} 
            onCheckedChange={setEmailNotifications}
          />
        </div>
      </CardContent>
    </Card>
  );
}
