import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { ArrowLeft, Search, Filter, Star, Zap, Award, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import StatusBar from "@/components/layout/StatusBar";
import BottomNavigation from "@/components/layout/BottomNavigation";
import HomeIndicator from "@/components/layout/HomeIndicator";
import { ItemCard } from "@/components/ui/item-card";
import { useAllItems, useItemsByCategory } from "@/hooks/useItems";
import { CATEGORIES } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export default function SearchPage() {
  const [location, setLocation] = useLocation();
  const [searchParams, setSearchParams] = useState<{ q?: string; category?: string; filter?: string }>({});
  const [searchText, setSearchText] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  // Parse query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.split("?")[1]);
    const q = params.get("q") || undefined;
    const category = params.get("category") || undefined;
    const filter = params.get("filter") || undefined;
    
    setSearchParams({ q, category, filter });
    if (q) setSearchText(q);
    if (category) setActiveTab(category.toLowerCase());
    if (filter) setActiveFilter(filter);
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
        item.description.toLowerCase().includes(searchParams.q!.toLowerCase()) ||
        (item.suitableTasks && item.suitableTasks.some(task => 
          task.toLowerCase().includes(searchParams.q!.toLowerCase())
        ))
      );
    }

    if (activeTab && activeTab !== "all") {
      items = items.filter(item => item.category.toLowerCase() === activeTab.toLowerCase());
    }
    
    if (activeFilter) {
      switch(activeFilter) {
        case "beginners":
          items = items.filter(item => 
            item.suitability && item.suitability.some(s => s.toLowerCase().includes("beginner"))
          );
          break;
        case "professionals":
          items = items.filter(item => 
            item.suitability && item.suitability.some(s => s.toLowerCase().includes("professional"))
          );
          break;
        case "notraining":
          items = items.filter(item => !item.trainingRequired);
          break;
        case "price-asc":
          items = [...items].sort((a, b) => (a.pricePerDay || 0) - (b.pricePerDay || 0));
          break;
        case "price-desc":
          items = [...items].sort((a, b) => (b.pricePerDay || 0) - (a.pricePerDay || 0));
          break;
        case "rating":
          items = [...items].sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
      }
    }
    
    return items;
  };

  const filteredItems = getFilteredItems();
  const isLoading = isLoadingAllItems || isLoadingCategoryItems;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocation(`/search?q=${encodeURIComponent(searchText)}`);
  };

  const handleFilterChange = (filter: string) => {
    if (activeFilter === filter) {
      setActiveFilter(null);
      const params = new URLSearchParams(location.split("?")[1]);
      params.delete("filter");
      setLocation(`/search?${params.toString()}`);
    } else {
      setActiveFilter(filter);
      const params = new URLSearchParams(location.split("?")[1]);
      params.set("filter", filter);
      setLocation(`/search?${params.toString()}`);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "all") {
      // Remove category filter
      const params = new URLSearchParams(location.split("?")[1]);
      params.delete("category");
      setLocation(`/search?${params.toString()}`);
    } else {
      // Apply category filter
      const params = new URLSearchParams(location.split("?")[1]);
      params.set("category", value);
      setLocation(`/search?${params.toString()}`);
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-background">
      <StatusBar />
      
      <div className="p-4">
        {/* Back Button and Search */}
        <form onSubmit={handleSearchSubmit} className="flex items-center space-x-3 mb-4">
          <Link href="/">
            <div className="p-1">
              <ArrowLeft className="h-6 w-6" />
            </div>
          </Link>
          <div className="flex-1 relative">
            <Input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search for tools, activities..."
              className="pl-10 pr-4 py-5 bg-gray-100 rounded-xl border-0 shadow-sm"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
          </div>
        </form>

        {/* Category Tabs */}
        <div className="mb-4 overflow-x-auto scrollbar-hide">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="h-10 bg-gray-100/80 p-1 rounded-xl">
              <TabsTrigger value="all" className="text-xs px-3 rounded-lg">
                All
              </TabsTrigger>
              {CATEGORIES.map((category) => (
                <TabsTrigger 
                  key={category.name} 
                  value={category.name.toLowerCase()} 
                  className="text-xs px-3 rounded-lg"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          <Badge 
            variant={activeFilter === "beginners" ? "default" : "outline"} 
            className="cursor-pointer rounded-full px-3 py-1 hover:bg-gray-100"
            onClick={() => handleFilterChange("beginners")}
          >
            <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> For Beginners
          </Badge>
          <Badge 
            variant={activeFilter === "professionals" ? "default" : "outline"}
            className="cursor-pointer rounded-full px-3 py-1 hover:bg-gray-100"
            onClick={() => handleFilterChange("professionals")}
          >
            <Award className="h-3.5 w-3.5 mr-1" /> For Professionals
          </Badge>
          <Badge 
            variant={activeFilter === "notraining" ? "default" : "outline"}
            className="cursor-pointer rounded-full px-3 py-1 hover:bg-gray-100"
            onClick={() => handleFilterChange("notraining")}
          >
            <Zap className="h-3.5 w-3.5 mr-1" /> No Training Required
          </Badge>
          <Badge 
            variant={activeFilter === "rating" ? "default" : "outline"}
            className="cursor-pointer rounded-full px-3 py-1 hover:bg-gray-100"
            onClick={() => handleFilterChange("rating")}
          >
            <Star className="h-3.5 w-3.5 mr-1" /> Best Rated
          </Badge>
          <Badge 
            variant={activeFilter === "price-asc" ? "default" : "outline"}
            className="cursor-pointer rounded-full px-3 py-1 hover:bg-gray-100"
            onClick={() => handleFilterChange("price-asc")}
          >
            Price: Low to High
          </Badge>
          <Badge 
            variant={activeFilter === "price-desc" ? "default" : "outline"}
            className="cursor-pointer rounded-full px-3 py-1 hover:bg-gray-100"
            onClick={() => handleFilterChange("price-desc")}
          >
            Price: High to Low
          </Badge>
        </div>

        {/* Search Results Summary */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} found
          </p>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs flex items-center px-2"
            onClick={() => {
              setSearchText("");
              setActiveFilter(null);
              setActiveTab("all");
              setLocation("/search");
            }}
          >
            Clear all filters
          </Button>
        </div>

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
              <Link key={item.id} href={`/items/${item.id}`}>
                <div className="rounded-xl overflow-hidden bg-white shadow-md border border-gray-100 h-full">
                  <div className="relative h-32">
                    <img 
                      src={item.image || "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <span className={`bg-${item.category.toLowerCase() === 'garden' ? 'emerald' : item.category.toLowerCase() === 'tools' ? 'blue' : item.category.toLowerCase() === 'kitchen' ? 'orange' : 'violet'}-100 text-${item.category.toLowerCase() === 'garden' ? 'emerald' : item.category.toLowerCase() === 'tools' ? 'blue' : item.category.toLowerCase() === 'kitchen' ? 'orange' : 'violet'}-700 text-xs px-2 py-0.5 rounded-full font-medium text-[10px] shadow-sm`}>
                        {item.category}
                      </span>
                    </div>
                    {(item.trainingRequired || item.expertSupportRequired) && (
                      <div className="absolute top-2 right-2 bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded-full font-medium">
                        {item.trainingRequired ? "Training" : "Expert Support"}
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm line-clamp-1">{item.name}</h3>
                    <div className="mt-2 flex justify-between items-center">
                      <div className="text-xs text-primary font-bold">{formatCurrency(item.pricePerDay)}/day</div>
                      {item.rating && (
                        <div className="flex items-center bg-gray-50 px-1.5 py-0.5 rounded-full">
                          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-xs ml-0.5 font-medium">{item.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 px-4 bg-gray-50 rounded-xl">
            <Search className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <h3 className="font-semibold text-lg mb-1">No items found</h3>
            <p className="text-gray-500 text-sm mb-4">
              We couldn't find any items matching your search. Try different keywords or filters.
            </p>
            <Button
              onClick={() => {
                setSearchText("");
                setActiveFilter(null);
                setActiveTab("all");
                setLocation("/search");
              }}
            >
              Clear Search
            </Button>
          </div>
        )}
      </div>
      
      <BottomNavigation />
      <HomeIndicator />
    </div>
  );
}
