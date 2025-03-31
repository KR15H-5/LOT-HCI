import { Battery, Signal, Wifi } from "lucide-react";

export default function StatusBar() {
  const time = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  
  return (
    <div className="ios-status-bar flex justify-between items-center px-4 bg-white h-11">
      <div className="text-sm font-medium">{time}</div>
      <div className="flex items-center space-x-1">
        <Signal className="h-4 w-4" />
        <Wifi className="h-4 w-4" />
        <Battery className="h-4 w-4" />
      </div>
    </div>
  );
}
