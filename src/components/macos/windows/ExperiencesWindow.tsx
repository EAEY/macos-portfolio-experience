import { Briefcase, Calendar, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  technologies: string[];
}

const experiences: Experience[] = [
  {
    id: "1",
    company: "Tech Company",
    role: "Senior Full-Stack Developer",
    location: "Cairo, Egypt",
    startDate: "Jan 2023",
    endDate: "Present",
    description:
      "Leading development of enterprise web applications using React and Node.js. Mentoring junior developers and implementing best practices for code quality and performance.",
    technologies: ["React", "Node.js", "TypeScript", "PostgreSQL"],
  },
  {
    id: "2",
    company: "Digital Agency",
    role: "Full-Stack Developer",
    location: "Remote",
    startDate: "Jun 2021",
    endDate: "Dec 2022",
    description:
      "Developed responsive web applications for various clients. Collaborated with designers to implement pixel-perfect UIs and integrated third-party APIs.",
    technologies: ["Vue.js", "Python", "Django", "MongoDB"],
  },
  {
    id: "3",
    company: "Startup Inc",
    role: "Frontend Developer",
    location: "Alexandria, Egypt",
    startDate: "Mar 2020",
    endDate: "May 2021",
    description:
      "Built interactive user interfaces for a SaaS product. Optimized application performance and implemented responsive designs.",
    technologies: ["React", "Redux", "Tailwind CSS", "REST APIs"],
  },
  {
    id: "4",
    company: "Freelance",
    role: "Web Developer",
    location: "Remote",
    startDate: "Jan 2019",
    endDate: "Feb 2020",
    description:
      "Worked with various clients to deliver custom websites and web applications. Managed projects from concept to deployment.",
    technologies: ["HTML/CSS", "JavaScript", "WordPress", "PHP"],
  },
];

const TimelineItem = ({
  experience,
  isLast,
}: {
  experience: Experience;
  isLast: boolean;
}) => {
  return (
    <div className="relative flex gap-4">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-gradient-to-b from-macos-accent-blue to-macos-accent-purple/30" />
      )}

      {/* Timeline dot */}
      <div className="relative z-10 flex-shrink-0">
        <div className="w-6 h-6 rounded-full bg-macos-accent-blue flex items-center justify-center shadow-lg shadow-macos-accent-blue/30">
          <Briefcase className="w-3 h-3 text-white" />
        </div>
      </div>

      {/* Content card */}
      <div
        className={cn(
          "flex-1 pb-8",
          "bg-white/5 rounded-xl p-4 border border-glass-border",
          "hover:bg-white/8 hover:border-macos-accent-blue/30 transition-all duration-300"
        )}
      >
        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-semibold text-foreground">{experience.role}</h3>
            <p className="text-macos-accent-blue font-medium">
              {experience.company}
            </p>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {experience.startDate} - {experience.endDate}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3" />
              {experience.location}
            </div>
          </div>
        </div>

        <p className="text-sm text-foreground/70 mb-3 leading-relaxed">
          {experience.description}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {experience.technologies.map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 text-xs rounded-full bg-macos-accent-purple/20 text-macos-accent-purple"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ExperiencesWindow = () => {
  return (
    <div className="h-full overflow-auto pr-2">
      <div className="space-y-0">
        {experiences.map((exp, index) => (
          <div
            key={exp.id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <TimelineItem
              experience={exp}
              isLast={index === experiences.length - 1}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperiencesWindow;
