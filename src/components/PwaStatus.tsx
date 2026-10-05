import { useEffect, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

interface InstallPrompt extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PwaStatus() {
  const [install, setInstall] = useState<InstallPrompt | null>(null);
  const [online, setOnline] = useState(navigator.onLine);
  const [error, setError] = useState(false);
  const [offlineDismissed, setOfflineDismissed] = useState(false);
  const {
    offlineReady: [ready, setReady],
    needRefresh: [refresh, setRefresh],
    updateServiceWorker,
  } = useRegisterSW({ onRegisterError: () => setError(true) });

  useEffect(() => {
    const prompt = (event: Event) => {
      event.preventDefault();
      setInstall(event as InstallPrompt);
    };
    const installed = () => setInstall(null);
    const connection = () => {
      setOnline(navigator.onLine);
      setOfflineDismissed(false);
    };
    window.addEventListener("beforeinstallprompt", prompt);
    window.addEventListener("appinstalled", installed);
    window.addEventListener("online", connection);
    window.addEventListener("offline", connection);
    return () => {
      window.removeEventListener("beforeinstallprompt", prompt);
      window.removeEventListener("appinstalled", installed);
      window.removeEventListener("online", connection);
      window.removeEventListener("offline", connection);
    };
  }, []);

  if (!install && !ready && !refresh && online && !error) return null;
  if (!online && offlineDismissed && !refresh && !install && !error) return null;
  return (
    <aside className="pwa-status" aria-label="App availability">
      <p role="status">{error ? "Offline setup is unavailable. You can continue online."
        : refresh ? "A new version of GGS is ready. Update when you’ve finished your current step."
        : !online ? "You’re offline. Previously downloaded content is available."
        : ready ? "GGS is ready to use offline."
        : "Keep GGS handy: install it as an app."}</p>
      <div>
        {refresh && <button onClick={() => void updateServiceWorker(true)}>Update</button>}
        {install && <button onClick={async () => {
          const prompt = install;
          setInstall(null);
          await prompt.prompt();
          await prompt.userChoice;
        }}>Install GGS</button>}
        <button className="pwa-dismiss" onClick={() => {
          setReady(false); setRefresh(false); setError(false); setInstall(null);
          setOfflineDismissed(true);
        }}>Dismiss</button>
      </div>
    </aside>
  );
}
