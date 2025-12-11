import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Users, XCircle } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface RoomHeaderProps {
  roomCode: string;
  memberCount: number;
  isCreator: boolean;
  onCloseRoom: () => void;
}

const RoomHeader = ({ roomCode, memberCount, isCreator, onCloseRoom }: RoomHeaderProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(roomCode);
    setCopied(true);
    toast.success("Room code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card border border-border rounded-2xl p-4 shadow-card animate-fade-in">
      <div className="flex items-center gap-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Room Code</p>
          <div className="flex items-center gap-2">
            <span className="font-display text-2xl font-bold tracking-widest gradient-primary bg-clip-text text-transparent">
              {roomCode}
            </span>
            <Button variant="ghost" size="icon" onClick={handleCopy} className="h-8 w-8">
              {copied ? (
                <Check className="w-4 h-4 text-primary" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
        
        <div className="h-10 w-px bg-border hidden sm:block" />
        
        <div className="flex items-center gap-2 bg-accent/50 px-3 py-2 rounded-lg">
          <Users className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">
            {memberCount} {memberCount === 1 ? "member" : "members"}
          </span>
        </div>
      </div>

      {isCreator && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <XCircle className="w-4 h-4" />
              Close Room
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Close this room?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete all messages, files, and notes in this room. 
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onCloseRoom} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Close Room
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default RoomHeader;
