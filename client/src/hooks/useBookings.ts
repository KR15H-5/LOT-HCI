import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Booking } from "@/types";
import { MOCK_USER_ID } from "@/lib/data";

export function useUserBookings() {
  return useQuery<(Booking & { item?: any })[]>({
    queryKey: ["/api/bookings/user", MOCK_USER_ID],
    queryFn: async () => {
      const response = await apiRequest(`/api/bookings/user/${MOCK_USER_ID}`);
      return response as (Booking & { item?: any })[];
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
        status: "active"
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
      
      const response = await apiRequest("POST", "/api/bookings", payload);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings/user", MOCK_USER_ID] });
    }
  });
}

export function useUpdateBookingStatus() {
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await apiRequest("PATCH", `/api/bookings/${id}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings/user", MOCK_USER_ID] });
    }
  });
}
