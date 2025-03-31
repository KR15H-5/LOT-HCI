import { useState } from "react";
import { Link } from "wouter";
import { Edit, LogOut, Settings } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import StatusBar from "@/components/layout/StatusBar";
import BottomNavigation from "@/components/layout/BottomNavigation";
import HomeIndicator from "@/components/layout/HomeIndicator";
import { useUserBookings } from "@/hooks/useBookings";
import { ItemCard } from "@/components/ui/item-card";
import { MOCK_USER_ID } from "@/lib/data";

export default function ProfilePage() {
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: [`/api/users/${MOCK_USER_ID}`],
  });
  
  const { data: bookings, isLoading: isLoadingBookings } = useUserBookings();
  
  const { data: certificates, isLoading: isLoadingCertificates } = useQuery({
    queryKey: [`/api/certificates/${MOCK_USER_ID}`],
  });

  // Group bookings by status
  const currentBookings = bookings?.filter(booking => 
    booking.status === "active" || booking.status === "returning"
  ) || [];
  
  const pastBookings = bookings?.filter(booking => 
    booking.status === "completed"
  ) || [];

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-background flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-background">
      <StatusBar />
      
      <div className="p-4">
        {/* User Info */}
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 bg-gray-200 rounded-full mr-3 overflow-hidden">
            <img
              src={user?.profileImage || "https://via.placeholder.com/150"}
              alt={user?.fullName}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-lg font-bold">{user?.fullName}</h1>
            <p className="text-gray-500">{user?.occupation}</p>
          </div>
        </div>

        {/* Current Rentals */}
        <h2 className="font-semibold mb-3">Current Rentals</h2>
        {isLoadingBookings ? (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-100 rounded-lg h-40 animate-pulse"></div>
            <div className="bg-gray-100 rounded-lg h-40 animate-pulse"></div>
          </div>
        ) : currentBookings.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 mb-6">
            {currentBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <ItemCard item={booking.item!} />
                <div className="p-2 border-t border-gray-50">
                  <p className={`text-xs ${
                    booking.status === "active" ? "text-green-600" : "text-yellow-600"
                  }`}>
                    {booking.status === "active" ? "Active" : "Returning Soon"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No current rentals</p>
          </div>
        )}

        {/* Past Rentals */}
        <h2 className="font-semibold mb-3">Past Rentals</h2>
        {isLoadingBookings ? (
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-gray-100 rounded-lg h-32 animate-pulse"></div>
            <div className="bg-gray-100 rounded-lg h-32 animate-pulse"></div>
            <div className="bg-gray-100 rounded-lg h-32 animate-pulse"></div>
          </div>
        ) : pastBookings.length > 0 ? (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {pastBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <ItemCard item={booking.item!} size="sm" />
                <div className="p-2 border-t border-gray-50">
                  <p className="text-[10px] text-gray-500">Completed</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No past rentals</p>
          </div>
        )}

        {/* Certificates */}
        <h2 className="font-semibold mb-3">Certificates</h2>
        {isLoadingCertificates ? (
          <div className="flex space-x-3 mb-6">
            <div className="bg-gray-100 rounded-lg h-8 w-24 animate-pulse"></div>
            <div className="bg-gray-100 rounded-lg h-8 w-24 animate-pulse"></div>
            <div className="bg-gray-100 rounded-lg h-8 w-24 animate-pulse"></div>
          </div>
        ) : certificates && certificates.length > 0 ? (
          <div className="flex flex-wrap gap-3 mb-6">
            {certificates.map((certificate) => (
              <div key={certificate.id} className="bg-secondary rounded-lg px-3 py-2">
                <p className="text-xs text-primary font-medium">{certificate.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No certificates yet</p>
          </div>
        )}

        {/* Settings */}
        <h2 className="font-semibold mb-3">Settings</h2>
        <div className="space-y-3">
          <Link href="/profile/edit">
            <a className="w-full flex items-center justify-between py-2 text-left">
              <div className="flex items-center">
                <Edit className="text-gray-400 h-5 w-5 mr-3" />
                <span>Edit Profile</span>
              </div>
              <span className="text-gray-400">&gt;</span>
            </a>
          </Link>
          <Link href="/logout">
            <a className="w-full flex items-center justify-between py-2 text-left">
              <div className="flex items-center">
                <LogOut className="text-gray-400 h-5 w-5 mr-3" />
                <span>Logout</span>
              </div>
              <span className="text-gray-400">&gt;</span>
            </a>
          </Link>
          <Link href="/settings/accessibility">
            <a className="w-full flex items-center justify-between py-2 text-left">
              <div className="flex items-center">
                <Settings className="text-gray-400 h-5 w-5 mr-3" />
                <span>Accessible Layout</span>
              </div>
              <span className="text-gray-400">&gt;</span>
            </a>
          </Link>
        </div>
      </div>
      
      <BottomNavigation />
      <HomeIndicator />
    </div>
  );
}
