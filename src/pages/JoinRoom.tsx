import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

const JoinRoom = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    const formattedCode = code.toUpperCase().trim();
    if (formattedCode.length !== 6) {
      setError("Please enter a valid 6-character code");
      return;
    }

    setLoading(true);

    try {
      const { data: room, error: fetchError } = await supabase
        .from("rooms")
        .select("id, is_active")
        .eq("code", formattedCode)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (!room) {
        setError("Room not found. Please check the code and try again.");
        return;
      }

      if (!room.is_active) {
        setError("This room has been closed.");
        return;
      }

      navigate(`/room/${formattedCode}`);
    } catch (err) {
      console.error("Error joining room:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
    setCode(value);
    setError("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="bg-card border border-border rounded-2xl p-8 shadow-card animate-slide-up">
              <div className="text-center mb-8">
                <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                  Join a Room
                </h1>
                <p className="text-muted-foreground">
                  Enter the 6-digit code to join
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="Enter room code"
                    value={code}
                    onChange={handleCodeChange}
                    className="text-center font-display text-2xl tracking-widest h-14 uppercase"
                    maxLength={6}
                    autoFocus
                  />
                  {error && (
                    <p className="text-sm text-destructive text-center animate-fade-in">
                      {error}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  size="xl"
                  className="w-full"
                  disabled={loading || code.length !== 6}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    <>
                      Join Room
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JoinRoom;
