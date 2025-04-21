import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function NotFound() {
  const [_, navigate] = useLocation();
  
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6 pb-6">
          <div className="flex mb-4 gap-2 items-center">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
          </div>

          <p className="mt-4 mb-6 text-sm text-gray-600">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <Button 
            className="w-full bg-primary text-white hover:bg-blue-600"
            onClick={() => navigate("/")}
          >
            <Home className="mr-2 h-4 w-4" /> Return to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
