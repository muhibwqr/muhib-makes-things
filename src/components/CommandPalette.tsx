import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CommandDialog,
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  User,
  FolderKanban,
  FileText,
  Moon,
  Sun,
  Sparkles,
} from "lucide-react";
import { getCurrentTheme, toggleTheme as toggleThemeUtil } from "@/lib/theme";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    setIsDark(getCurrentTheme() === 'dark');
    
    const observer = new MutationObserver(() => {
      setIsDark(getCurrentTheme() === 'dark');
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  const navigationItems = [
    {
      id: "about",
      label: "go to about",
      icon: User,
      path: "/",
      description: "who i am, what drives me, where i'm headed",
    },
    {
      id: "projects",
      label: "go to projects",
      icon: FolderKanban,
      path: "/projects",
      description: "my work and side projects",
    },
    {
      id: "resume",
      label: "go to resume",
      icon: FileText,
      path: "/resume",
      description: "download my resume",
    },
  ];

  const projectItems = [
    {
      id: "goosetype",
      label: "view goosetype",
      icon: Sparkles,
      path: "/projects/goosetype",
      description: "typing arena — 5000+ tests",
    },
    {
      id: "triageo",
      label: "view triageo",
      icon: Sparkles,
      path: "/projects/triageo",
      description: "AI security incident responder",
    },
    {
      id: "scrollify",
      label: "view scrollify",
      icon: Sparkles,
      path: "/projects/scrollify",
      description: "anti-productivity doomscroll app",
    },
  ];

  const runCommand = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  const handleThemeToggle = () => {
    const newTheme = toggleThemeUtil();
    setIsDark(newTheme === 'dark');
    setOpen(false);
  };

  // Get current page info for header
  const currentPage = navigationItems.find(item => item.path === location.pathname) || navigationItems[0];
  const CurrentIcon = currentPage.icon;

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      {/* Header Section - Custom styling */}
      <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-800/50">
        <div className="flex items-start gap-3">
          <CurrentIcon className="h-5 w-5 mt-0.5 text-white" strokeWidth={1.5} />
          <div className="flex flex-col">
            <h2 className="text-2xl font-semibold text-white">{currentPage.id}</h2>
            <p className="text-sm text-gray-400 mt-0.5">{currentPage.description}</p>
          </div>
        </div>
      </div>
      
      <Command className="bg-transparent text-white [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-gray-400 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
        <CommandInput placeholder="search for actions..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="navigation">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <CommandItem
                  key={item.id}
                  value={item.label}
                  onSelect={() => runCommand(item.path)}
                  className={`${
                    isActive ? "bg-gray-800" : ""
                  } text-white hover:bg-gray-800`}
                >
                  <Icon className="mr-2 h-4 w-4" strokeWidth={1.5} />
                  <span>{item.label}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
          <CommandGroup heading="projects">
            {projectItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <CommandItem
                  key={item.id}
                  value={item.label}
                  onSelect={() => runCommand(item.path)}
                  className={`${
                    isActive ? "bg-gray-800" : ""
                  } text-white hover:bg-gray-800`}
                >
                  <Icon className="mr-2 h-4 w-4" strokeWidth={1.5} />
                  <span>{item.label}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
          <CommandGroup heading="settings">
            <CommandItem
              value={isDark ? "switch to light mode" : "switch to dark mode"}
              onSelect={handleThemeToggle}
              className="text-white hover:bg-gray-800"
            >
              {isDark ? (
                <Sun className="mr-2 h-4 w-4" strokeWidth={1.5} />
              ) : (
                <Moon className="mr-2 h-4 w-4" strokeWidth={1.5} />
              )}
              <span>{isDark ? "switch to light mode" : "switch to dark mode"}</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}

