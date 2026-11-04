import { NewsItem } from './newsTypes';

export const mockNewsData: NewsItem[] = [
  {
    name: "Next-Gen Quantum Processor Achieves Record-Breaking Stability at Room Temperature",
    url: "https://news.example.com/quantum-breakthrough",
    image: {
      thumbnail: {
        contentUrl: "/src/assets/images/science_discovery_1793301610963.jpg"
      }
    },
    description: "Researchers announce a major milestone in quantum computing architecture, overcoming decoherence challenges with advanced cryogenic-free silicon arrays.",
    datePublished: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    provider: [{ name: "Quantum Daily & Science Review" }],
    category: "ScienceAndTechnology",
    content: "In a landmark achievement for quantum engineering, a multinational research consortium has successfully operated a 1,024-qubit processor with near-zero error correction overhead. The breakthrough relies on novel topological qubits etched into ultra-pure silicon substrates, enabling stable computation without bulky liquid helium cooling infrastructure."
  },
  {
    name: "Global Markets Rally as Tech Giants Unveil Unified AI Infrastructure Standards",
    url: "https://news.example.com/markets-ai-rally",
    image: {
      thumbnail: {
        contentUrl: "/src/assets/images/market_business_1793301610055.jpg"
      }
    },
    description: "Equities surged across major indices today following an unprecedented industry agreement on interoperable neural network protocols and sustainable data centers.",
    datePublished: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    provider: [{ name: "Global Financial Times" }],
    category: "Business",
    content: "Stock markets worldwide recorded significant gains during Tuesday's trading session. Investors welcomed the newly signed Global AI Infrastructure Accord, which sets rigorous efficiency benchmarks and standardizes API integration protocols for enterprise cloud computing providers."
  },
  {
    name: "Sustainable Urban Design: How Eco-Corridors Are Transforming Metropolitan Living",
    url: "https://news.example.com/urban-harmony",
    image: {
      thumbnail: {
        contentUrl: "/src/assets/images/world_affairs_1793301610987.jpg"
      }
    },
    description: "City planners showcase award-winning vertical forests and zero-emission transit networks that reduce urban heat island effects by up to 6 degrees.",
    datePublished: new Date(Date.now() - 1000 * 60 * 240).toISOString(), // 4 hours ago
    provider: [{ name: "Architecture Monograph" }],
    category: "World",
    content: "Urban centers are undergoing a radical green transformation. Recent empirical studies across 40 major metropolitan areas demonstrate that integrating vertical vegetation facades and pedestrian-first kinetic transit corridors dramatically lowers carbon footprints while enhancing resident well-being."
  },
  {
    name: "Autonomous Neural Interfaces Enter Clinical Trials for Advanced Rehabilitation",
    url: "https://news.example.com/biotech-neural",
    image: {
      thumbnail: {
        contentUrl: "/src/assets/images/health_wellness_1793301611352.jpg"
      }
    },
    description: "Biotech innovators report successful preliminary trials of non-invasive brain-computer interfaces designed to restore motor function and neurological agility.",
    datePublished: new Date(Date.now() - 1000 * 60 * 360).toISOString(), // 6 hours ago
    provider: [{ name: "Medical Research Gazette" }],
    category: "Health",
    content: "Clinical trials for next-generation neural rehabilitation devices have yielded remarkable results. Utilizing high-density EEG arrays coupled with real-time generative neural decoders, patients have demonstrated unprecedented precision in prosthetic limb control and cognitive recovery."
  },
  {
    name: "Minimalist Curatorial Exhibitions Redefine Contemporary Art Spaces",
    url: "https://news.example.com/art-exhibition",
    image: {
      thumbnail: {
        contentUrl: "/src/assets/images/culture_arts_1793301610847.jpg"
      }
    },
    description: "Leading galleries adopt meditative spatial architectures that emphasize contemplative silence, raw timber surfaces, and natural daylight over crowded salon hangs.",
    datePublished: new Date(Date.now() - 1000 * 60 * 500).toISOString(), // 8 hours ago
    provider: [{ name: "Curatorial Review" }],
    category: "Entertainment",
    content: "The contemporary art world is shifting away from dense, high-stimulus exhibitions toward immersive minimalist spaces. By curating fewer works per gallery room and prioritizing acoustic dampening and natural light, curators are creating profound meditative encounters for visitors."
  },
  {
    name: "Artificial Intelligence Architecture and Autonomous Reasoning Models Reach New Heights",
    url: "https://news.example.com/ai-architecture",
    image: {
      thumbnail: {
        contentUrl: "/src/assets/images/hero_tech_news_1793301610308.jpg"
      }
    },
    description: "Deep learning researchers unveil self-verifying reasoning frameworks capable of autonomous hypothesis generation and rigorous mathematical proof verification.",
    datePublished: new Date(Date.now() - 1000 * 60 * 600).toISOString(), // 10 hours ago
    provider: [{ name: "Tech Frontier Journal" }],
    category: "ScienceAndTechnology",
    content: "A paradigm shift is underway in artificial intelligence research. New multimodal models feature built-in formal verification engines that check their own code and logical inferences step-by-step, virtually eliminating hallucination risks in scientific discovery workflows."
  },
  {
    name: "India's Clean Energy Grid Expansion Surpasses National Renewable Targets",
    url: "https://news.example.com/india-clean-energy",
    image: {
      thumbnail: {
        contentUrl: "/src/assets/images/world_affairs_1793301610987.jpg"
      }
    },
    description: "Massive solar parks and pumped storage hydro projects propel national renewable capacity ahead of schedule, powering millions of households cleanly.",
    datePublished: new Date(Date.now() - 1000 * 60 * 720).toISOString(), // 12 hours ago
    provider: [{ name: "National Chronicle" }],
    category: "India",
    content: "India has achieved a historic milestone in its clean energy transition. Accelerated deployment of ultra-mega solar photovoltaic arrays and advanced battery energy storage systems has enabled the national grid to operate on over 50% renewable power during peak daylight hours."
  }
];
