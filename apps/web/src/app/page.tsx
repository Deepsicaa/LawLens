import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen, Layers, History, Scale } from "lucide-react";
import { LogoLockup } from "@/components/ui/logo";

const tools = [
  { href: "/ask", name: "Research a question", detail: "Explore legislation and follow the sources behind an answer.", icon: BookOpen },
  { href: "/compare", name: "Compare laws", detail: "Read how two jurisdictions approach the same question.", icon: Layers },
  { href: "/history", name: "Your reading history", detail: "Return to the questions and citations you’ve collected.", icon: History },
];

export default function LandingPage() {
  return (
    <div className="reading-room">
      <header className="room-nav">
        <Link href="/" aria-label="LawLens home"><LogoLockup markSize={36} /></Link>
        <nav aria-label="Main navigation"><a href="#workspace">Workspace</a><Link href="/compare">Compare laws</Link><Link className="room-login" href="/sign-in">Sign in <ArrowUpRight size={16} /></Link></nav>
      </header>
      <main>
        <section className="room-hero">
          <div className="room-intro">
            <p className="room-kicker"><span /> Legal research studio</p>
            <h1>Read the law<br /><em>with clarity.</em></h1>
            <p className="room-summary">Ask a legal question, compare jurisdictions, and trace each answer back to its sources.</p>
            <Link className="room-action" href="/ask">Open research desk <ArrowRight size={18} /></Link>
          </div>
          <div className="reading-art" aria-hidden="true">
            <div className="library-arch" />
            <div className="book-stack">
              <div className="art-book lilac"><Scale size={32} strokeWidth={1.2} /><span>Law &amp; Society</span></div>
              <div className="art-book sage"><span>Comparative Law</span></div>
              <div className="art-book rose"><span>The Statute Book</span></div>
            </div>
          </div>
        </section>
        <div className="room-regions" aria-label="Supported jurisdictions">{["India","United Kingdom","Canada","Australia"].map(region => <span key={region}>{region}</span>)}</div>
        <section className="room-tools" id="workspace">
          <h2>Your research desk</h2>
          <div>{tools.map(({ href, name, detail, icon: Icon }) => <Link key={href} href={href}><Icon size={24} strokeWidth={1.5} /><h3>{name}</h3><p>{detail}</p><ArrowUpRight className="card-arrow" size={18} /></Link>)}</div>
        </section>
      </main>
      <footer className="room-nav"><LogoLockup /><Link href="/sign-up">Create an account <ArrowUpRight size={15} /></Link></footer>
    </div>
  );
}
