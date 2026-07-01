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
  const active = rows.filter(r => r.Status === "Active");
  let text = `=== INPERIUM COMMUNICATIONS TOOLKIT v5 ===\n\n`;
  active.forEach(r => {
    const num = r["Section #"] || r.Section_x0020__x0023_ || r.Section_x0020__x23_ || r.Title || "";
    const title = r["Section Title"] || r.Section_x0020_Title || r.Title || "";
    const part = r["Part / Category"] || r.Part_x0020__x002F__x0020_Category || r.Part_x0020_x002F_x0020_Category || "";
    const content = r["Full Content"] || r.Full_x0020_Content || "";
    text += `--- ${part} | ${title} ---\n${content}\n\n`;
  });
  return text;
}

function buildFieldGuide(rows) {
  const active = rows.filter(r => r.Status === "Active");
  let guide = `=== FIELD GUIDE QUICK REFERENCE ===\n\n`;
  active.forEach(r => {
    const num = r["Section #"] || r.Section_x0020__x23_ || "";
    const title = r["Section Title"] || r.Section_x0020_Title || r.Title || "";
    const content = r["Full Content"] || r.Full_x0020_Content || "";
    guide += `SECTION ${num} — ${title}\n${content}\n\n`;
  });
  return guide;
}

function buildLanguageGuide(rows) {
  const active = rows.filter(r => r.Status === "Active");
  const isProhibited = (r) => {
    const val = r["Triggers Flag (Real-Time)"] || r.Triggers_x0020_Flag || r.TriggersFlag;
    return val === true || val === "TRUE" || val === "true";
  };
  const prohibited = active.filter(isProhibited).map(r => ({
    word: r["Stop Saying"] || r.Stop_x0020_Saying || r.Title || "",
    substitute: r["Start Saying"] || r.Start_x0020_Saying || "",
    note: r["Context Notes"] || r.Context_x0020_Notes || "",
  }));
  const contextual = active.filter(r => !isProhibited(r)).map(r => ({
    word: r["Stop Saying"] || r.Stop_x0020_Saying || r.Title || "",
    substitute: r["Start Saying"] || r.Start_x0020_Saying || "",
    note: r["Context Notes"] || r.Context_x0020_Notes || "",
  }));
  return { prohibited, contextual };
}

function buildStories(rows) {
  return rows.filter(r => r.Status === "Active").map(r => ({
    id: r.ID || "",
    name: r["Story Name"] || r.Title || "",
    whenToUse: r["When To Use"] || r.When_x0020_To_x0020_Use || "",
    requiredElements: r["Required Elements (must hit all)"] || r.Required_x0020_Elements || "",
    summary: r["60-Second Version"] || r._x0036_0_x002d_Second_x0020_Ve || "",
    punchline: r["Punchline / What It Teaches"] || r.Punchline || "",
  }));
}

function buildObjections(rows) {
  return rows.filter(r => r.Status === "Active").map(r => ({
    num: r["#"] || r.Title || "",
    objection: r["The Objection"] || r.Title || "",
    fear: r["Fear Category"] || r.Fear_x0020_Category || "",
    short: r["30-Second Response"] || "",
    full: r["2-Minute Response"] || "",
    avoid: r["What NOT To Say"] || "",
  }));
}

function buildScenarios(rows) {
  return rows.filter(r => r.Status === "Active").map(r => ({
    id: r.ID || "",
    title: r.Title || "",
    text: r["Scenario Text"] || r.Scenario_x0020_Text || "",
    character: r["Prospect Character"] || r.Prospect_x0020_Character || "",
    difficulty: r.Difficulty || "",
    chapter: r["Chapter Reference"] || r.Chapter_x0020_Reference || "",
    tags: r["Framework Tags"] || r.Framework_x0020_Tags || "",
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
        if (tkRows.length > 0) console.log("Toolkit fields:", Object.keys(tkRows[0]));
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
