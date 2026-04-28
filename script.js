const GROQ_KEY = "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";
const TAVILY_KEY = "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";

const PRINCE_INFO = `
ABOUT PRINCE GAJERA (also known as GP):

--- PERSONAL INFO ---
- Full Name: Prince Gajera (Gajera Prince Shaileshbhai)
- Nickname / Chatbot Name: GP (stands for Gajera Prince)
- Age: 20 years old
- City: Ahmedabad, Gujarat, India
- Address: Shree Swaminarayan Gurukul, Bh. Container Depo, Ahmedabad, Gujarat 382501
- Mobile: +91 9727031027
- Email: Princegajera944@gmail.com
- LinkedIn: GajeraPrince
- GitHub: princegajera1
- Hobbies: Reading books and coding
- Personality: Smart, passionate about technology, loves building things, reader and developer

--- CURRENT INTERNSHIP ---
- Company: Shreeji Software (www.shreejisoftware.com)
- Position: Software Development Intern
- Stipend: Rs. 6,000 per month (inclusive all benefits)
- Duration: 3 months starting from 15/04/2026
- Offer Letter Date: 15/04/2026
- Signed by: Mr. Rahul Dhakecha (Shreeji Software)
- Company Address: A-914, Money Plant High Street, Jagatpur Road, Nr. BSNL Office, Gota, Ahmedabad, Gujarat 382470

--- PREVIOUS INTERNSHIP EXPERIENCE ---
- Generative AI Internship at Prodigy InfoTech
  Duration: 01/07/2025 – 31/07/2025 (1 month), Ahmedabad
  Gained hands-on experience in AI tools and techniques. Received outstanding performance remarks.

--- EDUCATION ---
1. B.E. in Computer Engineering
   College: SAL Engineering and Technical Institute (Affiliated to GTU)
   Duration: 07/2023 – Present, Ahmedabad, Gujarat

2. Higher Secondary School Certificate (HSC)
   Percentage: 66.46%
   Duration: 06/2021 – 04/2023, Amreli, Gujarat

3. Secondary School Certificate (SSC)
   Percentage: 69.95%
   Duration: 06/2019 – 04/2021, Amreli, Gujarat

--- TECHNICAL SKILLS ---
- Programming Languages: C, Java, Python
- Web Technologies: HTML, CSS, JavaScript, React.js
- Libraries & Frameworks: React Router, Tailwind CSS, Material UI
- Tools: Git, GitHub, VS Code, Vite
- Core Concepts: Data Structures, Problem Solving

--- PROJECTS ---
1. Advanced Animated Login & Registration System
   - Modern UI authentication interface using HTML, CSS & JavaScript
   - Smooth animated transitions between Sign In and Sign Up panels

2. Coffee Shop Website (Responsive UI Design)
   - Responsive Coffee Shop website using HTML, CSS, JavaScript & Swiper.js
   - Testimonial slider, mobile nav menu, contact form validation

3. Quiz Web Application
   - React + Vite quiz app with dynamic question handling and score tracking
   - Modern JavaScript (ES6+) component-based architecture

4. Shiramani Web Application
   - React + Material UI with image cropping using Fabric.js
   - Responsive, scalable frontend with reusable components

--- CERTIFICATES ---
1. Python 101 for Data Science (IBM Cognitive Class)
2. Communication Skills (TCS iON)
3. Interview Skills (TCS iON)
4. Generative AI Internship (Prodigy InfoTech)
5. Business Etiquette (TCS iON)
6. Cyber Security Awareness (ISEA, Govt. of India)

--- RULES ---
- Age: always say 20 years old.
- College: SAL Engineering and Technical Institute, Ahmedabad (B.E. Computer Engineering, GTU).
- Current job: Software Development Intern at Shreeji Software, from 15 April 2026, Rs. 6,000/month.
- Previous internship: Generative AI at Prodigy InfoTech, July 2025, outstanding performance.
- Always be professional, warm, smart. Use emojis occasionally.
- If asked who made you: Prince Gajera made me — I am his personal AI assistant named GP.
- Answer general questions helpfully too.
`;

const tools = [
  {
    type: "function",
    function: {
      name: "search_web",
      description: "Search the web for real-time information, news, stock prices, weather, etc.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "The search query to look up on the internet."
          }
        },
        required: ["query"],
        additionalProperties: false
      },
      strict: true
    }
  }
];

let chatHistory = [{ role: "system", content: buildSystem() }];

function buildSystem() {
  return `You are GP Assistant, Prince Gajera's personal AI. 
Here is Prince's info:
${PRINCE_INFO}

CRITICAL INSTRUCTIONS:
- Today's date is: ${new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.
- You HAVE live internet access. Use the 'search_web' tool ONLY ONCE to fetch real-time data, news, or stock prices.
- Once you receive the search results, DO NOT use the tool again. Immediately answer the user based on the results.
- ALWAYS INCLUDE THE EXACT NUMBERS AND DATA from the search results in your final answer. Do not omit the actual prices or values.
- DO NOT use the search_web tool for questions about Prince's personal info, hobbies, or job. Use the provided info above.
- NEVER mention your "knowledge cutoff".
- ALWAYS calculate ages, current years, and time-based facts relative to Today's date.
- Respond in clear English. Be professional yet warm. Use emojis occasionally.`;
}

document.getElementById('startTime').textContent =
  new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

function addMsg(text, who) {
  const msgs = document.getElementById('msgs');
  const row = document.createElement('div');
  row.className = `msg-row ${who}`;
  const avHtml = who === 'gp'
    ? '<div class="msg-avatar">GP</div>'
    : '<div class="msg-avatar user-av">👤</div>';
  if (who === 'user') {
    row.innerHTML = `<div class="bubble user">${escHtml(text)}</div>${avHtml}`;
  } else {
    row.innerHTML = `${avHtml}<div class="bubble gp">${text}</div>`;
  }
  msgs.appendChild(row);
  msgs.scrollTop = msgs.scrollHeight;
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function showTyping() {
  const msgs = document.getElementById('msgs');
  const row = document.createElement('div');
  row.className = 'msg-row';
  row.id = 'typingRow';
  row.innerHTML = `<div class="msg-avatar">GP</div><div class="bubble gp"><div class="typing-dots"><span></span><span></span><span></span></div></div>`;
  msgs.appendChild(row);
  msgs.scrollTop = msgs.scrollHeight;
}
function hideTyping() {
  const t = document.getElementById('typingRow');
  if (t) t.remove();
}

async function executeWebSearch(query) {
  try {
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: TAVILY_KEY, query: query, include_answer: true })
    });
    const data = await res.json();
    if (data.detail) return `API Error: ${data.detail}`;
    if (data.answer) return data.answer;
    if (data.results && data.results.length > 0) {
      let content = data.results.map(r => `${r.title}: ${r.content}`).join('\n\n');
      return content.length > 1000 ? content.substring(0, 1000) + "..." : content;
    }
    return "No results found.";
  } catch(e) {
    return "Failed to search the web.";
  }
}

async function callGroq() {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + GROQ_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: chatHistory,
      tools: tools,
      tool_choice: "auto",
      max_tokens: 400
    })
  });
  return await res.json();
}

async function send() {
  const inp = document.getElementById('inp');
  const text = inp.value.trim();
  if (!text) return;
  inp.value = '';

  // Prevent Token Rate Limit by keeping only the last 6 messages + system prompt
  if (chatHistory.length > 7) {
    chatHistory = [chatHistory[0], ...chatHistory.slice(-6)];
  }

  addMsg(text, 'user');
  chatHistory.push({ role: 'user', content: text });
  showTyping();
  
  try {
    let data = await callGroq();
    if (Array.isArray(data) && data[0]?.error) throw new Error(data[0].error.message);
    if (data.error) throw new Error(data.error.message || "Invalid API Key or Connection Error");
    if (!data.choices) throw new Error("Invalid API response format. Please check your Groq API key.");
    let message = data.choices[0].message;
    
    if (data.usage) {
      const tc = document.getElementById('tokenCounter');
      if (tc) tc.textContent = `${data.usage.total_tokens} Tokens`;
    }

    // Handle tool calls in a loop in case the AI needs multiple searches
    let loopCount = 0;
    while (message.tool_calls && loopCount < 3) {
      chatHistory.push(message); // append assistant message with tool_calls
      
      for (const toolCall of message.tool_calls) {
        if (toolCall.function.name === 'search_web') {
          try {
            const args = JSON.parse(toolCall.function.arguments);
            const searchResult = await executeWebSearch(args.query);
            chatHistory.push({
              role: "tool",
              tool_call_id: toolCall.id,
              name: "search_web",
              content: searchResult
            });
          } catch(e) {
            chatHistory.push({ role: "tool", tool_call_id: toolCall.id, name: "search_web", content: "Error executing tool" });
          }
        }
      }
      // Call Groq again with the tool results
      data = await callGroq();
      if (Array.isArray(data) && data[0]?.error) throw new Error(data[0].error.message);
      if (data.error) throw new Error(data.error.message || "Invalid API Key or Connection Error");
      if (!data.choices) throw new Error("Invalid API response format. Please check your Groq API key.");
      message = data.choices[0].message;
      
      if (data.usage) {
        const tc = document.getElementById('tokenCounter');
        if (tc) tc.textContent = `${data.usage.total_tokens} Tokens`;
      }
      
      loopCount++;
    }

    let reply = message.content;
    if (!reply && loopCount >= 3) {
      reply = "I searched the web but couldn't find a specific answer for that right now.";
    } else if (!reply) {
      reply = "I'm not sure how to respond to that.";
    }
    
    chatHistory.push({ role: 'assistant', content: reply });
    hideTyping();
    addMsg(reply, 'gp');
  } catch (e) {
    console.error(e);
    hideTyping();
    addMsg(`Error: ${e.message} 🔌`, 'gp');
  }
}

function quickSend(text) {
  document.getElementById('inp').value = text;
  send();
}

function newChat() {
  chatHistory = [{ role: 'system', content: buildSystem() }];
  document.getElementById('msgs').innerHTML = `
    <div class="time-label">${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
    <div class="msg-row">
      <div class="msg-avatar">GP</div>
      <div class="bubble gp">New session started! 🚀 Hey again — what would you like to know?</div>
    </div>`;
  const toast = document.getElementById('toast');
  toast.style.opacity = '1';
  setTimeout(() => toast.style.opacity = '0', 2200);
}
