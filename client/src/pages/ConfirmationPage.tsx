import { useLocation, Link } from "wouter";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBar from "@/components/layout/StatusBar";
import HomeIndicator from "@/components/layout/HomeIndicator";

export default function ConfirmationPage() {
  const [location, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <StatusBar />

      <div className="p-4 flex items-center justify-between">
        <Link href="/">
          <a className="p-1">
            <ArrowLeft className="h-6 w-6" />
          </a>
        </Link>
      </div>

      {/* Confirmation Message */}
      <div className="flex-1 flex flex-col justify-center items-center text-center px-4">
        <div className="bg-green-100 p-4 rounded-full mb-6">
          <CheckCircle className="w-16 h-16 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Booking Confirmed!</h1>
        <p className="text-gray-500 max-w-sm">
          Your booking has been confirmed and is ready for pickup.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="p-4 space-y-3">
        <Button 
          className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => navigate("/chat")}
        >
          Contact Owner
        </Button>
        <Link href="/profile">
          <Button className="w-full h-12 text-base bg-gradient-to-r from-primary to-primary/90">
            View Rentals
          </Button>
        </Link>
      </div>

      <HomeIndicator />
    </div>
  );
}
