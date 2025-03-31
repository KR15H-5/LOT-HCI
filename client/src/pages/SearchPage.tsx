import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { ArrowLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import StatusBar from "@/components/layout/StatusBar";
import BottomNavigation from "@/components/layout/BottomNavigation";
import HomeIndicator from "@/components/layout/HomeIndicator";
import { ItemCard } from "@/components/ui/item-card";
import { useAllItems, useItemsByCategory } from "@/hooks/useItems";

export default function SearchPage() {
  const [location] = useLocation();
  const [searchParams, setSearchParams] = useState<{ q?: string; category?: string }>({});
  const [searchText, setSearchText] = useState("");

  // Parse query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.split("?")[1]);
    const q = params.get("q") || undefined;
    const category = params.get("category") || undefined;
    
    setSearchParams({ q, category });
    if (q) setSearchText(q);
  }, [location]);

  // Fetch items
  const { data: allItems, isLoading: isLoadingAllItems } = useAllItems();
  const { data: categoryItems, isLoading: isLoadingCategoryItems } = useItemsByCategory(
    searchParams.category || null
  );

  // Items to display based on search params
  const getFilteredItems = () => {
    let items = categoryItems || allItems || [];
    
    if (searchParams.q) {
      items = items.filter(item => 
        item.name.toLowerCase().includes(searchParams.q!.toLowerCase()) ||
        item.description.toLowerCase().includes(searchParams.q!.toLowerCase())
      );
    }
    
    return items;
  };

  const filteredItems = getFilteredItems();
  const isLoading = isLoadingAllItems || isLoadingCategoryItems;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `/search?q=${encodeURIComponent(searchText)}`;
  };

  return (
    <div className="min-h-screen pb-20 bg-background">
      <StatusBar />
      
      <div className="p-4">
        {/* Back Button and Search */}
        <form onSubmit={handleSearchSubmit} className="flex items-center space-x-3 mb-6">
          <Link href="/">
            <a className="p-1">
              <ArrowLeft className="h-6 w-6" />
            </a>
          </Link>
          <div className="flex-1 relative">
            <Input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search tools"
              className="pl-10 pr-4 py-2 bg-gray-100 rounded-lg"
            />
            <Search className="absolute left-3 top-2 text-gray-500 h-5 w-5" />
          </div>
        </form>

        {/* Items Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-xl h-52 animate-pulse"></div>
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <ItemCard key={item.id} item={item} showStatus />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No items found</p>
          </div>
        )}
      </div>
      
      <BottomNavigation />
      <HomeIndicator />
    </div>
  );
}
