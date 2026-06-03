import { useState, useEffect } from "react";

const SHEET_ID = "1OHCHgD-c47OxcF6eSnvP6y0mauy5qFhz83aR-iuqeqU";
const API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;

const RANGES = [
  "Field Guide Reference!A4:F100",
  "Language Guide!A4:E100",
  "Stories!A4:G100",
  "Objections!A4:G100",
  "Scenarios!A4:J100",
];

async function fetchRange(range) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(range)}?key=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Sheets fetch failed: ${res.status}`);
  const data = await res.json();
  return data.values || [];
}

function buildFieldGuide(rows) {
  // Each row: [Section#, Title, Full Content, Chapter Reference, Status, Last Reviewed]
  const active = rows.filter(r => r[4] === "Active");
  let guide = `=== INPERIUM COMMUNICATIONS FIELD GUIDE & TOOLKIT ===\n\n`;
  active.forEach(r => {
    guide += `SECTION ${r[0]} — ${r[1]}\n${r[2]}\n\n`;
  });
  return guide;
}

function buildLanguageGuide(rows) {
  // Each row: [Stop Saying, Start Saying, Context Notes, Triggers Flag, Status]
  const active = rows.filter(r => r[4] === "Active");
  const prohibited = active.filter(r => r[3] === "TRUE").map(r => ({
    word: r[0],
    substitute: r[1],
    note: r[2],
  }));
  const contextual = active.filter(r => r[3] === "FALSE").map(r => ({
    word: r[0],
    substitute: r[1],
    note: r[2],
  }));
  return { prohibited, contextual };
}

function buildStories(rows) {
  // Each row: [ID, Story Name, When To Use, Required Elements, 60-Second Version, Punchline, Status]
  return rows
    .filter(r => r[6] === "Active")
    .map(r => ({
      id: r[0],
      name: r[1],
      whenToUse: r[2],
      requiredElements: r[3],
      summary: r[4],
      punchline: r[5],
    }));
}

function buildObjections(rows) {
  // Each row: [#, Objection, Fear Category, 30-Second, 2-Minute, What NOT To Say, Status]
  return rows
    .filter(r => r[6] === "Active")
    .map(r => ({
      num: r[0],
      objection: r[1],
      fear: r[2],
      short: r[3],
      full: r[4],
      avoid: r[5],
    }));
}

function buildScenarios(rows) {
  // Each row: [ID, Title, Scenario Text, Prospect Character, Difficulty, Chapter Reference, Framework Tags, Status, Last Reviewed, Toolkit Version]
  return rows
    .filter(r => r[7] === "Active")
    .map(r => ({
      id: r[0],
      title: r[1],
      text: r[2],
      character: r[3],
      difficulty: r[4],
      chapter: r[5],
      tags: r[6],
    }));
}

function buildSystemPrompt(fieldGuide, stories, objections) {
  let prompt = fieldGuide;

  if (stories.length) {
    prompt += `\n\n=== STORY LIBRARY (${stories.length} stories) ===\n`;
    stories.forEach(s => {
      prompt += `\n${s.name}\nWhen to use: ${s.whenToUse}\nRequired elements: ${s.requiredElements}\n60-second version: ${s.summary}\nPunchline: ${s.punchline}\n`;
    });
  }

  if (objections.length) {
    prompt += `\n\n=== OBJECTION BANK (${objections.length} objections) ===\n`;
    objections.forEach(o => {
      prompt += `\n${o.num}. "${o.objection}" [${o.fear}]\n30-second: ${o.short}\nFull: ${o.full}\nDo NOT say: ${o.avoid}\n`;
    });
  }

  return prompt;
}

export function useContent() {
  const [state, setState] = useState({
    loading: true,
    error: null,
    fieldGuideText: null,
    languageGuide: null,
    stories: null,
    objections: null,
    scenarios: null,
    systemPrompt: null,
    lastFetched: null,
  });

  useEffect(() => {
    async function load() {
      try {
        const [fgRows, lgRows, stRows, obRows, scRows] = await Promise.all(
          RANGES.map(fetchRange)
        );

        const fieldGuideText = buildFieldGuide(fgRows);
        const languageGuide = buildLanguageGuide(lgRows);
        const stories = buildStories(stRows);
        const objections = buildObjections(obRows);
        const scenarios = buildScenarios(scRows);
        const systemPrompt = buildSystemPrompt(fieldGuideText, stories, objections);

        setState({
          loading: false,
          error: null,
          fieldGuideText,
          languageGuide,
          stories,
          objections,
          scenarios,
          systemPrompt,
          lastFetched: new Date(),
        });
      } catch (err) {
        console.error("Content fetch failed:", err);
        setState(prev => ({ ...prev, loading: false, error: err.message }));
      }
    }

    load();
  }, []);

  return state;
}
