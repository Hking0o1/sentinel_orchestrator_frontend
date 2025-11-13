# 🛰️ Project Sentinel — Frontend Dashboard

> **A modern, secure, and animated frontend for the _Project Sentinel: DevSecOps Orchestration Engine_.**

The **Project Sentinel Frontend Dashboard** provides an interactive and responsive interface for users to authenticate, launch automated security scans, and visualize AI-generated reports from the Sentinel backend.  
Built with **React**, **Vite**, **TypeScript**, and **Tailwind CSS**, this application emphasizes security, performance, and a polished developer experience.

---

## 🧠 Overview

- **Purpose:** User interface for managing and monitoring DevSecOps scans  
- **Backend Dependency:** Requires the [Sentinel Orchestrator Backend](https://github.com/your-org/sentinel-orchestrator) running locally or remotely  
- **Design Philosophy:** Secure by default, visually professional, and smooth UX transitions  

---

## ⚙️ Tech Stack

| Category | Technology |
|-----------|-------------|
| **Framework** | React 19 + Vite |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS (custom theme) |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com) |
| **Animation** | GSAP (GreenSock Animation Platform) |
| **Routing** | `react-router-dom` |
| **Data Fetching** | `@tanstack/react-query` |
| **API Client** | `axios` (with JWT interceptors) |
| **State Management** | React Context (Authentication) |
| **Forms & Validation** | `react-hook-form` + `zod` |

---

## 🚀 Key Features

✅ **Secure by Default** – JWT-based authentication for all API calls  
✅ **Protected Routes** – Dashboard pages are accessible only to authenticated users  
✅ **Component-Based Architecture** – Modular, maintainable, and scalable  
✅ **Data-Driven UI** – React Query for caching, loading, and error states  
✅ **Smooth UX** – GSAP animations for fluid transitions  
✅ **Professional Dark Mode** – Custom-tailored theme for a modern cybersecurity dashboard  

---

## 🎨 Color Palette

| Name | Tailwind Key | Hex Code | Usage |
|------|---------------|-----------|--------|
| **Dark Blue** | `bg-primary-dark` | `#0a192f` | Main app background |
| **Light Blue** | `bg-primary-light` | `#172a45` | Cards, modals |
| **Silver Grey** | `text-neutral-300` | `#a8b2d1` | Primary text |
| **Golden Yellow** | `bg-accent-gold` | `#eab308` | Buttons & highlights |
| **Accent Blue** | `bg-accent-blue` | `#3b82f6` | Links & secondary actions |

---

## 🛠️ Getting Started

### 🔧 Prerequisites

- **Node.js 18+** (recommended: v20 LTS)
- **Backend Running:**  
  Ensure the [Sentinel Orchestrator Backend](https://github.com/your-org/sentinel-orchestrator) is active.  
  The frontend expects the backend’s NGINX proxy to be reachable at:  

  ```bash
  http://localhost:80
  ```
