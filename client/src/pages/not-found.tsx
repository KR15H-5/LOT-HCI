import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft, Home } from "lucide-react";
import StatusBar from "@/components/layout/StatusBar";
import HomeIndicator from "@/components/layout/HomeIndicator";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-gray-50">
      <StatusBar />
      
      <div className="px-4 pt-16 pb-20 flex flex-col items-center justify-center min-h-[80vh]">
        <div className="rounded-full h-24 w-24 bg-red-50 flex items-center justify-center mb-6">
          <AlertTriangle className="h-12 w-12 text-red-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-2">Page Not Found</h1>
        <p className="text-gray-500 text-center mb-8 max-w-xs">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex gap-4">
          <Link href="/search">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Search
            </Button>
          </Link>
          <Link href="/">
            <Button className="gap-2">
              <Home className="h-4 w-4" /> Go Home
            </Button>
          </Link>
        </div>
        
        <div className="mt-12">
          <img 
            src="https://images.unsplash.com/photo-1508007226033-28f8bfad3631?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
            alt="Confused person"
            className="w-full max-w-sm rounded-lg shadow-md opacity-70"
          />
        </div>
      </div>
      
      <HomeIndicator />
    </div>
  );
}
