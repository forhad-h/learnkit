window.COURSE_CONFIG = {

  title: 'AI Engineering with Claude',
  icon: '🤖',
  subtitle: 'Claude API · Tool Use · Agent Loops · Real Projects',
  footer: 'AI Engineering with Claude: Agents · Tool Use · Real Projects · v2.0 · ' + new Date().getFullYear(),
  stateKey: 'ai_engineering_state',

  description: 'A fast, practical course — you will build and ship working AI agents with Claude Code that solve real problems by day 5. No fluff, no theory-first. You write code from module 1.',
  prerequisites: [
    'Python basics (functions, loops, dicts)',
    'Command line basics (cd, ls, pip install)',
    'A free Anthropic API key (claude.ai/settings → API keys)',
  ],
  timeCommitment: '2–3 hrs/day · 3–5 days',
  goal: 'Build and ship three working AI agents with Claude Code that solve real problems you care about',

  modules: [
    {
      id: 's1',
      num: '1',
      title: 'Claude API Setup & Your First Agent',
      tag: 'Do first',
      tagColor: 'green',
      file: 'module-1.html'
    },
    {
      id: 's2',
      num: '2',
      title: 'Prompt Engineering for Agents',
      tag: 'Core skill',
      tagColor: 'blue',
      file: 'module-2.html'
    },
    {
      id: 's3',
      num: '3',
      title: 'Tool Use: Give Your Agent Hands',
      tag: 'Core skill',
      tagColor: 'green',
      file: 'module-8.html'
    },
    {
      id: 's4',
      num: '4',
      title: 'Agent Architecture: Loops, Memory & State',
      tag: 'Core concept',
      tagColor: 'purple',
      file: 'module-7.html'
    },
    {
      id: 's5',
      num: '5',
      title: 'Building Agents with Claude Code SDK',
      tag: 'Core framework',
      tagColor: 'purple',
      file: 'module-9.html'
    },
    {
      id: 's6',
      num: '6',
      title: 'RAG: Give Your Agent Knowledge',
      tag: 'Core concept',
      tagColor: 'blue',
      file: 'module-5.html'
    },
    {
      id: 's7',
      num: '7',
      title: 'Ship It: Three Real-World Agent Projects',
      tag: 'Portfolio',
      tagColor: 'green',
      file: 'module-10.html'
    },
    {
      id: 's8',
      num: '8',
      title: 'Context Engineering',
      tag: 'Core skill',
      tagColor: 'blue',
      file: 'module-11.html'
    },
    {
      id: 's9',
      num: '9',
      title: 'Multi‑Agent Orchestration',
      tag: 'Core concept',
      tagColor: 'purple',
      file: 'module-12.html'
    },
  ],

  numColors: {
    s1: 'background:#f0fdf4;color:#16a34a;',
    s2: 'background:#eff6ff;color:#1d4ed8;',
    s3: 'background:#f0fdf4;color:#16a34a;',
    s4: 'background:#f3e8ff;color:#6b21a8;',
    s5: 'background:#f3e8ff;color:#6b21a8;',
    s6: 'background:#eff6ff;color:#1d4ed8;',
    s7: 'background:#fef3c7;color:#92400e;',
    s8: 'background:#eff6ff;color:#1d4ed8;',
    s9: 'background:#f3e8ff;color:#6b21a8;',
  },

};
