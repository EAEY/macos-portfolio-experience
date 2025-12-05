import { Download, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CVWindow = () => {
  // Placeholder CV URL - replace with actual CV link
  const cvUrl = "#";

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between pb-4 border-b border-glass-border/50">
        <div className="flex items-center gap-2 text-muted-foreground">
          <FileText className="w-5 h-5" />
          <span className="text-sm font-medium">Eyad_Ayman_CV.pdf</span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 bg-white/10 border-glass-border hover:bg-white/20"
            asChild
          >
            <a href={cvUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4" />
              Open in New Tab
            </a>
          </Button>
          <Button
            size="sm"
            className="gap-2 bg-macos-accent-blue hover:bg-macos-accent-blue/90"
            asChild
          >
            <a href={cvUrl} download>
              <Download className="w-4 h-4" />
              Download
            </a>
          </Button>
        </div>
      </div>

      {/* PDF Preview Placeholder */}
      <div className="flex-1 mt-4 rounded-lg bg-white/5 border border-glass-border overflow-hidden">
        <div className="h-full flex flex-col items-center justify-center text-center p-8">
          <div className="w-24 h-32 bg-white/10 rounded-lg flex items-center justify-center mb-6 border border-glass-border">
            <FileText className="w-12 h-12 text-macos-accent-blue/50" />
          </div>
          
          <h3 className="text-lg font-semibold text-foreground mb-2">
            CV Preview
          </h3>
          <p className="text-muted-foreground text-sm max-w-md mb-6">
            Upload your CV PDF to enable preview. For now, you can download the
            CV directly using the button above.
          </p>

          {/* Quick CV Summary */}
          <div className="w-full max-w-md space-y-4 text-left">
            <div className="p-4 rounded-lg bg-white/5 border border-glass-border">
              <h4 className="text-sm font-semibold text-macos-accent-blue mb-2">
                Eyad Ayman
              </h4>
              <p className="text-xs text-muted-foreground">
                Full-Stack Developer & UI/UX Designer
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-white/5 border border-glass-border">
                <div className="text-lg font-bold text-macos-accent-purple">3+</div>
                <div className="text-xs text-muted-foreground">Years Experience</div>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-glass-border">
                <div className="text-lg font-bold text-macos-accent-green">20+</div>
                <div className="text-xs text-muted-foreground">Projects</div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-white/5 border border-glass-border">
              <h4 className="text-sm font-semibold text-foreground mb-2">
                Key Skills
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {["React", "TypeScript", "Node.js", "Python", "UI/UX", "Figma"].map(
                  (skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 text-xs rounded-full bg-macos-accent-blue/20 text-macos-accent-blue"
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVWindow;
