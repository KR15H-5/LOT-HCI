import { Link, useLocation } from "wouter";
import { Home, Search, Bookmark, User } from "lucide-react";

export default function BottomNavigation() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-2 shadow-lg max-w-md mx-auto backdrop-blur-lg bg-white/90">
      <div className="grid grid-cols-4 px-3">
        <Link href="/">
          <div className="flex flex-col items-center justify-center cursor-pointer">
            <div className={`p-1.5 rounded-full ${isActive("/") ? "bg-primary/10" : ""}`}>
              <Home 
                className={`h-6 w-6 ${isActive("/") ? "text-primary stroke-[2.5px]" : "text-gray-500"}`}
                strokeWidth={isActive("/") ? 2.5 : 2} 
              />
            </div>
            <span className={`text-[10px] mt-0.5 font-medium ${isActive("/") ? "text-primary" : "text-gray-500"}`}>Home</span>
          </div>
        </Link>
        <Link href="/search">
          <div className="flex flex-col items-center justify-center cursor-pointer">
            <div className={`p-1.5 rounded-full ${isActive("/search") ? "bg-primary/10" : ""}`}>
              <Search 
                className={`h-6 w-6 ${isActive("/search") ? "text-primary stroke-[2.5px]" : "text-gray-500"}`}
                strokeWidth={isActive("/search") ? 2.5 : 2}
              />
            </div>
            <span className={`text-[10px] mt-0.5 font-medium ${isActive("/search") ? "text-primary" : "text-gray-500"}`}>Search</span>
          </div>
        </Link>
        <Link href="/saved">
          <div className="flex flex-col items-center justify-center cursor-pointer">
            <div className={`p-1.5 rounded-full ${isActive("/saved") ? "bg-primary/10" : ""}`}>
              <Bookmark 
                className={`h-6 w-6 ${isActive("/saved") ? "text-primary stroke-[2.5px]" : "text-gray-500"}`}
                strokeWidth={isActive("/saved") ? 2.5 : 2}
              />
            </div>
            <span className={`text-[10px] mt-0.5 font-medium ${isActive("/saved") ? "text-primary" : "text-gray-500"}`}>Saved</span>
          </div>
        </Link>
        <Link href="/profile">
          <div className="flex flex-col items-center justify-center cursor-pointer">
            <div className={`p-1.5 rounded-full ${isActive("/profile") ? "bg-primary/10" : ""}`}>
              <User 
                className={`h-6 w-6 ${isActive("/profile") ? "text-primary stroke-[2.5px]" : "text-gray-500"}`}
                strokeWidth={isActive("/profile") ? 2.5 : 2}
              />
            </div>
            <span className={`text-[10px] mt-0.5 font-medium ${isActive("/profile") ? "text-primary" : "text-gray-500"}`}>Profile</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
