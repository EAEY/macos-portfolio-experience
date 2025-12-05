import { useState } from "react";
import { ExternalLink, Github, Figma, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image?: string;
  liveUrl?: string;
  repoUrl?: string;
  figmaUrl?: string;
}

const projects: Project[] = [
  {
    id: "1",
    title: "E-Commerce Platform",
    description:
      "A full-featured e-commerce platform with product management, cart functionality, and payment integration. Built with React, Node.js, and PostgreSQL.",
    tags: ["React", "Node.js", "PostgreSQL", "Stripe"],
    liveUrl: "#",
    repoUrl: "#",
  },
  {
    id: "2",
    title: "Task Management App",
    description:
      "A collaborative task management application with real-time updates, team collaboration features, and progress tracking.",
    tags: ["Next.js", "TypeScript", "Supabase", "Tailwind"],
    liveUrl: "#",
    repoUrl: "#",
    figmaUrl: "#",
  },
  {
    id: "3",
    title: "AI Chat Assistant",
    description:
      "An intelligent chatbot powered by GPT-4 with context awareness and multi-turn conversations for customer support.",
    tags: ["Python", "FastAPI", "OpenAI", "React"],
    liveUrl: "#",
    repoUrl: "#",
  },
  {
    id: "4",
    title: "Portfolio Website",
    description:
      "This macOS-inspired portfolio website you're currently viewing! Built with React, TypeScript, and lots of attention to detail.",
    tags: ["React", "TypeScript", "Tailwind", "Framer Motion"],
    repoUrl: "#",
  },
  {
    id: "5",
    title: "Weather Dashboard",
    description:
      "A beautiful weather dashboard with location-based forecasts, interactive maps, and severe weather alerts.",
    tags: ["Vue.js", "OpenWeather API", "Mapbox", "D3.js"],
    liveUrl: "#",
    repoUrl: "#",
  },
  {
    id: "6",
    title: "Social Media Analytics",
    description:
      "A comprehensive analytics dashboard for tracking social media performance across multiple platforms.",
    tags: ["React", "Chart.js", "Node.js", "MongoDB"],
    liveUrl: "#",
    figmaUrl: "#",
  },
];

const ProjectCard = ({
  project,
  onClick,
}: {
  project: Project;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-xl cursor-pointer",
        "bg-white/5 border border-glass-border",
        "hover:bg-white/10 hover:border-macos-accent-blue/50",
        "transition-all duration-300"
      )}
    >
      {/* Project Image Placeholder */}
      <div className="aspect-video bg-gradient-to-br from-macos-accent-blue/20 to-macos-accent-purple/20 flex items-center justify-center">
        <span className="text-4xl opacity-50">🖼️</span>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-foreground group-hover:text-macos-accent-blue transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1">
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs rounded-full bg-macos-accent-blue/20 text-macos-accent-blue"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-white/10 text-muted-foreground">
              +{project.tags.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
        <span className="text-sm font-medium text-white">Click to view details</span>
      </div>
    </div>
  );
};

const ProjectModal = ({
  project,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: {
  project: Project;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-glass-bg/95 backdrop-blur-xl border border-glass-border rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors"
        >
          <X className="w-4 h-4 text-white" />
        </button>

        {/* Navigation buttons */}
        {hasPrev && (
          <button
            onClick={onPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
        )}
        {hasNext && (
          <button
            onClick={onNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        )}

        {/* Image */}
        <div className="aspect-video bg-gradient-to-br from-macos-accent-blue/30 to-macos-accent-purple/30 flex items-center justify-center">
          <span className="text-6xl opacity-50">🖼️</span>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <h2 className="text-2xl font-bold text-foreground">{project.title}</h2>
          <p className="text-foreground/80 leading-relaxed">{project.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-sm rounded-full bg-macos-accent-blue/20 text-macos-accent-blue"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="flex gap-3 pt-4 border-t border-glass-border/50">
            {project.liveUrl && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-macos-accent-blue/20 border-macos-accent-blue/40 hover:bg-macos-accent-blue/30"
                asChild
              >
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                  Live Demo
                </a>
              </Button>
            )}
            {project.repoUrl && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-white/10 border-glass-border hover:bg-white/20"
                asChild
              >
                <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4" />
                  Repository
                </a>
              </Button>
            )}
            {project.figmaUrl && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-macos-accent-purple/20 border-macos-accent-purple/40 hover:bg-macos-accent-purple/30"
                asChild
              >
                <a href={project.figmaUrl} target="_blank" rel="noopener noreferrer">
                  <Figma className="w-4 h-4" />
                  Figma
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProjectsWindow = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const selectedIndex = selectedProject
    ? projects.findIndex((p) => p.id === selectedProject.id)
    : -1;

  const handlePrev = () => {
    if (selectedIndex > 0) {
      setSelectedProject(projects[selectedIndex - 1]);
    }
  };

  const handleNext = () => {
    if (selectedIndex < projects.length - 1) {
      setSelectedProject(projects[selectedIndex + 1]);
    }
  };

  return (
    <div className="h-full overflow-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-2">
        {projects.map((project, index) => (
          <div
            key={project.id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <ProjectCard
              project={project}
              onClick={() => setSelectedProject(project)}
            />
          </div>
        ))}
      </div>

      {/* Project Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onPrev={handlePrev}
          onNext={handleNext}
          hasPrev={selectedIndex > 0}
          hasNext={selectedIndex < projects.length - 1}
        />
      )}
    </div>
  );
};

export default ProjectsWindow;
