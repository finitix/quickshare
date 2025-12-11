import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, Zap, Users, Trash2, Lock, Clock } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12 animate-slide-up">
              <h1 className="font-display text-4xl font-bold text-foreground mb-4">
                About QuickShare Rooms
              </h1>
              <p className="text-lg text-muted-foreground">
                Instant, secure, and private file sharing for everyone
              </p>
            </div>

            <div className="space-y-8">
              <section className="bg-card border border-border rounded-2xl p-6 animate-fade-in">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                      What is QuickShare Rooms?
                    </h2>
                    <p className="text-muted-foreground">
                      QuickShare Rooms is a modern, privacy-focused platform that lets you create temporary sharing rooms instantly. No registration, no login, no phone number – just a simple 6-digit code to start collaborating.
                    </p>
                  </div>
                </div>
              </section>

              <section className="bg-card border border-border rounded-2xl p-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                      Why We're Fast & Private
                    </h2>
                    <p className="text-muted-foreground">
                      We don't collect any personal information. No accounts means no data to store or protect. Everything happens in real-time with minimal latency, and all data exists only as long as the room is active.
                    </p>
                  </div>
                </div>
              </section>

              <section className="bg-card border border-border rounded-2xl p-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                      How Rooms Work
                    </h2>
                    <ul className="text-muted-foreground space-y-2">
                      <li>• <strong>Create a Room:</strong> Click the button and get a unique 6-digit code</li>
                      <li>• <strong>Share the Code:</strong> Give the code to anyone you want to collaborate with</li>
                      <li>• <strong>Collaborate:</strong> Chat, share files up to 50MB, and edit notes together</li>
                      <li>• <strong>Close the Room:</strong> The creator can close the room at any time</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="bg-card border border-border rounded-2xl p-6 animate-fade-in" style={{ animationDelay: "0.3s" }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                    <Trash2 className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                      Auto-Delete Feature
                    </h2>
                    <p className="text-muted-foreground">
                      When the room creator closes the room, everything is immediately and permanently deleted – all messages, all files, all notes. There's no recovery, no archive, no trace. Your privacy is our priority.
                    </p>
                  </div>
                </div>
              </section>

              <section className="bg-card border border-border rounded-2xl p-6 animate-fade-in" style={{ animationDelay: "0.4s" }}>
                <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                  Key Features
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: Lock, label: "No login required" },
                    { icon: Zap, label: "Instant room creation" },
                    { icon: Users, label: "Real-time collaboration" },
                    { icon: Shield, label: "Complete privacy" },
                    { icon: Clock, label: "Temporary by design" },
                    { icon: Trash2, label: "Auto-delete on close" },
                  ].map((feature) => (
                    <div key={feature.label} className="flex items-center gap-3 text-muted-foreground">
                      <feature.icon className="w-5 h-5 text-primary" />
                      <span>{feature.label}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
