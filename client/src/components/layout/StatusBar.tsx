import { Battery, Signal, Wifi } from "lucide-react";
import { useEffect, useState } from "react";

export default function StatusBar() {
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
    <div className="ios-status-bar flex justify-between items-center px-5 py-3 bg-transparent relative z-10">
      <div className="text-sm font-semibold text-white drop-shadow-sm">{time}</div>
      <div className="flex items-center space-x-2">
        <Signal className="h-3.5 w-3.5 text-white drop-shadow-sm" />
        <Wifi className="h-3.5 w-3.5 text-white drop-shadow-sm" />
        <Battery className="h-4 w-4 text-white drop-shadow-sm" />
      </div>
    </div>
  );
}
