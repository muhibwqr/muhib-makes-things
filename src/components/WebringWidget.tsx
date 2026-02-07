import { useEffect } from "react";

export default function WebringWidget() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://uwaterloo.network/embed.js";
    script.setAttribute("data-webring", "");
    script.setAttribute("data-user", "muhib-waqar");
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
}
