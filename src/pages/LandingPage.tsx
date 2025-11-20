"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Terminal, ShieldCheck, Zap, Database, Lock, Activity } from "lucide-react";

/**
 * LandingPage.tsx
 * Modern cybersecurity landing page — interactive & accessible
 *
 * Requires: framer-motion, lucide-react (icons)
 * Tailwind-friendly classes are used; fallback CSS provided below for colors.
 */

/* -------------------------
   Inline fallback styles
   ------------------------- */
const rootStyles = `
:root{
  --primary-dark: #0a192f;
  --primary-light: #172a45;
  --accent-blue: #3b82f6;
  --accent-gold: #ffb700;
  --text-silver: #c4c8d4;
  --text-light: #ffffff;
  --border-grey: #2d3e5a;
}

/* optional helpers when Tailwind isn't present */
body { background: var(--primary-dark); color: var(--text-light); font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; }

.container { max-width: 1200px; margin: 0 auto; padding: 2rem; }

/* subtle glass */
.glass {
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
  border: 1px solid rgba(255,255,255,0.03);
  backdrop-filter: blur(6px);
}

/* animated glowing border button */
.glow-btn {
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  padding: 0.8rem 1.25rem;
  border: 1px solid var(--border-grey);
  background: linear-gradient(180deg, var(--primary-light), var(--primary-dark));
  color: var(--text-light);
  cursor: pointer;
}
.glow-btn::before {
  content: "";
  position: absolute;
  inset: -2px;
  background: linear-gradient(90deg, rgba(59,130,246,0.35), rgba(255,183,0,0.25), rgba(59,130,246,0.35));
  filter: blur(12px);
  opacity: 0.9;
  transform: translateX(-100%);
  transition: transform 0.9s cubic-bezier(.22,.9,.3,1);
  z-index: 0;
}
.glow-btn:hover::before, .glow-btn:focus::before { transform: translateX(0%); }
.glow-btn > * { position: relative; z-index: 2; }

/* spotlight layer */
.spotlight {
  position: fixed;
  pointer-events: none;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  mix-blend-mode: screen;
  z-index: 5;
}

/* feature card tilt transform origin */
.feature-card { transform-style: preserve-3d; will-change: transform; }
`;

/* -------------------------
   Small helper components
   ------------------------- */

const Badge: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium" style={{ background: "rgba(59,130,246,0.08)", color: "var(--accent-blue)" }}>
    {children}
  </div>
);

const FeatureCard: React.FC<{ title: string; desc: string; Icon: React.ComponentType<any> }> = ({ title, desc, Icon }) => {
  // tilt on mouse move
  const ref = useRef<HTMLDivElement | null>(null);
  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rotY = (px - 0.5) * 10;
    const rotX = (py - 0.5) * -8;
    el.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(6px)`;
  }
  function onLeave() {
    const el = ref.current;
    if (el) el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)";
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="feature-card glass p-6 rounded-xl border shadow-sm transition-transform duration-300"
      style={{ borderColor: "var(--border-grey)" }}
      role="article"
      tabIndex={0}
      aria-label={title}
    >
      <div className="flex items-center gap-4 mb-3">
        <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(180deg, rgba(59,130,246,0.12), rgba(255,183,0,0.06))" }}>
          <Icon size={20} color="currentColor" />
        </div>
        <h4 className="text-lg font-semibold">{title}</h4>
      </div>
      <p className="text-sm" style={{ color: "var(--text-silver)" }}>{desc}</p>
    </div>
  );
};

/* -------------------------
   Main Landing Page
   ------------------------- */

export default function LandingPage() {
  // mouse spotlight position
  const mouseX = useMotionValue(-9999);
  const mouseY = useMotionValue(-9999);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    const leave = () => {
      mouseX.set(-9999);
      mouseY.set(-9999);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseleave", leave);
    };
  }, [mouseX, mouseY]);

  // spotlight gradient position transforms
  const spotlightX = useTransform(mouseX, (v) => `${v}px`);
  const spotlightY = useTransform(mouseY, (v) => `${v}px`);

  // scan demo state
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    let timer: number | undefined;
    if (scanning) {
      setProgress(0);
      setLogs([]);
      timer = window.setInterval(() => {
        setProgress((p) => {
          const next = Math.min(100, p + Math.random() * 8 + 3);
          if (next > p) {
            setLogs((old) => {
              const t = new Date().toLocaleTimeString();
              return [ `${t}  • scanned module ${Math.ceil(next/7)} — status OK`, ...old ].slice(0, 30);
            });
          }
          if (next >= 100) {
            if (timer !== undefined) {
              window.clearInterval(timer);
              timer = undefined;
            }
            setTimeout(() => setScanning(false), 600);
          }
          return next;
        });
      }, 600);
    }
    return () => {
      if (timer !== undefined) window.clearInterval(timer);
    };
  }, [scanning]);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,var(--primary-dark), rgba(10,25,47,0.9))", color: "var(--text-light)" }}>
      {/* inline root styles */}
      <style>{rootStyles}</style>

      {/* mouse spotlight layer */}
      <div className="spotlight" aria-hidden>
        <motion.div
          style={
            {
              position: "absolute",
              left: spotlightX as any,
              top: spotlightY as any,
              translateX: "-50%",
              translateY: "-50%",
              width: 520,
              height: 520,
              borderRadius: "50%",
              pointerEvents: "none",
              background: `radial-gradient(circle at center, rgba(59,130,246,0.22) 0%, rgba(59,130,246,0.14) 12%, rgba(0,0,0,0.0) 40%)`,
              filter: "blur(28px)",
              mixBlendMode: "screen",
              zIndex: 50
            } as React.CSSProperties
          }
        />
      </div>

      <header style={{ padding: "1.5rem 2rem" }}>
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div style={{ width: 46, height: 46, borderRadius: 10, background: "linear-gradient(90deg,var(--accent-blue),var(--accent-gold))", display: "grid", placeItems: "center" }}>
              <ShieldCheck color="#000" />
            </div>
            <div>
              <div style={{ fontWeight: 700, letterSpacing: -0.6 }}>Sentinel</div>
              <div style={{ fontSize: 12, color: "var(--text-silver)" }}>DevSecOps Platform</div>
            </div>
          </div>

          <nav style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button className="glow-btn" onClick={() => alert("Goto docs (stub)")}>Docs</button>
            <button
              className="glow-btn"
              onClick={() => { setScanning(true); }}
              aria-pressed={scanning ? "true" : "false"}
            >
              {scanning ? "Scanning…" : "Start Demo Scan"}
            </button>
          </nav>
        </div>
      </header>

      <main className="container" style={{ paddingTop: 24 }}>
        <section style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 28, alignItems: "start" }}>
          {/* Left: Hero */}
          <div>
            <Badge>v1.0 — enterprise</Badge>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{
                marginTop: 18,
                fontSize: "clamp(2rem, 4.2vw, 3.8rem)",
                lineHeight: 1.02,
                fontWeight: 800,
                background: "linear-gradient(180deg, var(--text-light), var(--text-silver))",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                marginBottom: 12
              }}
            >
              Cybersecurity orchestration <br /> <span style={{ color: "var(--accent-gold)" }}>built for engineering teams</span>
            </motion.h1>

            <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.2}} style={{color:"var(--text-silver)", maxWidth: 680, marginBottom: 18}}>
              Unified SAST, DAST, SCA & IaC pipelines. Config-as-code scan flows, intelligent findings clustering, and safe report export for auditing and compliance.
            </motion.p>

            <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
              <button className="glow-btn" onClick={() => setScanning(true)} aria-label="Start a demo scan">Try Demo</button>
              <button className="glow-btn" onClick={() => alert("Contact sales (stub)")}>Contact Sales</button>
            </div>

            {/* small metrics */}
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              <div style={{ padding: 12, borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.03)" }}>
                <div style={{ fontSize: 20, fontWeight: 700 }}>99.99%</div>
                <div style={{ fontSize: 12, color: "var(--text-silver)" }}>Uptime SLA</div>
              </div>
              <div style={{ padding: 12, borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.03)" }}>
                <div style={{ fontSize: 20, fontWeight: 700 }}>8s</div>
                <div style={{ fontSize: 12, color: "var(--text-silver)" }}>Avg scan time (demo)</div>
              </div>
              <div style={{ padding: 12, borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.03)" }}>
                <div style={{ fontSize: 20, fontWeight: 700 }}>Semgrep, Trivy</div>
                <div style={{ fontSize: 12, color: "var(--text-silver)" }}>Integrated tools</div>
              </div>
            </div>
          </div>

          {/* Right: Live demo / scan console */}
          <aside>
            <div className="glass p-4 rounded-xl" style={{ minWidth: 360 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ fontWeight: 700 }}>Live Scan Demo</div>
                <div style={{ fontSize: 12, color: "var(--text-silver)" }}>{scanning ? "Scanning…" : "Idle"}</div>
              </div>

              {/* progress bar */}
              <div style={{ height: 12, background: "rgba(255,255,255,0.04)", borderRadius: 8, overflow: "hidden", border: "1px solid rgba(255,255,255,0.02)" }}>
                <motion.div
                  initial={false}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut", duration: 0.5 }}
                  style={{
                    height: "100%",
                    background: "linear-gradient(90deg,var(--accent-blue), var(--accent-gold))"
                  }}
                />
              </div>

              <div style={{ marginTop: 10, fontSize: 13, color: "var(--text-silver)", maxHeight: 220, overflow: "auto", paddingTop: 8 }}>
                {logs.length === 0 ? (
                  <div style={{ color: "var(--text-silver)" }}>No activity yet — run a demo scan.</div>
                ) : (
                  <ul style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {logs.map((l, idx) => (
                      <li key={idx} style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, monospace", fontSize: 12 }}>{l}</li>
                    ))}
                  </ul>
                )}
              </div>

              <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                <button className="glow-btn" onClick={() => setScanning((s) => !s)} aria-pressed={scanning ? "true" : "false"}>
                  {scanning ? "Stop" : "Run Scan"}
                </button>
                <button className="glow-btn" onClick={() => { setProgress(0); setLogs([]); setScanning(false); }}>
                  Reset
                </button>
              </div>
            </div>

            {/* mini feature list */}
            <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
              <FeatureCard Icon={Terminal} title="CLI & API" desc="Automate scan execution from pipelines." />
              <FeatureCard Icon={Activity} title="Realtime Metrics" desc="Live dashboards & alerting." />
            </div>
          </aside>
        </section>

        {/* Features grid */}
        <section style={{ marginTop: 36 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Enterprise Features</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
            <FeatureCard Icon={Lock} title="Secure-by-default" desc="Secrets safe, network hardened." />
            <FeatureCard Icon={Database} title="Audited Storage" desc="Immutable audit trails & exports." />
            <FeatureCard Icon={Zap} title="Dynamic Scanning" desc="Interactive web & API scanning." />
            <FeatureCard Icon={ShieldCheck} title="Policy Engine" desc="Custom rules & severity mapping." />
            <FeatureCard Icon={Terminal} title="Integrations" desc="CI/CD, Slack, PagerDuty, SIEM." />
            <FeatureCard Icon={Activity} title="SLA & Support" desc="Enterprise SLAs & dedicated onboarding." />
          </div>
        </section>

        {/* footer */}
        <footer style={{ marginTop: 48, padding: "28px 0", borderTop: "1px solid rgba(255,255,255,0.03)", color: "var(--text-silver)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>© {new Date().getFullYear()} Sentinel — Build secure, ship fast.</div>
            <div style={{ display: "flex", gap: 16 }}>
              <a href="#" style={{ color: "var(--text-silver)" }}>Privacy</a>
              <a href="#" style={{ color: "var(--text-silver)" }}>Docs</a>
              <a href="#" style={{ color: "var(--text-silver)" }}>GitHub</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
