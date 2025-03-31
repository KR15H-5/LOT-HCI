import { useState } from "react";
import { useParams, useLocation, Link } from "wouter";
import { ArrowLeft, Share2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import StatusBar from "@/components/layout/StatusBar";
import BottomNavigation from "@/components/layout/BottomNavigation";
import HomeIndicator from "@/components/layout/HomeIndicator";
import { useItemDetails } from "@/hooks/useItems";
import { useSavedItems, useSaveItem, useRemoveSavedItem } from "@/hooks/useSavedItems";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "@/lib/data";

export default function ItemDetailsPage() {
  const params = useParams<{ id: string }>();
  const [_, navigate] = useLocation();
  const itemId = params?.id ? parseInt(params.id) : null;
  
  const { data: item, isLoading } = useItemDetails(itemId);
  const { data: testimonials, isLoading: isLoadingTestimonials } = useQuery({
    queryKey: ["/api/testimonials", itemId],
    enabled: !!itemId,
  });
  
  const { data: savedItems } = useSavedItems();
  const saveItem = useSaveItem();
  const removeItem = useRemoveSavedItem();
  
  const [isImageFullscreen, setIsImageFullscreen] = useState(false);
  
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
  
  const isSaved = savedItems?.some(saved => saved.item.id === item.id);
  
  const handleSaveToggle = () => {
    if (isSaved) {
      removeItem.mutate(item.id);
    } else {
      saveItem.mutate(item.id);
    }
  };
  
  const handleRentNow = () => {
    navigate(`/booking/${item.id}`);
  };
  
  return (
    <div className="min-h-screen pb-20 bg-background">
      <StatusBar />
      
      <div className="relative">
        {/* Header Image */}
        <div 
          className="w-full aspect-square bg-gray-200 relative"
          onClick={() => setIsImageFullscreen(!isImageFullscreen)}
        >
          <img
            src={item.image}
            alt={item.name}
            className={`w-full h-full object-cover ${isImageFullscreen ? 'object-contain' : 'object-cover'}`}
          />
          
          {/* Back and Share buttons */}
          <div className="absolute top-4 left-4 right-4 flex justify-between">
            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/");
                    }}>
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSaveToggle();
                    }}>
              <Share2 className="h-5 w-5" />
            </button>
          </div>
          
          {/* Item Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
            <h1 className="text-2xl font-bold text-white mb-1">{item.name}</h1>
            <p className="text-white/90">{item.description}</p>
          </div>
        </div>

        {/* Details Content */}
        <div className="bg-white p-4 rounded-t-3xl -mt-6 relative z-10">
          {/* Rating */}
          <div className="flex items-center mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < (item.rating || 0) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Overview */}
          <div className="mb-4">
            <h2 className="font-semibold mb-2">Overview</h2>
            <div className="mb-3">
              <h3 className="text-sm font-medium text-gray-700">Suitable Tasks</h3>
              <p className="text-sm text-gray-600">
                {item.suitableTasks?.join(", ") || "No information provided"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">Suitability</h3>
              <p className="text-sm text-gray-600">
                {item.suitability?.join(", ") || "No information provided"}
              </p>
            </div>
          </div>

          {/* Hire Details */}
          <div className="mb-4">
            <h2 className="font-semibold mb-2">Hire Details</h2>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Max Hire Duration</h3>
                <p className="text-sm text-gray-600">{item.maxHireDuration} days</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700">Max Hire Quantity</h3>
                <p className="text-sm text-gray-600">{item.maxHireQuantity} units</p>
              </div>
            </div>
          </div>

          {/* Care & Safety */}
          <div className="mb-4">
            <h2 className="font-semibold mb-2">Care & Safety</h2>
            {item.careInstructions && (
              <div className="mb-3">
                <h3 className="text-sm font-medium text-gray-700">Instructions</h3>
                <p className="text-sm text-gray-600">{item.careInstructions}</p>
              </div>
            )}
            {item.trainingRequired && (
              <div className="mb-3">
                <h3 className="text-sm font-medium text-gray-700">Training Required</h3>
                <p className="text-sm text-gray-600">{item.trainingRequired}</p>
              </div>
            )}
            {item.expertSupportRequired && (
              <div>
                <h3 className="text-sm font-medium text-gray-700">Expert Support</h3>
                <p className="text-sm text-gray-600">{item.expertSupportRequired}</p>
              </div>
            )}
          </div>

          {/* Specifications */}
          {item.specifications && Object.keys(item.specifications).length > 0 && (
            <div className="mb-6">
              <h2 className="font-semibold mb-2">Specifications</h2>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(item.specifications).map(([key, value]) => (
                  <div key={key}>
                    <h3 className="text-sm font-medium text-gray-700">{key.charAt(0).toUpperCase() + key.slice(1)}</h3>
                    <p className="text-sm text-gray-600">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Testimonials */}
          <div className="mb-6">
            <h2 className="font-semibold mb-2">Testimonials</h2>
            {isLoadingTestimonials ? (
              <div className="space-y-2">
                <div className="bg-gray-100 h-20 rounded-lg animate-pulse"></div>
                <div className="bg-gray-100 h-20 rounded-lg animate-pulse"></div>
              </div>
            ) : testimonials && testimonials.length > 0 ? (
              <div className="space-y-2">
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center mb-1">
                      <div className="w-8 h-8 rounded-full bg-gray-300 mr-2 overflow-hidden">
                        <img
                          src={testimonial.user?.profileImage || "https://via.placeholder.com/100"}
                          alt={testimonial.user?.fullName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">{testimonial.user?.fullName}</h3>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < testimonial.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{testimonial.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No testimonials yet</p>
            )}
          </div>

          {/* Rent Button */}
          <Button className="w-full" onClick={handleRentNow}>
            Rent Now
          </Button>
        </div>
      </div>
      
      <BottomNavigation />
      <HomeIndicator />
    </div>
  );
}
