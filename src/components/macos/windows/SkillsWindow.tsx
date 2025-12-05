import { useState } from "react";
import { cn } from "@/lib/utils";

interface Skill {
  name: string;
  level: number; // 0-100
  color: string;
}

interface SkillCategory {
  id: string;
  label: string;
  skills: Skill[];
}

const skillCategories: SkillCategory[] = [
  {
    id: "frontend",
    label: "Frontend",
    skills: [
      { name: "React", level: 90, color: "hsl(var(--macos-accent-blue))" },
      { name: "TypeScript", level: 85, color: "hsl(var(--macos-accent-blue))" },
      { name: "Next.js", level: 80, color: "hsl(var(--macos-accent-purple))" },
      { name: "Tailwind CSS", level: 95, color: "hsl(var(--macos-accent-cyan))" },
      { name: "HTML/CSS", level: 95, color: "hsl(var(--macos-accent-orange))" },
      { name: "JavaScript", level: 90, color: "hsl(var(--macos-accent-yellow))" },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    skills: [
      { name: "Node.js", level: 85, color: "hsl(var(--macos-accent-green))" },
      { name: "Python", level: 75, color: "hsl(var(--macos-accent-blue))" },
      { name: "PostgreSQL", level: 80, color: "hsl(var(--macos-accent-blue))" },
      { name: "MongoDB", level: 70, color: "hsl(var(--macos-accent-green))" },
      { name: "REST APIs", level: 90, color: "hsl(var(--macos-accent-purple))" },
      { name: "GraphQL", level: 65, color: "hsl(var(--macos-accent-pink))" },
    ],
  },
  {
    id: "tools",
    label: "Tools & Design",
    skills: [
      { name: "Git", level: 90, color: "hsl(var(--macos-accent-orange))" },
      { name: "Figma", level: 85, color: "hsl(var(--macos-accent-purple))" },
      { name: "Docker", level: 60, color: "hsl(var(--macos-accent-blue))" },
      { name: "VS Code", level: 95, color: "hsl(var(--macos-accent-blue))" },
      { name: "Linux", level: 70, color: "hsl(var(--macos-accent-yellow))" },
      { name: "Photoshop", level: 75, color: "hsl(var(--macos-accent-blue))" },
    ],
  },
];

const RadialProgress = ({ skill }: { skill: Skill }) => {
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (skill.level / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-white/10"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={skill.color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 6px ${skill.color})`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-foreground">{skill.level}%</span>
        </div>
      </div>
      <span className="text-sm font-medium text-foreground/80">{skill.name}</span>
    </div>
  );
};

export const SkillsWindow = () => {
  const [activeCategory, setActiveCategory] = useState<string>("frontend");

  const currentCategory = skillCategories.find((c) => c.id === activeCategory);

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Category Toggles */}
      <div className="flex gap-2 justify-center">
        {skillCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              activeCategory === category.id
                ? "bg-macos-accent-blue text-white shadow-lg shadow-macos-accent-blue/30"
                : "bg-white/10 text-foreground/70 hover:bg-white/20 hover:text-foreground"
            )}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 p-2">
          {currentCategory?.skills.map((skill, index) => (
            <div
              key={skill.name}
              className="animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <RadialProgress skill={skill} />
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground border-t border-glass-border/50 pt-4">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-macos-accent-green" />
          Expert (90%+)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-macos-accent-blue" />
          Proficient (70-89%)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-macos-accent-orange" />
          Intermediate (50-69%)
        </span>
      </div>
    </div>
  );
};

export default SkillsWindow;
