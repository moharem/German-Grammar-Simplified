import { useEffect, useState } from "react";
import { Brand, Icon } from "./components/Icon";
import { PwaStatus } from "./components/PwaStatus";
import TrialApp from "./TrialApp";

const repoUrl = "https://github.com/moharem/German-Grammar-Simplified";

export default function App() {
  const [trial, setTrial] = useState(() => location.hash === "#trial");
  useEffect(() => {
    const navigate = () => setTrial(location.hash === "#trial");
    window.addEventListener("hashchange", navigate);
    return () => window.removeEventListener("hashchange", navigate);
  }, []);
  useEffect(() => {
    if (!trial) {
      document.documentElement.lang = "en";
      document.documentElement.dir = "ltr";
    }
  }, [trial]);

  return (
    <>
      {trial ? (
        <>
          <aside className="prototype-banner">
            Earlier comparison prototype · foundations are being redesigned.
            <a href="#">Back to GGS</a>
          </aside>
          <TrialApp />
        </>
      ) : (
        <div className="app">
          <header className="site-header ggs-header">
            <Brand />
            <span>German Grammar Simplified</span>
            <a href={repoUrl}>GitHub <Icon name="arrow" size={16} /></a>
          </header>
          <main className="ggs-main">
            <section className="ggs-hero" aria-labelledby="ggs-title">
              <div>
                <span className="eyebrow">FROM THE VERY BEGINNING</span>
                <h1 id="ggs-title">One clear idea.<br /><span>Then the next.</span></h1>
                <p>Understand what changes, what it means, and when to use it.
                  German grammar, explained in plain English at your pace.</p>
                <div className="ggs-badges"><span>Short sessions</span><span>Visual examples</span><span>A1 → C2 direction</span></div>
              </div>
              <div className="ggs-pilot">
                <div className="ggs-pilot-icon"><Icon name="sprout" size={36} /></div>
                <span className="eyebrow">PROPOSED FIRST TOPIC · A1</span>
                <h2>People + <span lang="de">sein</span></h2>
                <p>“I am” and “you are.” Begin with people, a verb, and a simple statement.</p>
                <span className="ggs-stage">In preparation</span>
                <p className="ggs-note">We’ll try one small topic, refine it with learner feedback, then build the next.</p>
              </div>
            </section>
            <section className="ggs-method" aria-labelledby="method-title">
              <h2 id="method-title">A little understanding before every question.</h2>
              <ol>
                <li><span>01</span><h3>Understand</h3><p>Learn one idea with familiar words and a clear explanation.</p></li>
                <li><span>02</span><h3>See it</h3><p>Follow worked examples. Compare forms after learning their foundations.</p></li>
                <li><span>03</span><h3>Try together</h3><p>Use hints and guided practice before an independent attempt.</p></li>
                <li><span>04</span><h3>Return</h3><p>Review what was confusing and revisit it in a fresh example.</p></li>
              </ol>
            </section>
            <section className="ggs-next" aria-labelledby="next-title">
              <div><span className="eyebrow">BUILDING THE FOUNDATIONS</span>
                <h2 id="next-title">The new beginner path is coming.</h2>
                <p>The earlier <span lang="de">werden / würden / worden</span> experiment is saved for reference.
                  The first beginner topic is still being planned.</p>
              </div>
              <a href="#trial">View earlier prototype <Icon name="arrow" size={18} /></a>
            </section>
          </main>
          <footer className="ggs-footer"><span>GGS · Learn at your pace.</span><span>English first · Arabic planned</span></footer>
        </div>
      )}
      <PwaStatus />
    </>
  );
}
