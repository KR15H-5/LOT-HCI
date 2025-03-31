import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { ArrowLeft, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBar from "@/components/layout/StatusBar";
import HomeIndicator from "@/components/layout/HomeIndicator";
import { DatePicker } from "@/components/ui/date-picker";
import { useItemById } from "@/hooks/useItems";
import { useCreateBooking } from "@/hooks/useBookings";
import { formatDate, getDateXDaysFromNow } from "@/lib/data";
import { ReactNode } from "react";

export default function BookingPage() {
  const [locationPath, navigate] = useLocation();
  // Parse the query parameter
  const params = new URLSearchParams(window.location.search);
  const itemId = params.get('itemId') ? parseInt(params.get('itemId')!) : null;
  
  // Log for debugging
  console.log("BookingPage: itemId from query params:", itemId);
  
  useEffect(() => {
    // For debugging only
    console.log("Current location:", locationPath);
    console.log("Item ID from query:", itemId);
  }, [locationPath, itemId]);

  const { data: item, isLoading } = useItemById(itemId);
  const createBooking = useCreateBooking();

  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(getDateXDaysFromNow(1));
  const [pickupLocation, setPickupLocation] = useState<string>("Lenton");

  if (isLoading || !item) {
    return (
      <div className="min-h-screen bg-background flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleCreateBooking = (priceOption: "day" | "week") => {
    // Convert to Date objects for calculation if they aren't already
    const startDateObj = startDate instanceof Date ? startDate : new Date(startDate);
    const endDateObj = endDate instanceof Date ? endDate : new Date(endDate);
    
    // Calculate days between dates
    const days = Math.max(1, Math.ceil((endDateObj.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24)));
    
    // Calculate total price based on option
    const totalPrice = priceOption === "day" 
      ? item.pricePerDay * days
      : item.pricePerWeek || (item.pricePerDay * 7);

    console.log(`Creating booking for ${days} days at ${priceOption} rate`);

    createBooking.mutate({
      itemId: item.id,
      startDate: startDateObj,
      endDate: endDateObj,
      totalPrice,
      location: pickupLocation
    }, {
      onSuccess: (data) => {
        console.log("Booking created successfully:", data);
        // Data now contains the actual booking with an ID
        navigate(`/confirmation/${item.id}?bookingId=${data.id}`);
      },
      onError: (error) => {
        console.error("Error creating booking:", error);
        alert("There was an error creating your booking. Please try again.");
      }
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <StatusBar />
      
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button className="p-1 mr-2" onClick={() => navigate(`/items/${item.id}`)}>
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-bold">Confirm Booking</h1>
          </div>
          <button className="p-1">
            <Share2 className="h-6 w-6" />
          </button>
        </div>

        {/* Item Summary */}
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 bg-gray-200 rounded-lg mr-3 overflow-hidden">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="font-semibold text-lg">{item.name}</h2>
            <p className="text-gray-500 text-sm">{item.description}</p>
          </div>
        </div>

        {/* Rental Period */}
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Rental Period</h2>
          <DatePicker
            startDate={startDate}
            endDate={endDate}
            onChangeStartDate={setStartDate}
            onChangeEndDate={setEndDate}
            maxDays={item.maxHireDuration}
          />
        </div>

        {/* Selected Dates Summary */}
        <div className="flex justify-between mb-6 text-sm">
          <div>
            <p className="text-gray-500">Start</p>
            <p className="font-medium">{formatDate(startDate)}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-500">End</p>
            <p className="font-medium">{formatDate(endDate)}</p>
          </div>
        </div>

        {/* Location */}
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Location</h2>
          <p className="text-gray-600">{pickupLocation}</p>
        </div>

        {/* Owner Information */}
        <div className="mb-6 flex items-center">
          <div className="w-12 h-12 bg-gray-200 rounded-full mr-3 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
              alt="Owner"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="font-semibold">Jane Doe</h2>
            <p className="text-gray-500 text-sm">Carpenter</p>
          </div>
        </div>

        {/* Pricing Options */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Button 
            className="py-3" 
            onClick={() => handleCreateBooking('day')}
            disabled={createBooking.isPending}
          >
            ${item.pricePerDay}/day
          </Button>
          {item.pricePerWeek && (
            <Button 
              variant="secondary" 
              className="py-3" 
              onClick={() => handleCreateBooking('week')}
              disabled={createBooking.isPending}
            >
              ${item.pricePerWeek}/week
            </Button>
          )}
        </div>
      </div>
      
      <HomeIndicator />
    </div>
  );
}
