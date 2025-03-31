import { ReactNode } from "react";
import StatusBar from "./StatusBar";
import BottomNavigation from "./BottomNavigation";
import HomeIndicator from "./HomeIndicator";

interface AppLayoutProps {
  children: ReactNode;
  showNav?: boolean;
  className?: string;
}

export default function AppLayout({ 
  children, 
  showNav = true,
  className = ""
}: AppLayoutProps) {
  return (
    <div className={`min-h-screen bg-background flex flex-col ${className}`}>
      <StatusBar />
      
      <div className={`flex-1 ${showNav ? 'pb-20' : ''}`}>
        {children}
      </div>
      
      {showNav && <BottomNavigation />}
      <HomeIndicator />
    </div>
  );
}
