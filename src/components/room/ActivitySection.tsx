import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatTime } from "@/lib/session";
import { UserPlus, Upload, XCircle, Clock } from "lucide-react";

interface ActivityLog {
  id: string;
  action: string;
  actor_name: string | null;
  details: string | null;
  created_at: string;
}

interface ActivitySectionProps {
  roomId: string;
}

const ActivitySection = ({ roomId }: ActivitySectionProps) => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const { data } = await supabase
        .from("activity_logs")
        .select("*")
        .eq("room_id", roomId)
        .order("created_at", { ascending: false })
        .limit(50);

      if (data) setLogs(data);
    };

    fetchLogs();

    // Subscribe to new logs
    const channel = supabase
      .channel(`activity-${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "activity_logs",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          setLogs((prev) => [payload.new as ActivityLog, ...prev].slice(0, 50));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  const getActionIcon = (action: string) => {
    switch (action) {
      case "member_joined":
        return <UserPlus className="w-4 h-4 text-primary" />;
      case "file_uploaded":
        return <Upload className="w-4 h-4 text-primary" />;
      case "room_closed":
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case "member_joined":
        return "Joined";
      case "file_uploaded":
        return "Uploaded";
      case "room_created":
        return "Created";
      case "room_closed":
        return "Closed";
      default:
        return action;
    }
  };

  return (
    <div className="p-6">
      <h3 className="font-display text-lg font-semibold mb-4">Activity Log</h3>

      {logs.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No activity yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg animate-fade-in"
            >
              <div className="mt-0.5">{getActionIcon(log.action)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium">{log.actor_name || "System"}</span>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    {getActionLabel(log.action)}
                  </span>
                </div>
                {log.details && (
                  <p className="text-sm text-muted-foreground mt-1 truncate">
                    {log.details}
                  </p>
                )}
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {formatTime(log.created_at)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivitySection;
