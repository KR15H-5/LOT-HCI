import { Battery, Signal, Wifi } from "lucide-react";
import { useEffect, useState } from "react";

interface StatusBarProps {
  bg?: string;
  textColor?: string;
  absolute?: boolean;
}

export default function StatusBar({ 
  bg = "bg-transparent", 
  textColor = "text-white",
  absolute = false
}: StatusBarProps) {
  const [time, setTime] = useState('');
  
  useEffect(() => {
    // Initialize time
    updateTime();
    
    // Update time every minute
    const interval = setInterval(updateTime, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  const updateTime = () => {
    setTime(new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }));
  };
  
  return (
    <div className={`ios-status-bar flex justify-between items-center px-5 py-3 ${bg} relative z-10 ${absolute ? 'absolute top-0 left-0 right-0' : ''}`}>
      <div className={`text-sm font-semibold ${textColor} drop-shadow-sm`}>{time}</div>
      <div className="flex items-center space-x-2">
        <Signal className={`h-3.5 w-3.5 ${textColor} drop-shadow-sm`} />
        <Wifi className={`h-3.5 w-3.5 ${textColor} drop-shadow-sm`} />
        <Battery className={`h-4 w-4 ${textColor} drop-shadow-sm`} />
      </div>
    </div>
  );
}
