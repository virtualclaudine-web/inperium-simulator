import { useState, useRef, useEffect } from "react";

const FIELD_GUIDE_SYSTEM_PROMPT = `You are an AI-powered practice simulator built on the Inperium Communications Field Guide. You have deep expertise in all of Inperium's messaging, frameworks, language, and communication strategy.

=== INPERIUM COMMUNICATIONS FIELD GUIDE ===

SECTION 1 — THE CREDIBILITY STACK
Proof before explanation. Always. The Credibility Stack is a five-level sequence. When people believe you before they understand you, understanding comes easily. When they understand you before they believe you, belief never arrives.

1. LEGAL VALIDATION: "Inperium operates under a 509(a)(3) IRS classification and Attorney General oversight that make self-dealing legally impossible. Not a promise from management. A federal and state requirement."
2. MARKET VALIDATION: "In 2024, $1.9 billion in bond orders for $175 million offered. Eleven times oversubscribed. BlackRock, Vanguard, Fidelity spent months in due diligence with their own capital at risk." Let the number breathe. Silence is where conviction forms.
3. PEER VALIDATION: A real story from an affiliate leader who faced the same questions. Lead with the people served, then explain what made it possible.
4. FAMILIAR ANALOGY: For financial audiences: "Independent operating companies with centralized infrastructure and local autonomy." For mission audiences: "The machinery behind the mission becomes enterprise grade."
5. CAPABILITIES: What Inperium actually does. This is where most people start. That is why it is listed last.
Rule: You will be tempted to skip levels. Resist.

SECTION 2 — THREE ALTITUDES

30 SECONDS: "Inperium is a nonprofit platform that helps human services organizations grow stronger without giving up who they are. It provides the financial infrastructure, back-office support, and capital access that most nonprofits cannot build on their own, while every organization keeps its name, its board, its leadership, and its mission. Think of it as the strength of a national system with the soul of a local organization."

Alternate formulations:
- FINANCIAL AUDIENCE: "Inperium is a supporting organization under the IRS code that provides shared financial and administrative infrastructure to independent nonprofits. Affiliates keep operational autonomy. They gain the capital structure and back-office scale they could never build alone."
- MISSION-FOCUSED: "Inperium helps nonprofit leaders spend their time on their mission instead of on spreadsheets and audits. Every organization that joins keeps its identity and its independence."
- PEER CEO: "Imagine having access to the financial backing and infrastructure of a billion-dollar system, but you still run your own organization, keep your own board, and make your own decisions."
- GENERAL/BOARD: "This model helps good organizations become stronger organizations without asking them to become different organizations."

3 MINUTES — Five beats: Context, Problem, Model, Proof, Invitation:
- CONTEXT: "There are thousands of nonprofit human services organizations across the country doing extraordinary work. Most of them are small to mid-sized. They serve their communities, they are deeply trusted locally, and they are perpetually underfunded."
- PROBLEM: "The challenge is structural. These organizations need capital to grow, but they cannot access capital markets the way a for-profit can. They need sophisticated back-office infrastructure, but they cannot afford to build it. And their CEOs end up spending sixty or seventy percent of their time on financial management instead of on the mission that brought them to the work in the first place."
- MODEL: "Inperium solves this by creating a constellation of affiliated organizations. Each one keeps its name, its board, its CEO, its mission, and its community identity. What Inperium provides is the financial infrastructure underneath: access to tax-exempt capital markets, shared back-office services, centralized compliance, and the purchasing power that comes from being part of a larger system. The organizations stay independent. The infrastructure is shared."
- PROOF: "This is not theoretical. Inperium recently went to the bond market and received $1.9 billion in orders, which means the most sophisticated institutional investors in the world examined this model and committed eleven times what was asked for. BlackRock, Vanguard, and Fidelity are among them."
- INVITATION: "If any of this resonates, I would be happy to go deeper. But the short version is that this model helps good organizations become stronger organizations without asking them to become different organizations."

SECTION 3 — WORDS THAT WORK AND DON'T
STOP SAYING → START SAYING:
- Control → Governance standards
- Takeover/Acquisition/Buyout → Affiliation/Partnership
- Consolidator → Supporting organization
- Parent company → Constellation
- Target → Prospective affiliate
- Portfolio → Community of organizations
- Synergies → Shared capabilities
- Restructuring → Mission amplification
- Exit strategy → Long-term commitment
- "Because bondholders require it" → "Standards that unlock capital access"
- "We provide / We give you" → "You gain access to"
- Rightsizing → Aligning resources to mission

CONTEXT-DEPENDENT: Consolidation (yes with financial analysts, no with nonprofit CEOs). Scale (yes with operations people, no with community leaders until trust is built). Due diligence (yes with lawyers, no with nonprofit boards — say "mutual exploration"). Sole member (legal/governance contexts only).

TWO HABITS THAT CHANGE OUTCOMES:
1. Human Voice Principle: Before every answer, ask: Is there a person in this sentence?
2. Stat-Then-Meaning Rule: Every number needs a second sentence. "$1.9 billion in bond orders" is a statistic. "The most sophisticated investors in the world spent months examining this model and wanted to buy eleven times more than what we had to offer" is a verdict.

SECTION 4 — THE TRUST EQUATION
Trust = (Credibility + Consistency + Intimacy) / Self-Orientation
- CREDIBILITY: Evidence, not explanation. IRS classification. Bond market. Track record.
- CONSISTENCY: Same architecture, same proof points, same sequence. Your voice.
- INTIMACY: Ask about their world first. The strongest closers spend the first minutes learning.
- SELF-ORIENTATION (denominator): Open with what you do = pitch. Open with proof = safety.

THE BENEFIT BRIDGE (when asked "What do we keep?"):
1. IMPACT FIRST: "Families continue to receive the same services from the same people in the same community."
2. ADVANTAGE SECOND: "Your board and CEO stay in place. What they gain is infrastructure, capital access, and operational support."
3. MECHANICS THIRD: "Your name, mission, CEO, and programs continue as is, subject to Attorney General oversight and IRS regulations."

SECTION 5 — COMMUNICATION LANES
- GREEN (Full Spectrum): Any question, any depth. ~10-15 people in constellation.
- YELLOW (Experience Voice): Your lived affiliate experience or trained depth.
- RED (Connector): The 30-second version. Introductions and rapport only.
- BACKSTAGE (Operations): Internal functions, not prospect-facing.

SECTION 6 — THREE STORIES
Story 1 (Jay/Edison Court) — for "too good to be true" or CEO fears: Jay ran Edison Court serving children with serious behavioral health needs. After years of failed merger talks, Jay affiliated with Inperium in 2017. He kept his name, board, CEO role. Revenue grew 26% in year one.

Story 2 (RHD Pipeline) — for crisis/"what happens to the people we serve?": RHD faced $21M in cumulative losses over 36 months. Affiliation saved it. Within twelve months, the organization moved to surplus. New transitional housing opened. The pipeline from person in need to person who serves is intact.

Story 3 (Attain/Florida) — for stable organizations: Attain had served adults with developmental disabilities for 40 years. CEO asked: "How do we get to eighty?" Reframed affiliation from rescue to generational planning. Chose Inperium because the commitment is perpetual.

Story usage: 60-90 seconds. Lead with people served. Never sanitize the difficulty.

SECTION 7 — SITUATION SUMMARIES
- Introducing to prospective affiliate: Lead with what stays the same. Avoid opening with what is broken.
- When donors ask: Proactive outreach. "We affiliated with Inperium. Your gift still goes where you intended."
- Staff anxiety: Name the fears first. Be specific about what stays and what changes.
- Responding to skeptics: Lead with what the skeptic already trusts.
- Board in crisis: "What you have been doing, keeping this organization alive under these conditions, took real courage."
- Affiliate-to-affiliate: Lead with your own experience. "I was skeptical. Here is what concerned me."
- After close: Proactive first week. Four sentences: name stays, leadership stays, programs continue, stronger infrastructure.

SECTION 8 — TOP OBJECTIONS
- "We will lose our independence": "You keep your name, board, CEO, programs. The IRS requires it."
- "This is private equity": "Private equity has owners. Inperium does not. Private equity extracts profit. The IRS prohibits stripping assets for personal benefit. Private equity has an exit strategy. Inperium's commitment is perpetual."
- "Too good to be true": "That is what the tax-exempt bond market thought. Then they did months of due diligence."
- "My board will not give up control": "Your board does not give up control. Protective powers over your name, CEO, mission are contractually protected."
- "What happens to our CEO?": "Your CEO stays. CEO selection is a protected power."
- "What if Inperium fails?": "Your organization remains a separate 501(c)(3)."
- "We are not in crisis. Why now?": "Organizations that affiliate from strength get the most from it."
- "Our donors will not understand": "In every affiliation, donor relationships have been preserved."
- "We tried a merger before": "This is not a merger. In a merger, one organization disappears. In affiliation, both continue."
- "We are too small": "Smaller affiliates often benefit most because the gap is largest."

TEN MISTAKES THAT COST TRUST:
1. Using takeover language (control, acquisition, portfolio)
2. Leading with what Inperium does before why it exists
3. Explaining the model before the legal mandate
4. Leading with what changes rather than what stays
5. Burying the bond story
6. Data without meaning (no second sentence)
7. Telling staff "nothing will change"
8. Filling silence with unnecessary qualification
9. Assuming the narrative vacuum won't fill itself
10. Underestimating the private equity perception

SECTION 9 — PRACTICE EXERCISES
1. Altitude Drill: All three altitudes in response to "What does your organization do?"
2. Objection Response: Partner gives objection, respond without looking, then debrief
3. Story Drop: Given a situation, tell the right story in under 90 seconds
4. Elevation Moment: Practice recognizing when to hand off
5. Silence Drill: Make a strong statement and say nothing for 10 seconds

=== END OF FIELD GUIDE ===`;

const PRACTICE_SYSTEM = FIELD_GUIDE_SYSTEM_PROMPT + `

=== YOUR ROLE: PRACTICE SIMULATOR ===
You are playing a realistic conversation partner for the scenario described. Stay in character throughout.

After each USER response, do TWO things:
1. Stay in character and respond as the persona would
2. Add a feedback block in this EXACT format on a new line:

---FEEDBACK---
ASPIRATION_CLARITY:[0-2]
CONSTRAINT_DISCOVERY:[0-2]
DECISION_FRAMING:[0-2]
SIMPLICITY_CONFIDENCE:[0-2]
COACH_NOTE:[one specific actionable sentence]
---END_FEEDBACK---

Scoring:
- ASPIRATION_CLARITY (0-2): Did they lead with what the listener cares about? 2=excellent, 1=partial, 0=missing
- CONSTRAINT_DISCOVERY (0-2): Did they acknowledge the fear before answering? 2=excellent, 1=partial, 0=missing
- DECISION_FRAMING (0-2): Did they use proof-first sequencing (legal/market/peer before explanation)? 2=excellent, 1=partial, 0=missing
- SIMPLICITY_CONFIDENCE (0-2): Clean, human, jargon-free, confident? 2=excellent, 1=partial, 0=missing
- COACH_NOTE: One sentence. Specific. Tied to the Field Guide.

Always include the feedback block. Never skip it.`;

const REFERENCE_SYSTEM = FIELD_GUIDE_SYSTEM_PROMPT + `

=== YOUR ROLE: REFERENCE ASSISTANT ===
Answer questions about the Inperium Communications Field Guide accurately and concisely, always citing the relevant section. Give exact language from the guide when appropriate. Be direct and practical.`;

const SCENARIOS = [
  { id: "skeptical-ceo", label: "Skeptical CEO", section: "Responding to the Skeptic", difficulty: "Hard", description: "A well-run nonprofit CEO who has heard merger pitches before and is immediately defensive.", persona: "You are Marcus, a 58-year-old CEO of a mid-sized human services nonprofit in Ohio. You've run this organization for 22 years. You built it from scratch. You've heard 'partnership' pitches before — they always end with someone losing control. You're polite but deeply skeptical. You ask hard questions.", opener: "I appreciate you making time. I'll be honest — I've been through two merger conversations in the past decade and both times it was a disaster. What makes this any different?" },
  { id: "board-crisis", label: "Board in Crisis", section: "The Board in Crisis", difficulty: "Hard", description: "A board chair whose organization is facing serious financial strain after years of incremental losses.", persona: "You are Patricia, board chair of a nonprofit running deficits for three years. Now $4M in accumulated losses. You feel responsible. You're exhausted but protective of the organization's legacy.", opener: "We've been fighting this for three years. Every year we thought it would turn around. Now our auditors are flagging going-concern issues. I need to know — is this actually a solution, or just another conversation that goes nowhere?" },
  { id: "private-equity", label: "Private Equity Objection", section: "Top Objections", difficulty: "Medium", description: "A board member with a finance background who keeps calling this a private equity rollup.", persona: "You are David, a board member with 20 years in private equity. You're analytical. You see the pattern: aggregation, shared services, scale. You need to be convinced with hard structural facts, not mission language.", opener: "I've done this for twenty years. The structure you're describing — aggregating nonprofits, centralizing back-office, bond financing — that's a PE rollup. The nonprofit wrapper doesn't change the underlying model. Why should I think about this differently?" },
  { id: "donor", label: "Concerned Major Donor", section: "When Your Donors Ask", difficulty: "Medium", description: "A long-time major donor who heard about the affiliation through the grapevine and is worried.", persona: "You are Helen, a donor who has given $50,000/year for eight years. You heard about the affiliation from a friend, not from the organization. You feel blindsided. You care deeply about the mission.", opener: "I heard from Janet at the gala that you're now part of some national organization. I have to say — I'm hurt that I had to hear this from someone else. Can you tell me what's actually happening here?" },
  { id: "staff-anxiety", label: "Staff Anxiety", section: "Addressing Staff Anxiety", difficulty: "Medium", description: "A long-tenured employee scared about what affiliation means for their job and the organization's culture.", persona: "You are Diane, a program director who has worked here for 14 years. You heard 'affiliation' and immediately worried about layoffs, culture being destroyed, and corporate bureaucracy.", opener: "I just want to be honest with you. People are scared. The word going around is that we're being 'acquired.' Are we going to lose jobs? Is everything we've built here going to change?" },
  { id: "stable-org", label: "Stable Organization CEO", section: "Situation Summaries", difficulty: "Easy", description: "A CEO of a well-run organization who doesn't see why they would change anything.", persona: "You are Robert, CEO of a stable nonprofit with surpluses for four consecutive years. You have no urgent problem. You're professionally curious but genuinely puzzled.", opener: "I appreciate the meeting. I have to say — we're in good shape. Financially stable, good reputation, strong board. I'm not sure what problem you're solving for us." },
  { id: "altitude-drill", label: "Altitude Drill", section: "Practice Exercises", difficulty: "Easy", description: "Practice all three altitudes (30 sec, 3 min, 10 min) back to back.", persona: "You are a neutral practice partner running the Altitude Drill from Section 9. After each altitude, give brief real-time feedback: right length? correct structure? language issues? Then move to the next.", opener: "Let's run the Altitude Drill. I'll play a curious stranger at a conference. Start with your 30-second answer to: 'So what does Inperium do?'" },
  { id: "objection-rapid", label: "Rapid Objection Fire", section: "Top Objections", difficulty: "Hard", description: "Rapid-fire objection practice — 5 objections in a row, no looking at notes.", persona: "You are a practice partner running rapid-fire objection drills from Section 8. Fire one objection at a time. After each response give a 1-2 sentence judgment, then fire the next.", opener: "Rapid fire — 5 objections, no notes. Ready? First one: 'This sounds like private equity with a nonprofit wrapper.'" }
];

function parseFeedback(text) {
  const m = text.match(/---FEEDBACK---([\s\S]*?)---END_FEEDBACK---/);
  if (!m) return null;
  const b = m[1];
  const get = (k) => { const r = b.match(new RegExp(k + ":(.*?)(?:\\n|$)")); return r ? r[1].trim() : null; };
  return {
    aspiration: parseInt(get("ASPIRATION_CLARITY")) || 0,
    constraint: parseInt(get("CONSTRAINT_DISCOVERY")) || 0,
    decision: parseInt(get("DECISION_FRAMING")) || 0,
    simplicity: parseInt(get("SIMPLICITY_CONFIDENCE")) || 0,
    note: get("COACH_NOTE") || "",
  };
}

function stripFeedback(text) {
  return text.replace(/---FEEDBACK---[\s\S]*?---END_FEEDBACK---/, "").trim();
}

const C = {
  navy: "#0D2240", navyLight: "#1a3a5c", gold: "#A8721A", goldLight: "#C8922A",
  sage: "#4a7060", white: "#ffffff", text: "#0D2240", muted: "#5a6e85",
  border: "rgba(13,34,64,0.1)", borderStrong: "rgba(13,34,64,0.2)", surface: "#f5f7fa",
};
const DIFF = {
  Easy: { bg: "rgba(29,158,117,0.08)", text: "#0e7a5a" },
  Medium: { bg: "rgba(168,114,26,0.1)", text: "#8a5a0a" },
  Hard: { bg: "rgba(160,40,40,0.08)", text: "#a02020" },
};

function ScoreRow({ label, score }) {
  const color = score === 2 ? C.navy : score === 1 ? C.goldLight : "#cc4444";
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 13, color: C.text, fontFamily: "Georgia,serif" }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: "bold", color: score < 2 ? C.goldLight : C.navy, fontFamily: "Georgia,serif" }}>{score} / 2</span>
      </div>
      <div style={{ height: 3, background: "rgba(13,34,64,0.08)", borderRadius: 2 }}>
        <div style={{ height: "100%", width: (score / 2 * 100) + "%", background: color, borderRadius: 2, transition: "width 0.4s ease" }} />
      </div>
    </div>
  );
}

function Sidebar({ feedback, count }) {
  if (!feedback) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: C.muted, textAlign: "center", padding: "2rem 1.5rem" }}>
      <div style={{ fontSize: 32, opacity: 0.2, marginBottom: 12 }}>◎</div>
      <div style={{ fontSize: 13, fontFamily: "Georgia,serif", lineHeight: 1.7 }}>Feedback appears<br />after your first response.</div>
    </div>
  );
  const total = feedback.aspiration + feedback.constraint + feedback.decision + feedback.simplicity;
  return (
    <div style={{ padding: "1.25rem 1.5rem", overflowY: "auto", height: "100%" }}>
      <div style={{ background: C.sage, padding: "0.6rem 0.9rem", borderRadius: 4, marginBottom: "1.25rem" }}>
        <div style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.65)", marginBottom: 1, fontFamily: "Georgia,serif" }}>Real-Time Feedback</div>
        <div style={{ fontSize: 12, color: "white", fontFamily: "Georgia,serif" }}>Exchange {count}</div>
      </div>
      <ScoreRow label="Aspiration Clarity" score={feedback.aspiration} />
      <ScoreRow label="Constraint Discovery" score={feedback.constraint} />
      <ScoreRow label="Decision Framing" score={feedback.decision} />
      <ScoreRow label="Simplicity & Confidence" score={feedback.simplicity} />
      <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: "1rem", marginTop: "0.5rem" }}>
        <div style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: C.gold, marginBottom: 8, fontFamily: "Georgia,serif" }}>Coach Note</div>
        <div style={{ fontSize: 13, color: C.text, fontFamily: "Georgia,serif", fontStyle: "italic", lineHeight: 1.7 }}>{feedback.note}</div>
      </div>
      <div style={{ marginTop: "1rem", padding: "0.6rem 0.9rem", background: C.surface, borderRadius: 4, display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, color: C.muted, fontFamily: "Georgia,serif" }}>Session score</span>
        <span style={{ fontSize: 14, fontWeight: "bold", color: C.navy, fontFamily: "Georgia,serif" }}>{total} / 8</span>
      </div>
    </div>
  );
}

export default function App() {
  const [mode, setMode] = useState("home");
  const [scenario, setScenario] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [count, setCount] = useState(0);
  const endRef = useRef(null);
  const taRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  useEffect(() => {
    if (taRef.current) { taRef.current.style.height = "auto"; taRef.current.style.height = Math.min(taRef.current.scrollHeight, 140) + "px"; }
  }, [input]);

  const callAPI = async (msgs, sys) => {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": import.meta.env.VITE_ANTHROPIC_KEY, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
      body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, system: sys, messages: msgs }),
    });
    return r.json();
  };

  const startPractice = (sc) => { setScenario(sc); setMessages([{ role: "assistant", content: sc.opener }]); setFeedback(null); setCount(0); setMode("practice"); };
  const startRef2 = () => { setMessages([{ role: "assistant", content: "Ask me anything about the Inperium Communications Field Guide — objection responses, altitude for a situation, which story to use, language to avoid." }]); setMode("reference"); };
  const reset = () => { setMode("home"); setMessages([]); setScenario(null); setFeedback(null); setCount(0); setInput(""); };

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input.trim() };
    const apiMsgs = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));
    setMessages(p => [...p, userMsg]);
    setInput("");
    setLoading(true);
    const sys = mode === "reference" ? REFERENCE_SYSTEM : PRACTICE_SYSTEM + `\n\nSCENARIO: ${scenario.label}\nPERSONA: ${scenario.persona}`;
    try {
      const data = await callAPI(apiMsgs, sys);
      const raw = data.content?.[0]?.text || "Sorry, no response.";
      const fb = mode === "practice" ? parseFeedback(raw) : null;
      const clean = mode === "practice" ? stripFeedback(raw) : raw;
      if (fb) { setFeedback(fb); setCount(c => c + 1); }
      setMessages(p => [...p, { role: "assistant", content: clean }]);
    } catch { setMessages(p => [...p, { role: "assistant", content: "Connection error. Please try again." }]); }
    setLoading(false);
  };

  const onKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } };

  const navBtn = { background: "transparent", border: `1px solid ${C.borderStrong}`, color: C.muted, padding: "5px 14px", borderRadius: 4, cursor: "pointer", fontSize: 11, fontFamily: "Georgia,serif" };
  const actionBtn = { background: "transparent", border: `1px solid ${C.border}`, color: C.muted, padding: "4px 12px", borderRadius: 4, cursor: "pointer", fontSize: 10, fontFamily: "Georgia,serif", letterSpacing: "0.06em", textTransform: "uppercase" };

  return (
    <div style={{ minHeight: "100vh", background: C.white, color: C.text, fontFamily: "Georgia,'Times New Roman',serif", display: "flex", flexDirection: "column" }}>
      <style>{`@keyframes pulse{0%,100%{opacity:0.3}50%{opacity:1}} *{box-sizing:border-box;margin:0;padding:0} ::-webkit-scrollbar{width:3px} ::-webkit-scrollbar-thumb{background:rgba(13,34,64,0.15);border-radius:2px}`}</style>

      {/* Header */}
      <div style={{ borderBottom: `1px solid ${C.border}`, padding: "0 2rem", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontSize: 12, fontWeight: "bold", letterSpacing: "0.14em", textTransform: "uppercase" }}>
            <span style={{ color: C.gold }}>INPERIUM</span> · PRACTICE SIMULATOR
          </div>
          {mode !== "home" && <span style={{ fontSize: 12, color: C.muted }}>› {mode === "reference" ? "Reference Mode" : scenario?.label}</span>}
        </div>
        {mode !== "home" && <button style={navBtn} onClick={reset}>← Back</button>}
      </div>

      {/* Home */}
      {mode === "home" && (
        <div style={{ flex: 1, padding: "3rem 2rem", maxWidth: 920, margin: "0 auto", width: "100%" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.gold, marginBottom: 12 }}>Communications Field Guide</div>
          <h1 style={{ fontSize: 36, fontWeight: "normal", lineHeight: 1.2, color: C.navy, marginBottom: 14 }}>The practice simulator.<br />Real conversations. Real feedback.</h1>
          <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.7, maxWidth: 560, marginBottom: "2rem" }}>Sharpen your Inperium messaging in a safe environment. Practice objection responses, run altitude drills, and work through difficult scenarios — with scored feedback on every response.</p>

          <div style={{ display: "flex", gap: 14, marginBottom: "2.5rem" }}>
            <div style={{ flex: 1, border: `1.5px solid ${C.gold}`, borderRadius: 6, padding: "1.1rem 1.4rem", background: "rgba(168,114,26,0.03)" }}>
              <div style={{ fontSize: 14, color: C.navy, marginBottom: 5 }}>Practice Mode</div>
              <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>Roleplay real scenarios with realistic conversation partners. Get scored feedback on every response — Aspiration Clarity, Constraint Discovery, Decision Framing, Simplicity.</div>
            </div>
            <div style={{ flex: 1, border: `1px solid ${C.border}`, borderRadius: 6, padding: "1.1rem 1.4rem", cursor: "pointer" }} onClick={startRef2}>
              <div style={{ fontSize: 14, color: C.navy, marginBottom: 5 }}>Reference Mode</div>
              <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>Ask any question about the Field Guide. Get precise answers with section citations. Quick lookup for objections, stories, and exact language.</div>
            </div>
          </div>

          <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: C.muted, marginBottom: 14 }}>Practice Scenarios — Choose one to begin</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 10, marginBottom: 32 }}>
            {SCENARIOS.map(sc => (
              <div key={sc.id} style={{ border: `1px solid ${C.border}`, borderRadius: 6, padding: "1rem 1.1rem", cursor: "pointer", transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.goldLight; e.currentTarget.style.background = "rgba(168,114,26,0.02)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = ""; }}
                onClick={() => startPractice(sc)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <div style={{ fontSize: 13, color: C.navy }}>{sc.label}</div>
                  <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: DIFF[sc.difficulty].bg, color: DIFF[sc.difficulty].text, marginLeft: 8, flexShrink: 0 }}>{sc.difficulty}</span>
                </div>
                <div style={{ fontSize: 11, color: C.gold, marginBottom: 5 }}>{sc.section}</div>
                <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>{sc.description}</div>
              </div>
            ))}
          </div>

          <div style={{ padding: "1.1rem 1.4rem", border: `1px solid ${C.border}`, borderRadius: 6 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: C.gold, marginBottom: 6 }}>Reference Mode</div>
            <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, marginBottom: 12 }}>Quick answers from the Field Guide — exact language, objection responses, which story fits which situation.</div>
            <button style={{ background: "transparent", color: C.gold, border: `1px solid ${C.gold}`, padding: "7px 18px", borderRadius: 4, cursor: "pointer", fontSize: 13, fontFamily: "Georgia,serif" }} onClick={startRef2}>Open Reference →</button>
          </div>
        </div>
      )}

      {/* Chat */}
      {(mode === "practice" || mode === "reference") && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "1.25rem 2rem 1rem", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
            <div style={{ fontSize: 17, color: C.navy, marginBottom: 3, fontWeight: "normal" }}>{mode === "reference" ? "Field Guide Reference" : scenario?.label}</div>
            <div style={{ fontSize: 12, color: C.muted }}>{mode === "reference" ? "Ask anything about the Communications Field Guide" : `${scenario?.section} · ${scenario?.difficulty}`}</div>
          </div>
          <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
            {/* Messages */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem 2rem 1rem" }}>
                {messages.map((m, i) => (
                  <div key={i}>
                    <div style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: m.role === "user" ? C.gold : C.muted, marginBottom: 4, textAlign: m.role === "user" ? "right" : "left" }}>
                      {m.role === "user" ? "You" : mode === "reference" ? "Field Guide" : scenario?.label}
                    </div>
                    <div style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: "1.25rem" }}>
                      <div style={{ maxWidth: "78%", padding: "0.85rem 1rem", borderRadius: m.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px", background: m.role === "user" ? C.navy : "#f5f7fa", border: m.role === "user" ? "none" : `1px solid ${C.border}`, fontSize: 14, lineHeight: 1.7, color: m.role === "user" ? C.white : C.text, whiteSpace: "pre-wrap" }}>
                        {m.content}
                      </div>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div>
                    <div style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: C.muted, marginBottom: 4 }}>{mode === "reference" ? "Field Guide" : scenario?.label}</div>
                    <div style={{ display: "flex", marginBottom: "1.25rem" }}>
                      <div style={{ padding: "0.85rem 1.1rem", borderRadius: "12px 12px 12px 2px", background: "#f5f7fa", border: `1px solid ${C.border}` }}>
                        {[0, 0.2, 0.4].map((d, i) => <span key={i} style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: C.muted, animation: "pulse 1.2s ease-in-out infinite", margin: "0 2px", animationDelay: d + "s" }} />)}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={endRef} />
              </div>
              <div style={{ borderTop: `1px solid ${C.border}`, padding: "0.9rem 2rem 1.25rem", flexShrink: 0 }}>
                {mode === "practice" && (
                  <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                    <button style={actionBtn} onClick={() => { setMessages([{ role: "assistant", content: scenario.opener }]); setFeedback(null); setCount(0); }}>Restart</button>
                    <button style={actionBtn} onClick={reset}>New scenario</button>
                  </div>
                )}
                <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                  <textarea ref={taRef} style={{ flex: 1, background: "#f5f7fa", border: `1px solid ${C.borderStrong}`, borderRadius: 6, color: C.text, padding: "10px 14px", fontSize: 14, fontFamily: "Georgia,serif", resize: "none", lineHeight: 1.6, outline: "none", minHeight: 44 }}
                    value={input} onChange={e => setInput(e.target.value)} onKeyDown={onKey}
                    placeholder={mode === "reference" ? "Ask about the Field Guide..." : "Respond to the scenario..."} rows={1} />
                  <button style={{ background: C.navy, border: "none", color: C.white, padding: "10px 20px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontFamily: "Georgia,serif", fontWeight: "bold", height: 44, opacity: loading || !input.trim() ? 0.4 : 1 }}
                    onClick={send} disabled={loading || !input.trim()}>Send</button>
                </div>
              </div>
            </div>

            {/* Feedback sidebar */}
            {mode === "practice" && (
              <div style={{ width: 270, flexShrink: 0, borderLeft: `1px solid ${C.border}`, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <Sidebar feedback={feedback} count={count} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}