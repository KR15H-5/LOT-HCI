import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import StatusBar from "@/components/layout/StatusBar";
import HomeIndicator from "@/components/layout/HomeIndicator";

export default function WelcomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 to-white">
      <StatusBar />
      
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full aspect-video mb-6 rounded-2xl overflow-hidden shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1598032894725-ef7e5b06c4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            alt="People borrowing tools at a community hub"
            className="w-full h-full object-cover"
          />
        </div>
        
        <h1 className="text-3xl font-extrabold text-center text-blue-900 mb-2">Welcome to Library of Things</h1>
        <p className="text-center text-gray-700 mb-6 px-4">
          Borrow household tools and equipment for your next project — smarter, cheaper, greener.
        </p>

        <Link href="/">
          <Button className="w-full text-lg py-6 rounded-xl shadow-md">Get Started</Button>
        </Link>

        <Link href="/login">
          <Button variant="secondary" className="w-full text-lg py-6 rounded-xl mt-3">Log In</Button>
        </Link>
      </div>

      <HomeIndicator />
    </div>
  );
}
