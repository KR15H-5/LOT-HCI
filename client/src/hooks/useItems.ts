import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Item } from "@/types";
import { MOCK_USER_ID } from "@/lib/data";

export function useAllItems() {
  return useQuery<Item[]>({
    queryKey: ["/api/items"],
  });
}

export function useItemsByCategory(category: string | null) {
  return useQuery<Item[]>({
    queryKey: ["/api/items/category", category],
    enabled: !!category,
  });
}

export function useItemById(id: number | null) {
  return useQuery<Item>({
    queryKey: ["/api/items", id],
    enabled: !!id,
  });
}

export function useItemDetails(id: number | null) {
  const itemQuery = useItemById(id);
  
  // Record view if item is loaded successfully
  const recordViewMutation = useMutation({
    mutationFn: async () => {
      if (!id) return;
      await apiRequest("POST", "/api/recently-viewed", {
        userId: MOCK_USER_ID,
        itemId: id
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recently-viewed", MOCK_USER_ID] });
    }
  });
  
  if (itemQuery.data && !itemQuery.isLoading && !recordViewMutation.isPending) {
    recordViewMutation.mutate();
  }
  
  return itemQuery;
}
