import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
  <div className="flex min-h-screen items-center justify-center bg-white dark:bg-[#0f0f0f] relative">
      {/* Black overlay for dark mode */}
      <div className="absolute inset-0 z-[1] hidden dark:block bg-black/60 pointer-events-none"></div>
      
      <div className="relative z-[2] text-center">
        <h1 className="mb-4 text-4xl font-bold text-primary">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">wrong page guys - this don't exist</p>
        <a href="/" className="text-accent underline hover:text-primary transition-colors">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
