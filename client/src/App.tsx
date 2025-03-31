import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";

// Import pages
import HomePage from "@/pages/HomePage";
import WelcomePage from "@/pages/WelcomePage";
import SearchPage from "@/pages/SearchPage";
import ItemDetailsPage from "@/pages/ItemDetailsPage";
import BookingPage from "@/pages/BookingPage";
import ConfirmationPage from "@/pages/ConfirmationPage";
import SavedItemsPage from "@/pages/SavedItemsPage";
import ProfilePage from "@/pages/ProfilePage";
import ChatPage from "@/pages/ChatPage";
import CheckoutPage from "@/pages/CheckoutPage";
import TermsPage from "@/pages/TermsPage";
import LoginPage from "@/pages/LoginPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/welcome" component={WelcomePage} />
      <Route path="/search" component={SearchPage} />
      <Route path="/items/:id" component={ItemDetailsPage} />
      <Route path="/booking/:id" component={BookingPage} />
      <Route path="/confirmation/:id" component={ConfirmationPage} />
      <Route path="/saved" component={SavedItemsPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/chat/:userId" component={ChatPage} />
      <Route path="/checkout" component={CheckoutPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/login" component={LoginPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
