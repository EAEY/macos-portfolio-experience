import { useState, useEffect } from "react";
import { Cpu, HardDrive, Wifi, Battery } from "lucide-react";

interface SystemStatus {
  cpu: number;
  memory: number;
  storage: number;
  battery: number;
  uptime: string;
  network: "connected" | "disconnected";
}

// Simulate system status - in production, this could use actual system APIs
const getRandomStatus = (): SystemStatus => ({
  cpu: Math.floor(Math.random() * 40) + 10,
  memory: Math.floor(Math.random() * 30) + 40,
  storage: Math.floor(Math.random() * 20) + 50,
  battery: Math.floor(Math.random() * 20) + 75,
  uptime: "2h 34m",
  network: "connected",
});

export const SystemStatusWidget = () => {
  const [status, setStatus] = useState<SystemStatus>(getRandomStatus);

  useEffect(() => {
    // Update status every 5 seconds
    const timer = setInterval(() => {
      setStatus((prev) => ({
        ...getRandomStatus(),
        uptime: prev.uptime, // Keep uptime stable
      }));
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const StatusBar = ({ value, color }: { value: number; color: string }) => (
    <div className="h-1.5 bg-foreground/10 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* CPU */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3 h-3 text-muted-foreground" />
            <span className="text-[11px]">CPU</span>
          </div>
          <span className="text-[11px] text-muted-foreground">{status.cpu}%</span>
        </div>
        <StatusBar value={status.cpu} color="bg-blue-500" />
      </div>

      {/* Memory */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5">
            <HardDrive className="w-3 h-3 text-muted-foreground" />
            <span className="text-[11px]">Memory</span>
          </div>
          <span className="text-[11px] text-muted-foreground">{status.memory}%</span>
        </div>
        <StatusBar value={status.memory} color="bg-green-500" />
      </div>

      {/* Storage */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5">
            <HardDrive className="w-3 h-3 text-muted-foreground" />
            <span className="text-[11px]">Storage</span>
          </div>
          <span className="text-[11px] text-muted-foreground">{status.storage}%</span>
        </div>
        <StatusBar value={status.storage} color="bg-yellow-500" />
      </div>

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between text-[10px] text-muted-foreground">
        <div className="flex items-center gap-1">
          <Wifi className={`w-3 h-3 ${status.network === "connected" ? "text-green-500" : "text-red-500"}`} />
          <span>{status.network}</span>
        </div>
        <div className="flex items-center gap-1">
          <Battery className="w-3 h-3" />
          <span>{status.battery}%</span>
        </div>
        <span>Up: {status.uptime}</span>
      </div>
    </div>
  );
};

export default SystemStatusWidget;
