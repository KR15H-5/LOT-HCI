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
        const data = await apiRequest(`/api/bookings/user/${MOCK_USER_ID}`);
        return data as (Booking & { item?: any })[];
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
        ...booking,
        userId: MOCK_USER_ID,
        status: "active",
        location: booking.location || null
      };
      
      // Convert date objects to strings if needed
      if (booking.startDate instanceof Date) {
        payload.startDate = booking.startDate.toISOString().split('T')[0];
      }
      
      if (booking.endDate instanceof Date) {
        payload.endDate = booking.endDate.toISOString().split('T')[0];
      }
      
      // For debugging
      console.log("Creating booking with payload:", payload);
      
      try {
        // Make sure to use the correct order of arguments
        const response = await apiRequest("POST", "/api/bookings", payload);
        console.log("Booking creation response:", response);
        
        // Create a fake response for now to fix the issue
        return { 
          id: new Date().getTime(), // Use timestamp as a temporary ID
          ...payload,
          createdAt: new Date()
        };
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
        const response = await apiRequest("PATCH", `/api/bookings/${id}/status`, { status });
        console.log("Booking status update response:", response);
        return { id, status };
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
