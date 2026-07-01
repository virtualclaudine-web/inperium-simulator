import { useState, useEffect } from "react";

const SITE_HOST = "inperiumservicesinc.sharepoint.com";
const SITE_PATH = "/sites/ApisVercel";

const LIST_NAMES = {
  toolkit: "Communication Toolkit",
  fieldGuide: "Field Guide Reference",
  language: "Language Guide",
  stories: "Stories",
  objections: "Objections",
  scenarios: "Scenarios",
};

async function getToken() {
  const res = await fetch("/api/sharepoint-token", { method: "POST" });
  const data = await res.json();
  if (!data.access_token) throw new Error("Token fetch failed: " + JSON.stringify(data));
  return data.access_token;
}

async function getSiteId(token) {
  const res = await fetch(
    `https://graph.microsoft.com/v1.0/sites/${SITE_HOST}:${SITE_PATH}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const data = await res.json();
  if (!data.id) throw new Error("Site ID fetch failed: " + JSON.stringify(data));
  return data.id;
}

async function getListItems(token, siteId, listName) {
  const encoded = encodeURIComponent(listName);
  const res = await fetch(
    `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${encoded}/items?expand=fields&$top=500`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const data = await res.json();
  if (!data.value) throw new Error(`List fetch failed for "${listName}": ` + JSON.stringify(data));
  return data.value.map(i => i.fields);
}

function buildToolkit(rows) {
  const active = rows.filter(r => r.field_4 === "Active");
  let text = `=== INPERIUM COMMUNICATIONS TOOLKIT v5 ===\n\n`;
  active.forEach(r => {
    const title = r.field_1 || "";
    const part = r.field_2 || "";
    const content = r.field_3 || "";
    text += `--- ${part} | ${title} ---\n${content}\n\n`;
  });
  return text;
}

function buildFieldGuide(rows) {
  const active = rows.filter(r => r.field_4 === "Active" || r.Status === "Active");
  let guide = `=== FIELD GUIDE QUICK REFERENCE ===\n\n`;
  active.forEach(r => {
    const num = r.Title || "";
    const title = r.field_1 || r["Section Title"] || "";
    const content = r.field_2 || r["Full Content"] || "";
    guide += `SECTION ${num} — ${title}\n${content}\n\n`;
  });
  return guide;
}

function buildLanguageGuide(rows) {
  const active = rows.filter(r => (r.field_4 === "Active" || r.Status === "Active") && r.Title);
  const isProhibited = (r) => {
    const val = r.field_3 || r["Triggers Flag (Real-Time)"] || r.TriggersFlag;
    return val === true || val === "TRUE" || val === "true";
  };
  const prohibited = active.filter(isProhibited).map(r => ({
    word: r.Title || "",
    substitute: r.field_1 || r["Start Saying"] || "",
    note: r.field_2 || r["Context Notes"] || "",
  }));
  const contextual = active.filter(r => !isProhibited(r)).map(r => ({
    word: r.Title || "",
    substitute: r.field_1 || r["Start Saying"] || "",
    note: r.field_2 || r["Context Notes"] || "",
  }));
  return { prohibited, contextual };
}

function buildStories(rows) {
  return rows.filter(r => (r.field_6 === "Active" || r.Status === "Active") && r.Title).map(r => ({
    id: r.Title || "",
    name: r.field_1 || r["Story Name"] || "",
    whenToUse: r.field_2 || r["When To Use"] || "",
    requiredElements: r.field_3 || r["Required Elements (must hit all)"] || "",
    summary: r.field_4 || r["60-Second Version"] || "",
    punchline: r.field_5 || r["Punchline / What It Teaches"] || "",
  }));
}

function buildObjections(rows) {
  return rows.filter(r => (r.field_6 === "Active" || r.Status === "Active") && r.Title).map(r => ({
    num: r.Title || "",
    objection: r.field_1 || r["The Objection"] || "",
    fear: r.field_2 || r["Fear Category"] || "",
    short: r.field_3 || r["30-Second Response"] || "",
    full: r.field_4 || r["2-Minute Response"] || "",
    avoid: r.field_5 || r["What NOT To Say"] || "",
  }));
}

function buildScenarios(rows) {
  return rows.filter(r => (r.field_7 === "Active" || r.Status === "Active") && r.Title).map(r => ({
    id: r.Title || "",
    title: r.field_1 || r.Title || "",
    text: r.field_2 || r["Scenario Text"] || "",
    character: r.field_3 || r["Prospect Character"] || "",
    difficulty: r.field_4 || r.Difficulty || "",
    chapter: r.field_5 || r["Chapter Reference"] || "",
    tags: r.field_6 || r["Framework Tags"] || "",
  }));
}

function buildSystemPrompt(toolkit, fieldGuide, stories, objections) {
  // Full Toolkit is the primary knowledge base — Field Guide adds the quick-reference layer
  let prompt = toolkit + "\n\n" + fieldGuide;
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
        const token = await getToken();
        const siteId = await getSiteId(token);
        const [tkRows, fgRows, lgRows, stRows, obRows, scRows] = await Promise.all([
          getListItems(token, siteId, LIST_NAMES.toolkit),
          getListItems(token, siteId, LIST_NAMES.fieldGuide),
          getListItems(token, siteId, LIST_NAMES.language),
          getListItems(token, siteId, LIST_NAMES.stories),
          getListItems(token, siteId, LIST_NAMES.objections),
          getListItems(token, siteId, LIST_NAMES.scenarios),
        ]);
        const toolkitText = buildToolkit(tkRows);
        if (tkRows.length > 0) {
          console.log("Toolkit active rows:", tkRows.filter(r => r.field_4 === "Active").length, "of", tkRows.length);
          console.log("Toolkit content length:", toolkitText.length, "chars");
        }
        const fieldGuideText = buildFieldGuide(fgRows);
        const languageGuide = buildLanguageGuide(lgRows);
        const stories = buildStories(stRows);
        const objections = buildObjections(obRows);
        const scenarios = buildScenarios(scRows);
        const systemPrompt = buildSystemPrompt(toolkitText, fieldGuideText, stories, objections);
        setState({
          loading: false, error: null,
          fieldGuideText, languageGuide, stories, objections, scenarios, systemPrompt,
          lastFetched: new Date(),
        });
      } catch (err) {
        console.error("SharePoint content fetch failed:", err);
        setState(prev => ({ ...prev, loading: false, error: err.message }));
      }
    }
    load();
  }, []);

  return state;
}
