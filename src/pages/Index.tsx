import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Plus, Users, Shield, Zap, Clock, Trash2 } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <main className="flex-1 pt-16">
        <section className="relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 gradient-subtle" />
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1.5s' }} />
          
          <div className="relative container mx-auto px-4 py-24 md:py-32">
            <div className="max-w-3xl mx-auto text-center space-y-8 animate-slide-up">
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Share Instantly,{" "}
                <span className="bg-clip-text text-transparent gradient-hero">
                  No Login Needed
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Create a temporary room, share files, chat, and collaborate in real-time. 
                Everything deletes automatically when you're done.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link to="/create">
                  <Button variant="hero" size="xl" className="w-full sm:w-auto">
                    <Plus className="w-5 h-5" />
                    Create Room
                  </Button>
                </Link>
                <Link to="/join">
                  <Button variant="heroOutline" size="xl" className="w-full sm:w-auto">
                    <Users className="w-5 h-5" />
                    Join Room
                  </Button>
                </Link>
              </div>
              
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                <Shield className="w-4 h-4" />
                Your data auto-deletes when the room closes
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Why QuickShare Rooms?
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Fast, private, and secure file sharing without the hassle
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Zap,
                  title: "Instant Setup",
                  description: "Create a room in seconds. No registration or login required."
                },
                {
                  icon: Shield,
                  title: "Complete Privacy",
                  description: "No personal data collected. No tracking. No cookies."
                },
                {
                  icon: Clock,
                  title: "Real-Time Sync",
                  description: "Chat, share files, and edit notes together instantly."
                },
                {
                  icon: Trash2,
                  title: "Auto-Delete",
                  description: "All data is permanently deleted when the room closes."
                }
              ].map((feature, index) => (
                <div 
                  key={feature.title}
                  className="group p-6 rounded-2xl bg-background border border-border hover:border-primary/50 hover:shadow-card transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:shadow-glow transition-shadow duration-300">
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                How It Works
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Three simple steps to start sharing
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: "1", title: "Create Room", description: "Click 'Create Room' to get your unique 6-digit code" },
                { step: "2", title: "Share Code", description: "Send the code to anyone you want to collaborate with" },
                { step: "3", title: "Collaborate", description: "Chat, share files, and edit notes together in real-time" }
              ].map((item, index) => (
                <div key={item.step} className="relative text-center animate-slide-up" style={{ animationDelay: `${index * 0.15}s` }}>
                  <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4 shadow-soft">
                    <span className="font-display text-2xl font-bold text-primary-foreground">{item.step}</span>
                  </div>
                  <h3 className="font-display font-semibold text-lg text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary/50 to-transparent" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
