
import React from "react";
import { Separator } from "@/components/ui/separator";
import { ProfileForm } from "@/components/settings/ProfileForm";
import { PasswordForm } from "@/components/settings/PasswordForm";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";

export function AccountSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Account Settings</h3>
        <p className="text-sm text-muted-foreground">
          Update your account information and password
        </p>
      </div>
      <Separator />
      
      <ProfileForm />
      <PasswordForm />
      <NotificationSettings />
      <SecuritySettings />
    </div>
  );
}
