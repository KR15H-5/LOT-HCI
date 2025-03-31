import { Link } from "wouter";
import { Bookmark, Clock, ChevronRight, Star, MapPin } from "lucide-react";
import StatusBar from "@/components/layout/StatusBar";
import BottomNavigation from "@/components/layout/BottomNavigation";
import HomeIndicator from "@/components/layout/HomeIndicator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSavedItems, useRemoveSavedItem } from "@/hooks/useSavedItems";
import { useRecentlyViewedItems } from "@/hooks/useSavedItems";
import { formatDate } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

// Mock data for the saved items
const MOCK_SAVED_ITEMS = [
  {
    id: 101,
    itemId: 1,
    userId: 1, 
    savedAt: new Date('2023-03-15'),
    item: {
      id: 1,
      name: "DeWalt Power Drill",
      description: "Professional-grade power drill",
      category: "Tools",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      specifications: {
        weight: "2.5 kg",
        dimensions: "30 × 20 × 10 cm",
      },
      pricePerDay: 25,
      pricePerWeek: 150
    }
  },
  {
    id: 102,
    itemId: 3,
    userId: 1,
    savedAt: new Date('2023-03-20'),
    item: {
      id: 3,
      name: "Lawn Mower",
      description: "Electric lawn mower",
      category: "Garden",
      rating: 4.2,
      image: "https://images.unsplash.com/photo-1520996729250-7d888a835cc4?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      pricePerDay: 35,
      pricePerWeek: 200
    }
  },
  {
    id: 103,
    itemId: 5,
    userId: 1,
    savedAt: new Date('2023-03-25'),
    item: {
      id: 5,
      name: "Leaf Blower",
      description: "Powerful leaf blower",
      category: "Garden",
      rating: 4.0,
      image: "https://images.unsplash.com/photo-1635695311335-3d576780a693?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      pricePerDay: 25,
      pricePerWeek: 140
    }
  }
];

// Mock data for recently viewed items
const MOCK_RECENT_ITEMS = [
  {
    id: 201,
    userId: 1,
    itemId: 2,
    viewedAt: new Date('2023-03-28'),
    item: {
      id: 2,
      name: "Garden Shovel",
      description: "Durable and lightweight",
      category: "Garden",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1586280226616-6045e35a0803?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      pricePerDay: 15,
      pricePerWeek: 90
    }
  },
  {
    id: 202,
    userId: 1,
    itemId: 4,
    viewedAt: new Date('2023-03-27'),
    item: {
      id: 4,
      name: "Drill Machine",
      description: "Professional drill",
      category: "Tools",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1664226635992-9c7b81afcf98?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      pricePerDay: 30,
      pricePerWeek: 175
    }
  },
  {
    id: 203,
    userId: 1,
    itemId: 6,
    viewedAt: new Date('2023-03-26'),
    item: {
      id: 6,
      name: "Hammer Drill",
      description: "Heavy-duty hammer drill",
      category: "Tools",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      pricePerDay: 40,
      pricePerWeek: 220
    }
  },
  {
    id: 204,
    userId: 1,
    itemId: 7,
    viewedAt: new Date('2023-03-25'),
    item: {
      id: 7,
      name: "Kitchen Mixer",
      description: "Professional stand mixer",
      category: "Kitchen",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      pricePerDay: 45,
      pricePerWeek: 250
    }
  }
];

export default function SavedItemsPage() {
  const { data: savedItems = [], isLoading: isLoadingSaved } = useSavedItems();
  const { data: recentlyViewed = [], isLoading: isLoadingRecent } = useRecentlyViewedItems();
  const removeItem = useRemoveSavedItem();

  // Use mock data or real data, whichever is available
  const displayedSavedItems = savedItems.length > 0 ? savedItems : MOCK_SAVED_ITEMS;
  const displayedRecentItems = recentlyViewed.length > 0 ? recentlyViewed : MOCK_RECENT_ITEMS;

  return (
    <div className="min-h-screen pb-20 bg-background">
      <StatusBar />
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Saved Items</h1>
          <span className="text-sm text-gray-500">{displayedSavedItems.length} items</span>
        </div>

        <Tabs defaultValue="saved" className="mb-6">
          <TabsList className="grid grid-cols-2 bg-gray-100 mb-4">
            <TabsTrigger value="saved">Saved</TabsTrigger>
            <TabsTrigger value="recent">Recently Viewed</TabsTrigger>
          </TabsList>

          <TabsContent value="saved">
            {isLoadingSaved ? (
              <div className="space-y-4">
                <div className="bg-gray-100 rounded-xl h-32 animate-pulse"></div>
                <div className="bg-gray-100 rounded-xl h-32 animate-pulse"></div>
                <div className="bg-gray-100 rounded-xl h-32 animate-pulse"></div>
              </div>
            ) : displayedSavedItems.length > 0 ? (
              <div className="space-y-4">
                {displayedSavedItems.map((savedItem) => (
                  <div 
                    key={savedItem.id}
                    className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100"
                  >
                    <div className="flex">
                      <div className="w-1/3">
                        <div className="h-full">
                          <img 
                            src={savedItem.item.image} 
                            alt={savedItem.item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="p-3 flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{savedItem.item.name}</h3>
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <MapPin className="h-3 w-3 mr-1" /> Library of Things
                            </div>
                          </div>
                          <button 
                            className="text-primary"
                            onClick={() => removeItem.mutate(savedItem.itemId)}
                          >
                            <Bookmark className="h-5 w-5 fill-primary" />
                          </button>
                        </div>
                        
                        <div className="flex justify-between items-end mt-3">
                          <div>
                            <div className="text-primary font-bold">{formatCurrency(savedItem.item.pricePerDay)}</div>
                            <div className="text-xs text-gray-500">per day</div>
                          </div>
                          <div className="flex items-center text-gray-500 text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            Saved {formatDate(savedItem.savedAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-2 flex justify-between items-center border-t border-gray-100">
                      <div className="flex items-center">
                        <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500 mr-1" />
                        <span className="text-xs font-medium">{savedItem.item.rating}</span>
                      </div>
                      <Link href={`/items/${savedItem.itemId}`}>
                        <div className="text-xs text-primary font-medium flex items-center cursor-pointer">
                          View details <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                        </div>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-xl">
                <Bookmark className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <h3 className="font-semibold text-lg mb-1">No saved items yet</h3>
                <p className="text-gray-500 text-sm mb-4">
                  Items you save will appear here for easy access
                </p>
                <Link href="/search">
                  <Button>Browse Items</Button>
                </Link>
              </div>
            )}
          </TabsContent>

          <TabsContent value="recent">
            {isLoadingRecent ? (
              <div className="space-y-4">
                <div className="bg-gray-100 rounded-xl h-24 animate-pulse"></div>
                <div className="bg-gray-100 rounded-xl h-24 animate-pulse"></div>
                <div className="bg-gray-100 rounded-xl h-24 animate-pulse"></div>
              </div>
            ) : displayedRecentItems.length > 0 ? (
              <div className="space-y-4">
                {displayedRecentItems.map((recentItem) => (
                  <Link key={recentItem.id} href={`/items/${recentItem.itemId}`}>
                    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex">
                      <div className="w-24 h-24">
                        <img 
                          src={recentItem.item.image} 
                          alt={recentItem.item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3 flex-1">
                        <h3 className="font-medium text-sm">{recentItem.item.name}</h3>
                        <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{recentItem.item.description}</p>
                        <div className="flex justify-between items-end mt-2">
                          <div className="text-xs text-primary font-semibold">{formatCurrency(recentItem.item.pricePerDay)}/day</div>
                          <div className="flex items-center text-gray-500 text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDate(recentItem.viewedAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-xl">
                <Clock className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <h3 className="font-semibold text-lg mb-1">No recently viewed items</h3>
                <p className="text-gray-500 text-sm mb-4">
                  Items you view will appear here for easy access
                </p>
                <Link href="/search">
                  <Button>Browse Items</Button>
                </Link>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <BottomNavigation />
      <HomeIndicator />
    </div>
  );
}
