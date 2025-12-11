import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Upload, Download, FileIcon, Image, FileText, Film, Archive, Loader2 } from "lucide-react";
import { formatFileSize } from "@/lib/session";
import { toast } from "sonner";

interface RoomFile {
  id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  storage_path: string;
  uploaded_by: string;
  created_at: string;
}

interface FilesSectionProps {
  roomId: string;
  displayName: string;
}

const FilesSection = ({ roomId, displayName }: FilesSectionProps) => {
  const [files, setFiles] = useState<RoomFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      const { data } = await supabase
        .from("room_files")
        .select("*")
        .eq("room_id", roomId)
        .order("created_at", { ascending: false });
      if (data) setFiles(data);
    };

    fetchFiles();

    // Subscribe to file changes
    const channel = supabase
      .channel(`files-${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "room_files",
          filter: `room_id=eq.${roomId}`,
        },
        () => fetchFiles()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 50MB limit
    if (file.size > 50 * 1024 * 1024) {
      toast.error("File size must be less than 50MB");
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${roomId}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("room-files")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      await supabase.from("room_files").insert({
        room_id: roomId,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        storage_path: fileName,
        uploaded_by: displayName,
      });

      await supabase.from("activity_logs").insert({
        room_id: roomId,
        action: "file_uploaded",
        actor_name: displayName,
        details: `Uploaded ${file.name}`,
      });

      toast.success("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDownload = async (file: RoomFile) => {
    const { data } = await supabase.storage
      .from("room-files")
      .createSignedUrl(file.storage_path, 60);

    if (data?.signedUrl) {
      window.open(data.signedUrl, "_blank");
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return Image;
    if (type.startsWith("video/")) return Film;
    if (type.includes("pdf") || type.includes("document")) return FileText;
    if (type.includes("zip") || type.includes("archive")) return Archive;
    return FileIcon;
  };

  const getPreviewUrl = (file: RoomFile) => {
    if (file.file_type.startsWith("image/")) {
      const { data } = supabase.storage.from("room-files").getPublicUrl(file.storage_path);
      return data.publicUrl;
    }
    return null;
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-lg font-semibold">Shared Files</h3>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleUpload}
            className="hidden"
            id="file-upload"
          />
          <Button
            variant="default"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            {uploading ? "Uploading..." : "Upload File"}
          </Button>
        </div>
      </div>

      {files.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <FileIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No files shared yet</p>
          <p className="text-sm">Upload files to share with everyone in the room</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((file) => {
            const IconComponent = getFileIcon(file.file_type);
            const previewUrl = getPreviewUrl(file);

            return (
              <div
                key={file.id}
                className="bg-secondary/50 rounded-xl p-4 border border-border hover:border-primary/50 transition-colors animate-fade-in"
              >
                {previewUrl ? (
                  <div className="aspect-video rounded-lg overflow-hidden mb-3 bg-muted">
                    <img
                      src={previewUrl}
                      alt={file.file_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-video rounded-lg mb-3 bg-muted flex items-center justify-center">
                    <IconComponent className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}

                <div className="space-y-2">
                  <p className="font-medium text-sm truncate" title={file.file_name}>
                    {file.file_name}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{formatFileSize(file.file_size)}</span>
                    <span>by {file.uploaded_by}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => handleDownload(file)}
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FilesSection;
