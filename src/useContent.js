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
  // Filter out header rows (the title/subtitle rows at top of imported CSV)
  const active = rows.filter(r => r.field_5 === "Active" || r.Status === "Active");
  let text = `=== INPERIUM COMMUNICATIONS TOOLKIT v5 ===\n\n`;
  active.forEach(r => {
    const title = r.field_2 || r["Section Title"] || r.Title || "";
    const part = r.field_3 || r["Part / Category"] || "";
    const content = r.field_4 || r["Full Content"] || r.Full_x0020_Content || "";
    text += `--- ${part} | ${title} ---\n${content}\n\n`;
  });
  return text;
}

function buildFieldGuide(rows) {
  // Filter out header rows
  const active = rows.filter(r => r.field_5 === "Active" || r.Status === "Active");
  let guide = `=== FIELD GUIDE QUICK REFERENCE ===\n\n`;
  active.forEach(r => {
    const num = r.field_1 || r["Section #"] || r.Section_x0020__x23_ || "";
    const title = r.field_2 || r["Section Title"] || r.Section_x0020_Title || r.Title || "";
    const content = r.field_3 || r["Full Content"] || r.Full_x0020_Content || "";
    guide += `SECTION ${num} — ${title}\n${content}\n\n`;
  });
  return guide;
}

function buildLanguageGuide(rows) {
  const active = rows.filter(r => (r.field_5 === "Active" || r.Status === "Active") && (r.field_1 || r["Stop Saying"]));
  const isProhibited = (r) => {
    const val = r.field_4 || r["Triggers Flag (Real-Time)"] || r.Triggers_x0020_Flag || r.TriggersFlag;
    return val === true || val === "TRUE" || val === "true";
  };
  const prohibited = active.filter(isProhibited).map(r => ({
    word: r.field_1 || r["Stop Saying"] || r.Stop_x0020_Saying || r.Title || "",
    substitute: r.field_2 || r["Start Saying"] || r.Start_x0020_Saying || "",
    note: r.field_3 || r["Context Notes"] || r.Context_x0020_Notes || "",
  }));
  const contextual = active.filter(r => !isProhibited(r)).map(r => ({
    word: r.field_1 || r["Stop Saying"] || r.Stop_x0020_Saying || r.Title || "",
    substitute: r.field_2 || r["Start Saying"] || r.Start_x0020_Saying || "",
    note: r.field_3 || r["Context Notes"] || r.Context_x0020_Notes || "",
  }));
  return { prohibited, contextual };
}

function buildStories(rows) {
  return rows.filter(r => (r.field_7 === "Active" || r.Status === "Active") && (r.field_2 || r["Story Name"])).map(r => ({
    id: r.field_1 || r.ID || "",
    name: r.field_2 || r["Story Name"] || r.Title || "",
    whenToUse: r.field_3 || r["When To Use"] || r.When_x0020_To_x0020_Use || "",
    requiredElements: r.field_4 || r["Required Elements (must hit all)"] || r.Required_x0020_Elements || "",
    summary: r.field_5 || r["60-Second Version"] || r._x0036_0_x002d_Second_x0020_Ve || "",
    punchline: r.field_6 || r["Punchline / What It Teaches"] || r.Punchline || "",
  }));
}

function buildObjections(rows) {
  return rows.filter(r => (r.field_7 === "Active" || r.Status === "Active") && (r.field_2 || r["The Objection"])).map(r => ({
    num: r.field_1 || r["#"] || r.Title || "",
    objection: r.field_2 || r["The Objection"] || r.Title || "",
    fear: r.field_3 || r["Fear Category"] || r.Fear_x0020_Category || "",
    short: r.field_4 || r["30-Second Response"] || "",
    full: r.field_5 || r["2-Minute Response"] || "",
    avoid: r.field_6 || r["What NOT To Say"] || "",
  }));
}

function buildScenarios(rows) {
  return rows.filter(r => (r.field_8 === "Active" || r.Status === "Active") && (r.field_2 || r["Scenario Text"])).map(r => ({
    id: r.field_1 || r.ID || "",
    title: r.field_2 || r.Title || "",
    text: r.field_3 || r["Scenario Text"] || r.Scenario_x0020_Text || "",
    character: r.field_4 || r["Prospect Character"] || r.Prospect_x0020_Character || "",
    difficulty: r.field_5 || r.Difficulty || "",
    chapter: r.field_6 || r["Chapter Reference"] || r.Chapter_x0020_Reference || "",
    tags: r.field_7 || r["Framework Tags"] || r.Framework_x0020_Tags || "",
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
          console.log("Toolkit fields:", Object.keys(tkRows[0]));
          console.log("Toolkit first row:", tkRows[0]);
          console.log("Toolkit active rows:", tkRows.filter(r => r.field_5 === "Active").length, "of", tkRows.length);
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
