import { Github, Linkedin, Mail, Twitter, Moon, Sun, FolderKanban, Home, FileText, ArrowLeft, ExternalLink } from "lucide-react";
import Dock from "@/components/Dock";
import Cubes from "@/components/Cubes";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getCurrentTheme, toggleTheme as toggleThemeUtil } from "@/lib/theme";

interface ProjectData {
  id: string;
  title: string;
  fullTitle: string;
  description: string;
  longDescription: string;
  stack: string;
  link: string;
  previewVideo?: string;
  previewImage?: string;
  previewImages?: string[];
  highlights?: string[];
  challenges?: string[];
  results?: string[];
}

const projectsData: ProjectData[] = [
  {
    id: "goosetype",
    title: "goosetype.com — typing arena (5000+ tests)",
    fullTitle: "GooseType — Typing Arena",
    description: "Shipped in 1 week → 500 users in 12 hours. Originally 'Waterloo Type' but after 40 students signed up instantly, Waterloo's security flagged it as phishing and banned it. Rebranded to GooseType, rebuilt in 48h (5000+ tests taken).",
    longDescription: "GooseType is a real-time typing arena where students compete in typing tests. What started as a simple idea to help students practice typing quickly became a viral hit at the University of Waterloo.\n\nOriginally launched as 'Waterloo Type', the platform gained 40 signups within minutes of launch. However, the university's security team flagged it as a potential phishing attempt and blocked access. This forced a complete rebrand and rebuild in just 48 hours.\n\nThe new platform, GooseType, features real-time leaderboards, customizable test durations, and a competitive ranking system. Within 12 hours of relaunch, it had over 500 active users and has since processed over 5,000 typing tests.",
    stack: "react, ts, tailwind, vercel",
    link: "https://goosetype.com",
    previewVideo: "/goosetype-preview.mp4",
    highlights: [
      "500+ users in 12 hours after relaunch",
      "5,000+ typing tests completed",
      "Rebuilt and rebranded in 48 hours after security block",
      "Real-time leaderboard and competitive rankings",
      "Customizable test durations and difficulty levels"
    ],
    challenges: [
      "University security flagged original domain as phishing",
      "Had to rebrand and rebuild entire platform in 48 hours",
      "Managing rapid user growth and server load",
      "Creating engaging competitive mechanics"
    ],
    results: [
      "Successfully relaunched with zero user churn",
      "Maintained 80%+ user retention rate",
      "Built a sustainable community of typists",
      "Proved concept viability despite setbacks"
    ]
  },
  {
    id: "triageo",
    title: "Triageo — AI security incident responder (HTN 2025)",
    fullTitle: "Triageo — AI Security Incident Responder",
    description: "Slack-native AI agent that triages security incidents in under 5 seconds. OWASP severity scoring, RAG over logs, recommended actions with tagged responders. Learns from past incidents to flag similar patterns. HTN 2025 — got kudos from judges.",
    longDescription: "Triageo is a Slack-native AI agent designed to revolutionize security incident response. Built for Hack the North 2025, it uses advanced AI to triage security incidents in under 5 seconds, dramatically reducing response times and improving security posture.\n\nThe system integrates seamlessly with Slack, allowing security teams to receive instant alerts and recommendations. It uses OWASP severity scoring to prioritize incidents, performs RAG (Retrieval-Augmented Generation) over security logs to provide context, and suggests specific actions with tagged responders.\n\nWhat sets Triageo apart is its learning capability—it analyzes past incidents to identify similar patterns, helping teams catch recurring issues before they escalate. The system received kudos from HTN 2025 judges for its practical approach to a real-world problem.",
    stack: "python, fastapi, cohere, slack api",
    link: "https://devpost.com/software/triageo",
    previewImages: ['/triageo-1.jpg', '/triageo-2.jpg'],
    highlights: [
      "5-second incident triage time",
      "OWASP severity scoring integration",
      "RAG over security logs for context",
      "Pattern recognition from past incidents",
      "Slack-native integration for seamless workflow"
    ],
    challenges: [
      "Processing large volumes of security logs in real-time",
      "Accurate severity scoring without false positives",
      "Integrating with Slack's API and webhook system",
      "Training the AI to recognize incident patterns"
    ],
    results: [
      "Received kudos from HTN 2025 judges",
      "Demonstrated practical real-world application",
      "Proved AI can significantly reduce incident response time",
      "Created a scalable architecture for enterprise use"
    ]
  },
  {
    id: "scrollify",
    title: "Scrollify — anti-productivity doomscroll app (GoOnHacks25)",
    fullTitle: "Scrollify — Anti-Productivity Doomscroll App",
    description: "Scrollify — an app that maximizes doomscrolling. If you're off social media for 5+ mins, it triggers a Twilio voice AI agent that calls your dad. Features live leaderboard, browser extension tracking, and iOS app blocking. Won GoOnHacks25 by design.",
    longDescription: "Scrollify is a satirical anti-productivity app that gamifies doomscrolling. The concept is simple yet powerful: if you're off social media for more than 5 minutes, the app triggers a Twilio voice AI agent that calls your dad to check in.\n\nBuilt for GoOnHacks25, Scrollify features a live leaderboard showing who's been scrolling the longest, browser extension tracking for desktop usage, and iOS app blocking capabilities. The app uses humor and social accountability to highlight the absurdity of our relationship with social media.\n\nThe project won GoOnHacks25 by design, impressing judges with its creative approach to addressing digital wellness through satire. It combines multiple technologies—Swift for iOS, Supabase for backend, Twilio for voice AI, and browser extensions—to create a comprehensive tracking and intervention system.",
    stack: "swift, supabase, twilio",
    link: "https://devpost.com/software/scrollify-tp4a2l",
    previewVideo: '/scrollify.mov',
    highlights: [
      "Won GoOnHacks25 by design",
      "Twilio voice AI integration for automated calls",
      "Live leaderboard for competitive doomscrolling",
      "Cross-platform tracking (browser extension + iOS)",
      "Satirical approach to digital wellness"
    ],
    challenges: [
      "Integrating Twilio voice AI with natural conversation flow",
      "Building reliable browser extension tracking",
      "Creating iOS app blocking mechanisms",
      "Designing a compelling user experience despite the satirical nature"
    ],
    results: [
      "Won GoOnHacks25 by design award",
      "Demonstrated creative problem-solving approach",
      "Created engaging social accountability mechanism",
      "Successfully integrated multiple platforms and technologies"
    ]
  }
];

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(getCurrentTheme() === 'dark');
    
    const observer = new MutationObserver(() => {
      setIsDark(getCurrentTheme() === 'dark');
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'muhib-theme') {
        const newTheme = e.newValue as 'light' | 'dark' | null;
        if (newTheme) {
          setIsDark(newTheme === 'dark');
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      observer.disconnect();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = toggleThemeUtil();
    setIsDark(newTheme === 'dark');
  };

  const project = projectsData.find(p => p.id === projectId);

  if (!project) {
    return (
      <div className="min-h-screen relative bg-white text-black dark:bg-black dark:text-white">
        <div className="fixed inset-0 z-0">
          <Cubes />
        </div>
        <div className="fixed inset-0 z-[1] bg-white/60 dark:bg-black/60 backdrop-blur-sm pointer-events-none"></div>
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Project not found</h1>
            <button
              onClick={() => navigate('/projects')}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-80"
            >
              Back to Projects
            </button>
          </div>
        </div>
      </div>
    );
  }

  const dockItems = [
    { 
      icon: <Home size={18} />, 
      label: 'Home', 
      onClick: () => navigate('/'),
    },
    { 
      icon: <FolderKanban size={18} />, 
      label: 'Projects', 
      onClick: () => navigate('/projects'),
    },
    { 
      icon: <Mail size={18} />, 
      label: 'Email', 
      onClick: () => window.open('mailto:m7waqar@uwaterloo.ca', '_blank'),
    },
    { 
      icon: <Linkedin size={18} />, 
      label: 'LinkedIn', 
      onClick: () => window.open('https://linkedin.com/in/muhibwaqar', '_blank'),
      previewVideo: '/linkedin-preview.mp4',
      previewAlt: 'LinkedIn Content'
    },
    { 
      icon: <Github size={18} />, 
      label: 'GitHub', 
      onClick: () => window.open('https://github.com/muhibwqr', '_blank'),
    },
    { 
      icon: <Twitter size={18} />, 
      label: 'Twitter', 
      onClick: () => window.open('https://x.com/muhibwqr', '_blank'),
      previewVideo: '/twitter-preview.mp4',
      previewAlt: 'Twitter Content'
    },
    { 
      icon: <FileText size={18} />, 
      label: 'Resume', 
      onClick: () => navigate('/resume'),
      previewImage: '/hireme.jpeg',
      previewAlt: 'Hire Me'
    },
    { 
      icon: isDark ? <Sun size={18} /> : <Moon size={18} />, 
      label: isDark ? 'Light Mode' : 'Dark Mode', 
      onClick: toggleTheme,
    },
  ];

  return (
    <div className="min-h-screen relative bg-white text-black dark:bg-black dark:text-white">
      <div className="fixed inset-0 z-0">
        <Cubes />
      </div>
      <div className="fixed inset-0 z-[1] bg-white/60 dark:bg-black/60 backdrop-blur-sm pointer-events-none"></div>
      
      <div className="relative z-10 min-h-screen">
        <Dock 
          items={dockItems}
          panelHeight={68}
          baseItemSize={50}
          magnification={70}
        />
        
        <main className="px-4 sm:px-6 py-8 sm:py-12">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => navigate('/projects')}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft size={18} />
              <span>Back to Projects</span>
            </button>

            <div className="space-y-8">
              <div>
                <h1 className="text-4xl font-bold mb-4">{project.fullTitle}</h1>
                <div className="flex items-center gap-4 mb-6">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity"
                  >
                    <ExternalLink size={18} />
                    <span>View Project</span>
                  </a>
                </div>
              </div>

              {project.previewVideo && (
                <div className="rounded-lg overflow-hidden border border-border">
                  <video 
                    src={project.previewVideo} 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="w-full h-auto"
                  />
                </div>
              )}

              {project.previewImages && project.previewImages.length > 0 && (
                <div className="rounded-lg overflow-hidden border border-border">
                  <img 
                    src={project.previewImages[0]} 
                    alt={project.title}
                    className="w-full h-auto"
                  />
                </div>
              )}

              {project.previewImage && (
                <div className="rounded-lg overflow-hidden border border-border">
                  <img 
                    src={project.previewImage} 
                    alt={project.title}
                    className="w-full h-auto"
                  />
                </div>
              )}

              <div className="whitespace-pre-line text-lg leading-relaxed text-foreground">
                {project.longDescription}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Tech Stack</h2>
                  <p className="text-muted-foreground">{project.stack}</p>
                </div>

                {project.highlights && project.highlights.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">Highlights</h2>
                    <ul className="space-y-2">
                      {project.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {project.challenges && project.challenges.length > 0 && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Challenges</h2>
                  <ul className="space-y-2">
                    {project.challenges.map((challenge, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {project.results && project.results.length > 0 && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Results</h2>
                  <ul className="space-y-2">
                    {project.results.map((result, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{result}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

