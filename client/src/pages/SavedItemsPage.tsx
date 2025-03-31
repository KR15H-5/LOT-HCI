import StatusBar from "@/components/layout/StatusBar";
import BottomNavigation from "@/components/layout/BottomNavigation";
import HomeIndicator from "@/components/layout/HomeIndicator";
import { ItemCard } from "@/components/ui/item-card";
import { useSavedItems } from "@/hooks/useSavedItems";
import { useRecentlyViewedItems } from "@/hooks/useSavedItems";
import { formatDate } from "@/lib/data";

export default function SavedItemsPage() {
  const { data: savedItems, isLoading: isLoadingSaved } = useSavedItems();
  const { data: recentlyViewed, isLoading: isLoadingRecent } = useRecentlyViewedItems();

  return (
    <div className="min-h-screen pb-20 bg-background">
      <StatusBar />
      
      <div className="p-4">
        <h1 className="text-xl font-bold mb-6">Saved Item Details</h1>

        {/* Saved Items */}
        <div className="mb-6">
          {isLoadingSaved ? (
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-100 rounded-lg h-40 animate-pulse"></div>
              <div className="bg-gray-100 rounded-lg h-40 animate-pulse"></div>
            </div>
          ) : savedItems && savedItems.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 mb-4">
              {savedItems.map((savedItem) => (
                <div key={savedItem.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <ItemCard item={savedItem.item} />
                  <div className="p-2 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      Saved on {formatDate(savedItem.savedAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No saved items yet</p>
            </div>
          )}
        </div>

        {/* Recently Viewed */}
        <h2 className="font-semibold mb-3">Recently Viewed</h2>
        {isLoadingRecent ? (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-lg h-32 animate-pulse"></div>
            ))}
          </div>
        ) : recentlyViewed && recentlyViewed.length > 0 ? (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {recentlyViewed.map((recentItem) => (
              <div key={recentItem.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <ItemCard item={recentItem.item} size="sm" />
                <div className="p-2 border-t border-gray-100">
                  <p className="text-[10px] text-gray-500">
                    Viewed on {formatDate(recentItem.viewedAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No recently viewed items</p>
          </div>
        )}
      </div>
      
      <BottomNavigation />
      <HomeIndicator />
    </div>
  );
}
