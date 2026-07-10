import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { SceneHero } from "@/components/scenes/scene-hero";
import { SceneProblem } from "@/components/scenes/scene-problem";
import { ScenePipeline } from "@/components/scenes/scene-pipeline";
import { SceneVerification } from "@/components/scenes/scene-verification";
import { SceneJurisdictions } from "@/components/scenes/scene-jurisdictions";
import { SceneDemo } from "@/components/scenes/scene-demo";
import { SceneTrust } from "@/components/scenes/scene-trust";
import { SceneCTA } from "@/components/scenes/scene-cta";

export default function LandingPage() {
  return (
    <>
      <Nav />
      <main style={{ position: "relative", zIndex: 2 }}>
        <SceneHero />
        <div style={{ width: "100%", height: 1, background: "linear-gradient(90deg, transparent, rgba(212,175,122,0.1) 50%, transparent)" }} />
        <SceneProblem />
        <div style={{ width: "100%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.04) 50%, transparent)" }} />
        <ScenePipeline />
        <div style={{ width: "100%", height: 1, background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.08) 50%, transparent)" }} />
        <SceneVerification />
        <div style={{ width: "100%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.04) 50%, transparent)" }} />
        <SceneJurisdictions />
        <div style={{ width: "100%", height: 1, background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.08) 50%, transparent)" }} />
        <SceneDemo />
        <div style={{ width: "100%", height: 1, background: "linear-gradient(90deg, transparent, rgba(212,175,122,0.1) 50%, transparent)" }} />
        <SceneTrust />
        <div style={{ width: "100%", height: 1, background: "linear-gradient(90deg, transparent, rgba(212,175,122,0.1) 50%, transparent)" }} />
        <SceneCTA />
      </main>
      <Footer />
    </>
  );
}
