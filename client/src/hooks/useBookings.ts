import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Booking } from "@/types";
import { MOCK_USER_ID } from "@/lib/data";

export function useUserBookings() {
  return useQuery<(Booking & { item?: any })[]>({
    queryKey: ["/api/bookings/user", MOCK_USER_ID],
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
      const response = await apiRequest("POST", "/api/bookings", {
        ...booking,
        userId: MOCK_USER_ID,
        status: "active"
      });
      return response.json();
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
