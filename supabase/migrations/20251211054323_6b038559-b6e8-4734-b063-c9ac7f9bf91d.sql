-- Create rooms table
CREATE TABLE public.rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(6) NOT NULL UNIQUE,
  creator_session_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Create room members table for tracking connected users
CREATE TABLE public.room_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  display_name TEXT NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(room_id, session_id)
);

-- Create messages table for chat
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create shared notes table
CREATE TABLE public.shared_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE UNIQUE,
  content TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create room files table
CREATE TABLE public.room_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  uploaded_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create activity logs table
CREATE TABLE public.activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  actor_name TEXT,
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (public access for anonymous sharing)
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for rooms (public access for temporary sharing)
CREATE POLICY "Anyone can view active rooms" ON public.rooms
  FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can create rooms" ON public.rooms
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Creator can update room" ON public.rooms
  FOR UPDATE USING (true);

-- RLS policies for room_members
CREATE POLICY "Anyone can view room members" ON public.room_members
  FOR SELECT USING (true);

CREATE POLICY "Anyone can join rooms" ON public.room_members
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can leave rooms" ON public.room_members
  FOR DELETE USING (true);

-- RLS policies for messages
CREATE POLICY "Anyone can view messages" ON public.messages
  FOR SELECT USING (true);

CREATE POLICY "Anyone can send messages" ON public.messages
  FOR INSERT WITH CHECK (true);

-- RLS policies for shared_notes
CREATE POLICY "Anyone can view notes" ON public.shared_notes
  FOR SELECT USING (true);

CREATE POLICY "Anyone can create notes" ON public.shared_notes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update notes" ON public.shared_notes
  FOR UPDATE USING (true);

-- RLS policies for room_files
CREATE POLICY "Anyone can view files" ON public.room_files
  FOR SELECT USING (true);

CREATE POLICY "Anyone can upload files" ON public.room_files
  FOR INSERT WITH CHECK (true);

-- RLS policies for activity_logs
CREATE POLICY "Anyone can view activity" ON public.activity_logs
  FOR SELECT USING (true);

CREATE POLICY "Anyone can log activity" ON public.activity_logs
  FOR INSERT WITH CHECK (true);

-- Enable realtime for messages and notes
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.shared_notes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.room_members;
ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_logs;

-- Create storage bucket for room files
INSERT INTO storage.buckets (id, name, public) VALUES ('room-files', 'room-files', true);

-- Storage policies for room files
CREATE POLICY "Anyone can view room files" ON storage.objects
  FOR SELECT USING (bucket_id = 'room-files');

CREATE POLICY "Anyone can upload room files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'room-files');

CREATE POLICY "Anyone can delete room files" ON storage.objects
  FOR DELETE USING (bucket_id = 'room-files');