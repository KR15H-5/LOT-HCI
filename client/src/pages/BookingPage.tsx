import { useLocation } from "wouter";
import StatusBar from "@/components/layout/StatusBar";
import HomeIndicator from "@/components/layout/HomeIndicator";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function BookingConfirmationPage() {
  const [, navigate] = useLocation();

  const handleContactOwner = () => {
    // You can update the hardcoded ID to the correct one dynamically if needed
    navigate("/chat/2"); 
  };

  return (
    <div className="min-h-screen bg-blue-200 flex flex-col justify-between">
      <StatusBar />

      {/* Main content centred vertically */}
      <div className="flex-1 flex flex-col justify-center items-center text-center px-4">
        <div className="bg-green-100 p-4 rounded-full mb-6">
          <CheckCircle className="w-16 h-16 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Booking Confirmed!</h1>
        <p className="text-gray-700 max-w-sm">
          Your booking has been confirmed and is ready for pickup.
        </p>
      </div>

      {/* Contact Owner button */}
      <div className="p-4">
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 text-base rounded-xl"
          onClick={handleContactOwner}
        >
          Contact Owner
        </Button>
      </div>

      <HomeIndicator />
    </div>
  );
}
