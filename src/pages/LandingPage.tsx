"use client";

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom"; // 1. Import navigation hook
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Terminal, ShieldCheck, Zap, Database, Lock, Activity } from "lucide-react";
import logo from "../../public/sentinel_project_logo.svg";

/**
 * LandingPage.tsx
 * Modern cybersecurity landing page — interactive & accessible
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

body { background: var(--primary-dark); color: var(--text-light); font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; }

.container { max-width: 1200px; margin: 0 auto; padding: 2rem; }

.glass {
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
  border: 1px solid rgba(255,255,255,0.03);
  backdrop-filter: blur(6px);
}

.glow-btn {
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  padding: 0.8rem 1.25rem;
  border: 1px solid var(--border-grey);
  background: linear-gradient(180deg, var(--primary-light), var(--primary-dark));
  color: var(--text-light);
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
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
.glow-btn:active { transform: scale(0.98); }
.glow-btn > * { position: relative; z-index: 2; }

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

.feature-card { transform-style: preserve-3d; will-change: transform; }
`;

/* -------------------------
   Small helper components
   ------------------------- */

const Badge: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium" style={{ background: "rgba(59,130,246,0.08)", color: "var(--accent-blue)", border: "1px solid rgba(59,130,246,0.2)" }}>
    {children}
  </div>
);

const FeatureCard: React.FC<{ title: string; desc: string; Icon: React.ComponentType<any> }> = ({ title, desc, Icon }) => {
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
          <Icon size={20} color="var(--accent-blue)" />
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

// 2. Changed to named export 'LandingPage' to match App.tsx import
export const LandingPage = () => {
  const navigate = useNavigate(); // 3. Initialize navigation

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
              return [ `${t} • Scanning module ${Math.ceil(next/7)} — OK`, ...old ].slice(0, 30);
            });
          }
          if (next >= 100) {
            if (timer !== undefined) {
              window.clearInterval(timer);
              timer = undefined;
            }
            // Automatically stop scanning after a delay
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
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,var(--primary-dark), rgba(10,25,47,0.9))", color: "var(--text-light)", overflowX: "hidden" }}>
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
              background: "radial-gradient(circle at center, rgba(59,130,246,0.15) 0%, rgba(59,130,246,0.05) 20%, rgba(0,0,0,0.0) 60%)",
              filter: "blur(40px)",
              mixBlendMode: "screen",
              zIndex: 50
            } as React.CSSProperties
          }
        />
      </div>
      <header
        style={{
          padding: "1.5rem 2rem",
          position: "sticky",
          top: 0,
          zIndex: 40,
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div
          className="container flex items-center justify-between"
          style={{ padding: 0 }}
        >
          <div className="flex items-center">
            <img
              src={logo}
              alt="Sentinel Logo"
              className="h-12 w-auto object-contain invert-[0.1] brightness-150"
            />
          </div>

          <nav style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button
              className="glow-btn"
              style={{ background: "transparent", border: "none" }}
              onClick={() => navigate("/login")}
            >
              Sign In
            </button>

            <button className="glow-btn" onClick={() => setScanning(true)}>
              {scanning ? "Scanning..." : "Try Demo"}
            </button>
          </nav>
        </div>
      </header>;


      <main className="container" style={{ paddingTop: 60, paddingBottom: 80 }}>
        <section style={{ display: "grid", gridTemplateColumns: "1fr minmax(300px, 420px)", gap: 40, alignItems: "center" }}>
          
          {/* Left: Hero */}
          <div>
            <Badge>v1.0 — Enterprise Ready</Badge>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{
                marginTop: 24,
                fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                lineHeight: 1.1,
                fontWeight: 800,
                background: "linear-gradient(180deg, #ffffff, #a8b2d1)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                marginBottom: 20
              }}
            >
              DevSecOps <br /> 
              <span style={{ color: "var(--accent-gold)", WebkitTextFillColor: "var(--accent-gold)" }}>Orchestration Engine</span>
            </motion.h1>

            <motion.p 
                initial={{opacity:0}} 
                animate={{opacity:1}} 
                transition={{delay:0.2}} 
                style={{color:"var(--text-silver)", fontSize: "1.125rem", lineHeight: 1.6, maxWidth: 600, marginBottom: 32}}
            >
              Automate SAST, DAST, SCA & IaC pipelines with a single tool. 
              Intelligent findings correlation, AI-driven remediation, and audit-ready reporting.
            </motion.p>

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {/* 5. Main CTA goes to Login/Dashboard */}
              <button 
                className="glow-btn" 
                style={{ padding: "1rem 2rem", fontSize: "1.1rem" }}
                onClick={() => navigate('/login')}
              >
                Get Started
              </button>
              
              <button 
                className="glow-btn" 
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)" }}
                onClick={() => window.open('https://github.com/Hking0o1/sentinel_orchestrator_backend-cli', '_blank')}
              >
                View on GitHub
              </button>
            </div>

            {/* Metrics */}
            <div style={{ display: "flex", gap: 24, marginTop: 48 }}>
              <div>
                <div style={{ fontSize: 24, fontWeight: 700, color: "var(--accent-blue)" }}>10+</div>
                <div style={{ fontSize: 13, color: "var(--text-silver)" }}>Scanners Supported</div>
              </div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 700, color: "var(--accent-gold)" }}>AI</div>
                <div style={{ fontSize: 13, color: "var(--text-silver)" }}>Powered Analysis</div>
              </div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 700, color: "#10b981" }}>0s</div>
                <div style={{ fontSize: 13, color: "var(--text-silver)" }}>Latency (Async)</div>
              </div>
            </div>
          </div>

          {/* Right: Live demo console */}
          <aside>
            <div className="glass p-5 rounded-xl border shadow-2xl" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                    <Terminal size={16} /> Live Console
                </div>
                <div style={{ fontSize: 12, color: scanning ? "var(--accent-gold)" : "var(--text-silver)" }}>
                    {scanning ? "• Running..." : "• Idle"}
                </div>
              </div>

              {/* progress bar */}
              <div style={{ height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 2, overflow: "hidden", marginBottom: 16 }}>
                <motion.div
                  initial={false}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "linear", duration: 0.2 }}
                  style={{
                    height: "100%",
                    background: "var(--accent-blue)"
                  }}
                />
              </div>

              <div style={{ 
                  height: 300, 
                  background: "rgba(0,0,0,0.3)", 
                  borderRadius: 8, 
                  padding: 12, 
                  overflowY: "auto", 
                  fontFamily: "monospace", 
                  fontSize: 12, 
                  color: "#d1d5db" 
              }}>
                {logs.length === 0 ? (
                  <div style={{ color: "var(--text-silver)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
                    <Activity size={32} style={{ opacity: 0.2, marginBottom: 8 }} />
                    <span>Ready to scan target...</span>
                  </div>
                ) : (
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {logs.map((l, idx) => (
                      <li key={idx} style={{ marginBottom: 4, borderLeft: "2px solid var(--accent-blue)", paddingLeft: 8 }}>
                        <span style={{ opacity: 0.5, marginRight: 8 }}>&gt;</span>{l}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </aside>
        </section>

        {/* Features grid */}
        <section style={{ marginTop: 80 }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
              <h3 style={{ fontSize: 28, fontWeight: 800, marginBottom: 10 }}>Unified Security Pipeline</h3>
              <p style={{ color: "var(--text-silver)" }}>Comprehensive coverage from code commit to production deployment.</p>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            <FeatureCard Icon={Lock} title="Secure-by-Default" desc="Hardened NGINX reverse proxy with strict WAF rules and rate limiting built-in." />
            <FeatureCard Icon={Database} title="Persistent Storage" desc="All scan results and audit trails are securely stored in a dedicated PostgreSQL database." />
            <FeatureCard Icon={Zap} title="DAST Automation" desc="Automated OWASP ZAP, Nikto, and SQLMap scans running in parallel containers." />
            <FeatureCard Icon={ShieldCheck} title="SAST & SCA" desc="Deep code analysis using Semgrep and dependency tracking with OWASP Dependency-Check." />
            <FeatureCard Icon={Terminal} title="DevOps Friendly" desc="Full CLI support and REST API for seamless integration into CI/CD workflows." />
            <FeatureCard Icon={Activity} title="AI Reporting" desc="Google Gemini and Ollama integration for intelligent false-positive reduction and remediation." />
          </div>
        </section>

        <footer style={{ marginTop: 80, padding: "40px 0", borderTop: "1px solid rgba(255,255,255,0.05)", color: "var(--text-silver)", fontSize: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
            <div style={{ opacity: 0.7 }}>© {new Date().getFullYear()} Project Sentinel.</div>
            <div style={{ display: "flex", gap: 24 }}>
              <a href="#" style={{ textDecoration: "none", color: "inherit", transition: "color 0.2s" }} onMouseOver={e => e.currentTarget.style.color = "#fff"} onMouseOut={e => e.currentTarget.style.color = "inherit"}>Privacy</a>
              <a href="#" style={{ textDecoration: "none", color: "inherit", transition: "color 0.2s" }} onMouseOver={e => e.currentTarget.style.color = "#fff"} onMouseOut={e => e.currentTarget.style.color = "inherit"}>Terms</a>
              <a href="#" style={{ textDecoration: "none", color: "inherit", transition: "color 0.2s" }} onMouseOver={e => e.currentTarget.style.color = "#fff"} onMouseOut={e => e.currentTarget.style.color = "inherit"}>Documentation</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}