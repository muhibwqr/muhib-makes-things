import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/use-theme";
import Dock from "@/components/Dock";
import { Home, FolderKanban, Mail, Linkedin, Github, Twitter, FileText, Moon, Sun } from "lucide-react";

export default function Resume() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const dockItems = [
    { 
      icon: <Home size={18} />, 
      label: 'Home', 
      onClick: () => navigate('/'),
      previewImage: '/speedface.webp',
    },
    { 
      icon: <FolderKanban size={18} />, 
      label: 'Projects', 
      onClick: () => navigate('/projects'),
      previewImage: '/hireme.jpeg',
    },
    { 
      icon: <Mail size={18} />, 
      label: 'Email', 
      onClick: () => window.open('mailto:m7waqar@uwaterloo.ca', '_blank'),
      previewImage: '/IMG_1754.JPG',
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
      previewImage: '/hireme.jpeg',
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
      onClick: () => {
        const link = document.createElement('a');
        link.href = '/muhib_waqar_resume_app.pdf';
        link.download = 'muhib_waqar_resume_app.pdf';
        link.click();
      },
      previewImage: '/hireme.jpeg',
      previewAlt: 'Hire Me'
    },
    { 
      icon: isDark ? <Sun size={18} /> : <Moon size={18} />, 
      label: isDark ? 'Light Mode' : 'Dark Mode', 
      onClick: toggleTheme,
      previewImage: '/hireme.jpeg',
    },
  ];

  useEffect(() => {
    document.title = "Resume | Muhib Waqar";
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300 relative overflow-hidden pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-black dark:text-white">Resume</h1>
          <p className="text-muted-foreground">
            Download or share: <span className="font-mono text-sm">muhib-makes-things.com/resume</span>
          </p>
        </div>

        <div className="bg-white dark:bg-black border border-border/50 rounded-lg overflow-hidden shadow-lg">
          <iframe
            src="/muhib_waqar_resume_app.pdf"
            className="w-full h-[calc(100vh-200px)] min-h-[600px]"
            title="Muhib Waqar Resume"
          />
        </div>

        <div className="mt-6 flex gap-4 justify-center">
          <a
            href="/muhib_waqar_resume_app.pdf"
            download="muhib_waqar_resume_app.pdf"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Download PDF
          </a>
          <a
            href="/muhib_waqar_resume_app.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium"
          >
            Open in New Tab
          </a>
        </div>
      </div>

      <Dock items={dockItems} />
    </div>
  );
}

