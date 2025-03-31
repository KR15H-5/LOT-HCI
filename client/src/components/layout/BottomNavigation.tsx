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
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 grid grid-cols-4 max-w-md mx-auto">
      <Link href="/">
        <a className="flex flex-col items-center justify-center">
          <Home className={`h-6 w-6 ${isActive("/") ? "text-primary" : "text-gray-500"}`} />
          <span className={`text-xs ${isActive("/") ? "text-primary" : "text-gray-500"}`}>Home</span>
        </a>
      </Link>
      <Link href="/search">
        <a className="flex flex-col items-center justify-center">
          <Search className={`h-6 w-6 ${isActive("/search") ? "text-primary" : "text-gray-500"}`} />
          <span className={`text-xs ${isActive("/search") ? "text-primary" : "text-gray-500"}`}>Search</span>
        </a>
      </Link>
      <Link href="/saved">
        <a className="flex flex-col items-center justify-center">
          <Bookmark className={`h-6 w-6 ${isActive("/saved") ? "text-primary" : "text-gray-500"}`} />
          <span className={`text-xs ${isActive("/saved") ? "text-primary" : "text-gray-500"}`}>Saved</span>
        </a>
      </Link>
      <Link href="/profile">
        <a className="flex flex-col items-center justify-center">
          <User className={`h-6 w-6 ${isActive("/profile") ? "text-primary" : "text-gray-500"}`} />
          <span className={`text-xs ${isActive("/profile") ? "text-primary" : "text-gray-500"}`}>Profile</span>
        </a>
      </Link>
    </div>
  );
}
