import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getSessionId, getDisplayName } from "@/lib/session";
import Header from "@/components/Header";
import RoomHeader from "@/components/room/RoomHeader";
import ChatSection from "@/components/room/ChatSection";
import FilesSection from "@/components/room/FilesSection";
import NotesSection from "@/components/room/NotesSection";
import ActivitySection from "@/components/room/ActivitySection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, FileText, StickyNote, Activity, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Room {
  id: string;
  code: string;
  creator_session_id: string;
  is_active: boolean;
}

interface Member {
  id: string;
  session_id: string;
  display_name: string;
}

const Room = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const sessionId = getSessionId();
  const displayName = getDisplayName();
  const isCreator = room?.creator_session_id === sessionId;

  useEffect(() => {
    if (!code) {
      navigate("/");
      return;
    }

    const fetchRoom = async () => {
      const { data: roomData, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("code", code.toUpperCase())
        .maybeSingle();

      if (error || !roomData) {
        toast.error("Room not found");
        navigate("/");
        return;
      }

      if (!roomData.is_active) {
        navigate("/room-closed");
        return;
      }

      setRoom(roomData);
      setLoading(false);

      // Join room
      await supabase.from("room_members").upsert({
        room_id: roomData.id,
        session_id: sessionId,
        display_name: displayName,
      }, { onConflict: 'room_id,session_id' });

      // Log join
      await supabase.from("activity_logs").insert({
        room_id: roomData.id,
        action: "member_joined",
        actor_name: displayName,
        details: `${displayName} joined the room`,
      });
    };

    fetchRoom();
  }, [code, navigate, sessionId, displayName]);

  useEffect(() => {
    if (!room) return;

    // Fetch initial members
    const fetchMembers = async () => {
      const { data } = await supabase
        .from("room_members")
        .select("*")
        .eq("room_id", room.id);
      if (data) setMembers(data);
    };

    fetchMembers();

    // Subscribe to member changes
    const channel = supabase
      .channel(`room-members-${room.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "room_members",
          filter: `room_id=eq.${room.id}`,
        },
        () => fetchMembers()
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "rooms",
          filter: `id=eq.${room.id}`,
        },
        (payload) => {
          if (!(payload.new as Room).is_active) {
            navigate("/room-closed");
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [room, navigate]);

  const handleCloseRoom = async () => {
    if (!room || !isCreator) return;

    // Delete all files from storage
    const { data: files } = await supabase
      .from("room_files")
      .select("storage_path")
      .eq("room_id", room.id);

    if (files && files.length > 0) {
      const paths = files.map((f) => f.storage_path);
      await supabase.storage.from("room-files").remove(paths);
    }

    // Mark room as inactive (cascade will delete related data)
    await supabase
      .from("rooms")
      .update({ is_active: false })
      .eq("id", room.id);

    toast.success("Room closed. All data has been deleted.");
    navigate("/room-closed");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!room) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20 pb-6">
        <div className="container mx-auto px-4 h-full">
          <RoomHeader
            roomCode={room.code}
            memberCount={members.length}
            isCreator={isCreator}
            onCloseRoom={handleCloseRoom}
          />

          <Tabs defaultValue="chat" className="mt-6">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">Chat</span>
              </TabsTrigger>
              <TabsTrigger value="files" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Files</span>
              </TabsTrigger>
              <TabsTrigger value="notes" className="flex items-center gap-2">
                <StickyNote className="w-4 h-4" />
                <span className="hidden sm:inline">Notes</span>
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                <span className="hidden sm:inline">Activity</span>
              </TabsTrigger>
            </TabsList>

            <div className="bg-card border border-border rounded-2xl overflow-hidden min-h-[500px]">
              <TabsContent value="chat" className="m-0 h-full">
                <ChatSection roomId={room.id} sessionId={sessionId} displayName={displayName} />
              </TabsContent>
              <TabsContent value="files" className="m-0">
                <FilesSection roomId={room.id} displayName={displayName} />
              </TabsContent>
              <TabsContent value="notes" className="m-0">
                <NotesSection roomId={room.id} />
              </TabsContent>
              <TabsContent value="activity" className="m-0">
                <ActivitySection roomId={room.id} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Room;
