// hooks/useDevShortcut.js
import { useEffect } from "react";
import { showDevCredit } from "@/utils/creditToast";

const useDevShortcut = () => {
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === "g") {
        e.preventDefault();
        showDevCredit();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, []);
};

export default useDevShortcut;
