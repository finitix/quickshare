import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { Trash2, Home } from "lucide-react";

const RoomClosed = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-card border border-border rounded-2xl p-8 shadow-card animate-slide-up">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-8 h-8 text-destructive" />
              </div>

              <h1 className="font-display text-3xl font-bold text-foreground mb-4">
                Room Closed
              </h1>
              
              <p className="text-muted-foreground mb-8">
                This room has been closed. All messages, files, and notes have been permanently deleted.
              </p>

              <Link to="/">
                <Button variant="hero" size="lg" className="w-full">
                  <Home className="w-5 h-5" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RoomClosed;
