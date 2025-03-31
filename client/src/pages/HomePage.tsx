import { useRef } from "react";
import { Link } from "wouter";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import StatusBar from "@/components/layout/StatusBar";
import BottomNavigation from "@/components/layout/BottomNavigation";
import HomeIndicator from "@/components/layout/HomeIndicator";
import { CategoryIcon } from "@/components/ui/category-icon";
import { ItemCard } from "@/components/ui/item-card";
import { InspirationCard } from "@/components/ui/inspiration-card";
import { useAllItems } from "@/hooks/useItems";
import { CATEGORIES } from "@/lib/data";
import { Wrench, Flower2, Utensils, Hammer } from "lucide-react"; 
import { DiyProject } from "@/types";

const CATEGORY_ICONS: Record<string, React.ComponentType<any>> = {
  "tool": Wrench, 
  "flower2": Flower2,
  "utensils": Utensils,
  "hammer": Hammer
};

export default function HomePage() {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { data: items, isLoading: isLoadingItems } = useAllItems();
  const { data: diyProjects = [], isLoading: isLoadingProjects } = useQuery<DiyProject[]>({
    queryKey: ["/api/diy-projects"],
  });

  const handleSearchFocus = () => {
    // Navigate to search page on focus
    const to = searchInputRef.current?.value 
      ? `/search?q=${encodeURIComponent(searchInputRef.current.value)}` 
      : "/search";
    window.location.href = to;
  };

  return (
    <div className="min-h-screen pb-20 bg-background">
      <StatusBar />
      
      <div className="p-4">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Input
            ref={searchInputRef}
            placeholder="Search"
            className="pl-4 pr-10 py-3 bg-gray-100 rounded-lg"
            onFocus={handleSearchFocus}
          />
          <Search className="absolute right-3 top-3 text-gray-500 h-5 w-5" />
        </div>

        {/* Categories */}
        <div className="flex justify-between mb-6">
          {CATEGORIES.map((category) => {
            const IconComponent = CATEGORY_ICONS[category.icon as keyof typeof CATEGORY_ICONS];
            return (
              <CategoryIcon
                key={category.name}
                name={category.name}
                icon={IconComponent}
                href={category.path}
              />
            );
          })}
        </div>

        {/* Featured Items */}
        <h2 className="text-lg font-semibold mb-4">Featured Items</h2>
        {isLoadingItems ? (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-100 rounded-xl h-52 animate-pulse"></div>
            <div className="bg-gray-100 rounded-xl h-52 animate-pulse"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 mb-6">
            {items?.slice(0, 2).map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {/* DIY Inspiration */}
        <h2 className="text-lg font-semibold mb-4">DIY Inspiration</h2>
        {isLoadingProjects ? (
          <div className="grid grid-cols-3 gap-2 mb-6">
            <div className="bg-gray-100 rounded-lg h-32 animate-pulse"></div>
            <div className="bg-gray-100 rounded-lg h-32 animate-pulse"></div>
            <div className="bg-gray-100 rounded-lg h-32 animate-pulse"></div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 mb-6">
            {diyProjects?.map((project) => (
              <InspirationCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
      
      <BottomNavigation />
      <HomeIndicator />
    </div>
  );
}
