import { useState } from "react";
import { useLocation, Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import StatusBar from "@/components/layout/StatusBar";
import HomeIndicator from "@/components/layout/HomeIndicator";

export default function CheckoutPage() {
  const [_, navigate] = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    zip: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    county: "",
    postCode: "",
    country: "",
    agreeToTerms: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, agreeToTerms: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeToTerms) {
      alert("Please agree to the terms and conditions.");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/confirmation/1"); // Navigate to confirmation page
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <StatusBar />
      
      <div className="p-4">
        <h1 className="text-xl font-bold mb-6">Checkout</h1>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full px-4 py-3 bg-gray-100 rounded-lg"
              required
            />
          </div>
          
          {/* Card Information */}
          <div>
            <Input
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              placeholder="Card number"
              className="w-full px-4 py-3 bg-gray-100 rounded-lg mb-2"
              required
            />
            <div className="grid grid-cols-3 gap-2">
              <Input
                name="expiry"
                value={formData.expiry}
                onChange={handleChange}
                placeholder="Exp"
                className="px-4 py-3 bg-gray-100 rounded-lg"
                required
              />
              <Input
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                placeholder="CVV"
                className="px-4 py-3 bg-gray-100 rounded-lg"
                required
              />
              <Input
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                placeholder="Zip"
                className="px-4 py-3 bg-gray-100 rounded-lg"
                required
              />
            </div>
          </div>
          
          {/* Shipping Address */}
          <div>
            <h2 className="font-semibold mb-2">Shipping Address</h2>
            <div className="space-y-2">
              <Input
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
                placeholder="Address Line 1"
                className="w-full px-4 py-3 bg-gray-100 rounded-lg"
                required
              />
              <Input
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleChange}
                placeholder="Address Line 2"
                className="w-full px-4 py-3 bg-gray-100 rounded-lg"
              />
              <Input
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                className="w-full px-4 py-3 bg-gray-100 rounded-lg"
                required
              />
              <Input
                name="county"
                value={formData.county}
                onChange={handleChange}
                placeholder="County"
                className="w-full px-4 py-3 bg-gray-100 rounded-lg"
                required
              />
              <Input
                name="postCode"
                value={formData.postCode}
                onChange={handleChange}
                placeholder="Post Code"
                className="w-full px-4 py-3 bg-gray-100 rounded-lg"
                required
              />
              <Input
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Country"
                className="w-full px-4 py-3 bg-gray-100 rounded-lg"
                required
              />
            </div>
          </div>
          
          {/* Terms and Conditions */}
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="terms" 
              checked={formData.agreeToTerms}
              onCheckedChange={handleCheckboxChange}
              className="h-4 w-4 text-primary"
            />
            <label htmlFor="terms" className="text-sm">
              Agree to{" "}
              <Link href="/terms">
                <a className="text-primary">Terms and Conditions</a>
              </Link>
            </label>
          </div>
          
          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full py-3"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Place Order"}
          </Button>
        </form>
      </div>
      
      <HomeIndicator />
    </div>
  );
}
