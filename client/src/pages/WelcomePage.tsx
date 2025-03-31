import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import StatusBar from "@/components/layout/StatusBar";
import HomeIndicator from "@/components/layout/HomeIndicator";

export default function WelcomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <StatusBar />
      
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full aspect-video mb-6 rounded-xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1566140967404-b8b3932483f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
            alt="People sharing tools"
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="text-2xl font-bold text-center mb-2">Welcome to The Commune</h1>
        <p className="text-center text-gray-600 mb-8">Join our community and start sharing resources</p>
        
        <Link href="/">
          <Button className="w-full mb-3">Get Started</Button>
        </Link>
        
        <Link href="/login">
          <Button variant="secondary" className="w-full">Log In</Button>
        </Link>
      </div>
      
      <HomeIndicator />
    </div>
  );
}
