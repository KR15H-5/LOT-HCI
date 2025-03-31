import { useRef } from "react";
import { Link } from "wouter";
import { Search, ChevronRight, MapPin, Star, Bookmark, BookmarkCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import StatusBar from "@/components/layout/StatusBar";
import BottomNavigation from "@/components/layout/BottomNavigation";
import HomeIndicator from "@/components/layout/HomeIndicator";
import { CategoryIcon } from "@/components/ui/category-icon";
import { ItemCard } from "@/components/ui/item-card";
import { InspirationCard } from "@/components/ui/inspiration-card";
import { useAllItems } from "@/hooks/useItems";
import { useSavedItems, useSaveItem, useRemoveSavedItem } from "@/hooks/useSavedItems";
import { CATEGORIES } from "@/lib/data";
import { Wrench, Flower2, Utensils, Hammer } from "lucide-react"; 
import { DiyProject, Item } from "@/types";
import { formatCurrency } from "@/lib/utils";

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

  const { data: savedItems = [] } = useSavedItems();
  const saveItem = useSaveItem();
  const removeItem = useRemoveSavedItem();

  const handleSearchFocus = () => {
    // Navigate to search page on focus
    const to = searchInputRef.current?.value 
      ? `/search?q=${encodeURIComponent(searchInputRef.current.value)}` 
      : "/search";
    window.location.href = to;
  };

  // Featured items - choose the top 2 rated items
  const featuredItems = items?.slice()
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 2);

  // Recent items - get the most recently added 4 items
  const recentItems = items?.slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  // Function to determine text color based on background for category badges
  const getTextColorClass = (category: string) => {
    if (category === "Garden") return "text-emerald-700";
    if (category === "Tools") return "text-blue-700";
    if (category === "Kitchen") return "text-orange-700";
    if (category === "Repairs") return "text-violet-700";
    return "text-gray-700";
  };

  // Function to determine background color for category badges
  const getBgColorClass = (category: string) => {
    if (category === "Garden") return "bg-emerald-100";
    if (category === "Tools") return "bg-blue-100";
    if (category === "Kitchen") return "bg-orange-100";
    if (category === "Repairs") return "bg-violet-100";
    return "bg-gray-100";
  };

  return (
    <div className="min-h-screen pb-20 bg-background">
      <StatusBar />

      {/* Hero Banner */}
      <div className="relative h-[280px] bg-primary text-white mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-blue-700"></div>
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1581166397057-235af2b3c6dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="relative z-10 p-5 h-full flex flex-col justify-center pt-14">
          <h1 className="text-3xl font-bold mb-2 drop-shadow-sm">Library of Things</h1>
          <p className="text-base opacity-90 mb-6 max-w-[260px] leading-tight drop-shadow-sm">
            Borrow tools and equipment for your next project
          </p>
          <div className="relative mt-2">
            <Input
              ref={searchInputRef}
              placeholder="What do you need today?"
              className="pl-5 pr-12 py-6 bg-white/20 backdrop-blur-md text-white placeholder:text-white/80 border-0 rounded-2xl focus:ring-2 focus:ring-white/50 shadow-lg"
              onFocus={handleSearchFocus}
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md">
              <Search className="text-primary h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

      <div className="px-4">
        {/* Categories */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">Categories</h2>
            <Link href="/search">
              <div className="flex items-center text-sm text-primary cursor-pointer">
                View all <ChevronRight className="h-4 w-4" />
              </div>
            </Link>
          </div>
          <div className="flex justify-between">
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
        </div>

        {/* Featured Items */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Featured Items</h2>
            <Link href="/search?featured=true">
              <div className="flex items-center text-sm text-primary font-medium cursor-pointer">
                View all <ChevronRight className="h-4 w-4 ml-0.5" />
              </div>
            </Link>
          </div>

          {isLoadingItems ? (
            <div className="space-y-4">
              <div className="bg-gray-100 rounded-xl h-52 animate-pulse"></div>
              <div className="bg-gray-100 rounded-xl h-52 animate-pulse"></div>
            </div>
          ) : (
            <div className="space-y-5">
              {featuredItems?.map((item) => (
                <div key={item.id} className="rounded-2xl overflow-hidden bg-white shadow-md border border-gray-100">
                  <div className="relative h-44">
                    <Link href={`/items/${item.id}`}>
                      <img 
                        src={item.image || "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>
                    <div className="absolute top-3 left-3">
                      <span className={`${getBgColorClass(item.category)} ${getTextColorClass(item.category)} text-xs px-3 py-1 rounded-full font-semibold shadow-sm`}>
                        {item.category}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 flex gap-2">
                      {item.rating && (
                        <div className="bg-white rounded-full px-2.5 py-1 flex items-center shadow-md">
                          <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500 mr-1" />
                          <span className="text-xs font-bold">{item.rating}</span>
                        </div>
                      )}

                      {/* Save Button */}
                      <button 
                        className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          savedItems?.some(saved => saved.itemId === item.id)
                            ? removeItem.mutate(item.id)
                            : saveItem.mutate(item.id);
                        }}
                      >
                        {savedItems?.some(saved => saved.itemId === item.id) ? (
                          <BookmarkCheck className="h-5 w-5 text-primary fill-primary" />
                        ) : (
                          <Bookmark className="h-5 w-5 text-black" />
                        )}
                      </button>
                    </div>
                  </div>
                  <Link href={`/items/${item.id}`}>
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-base">{item.name}</h3>
                          <div className="flex items-center text-xs text-gray-500 mt-1.5">
                            <MapPin className="h-3.5 w-3.5 mr-1 text-gray-400" /> Library of Things
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-primary font-bold text-lg">{formatCurrency(item.pricePerDay)}</div>
                          <div className="text-xs text-gray-500 font-medium">per day</div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recently Added */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Recently Added</h2>
            <Link href="/search?sort=newest">
              <div className="flex items-center text-sm text-primary font-medium cursor-pointer">
                View all <ChevronRight className="h-4 w-4 ml-0.5" />
              </div>
            </Link>
          </div>

          {isLoadingItems ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-100 rounded-xl h-52 animate-pulse"></div>
              <div className="bg-gray-100 rounded-xl h-52 animate-pulse"></div>
              <div className="bg-gray-100 rounded-xl h-52 animate-pulse"></div>
              <div className="bg-gray-100 rounded-xl h-52 animate-pulse"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {recentItems?.map((item) => (
                <div key={item.id} className="rounded-xl overflow-hidden bg-white shadow-md border border-gray-100 h-full">
                  <div className="relative h-32">
                    <Link href={`/items/${item.id}`}>
                      <img 
                        src={item.image || "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>
                    <div className="absolute top-2 left-2">
                      <span className={`${getBgColorClass(item.category)} ${getTextColorClass(item.category)} text-xs px-2 py-0.5 rounded-full font-medium text-[10px] shadow-sm`}>
                        {item.category}
                      </span>
                    </div>

                    {/* Save Button */}
                    <div className="absolute top-2 right-2">
                      <button 
                        className="w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          savedItems?.some(saved => saved.itemId === item.id)
                            ? removeItem.mutate(item.id)
                            : saveItem.mutate(item.id);
                        }}
                      >
                        {savedItems?.some(saved => saved.itemId === item.id) ? (
                          <BookmarkCheck className="h-4 w-4 text-primary fill-primary" />
                        ) : (
                          <Bookmark className="h-4 w-4 text-black" />
                        )}
                      </button>
                    </div>
                  </div>
                  <Link href={`/items/${item.id}`}>
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
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DIY Inspiration */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">DIY Inspiration</h2>
            <Link href="/diy-projects">
              <div className="flex items-center text-sm text-primary font-medium cursor-pointer">
                View all <ChevronRight className="h-4 w-4 ml-0.5" />
              </div>
            </Link>
          </div>

          {isLoadingProjects ? (
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-100 rounded-xl h-40 animate-pulse"></div>
              <div className="bg-gray-100 rounded-xl h-40 animate-pulse"></div>
              <div className="bg-gray-100 rounded-xl h-40 animate-pulse"></div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {diyProjects?.map((project) => (
                <Link key={project.id} href={`/diy-projects/${project.id}`}>
                  <div className="rounded-xl overflow-hidden shadow-md group relative">
                    <div className="relative h-36">
                      <img 
                        src={project.image || "https://images.unsplash.com/photo-1572297870735-d79e4b603f4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                        alt={project.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                      {/* Difficulty Badge */}
                      <div className="absolute top-2 right-2">
                        <span className={`
                          text-[10px] px-2 py-0.5 rounded-full font-medium shadow-sm
                          ${project.difficulty === 'Easy' ? 'bg-green-100 text-green-800' : 
                            project.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'}
                        `}>
                          {project.difficulty || 'Medium'}
                        </span>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                        <h3 className="text-xs font-semibold line-clamp-1">{project.title}</h3>
                        <div className="flex justify-between items-center mt-0.5">
                          <p className="text-[10px] text-white/80">{project.duration}</p>
                          <div className="flex items-center">
                            <div className="bg-primary/20 backdrop-blur-sm text-[10px] text-white rounded-full px-1.5 py-0.5 flex items-center">
                              <Hammer className="h-2.5 w-2.5 mr-0.5" />
                              {project.toolsRequired?.length || '3'} tools
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNavigation />
      <HomeIndicator />
    </div>
  );
}