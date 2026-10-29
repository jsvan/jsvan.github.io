// Each entry: one row in the sidebar, one featured panel.
// `essay` is a plain-text file in essays/ (blank lines = paragraphs,
// short unpunctuated lines = headings, Markdown #/-/** also work).
// Taglines come from essays/descriptions.txt ("Title: tagline" per line).
// `url` makes the image and title clickable. Work diagrams are static SVGs
// rendered from diagrams/*.mmd by tools/render-diagrams.mjs.
// Landing panel, shown when no ?p= is given. "Home" is the first sidebar row,
// outside any folder; clicking it, a row's X, or anywhere off the panel returns here.
// Its tagline is the essay's first line, so it is dropped from the essay body.
window.HOME = {
  id: "home",
  title: "Home",
  image: "images/github.jpg",
  alt: "Julian Vanecek's GitHub profile",
  essay: "essays/personal_essay.txt",
  url: "https://github.com/jsvan",
};

window.FOLDERS = [
  {
    name: "Cultural Projects",
    items: [
      {
        id: "kreslit",
        title: "Kreslit",
        image: "images/kreslit.jpg",
        essay: "essays/kreslit_essay.txt",
        url: "https://kreslit.com",
      },
      {
        id: "news-bias",
        title: "News Bias Analyzer",
        image: "images/nba.jpg",
        essay: "essays/news_bias_essay.txt",
        url: "https://jsvan.github.io/news_bias_analyzer_v2/",
      },
      {
        id: "tgm",
        title: "TGM Propaganda Unit",
        image: "images/tgm.jpg",
        essay: "essays/tgm_essay.txt",
        url: "https://ollama.com/bitsinthesky/tgm",
      },
      {
        id: "word-assoc",
        title: "Word Associations",
        image: "images/word-assoc.jpg",
        essay: "essays/word_assoc_essay.txt",
      },
    ],
  },
  {
    name: "Language Projects",
    items: [
      {
        id: "ulisu",
        title: "U Lisu",
        image: "images/ulisu.jpg",
        essay: "essays/ulisu_essay.txt",
        url: "https://www.ulisu.com",
      },
      {
        id: "friend-swipe",
        title: "Narodni Trida",
        image: "images/friend-swipe.jpg",
        essay: "essays/friend_swipe_essay.txt",
        url: "https://narodnitrida.vercel.app",
      },
      {
        id: "glish",
        title: "-Glish",
        image: "images/glish.jpg",
        essay: "essays/glish_essay.txt",
        url: "https://github.com/jsvan/-glish",
      },
    ],
  },
  {
    name: "Other",
    items: [
      {
        id: "philbert",
        title: "Philbert",
        image: "images/philbert.jpg",
        alt: "Hilbert balls, a ball about a line, and the primal and dual views of an SVM separator",
        essay: "essays/philbert_essay.txt",
        url: "philbert/",
      },
      {
        id: "grimmsly",
        title: "Grimmsly",
        image: "images/grimmsly.jpg",
        essay: "essays/grimmsly_essay.txt",
        url: "https://www.grimmsly.com",
      },
      {
        id: "smart-apartment",
        title: "Smart Apartment",
        image: "images/smart-apartment.jpg",
        essay: "essays/smart_apartment_essay.txt",
      },
      {
        id: "internal-voice",
        title: "Internal Voice",
        image: "images/internal-voice.jpg",
        essay: "essays/internal_voice_essay.txt",
        url: "https://jsvan.github.io/internal-voice/",
      },
      {
        id: "bus-stop-bloom",
        title: "Bus Stop Bloom Filter",
        image: "images/bus-stop-bloom.png",
        essay: "essays/bus_stop_bloom_essay.txt",
        url: "https://github.com/jsvan/BusStopBloomfilter",
      },
    ],
  },
  {
    name: "Work Projects",
    items: [
      {
        id: "w-follow-ups",
        title: "Follow-up Questions",
        essay: "essays/work/01-follow-ups.txt",
        image: "images/work/w-follow-ups.svg",
      },
      {
        id: "w-retrieval",
        title: "Retrieval Research",
        essay: "essays/work/02-retrieval-research.txt",
        image: "images/work/w-retrieval.svg",
      },
      {
        id: "w-alerts",
        title: "Alert Explanation",
        essay: "essays/work/03-alert-explanation.txt",
        image: "images/work/w-alerts.svg",
      },
      {
        id: "w-evals",
        title: "Evaluation Harness",
        essay: "essays/work/04-evaluation-harness.txt",
        image: "images/work/w-evals.svg",
      },
      {
        id: "w-docx",
        title: "DOCX Ingestion Pipeline",
        essay: "essays/work/05-docx-ingestion.txt",
        image: "images/work/w-docx.svg",
      },
      {
        id: "w-qdrant",
        title: "Qdrant Prototype",
        essay: "essays/work/06-qdrant-prototype.txt",
        image: "images/work/w-qdrant.svg",
      },
      {
        id: "w-gemini",
        title: "Gemini Robustness",
        essay: "essays/work/07-gemini-robustness.txt",
        image: "images/work/w-gemini.svg",
      },
      {
        id: "w-clustering",
        title: "Chat-Log Clustering",
        essay: "essays/work/08-chat-clustering.txt",
        image: "images/work/w-clustering.svg",
      },
      {
        id: "w-edge",
        title: "Edge RAG on a Jetson",
        essay: "essays/work/09-edge-rag.txt",
        image: "images/work/w-edge.svg",
      },
      {
        id: "w-rca",
        title: "Root-Cause Agent",
        essay: "essays/work/10-root-cause-agent.txt",
        image: "images/work/w-rca.svg",
      },
      {
        id: "w-code-agent",
        title: "Code-Investigation Sub-agent",
        essay: "essays/work/11-code-subagent.txt",
        image: "images/work/w-code-agent.svg",
      },
      {
        id: "w-port",
        title: "Multi-Agent Port",
        essay: "essays/work/12-multi-agent-port.txt",
        image: "images/work/w-port.svg",
      },
      {
        id: "w-routing",
        title: "Deterministic Alert Routing",
        essay: "essays/work/13-alert-routing.txt",
        image: "images/work/w-routing.svg",
      },
      {
        id: "w-guardrails",
        title: "QA Guardrails",
        essay: "essays/work/14-qa-guardrails.txt",
        image: "images/work/w-guardrails.svg",
      },
      {
        id: "w-disclosure",
        title: "System-Prompt Disclosure Fix",
        essay: "essays/work/15-prompt-disclosure.txt",
        image: "images/work/w-disclosure.svg",
      },
      {
        id: "w-codemaps",
        title: "Org-Wide Codemaps",
        essay: "essays/work/16-codemaps.txt",
        image: "images/work/w-codemaps.svg",
      },
    ],
  },
];
