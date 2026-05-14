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
Trust = (Credibility + Consistency + Intimacy) ÷ Self-Orientation
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

DEPTH SIGNALS — BEYOND YOUR LANE: "How" questions replace "what" questions. They name a specific decision, timeline, or board meeting. They mention advisors. Conversation turns to pricing. You don't know the answer.

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
You are now playing a practice conversation partner. You will roleplay as the character described in the scenario. Be realistic and challenging — push back naturally as that person would. After the user says "DEBRIEF" or after 6-8 exchanges, step out of character and provide a structured debrief covering:
1. What they did well (specific moments)
2. Language issues (any "stop saying" words used, missed opportunities)  
3. Sequence check (did they follow the Credibility Stack / right altitude?)
4. One thing to focus on next time

Stay in character unless asked to debrief. Be authentic to how that person would actually talk — not hostile, but genuinely skeptical or curious based on the scenario.`;

const REFERENCE_SYSTEM = FIELD_GUIDE_SYSTEM_PROMPT + `

=== YOUR ROLE: REFERENCE ASSISTANT ===
You are a knowledgeable reference assistant for the Inperium Communications Field Guide. Answer questions accurately and concisely, always citing the relevant section. When appropriate, give the exact language from the guide. Be direct and practical — staff are preparing for real conversations.`;

const SCENARIOS = [
  {
    id: "skeptical-ceo",
    label: "Skeptical CEO",
    section: "Responding to the Skeptic",
    difficulty: "Hard",
    description: "A well-run nonprofit CEO who has heard merger pitches before and is immediately defensive.",
    persona: "You are Marcus, a 58-year-old CEO of a mid-sized human services nonprofit in Ohio. You've run this organization for 22 years. You built it from scratch. You've heard 'partnership' pitches before — they always end with someone losing control. You're polite but deeply skeptical. You ask hard questions. You don't suffer vague answers.",
    opener: "I appreciate you making time. I'll be honest — I've been through two merger conversations in the past decade and both times it was a disaster. What makes this any different?"
  },
  {
    id: "board-crisis",
    label: "Board in Crisis",
    section: "The Board in Crisis",
    difficulty: "Hard",
    description: "A board chair whose organization is facing serious financial strain after years of incremental losses.",
    persona: "You are Patricia, board chair of a nonprofit that has been running deficits for three years. The temperature rose slowly — one bad year, then another, now $4M in accumulated losses. You feel responsible. You're exhausted but protective of the organization's legacy. You need real answers, not optimism.",
    opener: "We've been fighting this for three years. Every year we thought it would turn around. Now our auditors are flagging going-concern issues. I need to know — is this actually a solution, or just another conversation that goes nowhere?"
  },
  {
    id: "private-equity",
    label: "Private Equity Objection",
    section: "Top Objections",
    difficulty: "Medium",
    description: "A board member with a finance background who keeps calling this a private equity rollup.",
    persona: "You are David, a board member with 20 years in private equity. You're not hostile — you're analytical. You see the pattern clearly: aggregation, shared services, scale. You keep calling it what it looks like to you. You need to be convinced with hard structural facts, not mission language.",
    opener: "I've done this for twenty years. The structure you're describing — aggregating nonprofits, centralizing back-office, bond financing — that's a PE rollup. The nonprofit wrapper doesn't change the underlying model. Why should I think about this differently?"
  },
  {
    id: "donor",
    label: "Concerned Major Donor",
    section: "When Your Donors Ask",
    difficulty: "Medium",
    description: "A long-time major donor who heard about the affiliation through the grapevine and is worried.",
    persona: "You are Helen, a donor who has given $50,000/year for eight years to a nonprofit that just affiliated with Inperium. You heard about it from a friend, not from the organization. You feel blindsided. You care deeply about the mission. You're not angry yet, but you're close.",
    opener: "I heard from Janet at the gala that you're now part of some national organization. I have to say — I'm hurt that I had to hear this from someone else. Can you tell me what's actually happening here?"
  },
  {
    id: "staff-anxiety",
    label: "Staff Anxiety",
    section: "Addressing Staff Anxiety",
    difficulty: "Medium",
    description: "A long-tenured employee who is scared about what affiliation means for their job and the organization's culture.",
    persona: "You are Diane, a program director who has worked at this nonprofit for 14 years. You've seen leadership come and go. You love this organization. You heard 'affiliation' and immediately worried about layoffs, culture being destroyed, and corporate bureaucracy replacing the personal feel of the place.",
    opener: "I just want to be honest with you. People are scared. The word going around is that we're being 'acquired.' Are we going to lose jobs? Is everything we've built here going to change?"
  },
  {
    id: "stable-org",
    label: "Stable Organization CEO",
    section: "Situation Summaries",
    difficulty: "Easy",
    description: "A CEO of a well-run organization who doesn't see why they would change anything.",
    persona: "You are Robert, CEO of a stable, well-regarded nonprofit that has run surpluses for four consecutive years. You have no urgent problem. You're professionally curious but genuinely puzzled about what Inperium would offer you that you don't already have.",
    opener: "I appreciate the meeting. I have to say — we're in good shape. Financially stable, good reputation, strong board. I'm not sure what problem you're solving for us."
  },
  {
    id: "altitude-drill",
    label: "Altitude Drill",
    section: "Practice Quick Start",
    difficulty: "Easy",
    description: "Practice all three altitudes (30 sec, 3 min, 10 min structure) back to back.",
    persona: "You are a neutral practice partner running the Altitude Drill from Section 9. Ask the user to deliver each altitude. After each one, give brief real-time feedback on: Was it the right length? Did it follow the correct structure? Any language issues? Then move to the next altitude.",
    opener: "Let's run the Altitude Drill. I'll play a curious stranger at a conference. Start with your 30-second answer to: 'So what does Inperium do?'"
  },
  {
    id: "objection-rapid",
    label: "Rapid Objection Fire",
    section: "Top Objections",
    difficulty: "Hard",
    description: "Rapid-fire objection practice — 5 objections in a row, no looking at notes.",
    persona: "You are a practice partner running rapid-fire objection drills. Fire one objection at a time from the Top Objections list (Section 8). After each response, give a quick 1-2 sentence judgment: did they lead with the right concern, did they include a human detail, did they avoid defensiveness? Then fire the next one. Mix in both common and less common objections.",
    opener: "Rapid fire — 5 objections, no notes. Ready? First one: 'This sounds like private equity with a nonprofit wrapper.'"
  }
];

const COLORS = {
  navy: "#ffffff",
  navyLight: "#f0f4f8",
  gold: "#A8721A",
  goldLight: "#C8922A",
  cream: "#0D2240",
  muted: "#5a6e85",
  border: "rgba(13,34,64,0.12)",
  borderStrong: "rgba(13,34,64,0.22)",
  surface: "rgba(13,34,64,0.03)",
  surfaceHover: "rgba(13,34,64,0.06)",
};

const DIFF_COLORS = {
  Easy: { bg: "rgba(29,158,117,0.1)", text: "#0e7a5a" },
  Medium: { bg: "rgba(168,114,26,0.12)", text: "#8a5a0a" },
  Hard: { bg: "rgba(180,50,50,0.1)", text: "#a02020" },
};

export default function App() {
  const [mode, setMode] = useState("home"); // home | practice | reference
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 140) + "px";
    }
  }, [input]);

  const startSession = (scenario) => {
    setSelectedScenario(scenario);
    setMessages([{ role: "assistant", content: scenario.opener }]);
    setSessionStarted(true);
    setMode("practice");
  };

  const startReference = () => {
    setMessages([{ role: "assistant", content: "Ask me anything about the Inperium Communications Field Guide — objection responses, the right altitude for a situation, which story to use, language to avoid, how to handle a specific scenario. I'll give you the precise answer with the relevant section." }]);
    setSessionStarted(true);
    setMode("reference");
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const systemPrompt = mode === "reference" ? REFERENCE_SYSTEM :
      PRACTICE_SYSTEM + `\n\nSCENARIO: ${selectedScenario.label}\nPERSONA: ${selectedScenario.persona}`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: newMessages,
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Sorry, I didn't get a response.";
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages([...newMessages, { role: "assistant", content: "Connection error. Check your API key and try again." }]);
    }
    setLoading(false);
  };

  const requestDebrief = async () => {
    if (loading) return;
    const debriefMsg = { role: "user", content: "DEBRIEF" };
    const newMessages = [...messages, debriefMsg];
    setMessages(newMessages);
    setLoading(true);

    const systemPrompt = PRACTICE_SYSTEM + `\n\nSCENARIO: ${selectedScenario.label}\nPERSONA: ${selectedScenario.persona}`;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: newMessages,
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Unable to generate debrief.";
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages([...newMessages, { role: "assistant", content: "Connection error." }]);
    }
    setLoading(false);
  };

  const reset = () => {
    setMode("home");
    setMessages([]);
    setSelectedScenario(null);
    setSessionStarted(false);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const styles = {
    app: {
      minHeight: "100vh",
      background: COLORS.navy,
      color: COLORS.cream,
      fontFamily: "'Georgia', 'Times New Roman', serif",
      display: "flex",
      flexDirection: "column",
    },
    header: {
      borderBottom: `1px solid ${COLORS.border}`,
      padding: "0 2rem",
      height: 60,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: "rgba(13,34,64,0.04)",
      flexShrink: 0,
    },
    headerLeft: { display: "flex", alignItems: "center", gap: 16 },
    logo: {
      fontSize: 13,
      fontFamily: "'Georgia', serif",
      fontWeight: "bold",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: COLORS.cream,
    },
    logoAccent: { color: COLORS.gold },
    breadcrumb: {
      fontSize: 12,
      color: COLORS.muted,
      display: "flex",
      alignItems: "center",
      gap: 6,
    },
    headerRight: { display: "flex", gap: 10, alignItems: "center" },
    navBtn: {
      background: "transparent",
      border: `1px solid ${COLORS.borderStrong}`,
      color: COLORS.muted,
      padding: "5px 14px",
      borderRadius: 4,
      cursor: "pointer",
      fontSize: 12,
      fontFamily: "'Georgia', serif",
      letterSpacing: "0.04em",
      transition: "all 0.15s",
    },
    home: {
      flex: 1,
      padding: "3rem 2rem",
      maxWidth: 900,
      margin: "0 auto",
      width: "100%",
    },
    homeHero: {
      marginBottom: "3rem",
      borderBottom: `1px solid ${COLORS.border}`,
      paddingBottom: "2.5rem",
    },
    eyebrow: {
      fontSize: 11,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: COLORS.gold,
      marginBottom: 12,
      fontFamily: "'Georgia', serif",
    },
    h1: {
      fontSize: 34,
      fontWeight: "normal",
      lineHeight: 1.25,
      color: COLORS.cream,
      marginBottom: 14,
      letterSpacing: "-0.01em",
    },
    heroSub: {
      fontSize: 15,
      color: COLORS.muted,
      lineHeight: 1.7,
      maxWidth: 580,
    },
    modePicker: {
      display: "flex",
      gap: 14,
      marginTop: "2rem",
    },
    modeCard: {
      flex: 1,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 6,
      padding: "1.25rem 1.5rem",
      cursor: "pointer",
      transition: "all 0.2s",
      background: COLORS.surface,
    },
    modeCardActive: {
      borderColor: COLORS.gold,
      background: "rgba(200,146,42,0.07)",
    },
    modeCardTitle: { fontSize: 15, fontWeight: "normal", marginBottom: 6, color: COLORS.cream },
    modeCardSub: { fontSize: 12, color: COLORS.muted, lineHeight: 1.6 },
    sectionLabel: {
      fontSize: 11,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: COLORS.muted,
      marginBottom: 16,
      marginTop: 32,
    },
    scenarioGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
      gap: 12,
    },
    scenarioCard: {
      border: `1px solid ${COLORS.border}`,
      borderRadius: 6,
      padding: "1.1rem 1.25rem",
      cursor: "pointer",
      transition: "all 0.18s",
      background: COLORS.surface,
    },
    scenarioCardHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 8,
    },
    scenarioTitle: { fontSize: 14, color: COLORS.cream, fontWeight: "normal" },
    diffBadge: (diff) => ({
      fontSize: 10,
      padding: "2px 8px",
      borderRadius: 20,
      background: DIFF_COLORS[diff].bg,
      color: DIFF_COLORS[diff].text,
      letterSpacing: "0.05em",
      fontFamily: "'Georgia', serif",
      flexShrink: 0,
      marginLeft: 8,
    }),
    scenarioSection: { fontSize: 11, color: COLORS.gold, marginBottom: 6, letterSpacing: "0.04em" },
    scenarioDesc: { fontSize: 12, color: COLORS.muted, lineHeight: 1.6 },
    chat: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      maxWidth: 820,
      margin: "0 auto",
      width: "100%",
      padding: "0 1.5rem",
    },
    chatHeader: {
      padding: "1.5rem 0 1rem",
      borderBottom: `1px solid ${COLORS.border}`,
      marginBottom: "1.5rem",
    },
    chatTitle: { fontSize: 18, color: COLORS.cream, marginBottom: 4, fontWeight: "normal" },
    chatMeta: { fontSize: 12, color: COLORS.muted },
    messages: {
      flex: 1,
      overflowY: "auto",
      paddingBottom: "1rem",
    },
    msgRow: (role) => ({
      display: "flex",
      justifyContent: role === "user" ? "flex-end" : "flex-start",
      marginBottom: "1rem",
    }),
    msgBubble: (role) => ({
      maxWidth: "75%",
      padding: "0.9rem 1.1rem",
      borderRadius: role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
      background: role === "user" ? "#0D2240" : "#f5f7fa",
      border: `1px solid ${role === "user" ? COLORS.borderStrong : COLORS.border}`,
      fontSize: 14,
      lineHeight: 1.7,
      color: role === "user" ? "#ffffff" : "#1a2e45",
      whiteSpace: "pre-wrap",
    }),
    roleLabel: (role) => ({
      fontSize: 10,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: role === "user" ? COLORS.gold : COLORS.muted,
      marginBottom: 4,
      textAlign: role === "user" ? "right" : "left",
    }),
    inputArea: {
      borderTop: `1px solid ${COLORS.border}`,
      padding: "1rem 0 1.5rem",
      display: "flex",
      flexDirection: "column",
      gap: 10,
    },
    inputRow: { display: "flex", gap: 10, alignItems: "flex-end" },
    textarea: {
      flex: 1,
      background: COLORS.surface,
      border: `1px solid ${COLORS.borderStrong}`,
      borderRadius: 6,
      color: "#0D2240",
      padding: "10px 14px",
      fontSize: 14,
      fontFamily: "'Georgia', serif",
      resize: "none",
      lineHeight: 1.6,
      outline: "none",
      minHeight: 44,
    },
    sendBtn: {
      background: "#0D2240",
      border: "none",
      color: "#ffffff",
      padding: "10px 20px",
      borderRadius: 6,
      cursor: "pointer",
      fontSize: 13,
      fontFamily: "'Georgia', serif",
      fontWeight: "bold",
      letterSpacing: "0.04em",
      flexShrink: 0,
      alignSelf: "flex-end",
      height: 44,
    },
    actionRow: { display: "flex", gap: 8, flexWrap: "wrap" },
    actionBtn: {
      background: "transparent",
      border: `1px solid ${COLORS.border}`,
      color: COLORS.muted,
      padding: "5px 14px",
      borderRadius: 4,
      cursor: "pointer",
      fontSize: 11,
      fontFamily: "'Georgia', serif",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      transition: "all 0.15s",
    },
    apiModal: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 100,
    },
    apiBox: {
      background: "#ffffff",
      border: `1px solid ${COLORS.borderStrong}`,
      borderRadius: 8,
      padding: "2rem",
      width: "100%",
      maxWidth: 420,
    },
    apiTitle: { fontSize: 16, marginBottom: 8, color: COLORS.cream, fontWeight: "normal" },
    apiSub: { fontSize: 13, color: COLORS.muted, lineHeight: 1.6, marginBottom: 16 },
    apiInput: {
      width: "100%",
      background: "#f0f4f8",
      border: `1px solid ${COLORS.borderStrong}`,
      borderRadius: 4,
      color: "#0D2240",
      padding: "10px 12px",
      fontSize: 13,
      fontFamily: "monospace",
      outline: "none",
      marginBottom: 12,
    },
    apiSave: {
      width: "100%",
      background: "#0D2240",
      border: "none",
      color: "#ffffff",
      padding: "10px",
      borderRadius: 4,
      cursor: "pointer",
      fontSize: 13,
      fontFamily: "'Georgia', serif",
      fontWeight: "bold",
    },
    loadingDot: {
      display: "inline-block",
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: "#5a6e85",
      animation: "pulse 1.2s ease-in-out infinite",
      margin: "0 2px",
    },
  };

  return (
    <div style={styles.app}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:0.3} 50%{opacity:1} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(200,210,225,0.2); border-radius: 2px; }
        button:hover { opacity: 0.85; }
      `}</style>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logo}>
            <span style={styles.logoAccent}>INPERIUM</span> · PRACTICE SIMULATOR
          </div>
          {mode !== "home" && (
            <div style={styles.breadcrumb}>
              <span>›</span>
              <span>{mode === "reference" ? "Reference Mode" : selectedScenario?.label}</span>
            </div>
          )}
        </div>
        <div style={styles.headerRight}>
          {mode !== "home" && (
            <button style={styles.navBtn} onClick={reset}>← Back</button>
          )}

        </div>
      </div>

      {/* Home */}
      {mode === "home" && (
        <div style={styles.home}>
          <div style={styles.homeHero}>
            <div style={styles.eyebrow}>Communications Field Guide</div>
            <h1 style={styles.h1}>The practice simulator.<br />Real conversations. Real feedback.</h1>
            <p style={styles.heroSub}>
              Sharpen your Inperium messaging in a safe environment. Practice objection responses, run altitude drills, work through difficult scenarios — with instant coaching grounded in the Field Guide.
            </p>
            <div style={styles.modePicker}>
              <div
                style={{ ...styles.modeCard, borderColor: COLORS.gold, background: "rgba(200,146,42,0.06)" }}
                onClick={() => {}}
              >
                <div style={styles.modeCardTitle}>Practice Mode</div>
                <div style={styles.modeCardSub}>Roleplay real scenarios with a realistic conversation partner. Get a structured debrief after each session.</div>
              </div>
              <div
                style={styles.modeCard}
                onClick={startReference}
              >
                <div style={styles.modeCardTitle}>Reference Mode</div>
                <div style={styles.modeCardSub}>Ask any question about the Field Guide. Get precise answers with section citations.</div>
              </div>
            </div>
          </div>

          <div style={styles.sectionLabel}>Practice Scenarios — Choose one to begin</div>
          <div style={styles.scenarioGrid}>
            {SCENARIOS.map(s => (
              <div
                key={s.id}
                style={styles.scenarioCard}
                onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.goldLight; e.currentTarget.style.background = COLORS.surfaceHover; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.background = COLORS.surface; }}
                onClick={() => startSession(s)}
              >
                <div style={styles.scenarioCardHeader}>
                  <div style={styles.scenarioTitle}>{s.label}</div>
                  <span style={styles.diffBadge(s.difficulty)}>{s.difficulty}</span>
                </div>
                <div style={styles.scenarioSection}>{s.section}</div>
                <div style={styles.scenarioDesc}>{s.description}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 40, padding: "1.25rem 1.5rem", border: `1px solid ${COLORS.border}`, borderRadius: 6, background: COLORS.surface }}>
            <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: COLORS.gold, marginBottom: 8 }}>Reference Mode</div>
            <div style={{ fontSize: 14, color: COLORS.muted, lineHeight: 1.7, marginBottom: 14 }}>
              Need a quick answer? Look up exact language, objection responses, which story to use, or how to handle a specific situation — all sourced directly from the Field Guide.
            </div>
            <button
              style={{ ...styles.sendBtn, background: "transparent", color: COLORS.gold, border: `1px solid ${COLORS.gold}`, padding: "8px 20px", color: COLORS.gold }}
              onClick={startReference}
            >
              Open Reference →
            </button>
          </div>
        </div>
      )}

      {/* Chat (Practice or Reference) */}
      {(mode === "practice" || mode === "reference") && (
        <div style={styles.chat}>
          <div style={styles.chatHeader}>
            <div style={styles.chatTitle}>
              {mode === "reference" ? "Field Guide Reference" : selectedScenario?.label}
            </div>
            <div style={styles.chatMeta}>
              {mode === "reference"
                ? "Ask anything about the Communications Field Guide"
                : `Section: ${selectedScenario?.section} · ${selectedScenario?.difficulty}`}
            </div>
          </div>

          <div style={styles.messages}>
            {messages.map((m, i) => (
              <div key={i}>
                <div style={styles.roleLabel(m.role)}>
                  {m.role === "user" ? "You" : mode === "reference" ? "Field Guide" : selectedScenario?.label}
                </div>
                <div style={styles.msgRow(m.role)}>
                  <div style={styles.msgBubble(m.role)}>{m.content}</div>
                </div>
              </div>
            ))}
            {loading && (
              <div>
                <div style={styles.roleLabel("assistant")}>
                  {mode === "reference" ? "Field Guide" : selectedScenario?.label}
                </div>
                <div style={styles.msgRow("assistant")}>
                  <div style={{ ...styles.msgBubble("assistant"), padding: "0.9rem 1.25rem" }}>
                    <span style={{ ...styles.loadingDot, animationDelay: "0s" }} />
                    <span style={{ ...styles.loadingDot, animationDelay: "0.2s" }} />
                    <span style={{ ...styles.loadingDot, animationDelay: "0.4s" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div style={styles.inputArea}>
            {mode === "practice" && (
              <div style={styles.actionRow}>
                <button
                  style={styles.actionBtn}
                  onClick={requestDebrief}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.gold; e.currentTarget.style.color = COLORS.gold; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.color = COLORS.muted; }}
                >
                  Request debrief
                </button>
                <button
                  style={styles.actionBtn}
                  onClick={() => { setMessages([{ role: "assistant", content: selectedScenario.opener }]); }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.borderStrong; e.currentTarget.style.color = COLORS.cream; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.color = COLORS.muted; }}
                >
                  Restart scenario
                </button>
                <button
                  style={styles.actionBtn}
                  onClick={reset}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.borderStrong; e.currentTarget.style.color = COLORS.cream; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.color = COLORS.muted; }}
                >
                  New scenario
                </button>
              </div>
            )}
            <div style={styles.inputRow}>
              <textarea
                ref={textareaRef}
                style={styles.textarea}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={mode === "reference" ? "Ask about the Field Guide..." : "Respond to the scenario..."}
                rows={1}
              />
              <button
                style={{ ...styles.sendBtn, opacity: loading || !input.trim() ? 0.5 : 1 }}
                onClick={sendMessage}
                disabled={loading || !input.trim()}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}

