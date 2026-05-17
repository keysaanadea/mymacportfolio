"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// ── Types ─────────────────────────────────────────────────────
type Badge   = { label: string; bg: string; color?: string };
type Feature = { icon: string; title: string; desc: string };
type Metric  = { value: string; label: string; color: string };

type ArchNode = { id: string; label: string; sub: string; x: number; y: number; color: string; icon: string };
type ArchEdge = { from: string; to: string; label?: string; dashed?: boolean };

type ProjectMeta = {
  id: string; folderName: string;
  readme: {
    title: string; subtitle: string; color: string;
    badges: Badge[]; lastUpdated: string;
    about: string; features: Feature[]; metrics: Metric[]; tip: string;
  };
  arch: { nodes: ArchNode[]; edges: ArchEdge[]; summary: string; iframeUrl?: string };
  overview: {
    nutshell: string; tech: string[];
    links: { label: string }[];
    activity: { time: string; action: string }[];
  };
  terminal: {
    cwd: string; command: string;
    output: { text: string; type: "success"|"info"|"plain"|"sep"|"dialog" }[];
  };
};

// ── Node dimensions ───────────────────────────────────────────
const NW = 104; const NH = 46;
function nc(n: ArchNode): [number, number] { return [n.x + NW / 2, n.y + NH / 2]; }

function edgePath(a: ArchNode, b: ArchNode): string {
  const [ax, ay] = nc(a);
  const [bx, by] = nc(b);
  const dx = bx - ax; const dy = by - ay;
  let x1: number, y1: number, x2: number, y2: number;
  if (Math.abs(dx) >= Math.abs(dy)) {
    x1 = dx > 0 ? a.x + NW : a.x; y1 = ay;
    x2 = dx > 0 ? b.x       : b.x + NW; y2 = by;
  } else {
    x1 = ax; y1 = dy > 0 ? a.y + NH : a.y;
    x2 = bx; y2 = dy > 0 ? b.y       : b.y + NH;
  }
  const cx1 = x1 + (x2 - x1) * 0.45;
  const cy1 = y1;
  const cx2 = x1 + (x2 - x1) * 0.55;
  const cy2 = y2;
  return `M ${x1} ${y1} C ${cx1} ${cy1} ${cx2} ${cy2} ${x2} ${y2}`;
}

function truncateSvgText(value: string, maxChars: number) {
  return value.length > maxChars ? `${value.slice(0, maxChars - 1)}…` : value;
}

function clampNodePosition(x: number, y: number) {
  return {
    x: Math.max(0, Math.min(x, 640 - NW)),
    y: Math.max(0, Math.min(y, 275 - NH)),
  };
}

const ARCH_PIN = "1234";

// ── Project data ──────────────────────────────────────────────
const meta: ProjectMeta[] = [
  {
    id: "ai-chatbot-sig", folderName: "HC-Chatbot",
    readme: {
      title: "HC AI Chatbot", color: "#6366f1",
      subtitle: "Internal AI Chatbot for SOP Retrieval, HC Analytics, and Voice at PT Semen Indonesia Group",
      badges: [
        { label: "Production-Ready", bg: "#22c55e", color: "#fff" },
        { label: "FastAPI",          bg: "#0ea5e9", color: "#fff" },
        { label: "Hybrid RAG",       bg: "#6366f1", color: "#fff" },
        { label: "Text-to-SQL",      bg: "#8b5cf6", color: "#fff" },
        { label: "Voice AI",         bg: "#ec4899", color: "#fff" },
        { label: "Langfuse",         bg: "#f97316", color: "#fff" },
      ],
      lastUpdated: "2 days ago",
      about: "I built this internal AI chatbot project for PT Semen Indonesia Group to unify SOP retrieval, guarded HC analytics, and voice interaction in one role-aware chat experience. The system combines hybrid RAG for policy retrieval, natural-language-to-SQL for authorized analytics, session-aware context handling, and observability for production monitoring.",
      features: [
        { icon: "", title: "RAG Hybrid v7.2.0",           desc: "Pinecone top-k retrieval with Cohere multilingual reranking for grounded SOP and policy answers." },
        { icon: "", title: "Text-to-SQL Guarded",          desc: "Natural language is translated into SQL, validated with safety rules, and executed against PostgreSQL for authorized analytics." },
        { icon: "", title: "Travel Calculator",            desc: "Business travel cost estimation enriched by Google Maps and aligned with internal policy rules." },
        { icon: "", title: "8 Visualization Types",        desc: "Analytics results can be rendered as bar, line, pie, doughnut, radar, and other chart types through Chart.js." },
        { icon: "", title: "Agentic HC Analyst",           desc: "Complex HC questions can be broken into multi-step analysis, evaluated per step, and synthesized into executive insight." },
        { icon: "", title: "SSE Streaming",                desc: "Responses stream in real time with cancellation-aware handling for a smoother chat experience." },
        { icon: "", title: "Hybrid Memory",                desc: "Redis hot cache and persistent session history keep conversation context fast and durable." },
        { icon: "", title: "LLM-as-a-Judge",               desc: "Background quality evaluation measures faithfulness, answer relevance, and context precision for each interaction." },
        { icon: "", title: "Langfuse Tracing",             desc: "End-to-end observability traces each request from intent classification to final response generation." },
        { icon: "", title: "Schema Explorer & Playground", desc: "Authorized users can inspect HC schema, preview queries, and prepare low-code datasets without leaving the main interface." },
        { icon: "", title: "Rate Limiting",                desc: "Per-IP request throttling protects chat and call flows from abuse and accidental overload." },
      ],
      metrics: [
        { value: "2",  label: "Interaction Modes",  color: "#6366f1" },
        { value: "4",  label: "Business Routes",    color: "#10b981" },
        { value: "3",  label: "Context Layers",     color: "#f97316" },
        { value: "11", label: "Key Capabilities",   color: "#3b82f6" },
      ],
      tip: "One chat surface — tiered routing sends each request to SOP retrieval, HC analytics, combined SOP+data, or HC advisory based on user role and detected intent.",
    },
    arch: {
      iframeUrl: "/presentations/sig-chatbot.html",
      summary: "Single chat interface with role-based routing into SOP retrieval or HC analytics, followed by response generation and observability.",
      nodes: [
        { id: "user",      label: "User",             sub: "Non-HC / HC",         x: 18,  y: 108, color: "#6366f1", icon: "" },
        { id: "ui",        label: "Chat UI",          sub: "Single chat",         x: 132, y: 108, color: "#3b82f6", icon: "" },
        { id: "api",       label: "FastAPI",          sub: "Streaming API",       x: 246, y: 108, color: "#0ea5e9", icon: "" },
        { id: "routing",   label: "Route + Context",  sub: "Role + session",      x: 360, y: 108, color: "#a855f7", icon: "" },
        { id: "sop",       label: "SOP Retrieval",    sub: "Pinecone RAG",        x: 360, y: 20,  color: "#10b981", icon: "" },
        { id: "hr",        label: "HC Analytics",     sub: "PostgreSQL + SQL",    x: 360, y: 196, color: "#f97316", icon: "" },
        { id: "response",  label: "Response",         sub: "Grounded output",     x: 524, y: 86,  color: "#ec4899", icon: "" },
        { id: "monitor",   label: "Monitoring",       sub: "Tracing + quality",   x: 524, y: 217, color: "#eab308", icon: "" },
      ],
      edges: [
        { from: "user",     to: "ui"                         },
        { from: "ui",       to: "api"                        },
        { from: "api",      to: "routing"                    },
        { from: "routing",  to: "sop",       label: "Non-HC" },
        { from: "routing",  to: "hr",        label: "HC"     },
        { from: "sop",      to: "response"                   },
        { from: "hr",       to: "response"                   },
        { from: "response", to: "ui",        dashed: true, label: "stream" },
        { from: "response", to: "monitor",   dashed: true    },
      ],
    },
    overview: {
      nutshell: "An internal AI chatbot for PT Semen Indonesia Group that unifies SOP retrieval for employees and guarded HC analytics for authorized users in one role-aware interface.",
      tech: ["FastAPI", "Hybrid RAG", "Text-to-SQL", "Pinecone", "PostgreSQL", "Langfuse", "Voice AI"],
      links: [{ label: "Role-aware routing" }, { label: "Hybrid RAG retrieval" }, { label: "Guarded HC analytics" }, { label: "Voice + streaming chat" }],
      activity: [
        { time: "today",       action: "Validated overtime-by-division analytics flow" },
        { time: "2 days ago",  action: "Refined HC vs karyawan routing logic" },
        { time: "4 days ago",  action: "Improved SQL validation and guarded execution" },
        { time: "1 week ago",  action: "Expanded Langfuse tracing and response evaluation" },
      ],
    },
    terminal: {
      cwd: "SIGChatbot", command: "uvicorn app.main:app --reload",
      output: [
        { text: "✓ Loading SOP retrieval index (Pinecone)...",         type: "success" },
        { text: "✓ Restoring chat memory + active session context...", type: "success" },
        { text: "✓ HC analytics connector ready (PostgreSQL)",         type: "success" },
        { text: "✓ Langfuse tracing and quality evaluation online",    type: "success" },
        { text: "─".repeat(40), type: "sep" },
        { text: 'User: "Berapa total data lembur per divisi?"',         type: "dialog" },
        { text: "Route: HC → HC Analytics Pipeline",                    type: "dialog" },
        { text: "SQL: aggregate overtime data by division",             type: "info" },
        { text: "Result: 181 divisions  |  Total records: 382",         type: "dialog" },
        { text: "Top divisions: Warehouse 24, Packer Operation 12...",  type: "dialog" },
        { text: "Suggested visualization: Bar Chart",                   type: "info" },
      ],
    },
  },
  {
    id: "bisindo-ai", folderName: "BISINDO-AI",
    readme: {
      title: "BISINDO AI", color: "#10b981",
      subtitle: "Indonesian Sign Language Recognition — Bangkit Academy 2024 Capstone",
      badges: [
        { label: "Bangkit 2024", bg: "#22c55e", color: "#fff" },
        { label: "VGG16",        bg: "#10b981", color: "#fff" },
        { label: "TensorFlow",   bg: "#f97316", color: "#fff" },
        { label: "Android",      bg: "#6366f1", color: "#fff" },
      ],
      lastUpdated: "3 months ago",
      about: "Mobile app for learning BISINDO (Indonesian Sign Language) built as a Bangkit Academy 2024 Capstone by a 7-person team across ML, Cloud, and Mobile tracks. I served as ML Engineer — responsible for the full ML pipeline: dataset preparation, augmentation, experimenting 4 transfer learning architectures (MobileNet, VGG16, VGG19, InceptionV3), and exporting the selected VGG16 model to TFLite for Android deployment.",
      features: [
        { icon: "", title: "VGG16 Transfer Learning",      desc: "VGG16 pretrained on ImageNet, fine-tuned with a custom Dense(26, softmax) head — selected over MobileNet, VGG19, and InceptionV3 after comparative experiments." },
        { icon: "", title: "26-Class BISINDO Classifier",  desc: "Classifies A–Z hand gesture alphabet at 224×224 input resolution with categorical cross-entropy and Adam optimizer." },
        { icon: "", title: "Data Augmentation Pipeline",   desc: "imgaug library with 6 techniques (flip, crop, contrast, noise, brightness, affine rotation) — each image produces 5 augmented variants." },
        { icon: "", title: "TFLite On-device Inference",   desc: "Keras .h5 converted to TFLite, uploaded to Google Cloud Storage, and loaded via TFLite Interpreter in the Android app — no internet required at inference time." },
      ],
      metrics: [
        { value: "26",  label: "Gesture Classes", color: "#10b981" },
        { value: "4",   label: "Models Tested",   color: "#6366f1" },
        { value: "7",   label: "Team Members",    color: "#f97316" },
        { value: "✓",   label: "Capstone Validated", color: "#3b82f6" },
      ],
      tip: "VGG16 was chosen over VGG19 and InceptionV3 for the best balance of accuracy and TFLite file size feasible for mobile deployment.",
    },
    arch: {
      iframeUrl: "/presentations/gestura.html",
      summary: "TFLite model trained with Keras/OpenCV, deployed as Android app via CameraX.",
      nodes: [
        { id: "cam",   label: "Camera",       sub: "CameraX",        x: 20,  y: 108, color: "#6366f1", icon: "" },
        { id: "cv",    label: "OpenCV",       sub: "Preprocessing",  x: 175, y: 108, color: "#3b82f6", icon: "" },
        { id: "cnn",   label: "CNN Model",    sub: "TensorFlow",     x: 330, y: 108, color: "#10b981", icon: "" },
        { id: "cls",   label: "Classifier",   sub: "26 Gestures",    x: 490, y: 108, color: "#a855f7", icon: "" },
        { id: "train", label: "TF Training",  sub: "Keras + GPU",    x: 330, y: 205, color: "#f97316", icon: "" },
      ],
      edges: [
        { from: "cam",   to: "cv"    },
        { from: "cv",    to: "cnn"   },
        { from: "cnn",   to: "cls"   },
        { from: "train", to: "cnn",  dashed: true, label: "weights" },
      ],
    },
    overview: {
      nutshell: "Bangkit 2024 Capstone — VGG16-based BISINDO gesture classifier converted to TFLite and deployed in an Android app, enabling real-time on-device sign language recognition.",
      tech: ["TensorFlow", "Keras", "VGG16", "TFLite", "imgaug", "OpenCV", "Python", "Android", "Google Cloud Storage"],
      links: [{ label: "GitHub Repository" }, { label: "Model Card" }, { label: "Demo Video" }],
      activity: [
        { time: "3 months ago", action: "VGG16 model exported to TFLite and integrated into Android app" },
        { time: "4 months ago", action: "Model experimentation done — VGG16 selected over MobileNet, VGG19, InceptionV3" },
        { time: "5 months ago", action: "Data augmentation pipeline built with imgaug (6 techniques, 5× expansion)" },
        { time: "6 months ago", action: "BISINDO dataset prepared, explored, and split for training" },
      ],
    },
    terminal: {
      cwd: "BISINDO-AI", command: "python inference.py --source webcam",
      output: [
        { text: "✓ Loading TFLite model...",          type: "success" },
        { text: "✓ CameraX stream initialized",       type: "success" },
        { text: "✓ Preprocessing pipeline ready",     type: "success" },
        { text: "─".repeat(40), type: "sep" },
        { text: "Detected: [A] — confidence: 0.97",   type: "dialog" },
        { text: "Detected: [I] — confidence: 0.99",   type: "dialog" },
        { text: "Avg inference time: 28ms",            type: "info" },
      ],
    },
  },
  {
    id: "recme-platform", folderName: "recMe",
    readme: {
      title: "recMe", color: "#0ea5e9",
      subtitle: "Real-time Network Topology Monitoring — PT Telkom Indonesia Regional V",
      badges: [
        { label: "Internship",  bg: "#22c55e", color: "#fff" },
        { label: "GoJS",        bg: "#0ea5e9", color: "#fff" },
        { label: "Laravel",     bg: "#ef4444", color: "#fff" },
        { label: "MySQL",       bg: "#f97316", color: "#fff" },
      ],
      lastUpdated: "8 months ago",
      about: "Network topology monitoring platform built during internship (KP) at PT Telkom Indonesia Regional V Surabaya. I developed the frontend — interactive topology canvas using GoJS with Vanilla JS, drag-and-drop node configuration, AJAX-based data sync with the Laravel backend, and a node status dashboard supporting 8 device types across 6 evaluation criteria.",
      features: [
        { icon: "", title: "GoJS Topology Canvas",    desc: "Interactive network diagram built with GoJS library — drag-and-drop node placement, 8 device node types, and topology configuration for Telkom engineers." },
        { icon: "", title: "AJAX Data Sync",          desc: "Topology changes synced to the Laravel backend via AJAX/JSON requests — configuration persisted to MySQL without page reload." },
        { icon: "", title: "Node Status Dashboard",   desc: "Per-device status monitoring across topology nodes — engineers can view device health and configuration from one interface." },
        { icon: "", title: "6 Evaluation Criteria",  desc: "System validated against 6 functional criteria during the KP period at PT Telkom Indonesia Regional V Surabaya." },
      ],
      metrics: [
        { value: "8",   label: "Node Types",         color: "#0ea5e9" },
        { value: "6",   label: "Criteria Met",       color: "#3b82f6" },
        { value: "3",   label: "Months KP",          color: "#10b981" },
        { value: "GoJS",label: "Canvas Library",     color: "#6366f1" },
      ],
      tip: "Built with Vanilla JS + GoJS on the frontend — no React or TypeScript. Backend uses Laravel + MySQL with AJAX for data exchange.",
    },
    arch: {
      iframeUrl: "/presentations/recme.html",
      summary: "React frontend syncs topology changes via WebSocket → Laravel API → MySQL in real time.",
      nodes: [
        { id: "browser",  label: "Browser",      sub: "Vanilla JS + GoJS", x: 20, y: 108, color: "#61dafb", icon: "" },
        { id: "ws",       label: "WebSocket",    sub: "Node.js",         x: 175, y: 108, color: "#3b82f6", icon: "" },
        { id: "laravel",  label: "Laravel API",  sub: "PHP / REST",      x: 332, y: 108, color: "#ef4444", icon: "" },
        { id: "mysql",    label: "MySQL DB",     sub: "Relational",      x: 492, y: 55,  color: "#f97316", icon: "" },
        { id: "topo",     label: "Topology Eng", sub: "Drag & Drop",     x: 492, y: 165, color: "#10b981", icon: "" },
      ],
      edges: [
        { from: "browser", to: "ws"      },
        { from: "ws",      to: "laravel" },
        { from: "laravel", to: "mysql"   },
        { from: "laravel", to: "topo"    },
        { from: "ws",      to: "browser", dashed: true, label: "push update" },
      ],
    },
    overview: {
      nutshell: "Network topology monitoring platform for PT Telkom Indonesia Regional V Surabaya — GoJS canvas with drag-and-drop, AJAX sync, and Laravel/MySQL backend.",
      tech: ["Vanilla JS", "GoJS", "AJAX", "Laravel", "PHP", "MySQL"],
      links: [{ label: "Live Platform" }, { label: "Technical Writeup" }, { label: "API Docs" }],
      activity: [
        { time: "8 months ago",  action: "KP completed — system validated against 6 criteria" },
        { time: "9 months ago",  action: "Node status dashboard implemented" },
        { time: "10 months ago", action: "GoJS topology canvas with drag-and-drop built" },
        { time: "11 months ago", action: "Initial prototype and Laravel API integration" },
      ],
    },
    terminal: {
      cwd: "recMe", command: "php artisan serve",
      output: [
        { text: "✓ Laravel development server started",           type: "success" },
        { text: "✓ MySQL connected (Telkom DB)",                  type: "success" },
        { text: "✓ GoJS topology canvas loaded",                  type: "success" },
        { text: "─".repeat(40), type: "sep" },
        { text: "AJAX POST /topology/update — node #14 saved",    type: "dialog" },
        { text: "Status: 200 OK  |  nodes updated: 1",            type: "info" },
      ],
    },
  },
  {
    id: "thesis-painting", folderName: "Thesis-PaintingClassifier",
    readme: {
      title: "Painting Classifier", color: "#ec4899",
      subtitle: "Identifying Visual Characteristics of Japanese vs. Chinese Traditional Paintings",
      badges: [
        { label: "Thesis",        bg: "#ec4899", color: "#fff" },
        { label: "TensorFlow",    bg: "#f97316", color: "#fff" },
        { label: "ResNet50",      bg: "#6366f1", color: "#fff" },
        { label: "Scikit-learn",  bg: "#3b82f6", color: "#fff" },
        { label: "Streamlit",     bg: "#10b981", color: "#fff" },
      ],
      lastUpdated: "3 months ago",
      about: "Thesis project focused on building a patch-based classification pipeline to distinguish Japanese traditional paintings (Ukiyo-e and Sumi-e) from Chinese paintings. The challenge lies in subtle stylistic differences such as brush strokes, decorative motifs, and empty space usage. Uses a ResNet50 + SVM hybrid voting approach with explainability via patch-level analysis.",
      features: [
        { icon: "", title: "Patch-Based Pipeline",   desc: "Images are split into patches for granular, localized classification rather than whole-image inference." },
        { icon: "", title: "Hybrid Voting (ResNet50 + SVM)", desc: "ResNet50 extracts deep features per patch; SVM scores each patch; final label determined by hybrid centroid voting." },
        { icon: "", title: "Explainability (XAI)",   desc: "Patch-level analysis reveals which image regions drive predictions, highlighting brush strokes and decorative motifs." },
        { icon: "", title: "UMAP / PCA Clustering",  desc: "Visualizes the feature space to confirm class separability between Japanese and Chinese painting styles." },
      ],
      metrics: [
        { value: "2",       label: "Classes",          color: "#ec4899" },
        { value: "ResNet50",label: "Feature Extractor",color: "#6366f1" },
        { value: "SVM",     label: "Patch Scorer",     color: "#f97316" },
        { value: "UMAP",    label: "Visualization",    color: "#10b981" },
      ],
      tip: "The hybrid voting mechanism combines SVM probability scores with centroid distances per patch, making the final prediction both accurate and interpretable.",
    },
    arch: {
      iframeUrl: "/presentations/thesis-painting.html",
      summary: "Image → patch extraction → ResNet50 feature extraction → PCA reduction → SVM scoring → hybrid centroid voting → prediction.",
      nodes: [
        { id: "input",   label: "Input Image",   sub: "JPG / PNG",        x: 18,  y: 108, color: "#ec4899", icon: "" },
        { id: "patch",   label: "Patch Extract", sub: "Grid split",       x: 150, y: 108, color: "#6366f1", icon: "" },
        { id: "resnet",  label: "ResNet50",      sub: "Feature vectors",  x: 282, y: 108, color: "#f97316", icon: "" },
        { id: "pca",     label: "PCA / UMAP",    sub: "Dim reduction",    x: 414, y: 50,  color: "#3b82f6", icon: "" },
        { id: "svm",     label: "SVM Scorer",    sub: "Patch probability", x: 414, y: 166, color: "#8b5cf6", icon: "" },
        { id: "vote",    label: "Hybrid Voting", sub: "Centroid + prob",  x: 546, y: 108, color: "#10b981", icon: "" },
      ],
      edges: [
        { from: "input",  to: "patch"  },
        { from: "patch",  to: "resnet" },
        { from: "resnet", to: "pca"    },
        { from: "resnet", to: "svm"    },
        { from: "pca",    to: "vote"   },
        { from: "svm",    to: "vote"   },
      ],
    },
    overview: {
      nutshell: "A patch-based hybrid classifier that distinguishes Japanese from Chinese traditional paintings using ResNet50 feature extraction, SVM scoring, and explainable patch-level voting.",
      tech: ["Python", "TensorFlow/Keras", "ResNet50", "PCA", "Scikit-learn (SVM)", "UMAP", "Streamlit"],
      links: [{ label: "Thesis Document" }, { label: "Streamlit Demo" }, { label: "GitHub Repo" }],
      activity: [
        { time: "3 months ago", action: "Streamlit interface deployed for demo" },
        { time: "4 months ago", action: "Hybrid voting mechanism finalized" },
        { time: "5 months ago", action: "UMAP clustering analysis completed" },
        { time: "6 months ago", action: "ResNet50 + SVM pipeline built and evaluated" },
      ],
    },
    terminal: {
      cwd: "Thesis-PaintingClassifier", command: "python classify.py --image painting.jpg",
      output: [
        { text: "✓ ResNet50 weights loaded (ImageNet)",       type: "success" },
        { text: "✓ SVM model loaded — kernel: rbf",           type: "success" },
        { text: "✓ Patch grid generated",                     type: "success" },
        { text: "─".repeat(40), type: "sep" },
        { text: "Extracting ResNet50 features per patch...",   type: "info" },
        { text: "SVM scoring: avg prob Jepang = 0.71",         type: "dialog" },
        { text: "Centroid Terdekat (Dominan): 1 (Jepang)",     type: "dialog" },
        { text: "→ Final Prediction: Japanese (Ukiyo-e)",      type: "success" },
      ],
    },
  },
  {
    id: "stock-forecasting", folderName: "Stock-Forecasting",
    readme: {
      title: "Stock Forecasting", color: "#eab308",
      subtitle: "GRU-Based Deep Learning Models for Indonesian Tech Sector Stock Prediction",
      badges: [
        { label: "Personal",    bg: "#eab308", color: "#fff" },
        { label: "TensorFlow",  bg: "#f97316", color: "#fff" },
        { label: "GRU / LSTM",  bg: "#6366f1", color: "#fff" },
        { label: "Time Series", bg: "#3b82f6", color: "#fff" },
      ],
      lastUpdated: "5 months ago",
      about: "Analyzed and evaluated deep learning models for forecasting Indonesian technology sector stock prices (e.g., BBCA), focusing on improving time series prediction accuracy using GRU-based architectures. Compared Bidirectional GRU, Stacked GRU, and custom variants (TF-BIGRU & TFGRUGRU) against a baseline GRU across multiple metrics.",
      features: [
        { icon: "", title: "Multi-Architecture Comparison", desc: "Benchmarked Bidirectional GRU, Stacked GRU, TF-BIGRU, and TFGRUGRU against baseline GRU on BBCA stock data." },
        { icon: "", title: "Custom GRU Variants",           desc: "Designed TF-BIGRU and TFGRUGRU architectures to improve prediction robustness over standard recurrent models." },
        { icon: "", title: "Time Series Visualization",     desc: "Generated train/test forecasting plots to visually compare actual vs. predicted stock price trajectories." },
        { icon: "", title: "Financial Insight",             desc: "Highlighted practical implications for investment and risk management using model performance differences." },
      ],
      metrics: [
        { value: "BBCA",     label: "Stock Target",     color: "#eab308" },
        { value: "13",       label: "Models Compared",  color: "#6366f1" },
        { value: "GRU",      label: "Core Architecture",color: "#f97316" },
        { value: "TFGRUGRU", label: "Best Variant",     color: "#10b981" },
      ],
      tip: "TFGRUGRU was the best-performing model overall. TF-BIGRU and TFGRUGRU both consistently outperformed the baseline GRU across all evaluated metrics.",
    },
    arch: {
      iframeUrl: "/presentations/stock-forecasting.html",
      summary: "Raw OHLCV data → normalization → sequence windowing → GRU model training → prediction → evaluation & visualization.",
      nodes: [
        { id: "data",    label: "OHLCV Data",    sub: "BBCA stock",      x: 18,  y: 108, color: "#eab308", icon: "" },
        { id: "norm",    label: "Normalize",     sub: "MinMaxScaler",    x: 150, y: 108, color: "#3b82f6", icon: "" },
        { id: "window",  label: "Windowing",     sub: "Sequence split",  x: 282, y: 108, color: "#6366f1", icon: "" },
        { id: "model",   label: "GRU Variants",  sub: "Bi / Stack / TF", x: 414, y: 108, color: "#f97316", icon: "" },
        { id: "pred",    label: "Prediction",    sub: "Inverse scaled",  x: 546, y: 58,  color: "#10b981", icon: "" },
        { id: "eval",    label: "Evaluation",    sub: "MSE / MAE",       x: 546, y: 166, color: "#ec4899", icon: "" },
      ],
      edges: [
        { from: "data",   to: "norm"   },
        { from: "norm",   to: "window" },
        { from: "window", to: "model"  },
        { from: "model",  to: "pred"   },
        { from: "model",  to: "eval"   },
        { from: "eval",   to: "model", dashed: true, label: "tune" },
      ],
    },
    overview: {
      nutshell: "A comparative study of GRU-based architectures for Indonesian stock price forecasting — custom TF-BIGRU and TFGRUGRU variants outperform baseline GRU on BBCA data.",
      tech: ["Python", "TensorFlow/Keras", "GRU / LSTM", "Bidirectional RNN", "Matplotlib", "Pandas", "NumPy"],
      links: [{ label: "Presentation" }, { label: "GitHub Repo" }, { label: "Forecasting Charts" }],
      activity: [
        { time: "5 months ago", action: "TFGRUGRU variant benchmarked and finalized" },
        { time: "6 months ago", action: "TF-BIGRU architecture implemented" },
        { time: "7 months ago", action: "Bidirectional & Stacked GRU evaluated" },
        { time: "8 months ago", action: "Baseline GRU trained on BBCA OHLCV data" },
      ],
    },
    terminal: {
      cwd: "Stock-Forecasting", command: "python train.py --model tfbigru --stock BBCA",
      output: [
        { text: "✓ BBCA OHLCV data loaded — 3,500 trading days",  type: "success" },
        { text: "✓ MinMaxScaler fitted on train set",              type: "success" },
        { text: "✓ TF-BIGRU model compiled (Adam, MSE loss)",      type: "success" },
        { text: "─".repeat(40), type: "sep" },
        { text: "Epoch 50/50 — loss: 0.0023  val_loss: 0.0031",   type: "dialog" },
        { text: "Test MSE: 0.0031  |  MAE: 0.0412",               type: "dialog" },
        { text: "→ TF-BIGRU outperforms baseline GRU by 12.4%",   type: "success" },
      ],
    },
  },
];

// ── Architecture view ─────────────────────────────────────────
function ArchitectureView({ p }: { p: ProjectMeta }) {
  const BASE_ZOOM = 0.8;
  const [hovered, setHovered] = useState<string | null>(null);
  const [nodes, setNodes] = useState(p.arch.nodes);
  const [zoom, setZoom] = useState(BASE_ZOOM);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isLocked, setIsLocked] = useState(true);
  const [showPin, setShowPin] = useState(false);
  const [pinValue, setPinValue] = useState("");
  const [pinError, setPinError] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const dragState = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const panState = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(null);
  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));

  useEffect(() => {
    setNodes(p.arch.nodes);
    setZoom(BASE_ZOOM);
    setPan({ x: 0, y: 0 });
    setIsLocked(true);
    setShowPin(false);
    setPinValue("");
    setPinError(false);
  }, [p]);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (!svgRef.current) return;

      const bounds = svgRef.current.getBoundingClientRect();
      const scaleX = 640 / bounds.width;
      const scaleY = 275 / bounds.height;
      const pointerX = (event.clientX - bounds.left) * scaleX;
      const pointerY = (event.clientY - bounds.top) * scaleY;

      if (panState.current) {
        const deltaX = (event.clientX - panState.current.startX) * scaleX;
        const deltaY = (event.clientY - panState.current.startY) * scaleY;
        setPan({
          x: panState.current.originX + deltaX,
          y: panState.current.originY + deltaY,
        });
        return;
      }

      if (!dragState.current) return;

      const next = {
        x: pointerX - pan.x - dragState.current.offsetX,
        y: pointerY - pan.y - dragState.current.offsetY,
      };

      setNodes((prev) =>
        prev.map((node) =>
          node.id === dragState.current?.id ? { ...node, x: next.x, y: next.y } : node
        )
      );
    };

    const handlePointerUp = () => {
      dragState.current = null;
      panState.current = null;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [pan.x, pan.y]);

  const zoomOut = () => setZoom((prev) => Math.max(0.5, Number((prev - 0.1).toFixed(2))));
  const zoomIn = () => setZoom((prev) => Math.min(1.8, Number((prev + 0.1).toFixed(2))));
  const resetView = () => {
    setNodes(p.arch.nodes);
    setZoom(BASE_ZOOM);
    setPan({ x: 0, y: 0 });
  };

  const handleUnlock = () => {
    if (pinValue === ARCH_PIN) {
      setIsLocked(false);
      setShowPin(false);
      setPinValue("");
      setPinError(false);
    } else {
      setPinError(true);
      setPinValue("");
    }
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col" style={{ background: "#1e1e1e", position: "relative" }}>
      {/* Summary bar */}
      <div
        style={{
          padding: "10px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          fontSize: 11,
          color: "rgba(204,204,204,0.45)",
          fontFamily: "-apple-system,sans-serif",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div className="min-w-0" style={{ flex: 1 }}>
          <span style={{ color: "rgba(204,204,204,0.28)", marginRight: 8 }}>// architecture</span>
          {p.arch.summary}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          <button
            type="button"
            onClick={() => isLocked ? setShowPin(true) : setIsLocked(true)}
            title={isLocked ? "Klik untuk edit (perlu PIN)" : "Klik untuk kunci"}
            style={{
              width: 24, height: 24, borderRadius: 6,
              border: `1px solid ${isLocked ? "rgba(99,102,241,0.35)" : "rgba(255,255,255,0.08)"}`,
              background: isLocked ? "rgba(99,102,241,0.12)" : "rgba(255,255,255,0.04)",
              color: isLocked ? "#a5b4fc" : "rgba(100,220,100,0.8)",
              cursor: "pointer", fontSize: 13, lineHeight: 1,
            }}
          >
            {isLocked ? "🔒" : "🔓"}
          </button>
          <div style={{ width: 1, height: 14, background: "rgba(255,255,255,0.08)" }} />
          <button
            type="button"
            onClick={zoomOut}
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.04)",
              color: "rgba(255,255,255,0.7)",
              cursor: "pointer",
            }}
          >
            -
          </button>
          <button
            type="button"
            onClick={resetView}
            style={{
              minWidth: 52,
              height: 24,
              borderRadius: 6,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.04)",
              color: "rgba(255,255,255,0.7)",
              cursor: "pointer",
              fontSize: 10,
              fontFamily: "-apple-system,sans-serif",
            }}
          >
            {Math.round((zoom / BASE_ZOOM) * 100)}%
          </button>
          <button
            type="button"
            onClick={zoomIn}
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.04)",
              color: "rgba(255,255,255,0.7)",
              cursor: "pointer",
            }}
          >
            +
          </button>
        </div>
      </div>

      {/* SVG diagram */}
      <div className="flex-1 flex items-center justify-center" style={{ padding: "0 8px" }}>
        <svg
          ref={svgRef}
          viewBox="0 0 640 275"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
          onPointerDown={(event) => {
            if (isLocked || !svgRef.current) return;
            panState.current = {
              startX: event.clientX,
              startY: event.clientY,
              originX: pan.x,
              originY: pan.y,
            };
          }}
          style={{
            maxHeight: "100%",
            overflow: "visible",
            transform: `scale(${zoom})`,
            transformOrigin: "center center",
            transition: dragState.current || panState.current ? "none" : "transform 120ms ease",
            cursor: isLocked ? "default" : "grab",
          }}
        >
          <defs>
            {/* Arrow marker */}
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="rgba(150,150,150,0.55)" />
            </marker>
            <marker id="arrow-dim" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="rgba(100,100,100,0.4)" />
            </marker>
            {/* Glow filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            {/* Dash animation */}
            <style>{`
              @keyframes march { to { stroke-dashoffset: -20; } }
              .dashed-flow { animation: march 0.7s linear infinite; }
            `}</style>
          </defs>

          <g transform={`translate(${pan.x} ${pan.y})`}>
          {/* Edges */}
          {p.arch.edges.map((edge, i) => {
            const a = nodeMap[edge.from];
            const b = nodeMap[edge.to];
            if (!a || !b) return null;
            const d = edgePath(a, b);
            const isHovered = hovered === edge.from || hovered === edge.to;
            return (
              <g key={i}>
                <path
                  d={d}
                  fill="none"
                  stroke={isHovered ? "rgba(200,200,200,0.5)" : "rgba(120,120,120,0.35)"}
                  strokeWidth={isHovered ? 1.8 : 1.2}
                  strokeDasharray={edge.dashed ? "6 4" : undefined}
                  className={edge.dashed ? "dashed-flow" : undefined}
                  markerEnd={edge.dashed ? "url(#arrow-dim)" : "url(#arrow)"}
                  style={{ transition: "stroke 0.15s" }}
                />
                {edge.label && (() => {
                  const [ax, ay] = nc(a); const [bx, by] = nc(b);
                  return (
                    <text x={(ax+bx)/2} y={(ay+by)/2 - 5} textAnchor="middle" fontSize="9" fill="rgba(160,160,160,0.5)" fontFamily="-apple-system,sans-serif">
                      {edge.label}
                    </text>
                  );
                })()}
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map(node => {
            const isHov = hovered === node.id;
            return (
              <g
                key={node.id}
                onMouseEnter={() => setHovered(node.id)}
                onMouseLeave={() => setHovered(null)}
                onPointerDown={(event) => {
                  if (isLocked) return;
                  event.stopPropagation();
                  if (!svgRef.current) return;
                  const bounds = svgRef.current.getBoundingClientRect();
                  const scaleX = 640 / bounds.width;
                  const scaleY = 275 / bounds.height;
                  const pointerX = (event.clientX - bounds.left) * scaleX;
                  const pointerY = (event.clientY - bounds.top) * scaleY;

                  dragState.current = {
                    id: node.id,
                    offsetX: pointerX - pan.x - node.x,
                    offsetY: pointerY - pan.y - node.y,
                  };
                }}
                style={{ cursor: isLocked ? "default" : "grab" }}
                filter={isHov ? "url(#glow)" : undefined}
              >
                {/* Background rect */}
                <rect
                  x={node.x} y={node.y} width={NW} height={NH} rx={8}
                  fill={isHov ? "rgba(40,40,50,0.98)" : "rgba(30,30,38,0.96)"}
                  stroke={isHov ? node.color : "rgba(255,255,255,0.10)"}
                  strokeWidth={isHov ? 1.5 : 1}
                  style={{ transition: "fill 0.15s, stroke 0.15s" }}
                />
                {/* Label */}
                <text x={node.x + 14} y={node.y + 18} fontSize="10.5" fontWeight="600" fill={isHov ? "rgba(255,255,255,0.92)" : "rgba(204,204,204,0.82)"} fontFamily="-apple-system,sans-serif" style={{ transition: "fill 0.15s" }}>
                  {truncateSvgText(node.label, 14)}
                </text>

                {/* Sublabel */}
                <text x={node.x + 14} y={node.y + 31} fontSize="8.5" fill={isHov ? node.color : "rgba(140,140,140,0.65)"} fontFamily="-apple-system,sans-serif" style={{ transition: "fill 0.15s" }}>
                  {truncateSvgText(node.sub, 15)}
                </text>
              </g>
            );
          })}
          </g>
        </svg>
      </div>

      {/* PIN modal */}
      {showPin && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 20 }}>
          <div style={{ background: "#2d2d2d", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, padding: "24px 28px", width: 260, display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.85)", fontFamily: "-apple-system,sans-serif" }}>🔒 Masukkan PIN untuk edit</div>
            <input
              type="password"
              maxLength={6}
              value={pinValue}
              onChange={e => { setPinValue(e.target.value); setPinError(false); }}
              onKeyDown={e => e.key === "Enter" && handleUnlock()}
              autoFocus
              placeholder="••••"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: `1px solid ${pinError ? "#ef4444" : "rgba(255,255,255,0.12)"}`,
                borderRadius: 8, padding: "8px 12px", color: "#fff",
                fontSize: 20, letterSpacing: "0.4em", textAlign: "center",
                outline: "none", fontFamily: "monospace", width: "100%", boxSizing: "border-box",
              }}
            />
            {pinError && (
              <div style={{ fontSize: 11, color: "#ef4444", fontFamily: "-apple-system,sans-serif", marginTop: -8 }}>PIN salah. Coba lagi.</div>
            )}
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                onClick={() => { setShowPin(false); setPinValue(""); setPinError(false); }}
                style={{ flex: 1, padding: "7px 0", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 12, fontFamily: "-apple-system,sans-serif" }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleUnlock}
                style={{ flex: 1, padding: "7px 0", borderRadius: 8, border: "none", background: "#6366f1", color: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "-apple-system,sans-serif" }}
              >
                Buka
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div style={{ padding: "6px 20px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 20, fontSize: 10, color: "rgba(150,150,150,0.55)", fontFamily: "-apple-system,sans-serif" }}>
        <span className="flex items-center gap-1">
          <svg width="24" height="8"><line x1="0" y1="4" x2="20" y2="4" stroke="rgba(150,150,150,0.5)" strokeWidth="1.5" markerEnd="url(#arrow)"/></svg>
          data flow
        </span>
        <span className="flex items-center gap-1">
          <svg width="24" height="8"><line x1="0" y1="4" x2="20" y2="4" stroke="rgba(150,150,150,0.4)" strokeWidth="1.2" strokeDasharray="4 3"/></svg>
          async / context
        </span>
        <span style={{ marginLeft: "auto" }}>drag background to pan, nodes to rearrange</span>
      </div>
    </div>
  );
}

// ── README preview ────────────────────────────────────────────
function ReadmePreview({ p }: { p: ProjectMeta }) {
  const r = p.readme;
  return (
    <div className="flex-1 overflow-y-auto" style={{ padding: "20px 24px", background: "#1e1e1e" }}>

      {/* Header */}
      <h1 style={{ fontSize: 26, fontWeight: 800, color: r.color, lineHeight: 1.1, marginBottom: 4 }}>{r.title}</h1>
      <p style={{ fontSize: 12.5, color: "rgba(204,204,204,0.45)", marginBottom: 14, fontFamily: "-apple-system,sans-serif" }}>{r.subtitle}</p>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6, marginBottom: 16 }}>
        {r.badges.map(b => (
          <span key={b.label} style={{ fontSize: 10.5, fontWeight: 700, padding: "2px 9px", borderRadius: 4, background: b.bg, color: b.color ?? "#fff", fontFamily: "-apple-system,sans-serif" }}>{b.label}</span>
        ))}
        <span style={{ fontSize: 10.5, color: "rgba(204,204,204,0.22)", fontFamily: "-apple-system,sans-serif", marginLeft: 2 }}>· {r.lastUpdated}</span>
      </div>
      <div style={{ height: 1, background: "rgba(255,255,255,0.07)", marginBottom: 18 }} />

      {/* About */}
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", fontFamily: "-apple-system,sans-serif", marginBottom: 8 }}>About</p>
        <p style={{ fontSize: 12.5, color: "rgba(204,204,204,0.52)", lineHeight: 1.75, fontFamily: "-apple-system,sans-serif" }}>{r.about}</p>
      </div>

      {/* Features */}
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", fontFamily: "-apple-system,sans-serif", marginBottom: 8 }}>What it does</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
          {r.features.map(f => (
            <div key={f.title} style={{ padding: "9px 12px", borderRadius: 7, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <p style={{ fontSize: 11.5, fontWeight: 700, color: "rgba(220,220,220,0.85)", marginBottom: 3, fontFamily: "-apple-system,sans-serif" }}>{f.title}</p>
              <p style={{ fontSize: 10.5, color: "rgba(204,204,204,0.38)", lineHeight: 1.55, fontFamily: "-apple-system,sans-serif" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Impact — only the numbers use color */}
      <div style={{ marginBottom: 18 }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", fontFamily: "-apple-system,sans-serif", marginBottom: 8 }}>Stats</p>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${r.metrics.length},1fr)`, gap: 7 }}>
          {r.metrics.map(m => (
            <div key={m.label} style={{ padding: "12px 10px 10px", borderRadius: 8, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", textAlign: "center" }}>
              <p style={{ fontSize: 22, fontWeight: 800, color: m.color, lineHeight: 1, fontFamily: "-apple-system,sans-serif" }}>{m.value}</p>
              <p style={{ fontSize: 9.5, color: "rgba(204,204,204,0.32)", marginTop: 4, fontFamily: "-apple-system,sans-serif", lineHeight: 1.3 }}>{m.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tip */}
      <div style={{ padding: "9px 13px", borderRadius: 7, background: "rgba(255,230,100,0.04)", border: "1px solid rgba(255,230,100,0.1)" }}>
        <span style={{ fontSize: 11.5, color: "rgba(255,220,80,0.6)", fontFamily: "-apple-system,sans-serif", lineHeight: 1.55 }}>Tip: {r.tip}</span>
      </div>
    </div>
  );
}

// ── Terminal panel ────────────────────────────────────────────
function TerminalPanel({ p }: { p: ProjectMeta }) {
  const t = p.terminal;
  const col = (type: string) => {
    if (type === "success") return "#4ec9b0";
    if (type === "info")    return "#569cd6";
    if (type === "dialog")  return "#d4d4d4";
    if (type === "sep")     return "rgba(255,255,255,0.14)";
    return "rgba(204,204,204,0.5)";
  };
  return (
    <div style={{ height: 158, borderTop: "1px solid #333", display: "flex", flexDirection: "column", background: "#1e1e1e" }}>
      <div className="flex items-center gap-1 flex-shrink-0" style={{ background: "#2d2d2d", borderBottom: "1px solid #333", padding: "0 12px", height: 27 }}>
        {["TERMINAL","OUTPUT","PROBLEMS 0","GIT"].map((tab, i) => (
          <span key={tab} style={{ fontSize: 11, padding: "0 10px", height: 27, display: "flex", alignItems: "center", fontFamily: "-apple-system,sans-serif", color: i === 0 ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.32)", borderBottom: i === 0 ? "1px solid rgba(255,255,255,0.7)" : "1px solid transparent", cursor: "default" }}>{tab}</span>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto" style={{ padding: "7px 14px", fontFamily: "'Menlo','Monaco','Consolas',monospace", fontSize: 11 }}>
        <div style={{ marginBottom: 2 }}>
          <span style={{ color: "#4ec9b0" }}>keysa@portfolio</span>
          <span style={{ color: "rgba(255,255,255,0.35)" }}> → </span>
          <span style={{ color: "#569cd6" }}>{t.cwd}</span>
        </div>
        <div style={{ color: "#d4d4d4", marginBottom: 5 }}><span style={{ color: "rgba(255,255,255,0.35)" }}>$ </span>{t.command}</div>
        {t.output.map((line, i) => (
          <div key={i} style={{ color: col(line.type), lineHeight: "18px", whiteSpace: "pre" }}>{line.text}</div>
        ))}
        <div style={{ color: "rgba(255,255,255,0.35)", marginTop: 3 }}>$ </div>
      </div>
    </div>
  );
}

// ── Overview panel ────────────────────────────────────────────
function OverviewPanel({ p }: { p: ProjectMeta }) {
  const o = p.overview;
  return (
    <div className="flex flex-col flex-shrink-0 overflow-y-auto" style={{ width: 248, background: "#252526", borderLeft: "1px solid #333" }}>
      <div style={{ padding: "10px 14px 6px", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.09em", color: "rgba(255,255,255,0.25)", fontFamily: "-apple-system,sans-serif" }}>PROJECT OVERVIEW</div>

      <div style={{ padding: "6px 14px 10px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <p style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", fontFamily: "-apple-system,sans-serif", marginBottom: 5 }}>In a nutshell</p>
        <p style={{ fontSize: 10.5, color: "rgba(255,255,255,0.38)", lineHeight: 1.65, fontFamily: "-apple-system,sans-serif" }}>{o.nutshell}</p>
      </div>

      <div style={{ padding: "8px 14px 10px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <p style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", fontFamily: "-apple-system,sans-serif", marginBottom: 6 }}>Tech Stack</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
          {o.tech.map(t => (
            <span key={t} style={{ fontSize: 9.5, padding: "2px 6px", borderRadius: 3, background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.48)", border: "1px solid rgba(255,255,255,0.09)", fontFamily: "-apple-system,sans-serif" }}>{t}</span>
          ))}
        </div>
      </div>

      <div style={{ padding: "8px 14px 10px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <p style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", fontFamily: "-apple-system,sans-serif", marginBottom: 5 }}>Highlights</p>
        {o.links.map(l => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 4px" }}>
            <div style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,0.25)", flexShrink: 0 }} />
            <span style={{ fontSize: 10.5, color: "rgba(255,255,255,0.45)", fontFamily: "-apple-system,sans-serif" }}>{l.label}</span>
          </div>
        ))}
      </div>

      <div style={{ padding: "8px 14px 12px" }}>
        <p style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", fontFamily: "-apple-system,sans-serif", marginBottom: 7 }}>Recent Activity</p>
        {o.activity.map((a, i) => (
          <div key={i} className="flex gap-2 mb-[6px]">
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.22)", whiteSpace: "nowrap", fontFamily: "-apple-system,sans-serif", minWidth: 70 }}>{a.time}</span>
            <span style={{ fontSize: 10.5, color: "rgba(255,255,255,0.45)", fontFamily: "-apple-system,sans-serif", lineHeight: 1.4 }}>{a.action}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Activity bar ──────────────────────────────────────────────
function ActivityBtn({ active, children }: { active?: boolean; children: React.ReactNode }) {
  return (
    <div className="w-10 h-10 flex items-center justify-center cursor-pointer" style={{ color: active ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.32)", borderLeft: active ? "2px solid rgba(255,255,255,0.75)" : "2px solid transparent" }}>
      {children}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────
export default function ProjectsWindow() {
  const [selectedId, setSelectedId]   = useState(meta[0].id);
  const [activeFile, setActiveFile]   = useState<"readme"|"arch">("readme");
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({ [meta[0].id]: true });

  const active = meta.find(p => p.id === selectedId) ?? meta[0];

  const selectProject = (id: string) => {
    setSelectedId(id);
    setActiveFile("readme");
    setOpenFolders(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const fileTabStyle = (isActive: boolean) => ({
    background:   isActive ? "#1e1e1e" : "transparent",
    borderRight:  "1px solid #252526",
    borderTop:    isActive ? "1px solid #007acc" : "1px solid transparent",
    color:        isActive ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.38)",
    fontSize:     12,
    fontFamily:   "-apple-system,sans-serif",
    padding:      "0 14px",
    display:      "flex",
    alignItems:   "center",
    gap:          6,
    cursor:       "pointer",
    height:       34,
    flexShrink:   0,
  });

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: "#1e1e1e", fontFamily: "'Menlo','Monaco','Consolas',monospace" }}>
      <div className="flex flex-1 overflow-hidden">

        {/* Activity bar */}
        <div className="flex flex-col items-center pt-1 flex-shrink-0" style={{ width: 40, background: "#333333" }}>
          <ActivityBtn active>
            <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor"><path d="M13.5 3h-5L7 1.5H2.5a1 1 0 00-1 1v11a1 1 0 001 1h11a1 1 0 001-1V4a1 1 0 00-1-1z" fillOpacity="0.85"/></svg>
          </ActivityBtn>
          <ActivityBtn>
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3"><circle cx="6.5" cy="6.5" r="4.5"/><path d="M10.5 10.5L14 14" strokeLinecap="round"/></svg>
          </ActivityBtn>
          <ActivityBtn>
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="4" cy="4.5" r="1.75" fill="currentColor" stroke="none"/><circle cx="12" cy="4.5" r="1.75" fill="currentColor" stroke="none"/><circle cx="4" cy="11.5" r="1.75" fill="currentColor" stroke="none"/><path d="M4 6.25v2.5M12 6.25v1A3.25 3.25 0 018.75 11H5" strokeLinecap="round"/></svg>
          </ActivityBtn>
        </div>

        {/* Explorer sidebar */}
        <div className="flex flex-col flex-shrink-0 overflow-hidden" style={{ width: 200, background: "#252526", borderRight: "1px solid #1a1a1a" }}>
          <div style={{ padding: "8px 16px 4px", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "rgba(255,255,255,0.35)", fontFamily: "-apple-system,sans-serif" }}>EXPLORER</div>
          <div style={{ padding: "2px 8px 2px 12px", display: "flex", alignItems: "center", gap: 5 }}>
            <svg width="9" height="9" viewBox="0 0 10 10" fill="rgba(150,150,150,0.7)" style={{ transform: "rotate(90deg)" }}><path d="M2 1l6 4-6 4V1z"/></svg>
            <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.55)", letterSpacing: "0.02em" }}>PORTFOLIO</span>
          </div>

          <div className="flex-1 overflow-y-auto">
            {meta.map(p => {
              const isOpen     = !!openFolders[p.id];
              const isSelected = selectedId === p.id;
              return (
                <div key={p.id}>
                  {/* Project folder */}
                  <div
                    onClick={() => selectProject(p.id)}
                    className="flex items-center gap-[5px] cursor-pointer hover:bg-white/5"
                    style={{ padding: "3px 8px 3px 20px", background: isSelected && !isOpen ? "rgba(255,255,255,0.08)" : "transparent" }}
                  >
                    <svg width="9" height="9" viewBox="0 0 10 10" fill="rgba(150,150,150,0.7)" style={{ flexShrink: 0, transform: isOpen ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.12s" }}><path d="M2 1l6 4-6 4V1z"/></svg>
                    <svg width="14" height="12" viewBox="0 0 16 14" fill={isOpen ? "#dcad6e" : "#c5a05a"} style={{ flexShrink: 0 }}><path d="M1 3.5A1.5 1.5 0 012.5 2H6l1.5 2H13.5A1.5 1.5 0 0115 5.5v6A1.5 1.5 0 0113.5 13H2.5A1.5 1.5 0 011 11.5v-8z"/></svg>
                    <span style={{ fontSize: 12, color: isSelected ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.52)" }}>{p.folderName}</span>
                    {isSelected && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ec9b0", marginLeft: 2, flexShrink: 0, display: "inline-block" }} />}
                  </div>

                  {/* Only README.md + architecture.md / presentation.pptx */}
                  {isOpen && (
                    <>
                      {[
                        { name: "README.md",                                               file: "readme" as const, badgeBg: "#0078d4", badgeText: "MD" },
                        { name: p.arch.iframeUrl ? "presentation.pptx" : "architecture.md", file: "arch"   as const, badgeBg: "#f97316", badgeText: p.arch.iframeUrl ? "PPTX" : "MD" },
                      ].map(f => (
                        <div
                          key={f.name}
                          onClick={() => { setSelectedId(p.id); setActiveFile(f.file); }}
                          className="flex items-center gap-[5px] cursor-pointer hover:bg-white/5"
                          style={{ padding: "3px 8px 3px 42px", background: isSelected && activeFile === f.file ? "rgba(255,255,255,0.09)" : "transparent" }}
                        >
                          <span className="inline-flex items-center justify-center font-bold select-none flex-shrink-0" style={{ fontSize: 6, width: 14, height: 14, borderRadius: 2, background: f.badgeBg, color: "#fff" }}>{f.badgeText}</span>
                          <span style={{ fontSize: 12, color: isSelected && activeFile === f.file ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.48)" }}>{f.name}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            {["OUTLINE","TIMELINE"].map(s => (
              <div key={s} style={{ padding: "5px 16px", display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                <svg width="8" height="8" viewBox="0 0 10 10" fill="rgba(120,120,120,0.5)"><path d="M2 1l6 4-6 4V1z"/></svg>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", color: "rgba(255,255,255,0.25)", fontFamily: "-apple-system,sans-serif" }}>{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Center: editor + terminal */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Tab bar */}
          <div className="flex flex-shrink-0 overflow-hidden" style={{ background: "#2d2d2d", borderBottom: "1px solid #1a1a1a", height: 34 }}>
            <div style={fileTabStyle(activeFile === "readme")} onClick={() => setActiveFile("readme")}>
              <span className="inline-flex items-center justify-center font-bold" style={{ fontSize: 6, width: 13, height: 13, borderRadius: 2, background: "#0078d4", color: "#fff" }}>MD</span>
              README.md
            </div>
            <div style={fileTabStyle(activeFile === "arch")} onClick={() => setActiveFile("arch")}>
              <span className="inline-flex items-center justify-center font-bold" style={{ fontSize: 6, width: 13, height: 13, borderRadius: 2, background: "#a855f7", color: "#fff" }}>{active.arch.iframeUrl ? "HTML" : "MD"}</span>
              {active.arch.iframeUrl ? "presentation.pptx" : "architecture.md"}
            </div>
            <div className="flex-1" />
            <div className="flex items-center px-3" style={{ fontSize: 11, color: "rgba(255,255,255,0.32)", fontFamily: "-apple-system,sans-serif", cursor: "pointer", gap: 4 }}>
              <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor"><path d="M1 1h14v2H1zm0 4h14v2H1zm0 4h9v2H1z"/></svg>
              PREVIEW
            </div>
          </div>

          {/* Editor */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedId}-${activeFile}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              {activeFile === "readme"
                ? <ReadmePreview p={active} />
                : active.arch.iframeUrl
                  ? <iframe src={active.arch.iframeUrl} className="flex-1 w-full h-full border-0" style={{ background: "#0d0d0d" }} />
                  : <ArchitectureView p={active} />
              }
            </motion.div>
          </AnimatePresence>

          <TerminalPanel p={active} />
        </div>

        <OverviewPanel p={active} />
      </div>

      {/* Status bar */}
      <div className="flex items-center gap-3 flex-shrink-0 px-3 select-none" style={{ height: 22, background: "#007acc", fontFamily: "-apple-system,sans-serif", fontSize: 11, color: "rgba(255,255,255,0.9)" }}>
        <span className="flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3"><circle cx="4" cy="4.5" r="1.75" fill="currentColor" stroke="none"/><circle cx="12" cy="4.5" r="1.75" fill="currentColor" stroke="none"/><circle cx="4" cy="11.5" r="1.75" fill="currentColor" stroke="none"/><path d="M4 6.25v2.5M12 6.25v1A3.25 3.25 0 018.75 11H5" strokeLinecap="round"/></svg>
          main
        </span>
        <span>Python 3.11.6</span>
        <span style={{ opacity: 0.6 }}>⓪ 0  ⚠ 0</span>
        <span style={{ marginLeft: "auto" }}>Ln 1, Col 1</span>
        <span>Spaces: 4</span>
        <span>UTF-8</span>
        <span>LF</span>
        <span>Markdown</span>
      </div>
    </div>
  );
}
