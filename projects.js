// Each entry: one row in the sidebar, one featured panel.
// `essay` is a plain-text file in essays/ (blank lines = paragraphs,
// short unpunctuated lines = headings, Markdown #/-/** also work).
// `url` makes the image and title clickable. Work diagrams are static SVGs
// rendered from diagrams/*.mmd by tools/render-diagrams.mjs.
// Landing panel, shown when no ?p= is given. "Home" heads the sidebar with
// no rows under it; clicking it, a row's X, or anywhere off the panel returns here.
// The tagline is the essay's first line, so it is dropped from the essay body.
window.HOME = {
  id: "home",
  title: "Home",
  tagline: '"You hypocrites! You know how to interpret the appearance of the earth and the sky; why do you not know how to interpret the present time?"',
  image: "images/me.jpg",
  alt: "Photo of Julian Vanecek",
  essay: "essays/personal_essay.txt",
  url: "https://github.com/jsvan",
};

window.FOLDERS = [
  {
    name: "Projects",
    items: [
      {
        id: "kreslit",
        title: "Kreslit",
        tagline: "LLM pipeline to convert essays into voiced, point and click explorable scene plays.",
        image: "images/kreslit.jpg",
        essay: "essays/kreslit_essay.txt",
        url: "https://kreslit.com",
      },
      {
        id: "news-bias",
        title: "News Bias Analyzer",
        tagline: "Compare and cluster news companies by their sentiment emissions",
        image: "images/nba.jpg",
        essay: "essays/news_bias_essay.txt",
        url: "https://jsvan.github.io/news_bias_analyzer_v2/",
      },
      {
        id: "ulisu",
        title: "U Lisu",
        tagline: "Offline converter of photos of book pages to flashcards",
        image: "images/ulisu.jpg",
        essay: "essays/ulisu_essay.txt",
        url: "https://www.ulisu.com",
      },
      {
        id: "smart-apartment",
        title: "Smart Apartment",
        tagline: "Dystopian Voice Controlled Apartment Simulation",
        image: "images/smart-apartment.jpg",
        essay: "essays/smart_apartment_essay.txt",
      },
      {
        id: "grimmsly",
        title: "Grimmsly",
        tagline: "Write Family Stories by Connecting to Local Writers",
        image: "images/grimmsly.jpg",
        essay: "essays/grimmsly_essay.txt",
        url: "https://www.grimmsly.com",
      },
      {
        id: "tgm",
        title: "TGM Propaganda Unit",
        tagline: "Holistically Tune an LLM to Deeply Hold Values",
        image: "images/tgm.jpg",
        essay: "essays/tgm_essay.txt",
        url: "https://ollama.com/bitsinthesky/tgm",
      },
      {
        id: "word-assoc",
        title: "Word Associations",
        tagline: "Compare implicit morality axis of words from different news outlets",
        image: "images/word-assoc.jpg",
        essay: "essays/word_assoc_essay.txt",
      },
      {
        id: "internal-voice",
        title: "Internal Voice",
        tagline: "Hear yourself the way you do",
        image: "images/internal-voice.jpg",
        essay: "essays/internal_voice_essay.txt",
        url: "https://jsvan.github.io/internal-voice/",
      },
    ],
  },
  {
    name: "Work Projects",
    items: [
      {
        id: "w-follow-ups",
        title: "Follow-up Questions",
        tagline: "A separate endpoint so the answer stream stays clean",
        essay: "essays/work/01-follow-ups.txt",
        image: "images/work/w-follow-ups.svg",
      },
      {
        id: "w-retrieval",
        title: "Retrieval Research",
        tagline: "Vector stores, parsers and thresholds, measured",
        essay: "essays/work/02-retrieval-research.txt",
        image: "images/work/w-retrieval.svg",
      },
      {
        id: "w-alerts",
        title: "Alert Explanation",
        tagline: "“Ask AI” on a dashboard alert",
        essay: "essays/work/03-alert-explanation.txt",
        image: "images/work/w-alerts.svg",
      },
      {
        id: "w-evals",
        title: "Evaluation Harness",
        tagline: "A regression gate for answers, refusals and alerts",
        essay: "essays/work/04-evaluation-harness.txt",
        image: "images/work/w-evals.svg",
      },
      {
        id: "w-docx",
        title: "DOCX Ingestion Pipeline",
        tagline: "Manuals to chunks, with every figure described",
        essay: "essays/work/05-docx-ingestion.txt",
        image: "images/work/w-docx.svg",
      },
      {
        id: "w-qdrant",
        title: "Qdrant Prototype",
        tagline: "Owning the retrieval layer",
        essay: "essays/work/06-qdrant-prototype.txt",
        image: "images/work/w-qdrant.svg",
      },
      {
        id: "w-gemini",
        title: "Gemini Robustness",
        tagline: "Invented tools, empty parts and dead responses",
        essay: "essays/work/07-gemini-robustness.txt",
        image: "images/work/w-gemini.svg",
      },
      {
        id: "w-clustering",
        title: "Chat-Log Clustering",
        tagline: "What do real users actually ask?",
        essay: "essays/work/08-chat-clustering.txt",
        image: "images/work/w-clustering.svg",
      },
      {
        id: "w-edge",
        title: "Edge RAG on a Jetson",
        tagline: "The assistant on a 1.2B model, on-device",
        essay: "essays/work/09-edge-rag.txt",
        image: "images/work/w-edge.svg",
      },
      {
        id: "w-rca",
        title: "Root-Cause Agent",
        tagline: "Cited root causes from 66 MB of noisy logs",
        essay: "essays/work/10-root-cause-agent.txt",
        image: "images/work/w-rca.svg",
      },
      {
        id: "w-code-agent",
        title: "Code-Investigation Sub-agent",
        tagline: "Handed facts, not theories",
        essay: "essays/work/11-code-subagent.txt",
        image: "images/work/w-code-agent.svg",
      },
      {
        id: "w-port",
        title: "Multi-Agent Port",
        tagline: "Moving onto a YAML-declared agent fleet",
        essay: "essays/work/12-multi-agent-port.txt",
        image: "images/work/w-port.svg",
      },
      {
        id: "w-routing",
        title: "Deterministic Alert Routing",
        tagline: "Don't make a model rediscover what the UI knows",
        essay: "essays/work/13-alert-routing.txt",
        image: "images/work/w-routing.svg",
      },
      {
        id: "w-guardrails",
        title: "QA Guardrails",
        tagline: "Each fix in the most general layer that holds",
        essay: "essays/work/14-qa-guardrails.txt",
        image: "images/work/w-guardrails.svg",
      },
      {
        id: "w-disclosure",
        title: "System-Prompt Disclosure Fix",
        tagline: "“Repeat the text above” worked",
        essay: "essays/work/15-prompt-disclosure.txt",
        image: "images/work/w-disclosure.svg",
      },
      {
        id: "w-codemaps",
        title: "Org-Wide Codemaps",
        tagline: "113 repositories mapped by parallel agents",
        essay: "essays/work/16-codemaps.txt",
        image: "images/work/w-codemaps.svg",
      },
    ],
  },
];
