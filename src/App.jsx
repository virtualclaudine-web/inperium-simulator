import { useState, useRef, useEffect } from "react";
import { useContent } from "./useContent";
import { useVoiceMode } from "./useVoiceMode";
import { useDeliveryReport } from "./useDeliveryReport";
import { useAudioPauseDetector } from "./useAudioPauseDetector";

const CATEGORIES = [
  {
    id: "conversation", icon: "💬",
    title: "Starting the conversation",
    desc: "Opening with a new prospect, board member, or donor for the first time",
    scenarios: [
      { id: "skeptical-ceo", label: "Skeptical CEO", difficulty: "Hard",
        persona: "You are Marcus, 58, CEO of a mid-sized human services nonprofit in Ohio for 22 years. You have heard partnership pitches before and they always end badly. You are polite but deeply skeptical and ask hard questions.",
        opener: "I appreciate you making time. I'll be honest — I've been through two merger conversations in the past decade and both times it was a disaster. What makes this any different?" },
      { id: "stable-org", label: "Stable Organization CEO", difficulty: "Medium",
        persona: "You are Robert, CEO of a stable nonprofit with four consecutive surplus years. No urgent problem. Professionally curious but genuinely puzzled about what Inperium offers you.",
        opener: "I appreciate the meeting. We're in good shape — financially stable, good reputation, strong board. I'm not sure what problem you're solving for us." },
      { id: "conference-intro", label: "Conference Introduction", difficulty: "Easy",
        persona: "You are a friendly but busy nonprofit executive at a sector conference. Just introduced to an Inperium leader. Open and curious but heading to a session soon.",
        opener: "Good to meet you. So what does Inperium do exactly? I've heard the name but I don't really know what it is." },
      { id: "generational-ceo", label: "Generational Planning CEO", difficulty: "Medium",
        persona: "You are CEO of a 38-year-old disability services organization in Florida. Stable and well-run. Your question is about long-term sustainability.",
        opener: "I've been running this organization for 18 years and I'm thinking about what it needs to look like in another 20. I'm interested — but from a strategic angle, not because we're in trouble. How do I think about this?" },
      { id: "prior-bad-merger", label: "Burned by Prior Merger", difficulty: "Hard",
        persona: "You are CEO of a behavioral health nonprofit that went through a disastrous merger 8 years ago. You lost your name, half your staff, and years of trust.",
        opener: "I'll be upfront — eight years ago I went through a merger that nearly destroyed this organization. We were promised nothing would change and everything changed. When you say 'affiliation' my guard goes up. What makes this structurally different?" },
    ]
  },
  {
    id: "objections", icon: "🛡",
    title: "Handling objections",
    desc: "Private equity concerns, independence fears, board resistance, skeptics, and tough questions",
    scenarios: [
      { id: "private-equity", label: "Private Equity Objection", difficulty: "Hard",
        persona: "You are David, a board member with 20 years in private equity. Analytical, not hostile. You need hard structural facts, not mission language.",
        opener: "I've done this for twenty years. The structure you're describing — aggregating nonprofits, centralizing back-office, bond financing — that's a PE rollup. The nonprofit wrapper doesn't change the underlying model. Why should I think about this differently?" },
      { id: "independence", label: "Independence Fear", difficulty: "Medium",
        persona: "You are Sandra, board chair who built this organization over 30 years. Your fear is losing what makes it special.",
        opener: "We've spent thirty years building something. Our name means something here. I don't want to become a subsidiary of something larger and lose everything that makes us who we are." },
      { id: "culture-unique", label: "Our Culture Is Unique", difficulty: "Medium",
        persona: "You are executive director of a community mental health organization famous for its warm, human-centered culture.",
        opener: "I hear you on the infrastructure benefits. But what makes this organization work isn't the back-office systems — it's our culture. You can't standardize what we do." },
      { id: "community-failure", label: "Community Will Think We Failed", difficulty: "Medium",
        persona: "You are a board chair of a well-known 45-year community organization. Your deepest fear is perception.",
        opener: "My biggest fear isn't the structural stuff. It's what people will say. If we do this, people are going to think we failed. How do you respond to that?" },
      { id: "too-good-true", label: "Too Good to Be True", difficulty: "Medium",
        persona: "You are a thoughtful 25-year nonprofit veteran. Not hostile, just someone who has seen a lot of promises not kept.",
        opener: "I want to believe this. I really do. But in 25 years in this sector, whenever something sounds this good there's always something I'm missing. What's the catch? What do we actually give up?" },
      { id: "transition-costs", label: "Can't Afford Transition Costs", difficulty: "Easy",
        persona: "You are CFO of a small nonprofit with thin margins. Interested in long-term value but genuinely worried about short-term cash requirements.",
        opener: "I'll be straight — transitions like this are expensive. Staff time, consultants, system migrations, operational disruption. Even if the long-term value is there, I'm not sure we can absorb the upfront cost. What does this actually cost us to get started?" },
      { id: "state-regulatory", label: "State Regulators Won't Approve", difficulty: "Medium",
        persona: "You are CEO of a heavily regulated behavioral health provider in a Southern state with a complicated Medicaid relationship.",
        opener: "Our state licensing board is already difficult to work with. If they see a change in organizational structure they could pause our licenses. Has Inperium actually done this in our kind of regulatory environment?" },
      { id: "attorney-advisor", label: "Attorney or Financial Advisor", difficulty: "Hard",
        persona: "You are a transactional attorney representing a nonprofit board. Paid to find problems. You probe the legal structure carefully.",
        opener: "Before we go further I want to understand the governance structure in detail. What are the exact protective powers in the affiliation agreement, how are they enforced, and what happens to those protections if Inperium's board changes?" },
    ]
  },
  {
    id: "fear", icon: "🤝",
    title: "Addressing fear & anxiety",
    desc: "Staff worry, donor concerns, board members in crisis — leading with empathy first",
    scenarios: [
      { id: "staff-anxiety", label: "Staff Town Hall", difficulty: "Medium",
        persona: "You are Diane, a 14-year program director. You speak for a room full of scared staff watching to see if leadership will be honest.",
        opener: "I just want to be honest with you. People are scared. The word going around is that we're being 'acquired.' Are we going to lose jobs? Is everything we've built here going to change?" },
      { id: "informal-leader", label: "Skeptical Informal Leader", difficulty: "Hard",
        persona: "You are a 20-year employee who is the person everyone in the building actually listens to. You have seen three 'transformations' make things worse.",
        opener: "I've been here longer than most of the leadership team. I've seen three transformations and every one made things worse for the people doing the actual work. What makes this one different and why should I trust it?" },
      { id: "donor", label: "Concerned Major Donor", difficulty: "Medium",
        persona: "You are Helen, a donor who has given $50,000/year for eight years. You heard about the affiliation from a friend at a gala, not from the organization.",
        opener: "I heard from Janet at the gala that you're now part of some national organization. I'm hurt that I had to hear this from someone else. Can you tell me what's actually happening here?" },
      { id: "small-donor", label: "Community Donor & Volunteer", difficulty: "Easy",
        persona: "You are a local community member who has volunteered and given small amounts for 10 years.",
        opener: "I saw something on Facebook about you all joining some big national group. My family has been involved here for years. Is this still going to be the same organization? Will the people I know still be here?" },
      { id: "board-crisis", label: "Board in Crisis", difficulty: "Hard",
        persona: "You are Patricia, board chair of a nonprofit with three years of deficits, $4M accumulated losses, and a going-concern flag from auditors.",
        opener: "We've been fighting this for three years. Every year we thought it would turn around. Now our auditors are flagging going-concern issues. I need to know — is this actually a solution, or just another conversation that goes nowhere?" },
      { id: "post-announcement-staff", label: "Staff After Announcement", difficulty: "Medium",
        persona: "You are a clinical supervisor who just sat through the all-staff announcement. You have three specific fears: reporting structure, pay scale, and accreditation.",
        opener: "Thank you for the presentation. My team is going to come to me with specific questions. What exactly happens to our reporting structure? What happens to pay and benefits? And does our accreditation status get reviewed?" },
      { id: "state-funder", label: "State Funder Confusion", difficulty: "Medium",
        persona: "You are a state Medicaid program officer who received correspondence from an Apis Services email address and doesn't know who that is.",
        opener: "I've been receiving correspondence from an email domain I don't recognize — Apis Services. I need to understand whether there's been a change in organizational structure that requires us to update our licensing and billing records." },
    ]
  },
  {
    id: "peer", icon: "🔁",
    title: "Peer & affiliate conversations",
    desc: "Affiliate-to-affiliate, community partners, and conversations within the constellation",
    scenarios: [
      { id: "affiliate-to-affiliate", label: "Affiliate to Prospective Affiliate", difficulty: "Easy",
        persona: "You are a prospective affiliate CEO meeting with a current affiliate leader. You want honest answers about what was hard and whether they'd do it again.",
        opener: "I really appreciate you making time for this. I specifically wanted to talk to someone who's been through it rather than hearing the sales pitch. What was actually hard about this, and would you do it again?" },
      { id: "skeptical-peer", label: "Skeptical Peer from Different Sector", difficulty: "Medium",
        persona: "You are CEO of a supportive housing organization. You've heard Inperium described as mostly for disability providers.",
        opener: "I've heard a lot about Inperium but mostly in the context of disability services. We do supportive housing — very different regulatory environment. Is this model actually built for organizations like us?" },
      { id: "community-partner", label: "Community Partner After Close", difficulty: "Easy",
        persona: "You are a long-time community partner organization. You heard about the affiliation through the grapevine.",
        opener: "I've been hearing about the Inperium affiliation and I wanted to reach out directly. Will the same people still be in place? Will our referral arrangements stay the same?" },
      { id: "board-member-peer", label: "Board Member Peer Conversation", difficulty: "Medium",
        persona: "You are a board member of a prospective affiliate having an informal conversation with a board member from a current affiliate.",
        opener: "So you've been through the affiliation process. I'm on a board that's been approached and I want the honest board perspective — not the CEO's, not Inperium's. How has governance actually worked post-affiliation?" },
    ]
  },
  {
    id: "recovery", icon: "↩️",
    title: "Recovery & difficult situations",
    desc: "Meetings that went sideways, sensitive follow-ups, and navigating hard moments",
    scenarios: [
      { id: "meeting-went-sideways", label: "Recovery After a Bad Meeting", difficulty: "Hard",
        persona: "You are a board chair whose first meeting with an Inperium representative two days ago went badly.",
        opener: "I agreed to this call but I want to be honest — our last conversation didn't go well. My board member felt their concerns weren't being heard. What I'm looking for today is different from what I got last time." },
      { id: "ceo-job-concern", label: "CEO Privately Worried About Their Job", difficulty: "Hard",
        persona: "You are a CEO genuinely interested in affiliation for the mission. But your deepest fear is being replaced.",
        opener: "I want to understand the CEO relationship more deeply. I know it's a protected power — but what does that mean in practice? If Inperium's leadership has concerns about how an affiliate is being run, what actually happens?" },
      { id: "narrative-vacuum", label: "Community Narrative Gone Wrong", difficulty: "Hard",
        persona: "You are an affiliate CEO in crisis: the local newspaper ran a story describing the affiliation as an 'acquisition by a Philadelphia-based company.'",
        opener: "We have a serious problem. The local paper ran a story this morning describing what we did as being 'acquired by a for-profit company in Philadelphia.' My phone is ringing, a board member is upset, and our biggest funder just paused their next gift." },
      { id: "board-resignation", label: "Board Members Threatening to Resign", difficulty: "Hard",
        persona: "You are a board chair two weeks from the affiliation vote. Four of your eleven board members have told you privately they will resign if it passes.",
        opener: "I need your honest advice. We're two weeks from our vote and four of my board members have told me they'll resign if it passes. These aren't obstructionists — they're people I respect. They genuinely believe this is wrong." },
    ]
  },
  {
    id: "drills", icon: "⚡",
    title: "Practice drills",
    desc: "Focused skill drills — altitude, objections, stories, silence, consistency, and elevation",
    scenarios: [
      { id: "altitude-drill", label: "Altitude Drill", difficulty: "Easy",
        persona: "You are a neutral practice partner running the Altitude Drill. Ask the user to deliver each of the three altitudes. After each one give structured feedback.",
        opener: "Let's run the Altitude Drill. I'll play a curious stranger at a conference. Start with your 30-second answer to: 'So what does Inperium do?'" },
      { id: "objection-rapid", label: "Rapid Objection Fire", difficulty: "Hard",
        persona: "You are a practice partner running rapid-fire objection drills. Fire one objection at a time. After each response give a 2-3 sentence judgment.",
        opener: "Rapid fire — 6 objections, no notes. Ready? First one: 'This sounds like private equity with a nonprofit wrapper.'" },
      { id: "story-drop", label: "Story Drop Drill", difficulty: "Medium",
        persona: "You are a practice partner running Story Drop drills. Give the user a situation and ask them to choose and tell the right story in under 90 seconds.",
        opener: "Story Drop drill. I'll give you a situation and you tell me the right story in under 90 seconds. Start with the person served. Ready? Situation: A board chair who's been running deficits for two years. She's exhausted and ashamed and wondering if affiliation means she failed. Go." },
      { id: "silence-drill", label: "Silence & Stat-Then-Meaning Drill", difficulty: "Easy",
        persona: "You are a practice partner running the silence drill and Stat-Then-Meaning rule.",
        opener: "Two drills in one. First: deliver the bond market proof statement, then hold silence for 10 full seconds. I'll time you. The temptation to fill the silence is the whole point. Go ahead." },
      { id: "consistency-test", label: "Four-Question Consistency Check", difficulty: "Easy",
        persona: "You are a practice partner running the Four-Question Consistency Test.",
        opener: "Let's run the Four-Question Consistency Test. Imagine you're about to walk into a first meeting with a board chair at a financially stressed nonprofit. Question one: What is the first sentence out of your mouth — is it about Inperium's capabilities or about proof?" },
      { id: "lane-elevation", label: "Communication Lane & Elevation Drill", difficulty: "Medium",
        persona: "You are a practice partner running the Communication Lane elevation drill. Start with a Red lane question and gradually escalate.",
        opener: "You're an affiliate CEO at a community event. I'll play a colleague who just asked about Inperium. I'll escalate the questions — your job is to recognize when it's time to hand off and execute it smoothly. Here we go: 'So I keep hearing about Inperium. You're one of the affiliates, right? What is it exactly?'" },
    ]
  }
];

const QUICK_LOOKUPS = [
  "Private equity objection",
  "30-second pitch",
  "Words to avoid",
  "The three stories",
  "Credibility Stack order",
  "Staff anxiety script",
  "Donor communication",
  "What does Inperium do?",
];

const EXAMPLE_QUESTIONS = [
  "Which story should I use when a board has been running deficits for two years?",
  "What's the exact language for when a donor asks if their gift is still going to the same place?",
  "Walk me through the Credibility Stack sequence step by step.",
];

function parseDebrief(text) {
  const m = text.match(/---DEBRIEF---([\s\S]*?)---END_DEBRIEF---/);
  if (!m) return null;
  const b = m[1];
  const get = (k) => { const r = b.match(new RegExp(k + ":([^\n]*)(?:\n|$)")); return r ? r[1].trim() : null; };
  return {
    score: parseInt(get("SCORE")) || 0,
    aspiration: parseInt(get("ASPIRATION_CLARITY")) || 0,
    constraint: parseInt(get("CONSTRAINT_DISCOVERY")) || 0,
    decision: parseInt(get("DECISION_FRAMING")) || 0,
    simplicity: parseInt(get("SIMPLICITY_CONFIDENCE")) || 0,
    strongest: get("STRONGEST") || "",
    note: get("COACH_NOTE") || "",
    focus: get("FOCUS") || "",
  };
}

// ── Design tokens ──────────────────────────────────────────────
const N   = "#0D2240";   // navy
const BR  = "#C8922A";   // bronze
const BRL = "#A0732A";   // bronze dark
const CR  = "#F8F4EE";   // cream background
const CS  = "#F0EBE2";   // cream surface
const W   = "#FFFFFF";   // white cards
const M   = "#5C6E7E";   // muted
const B   = "rgba(13,34,64,0.1)";
const BS  = "rgba(13,34,64,0.22)";
const PF  = "'Playfair Display', Georgia, serif";
const SF  = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

const DIFF_STYLES = {
  Easy:   { border: "#639922", bg: "#EAF3DE", color: "#3B6D11" },
  Medium: { border: "#BA7517", bg: "#FAEEDA", color: "#854F0B" },
  Hard:   { border: "#A32D2D", bg: "#FCEBEB", color: "#7C1F1F" },
};

function TopBar({ sub, showBack, onBack, lastFetched }) {
  return (
    <div style={{ background: N, padding: "13px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
      <div>
        <span style={{ fontFamily: SF, fontSize: 11, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: BR }}>INPERIUM</span>
        <span style={{ fontFamily: SF, fontSize: 11, color: "rgba(255,255,255,0.4)", marginLeft: 6 }}>· PRACTICE SIMULATOR</span>
        {sub && <span style={{ fontFamily: SF, fontSize: 11, color: "rgba(255,255,255,0.35)", marginLeft: 8 }}>› {sub}</span>}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {lastFetched && (
          <span style={{ fontFamily: SF, fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.04em" }}>
            Content updated {lastFetched.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
        )}
        {showBack && (
          <button onClick={onBack} style={{ fontFamily: SF, fontSize: 11, color: "rgba(255,255,255,0.55)", background: "transparent", border: "0.5px solid rgba(255,255,255,0.2)", padding: "5px 14px", borderRadius: 6, cursor: "pointer" }}>← Back</button>
        )}
      </div>
    </div>
  );
}

function ScoreBar({ label, score }) {
  const color = score === 2 ? N : score === 1 ? BR : "#cc4444";
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontFamily: SF, fontSize: 12, color: M }}>{label}</span>
        <span style={{ fontFamily: SF, fontSize: 12, fontWeight: 500, color: score === 2 ? N : BR }}>{score} / 2</span>
      </div>
      <div style={{ height: 3, background: B, borderRadius: 2 }}>
        <div style={{ height: "100%", width: (score / 2 * 100) + "%", background: color, borderRadius: 2, transition: "width 0.5s ease" }} />
      </div>
    </div>
  );
}

export default function App() {
  const content = useContent();
  const [screen, setScreen] = useState("home");
  const [category, setCategory] = useState(null);
  const [scenario, setScenario] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [flaggedWords, setFlaggedWords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exchanges, setExchanges] = useState(0);
  const [debrief, setDebrief] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [refInput, setRefInput] = useState("");
  const [refMessages, setRefMessages] = useState([]);
  const [refLoading, setRefLoading] = useState(false);
  const [practiceMode, setPracticeMode] = useState("text"); // "text" | "voice" — explicit switch, not an always-on mic
  const endRef = useRef(null);
  const taRef = useRef(null);
  const refEndRef = useRef(null);
  const voice = useVoiceMode();
  const deliveryReport = useDeliveryReport();
  const pauseDetector = useAudioPauseDetector();
  const wasListeningRef = useRef(false);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  useEffect(() => { refEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [refMessages]);
  useEffect(() => {
    if (taRef.current) { taRef.current.style.height = "auto"; taRef.current.style.height = Math.min(taRef.current.scrollHeight, 140) + "px"; }
  }, [input]);
  // Read the character's line aloud only when the person has explicitly switched to Voice mode.
  useEffect(() => {
    if (practiceMode !== "voice") return;
    const last = messages[messages.length - 1];
    if (last?.role === "assistant") voice.speak(last.content);
  }, [messages, practiceMode]);
  // Feed live speech transcript into the existing input state — voice mode only.
  useEffect(() => {
    if (practiceMode === "voice" && voice.transcript) { setInput(voice.transcript); setFlaggedWords(checkLanguage(voice.transcript)); }
  }, [voice.transcript, practiceMode]);
  // Record the delivery-report data exactly when a listening session ends —
  // by then both the transcript and the real audio-based pause data are finalized.
  useEffect(() => {
    if (wasListeningRef.current && !voice.isListening && practiceMode === "voice") {
      const { pauses } = pauseDetector.stopMonitoring();
      const chunks = voice.getTranscriptChunks();
      deliveryReport.recordUtterance({ transcript: voice.transcript, pauses, chunks });
    }
    wasListeningRef.current = voice.isListening;
  }, [voice.isListening]);
  // Switching modes mid-session: stop any active mic/audio monitoring and clear partial voice state so it can't leak into typed input.
  useEffect(() => {
    if (practiceMode === "text") {
      if (voice.isListening) { voice.stopListening(); pauseDetector.stopMonitoring(); }
      voice.stopSpeaking();
      voice.resetTranscript();
    }
  }, [practiceMode]);
  useEffect(() => {
    if (screen === "practice" && startTime) {
      const t = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000);
      return () => clearInterval(t);
    }
  }, [screen, startTime]);

  const LIVE_FG = content.systemPrompt || "";

  const PRACTICE_SYS = LIVE_FG + `

=== YOUR ROLE: PRACTICE SIMULATOR ===
You are playing a realistic conversation partner. Stay in character throughout — be authentic, push back naturally, respond as that person would.
Do NOT include scoring or feedback during the conversation. Just respond naturally as the character.
When the user sends "END_SESSION_GET_FEEDBACK", step out of character and provide:

---DEBRIEF---
SCORE:[total out of 8]
ASPIRATION_CLARITY:[0-2]
CONSTRAINT_DISCOVERY:[0-2]
DECISION_FRAMING:[0-2]
SIMPLICITY_CONFIDENCE:[0-2]
STRONGEST:[name of strongest dimension]
COACH_NOTE:[2-3 sentences of specific, actionable coaching tied to the Field Guide]
FOCUS:[one specific thing to work on next time, one sentence]
---END_DEBRIEF---`;

  const REFERENCE_SYS = LIVE_FG + `

=== YOUR ROLE: REFERENCE ASSISTANT ===
Answer questions about the Inperium Communications Field Guide accurately and concisely, always citing the relevant section. Give exact language from the guide when appropriate. Be direct and practical.`;

  const FLIPSCRIPT_SYS = LIVE_FG + `

=== YOUR ROLE: INPERIUM EXPERT LEADER ===
The user is playing a skeptic, prospect, board member, donor, or other challenging counterpart. Respond as a highly skilled, trained Inperium leader — calm, confident, grounded in the Field Guide. Use exact frameworks: lead with proof not explanation, follow the Credibility Stack, use the right story, deploy the Stat-Then-Meaning rule, use correct Words That Work language.
After your response, add a brief coaching note in italics starting with "Coach note:" explaining which framework you used and why.`;

  // Loading screen
  if (content.loading) return (
    <div style={{ minHeight: "100vh", background: CR, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: PF }}>
      <style>{`* { box-sizing:border-box; margin:0; padding:0; } @keyframes pulse{0%,100%{opacity:0.3}50%{opacity:1}}`}</style>
      <div style={{ fontSize: 24, color: N, marginBottom: 16, fontWeight: 400 }}>Loading content...</div>
      <div style={{ display: "flex", gap: 6 }}>
        {[0, 0.2, 0.4].map((d, i) => <span key={i} style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: BR, animation: "pulse 1.2s ease-in-out infinite", animationDelay: d + "s" }} />)}
      </div>
      <div style={{ marginTop: 14, fontFamily: SF, fontSize: 12, color: M }}>Loading content from SharePoint...</div>
    </div>
  );

  if (content.error) console.warn("Using fallback content:", content.error);

  const checkLanguage = (text) => {
    if (!content.languageGuide) return [];
    const lower = text.toLowerCase();
    return content.languageGuide.prohibited.filter(({ word }) => lower.includes(word.toLowerCase()));
  };

  const callAPI = async (msgs, sys) => {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": import.meta.env.VITE_ANTHROPIC_KEY, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
      body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, system: sys, messages: msgs }),
    });
    return r.json();
  };

  const pickScenario = (cat, sc) => {
    setCategory(cat); setScenario(sc);
    setMessages([{ role: "assistant", content: sc.opener }]);
    setExchanges(0); setDebrief(null);
    setStartTime(Date.now()); setElapsed(0);
    deliveryReport.resetSession();
    setPracticeMode("text");
    setScreen("practice");
  };

  const selectCategory = (cat) => {
    if (cat.scenarios.length === 1) { pickScenario(cat, cat.scenarios[0]); return; }
    setCategory(cat); setScreen("picker");
  };

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input.trim() };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs); setInput(""); setFlaggedWords([]); setLoading(true);
    const sys = PRACTICE_SYS + `\n\nSCENARIO: ${scenario.label}\nPERSONA: ${scenario.persona}`;
    try {
      const data = await callAPI(newMsgs.map(m => ({ role: m.role, content: m.content })), sys);
      setMessages(p => [...p, { role: "assistant", content: data.content?.[0]?.text || "Sorry, no response." }]);
      setExchanges(e => e + 1);
    } catch { setMessages(p => [...p, { role: "assistant", content: "Connection error. Please try again." }]); }
    setLoading(false);
  };

  const endSession = async () => {
    if (loading) return;
    setLoading(true);
    const allMsgs = [...messages, { role: "user", content: "END_SESSION_GET_FEEDBACK" }];
    const sys = PRACTICE_SYS + `\n\nSCENARIO: ${scenario.label}\nPERSONA: ${scenario.persona}`;
    try {
      const data = await callAPI(allMsgs.map(m => ({ role: m.role, content: m.content })), sys);
      setDebrief(parseDebrief(data.content?.[0]?.text || ""));
      setScreen("scorecard");
    } catch { alert("Error getting feedback. Please try again."); }
    setLoading(false);
  };

  const sendRef = async (q) => {
    const query = q || refInput.trim();
    if (!query || refLoading) return;
    const newMsgs = [...refMessages, { role: "user", content: query }];
    setRefMessages(newMsgs); setRefInput(""); setRefLoading(true);
    const sys = screen === "flipscript" ? FLIPSCRIPT_SYS : REFERENCE_SYS;
    try {
      const data = await callAPI(newMsgs.map(m => ({ role: m.role, content: m.content })), sys);
      setRefMessages(p => [...p, { role: "assistant", content: data.content?.[0]?.text || "Sorry, no response." }]);
    } catch { setRefMessages(p => [...p, { role: "assistant", content: "Connection error." }]); }
    setRefLoading(false);
  };

  const onKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } };
  const onRefKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendRef(); } };
  const goHome = () => { setScreen("home"); setMessages([]); setScenario(null); setCategory(null); setDebrief(null); setRefMessages([]); setRefInput(""); };
  const fmtTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  // ── HOME ──────────────────────────────────────────────────────
  if (screen === "home") return (
    <div style={{ minHeight: "100vh", background: CR, color: N, display: "flex", flexDirection: "column" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Inter:wght@400;500&display=swap'); * { box-sizing:border-box; margin:0; padding:0; } ::-webkit-scrollbar{width:3px} ::-webkit-scrollbar-thumb{background:rgba(13,34,64,0.2);border-radius:2px}`}</style>
      <TopBar showBack={false} lastFetched={content.lastFetched} />
      <div style={{ flex: 1, padding: "3rem 3rem 2.5rem", maxWidth: 960, margin: "0 auto", width: "100%" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1 style={{ fontFamily: PF, fontSize: 48, fontWeight: 400, color: N, lineHeight: 1.15, marginBottom: 10 }}>What do you want<br/>to practice?</h1>
          <p style={{ fontFamily: PF, fontSize: 20, color: BR, fontStyle: "italic", marginBottom: 14, lineHeight: 1.4 }}>Real conversations. Real feedback.</p>
          <p style={{ fontFamily: SF, fontSize: 14, color: M, lineHeight: 1.75, maxWidth: 500, margin: "0 auto" }}>Choose a category below. Each session puts you in a real conversation — end it whenever you're ready to see your score and coaching.</p>
        </div>

        {/* Categories */}
        <div style={{ fontFamily: SF, fontSize: 11, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: N, marginBottom: 14 }}>Practice categories</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 10 }}>
          {CATEGORIES.map(cat => (
            <div key={cat.id} onClick={() => selectCategory(cat)}
              style={{ background: W, border: `1px solid rgba(13,34,64,0.12)`, borderRadius: 10, padding: "14px 16px", cursor: "pointer", display: "flex", alignItems: "flex-start", gap: 12, transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.background = N; e.currentTarget.style.borderColor = N; e.currentTarget.querySelectorAll("[data-t]").forEach(el => el.style.color = CR); e.currentTarget.querySelectorAll("[data-d]").forEach(el => el.style.color = "rgba(248,244,238,0.6)"); e.currentTarget.querySelectorAll("[data-ic]").forEach(el => el.style.background = "rgba(255,255,255,0.1)"); }}
              onMouseLeave={e => { e.currentTarget.style.background = W; e.currentTarget.style.borderColor = "rgba(13,34,64,0.12)"; e.currentTarget.querySelectorAll("[data-t]").forEach(el => el.style.color = N); e.currentTarget.querySelectorAll("[data-d]").forEach(el => el.style.color = M); e.currentTarget.querySelectorAll("[data-ic]").forEach(el => el.style.background = CS); }}>
              <div data-ic style={{ width: 32, height: 32, borderRadius: 8, background: CS, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 16, transition: "background 0.15s" }}>{cat.icon}</div>
              <div>
                <div data-t style={{ fontFamily: PF, fontSize: 13, fontWeight: 500, color: N, marginBottom: 4, lineHeight: 1.3, transition: "color 0.15s" }}>{cat.title}</div>
                <div data-d style={{ fontFamily: SF, fontSize: 11, color: M, lineHeight: 1.55, transition: "color 0.15s" }}>{cat.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tools */}
        <div style={{ fontFamily: SF, fontSize: 11, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: N, marginBottom: 14, marginTop: 28 }}>Reference & tools</div>
        {[
          { screen: "reference", icon: "📖", title: "Field Guide reference", badge: "Quick lookup", desc: "Look up exact language, objection responses, stories, and the Credibility Stack." },
          { screen: "flipscript", icon: "🔄", title: "Flip the Script", badge: "Role reversal", desc: "You ask the hard question — the simulator shows you exactly how an expert would answer it." },
        ].map(tool => (
          <div key={tool.screen} onClick={() => setScreen(tool.screen)}
            style={{ background: W, border: `1px solid rgba(13,34,64,0.12)`, borderRadius: 10, padding: "13px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, marginBottom: 8, transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.background = N; e.currentTarget.style.borderColor = N; e.currentTarget.querySelectorAll("[data-tt]").forEach(el => el.style.color = CR); e.currentTarget.querySelectorAll("[data-td]").forEach(el => el.style.color = "rgba(248,244,238,0.6)"); e.currentTarget.querySelectorAll("[data-ta]").forEach(el => el.style.color = CR); }}
            onMouseLeave={e => { e.currentTarget.style.background = W; e.currentTarget.style.borderColor = "rgba(13,34,64,0.12)"; e.currentTarget.querySelectorAll("[data-tt]").forEach(el => el.style.color = N); e.currentTarget.querySelectorAll("[data-td]").forEach(el => el.style.color = M); e.currentTarget.querySelectorAll("[data-ta]").forEach(el => el.style.color = M); }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: CS, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 16 }}>{tool.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                <span data-tt style={{ fontFamily: PF, fontSize: 13, fontWeight: 500, color: N, transition: "color 0.15s" }}>{tool.title}</span>
                <span style={{ fontFamily: SF, fontSize: 10, background: CS, color: M, padding: "2px 8px", borderRadius: 20, fontWeight: 500 }}>{tool.badge}</span>
              </div>
              <div data-td style={{ fontFamily: SF, fontSize: 11, color: M, lineHeight: 1.55, transition: "color 0.15s" }}>{tool.desc}</div>
            </div>
            <div data-ta style={{ color: M, fontSize: 14, flexShrink: 0, transition: "color 0.15s" }}>→</div>
          </div>
        ))}

      </div>
    </div>
  );

  // ── PICKER ────────────────────────────────────────────────────
  if (screen === "picker") return (
    <div style={{ minHeight: "100vh", background: CR, display: "flex", flexDirection: "column" }}>
      <style>{`* { box-sizing:border-box; margin:0; padding:0; }`}</style>
      <TopBar sub={category?.title} showBack onBack={goHome} lastFetched={content.lastFetched} />
      <div style={{ flex: 1, padding: "2.5rem 3rem", maxWidth: 820, margin: "0 auto", width: "100%" }}>
        <div style={{ fontFamily: SF, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: BR, marginBottom: 8, fontWeight: 500 }}>Choose a scenario</div>
        <h2 style={{ fontFamily: PF, fontSize: 26, fontWeight: 400, color: N, marginBottom: 6 }}>{category?.title}</h2>
        <p style={{ fontFamily: SF, fontSize: 13, color: M, marginBottom: "1.75rem", lineHeight: 1.65 }}>{category?.desc}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {category?.scenarios.map(sc => {
            const ds = DIFF_STYLES[sc.difficulty] || DIFF_STYLES.Medium;
            return (
              <div key={sc.id} onClick={() => pickScenario(category, sc)}
                style={{ background: W, borderRadius: 10, borderLeft: `3px solid ${ds.border}`, border: `1px solid rgba(13,34,64,0.1)`, borderLeftWidth: 3, borderLeftColor: ds.border, padding: "14px 18px", cursor: "pointer", transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 2px 10px rgba(13,34,64,0.1)"; e.currentTarget.style.transform = "translateX(2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontFamily: PF, fontSize: 14, fontWeight: 500, color: N }}>{sc.label}</span>
                  <span style={{ fontFamily: SF, fontSize: 10, fontWeight: 500, background: ds.bg, color: ds.color, padding: "3px 10px", borderRadius: 10 }}>{sc.difficulty}</span>
                </div>
                <div style={{ fontFamily: PF, fontSize: 12, color: M, lineHeight: 1.6, fontStyle: "italic" }}>"{sc.opener.substring(0, 110)}..."</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // ── PRACTICE ──────────────────────────────────────────────────
  if (screen === "practice") {
    const ds = DIFF_STYLES[scenario?.difficulty] || DIFF_STYLES.Medium;
    return (
      <div style={{ minHeight: "100vh", background: CR, display: "flex", flexDirection: "column" }}>
        <style>{`* { box-sizing:border-box; margin:0; padding:0; } ::-webkit-scrollbar{width:3px} ::-webkit-scrollbar-thumb{background:rgba(13,34,64,0.15);border-radius:2px} @keyframes pulse{0%,100%{opacity:0.3}50%{opacity:1}}`}</style>
        <TopBar sub={scenario?.label} showBack onBack={goHome} lastFetched={content.lastFetched} />
        {/* Scenario strip */}
        <div style={{ background: W, borderBottom: `1px solid ${B}`, padding: "10px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: PF, fontSize: 14, fontWeight: 500, color: N }}>{scenario?.label}</span>
            <span style={{ fontFamily: SF, fontSize: 10, fontWeight: 500, background: ds.bg, color: ds.color, padding: "2px 9px", borderRadius: 10 }}>{scenario?.difficulty}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {voice.isMicSupported && (
              <div style={{ display: "flex", background: CS, borderRadius: 8, padding: 2, gap: 2 }}>
                <button onClick={() => setPracticeMode("text")}
                  style={{ background: practiceMode === "text" ? N : "transparent", color: practiceMode === "text" ? CR : M, border: "none", borderRadius: 6, padding: "5px 12px", fontFamily: SF, fontSize: 11, fontWeight: 500, cursor: "pointer" }}>
                  Text
                </button>
                <button onClick={() => setPracticeMode("voice")}
                  style={{ background: practiceMode === "voice" ? N : "transparent", color: practiceMode === "voice" ? CR : M, border: "none", borderRadius: 6, padding: "5px 12px", fontFamily: SF, fontSize: 11, fontWeight: 500, cursor: "pointer" }}>
                  🎙 Voice
                </button>
              </div>
            )}
            {voice.isSpeaking && (
              <button onClick={voice.stopSpeaking}
                style={{ display: "flex", alignItems: "center", gap: 5, background: "transparent", border: `1px solid ${BR}`, color: BRL, padding: "4px 10px", borderRadius: 12, cursor: "pointer", fontFamily: SF, fontSize: 11 }}>
                🔊 Speaking… tap to stop
              </button>
            )}
            <span style={{ fontFamily: SF, fontSize: 12, color: M, fontVariantNumeric: "tabular-nums" }}>{fmtTime(elapsed)}</span>
          </div>
        </div>
        {/* Chat */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px 16px" }}>
          {messages.map((m, i) => (
            <div key={i} style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: SF, fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: m.role === "user" ? BR : M, marginBottom: 6, textAlign: m.role === "user" ? "right" : "left" }}>
                {m.role === "user" ? "You" : scenario?.label}
              </div>
              <div style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                {m.role === "assistant" ? (
                  <div style={{ maxWidth: "80%", background: W, border: `1px solid rgba(13,34,64,0.1)`, borderRadius: "12px 12px 12px 2px", padding: "14px 18px", fontFamily: PF, fontSize: 14, lineHeight: 1.75, color: N, fontStyle: "italic", whiteSpace: "pre-wrap" }}>{m.content}</div>
                ) : (
                  <div style={{ maxWidth: "80%", background: N, borderRadius: "12px 12px 2px 12px", padding: "13px 16px", fontFamily: SF, fontSize: 14, lineHeight: 1.7, color: CR, whiteSpace: "pre-wrap" }}>{m.content}</div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: SF, fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: M, marginBottom: 6 }}>{scenario?.label}</div>
              <div style={{ background: W, border: `1px solid rgba(13,34,64,0.1)`, borderRadius: "12px 12px 12px 2px", padding: "14px 18px", display: "inline-flex", gap: 4 }}>
                {[0, 0.2, 0.4].map((d, i) => <span key={i} style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: M, animation: "pulse 1.2s ease-in-out infinite", animationDelay: d + "s" }} />)}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>
        {/* Input zone */}
        <div style={{ borderTop: `1px solid ${B}`, padding: "14px 28px 20px", background: CR, flexShrink: 0 }}>
          {flaggedWords.length > 0 && (
            <div style={{ marginBottom: 10, padding: "8px 14px", background: "#FEF3C7", borderRadius: 8, border: "1px solid #F59E0B", display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
              <span style={{ fontFamily: SF, fontSize: 11, fontWeight: 500, color: "#92400E" }}>⚠ Language flag:</span>
              {flaggedWords.map(({ word, substitute }) => (
                <span key={word} style={{ fontFamily: SF, fontSize: 11, color: "#92400E", background: "#FDE68A", padding: "2px 9px", borderRadius: 10 }}>
                  "{word}" → try "{substitute}"
                </span>
              ))}
            </div>
          )}
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end", marginBottom: 10 }}>
            <textarea ref={taRef} value={input}
              onChange={e => { setInput(e.target.value); setFlaggedWords(checkLanguage(e.target.value)); }}
              onKeyDown={onKey}
              readOnly={practiceMode === "voice"}
              style={{ flex: 1, background: practiceMode === "voice" ? CS : W, border: flaggedWords.length > 0 ? "1px solid #F59E0B" : `1px solid rgba(13,34,64,0.15)`, borderRadius: 8, color: N, padding: "11px 14px", fontFamily: PF, fontSize: 14, fontStyle: practiceMode === "voice" ? "italic" : "normal", lineHeight: 1.6, resize: "none", outline: "none", minHeight: 46 }}
              placeholder={practiceMode === "voice" ? "Tap the mic and speak your response…" : `Respond to ${scenario?.label}...`} rows={1} />
            {voice.isMicSupported && practiceMode === "voice" && (
              <button onClick={async () => {
                if (voice.isListening) {
                  voice.stopListening();
                } else {
                  voice.resetTranscript();
                  setInput("");
                  await pauseDetector.startMonitoring();
                  voice.startListening();
                }
              }}
                title={voice.isListening ? "Stop listening" : "Speak your response"}
                style={{ background: voice.isListening ? "#A33A3A" : N, border: `1px solid ${voice.isListening ? "#A33A3A" : N}`, color: CR, padding: "11px 16px", borderRadius: 8, cursor: "pointer", fontFamily: SF, fontSize: 13, fontWeight: 500, height: 46, flexShrink: 0, transition: "all 0.15s" }}>
                {voice.isListening ? "● Stop" : "🎙 Speak"}
              </button>
            )}
            <button onClick={send} disabled={loading || !input.trim()}
              style={{ background: N, border: "none", color: CR, padding: "11px 20px", borderRadius: 8, cursor: "pointer", fontFamily: SF, fontSize: 13, fontWeight: 500, height: 46, opacity: loading || !input.trim() ? 0.4 : 1, flexShrink: 0, transition: "opacity 0.15s" }}>Send</button>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button onClick={() => { setMessages([{ role: "assistant", content: scenario.opener }]); setExchanges(0); setStartTime(Date.now()); setElapsed(0); setFlaggedWords([]); deliveryReport.resetSession(); }}
              style={{ fontFamily: SF, fontSize: 11, color: M, background: "transparent", border: "none", cursor: "pointer", textDecoration: "underline", padding: 0 }}>Restart</button>
            {exchanges >= 1 ? (
              <button onClick={endSession} disabled={loading}
                style={{ background: BR, border: "none", color: W, padding: "9px 20px", borderRadius: 8, cursor: "pointer", fontFamily: SF, fontSize: 12, fontWeight: 500, opacity: loading ? 0.5 : 1, transition: "all 0.2s" }}>
                End conversation & get feedback →
              </button>
            ) : (
              <span style={{ fontFamily: SF, fontSize: 11, color: M, background: CS, padding: "9px 16px", borderRadius: 8 }}>
                Send a reply to unlock feedback
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── SCORECARD ─────────────────────────────────────────────────
  if (screen === "scorecard") return (
    <div style={{ minHeight: "100vh", background: CR, display: "flex", flexDirection: "column" }}>
      <style>{`* { box-sizing:border-box; margin:0; padding:0; } ::-webkit-scrollbar{width:3px} ::-webkit-scrollbar-thumb{background:rgba(13,34,64,0.15);border-radius:2px}`}</style>
      <TopBar sub="Session complete" showBack onBack={goHome} lastFetched={content.lastFetched} />
      <div style={{ background: W, borderBottom: `1px solid ${B}`, padding: "11px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <span style={{ fontFamily: PF, fontSize: 14, fontWeight: 500, color: N }}>{category?.title} · {scenario?.label}</span>
        <span style={{ fontFamily: SF, fontSize: 12, color: M }}>{exchanges} {exchanges === 1 ? "exchange" : "exchanges"} · {fmtTime(elapsed)}</span>
      </div>
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Transcript */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", borderRight: `1px solid ${B}` }}>
          <div style={{ fontFamily: SF, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: M, fontWeight: 500, marginBottom: 16 }}>Conversation</div>
          {messages.map((m, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ fontFamily: SF, fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: m.role === "user" ? BR : M, marginBottom: 5, textAlign: m.role === "user" ? "right" : "left" }}>
                {m.role === "user" ? "You" : scenario?.label}
              </div>
              <div style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                {m.role === "assistant" ? (
                  <div style={{ maxWidth: "88%", background: CS, border: `0.5px solid ${B}`, borderRadius: "8px 8px 8px 2px", padding: "9px 12px", fontFamily: PF, fontSize: 12, lineHeight: 1.65, color: N, fontStyle: "italic", whiteSpace: "pre-wrap" }}>{m.content}</div>
                ) : (
                  <div style={{ maxWidth: "88%", background: N, borderRadius: "8px 8px 2px 8px", padding: "9px 12px", fontFamily: SF, fontSize: 12, lineHeight: 1.65, color: CR, whiteSpace: "pre-wrap" }}>{m.content}</div>
                )}
              </div>
            </div>
          ))}
        </div>
        {/* Feedback panel */}
        <div style={{ width: 280, flexShrink: 0, overflowY: "auto", padding: "20px 20px" }}>
          {debrief && <>
            {/* Coach note — hero */}
            <div style={{ background: N, borderRadius: 10, padding: "16px 18px", marginBottom: 16 }}>
              <div style={{ fontFamily: SF, fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: BR, fontWeight: 500, marginBottom: 10 }}>Coach note</div>
              <div style={{ fontFamily: PF, fontSize: 13, lineHeight: 1.75, color: CR, fontStyle: "italic", marginBottom: 14 }}>{debrief.note}</div>
              <div style={{ borderTop: "0.5px solid rgba(255,255,255,0.1)", paddingTop: 12 }}>
                <div style={{ fontFamily: SF, fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>Focus for next time</div>
                <div style={{ fontFamily: SF, fontSize: 12, color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>{debrief.focus}</div>
              </div>
            </div>
            {/* Score tiles */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
              <div style={{ background: W, border: `0.5px solid ${B}`, borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ fontFamily: SF, fontSize: 10, color: M, marginBottom: 4 }}>Score</div>
                <div style={{ fontFamily: PF, fontSize: 24, fontWeight: 400, color: N, lineHeight: 1 }}>{debrief.score}<span style={{ fontFamily: SF, fontSize: 11, color: M, fontWeight: 400 }}> / 8</span></div>
              </div>
              <div style={{ background: W, border: `0.5px solid ${B}`, borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ fontFamily: SF, fontSize: 10, color: M, marginBottom: 4 }}>Strongest</div>
                <div style={{ fontFamily: SF, fontSize: 11, fontWeight: 500, color: N, lineHeight: 1.4 }}>{debrief.strongest}</div>
              </div>
            </div>
            {/* Score bars */}
            <div style={{ fontFamily: SF, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: M, fontWeight: 500, marginBottom: 12 }}>Score breakdown</div>
            <ScoreBar label="Aspiration Clarity" score={debrief.aspiration} />
            <ScoreBar label="Constraint Discovery" score={debrief.constraint} />
            <ScoreBar label="Decision Framing" score={debrief.decision} />
            <ScoreBar label="Simplicity & Confidence" score={debrief.simplicity} />
          </>}
          {deliveryReport.sessionReport && (
            <div style={{ marginTop: 16, background: W, border: `0.5px solid ${B}`, borderRadius: 10, padding: "14px 16px" }}>
              <div style={{ fontFamily: SF, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: M, fontWeight: 500, marginBottom: 12 }}>Delivery report · voice</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                <div>
                  <div style={{ fontFamily: PF, fontSize: 20, color: N, lineHeight: 1 }}>{deliveryReport.sessionReport.fillersPerTurn}</div>
                  <div style={{ fontFamily: SF, fontSize: 10, color: M, marginTop: 2 }}>filler words / turn</div>
                </div>
                <div>
                  <div style={{ fontFamily: PF, fontSize: 20, color: N, lineHeight: 1 }}>{deliveryReport.sessionReport.pausesPerTurn}</div>
                  <div style={{ fontFamily: SF, fontSize: 10, color: M, marginTop: 2 }}>pauses / turn (0.6s+)</div>
                </div>
              </div>
              {deliveryReport.sessionReport.topFillers.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
                  {deliveryReport.sessionReport.topFillers.map(f => (
                    <span key={f.term} style={{ fontFamily: SF, fontSize: 10, color: BRL, background: "#FAEEDA", padding: "2px 8px", borderRadius: 9 }}>
                      "{f.term}" × {f.count}
                    </span>
                  ))}
                </div>
              )}
              {deliveryReport.sessionReport.longestPauseOverall && (
                <div style={{ fontFamily: SF, fontSize: 11, color: N, lineHeight: 1.5, borderTop: `0.5px solid ${B}`, paddingTop: 10 }}>
                  <span style={{ color: BRL, fontWeight: 500 }}>Longest pause: </span>
                  {(deliveryReport.sessionReport.longestPauseOverall.durationMs / 1000).toFixed(1)}s
                  {deliveryReport.sessionReport.longestPauseOverall.afterPhrase && (
                    <> — right after <span style={{ fontStyle: "italic" }}>"…{deliveryReport.sessionReport.longestPauseOverall.afterPhrase.split(" ").slice(-6).join(" ")}"</span></>
                  )}
                </div>
              )}
              {deliveryReport.sessionReport.totalPauses === 0 && (
                <div style={{ fontFamily: SF, fontSize: 11, color: M, lineHeight: 1.5, borderTop: `0.5px solid ${B}`, paddingTop: 10 }}>
                  No pauses of 0.6s or longer detected — worth deliberately trying the Silence Drill next time.
                </div>
              )}
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
            <button onClick={() => { setMessages([{ role: "assistant", content: scenario.opener }]); setExchanges(0); setDebrief(null); setStartTime(Date.now()); setElapsed(0); deliveryReport.resetSession(); setPracticeMode("text"); setScreen("practice"); }}
              style={{ background: CS, border: `1px solid rgba(13,34,64,0.15)`, color: N, padding: "10px", borderRadius: 8, cursor: "pointer", fontFamily: SF, fontSize: 12, fontWeight: 500 }}>Try again</button>
            <button onClick={goHome}
              style={{ background: N, border: "none", color: CR, padding: "10px", borderRadius: 8, cursor: "pointer", fontFamily: SF, fontSize: 12, fontWeight: 500 }}>← New scenario</button>
          </div>
        </div>
      </div>
    </div>
  );

  // ── REFERENCE ─────────────────────────────────────────────────
  if (screen === "reference") return (
    <div style={{ minHeight: "100vh", background: CR, display: "flex", flexDirection: "column" }}>
      <style>{`* { box-sizing:border-box; margin:0; padding:0; } ::-webkit-scrollbar{width:3px} ::-webkit-scrollbar-thumb{background:rgba(13,34,64,0.15);border-radius:2px} @keyframes pulse{0%,100%{opacity:0.3}50%{opacity:1}}`}</style>
      <TopBar sub="Field Guide reference" showBack onBack={goHome} lastFetched={content.lastFetched} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {refMessages.length === 0 ? (
          <div style={{ padding: "2rem 3rem", flex: 1 }}>
            <h2 style={{ fontFamily: PF, fontSize: 28, fontWeight: 400, color: N, marginBottom: 8 }}>Ask anything.</h2>
            <p style={{ fontFamily: SF, fontSize: 13, color: M, lineHeight: 1.7, marginBottom: "1.75rem", maxWidth: 460 }}>Look up exact language, objection responses, which story fits a situation, words to avoid, or how the Credibility Stack works — all sourced live from the Field Guide.</p>
            <div style={{ fontFamily: SF, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: M, fontWeight: 500, marginBottom: 12 }}>Quick lookups</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: "2rem" }}>
              {QUICK_LOOKUPS.map(q => (
                <div key={q} onClick={() => sendRef(q)}
                  style={{ background: W, border: `1px solid rgba(13,34,64,0.12)`, borderRadius: 20, padding: "6px 14px", fontFamily: SF, fontSize: 12, color: N, cursor: "pointer", transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = N; e.currentTarget.style.color = CR; e.currentTarget.style.borderColor = N; }}
                  onMouseLeave={e => { e.currentTarget.style.background = W; e.currentTarget.style.color = N; e.currentTarget.style.borderColor = "rgba(13,34,64,0.12)"; }}>
                  {q}
                </div>
              ))}
            </div>
            <div style={{ background: W, border: `0.5px solid ${B}`, borderRadius: 10, padding: "16px 20px", maxWidth: 480 }}>
              <div style={{ fontFamily: SF, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: M, fontWeight: 500, marginBottom: 14 }}>You can ask things like</div>
              {EXAMPLE_QUESTIONS.map((q, i) => (
                <div key={i} onClick={() => sendRef(q)} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: i < EXAMPLE_QUESTIONS.length - 1 ? 12 : 0, cursor: "pointer" }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                  <span style={{ color: BR, fontSize: 14, flexShrink: 0, marginTop: 1 }}>›</span>
                  <span style={{ fontFamily: PF, fontSize: 13, color: N, lineHeight: 1.6, fontStyle: "italic" }}>{q}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, overflowY: "auto", padding: "24px 3rem" }}>
            {refMessages.map((m, i) => (
              <div key={i} style={{ marginBottom: "1.5rem" }}>
                <div style={{ fontFamily: SF, fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: m.role === "user" ? BR : M, marginBottom: 6, textAlign: m.role === "user" ? "right" : "left" }}>
                  {m.role === "user" ? "You" : "Field Guide"}
                </div>
                <div style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                  <div style={{ maxWidth: "82%", padding: "12px 16px", borderRadius: m.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px", background: m.role === "user" ? N : W, border: m.role === "user" ? "none" : `1px solid rgba(13,34,64,0.1)`, fontFamily: m.role === "user" ? SF : PF, fontSize: 14, lineHeight: 1.75, color: m.role === "user" ? CR : N, whiteSpace: "pre-wrap" }}>
                    {m.content}
                  </div>
                </div>
              </div>
            ))}
            {refLoading && (
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ fontFamily: SF, fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: M, marginBottom: 6 }}>Field Guide</div>
                <div style={{ background: W, border: `1px solid rgba(13,34,64,0.1)`, borderRadius: "12px 12px 12px 2px", padding: "14px 16px", display: "inline-flex", gap: 4 }}>
                  {[0, 0.2, 0.4].map((d, i) => <span key={i} style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: M, animation: "pulse 1.2s ease-in-out infinite", animationDelay: d + "s" }} />)}
                </div>
              </div>
            )}
            <div ref={refEndRef} />
          </div>
        )}
        <div style={{ borderTop: `1px solid ${B}`, padding: "12px 3rem 20px", background: CR, flexShrink: 0 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input value={refInput} onChange={e => setRefInput(e.target.value)} onKeyDown={onRefKey}
              style={{ flex: 1, background: W, border: `1px solid rgba(13,34,64,0.15)`, borderRadius: 8, color: N, padding: "11px 14px", fontFamily: PF, fontSize: 14, outline: "none", height: 46 }}
              placeholder="Ask about the Field Guide..." />
            <button onClick={() => sendRef()} disabled={refLoading || !refInput.trim()}
              style={{ background: N, border: "none", color: CR, padding: "11px 20px", borderRadius: 8, cursor: "pointer", fontFamily: SF, fontSize: 13, fontWeight: 500, height: 46, opacity: refLoading || !refInput.trim() ? 0.4 : 1, flexShrink: 0 }}>Ask</button>
          </div>
          {refMessages.length > 0 && <button onClick={() => setRefMessages([])} style={{ marginTop: 8, fontFamily: SF, fontSize: 11, color: M, background: "transparent", border: "none", cursor: "pointer", textDecoration: "underline" }}>Start over</button>}
        </div>
      </div>
    </div>
  );

  // ── FLIP THE SCRIPT ───────────────────────────────────────────
  if (screen === "flipscript") return (
    <div style={{ minHeight: "100vh", background: CR, display: "flex", flexDirection: "column" }}>
      <style>{`* { box-sizing:border-box; margin:0; padding:0; } ::-webkit-scrollbar{width:3px} ::-webkit-scrollbar-thumb{background:rgba(13,34,64,0.2);border-radius:2px} @keyframes pulse{0%,100%{opacity:0.3}50%{opacity:1}}`}</style>
      <TopBar sub="Flip the Script" showBack onBack={goHome} lastFetched={content.lastFetched} />
      <div style={{ background: W, borderBottom: `1px solid ${B}`, padding: "12px 28px", flexShrink: 0 }}>
        <div style={{ fontFamily: PF, fontSize: 16, fontWeight: 500, color: N, marginBottom: 4 }}>Flip the Script</div>
        <div style={{ fontFamily: SF, fontSize: 12, color: M, lineHeight: 1.6, maxWidth: 560 }}>You play the skeptic, prospect, or board member. Ask any hard question — the simulator responds as an expert Inperium leader, using the exact language and frameworks from the Field Guide.</div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {refMessages.length === 0 ? (
          <div style={{ padding: "2rem 3rem", flex: 1 }}>
            <div style={{ fontFamily: SF, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: BR, marginBottom: 14, fontWeight: 500 }}>Try one of these</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: "2rem" }}>
              {[
                "This sounds like private equity. What's the catch?",
                "We'll lose our independence if we do this.",
                "My board will never give up control.",
                "We're not in crisis — why would we do this now?",
                "Our culture is unique. You can't standardize what we do.",
                "Too good to be true. What am I actually giving up?",
                "What happens to our CEO?",
                "Our donors won't understand this.",
                "We tried a merger before and it was a disaster.",
                "This is just a way for you to extract value from us.",
              ].map(q => (
                <div key={q} onClick={() => sendRef(q)}
                  style={{ background: W, border: `1px solid rgba(13,34,64,0.15)`, borderRadius: 20, padding: "7px 14px", fontFamily: SF, fontSize: 12, color: N, cursor: "pointer", transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = N; e.currentTarget.style.color = CR; e.currentTarget.style.borderColor = N; }}
                  onMouseLeave={e => { e.currentTarget.style.background = W; e.currentTarget.style.color = N; e.currentTarget.style.borderColor = "rgba(13,34,64,0.15)"; }}>
                  {q}
                </div>
              ))}
            </div>
            <div style={{ background: W, border: `0.5px solid ${B}`, borderRadius: 10, padding: "14px 18px", maxWidth: 500 }}>
              <span style={{ fontFamily: SF, fontSize: 12, fontWeight: 500, color: N }}>How it works:</span>
              <span style={{ fontFamily: SF, fontSize: 12, color: M, lineHeight: 1.65 }}> Type any question or objection a prospect, board member, or donor might raise. The simulator responds the way a trained Inperium leader would — using the Credibility Stack, the right story, and the exact language from the Field Guide.</span>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, overflowY: "auto", padding: "24px 3rem" }}>
            {refMessages.map((m, i) => (
              <div key={i} style={{ marginBottom: "1.5rem" }}>
                <div style={{ fontFamily: SF, fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: m.role === "user" ? BR : M, marginBottom: 6, textAlign: m.role === "user" ? "right" : "left" }}>
                  {m.role === "user" ? "You (the skeptic)" : "Inperium leader"}
                </div>
                <div style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                  <div style={{ maxWidth: "82%", padding: "12px 16px", borderRadius: m.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px", background: m.role === "user" ? N : W, border: m.role === "user" ? "none" : `1px solid rgba(13,34,64,0.12)`, fontFamily: m.role === "user" ? SF : PF, fontSize: 14, lineHeight: 1.75, color: m.role === "user" ? CR : N, whiteSpace: "pre-wrap" }}>
                    {m.content}
                  </div>
                </div>
              </div>
            ))}
            {refLoading && (
              <div>
                <div style={{ fontFamily: SF, fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: M, marginBottom: 6 }}>Inperium leader</div>
                <div style={{ background: W, border: `1px solid rgba(13,34,64,0.12)`, borderRadius: "12px 12px 12px 2px", padding: "14px 16px", display: "inline-flex", gap: 4 }}>
                  {[0, 0.2, 0.4].map((d, i) => <span key={i} style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: M, animation: "pulse 1.2s ease-in-out infinite", animationDelay: d + "s" }} />)}
                </div>
              </div>
            )}
            <div ref={refEndRef} />
          </div>
        )}
        <div style={{ borderTop: `1px solid ${B}`, padding: "12px 3rem 20px", background: CR, flexShrink: 0 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input value={refInput} onChange={e => setRefInput(e.target.value)} onKeyDown={onRefKey}
              style={{ flex: 1, background: W, border: `1px solid rgba(13,34,64,0.15)`, borderRadius: 8, color: N, padding: "11px 14px", fontFamily: PF, fontSize: 14, outline: "none", height: 46 }}
              placeholder="Ask the hardest question you can think of..." />
            <button onClick={() => sendRef()} disabled={refLoading || !refInput.trim()}
              style={{ background: N, border: "none", color: CR, padding: "11px 20px", borderRadius: 8, cursor: "pointer", fontFamily: SF, fontSize: 13, fontWeight: 500, height: 46, opacity: refLoading || !refInput.trim() ? 0.4 : 1, flexShrink: 0 }}>Ask</button>
          </div>
          {refMessages.length > 0 && <button onClick={() => setRefMessages([])} style={{ marginTop: 8, fontFamily: SF, fontSize: 11, color: M, background: "transparent", border: "none", cursor: "pointer", textDecoration: "underline" }}>Start over</button>}
        </div>
      </div>
    </div>
  );

  return null;
}
