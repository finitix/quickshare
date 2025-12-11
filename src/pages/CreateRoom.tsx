import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { generateRoomCode, getSessionId, getDisplayName } from "@/lib/session";
import { Copy, Check, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

const CreateRoom = () => {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreateRoom = async () => {
    setLoading(true);
    const sessionId = getSessionId();
    const code = generateRoomCode();

    try {
      const { data: room, error } = await supabase
        .from("rooms")
        .insert({
          code,
          creator_session_id: sessionId,
        })
        .select()
        .single();

      if (error) throw error;

      // Create initial shared notes
      await supabase.from("shared_notes").insert({
        room_id: room.id,
        content: "",
      });

      // Log room creation
      await supabase.from("activity_logs").insert({
        room_id: room.id,
        action: "room_created",
        actor_name: getDisplayName(),
        details: "Room was created",
      });

      setRoomCode(code);
      toast.success("Room created successfully!");
    } catch (error) {
      console.error("Error creating room:", error);
      toast.error("Failed to create room. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = async () => {
    if (roomCode) {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      toast.success("Code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleEnterRoom = () => {
    if (roomCode) {
      navigate(`/room/${roomCode}`);
    }
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
                  Create a Room
                </h1>
                <p className="text-muted-foreground">
                  Get your unique 6-digit room code
                </p>
              </div>

              {!roomCode ? (
                <Button
                  variant="hero"
                  size="xl"
                  className="w-full"
                  onClick={handleCreateRoom}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Generate Room Code"
                  )}
                </Button>
              ) : (
                <div className="space-y-6 animate-fade-in">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-3">Your room code:</p>
                    <div className="flex items-center justify-center gap-2">
                      <div className="font-display text-4xl font-bold tracking-widest gradient-primary bg-clip-text text-transparent">
                        {roomCode}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCopyCode}
                        className="rounded-full"
                      >
                        {copied ? (
                          <Check className="w-5 h-5 text-primary" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="bg-accent/50 rounded-xl p-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      Share this code with others to let them join your room
                    </p>
                  </div>

                  <Button
                    variant="hero"
                    size="xl"
                    className="w-full"
                    onClick={handleEnterRoom}
                  >
                    Enter Room
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateRoom;
