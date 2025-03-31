import { useParams, Link } from "wouter";
import { ArrowLeft, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBar from "@/components/layout/StatusBar";
import HomeIndicator from "@/components/layout/HomeIndicator";
import { useItemById } from "@/hooks/useItems";
import { useUserBookings } from "@/hooks/useBookings";
import { formatDateRange } from "@/lib/data";

export default function ConfirmationPage() {
  const params = useParams<{ id: string }>();
  const itemId = params?.id ? parseInt(params.id) : null;

  const { data: item, isLoading } = useItemById(itemId);
  const { data: bookings } = useUserBookings();

  // Get the most recent booking for this item
  const currentBooking = bookings?.filter(b => b.itemId === itemId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

  if (isLoading || !item) {
    return (
      <div className="min-h-screen bg-background flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <StatusBar />
      
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/">
            <a className="p-1">
              <ArrowLeft className="h-6 w-6" />
            </a>
          </Link>
          <button className="p-1">
            <Share2 className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-col items-center mb-8">
          <h1 className="text-2xl font-bold mb-6">Booking Confirmed!</h1>
          
          {/* Item Summary */}
          <div className="w-full flex items-center mb-4">
            <div className="w-16 h-16 bg-gray-200 rounded-lg mr-3 overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-semibold">{item.name}</h2>
              <p className="text-gray-500 text-sm">
                Dates: {currentBooking ? formatDateRange(currentBooking.startDate, currentBooking.endDate) : ""}
              </p>
            </div>
          </div>

          {/* Item Image */}
          <div className="w-full mb-6">
            <img
              src={item.additionalImages?.[0] || item.image}
              alt={item.name}
              className="w-full rounded-lg"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button variant="secondary" className="w-full">
            Contact Owner
          </Button>
          <Link href="/profile">
            <Button className="w-full">
              View Rentals
            </Button>
          </Link>
        </div>
      </div>
      
      <HomeIndicator />
    </div>
  );
}
