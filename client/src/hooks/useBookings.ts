import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Booking } from "@/types";
import { MOCK_USER_ID } from "@/lib/data";

export function useUserBookings() {
  return useQuery<(Booking & { item?: any })[]>({
    queryKey: ["/api/bookings/user", MOCK_USER_ID],
    queryFn: async () => {
      try {
        // apiRequest now already returns the parsed JSON
        const data = await apiRequest(`/api/bookings/user/${MOCK_USER_ID}`);
        return data || []; // Return data or empty array if null
      } catch (error) {
        console.error("Error fetching user bookings:", error);
        return [];
      }
    }
  });
}

export function useCreateBooking() {
  return useMutation({
    mutationFn: async (booking: {
      itemId: number;
      startDate: Date | string;
      endDate: Date | string;
      totalPrice: number;
      location?: string;
    }) => {
      const payload = {
        itemId: booking.itemId,
        startDate: booking.startDate instanceof Date 
          ? booking.startDate.toISOString().split('T')[0] 
          : booking.startDate,
        endDate: booking.endDate instanceof Date 
          ? booking.endDate.toISOString().split('T')[0] 
          : booking.endDate,
        totalPrice: booking.totalPrice,
        userId: MOCK_USER_ID,
        status: "active",
        location: booking.location || null
      };
      
      // For debugging
      console.log("Creating booking with payload:", payload);
      
      try {
        // Make API request with the properly formatted payload
        // apiRequest now automatically returns the JSON response
        const data = await apiRequest("POST", "/api/bookings", payload);
        console.log("Booking creation response:", data);
        return data;
      } catch (error) {
        console.error("Error creating booking:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings/user", MOCK_USER_ID] });
    }
  });
}

export function useUpdateBookingStatus() {
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      try {
        // apiRequest now returns JSON directly
        const data = await apiRequest("PATCH", `/api/bookings/${id}/status`, { status });
        console.log("Booking status update response:", data);
        return data || { id, status }; // Return data if available, fallback to input
      } catch (error) {
        console.error("Error updating booking status:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings/user", MOCK_USER_ID] });
    }
  });
}
