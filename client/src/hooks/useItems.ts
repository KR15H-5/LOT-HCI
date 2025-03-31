import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Item } from "@/types";
import { MOCK_USER_ID } from "@/lib/data";
import { useEffect, useRef } from "react";

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
  const viewRecorded = useRef(false);
  
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
  
  // Use useEffect to ensure we only record the view once when the item loads
  useEffect(() => {
    if (itemQuery.data && !itemQuery.isLoading && !viewRecorded.current && !recordViewMutation.isPending) {
      viewRecorded.current = true;
      recordViewMutation.mutate();
    }
  }, [itemQuery.data, itemQuery.isLoading, recordViewMutation]);
  
  return itemQuery;
}
