import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { SavedItem, RecentlyViewedItem } from "@/types";
import { MOCK_USER_ID } from "@/lib/data";

export function useSavedItems() {
  return useQuery<(SavedItem & { item: any })[]>({
    queryKey: ["/api/saved-items", MOCK_USER_ID],
  });
}

export function useSaveItem() {
  return useMutation({
    mutationFn: async (itemId: number) => {
      const response = await apiRequest("POST", "/api/saved-items", {
        userId: MOCK_USER_ID,
        itemId
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/saved-items", MOCK_USER_ID] });
    }
  });
}

export function useRemoveSavedItem() {
  return useMutation({
    mutationFn: async (itemId: number) => {
      await apiRequest("DELETE", `/api/saved-items/${MOCK_USER_ID}/${itemId}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/saved-items", MOCK_USER_ID] });
    }
  });
}

export function useRecentlyViewedItems() {
  return useQuery<(RecentlyViewedItem & { item: any })[]>({
    queryKey: ["/api/recently-viewed", MOCK_USER_ID],
  });
}
