export type FileType = "folder" | "image" | "document" | "project" | "wallpaper" | "pdf" | "code";

export interface FileItem {
  id: string;
  name: string;
  type: FileType;
  icon?: string;
  preview?: string;
  content?: string;
  link?: string;
  children?: FileItem[];
  size?: string;
  modified?: string;
}

// Virtual file system structure
export const FILE_SYSTEM: FileItem[] = [
  {
    id: "desktop",
    name: "Desktop",
    type: "folder",
    children: [
      {
        id: "readme",
        name: "README.md",
        type: "document",
        content: "# Welcome to my Portfolio\n\nThis is a macOS-style portfolio built with React.",
        size: "1 KB",
        modified: "Today",
      },
      {
        id: "notes",
        name: "Notes.txt",
        type: "document",
        content: "Personal notes and ideas...",
        size: "512 B",
        modified: "Yesterday",
      },
    ],
  },
  {
    id: "documents",
    name: "Documents",
    type: "folder",
    children: [
      {
        id: "cv-pdf",
        name: "CV.pdf",
        type: "pdf",
        link: "https://drive.google.com/file/d/1nf-GsGo0MrRUgn_6xjvhlnmymZJFpqsA/view?usp=sharing",
        size: "2.5 MB",
        modified: "Last week",
      },
      {
        id: "cover-letter",
        name: "Cover Letter.pdf",
        type: "pdf",
        content: "My professional cover letter...",
        size: "156 KB",
        modified: "Last month",
      },
    ],
  },
  {
    id: "projects",
    name: "Projects",
    type: "folder",
    children: [
      {
        id: "project-1",
        name: "E-Commerce Platform",
        type: "project",
        content: "A full-stack e-commerce solution with React and Node.js",
        link: "https://github.com",
        size: "—",
        modified: "2 days ago",
      },
      {
        id: "project-2",
        name: "Weather App",
        type: "project",
        content: "Real-time weather application using OpenWeather API",
        link: "https://github.com",
        size: "—",
        modified: "1 week ago",
      },
      {
        id: "project-3",
        name: "Task Manager",
        type: "project",
        content: "Productivity app with drag-and-drop functionality",
        link: "https://github.com",
        size: "—",
        modified: "2 weeks ago",
      },
    ],
  },
  {
    id: "gallery",
    name: "Gallery",
    type: "folder",
    children: [
      {
        id: "screenshot-1",
        name: "Project Screenshot 1.png",
        type: "image",
        preview: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400",
        size: "1.2 MB",
        modified: "3 days ago",
      },
      {
        id: "screenshot-2",
        name: "Project Screenshot 2.png",
        type: "image",
        preview: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400",
        size: "890 KB",
        modified: "1 week ago",
      },
      {
        id: "design-mockup",
        name: "Design Mockup.png",
        type: "image",
        preview: "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=400",
        size: "2.1 MB",
        modified: "2 weeks ago",
      },
    ],
  },
  {
    id: "wallpapers",
    name: "Wallpapers",
    type: "folder",
    children: [
      {
        id: "wallpaper-aurora",
        name: "Aurora.jpg",
        type: "wallpaper",
        preview: "linear-gradient(135deg, hsl(220, 60%, 12%) 0%, hsl(260, 40%, 15%) 50%, hsl(200, 50%, 10%) 100%)",
        size: "3.2 MB",
        modified: "—",
      },
      {
        id: "wallpaper-ocean",
        name: "Ocean.jpg",
        type: "wallpaper",
        preview: "linear-gradient(135deg, hsl(200, 70%, 15%) 0%, hsl(180, 60%, 12%) 50%, hsl(220, 50%, 18%) 100%)",
        size: "2.8 MB",
        modified: "—",
      },
      {
        id: "wallpaper-sunset",
        name: "Sunset.jpg",
        type: "wallpaper",
        preview: "linear-gradient(135deg, hsl(350, 60%, 18%) 0%, hsl(30, 50%, 15%) 50%, hsl(280, 40%, 12%) 100%)",
        size: "3.5 MB",
        modified: "—",
      },
      {
        id: "wallpaper-forest",
        name: "Forest.jpg",
        type: "wallpaper",
        preview: "linear-gradient(135deg, hsl(140, 50%, 12%) 0%, hsl(160, 40%, 15%) 50%, hsl(180, 30%, 10%) 100%)",
        size: "4.1 MB",
        modified: "—",
      },
      {
        id: "wallpaper-midnight",
        name: "Midnight.jpg",
        type: "wallpaper",
        preview: "linear-gradient(135deg, hsl(240, 50%, 8%) 0%, hsl(260, 40%, 12%) 50%, hsl(220, 60%, 6%) 100%)",
        size: "2.9 MB",
        modified: "—",
      },
      {
        id: "wallpaper-cosmic",
        name: "Cosmic.jpg",
        type: "wallpaper",
        preview: "linear-gradient(135deg, hsl(280, 60%, 15%) 0%, hsl(320, 50%, 12%) 50%, hsl(260, 40%, 18%) 100%)",
        size: "3.7 MB",
        modified: "—",
      },
    ],
  },
];

// Helper functions
export function findFolder(path: string[]): FileItem | undefined {
  if (path.length === 0) return undefined;
  
  let current: FileItem | undefined = FILE_SYSTEM.find((f) => f.id === path[0]);
  
  for (let i = 1; i < path.length; i++) {
    if (!current?.children) return undefined;
    current = current.children.find((f) => f.id === path[i]);
  }
  
  return current;
}

export function getFileIcon(type: FileType): string {
  switch (type) {
    case "folder":
      return "📁";
    case "image":
      return "🖼️";
    case "document":
      return "📄";
    case "project":
      return "🚀";
    case "wallpaper":
      return "🎨";
    case "pdf":
      return "📕";
    case "code":
      return "💻";
    default:
      return "📄";
  }
}

export function formatFileSize(size: string): string {
  return size;
}
