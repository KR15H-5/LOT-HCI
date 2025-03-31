import { useParams, useLocation, Link } from "wouter";
import { ArrowLeft, Share2, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBar from "@/components/layout/StatusBar";
import HomeIndicator from "@/components/layout/HomeIndicator";
import { useItemById } from "@/hooks/useItems";
import { useUserBookings } from "@/hooks/useBookings";
import { formatDateRange } from "@/lib/data";

export default function ConfirmationPage() {
  const params = useParams<{ id: string }>();
  const [location] = useLocation();
  const itemId = params?.id ? parseInt(params.id) : null;
  
  // Extract bookingId from URL query parameters if available
  const urlSearchParams = new URLSearchParams(location.split('?')[1] || '');
  const bookingIdParam = urlSearchParams.get('bookingId');
  const bookingId = bookingIdParam ? parseInt(bookingIdParam) : null;

  const { data: item, isLoading } = useItemById(itemId);
  const { data: bookings } = useUserBookings();

  // Get the specific booking by ID or the most recent booking for this item
  const currentBooking = bookingId 
    ? bookings?.find(b => b.id === bookingId)
    : bookings?.filter(b => b.itemId === itemId)
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
          {/* Confirmation Animation */}
          <div className="mb-6 flex flex-col items-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">Booking Confirmed!</h1>
            <p className="text-gray-500 text-center">Your booking has been confirmed and is ready for pickup.</p>
          </div>
          
          {/* Item Summary with Shadow */}
          <div className="w-full bg-white rounded-xl shadow-lg p-4 mb-6">
            <div className="flex items-center mb-3">
              <div className="w-16 h-16 bg-gray-200 rounded-lg mr-3 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="font-semibold">{item.name}</h2>
                <p className="text-gray-500 text-sm truncate max-w-[200px]">{item.description}</p>
              </div>
            </div>
            
            {/* Booking Details */}
            {currentBooking && (
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center mb-2">
                  <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                  <p className="text-sm text-gray-600">
                    {formatDateRange(currentBooking.startDate, currentBooking.endDate)}
                  </p>
                </div>
                {currentBooking.location && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                    <p className="text-sm text-gray-600">{currentBooking.location}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Item Image */}
          <div className="w-full mb-6 rounded-xl overflow-hidden shadow-md">
            <img
              src={item.additionalImages?.[0] || item.image}
              alt={item.name}
              className="w-full h-40 object-cover"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button variant="secondary" className="w-full h-12 text-base">
            Contact Owner
          </Button>
          <Link href="/profile">
            <Button className="w-full h-12 text-base bg-gradient-to-r from-primary to-primary/90">
              View Rentals
            </Button>
          </Link>
        </div>
      </div>
      
      <HomeIndicator />
    </div>
  );
}
