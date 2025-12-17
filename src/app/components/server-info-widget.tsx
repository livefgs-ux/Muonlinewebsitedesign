import { useState, useEffect } from "react";
import {
  Server,
  Users,
  TrendingUp,
  Zap,
  Circle,
} from "lucide-react";
import { Card } from "./ui/card";
import { motion } from "motion/react";

export function ServerInfoWidget() {
  const [isOnline, setIsOnline] = useState(true);
  const [onlinePlayers, setOnlinePlayers] = useState(1247);

  // Simulate real-time player count changes
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlinePlayers((prev) => {
        const change = Math.floor(Math.random() * 10) - 5;
        const newCount = prev + change;
        return Math.max(1200, Math.min(1300, newCount));
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const serverInfo = [
    { label: "Versão", value: "Season 19-2-3", icon: Server },
    { label: "EXP Rate", value: "500x", icon: TrendingUp },
    { label: "Drop Rate", value: "70%", icon: Zap },
    {
      label: "Players Online",
      value: onlinePlayers.toLocaleString(),
      icon: Users,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed right-6 top-24 z-40 hidden lg:block"
    >
      <Card className="backdrop-blur-lg bg-black/70 border-yellow-500/30 p-6 w-64">
        {/* Server Status */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white">Status do Servidor</h3>
            <div className="flex items-center gap-2">
              <Circle
                className={`w-3 h-3 ${isOnline ? "fill-green-500 text-green-500" : "fill-red-500 text-red-500"}`}
              />
              <span
                className={`text-sm ${isOnline ? "text-green-500" : "text-red-500"}`}
              >
                {isOnline ? "Online" : "Offline"}
              </span>
            </div>
          </div>

          {isOnline && (
            <div className="h-2 bg-black/50 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-500 to-yellow-500"
                initial={{ width: "0%" }}
                animate={{ width: "95%" }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>
          )}
        </div>

        {/* Server Info */}
        <div className="space-y-3">
          {serverInfo.map((info, index) => (
            <motion.div
              key={info.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-yellow-500/20"
            >
              <div className="flex items-center gap-2">
                <info.icon className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-400 text-sm">
                  {info.label}
                </span>
              </div>
              <span className="text-white">{info.value}</span>
            </motion.div>
          ))}
        </div>

        {/* Social Links */}
        <div className="mt-6 pt-6 border-t border-yellow-500/20">
          <h4 className="text-white text-sm mb-3">
            Comunidade
          </h4>
          <div className="flex flex-col gap-2">
            {[
              {
                name: "Discord",
                color:
                  "bg-indigo-500/20 hover:bg-indigo-500/30 border-indigo-500/50 text-indigo-500",
              },
              {
                name: "WhatsApp",
                color:
                  "bg-green-500/40 hover:bg-green-500/50 border-green-500/50 text-green-500",
              },
              {
                name: "Fórum",
                color:
                  "bg-yellow-500/20 hover:bg-yellow-500/30 border-yellow-500/50 text-yellow-500",
              },
            ].map((social) => (
              <button
                key={social.name}
                className={`px-4 py-2 rounded text-sm border transition-all ${social.color}`}
              >
                {social.name}
              </button>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}