import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12 animate-slide-up">
              <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="font-display text-4xl font-bold text-foreground mb-4">
                Privacy Policy
              </h1>
              <p className="text-lg text-muted-foreground">
                Your privacy is our top priority
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8 space-y-8 animate-fade-in">
              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">
                  No Login Required
                </h2>
                <p className="text-muted-foreground">
                  QuickShare Rooms does not require any form of registration, login, or authentication. You don't need to provide an email address, phone number, or any personal information to use our service.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">
                  No Personal Data Collected
                </h2>
                <p className="text-muted-foreground">
                  We do not collect, store, or process any personal data. The only information we temporarily store is the content you share within a room (messages, files, and notes), which is deleted when the room closes.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">
                  No Tracking
                </h2>
                <p className="text-muted-foreground">
                  We do not use cookies for tracking purposes. We do not use analytics services that track your behavior. We do not sell or share any data with third parties because we don't collect any data to share.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">
                  Temporary Data Storage
                </h2>
                <p className="text-muted-foreground">
                  All room data – including messages, files, and shared notes – is stored temporarily only while the room is active. This data is immediately and permanently deleted when the room creator closes the room.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">
                  Secure File Storage
                </h2>
                <p className="text-muted-foreground">
                  Files uploaded to a room are stored securely and are only accessible through the room. When the room is closed, all files are permanently deleted from our servers. We do not retain copies of any files.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">
                  Encrypted Communications
                </h2>
                <p className="text-muted-foreground">
                  All communications between your browser and our servers are encrypted using industry-standard TLS/SSL encryption. This ensures that your data is protected during transmission.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">
                  Your Responsibility
                </h2>
                <p className="text-muted-foreground">
                  While we take privacy seriously, please be mindful of what you share. Anyone with the room code can access the room's contents. Do not share sensitive personal information, passwords, or confidential documents unless you trust all participants.
                </p>
              </section>

              <section className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Privacy;
