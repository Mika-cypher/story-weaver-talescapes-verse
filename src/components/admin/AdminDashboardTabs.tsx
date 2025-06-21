
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Upload, Database, Settings, Users } from "lucide-react";
import { NotionImporter } from "./NotionImporter";

export const AdminDashboardTabs: React.FC = () => {
  return (
    <Tabs defaultValue="import" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="import" className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Import
        </TabsTrigger>
        <TabsTrigger value="stories" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Stories
        </TabsTrigger>
        <TabsTrigger value="users" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Users
        </TabsTrigger>
        <TabsTrigger value="settings" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Settings
        </TabsTrigger>
      </TabsList>

      <TabsContent value="import" className="mt-6">
        <NotionImporter />
      </TabsContent>

      <TabsContent value="stories" className="mt-6">
        <div className="text-center py-8 text-muted-foreground">
          Story management coming soon...
        </div>
      </TabsContent>

      <TabsContent value="users" className="mt-6">
        <div className="text-center py-8 text-muted-foreground">
          User management coming soon...
        </div>
      </TabsContent>

      <TabsContent value="settings" className="mt-6">
        <div className="text-center py-8 text-muted-foreground">
          Settings coming soon...
        </div>
      </TabsContent>
    </Tabs>
  );
};
