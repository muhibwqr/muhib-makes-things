import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ProjectsPage from "./pages/Projects";
import UpdatesPage from "./pages/Updates";
import NotFound from "./pages/NotFound";
import FaceNav from "./components/face-nav/FaceNav";

const App = () => {

  return (
    <BrowserRouter>
      {/* Pass debugMode={true} when filming your viral video! */}
      <FaceNav debugMode={false} />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/updates" element={<UpdatesPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
