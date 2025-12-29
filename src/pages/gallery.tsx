import { Github, Linkedin, Mail, Twitter, Download, Moon, Sun, FolderKanban, Home, FileText } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import LiquidEther from "@/components/LiquidEther";
import Dock from "@/components/Dock";
import { About } from "@/components/About";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
    const [isDark, setIsDark] = useState(false);
    const navigate = useNavigate();
  
    useEffect(() => {
      const root = window.document.documentElement;
      const body = window.document.body;
      
      if (body.classList.contains("light")) {
        root.classList.remove("dark");
        root.classList.add("light");
        setIsDark(false);
      } else if (body.classList.contains("dark")) {
        root.classList.remove("light");
        root.classList.add("dark");
        setIsDark(true);
      } else if (!root.classList.contains("dark") && !root.classList.contains("light")) {
        root.classList.add("light");
        body.classList.add("light");
        setIsDark(false);
      } else {
        const isDarkMode = root.classList.contains("dark");
        setIsDark(isDarkMode);
      }
    }, []);
  
    const toggleTheme = () => {
      const root = window.document.documentElement;
      const newTheme = isDark ? "light" : "dark";
      root.classList.remove(isDark ? "dark" : "light");
      root.classList.add(newTheme);
      setIsDark(!isDark);
    };