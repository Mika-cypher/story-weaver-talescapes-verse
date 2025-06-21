
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { notionImportService } from "@/services/notionImportService";

export const NotionImporter: React.FC = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ success: boolean; message: string; count: number } | null>(null);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/csv') {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file",
        variant: "destructive"
      });
      return;
    }

    setIsImporting(true);
    setImportResult(null);

    try {
      const csvContent = await file.text();
      const result = await notionImportService.importFromNotionCSV(csvContent);
      
      setImportResult(result);
      
      if (result.success) {
        toast({
          title: "Import successful!",
          description: result.message,
        });
      } else {
        toast({
          title: "Import failed",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setImportResult({ 
        success: false, 
        message: errorMessage, 
        count: 0 
      });
      
      toast({
        title: "Import error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
      // Reset file input
      event.target.value = '';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Import Stories from Notion
        </CardTitle>
        <CardDescription>
          Upload a CSV file exported from your Notion database with columns: Name, Author, Category, Created, Tags
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="csv-upload">Select CSV File</Label>
          <Input
            id="csv-upload"
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            disabled={isImporting}
            className="cursor-pointer"
          />
        </div>

        <div className="text-sm text-muted-foreground">
          <p className="font-medium mb-2">Expected CSV format:</p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Name:</strong> Story title</li>
            <li><strong>Author:</strong> Author name (will create profile if needed)</li>
            <li><strong>Category:</strong> Story category (used as description)</li>
            <li><strong>Created:</strong> Creation date (optional)</li>
            <li><strong>Tags:</strong> Story tags (currently stored in description)</li>
          </ul>
        </div>

        {isImporting && (
          <div className="flex items-center gap-2 text-primary">
            <Upload className="h-4 w-4 animate-spin" />
            <span>Importing stories...</span>
          </div>
        )}

        {importResult && (
          <div className={`flex items-center gap-2 p-3 rounded-md ${
            importResult.success 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {importResult.success ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <span className="text-sm">{importResult.message}</span>
          </div>
        )}

        <div className="text-xs text-muted-foreground border-t pt-4">
          <p><strong>Note:</strong> This will create author profiles automatically if they don't exist. Stories will be imported as published content.</p>
        </div>
      </CardContent>
    </Card>
  );
};
