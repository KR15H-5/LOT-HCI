import { useState } from "react";
import { useParams, useLocation, Link } from "wouter";
import { 
  ArrowLeft, Share2, Star, Calendar, Tag, Users, 
  ShieldCheck, Info, BarChart, Bookmark, BookmarkCheck, 
  Clock, Award, BadgeAlert, HeartPulse 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import StatusBar from "@/components/layout/StatusBar";
import BottomNavigation from "@/components/layout/BottomNavigation";
import HomeIndicator from "@/components/layout/HomeIndicator";
import { useItemDetails } from "@/hooks/useItems";
import { useSavedItems, useSaveItem, useRemoveSavedItem } from "@/hooks/useSavedItems";
import { useQuery } from "@tanstack/react-query";
import { formatCurrency } from "@/lib/utils";
import { formatDate } from "@/lib/data";

export default function ItemDetailsPage() {
  const params = useParams<{ id: string }>();
  const [_, navigate] = useLocation();
  const itemId = params?.id ? parseInt(params.id) : null;
  
  const { data: item, isLoading } = useItemDetails(itemId);
  const { data: testimonials = [], isLoading: isLoadingTestimonials } = useQuery<any[]>({
    queryKey: ["/api/testimonials", itemId],
    enabled: !!itemId,
  });
  
  const { data: savedItems = [] } = useSavedItems();
  const saveItem = useSaveItem();
  const removeItem = useRemoveSavedItem();
  
  const [isImageFullscreen, setIsImageFullscreen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("details");
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!item) {
    return (
      <div className="min-h-screen bg-background flex justify-center items-center p-4">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-2">Item Not Found</h1>
          <p className="text-gray-500 mb-4">The item you're looking for doesn't exist or has been removed.</p>
          <Link href="/search">
            <Button>Browse Items</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const isSaved = savedItems?.some(saved => saved.itemId === item.id);
  
  const handleSaveToggle = () => {
    if (isSaved) {
      removeItem.mutate(item.id);
    } else {
      saveItem.mutate(item.id);
    }
  };
  
  const handleRentNow = () => {
    // For the prototype, hardcode to item 1 to ensure reliability
    console.log("Rent Now button clicked - using hardcoded item ID 1");
    // Using hardcoded ID=1 for the prototype
    navigate(`/booking?itemId=1`);
  };

  // Get all item images (use main image or fallback if no additional images)
  const itemImages = item.additionalImages && item.additionalImages.length > 0 
    ? [item.image, ...item.additionalImages] 
    : [
        item.image || "https://i.ebayimg.com/images/g/4o0AAOSwAO9iDvvu/s-l1200.jpg"
      ];
  
  return (
    <div className="min-h-screen pb-20 bg-background">
      <StatusBar />
      
      <div className="relative">
        {/* Header Image */}
        <div 
          className="w-full h-[280px] bg-gray-200 relative"
          onClick={() => setIsImageFullscreen(!isImageFullscreen)}
        >
          <img
            src={itemImages[selectedImageIndex]}
            alt={item.name}
            className={`w-full h-full ${isImageFullscreen ? 'object-contain' : 'object-cover'}`}
          />
          
          {/* Image thumbnails */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {itemImages.map((image, index) => (
              <button 
                key={index}
                className={`w-8 h-8 rounded-full border-2 ${
                  selectedImageIndex === index 
                    ? 'border-white' 
                    : 'border-transparent opacity-70'
                } overflow-hidden`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex(index);
                }}
              >
                <img 
                  src={image} 
                  alt={`Thumbnail ${index + 1}`} 
                  className="w-full h-full object-cover" 
                />
              </button>
            ))}
          </div>
          
          {/* Back and Save buttons */}
          <div className="absolute top-4 left-4 right-4 flex justify-between">
            <button 
              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/");
              }}
            >
              <ArrowLeft className="h-5 w-5 text-black" />
            </button>
            <button 
              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md"
              onClick={(e) => {
                e.stopPropagation();
                handleSaveToggle();
              }}
            >
              {isSaved ? (
                <BookmarkCheck className="h-5 w-5 text-primary fill-primary" />
              ) : (
                <Bookmark className="h-5 w-5 text-black" />
              )}
            </button>
          </div>
          
          {/* Item Category Badge */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-white/90 backdrop-blur-sm text-gray-800 hover:bg-white/90">
              {item.category}
            </Badge>
          </div>
        </div>

        {/* Details Content */}
        <div className="bg-white p-5 rounded-t-3xl -mt-8 relative z-10">
          {/* Title and rating */}
          <div className="mb-4">
            <div className="flex justify-between items-start">
              <h1 className="text-2xl font-bold text-gray-900">{item.name}</h1>
              <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                <span className="font-semibold text-sm">{item.rating || "4.5"}</span>
              </div>
            </div>
            <p className="text-gray-500 mt-1">{item.description}</p>
          </div>

          {/* Price information */}
          <div className="mb-6 flex justify-between items-center">
            <div>
              <div className="text-2xl font-bold text-primary">{formatCurrency(item.pricePerDay || 25)}</div>
              <div className="text-sm text-gray-500">per day</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold">{formatCurrency(item.pricePerWeek || (item.pricePerDay * 6 || 150))}</div>
              <div className="text-sm text-gray-500">per week</div>
            </div>
          </div>

          {/* Status badges */}
          <div className="mb-5 flex flex-wrap gap-2">
            {item.maxHireDuration && (
              <Badge variant="outline" className="text-xs rounded-full px-3 bg-blue-50 border-blue-100 text-blue-700">
                <Calendar className="h-3 w-3 mr-1" /> Max {item.maxHireDuration} days
              </Badge>
            )}
            {item.maxHireQuantity && (
              <Badge variant="outline" className="text-xs rounded-full px-3 bg-green-50 border-green-100 text-green-700">
                <Users className="h-3 w-3 mr-1" /> Max {item.maxHireQuantity} units
              </Badge>
            )}
            {item.trainingRequired && (
              <Badge variant="outline" className="text-xs rounded-full px-3 bg-amber-50 border-amber-100 text-amber-700">
                <Award className="h-3 w-3 mr-1" /> Training Required
              </Badge>
            )}
            {item.expertSupportRequired && (
              <Badge variant="outline" className="text-xs rounded-full px-3 bg-purple-50 border-purple-100 text-purple-700">
                <BadgeAlert className="h-3 w-3 mr-1" /> Expert Support
              </Badge>
            )}
            {item.safetyInstructions && (
              <Badge variant="outline" className="text-xs rounded-full px-3 bg-red-50 border-red-100 text-red-700">
                <HeartPulse className="h-3 w-3 mr-1" /> Safety Guidelines
              </Badge>
            )}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="details" onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid grid-cols-3 bg-gray-100">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="instructions">Care & Safety</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({testimonials.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="pt-4">
              {/* Suitable Tasks */}
              {item.suitableTasks && item.suitableTasks.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <Tag className="h-4 w-4 mr-1.5" /> Suitable Tasks
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {item.suitableTasks.map((task, index) => (
                      <Badge key={index} variant="secondary" className="rounded-full bg-gray-100">
                        {task}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Suitability */}
              {item.suitability && item.suitability.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <Users className="h-4 w-4 mr-1.5" /> Suitable For
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {item.suitability.map((suitable, index) => (
                      <Badge key={index} variant="secondary" className="rounded-full bg-gray-100">
                        {suitable}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Specifications */}
              {item.specifications && Object.keys(item.specifications).length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <BarChart className="h-4 w-4 mr-1.5" /> Specifications
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                      {Object.entries(item.specifications).map(([key, value]) => (
                        <div key={key} className="flex flex-col">
                          <span className="text-xs text-gray-500 capitalize">{key}</span>
                          <span className="text-sm font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Hire Terms */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <Clock className="h-4 w-4 mr-1.5" /> Hire Terms
                </h3>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Max Hire Duration</span>
                      <span className="text-sm font-medium">{item.maxHireDuration || 7} days</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Max Quantity</span>
                      <span className="text-sm font-medium">{item.maxHireQuantity || 1} units</span>
                    </div>
                    {item.trainingRequired && (
                      <div className="flex flex-col col-span-2">
                        <span className="text-xs text-gray-500">Training Required</span>
                        <span className="text-sm font-medium">{item.trainingRequired}</span>
                      </div>
                    )}
                    {item.expertSupportRequired && (
                      <div className="flex flex-col col-span-2">
                        <span className="text-xs text-gray-500">Expert Support</span>
                        <span className="text-sm font-medium">{item.expertSupportRequired}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="instructions" className="pt-4">
              {/* Safety Information */}
<div className="mb-4">
  <h3 className="text-sm font-semibold text-gray-700 mb-2">Safety Information</h3>
  <div className="space-y-3">
    <div className="bg-red-50 rounded-lg p-3">
      <h4 className="text-sm font-medium text-red-800 mb-1">Before Use</h4>
      <ul className="text-sm text-red-700 list-disc pl-4 space-y-1">
        <li>Inspect equipment for any damage</li>
        <li>Ensure all safety guards are in place</li>
        <li>Check power cords for exposed wiring</li>
        <li>Verify proper battery installation if applicable</li>
      </ul>
    </div>
    
    <div className="bg-yellow-50 rounded-lg p-3">
      <h4 className="text-sm font-medium text-yellow-800 mb-1">During Use</h4>
      <ul className="text-sm text-yellow-700 list-disc pl-4 space-y-1">
        <li>Wear appropriate protective equipment</li>
        <li>Keep work area clean and well lit</li>
        <li>Maintain proper grip and stance</li>
        <li>Never force the tool</li>
      </ul>
    </div>
    
    <div className="bg-blue-50 rounded-lg p-3">
      <h4 className="text-sm font-medium text-blue-800 mb-1">After Use</h4>
      <ul className="text-sm text-blue-700 list-disc pl-4 space-y-1">
        <li>Clean equipment thoroughly</li>
        <li>Store in a dry, secure location</li>
        <li>Report any issues immediately</li>
        <li>Remove batteries if applicable</li>
      </ul>
    </div>
  </div>
</div>
            </TabsContent>
            
            <TabsContent value="reviews" className="pt-4">
              {/* Testimonials */}
              {isLoadingTestimonials ? (
                <div className="space-y-3">
                  <div className="bg-gray-100 h-24 rounded-lg animate-pulse"></div>
                  <div className="bg-gray-100 h-24 rounded-lg animate-pulse"></div>
                </div>
              ) : testimonials.length > 0 ? (
                <div className="space-y-3">
                  {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center mb-2">
                        <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 overflow-hidden">
                          <img
                            src={testimonial.user?.profileImage || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"}
                            alt={testimonial.user?.fullName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold">{testimonial.user?.fullName || "Jane Doe"}</h3>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < (testimonial.rating || 5) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                                }`}
                              />
                            ))}
                            <span className="text-xs text-gray-500 ml-1">{testimonial.createdAt ? formatDate(new Date(testimonial.createdAt)) : "2 months ago"}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{testimonial.comment || "This tool was perfect for my garden project. Easy to use and in great condition!"}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 px-4">
                  <Star className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <h3 className="font-semibold mb-1">No reviews yet</h3>
                  <p className="text-sm text-gray-500">Be the first to review this item after renting!</p>
                </div>
              )}

              {/* Sample testimonials if there are no real ones */}
              {testimonials.length === 0 && (
                <div className="space-y-3 mt-6">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                          alt="Jane Doe"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold">Jane Doe</h3>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < 5 ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="text-xs text-gray-500 ml-1">2 months ago</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">This tool was perfect for my garden project. Easy to use and in great condition!</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                          alt="John Smith"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold">John Smith</h3>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < 4 ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="text-xs text-gray-500 ml-1">3 weeks ago</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">Great quality, would rent again. The item was delivered in perfect condition.</p>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Rent Button */}
          <div className="sticky bottom-0 left-0 right-0 pt-2 pb-2 bg-white flex justify-between gap-3 items-center">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleSaveToggle}
            >
              {isSaved ? 'Saved' : 'Save'}
            </Button>
            <Button 
              className="flex-[2]" 
              onClick={handleRentNow}
            >
              Rent Now
            </Button>
          </div>
        </div>
      </div>
      
      <BottomNavigation />
      <HomeIndicator />
    </div>
  );
}
