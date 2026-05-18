import type {
  Album,
  Book,
  CommitteeExp,
  DesktopShortcut,
  DockItem,
  Message,
  Profile,
  Project,
  ResumeEntry,
  SocialLink,
  Song,
  WindowId,
} from "@/types";

export const profile: Profile = {
  name: "Keysa Anadea",
  role: "AI Engineer & Full-Stack Developer",
  location: "East Jakarta, Indonesia",
  bio: "Informatics Engineering graduate from ITS with hands-on experience building AI systems and production web platforms. Currently engineering an end-to-end LLM-powered chatbot at PT Semen Indonesia, covering RAG pipelines, tool routing, voice I/O, and secure database integration.",
  tagline: "Building intelligent systems that make complex data feel effortless.",
  email: "keysa.anadea@gmail.com",
  avatar: "/profile.jpg",
  availability: "Open to AI Engineer, ML Engineer, and data-related roles, including Data Engineer, Data Scientist, and Data Analyst.",
  focus: [
    "Exploring new AI tools and keeping up with fast-moving AI developments",
    "Learning more data tools for reporting, analysis, and decision support",
  ],
};

export const expertise = [
  "Python",
  "LLMs / RAG",
  "TensorFlow",
  "FastAPI",
  "Next.js",
  "Power BI",
  "Excel",
  "Microsoft Tools",
];

export const projects: Project[] = [
  {
    id: "ai-chatbot-sig",
    name: "Enterprise AI Chatbot",
    description: "End-to-end internal chatbot for PT Semen Indonesia. RAG-powered with intent-based tool routing, HC database integration, voice I/O (Whisper + ElevenLabs), and real-time data visualization.",
    status: "Live",
    tech: ["Python", "LangChain", "FastAPI", "RAG", "Whisper", "ElevenLabs"],
    icon: "🤖",
    color: "#6366f1",
    url: "#",
  },
  {
    id: "gestura-bisindo",
    name: "Gestura, BISINDO Sign Language",
    description: "Mobile app prototype enabling the deaf and mute community to learn Indonesian Sign Language (BISINDO) through AI-powered recognition. Bangkit Academy 2024 capstone, validated by Google, Gojek & Traveloka.",
    status: "Live",
    tech: ["Python", "TensorFlow/Keras", "VGG16", "CNN", "Android"],
    icon: "🤟",
    color: "#10b981",
    url: "#",
  },
  {
    id: "recme-platform",
    name: "recMe, STO Network Platform",
    description: "Real-time web platform for PT Telkom Indonesia to visualize and manage 100+ STO network topologies across 10+ cities. Supports drag-and-drop config, live device status, and location-based access control.",
    status: "Live",
    tech: ["Laravel", "MySQL", "GoJS", "PHP", "JavaScript"],
    icon: "🌐",
    color: "#f97316",
    url: "#",
  },
  {
    id: "thesis-painting-classification",
    name: "Japanese vs. Chinese Painting Classifier",
    description: "Thesis project: patch-based classification pipeline to distinguish Japanese traditional paintings (Ukiyo-e, Sumi-e) from Chinese paintings using ResNet50 + SVM hybrid voting. Highlights explainable AI via patch-level analysis.",
    status: "Personal",
    tech: ["Python", "TensorFlow/Keras", "ResNet50", "SVM", "UMAP", "Streamlit"],
    icon: "🎨",
    color: "#ec4899",
    url: "#",
  },
  {
    id: "stock-forecasting",
    name: "Stock Forecasting with GRU Models",
    description: "Analyzed deep learning architectures for forecasting Indonesian tech-sector stock prices (BBCA). Evaluated Bidirectional GRU, Stacked GRU, and custom TF-BIGRU variants, outperforming the baseline GRU on accuracy.",
    status: "Personal",
    tech: ["Python", "TensorFlow/Keras", "GRU/LSTM", "Matplotlib", "Pandas"],
    icon: "📈",
    color: "#eab308",
    url: "#",
  },
  {
    id: "mac-portfolio",
    name: "macOS Desktop Portfolio",
    description: "This interactive macOS-inspired portfolio includes draggable windows, an animated dock, glassmorphism UI, Spotlight search, and a live terminal. It was built to demonstrate frontend craft alongside technical depth.",
    status: "Live",
    tech: ["Next.js 14", "TypeScript", "Framer Motion", "Tailwind CSS"],
    icon: "🖥️",
    color: "#3b82f6",
    url: "#",
  },
  {
    id: "rag-toolkit",
    name: "RAG Research Toolkit",
    description: "Personal research project exploring retrieval-augmented generation architectures, including vector stores, embedding strategies, chunking, reranking, and LLM evaluation using LangSmith and Langfuse.",
    status: "WIP",
    tech: ["Python", "LlamaIndex", "Pinecone", "LangSmith", "Flowise"],
    icon: "🔬",
    color: "#8b5cf6",
    url: "#",
  },
];

export const socialLinks: SocialLink[] = [
  {
    id: "github",
    name: "GitHub",
    handle: "@keysaanadea",
    url: "https://github.com/keysaanadea",
    icon: "github",
    gradient: "from-zinc-700 to-zinc-950",
    description: "Source code, experiments, and personal builds",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    handle: "Keysa Anadea",
    url: "https://www.linkedin.com/in/keysaanadea",
    icon: "linkedin",
    gradient: "from-sky-500 to-blue-800",
    description: "Work history, certifications, and recommendations",
  },
  {
    id: "instagram",
    name: "Instagram",
    handle: "@keysanadea",
    url: "https://www.instagram.com/keysanadea",
    icon: "instagram",
    gradient: "from-fuchsia-500 to-pink-700",
    description: "Personal life and behind-the-scenes",
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    handle: "+62 812-1852-2763",
    url: "https://wa.me/6281218522763",
    icon: "message-circle",
    gradient: "from-green-500 to-emerald-700",
    description: "Fastest way to reach me",
  },
  {
    id: "email",
    name: "Email",
    handle: profile.email,
    url: `mailto:${profile.email}`,
    icon: "mail",
    gradient: "from-emerald-500 to-teal-700",
    description: "Open to opportunities and collaborations",
  },
];

export const song: Song = {
  title: "Midnight City",
  artist: "M83",
  album: "Hurry Up, We're Dreaming",
  coverGradient: "from-slate-950 via-fuchsia-900 to-orange-500",
  duration: 244,
  currentTime: 87,
};

export const musicAlbum: Album = {
  title: "My Playlist",
  artist: "Keysa Anadea",
  year: "2025",
  coverGradient: "from-slate-950 via-fuchsia-900 to-orange-500",
  tracks: [
    { id: "1", title: "I Lived",      duration: 340, audioSrc: "/music/1.mp3" },
    { id: "2", title: "Welcome Home", duration: 287, audioSrc: "/music/2.mp3" },
    { id: "3", title: "Stubborn Love",duration: 279, audioSrc: "/music/3.mp3" },
  ],
};

export const books: Book[] = [
  {
    id: "1",
    title: "Designing Machine Learning Systems",
    author: "Chip Huyen",
    genre: "Machine Learning",
    from: "#6366f1", to: "#4f46e5",
    status: "reading",
    progress: 62,
    year: 2022,
  },
  {
    id: "2",
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Self Development",
    from: "#f97316", to: "#ea580c",
    status: "reading",
    progress: 88,
    year: 2018,
  },
  {
    id: "3",
    title: "Deep Learning",
    author: "Goodfellow, Bengio & Courville",
    genre: "Machine Learning",
    from: "#3b82f6", to: "#1d4ed8",
    status: "want",
    year: 2016,
  },
  {
    id: "4",
    title: "The Pragmatic Programmer",
    author: "Hunt & Thomas",
    genre: "Software Engineering",
    from: "#10b981", to: "#059669",
    status: "want",
    year: 2019,
  },
  {
    id: "5",
    title: "Clean Code",
    author: "Robert C. Martin",
    genre: "Software Engineering",
    from: "#64748b", to: "#334155",
    status: "finished",
    year: 2008,
  },
  {
    id: "6",
    title: "Zero to One",
    author: "Peter Thiel",
    genre: "Entrepreneurship",
    from: "#ec4899", to: "#be185d",
    status: "finished",
    year: 2014,
  },
  {
    id: "7",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    genre: "Psychology",
    from: "#eab308", to: "#a16207",
    status: "finished",
    year: 2011,
  },
];

export const messages: Message[] = [
  { id: "1", text: "Hey, who are you exactly?", isMe: false, time: "10:21" },
  { id: "2", text: "I'm Keysa, an Informatics Engineering graduate from ITS, currently building AI systems at PT Semen Indonesia.", isMe: true, time: "10:21" },
  { id: "3", text: "What kind of AI work?", isMe: false, time: "10:22" },
  { id: "4", text: "I work on end-to-end LLM engineering, including RAG pipelines, tool routing, voice interfaces, and real-time data access for company-wide use.", isMe: true, time: "10:22" },
  { id: "5", text: "And before that?", isMe: false, time: "10:23" },
  { id: "6", text: "I was a fullstack intern at Telkom Indonesia, where I built a real-time monitoring platform across 10+ cities and 100+ network topologies.", isMe: true, time: "10:23" },
  { id: "7", text: "Solid. Any standout achievement?", isMe: false, time: "10:24" },
  { id: "8", text: "I was selected for Bangkit Academy 2024 in the ML path, backed by Google, GoTo, and Traveloka. I also led 80+ members as VP at an ITS engineering association.", isMe: true, time: "10:24" },
];

export const terminalData = {
  help: `available commands

whoami
skills
experience
projects
contact
tech
certs
orgs
awards
clear`,
  whoami: `Name        ${profile.name}
Location    ${profile.location}
Education   ITS, Informatics Engineering, GPA 3.74 / 4.00
Status      ${profile.availability}
Email       ${profile.email}`,
  skills: `AI / LLM
  - RAG pipeline design & optimization
  - LLM integration (LangChain, LlamaIndex)
  - Prompt engineering & tool routing
  - STT/TTS (Whisper, ElevenLabs)

Machine Learning
  - TensorFlow, Keras, Scikit-learn
  - Computer vision, NLP
  - Model deployment & evaluation

Full-Stack
  - Python, FastAPI, Node.js, Laravel
  - React, Next.js, TypeScript
  - MySQL, Supabase, Pinecone`,
  experience: `PT Semen Indonesia (Persero) Tbk        Dec 2025 to Present
  AI Engineering Intern
  → End-to-end LLM chatbot: RAG, tool routing,
    voice I/O (Whisper + ElevenLabs), HC DB integration

Telkom Indonesia, East Java               May to Aug 2024
  Frontend Developer Intern
  → Built recMe, a real-time STO topology platform
    across 10+ cities, 100+ network topologies
  → Drag-and-drop config, live device status,
    location-based access, API integration`,
  projects: projects
    .map((p) => `[${p.status}] ${p.name}\n  ${p.description}`)
    .join("\n\n"),
  contact: `Email       ${profile.email}
LinkedIn    linkedin.com/in/keysaanadea
GitHub      github.com/keysaanadea
Phone       +62 812-1852-2763`,
  tech: `LLM/AI    LangChain, LlamaIndex, RAG, Flowise, n8n
Voice     Whisper (STT), ElevenLabs (TTS)
ML        TensorFlow, Scikit-learn, Keras, Pandas
Backend   Python, FastAPI, Node.js, Laravel, MySQL
Frontend  Next.js, React, TypeScript, Tailwind CSS
Infra     LangSmith, Langfuse, Pinecone, Supabase, Git`,
  orgs: `Student Organizations
  Dec 2023 to Feb 2025  HMTC ITS       Vice Head, General Secretary of External
  Mar to Dec 2023       HMTC ITS       Staff of External Affairs
  Apr to Nov 2023       BEM FTEIC      Staff of Internal Affairs
  Oct 2022 to May 2024  Girl Up ITS    Deputy Director of Fundraising

Event Committees
  Sep 2021 to Jan 2022  MABA CUP ITS    Staff of Fundraising
  Oct 2021 to Feb 2022  INI LHO ITS!    Staff of Fundraising
  Jun to Sep 2022       GERIGI ITS      Treasurer
  Feb to Nov 2022       Schematics ITS  Treasurer
  Sep 2022 to Jan 2023  MABA CUP ITS    Expert Staff of Fundraising
  Feb to Nov 2023       Schematics ITS  Treasurer
  Jul to Sep 2023       GERIGI ITS      Expert Staff of Event
  Aug to Nov 2023       ITS Dies Music  Project Officer`,

  awards: `LKMM-TM ITS 2023   Top 3 Best Participant
  Intermediate Level Student Management Training
  Aug to Sep 2023 · Institut Teknologi Sepuluh Nopember

Bangkit Academy 2024   Capstone Recognition
  Gestura, BISINDO Sign Language App
  Selected & validated by Google, Gojek & Traveloka`,
  certs: `Specializations & Programs
  Bangkit Academy ML Path            Google, GoTo, Traveloka · 2024
  Machine Learning Specialization    DeepLearning.AI / Stanford · 2024
  TensorFlow Developer Certificate   DeepLearning.AI · 2024
  Math for ML & Data Science         DeepLearning.AI · 2024

TensorFlow Series (DeepLearning.AI)
  Intro to TF for AI, ML & DL
  Convolutional Neural Networks in TF
  Natural Language Processing in TF
  Sequences, Time Series & Prediction
  TF: Data & Deployment
  Browser-Based Models with TF.js
  Device-Based Models with TF Lite
  Advanced Deployment Scenarios
  Data Pipelines with TF Data Services
  Structuring Machine Learning Projects

Machine Learning & Data Science
  Advanced Learning Algorithms        DeepLearning.AI
  Supervised ML: Regression & Classif.
  Unsupervised Learning & Recommenders
  Linear Algebra for ML               DeepLearning.AI
  Probability & Stats for ML          DeepLearning.AI
  Calculus for ML & Data Science      DeepLearning.AI

Google / Coursera
  Crash Course on Python
  Introduction to Git & GitHub
  Using Python with the OS
  Analyze Data to Answer Questions
  Process Data from Dirty to Clean
  Foundations: Data, Data, Everywhere`,
};

export const resumeEntries: ResumeEntry[] = [
  {
    id: "general",
    label: "General CV",
    download: "/resume-general.pdf",
    preview: null,
    description: "Full background across AI engineering, full-stack development, and leadership.",
  },
  {
    id: "ai",
    label: "AI / ML CV",
    download: "/resume-ai.pdf",
    preview: null,
    description: "Focused on LLM engineering, RAG, TensorFlow, and ML project work.",
  },
];

export const committeeExperience: CommitteeExp[] = [
  /* ── Student organizations (ongoing roles) ── */
  { id: "hmtc-vice",         role: "Vice Head, General Secretary of External",  event: "HMTC ITS",         type: "vice_head", division: "Himpunan Mahasiswa Teknik Komputer", period: "Dec 2023 to Feb 2025" },
  { id: "hmtc-ext-staff",    role: "Staff of External Affairs",                 event: "HMTC ITS",         type: "staff",     division: "Divisi Luar Negeri",                period: "Mar to Dec 2023"      },
  { id: "bem-int-staff",     role: "Staff of Internal Affairs",                 event: "BEM FTEIC ITS",    type: "staff",     division: "Divisi Dalam Negeri",               period: "Apr to Nov 2023"      },
  { id: "girlup-deputy",     role: "Deputy Director of Fundraising",            event: "Girl Up ITS",      type: "director",  period: "Oct 2022 to May 2024"                                               },

  /* ── Event committees ── */
  { id: "mabacup-staff-2021",  role: "Staff of Fundraising",        event: "MABA CUP ITS",   year: 2021, period: "Sep 2021 to Jan 2022", type: "staff"     },
  { id: "ilits-staff-2022",    role: "Staff of Fundraising",        event: "INI LHO ITS!",   year: 2022, period: "Oct 2021 to Feb 2022", type: "staff"     },
  { id: "gerigi-2022",         role: "Treasurer",                   event: "GERIGI ITS",     year: 2022, period: "Jun to Sep 2022",      type: "treasurer" },
  { id: "schematics-2022",     role: "Treasurer",                   event: "Schematics ITS", year: 2022, period: "Feb to Nov 2022",      type: "treasurer" },
  { id: "mabacup-expert-2022", role: "Expert Staff of Fundraising", event: "MABA CUP ITS",   year: 2022, period: "Sep 2022 to Jan 2023", type: "expert"    },
  { id: "schematics-2023",     role: "Treasurer",                   event: "Schematics ITS", year: 2023, period: "Feb to Nov 2023",      type: "treasurer" },
  { id: "gerigi-expert-2023",  role: "Expert Staff of Event",       event: "GERIGI ITS",     year: 2023, period: "Jul to Sep 2023",      type: "expert"    },
  { id: "itsdm-po-2023",       role: "Project Officer",             event: "ITS Dies Music", year: 2023, period: "Aug to Nov 2023",      type: "po"        },
];

export const dockItems: DockItem[] = [
  { id: "launchpad", label: "Launchpad", icon: "launchpad", color: "#a855f7", imageSrc: "/dock/launchpad.png", action: "tools" },
  { id: "finder",    label: "Finder",    icon: "finder",    color: "#7db8ff", imageSrc: "/dock/finder.png",     action: "finder" },
  { id: "notes",     label: "Notes",     icon: "notes",     color: "#ffd24f", imageSrc: "/dock/notes.png",      action: "notes" },
  { id: "messages",  label: "Messages",  icon: "messages",  color: "#5ed476", imageSrc: "/dock/messages.png",   action: "messages" },
  { id: "photo",     label: "Photos",    icon: "photo",     color: "#ff8b5f", imageSrc: "/dock/photos.png",     action: "photo" },
  { id: "photobooth",label: "Photo Booth",icon:"photobooth",color: "#ff6b9d", imageSrc: "/dock/photobooth.png", action: "photobooth" },
  { id: "music",     label: "Music",     icon: "music",     color: "#ff6b5e", imageSrc: "/dock/music.png",      action: "music" },
  { id: "terminal",  label: "Terminal",  icon: "terminal",  color: "#232323", imageSrc: "/dock/terminal.png",   action: "terminal" },
  { id: "links",     label: "Safari",    icon: "safari",    color: "#53b7ff", imageSrc: "/dock/safari.png",     action: "links" },
  { id: "projects",  label: "Projects",  icon: "projects",  color: "#8b5cf6", imageSrc: "/dock/projects.png",   action: "projects" },
  { id: "resume",    label: "Resume",    icon: "resume",    color: "#3b82f6", imageSrc: "/dock/resume.png",     action: "resume" },
  { id: "books",     label: "Books",     icon: "books",     color: "#f97316", imageSrc: "/dock/books.png",      action: "books" },
  { id: "steam",     label: "Steam",     icon: "steam",     color: "#1b2838", imageSrc: "/dock/steam.png",      action: "steam" },
  { id: "trash",     label: "Trash",     icon: "trash",     color: "#7a7a7a", imageSrc: "/dock/trash.png" },
];

export const desktopIcons: DesktopShortcut[] = [
  { id: "photo",    label: "profile.jpg", icon: "🖼️" },
  { id: "notes",    label: "About.note",  icon: "🗒️" },
  { id: "projects", label: "Projects",    icon: "📁" },
  { id: "resume",   label: "Resume.pdf",  icon: "📄" },
  { id: "links",    label: "Links",       icon: "🔗" },
];

export const topMenuItems = ["File", "Edit", "View", "Go", "Window", "Help"];

export const initialWindowLayout: Record<
  WindowId,
  {
    title: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    minSize: { width: number; height: number };
    isOpen: boolean;
  }
> = {
  finder: {
    title: "Finder",
    position: { x: 140, y: 70 },
    size: { width: 1100, height: 720 },
    minSize: { width: 860, height: 560 },
    isOpen: false,
  },
  photo: {
    title: "Photos",
    position: { x: 54, y: 74 },
    size: { width: 660, height: 460 },
    minSize: { width: 480, height: 360 },
    isOpen: false,
  },
  notes: {
    title: "About Me",
    position: { x: 500, y: 86 },
    size: { width: 434, height: 500 },
    minSize: { width: 360, height: 360 },
    isOpen: false,
  },
  music: {
    title: "Now Playing",
    position: { x: 992, y: 94 },
    size: { width: 332, height: 404 },
    minSize: { width: 320, height: 340 },
    isOpen: false,
  },
  messages: {
    title: "Messages",
    position: { x: 306, y: 412 },
    size: { width: 400, height: 444 },
    minSize: { width: 340, height: 340 },
    isOpen: false,
  },
  terminal: {
    title: "keysa, -zsh, 80x24",
    position: { x: 1172, y: 96 },
    size: { width: 520, height: 336 },
    minSize: { width: 420, height: 260 },
    isOpen: false,
  },
  links: {
    title: "Links",
    position: { x: 44, y: 480 },
    size: { width: 422, height: 516 },
    minSize: { width: 360, height: 360 },
    isOpen: false,
  },
  projects: {
    title: "Projects",
    position: { x: 120, y: 80 },
    size: { width: 980, height: 580 },
    minSize: { width: 680, height: 440 },
    isOpen: false,
  },
  resume: {
    title: "Resume / CV",
    position: { x: 458, y: 532 },
    size: { width: 592, height: 394 },
    minSize: { width: 420, height: 360 },
    isOpen: false,
  },
  tools: {
    title: "Tools & Tech",
    position: { x: 340, y: 90 },
    size: { width: 560, height: 480 },
    minSize: { width: 420, height: 360 },
    isOpen: false,
  },
  books: {
    title: "Books",
    position: { x: 200, y: 100 },
    size: { width: 680, height: 480 },
    minSize: { width: 520, height: 380 },
    isOpen: false,
  },
  photobooth: {
    title: "Photo Booth",
    position: { x: 260, y: 90 },
    size: { width: 680, height: 520 },
    minSize: { width: 520, height: 420 },
    isOpen: false,
  },
  steam: {
    title: "Steam",
    position: { x: 180, y: 60 },
    size: { width: 860, height: 560 },
    minSize: { width: 640, height: 440 },
    isOpen: false,
  },
};
