import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ProjectsPage from "./pages/Projects";
import ProjectDetailPage from "./pages/ProjectDetail";
import ResumePage from "./pages/Resume";
import NotFound from "./pages/NotFound";
// import FaceNav from "./components/face-nav/FaceNav"; // Temporarily disabled

const App = () => {

  return (
    <BrowserRouter>
      {/* Face navigation temporarily disabled */}
      {/* <FaceNav debugMode={false} /> */}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
        <Route path="/resume" element={<ResumePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
