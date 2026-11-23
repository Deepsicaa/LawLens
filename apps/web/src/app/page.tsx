"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useState } from "react";
import { ArrowUpRight, Check, Search, BookOpen } from "lucide-react";
import { LogoLockup } from "@/components/ui/logo";
import "./clarity.css";

const Scene = dynamic(() => import("@/components/3d/clarity-scene").then((m) => m.ClarityScene), {
  ssr: false,
  loading: () => <div className="clarity-art" aria-hidden="true" />,
});
const places = [
  {
    name: "India",
    flag: "🇮🇳",
    question: "What makes an agreement a valid contract?",
    source: "Indian Contract Act",
    site: "Section 10 · India Code",
    url: "https://www.indiacode.nic.in/handle/123456789/2187",
    color: "#ffe1cf",
  },
  {
    name: "United Kingdom",
    flag: "🇬🇧",
    question: "Where can I look up my consumer rights?",
    source: "Consumer Rights Act 2015",
    site: "UK Legislation",
    url: "https://www.legislation.gov.uk/ukpga/2015/15/contents",
    color: "#e8e0fa",
  },
  {
    name: "Canada",
    flag: "🇨🇦",
    question: "Where can I read about access to government records?",
    source: "Access to Information Act",
    site: "Justice Laws Website",
    url: "https://laws-lois.justice.gc.ca/eng/acts/a-1/",
    color: "#e2edd8",
  },
  {
    name: "Australia",
    flag: "🇦🇺",
    question: "Which sources cover privacy in Australia?",
    source: "Privacy Act 1988",
    site: "Federal Register of Legislation",
    url: "https://www.legislation.gov.au/C2004A03712/latest/text",
    color: "#fff0bc",
  },
];
const steps = [
  [
    "01 / The question",
    "Start with your real life.",
    "A work question. A rental puzzle. That contract you wish came in plain English.",
  ],
  [
    "02 / The exploration",
    "Follow the paper trail.",
    "We search legal references for your jurisdiction and bring the relevant passages together.",
  ],
  [
    "03 / The clarity",
    "See the bigger picture.",
    "Read the explanation, open the sources, and use the evidence score to guide your next step.",
  ],
];
const faqs = [
  [
    "How can I use LawLens?",
    "LawLens helps you explore legislation and understand legal language. For advice about your own situation, consult a qualified lawyer.",
  ],
  [
    "Where do the sources come from?",
    "The collection draws on legislation from India, the United Kingdom, Canada and Australia. Open the source link beside an answer to read the original document.",
  ],
  [
    "What does the confidence score mean?",
    "It indicates how well the retrieved material supports an answer. Read the cited passages to check the wording, context and scope.",
  ],
];

export default function LandingPage() {
  const [selected, setSelected] = useState(0);
  const place = places[selected]!;
  return (
    <div className="clarity">
      <header className="cl-wrap cl-nav">
        <Link href="/" aria-label="LawLens home">
          <LogoLockup markSize={38} />
        </Link>
        <nav aria-label="Sections">
          <a href="#method">The method</a>
          <a href="#world">The world</a>
          <a href="#good">Good to know</a>
        </nav>
        <Link className="cl-pill" href="/ask">
          Let’s explore <ArrowUpRight size={16} />
        </Link>
      </header>
      <main>
        <section className="cl-wrap cl-hero">
          <div>
            <p className="eyebrow">🟢 A little clarity goes a long way</p>
            <h1>
              Big <br />
              questions.
              <br />A little <br />
              more
              <br />
              <em>clarity.</em>
              <sup>✳</sup>
            </h1>
            <p>
              The law can feel like a world of its own.
              <br />
              Let’s make it a little easier to explore.
            </p>
            <div className="cl-links">
              <Link className="cl-pill" href="/ask">
                Find your answer ↗
              </Link>
              <a href="#method">How it works →</a>
            </div>
            <small>
              §　 Curious minds welcome.
              <br />
              　　 No legal dictionary required.
            </small>
          </div>
          <Scene />
        </section>
        <div className="place-strip">
          <b>One curious mind. Four legal worlds.</b>
          <div>
            {places.map((p) => (
              <span key={p.name}>
                {p.flag}　{p.name}　✧
              </span>
            ))}
          </div>
        </div>
        <section id="method" className="cl-wrap cl-section">
          <p className="eyebrow">Less legal maze. More aha.</p>
          <div className="method-intro">
            <h2>
              From “what if?”
              <br />
              to <em>“oh, I see.”</em>
            </h2>
            <p>A thoughtful path from your everyday question to the sources behind the answer.</p>
          </div>
          <div className="method-cards">
            {steps.map(([label, title, body], i) => (
              <article key={label}>
                <b>{label}</b>
                <div className={"method-art art-" + i} aria-hidden="true">
                  {i === 0 ? (
                    <>
                      <i>?</i>
                      <span>What are my rights?</span>
                    </>
                  ) : i === 1 ? (
                    <>
                      <div className="paper">
                        THE SOURCE
                        <hr />
                        <hr />
                        <hr />
                      </div>
                      <Search size={60} />
                    </>
                  ) : (
                    <>
                      <Check size={78} />
                      <small>Oh, that makes sense.</small>
                    </>
                  )}
                </div>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>
        <section id="world" className="world-band">
          <div className="cl-wrap world-grid">
            <div>
              <p className="eyebrow">Same curiosity. Different context.</p>
              <h2>
                A world of law.
                <br />
                <em>Your point of view.</em>
              </h2>
              <p>
                Every place has its own rules. Pick a jurisdiction to explore, or compare them side
                by side.
              </p>
              <div className="place-tabs" aria-label="Choose a jurisdiction">
                {places.map((p, i) => (
                  <button key={p.name} aria-pressed={selected === i} onClick={() => setSelected(i)}>
                    {p.flag} {p.name}
                  </button>
                ))}
              </div>
              <Link href="/compare">Compare two worlds →</Link>
            </div>
            <article
              className="place-preview"
              style={{ background: place.color }}
              aria-live="polite"
            >
              <b>
                {place.flag} {place.name}
              </b>
              <span className="stamp">
                good
                <br />
                question!
              </span>
              <p className="eyebrow">You, being curious</p>
              <h3>{place.question}</h3>
              <hr />
              <a href={place.url} target="_blank" rel="noreferrer">
                <BookOpen size={20} />
                {place.source} ↗
              </a>
              <small>{place.site}</small>
              <Link href="/ask">Ask your own question →</Link>
            </article>
          </div>
        </section>
        <section id="good" className="cl-wrap cl-section faq-grid">
          <div>
            <p className="eyebrow">A little transparency</p>
            <h2>
              Curiosity,
              <br />
              <em>with care.</em>
            </h2>
            <p>Get to know your research companion.</p>
          </div>
          <div>
            {faqs.map(([q, a], i) => (
              <details key={q} open={i === 0}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="closing">
          <p className="eyebrow">Your next aha moment starts here</p>
          <h2>
            Bring your questions.
            <br />
            Leave with <em>perspective.</em>
          </h2>
          <Link className="cl-pill" href="/ask">
            Let curiosity lead ↗
          </Link>
        </section>
      </main>
      <footer className="cl-wrap cl-nav">
        <LogoLockup />
        <Link href="/history">Research history</Link>
        <Link href="/sign-in">Sign in ↗</Link>
      </footer>
    </div>
  );
}
