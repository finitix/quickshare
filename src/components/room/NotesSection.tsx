import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import debounce from "lodash.debounce";

interface NotesSectionProps {
  roomId: string;
}

const NotesSection = ({ roomId }: NotesSectionProps) => {
  const [content, setContent] = useState("");
  const [copied, setCopied] = useState(false);
  const [noteId, setNoteId] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      const { data } = await supabase
        .from("shared_notes")
        .select("*")
        .eq("room_id", roomId)
        .maybeSingle();

      if (data) {
        setContent(data.content);
        setNoteId(data.id);
      }
    };

    fetchNotes();

    // Subscribe to note changes
    const channel = supabase
      .channel(`notes-${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "shared_notes",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          setContent((payload.new as { content: string }).content);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  const saveNotes = useCallback(
    debounce(async (newContent: string) => {
      if (!noteId) return;

      await supabase
        .from("shared_notes")
        .update({ content: newContent, updated_at: new Date().toISOString() })
        .eq("id", noteId);
    }, 500),
    [noteId]
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    saveNotes(newContent);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("Notes copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 h-[500px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-semibold">Shared Notes</h3>
        <Button variant="outline" size="sm" onClick={handleCopy} disabled={!content}>
          {copied ? (
            <Check className="w-4 h-4 text-primary" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          {copied ? "Copied!" : "Copy All"}
        </Button>
      </div>

      <div className="flex-1 relative">
        <Textarea
          value={content}
          onChange={handleChange}
          placeholder="Start typing notes here... Changes are synced in real-time with everyone in the room."
          className="w-full h-full resize-none font-mono text-sm"
        />
      </div>

      <p className="text-xs text-muted-foreground mt-3 text-center">
        Notes are synced in real-time with all room members
      </p>
    </div>
  );
};

export default NotesSection;
