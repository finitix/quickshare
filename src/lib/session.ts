// Generate a unique session ID for the user
export const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('quickshare_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem('quickshare_session_id', sessionId);
  }
  return sessionId;
};

// Generate a 6-character room code
export const generateRoomCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Format file size for display
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Format timestamp for display
export const formatTime = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
};

// Get user display name
export const getDisplayName = (): string => {
  let name = sessionStorage.getItem('quickshare_display_name');
  if (!name) {
    const userNumber = Math.floor(Math.random() * 9999) + 1;
    name = `User ${userNumber}`;
    sessionStorage.setItem('quickshare_display_name', name);
  }
  return name;
};
