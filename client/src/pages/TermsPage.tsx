import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import StatusBar from "@/components/layout/StatusBar";
import HomeIndicator from "@/components/layout/HomeIndicator";

export default function TermsPage() {
  const [_, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <StatusBar />
      
      <div className="p-4">
        <div className="flex items-center mb-6">
          <button className="p-1 mr-2" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold">Terms and Conditions</h1>
        </div>
        
        <div className="space-y-4 text-sm">
          <p>
            Welcome to our community tool rental platform. By accessing or using our service, 
            you agree to comply with and be bound by the following terms and conditions.
          </p>
          
          <div>
            <h2 className="font-semibold mb-1">User Responsibilities</h2>
            <p>
              Users must ensure the safe and proper use of rented tools. 
              Any damage or loss incurred during the rental period is the user's responsibility.
            </p>
          </div>
          
          <div>
            <h2 className="font-semibold mb-1">Payment Terms</h2>
            <p>
              Payments must be made in full before the rental period begins. 
              We accept major credit cards and other payment methods as specified in the checkout process.
            </p>
          </div>
          
          <div>
            <h2 className="font-semibold mb-1">Cancellation Policy</h2>
            <p>
              Cancellations made within 24 hours of the rental start time will incur a fee. 
              Please refer to our cancellation policy for more details.
            </p>
          </div>
          
          <div>
            <h2 className="font-semibold mb-1">Liability</h2>
            <p>
              We are not liable for any injuries or damages resulting from the use of rented tools. 
              Users must follow all safety guidelines provided.
            </p>
          </div>
          
          <div>
            <h2 className="font-semibold mb-1">Privacy Policy</h2>
            <p>
              We are committed to protecting your privacy. 
              Please review our privacy policy to understand how we collect, use, and protect your information.
            </p>
          </div>
          
          <div>
            <h2 className="font-semibold mb-1">Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. 
              Changes will be effective immediately upon posting on our platform.
            </p>
          </div>
          
          <div>
            <h2 className="font-semibold mb-1">Contact Us</h2>
            <p>
              If you have any questions or concerns about these terms, 
              please contact our support team for assistance.
            </p>
          </div>
        </div>
      </div>
      
      <HomeIndicator />
    </div>
  );
}
