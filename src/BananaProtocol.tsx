import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import {
  Zap,
  Activity,
  Cpu,
  Database,
  Shield,
  Radio,
  BarChart3,
  Hexagon,
  CircuitBoard,
  Eye,
  Power,
  Terminal,
  Wifi,
  Lock,
  Layers,
  GitBranch,
  Triangle,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────
interface Ripple {
  id: number;
  x: number;
  y: number;
  timestamp: number;
}

interface DataShard {
  id: number;
  value: string;
  type: 'cyan' | 'yellow';
  x: number;
  delay: number;
}

interface CircuitNode {
  id: string;
  label: string;
  x: number;
  y: number;
  icon: React.ReactNode;
  value: number;
}

interface PulseWave {
  id: number;
  originX: number;
  originY: number;
}

// ─── Utility: Generate random hex string ─────────────────────────────
const randomHex = (length: number): string => {
  const chars = '0123456789ABCDEF';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

// ─── Utility: Generate random data shard ─────────────────────────────
const generateShard = (id: number): DataShard => ({
  id,
  value: `0x${randomHex(8)}`,
  type: Math.random() > 0.4 ? 'cyan' : 'yellow',
  x: Math.random() * 100,
  delay: Math.random() * 0.5,
});

// ─── Sub-component: Liquid Light Progress Bar ────────────────────────
const LiquidLightBar: React.FC<{
  value: number;
  label: string;
  color?: 'yellow' | 'cyan';
  overclocked: boolean;
}> = ({ value, label, color = 'yellow', overclocked }) => {
  const glowColor = color === 'yellow' ? '#E6F24A' : '#43E8FF';
  const bgGlow = color === 'yellow' ? 'rgba(230,242,74,0.1)' : 'rgba(67,232,255,0.1)';

  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-mono">
          {label}
        </span>
        <span
          className="text-[10px] font-mono font-bold"
          style={{ color: glowColor }}
        >
          {value.toFixed(1)}%
        </span>
      </div>
      <div
        className="relative h-2 rounded-sm overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Sealed channel border glow */}
        <div
          className="absolute inset-0 rounded-sm"
          style={{
            boxShadow: `inset 0 0 4px ${bgGlow}`,
          }}
        />
        {/* Liquid light fill */}
        <motion.div
          className="absolute top-0 left-0 h-full rounded-sm"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{
            background: `linear-gradient(90deg, ${glowColor}44, ${glowColor})`,
            boxShadow: `0 0 12px ${glowColor}88, 0 0 24px ${glowColor}44`,
          }}
        >
          {/* Animated shimmer */}
          <motion.div
            className="absolute inset-0"
            animate={{
              backgroundPosition: ['0% 0%', '200% 0%'],
            }}
            transition={{
              duration: overclocked ? 0.8 : 2,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)`,
              backgroundSize: '50% 100%',
            }}
          />
        </motion.div>
        {/* Leading edge pulse */}
        <motion.div
          className="absolute top-0 h-full w-1"
          animate={{
            left: `${value - 1}%`,
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            opacity: {
              duration: overclocked ? 0.4 : 1,
              repeat: Infinity,
            },
          }}
          style={{
            background: glowColor,
            boxShadow: `0 0 8px ${glowColor}, 0 0 16px ${glowColor}`,
            borderRadius: '0 2px 2px 0',
          }}
        />
      </div>
    </div>
  );
};

// ─── Sub-component: Glass Card ───────────────────────────────────────
const GlassCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  overclocked?: boolean;
}> = ({ children, className = '', onClick, overclocked = false }) => {
  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.08)',
        clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
      }}
    >
      {/* Corner accents */}
      <div
        className="absolute top-0 right-0 w-3 h-3"
        style={{
          background: `linear-gradient(225deg, ${overclocked ? '#E6F24A' : 'rgba(255,255,255,0.15)'} 0%, transparent 70%)`,
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-3 h-3"
        style={{
          background: `linear-gradient(45deg, ${overclocked ? '#E6F24A' : 'rgba(255,255,255,0.15)'} 0%, transparent 70%)`,
        }}
      />
      {/* Inner glow on overclock */}
      {overclocked && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            boxShadow: [
              'inset 0 0 20px rgba(230,242,74,0.05)',
              'inset 0 0 40px rgba(230,242,74,0.1)',
              'inset 0 0 20px rgba(230,242,74,0.05)',
            ],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
      {children}
    </motion.div>
  );
};

// ─── Sub-component: Stat Card ────────────────────────────────────────
const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue?: string;
  color?: 'yellow' | 'cyan';
  overclocked: boolean;
  onTap: (e: React.MouseEvent) => void;
}> = ({ icon, label, value, subValue, color = 'yellow', overclocked, onTap }) => {
  const glowColor = color === 'yellow' ? '#E6F24A' : '#43E8FF';

  return (
    <GlassCard className="p-4 cursor-pointer" onClick={onTap} overclocked={overclocked}>
      <div className="flex items-start justify-between mb-2">
        <motion.div
          animate={{
            filter: overclocked
              ? ['drop-shadow(0 0 4px rgba(230,242,74,0.5))', 'drop-shadow(0 0 12px rgba(230,242,74,0.8))', 'drop-shadow(0 0 4px rgba(230,242,74,0.5))']
              : 'none',
          }}
          transition={{ duration: overclocked ? 0.8 : 2, repeat: Infinity }}
          style={{ color: glowColor }}
        >
          {icon}
        </motion.div>
        <motion.div
          className="w-1.5 h-1.5 rounded-full"
          animate={{
            backgroundColor: [glowColor, `${glowColor}44`, glowColor],
            boxShadow: [`0 0 4px ${glowColor}`, `0 0 8px ${glowColor}`, `0 0 4px ${glowColor}`],
          }}
          transition={{ duration: overclocked ? 0.6 : 1.5, repeat: Infinity }}
        />
      </div>
      <p className="text-[9px] uppercase tracking-[0.2em] text-gray-500 font-mono mb-1">
        {label}
      </p>
      <p className="text-lg font-bold font-mono" style={{ color: glowColor }}>
        {value}
      </p>
      {subValue && (
        <p className="text-[9px] text-gray-500 font-mono mt-1">{subValue}</p>
      )}
    </GlassCard>
  );
};

// ─── Sub-component: Data Harvest Monitor ─────────────────────────────
const DataHarvestMonitor: React.FC<{
  overclocked: boolean;
  onTap: (e: React.MouseEvent) => void;
}> = ({ overclocked, onTap }) => {
  const [shards, setShards] = useState<DataShard[]>([]);
  const shardIdRef = useRef(0);
  const maxShards = 20;

  useEffect(() => {
    const interval = setInterval(
      () => {
        setShards((prev) => {
          const newShard = generateShard(shardIdRef.current++);
          const updated = [...prev, newShard];
          if (updated.length > maxShards) {
            return updated.slice(-maxShards);
          }
          return updated;
        });
      },
      overclocked ? 200 : 600
    );
    return () => clearInterval(interval);
  }, [overclocked]);

  return (
    <GlassCard className="p-4 h-full" onClick={onTap} overclocked={overclocked}>
      <div className="flex items-center gap-2 mb-3">
        <Database size={14} className="text-[#43E8FF]" />
        <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-mono">
          Data Harvest — Live Feed
        </span>
        <motion.div
          className="ml-auto flex items-center gap-1"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: overclocked ? 0.4 : 1, repeat: Infinity }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#43E8FF]" />
          <span className="text-[8px] text-[#43E8FF] font-mono">STREAMING</span>
        </motion.div>
      </div>
      <div className="relative h-48 overflow-hidden rounded-sm" style={{ background: 'rgba(0,0,0,0.3)' }}>
        {/* Scan line effect */}
        <motion.div
          className="absolute left-0 right-0 h-px pointer-events-none z-10"
          animate={{ top: ['0%', '100%'] }}
          transition={{ duration: overclocked ? 1 : 3, repeat: Infinity, ease: 'linear' }}
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(67,232,255,0.3), transparent)',
          }}
        />
        {/* Data shards */}
        <div className="absolute inset-0 flex flex-col-reverse gap-px p-1 overflow-hidden">
          <AnimatePresence mode="popLayout">
            {shards.map((shard) => (
              <motion.div
                key={shard.id}
                initial={{ opacity: 0, x: 20, scaleX: 0.8 }}
                animate={{ opacity: 1, x: 0, scaleX: 1 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, delay: shard.delay * 0.1 }}
                className="flex items-center gap-2 font-mono text-[9px]"
              >
                <motion.span
                  className="inline-block w-1 h-1 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: shard.type === 'cyan' ? '#43E8FF' : '#E6F24A',
                    boxShadow: `0 0 4px ${shard.type === 'cyan' ? '#43E8FF' : '#E6F24A'}`,
                  }}
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 0.6 }}
                />
                <span style={{ color: shard.type === 'cyan' ? '#43E8FF' : '#E6F24A' }}>
                  {shard.value}
                </span>
                <span className="text-gray-600">
                  │ BLK:{randomHex(4)} │ SZ:{Math.floor(Math.random() * 9999)}
                </span>
                <ChevronRight size={8} className="text-gray-700" />
                <span className="text-gray-500">{randomHex(6)}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(18,22,29,0.8) 0%, transparent 20%, transparent 80%, rgba(18,22,29,0.9) 100%)',
          }}
        />
      </div>
    </GlassCard>
  );
};

// ─── Sub-component: Circuit Sync Visualization ───────────────────────
const CircuitSync: React.FC<{
  overclocked: boolean;
  onTap: (e: React.MouseEvent) => void;
}> = ({ overclocked, onTap }) => {
  const nodes: CircuitNode[] = useMemo(
    () => [
      { id: 'core', label: 'CORE', x: 50, y: 50, icon: <Hexagon size={16} />, value: 98.7 },
      { id: 'neural', label: 'NEURAL', x: 15, y: 20, icon: <CircuitBoard size={14} />, value: 87.3 },
      { id: 'shield', label: 'SHIELD', x: 85, y: 20, icon: <Shield size={14} />, value: 95.1 },
      { id: 'sync', label: 'SYNC', x: 15, y: 80, icon: <Radio size={14} />, value: 92.4 },
      { id: 'data', label: 'DATA', x: 85, y: 80, icon: <Layers size={14} />, value: 78.9 },
    ],
    []
  );

  const connections = useMemo(
    () => [
      ['core', 'neural'],
      ['core', 'shield'],
      ['core', 'sync'],
      ['core', 'data'],
      ['neural', 'shield'],
      ['sync', 'data'],
    ],
    []
  );

  const getNode = useCallback(
    (id: string) => nodes.find((n) => n.id === id)!,
    [nodes]
  );

  return (
    <GlassCard className="p-4 h-full" onClick={onTap} overclocked={overclocked}>
      <div className="flex items-center gap-2 mb-3">
        <GitBranch size={14} className="text-[#E6F24A]" />
        <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-mono">
          Circuit Sync — Network Map
        </span>
      </div>
      <div className="relative h-48" style={{ background: 'rgba(0,0,0,0.2)' }}>
        {/* SVG connections */}
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <linearGradient id="lineGradYellow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E6F24A" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#E6F24A" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#E6F24A" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="lineGradCyan" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#43E8FF" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#43E8FF" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#43E8FF" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          {connections.map(([fromId, toId], i) => {
            const from = getNode(fromId);
            const to = getNode(toId);
            return (
              <g key={i}>
                {/* Base line */}
                <line
                  x1={`${from.x}%`}
                  y1={`${from.y}%`}
                  x2={`${to.x}%`}
                  y2={`${to.y}%`}
                  stroke="rgba(255,255,255,0.04)"
                  strokeWidth="1"
                />
                {/* Animated glow line */}
                <motion.line
                  x1={`${from.x}%`}
                  y1={`${from.y}%`}
                  x2={`${to.x}%`}
                  y2={`${to.y}%`}
                  stroke={i % 2 === 0 ? '#E6F24A' : '#43E8FF'}
                  strokeWidth="1"
                  initial={{ pathLength: 0, opacity: 0.2 }}
                  animate={{
                    pathLength: [0, 1, 0],
                    opacity: [0.1, 0.6, 0.1],
                  }}
                  transition={{
                    duration: overclocked ? 1 + i * 0.2 : 2 + i * 0.3,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                  style={{
                    filter: `drop-shadow(0 0 3px ${i % 2 === 0 ? '#E6F24A' : '#43E8FF'})`,
                  }}
                />
              </g>
            );
          })}
        </svg>
        {/* Nodes */}
        {nodes.map((node) => (
          <motion.div
            key={node.id}
            className="absolute flex flex-col items-center"
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            animate={
              node.id === 'core'
                ? {
                    scale: [1, 1.05, 1],
                  }
                : {}
            }
            transition={{
              duration: overclocked ? 0.8 : 2,
              repeat: Infinity,
            }}
          >
            <motion.div
              className="relative flex items-center justify-center w-8 h-8 rounded-full"
              style={{
                background:
                  node.id === 'core'
                    ? 'rgba(230,242,74,0.15)'
                    : 'rgba(67,232,255,0.08)',
                border: `1px solid ${
                  node.id === 'core'
                    ? 'rgba(230,242,74,0.4)'
                    : 'rgba(67,232,255,0.2)'
                }`,
              }}
              animate={{
                boxShadow:
                  node.id === 'core'
                    ? [
                        '0 0 8px rgba(230,242,74,0.3)',
                        '0 0 20px rgba(230,242,74,0.5)',
                        '0 0 8px rgba(230,242,74,0.3)',
                      ]
                    : [
                        '0 0 4px rgba(67,232,255,0.1)',
                        '0 0 10px rgba(67,232,255,0.3)',
                        '0 0 4px rgba(67,232,255,0.1)',
                      ],
              }}
              transition={{
                duration: overclocked ? 0.6 : 1.5,
                repeat: Infinity,
              }}
            >
              <div
                style={{
                  color: node.id === 'core' ? '#E6F24A' : '#43E8FF',
                }}
              >
                {node.icon}
              </div>
            </motion.div>
            <span className="text-[7px] font-mono text-gray-500 mt-1 tracking-wider">
              {node.label}
            </span>
            <span
              className="text-[8px] font-mono font-bold"
              style={{
                color: node.id === 'core' ? '#E6F24A' : '#43E8FF',
              }}
            >
              {node.value}%
            </span>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
};

// ─── Sub-component: Potassium Overclock Toggle ───────────────────────
const OverclockToggle: React.FC<{
  active: boolean;
  onToggle: () => void;
}> = ({ active, onToggle }) => {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onToggle}
        className="relative flex items-center cursor-pointer"
        style={{ width: 52, height: 28 }}
        aria-label="Toggle Potassium Overclock"
      >
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            backgroundColor: active
              ? 'rgba(230,242,74,0.2)'
              : 'rgba(255,255,255,0.05)',
            borderColor: active
              ? 'rgba(230,242,74,0.5)'
              : 'rgba(255,255,255,0.1)',
            boxShadow: active
              ? '0 0 20px rgba(230,242,74,0.3), inset 0 0 10px rgba(230,242,74,0.1)'
              : 'none',
          }}
          style={{
            border: '1px solid',
          }}
        />
        <motion.div
          className="absolute rounded-full"
          animate={{
            x: active ? 26 : 4,
            backgroundColor: active ? '#E6F24A' : '#555',
            boxShadow: active
              ? '0 0 12px #E6F24A, 0 0 24px rgba(230,242,74,0.5)'
              : 'none',
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          style={{
            width: 20,
            height: 20,
            top: 4,
          }}
        />
      </button>
      <div>
        <p
          className="text-[10px] font-mono uppercase tracking-[0.15em] font-bold"
          style={{ color: active ? '#E6F24A' : '#666' }}
        >
          K⁺ Overclock
        </p>
        <p className="text-[8px] font-mono text-gray-600">
          {active ? 'ACTIVE — ALL SYSTEMS BOOSTED' : 'STANDBY'}
        </p>
      </div>
    </div>
  );
};

// ─── Sub-component: Divine System HUD (Center) ───────────────────────
const DivineSystemHUD: React.FC<{
  overclocked: boolean;
  onTap: (e: React.MouseEvent) => void;
}> = ({ overclocked, onTap }) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => {
        setRotation((r) => r + 0.5);
      },
      overclocked ? 16 : 50
    );
    return () => clearInterval(interval);
  }, [overclocked]);

  return (
    <GlassCard className="p-6 flex flex-col items-center justify-center" onClick={onTap} overclocked={overclocked}>
      {/* HUD Title */}
      <div className="flex items-center gap-2 mb-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: overclocked ? 2 : 6, repeat: Infinity, ease: 'linear' }}
        >
          <Hexagon size={14} className="text-[#E6F24A]" />
        </motion.div>
        <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-mono">
          Divine System Interface
        </span>
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: overclocked ? 2 : 6, repeat: Infinity, ease: 'linear' }}
        >
          <Hexagon size={14} className="text-[#43E8FF]" />
        </motion.div>
      </div>

      {/* Rotating HUD rings */}
      <div className="relative w-56 h-56 flex items-center justify-center">
        {/* Outer ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            border: '1px solid rgba(230,242,74,0.15)',
            transform: `rotate(${rotation}deg)`,
          }}
        >
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <div
              key={deg}
              className="absolute w-2 h-2"
              style={{
                top: '50%',
                left: '50%',
                transform: `rotate(${deg}deg) translateY(-112px) translate(-50%, -50%)`,
              }}
            >
              <motion.div
                className="w-full h-full"
                animate={{
                  backgroundColor: ['#E6F24A', '#43E8FF', '#E6F24A'],
                  boxShadow: [
                    '0 0 4px #E6F24A',
                    '0 0 8px #43E8FF',
                    '0 0 4px #E6F24A',
                  ],
                }}
                transition={{
                  duration: overclocked ? 1 : 3,
                  repeat: Infinity,
                  delay: deg / 360,
                }}
                style={{
                  clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
                }}
              />
            </div>
          ))}
        </motion.div>

        {/* Middle ring */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '75%',
            height: '75%',
            border: '1px dashed rgba(67,232,255,0.15)',
            transform: `rotate(${-rotation * 0.7}deg)`,
          }}
        />

        {/* Inner ring */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '55%',
            height: '55%',
            border: '1px solid rgba(230,242,74,0.1)',
            transform: `rotate(${rotation * 1.2}deg)`,
          }}
          animate={{
            boxShadow: overclocked
              ? [
                  '0 0 15px rgba(230,242,74,0.1), inset 0 0 15px rgba(230,242,74,0.05)',
                  '0 0 30px rgba(230,242,74,0.2), inset 0 0 30px rgba(230,242,74,0.1)',
                  '0 0 15px rgba(230,242,74,0.1), inset 0 0 15px rgba(230,242,74,0.05)',
                ]
              : 'none',
          }}
          transition={{ duration: 1, repeat: Infinity }}
        />

        {/* Center artifact placeholder */}
        <motion.div
          className="relative w-24 h-24 rounded-lg flex items-center justify-center z-10"
          style={{
            background:
              'linear-gradient(135deg, rgba(230,242,74,0.1) 0%, rgba(67,232,255,0.05) 100%)',
            border: '2px solid rgba(230,242,74,0.3)',
            clipPath:
              'polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)',
          }}
          animate={{
            boxShadow: [
              '0 0 20px rgba(230,242,74,0.2), inset 0 0 20px rgba(230,242,74,0.05)',
              '0 0 40px rgba(230,242,74,0.4), inset 0 0 40px rgba(230,242,74,0.1)',
              '0 0 20px rgba(230,242,74,0.2), inset 0 0 20px rgba(230,242,74,0.05)',
            ],
          }}
          transition={{
            duration: overclocked ? 0.8 : 2,
            repeat: Infinity,
          }}
        >
          {/* Replace with your Nano Banana 2 image */}
          {/* <img src="/nano-banana-2.png" alt="Nano Banana 2" className="w-20 h-20 object-contain" /> */}
          <div className="flex flex-col items-center">
            <motion.div
              animate={{ rotateY: [0, 360] }}
              transition={{
                duration: overclocked ? 2 : 5,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <Triangle
                size={32}
                className="text-[#E6F24A]"
                style={{
                  filter: 'drop-shadow(0 0 8px #E6F24A)',
                }}
              />
            </motion.div>
            <span className="text-[6px] font-mono text-[#E6F24A] mt-1 tracking-widest">
              NB-2
            </span>
          </div>
        </motion.div>

        {/* Floating data points */}
        {[
          { angle: -30, label: 'PWR', val: '9.81K' },
          { angle: 30, label: 'FRQ', val: '432Hz' },
          { angle: 150, label: 'ENT', val: '0.001' },
          { angle: 210, label: 'SYN', val: '99.9%' },
        ].map((point, i) => {
          const rad = (point.angle * Math.PI) / 180;
          const radius = 42;
          const x = 50 + radius * Math.cos(rad);
          const y = 50 + radius * Math.sin(rad);
          return (
            <div
              key={i}
              className="absolute text-center"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <p className="text-[7px] font-mono text-gray-600">{point.label}</p>
              <p className="text-[9px] font-mono font-bold text-[#43E8FF]">
                {point.val}
              </p>
            </div>
          );
        })}
      </div>

      {/* System status */}
      <div className="mt-4 flex items-center gap-4">
        <div className="flex items-center gap-1">
          <motion.div
            className="w-1.5 h-1.5 rounded-full"
            animate={{
              backgroundColor: ['#E6F24A', '#43E8FF', '#E6F24A'],
              boxShadow: [
                '0 0 4px #E6F24A',
                '0 0 4px #43E8FF',
                '0 0 4px #E6F24A',
              ],
            }}
            transition={{
              duration: overclocked ? 0.5 : 1.5,
              repeat: Infinity,
            }}
          />
          <span className="text-[8px] font-mono text-gray-500">QUANTUM LOCK: STABLE</span>
        </div>
        <div className="flex items-center gap-1">
          <Lock size={8} className="text-[#E6F24A]" />
          <span className="text-[8px] font-mono text-gray-500">DIVINE SEAL: INTACT</span>
        </div>
      </div>
    </GlassCard>
  );
};

// ─── Main Component: The Banana Protocol Dashboard ───────────────────
const BananaProtocol: React.FC = () => {
  const [overclocked, setOverclocked] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [pulseWaves, setPulseWaves] = useState<PulseWave[]>([]);
  const [systemTime, setSystemTime] = useState('');
  const [stats, setStats] = useState({
    potassium: 87.3,
    bandwidth: 94.1,
    entropy: 12.7,
    resonance: 96.5,
    coreTemp: 42.7,
    quantumCoherence: 99.1,
  });
  const rippleIdRef = useRef(0);
  const pulseIdRef = useRef(0);

  // System clock
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setSystemTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + `.${String(now.getMilliseconds()).padStart(3, '0')}`
      );
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Simulate live stats
  useEffect(() => {
    const interval = setInterval(
      () => {
        setStats((prev) => ({
          potassium: Math.min(100, Math.max(70, prev.potassium + (Math.random() - 0.48) * 2)),
          bandwidth: Math.min(100, Math.max(80, prev.bandwidth + (Math.random() - 0.5) * 1.5)),
          entropy: Math.min(30, Math.max(5, prev.entropy + (Math.random() - 0.5) * 3)),
          resonance: Math.min(100, Math.max(85, prev.resonance + (Math.random() - 0.48) * 1)),
          coreTemp: Math.min(60, Math.max(35, prev.coreTemp + (Math.random() - 0.5) * 2)),
          quantumCoherence: Math.min(
            100,
            Math.max(90, prev.quantumCoherence + (Math.random() - 0.5) * 0.5)
          ),
        }));
      },
      overclocked ? 300 : 1000
    );
    return () => clearInterval(interval);
  }, [overclocked]);

  // Handle tap ripple + branching pulse
  const handleTap = useCallback((e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).closest('.dashboard-root')?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple: Ripple = {
      id: rippleIdRef.current++,
      x,
      y,
      timestamp: Date.now(),
    };

    setRipples((prev) => [...prev.slice(-5), newRipple]);

    // Branching pulse
    const newPulse: PulseWave = {
      id: pulseIdRef.current++,
      originX: (x / rect.width) * 100,
      originY: (y / rect.height) * 100,
    };
    setPulseWaves((prev) => [...prev.slice(-3), newPulse]);

    // Cleanup old ripples
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 1500);
    setTimeout(() => {
      setPulseWaves((prev) => prev.filter((p) => p.id !== newPulse.id));
    }, 2000);
  }, []);

  return (
    <div
      className="dashboard-root relative min-h-screen w-full overflow-hidden font-mono"
      style={{ background: '#12161D' }}
    >
      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(230,242,74,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(230,242,74,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Global pulse overlay */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-0"
        animate={{
          background: overclocked
            ? [
                'radial-gradient(ellipse at 50% 50%, rgba(230,242,74,0.03) 0%, transparent 70%)',
                'radial-gradient(ellipse at 50% 50%, rgba(230,242,74,0.08) 0%, transparent 70%)',
                'radial-gradient(ellipse at 50% 50%, rgba(230,242,74,0.03) 0%, transparent 70%)',
              ]
            : 'radial-gradient(ellipse at 50% 50%, rgba(230,242,74,0.02) 0%, transparent 70%)',
        }}
        transition={{
          duration: overclocked ? 0.8 : 3,
          repeat: Infinity,
        }}
      />

      {/* Tap ripples */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="fixed pointer-events-none z-50"
            style={{
              left: ripple.x,
              top: ripple.y,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ width: 0, height: 0, opacity: 0.8 }}
            animate={{ width: 300, height: 300, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          >
            <div
              className="w-full h-full rounded-full"
              style={{
                border: '2px solid #E6F24A',
                boxShadow: '0 0 20px rgba(230,242,74,0.3)',
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Branching pulse waves */}
      <AnimatePresence>
        {pulseWaves.map((pulse) => (
          <React.Fragment key={pulse.id}>
            {/* Horizontal line */}
            <motion.div
              className="fixed pointer-events-none z-40"
              style={{
                top: `${pulse.originY}%`,
                left: `${pulse.originX}%`,
                height: 1,
                transformOrigin: 'left center',
              }}
              initial={{ width: 0, opacity: 0.8 }}
              animate={{ width: '100vw', opacity: 0 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            >
              <div
                className="h-full w-full"
                style={{
                  background: `linear-gradient(90deg, #E6F24A, transparent)`,
                  boxShadow: '0 0 8px #E6F24A',
                }}
              />
            </motion.div>
            {/* Vertical line */}
            <motion.div
              className="fixed pointer-events-none z-40"
              style={{
                top: `${pulse.originY}%`,
                left: `${pulse.originX}%`,
                width: 1,
                transformOrigin: 'center top',
              }}
              initial={{ height: 0, opacity: 0.6 }}
              animate={{ height: '100vh', opacity: 0 }}
              transition={{ duration: 1.5, ease: 'easeOut', delay: 0.1 }}
            >
              <div
                className="h-full w-full"
                style={{
                  background: `linear-gradient(180deg, #E6F24A, transparent)`,
                  boxShadow: '0 0 8px #E6F24A',
                }}
              />
            </motion.div>
          </React.Fragment>
        ))}
      </AnimatePresence>

      {/* ─── Header ─────────────────────────────────────────────── */}
      <header className="relative z-10 px-6 py-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{
              rotate: [0, 360],
              filter: overclocked
                ? [
                    'drop-shadow(0 0 4px #E6F24A)',
                    'drop-shadow(0 0 12px #E6F24A)',
                    'drop-shadow(0 0 4px #E6F24A)',
                  ]
                : 'drop-shadow(0 0 4px #E6F24A)',
            }}
            transition={{
              rotate: { duration: overclocked ? 3 : 10, repeat: Infinity, ease: 'linear' },
              filter: { duration: 1, repeat: Infinity },
            }}
          >
            <Hexagon size={24} className="text-[#E6F24A]" />
          </motion.div>
          <div>
            <h1
              className="text-sm font-bold tracking-[0.3em] uppercase"
              style={{ color: '#E6F24A' }}
            >
              The Banana Protocol
            </h1>
            <p className="text-[8px] text-gray-600 tracking-[0.2em] uppercase">
              Divine System Dashboard v2.0.0 — God Rank
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <OverclockToggle
            active={overclocked}
            onToggle={() => setOverclocked(!overclocked)}
          />
          <div className="text-right">
            <p className="text-[9px] text-gray-600 font-mono">SYS_TIME</p>
            <motion.p
              className="text-xs font-mono font-bold"
              style={{ color: '#43E8FF' }}
              animate={
                overclocked
                  ? {
                      textShadow: [
                        '0 0 4px #43E8FF',
                        '0 0 12px #43E8FF',
                        '0 0 4px #43E8FF',
                      ],
                    }
                  : {}
              }
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              {systemTime}
            </motion.p>
          </div>
        </div>
      </header>

      {/* ─── Warning Banner (Overclock) ───────────────────────── */}
      <AnimatePresence>
        {overclocked && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="relative z-10 overflow-hidden"
          >
            <motion.div
              className="px-6 py-2 flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(90deg, rgba(230,242,74,0.05), rgba(230,242,74,0.1), rgba(230,242,74,0.05))',
                borderBottom: '1px solid rgba(230,242,74,0.2)',
              }}
              animate={{
                backgroundPosition: ['0% 0%', '200% 0%'],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <AlertTriangle size={12} className="text-[#E6F24A]" />
              </motion.div>
              <span className="text-[9px] font-mono text-[#E6F24A] tracking-[0.2em] uppercase">
                ⚡ Potassium Overclock Active — All Systems Operating at Peak Capacity ⚡
              </span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <AlertTriangle size={12} className="text-[#E6F24A]" />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Main Dashboard Grid ──────────────────────────────── */}
      <main className="relative z-10 p-6 grid grid-cols-12 gap-4 max-w-[1600px] mx-auto">
        {/* Left Column - Stats */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
          {/* Stat Cards */}
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              icon={<Zap size={16} />}
              label="Potassium"
              value={`${stats.potassium.toFixed(1)}%`}
              subValue="K⁺ SATURATION"
              color="yellow"
              overclocked={overclocked}
              onTap={handleTap}
            />
            <StatCard
              icon={<Wifi size={16} />}
              label="Bandwidth"
              value={`${stats.bandwidth.toFixed(1)}%`}
              subValue="NEURAL LINK"
              color="cyan"
              overclocked={overclocked}
              onTap={handleTap}
            />
            <StatCard
              icon={<Activity size={16} />}
              label="Entropy"
              value={`${stats.entropy.toFixed(1)}%`}
              subValue="SYSTEM NOISE"
              color="cyan"
              overclocked={overclocked}
              onTap={handleTap}
            />
            <StatCard
              icon={<Cpu size={16} />}
              label="Core Temp"
              value={`${stats.coreTemp.toFixed(1)}°C`}
              subValue="THERMAL STATUS"
              color="yellow"
              overclocked={overclocked}
              onTap={handleTap}
            />
          </div>

          {/* Progress Bars */}
          <GlassCard className="p-4" onClick={handleTap} overclocked={overclocked}>
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 size={14} className="text-[#E6F24A]" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-mono">
                System Channels
              </span>
            </div>
            <LiquidLightBar
              value={stats.potassium}
              label="Potassium Flow"
              color="yellow"
              overclocked={overclocked}
            />
            <LiquidLightBar
              value={stats.bandwidth}
              label="Neural Bandwidth"
              color="cyan"
              overclocked={overclocked}
            />
            <LiquidLightBar
              value={stats.resonance}
              label="Resonance Field"
              color="yellow"
              overclocked={overclocked}
            />
            <LiquidLightBar
              value={stats.quantumCoherence}
              label="Quantum Coherence"
              color="cyan"
              overclocked={overclocked}
            />
            <LiquidLightBar
              value={100 - stats.entropy}
              label="Signal Purity"
              color="yellow"
              overclocked={overclocked}
            />
          </GlassCard>

          {/* System Log */}
          <GlassCard className="p-4" onClick={handleTap} overclocked={overclocked}>
            <div className="flex items-center gap-2 mb-2">
              <Terminal size={14} className="text-[#43E8FF]" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-mono">
                System Log
              </span>
            </div>
            <div className="space-y-1">
              {[
                { msg: 'Divine seal integrity verified', t: '00:01' },
                { msg: 'Potassium channels calibrated', t: '00:03' },
                { msg: 'Nano Banana 2 artifact synchronized', t: '00:05' },
                { msg: 'Quantum entanglement established', t: '00:07' },
                { msg: 'System operating at GOD RANK', t: '00:09' },
              ].map((log, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-2 text-[8px] font-mono"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15 }}
                >
                  <span className="text-gray-700 flex-shrink-0">[{log.t}]</span>
                  <span className="text-gray-500">{log.msg}</span>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Center Column - Divine System HUD */}
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-4">
          <DivineSystemHUD overclocked={overclocked} onTap={handleTap} />

          {/* Circuit Sync */}
          <CircuitSync overclocked={overclocked} onTap={handleTap} />
        </div>

        {/* Right Column - Data Harvest + Extra */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
          {/* Data Harvest */}
          <DataHarvestMonitor overclocked={overclocked} onTap={handleTap} />

          {/* Power Matrix */}
          <GlassCard className="p-4" onClick={handleTap} overclocked={overclocked}>
            <div className="flex items-center gap-2 mb-3">
              <Power size={14} className="text-[#E6F24A]" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-mono">
                Power Matrix
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'ALPHA', val: 98 },
                { label: 'BETA', val: 87 },
                { label: 'GAMMA', val: 95 },
                { label: 'DELTA', val: 91 },
                { label: 'OMEGA', val: 100 },
                { label: 'SIGMA', val: 83 },
              ].map((cell, i) => (
                <motion.div
                  key={i}
                  className="flex flex-col items-center p-2 rounded-sm"
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.04)',
                  }}
                  animate={
                    cell.val === 100
                      ? {
                          borderColor: [
                            'rgba(230,242,74,0.2)',
                            'rgba(230,242,74,0.5)',
                            'rgba(230,242,74,0.2)',
                          ],
                        }
                      : {}
                  }
                  transition={{
                    duration: overclocked ? 0.6 : 1.5,
                    repeat: Infinity,
                  }}
                >
                  <span className="text-[7px] text-gray-600 font-mono">{cell.label}</span>
                  <motion.span
                    className="text-[11px] font-bold font-mono"
                    style={{
                      color: cell.val >= 95 ? '#E6F24A' : '#43E8FF',
                    }}
                    animate={
                      cell.val === 100
                        ? {
                            textShadow: [
                              '0 0 4px #E6F24A',
                              '0 0 10px #E6F24A',
                              '0 0 4px #E6F24A',
                            ],
                          }
                        : {}
                    }
                    transition={{
                      duration: overclocked ? 0.5 : 1.2,
                      repeat: Infinity,
                    }}
                  >
                    {cell.val}
                  </motion.span>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          {/* Security Status */}
          <GlassCard className="p-4" onClick={handleTap} overclocked={overclocked}>
            <div className="flex items-center gap-2 mb-3">
              <Eye size={14} className="text-[#43E8FF]" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-mono">
                Security Protocols
              </span>
            </div>
            <div className="space-y-2">
              {[
                { name: 'Firewall Genesis', status: 'ACTIVE', ok: true },
                { name: 'Encryption Layer 7', status: 'SEALED', ok: true },
                { name: 'Intrusion Detection', status: 'ARMED', ok: true },
                { name: 'Quantum Vault', status: 'LOCKED', ok: true },
                { name: 'Neural Firewall', status: overclocked ? 'BOOSTED' : 'STANDBY', ok: overclocked },
              ].map((proto, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-[9px] text-gray-500 font-mono">{proto.name}</span>
                  <div className="flex items-center gap-1.5">
                    <motion.div
                      className="w-1 h-1 rounded-full"
                      style={{
                        backgroundColor: proto.ok ? '#E6F24A' : '#43E8FF',
                      }}
                      animate={{
                        boxShadow: [
                          `0 0 2px ${proto.ok ? '#E6F24A' : '#43E8FF'}`,
                          `0 0 6px ${proto.ok ? '#E6F24A' : '#43E8FF'}`,
                          `0 0 2px ${proto.ok ? '#E6F24A' : '#43E8FF'}`,
                        ],
                      }}
                      transition={{
                        duration: overclocked ? 0.5 : 1.2,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                    <span
                      className="text-[8px] font-mono font-bold"
                      style={{ color: proto.ok ? '#E6F24A' : '#43E8FF' }}
                    >
                      {proto.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </main>

      {/* ─── Footer ───────────────────────────────────────────── */}
      <footer className="relative z-10 px-6 py-3 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-[#E6F24A]"
              animate={{
                boxShadow: [
                  '0 0 4px #E6F24A',
                  '0 0 10px #E6F24A',
                  '0 0 4px #E6F24A',
                ],
              }}
              transition={{
                duration: overclocked ? 0.4 : 1,
                repeat: Infinity,
              }}
            />
            <span className="text-[8px] font-mono text-gray-600">
              SYSTEM STATUS: {overclocked ? 'OVERCLOCKED' : 'NOMINAL'}
            </span>
          </div>
          <span className="text-[8px] font-mono text-gray-700">│</span>
          <span className="text-[8px] font-mono text-gray-600">
            NODE: BANANA-PRIME-001
          </span>
          <span className="text-[8px] font-mono text-gray-700">│</span>
          <span className="text-[8px] font-mono text-gray-600">
            RANK: <span className="text-[#E6F24A] font-bold">GOD</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[8px] font-mono text-gray-700">
            © 2025 THE BANANA PROTOCOL
          </span>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: overclocked ? 2 : 8, repeat: Infinity, ease: 'linear' }}
          >
            <Hexagon size={10} className="text-[#E6F24A]" />
          </motion.div>
        </div>
      </footer>

      {/* ─── Vignette overlay ─────────────────────────────────── */}
      <div
        className="fixed inset-0 pointer-events-none z-20"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)',
        }}
      />

      {/* ─── Corner decorations ───────────────────────────────── */}
      {/* Top-left */}
      <div className="fixed top-0 left-0 w-24 h-24 pointer-events-none z-10">
        <div
          className="absolute top-0 left-0 w-full h-px"
          style={{ background: 'linear-gradient(90deg, rgba(230,242,74,0.3), transparent)' }}
        />
        <div
          className="absolute top-0 left-0 h-full w-px"
          style={{ background: 'linear-gradient(180deg, rgba(230,242,74,0.3), transparent)' }}
        />
      </div>
      {/* Top-right */}
      <div className="fixed top-0 right-0 w-24 h-24 pointer-events-none z-10">
        <div
          className="absolute top-0 right-0 w-full h-px"
          style={{ background: 'linear-gradient(270deg, rgba(67,232,255,0.3), transparent)' }}
        />
        <div
          className="absolute top-0 right-0 h-full w-px"
          style={{ background: 'linear-gradient(180deg, rgba(67,232,255,0.3), transparent)' }}
        />
      </div>
      {/* Bottom-left */}
      <div className="fixed bottom-0 left-0 w-24 h-24 pointer-events-none z-10">
        <div
          className="absolute bottom-0 left-0 w-full h-px"
          style={{ background: 'linear-gradient(90deg, rgba(67,232,255,0.3), transparent)' }}
        />
        <div
          className="absolute bottom-0 left-0 h-full w-px"
          style={{ background: 'linear-gradient(0deg, rgba(67,232,255,0.3), transparent)' }}
        />
      </div>
      {/* Bottom-right */}
      <div className="fixed bottom-0 right-0 w-24 h-24 pointer-events-none z-10">
        <div
          className="absolute bottom-0 right-0 w-full h-px"
          style={{ background: 'linear-gradient(270deg, rgba(230,242,74,0.3), transparent)' }}
        />
        <div
          className="absolute bottom-0 right-0 h-full w-px"
          style={{ background: 'linear-gradient(0deg, rgba(230,242,74,0.3), transparent)' }}
        />
      </div>
    </div>
  );
};

export default BananaProtocol;
