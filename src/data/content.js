// Single source of truth for everything the site says. Edit here, not in the components.

export const profile = {
  first: 'Vinit',
  last: 'Solanki',
  name: 'Vinit Solanki',
  role: 'AI & Data Engineer',
  company: 'Revcloud',
  base: 'Mumbai, MH',
  coords: '19.0760° N · 72.8777° E',
  email: 'vinit.solanki.dev@gmail.com',
  resume: 'https://drive.google.com/file/d/1d-eH7nl5ojW585L7XakN2ATu2jkg2pMk/view?usp=sharing',
  summary:
    'Data Engineer with hands-on experience building production ETL/ELT pipelines, AWS-based data lakes, incremental ingestion workflows and large-scale data enrichment systems.',
  focus:
    'Focused on scalable pipelines, automation, data quality and cost optimization — with Python, SQL, AWS Lambda, S3, SQS, Redshift and Medallion Architecture as the daily drivers.',
}

export const roles = [
  'AI & DATA ENGINEER',
  'BUILDS ETL / ELT PIPELINES',
  'RUNS AWS DATA LAKES',
  'ENRICHES DATA AT SCALE',
]

export const socials = [
  { key: 'github', label: 'GitHub', handle: 'vinit-solanki', href: 'https://github.com/vinit-solanki' },
  { key: 'linkedin', label: 'LinkedIn', handle: 'in/vinit-solanki', href: 'https://www.linkedin.com/in/vinit-solanki-ba091127b/' },
  { key: 'hashnode', label: 'Hashnode', handle: '@VinitSolanki05', href: 'https://hashnode.com/@VinitSolanki05' },
  { key: 'x', label: 'X / Twitter', handle: '@VINITSOLAN82916', href: 'https://x.com/VINITSOLAN82916' },
  { key: 'instagram', label: 'Instagram', handle: 'notanerd_005.jsx', href: 'https://www.instagram.com/notanerd_005.jsx/' },
]

export const dossier = [
  ['Subject', 'Vinit Solanki'],
  ['Designation', 'AI & Data Engineer'],
  ['Unit', 'Revcloud — Pune, MH'],
  ['Base', 'Mumbai, MH'],
  ['Training', 'B.E. AI & Data Science · VESIT'],
  ['Known for', 'Pipelines · Data lakes · Enrichment'],
]

export const metrics = [
  {
    value: 4.99,
    decimals: 2,
    suffix: 'M+',
    label: 'Public IPs enriched',
    note: 'Two unified IP-intelligence tables with zero unresolved addresses.',
  },
  {
    value: 10,
    suffix: '%',
    label: 'Revenue per lead',
    note: 'Up from 2% after replacing Glue jobs with a serverless ETL/ELT pipeline.',
  },
  {
    value: 30,
    prefix: '−',
    suffix: '%',
    label: 'Pipeline cost',
    note: '$300 → $211 a month on incremental Redshift loads.',
  },
  {
    value: 20,
    suffix: 'ms',
    label: 'Retrieval latency',
    note: 'Average song fetch on the Tunist streaming backend.',
  },
]

export const pipeline = {
  sources: ['SMS APIs', 'CSV drops', 'Redshift tables'],
  tiers: [
    { key: 'bronze', name: 'Bronze', note: 'raw' },
    { key: 'silver', name: 'Silver', note: 'validated' },
    { key: 'gold', name: 'Gold', note: 'curated' },
  ],
  consumers: ['Analytics', 'IP intelligence', 'AI / LLM apps'],
  log: [
    ['04H', 'incremental_load', '9 Redshift tables in sync'],
    ['DAILY', 'ip_enrichment', '4.99M+ public IPs, new + returning'],
    ['DAILY', 'dq_validation', '0 unresolved public IPs'],
    ['WEEKLY', 'full_reconcile', 'cost held at $211 / month'],
  ],
}

export const skills = [
  {
    key: 'de',
    code: 'A-01',
    title: 'Data Engineering',
    wide: true,
    items: [
      'ETL / ELT', 'Data Pipelines', 'Data Lakes', 'Medallion Architecture', 'Incremental Loading',
      'API Ingestion', 'Data Integration', 'Data Quality', 'Data Enrichment',
    ],
  },
  {
    key: 'aws',
    code: 'A-02',
    title: 'AWS',
    wide: true,
    items: ['S3', 'Lambda', 'SQS', 'Redshift', 'Glue', 'SES', 'IAM', 'DynamoDB', 'Secrets Manager'],
  },
  { key: 'lang', code: 'A-03', title: 'Languages', items: ['Python', 'SQL', 'C++'] },
  { key: 'db', code: 'A-04', title: 'Databases', items: ['Amazon Redshift', 'MySQL', 'MongoDB', 'Redis'] },
  { key: 'ml', code: 'A-05', title: 'Data & ML', items: ['Pandas', 'NumPy', 'Scikit-learn', 'Machine Learning', 'NLP'] },
  { key: 'ai', code: 'A-06', title: 'AI', items: ['LLM Integration', 'Prompt Engineering', 'CrewAI'] },
  {
    key: 'dev',
    code: 'A-07',
    title: 'Development & Tools',
    wide: true,
    items: ['REST APIs', 'Express.js', 'React.js', 'Docker', 'Git', 'GitHub', 'Postman'],
  },
]

export const marquee = [
  'ETL / ELT', 'AWS Lambda', 'Data Lakes', 'Amazon S3', 'Medallion Architecture', 'Amazon SQS',
  'Redshift', 'Python', 'SQL', 'Incremental Loading', 'Data Quality', 'Data Enrichment',
]

export const experience = [
  {
    id: 'OP-03',
    role: 'AI and Data Engineer',
    org: 'Revcloud',
    place: 'Pune, MH',
    period: 'Apr 2026 — Present',
    active: true,
    points: [
      'Architected a [[serverless ETL/ELT pipeline]] on Python, AWS Lambda, Amazon SQS and S3 with Medallion Architecture, ingesting SMS APIs and CSV data into a centralized data lake — replacing AWS Glue jobs and lifting [[Revenue Per Lead from 2% to 10%]].',
      'Built incremental-load pipelines onboarding [[9 tables from AWS Redshift]] on 4-hour, daily and weekly cadences, cutting monthly cost from [[$300 to $211 (~30%)]].',
      'Engineered two unified IP-intelligence tables covering [[4.99M+ public IPs]] — integrating FraudLogix, proxycheck.io, IP2Location and IP2Proxy for geolocation, proxy/VPN and bot-risk enrichment, with daily incremental ingestion and automated data-quality validation down to [[0 unresolved IPs]].',
      'Designed and developed an [[AI-powered HR platform]] with RBAC, automated hiring workflows, REST APIs and a personalized learning portal, reducing manual recruitment effort by [[20%]].',
    ],
    stack: ['Python', 'AWS Lambda', 'SQS', 'S3', 'Redshift', 'Medallion'],
  },
  {
    id: 'OP-02',
    role: 'Full Stack Web Developer',
    org: 'Prosmart Concepts',
    place: 'Mumbai, MH',
    period: 'Dec 2025',
    points: [
      'Developed a [[multi-catalogue product website]] with structured data ingestion and JSON transformation, backed by Express.js, MongoDB and REST APIs for dynamic product and media management on Cloudinary.',
    ],
    stack: ['Express.js', 'MongoDB', 'REST APIs', 'Cloudinary'],
  },
  {
    id: 'OP-01',
    role: 'Software Development Intern',
    org: 'Panache Digilife Pvt. Ltd., VESIT',
    place: 'Mumbai, MH',
    period: 'Feb 2025 — Mar 2025',
    points: [
      'Developed an [[AQI Forecasting System]] using Time Series Analysis, with forecasting models and dashboards trained on data from key locations across Mumbai.',
    ],
    stack: ['Python', 'Time Series', 'Forecasting'],
  },
]

export const education = {
  school: 'Vivekanand Education Society’s Institute of Technology',
  degree: 'B.E. in Artificial Intelligence and Data Science',
  period: 'Nov 2022 — May 2026',
  place: 'Mumbai, MH',
  score: 'CGPI 8.9',
}

export const extra = {
  role: 'Graphics Head',
  org: 'AI-CoLegion, VESIT',
  text: 'Managed events, co-hosted the Winter School 2025 ML Bootcamp, ran social media and graphics, and grew from junior to core member.',
}

export const commendations = [
  { kind: 'Hackathon', title: 'Invictus’26', detail: 'Runner Up' },
  { kind: 'Hackathon', title: 'Invictus’25', detail: 'Finalist' },
  { kind: 'Certification', title: 'AWS Cloud Foundation', detail: 'AWS' },
  { kind: 'Certification', title: 'Deep Learning Foundation', detail: 'Nvidia' },
  { kind: 'Certification', title: 'Complete Web Dev BootCamp 2025', detail: 'Udemy' },
]

export const featured = [
  {
    id: '001',
    visual: 'wave',
    name: 'Tunist',
    tagline: 'Music streaming backend with a recommendation engine',
    points: [
      'Scalable streaming backend serving album, artist and media data through REST APIs on Express.js, MongoDB, Redis and Cloudinary.',
      'Recommendation engine built on Pandas, Scikit-learn, PCA, KNN and cosine similarity.',
    ],
    stats: [
      ['20 ms', 'avg. song retrieval'],
      ['27K+', 'songs in the dataset'],
    ],
    tech: ['Express.js', 'MongoDB', 'Redis', 'Cloudinary', 'Scikit-learn'],
    github: 'https://github.com/vinit-solanki/Tunist',
    demo: 'https://tunist-frontend.vercel.app/',
  },
  {
    id: '002',
    visual: 'agents',
    name: 'DataCrew-AI',
    tagline: 'LLM-based multi-agent dataset analysis',
    points: [
      'Multi-agent application using CrewAI and Google Gemini for automated dataset analysis, natural-language querying and report generation.',
      'Data processing and visualization pipelines in Pandas, Matplotlib and Seaborn that surface interactive analytical insights.',
    ],
    stats: [
      ['Multi-agent', 'CrewAI orchestration'],
      ['NL → insight', 'ask the data in plain English'],
    ],
    tech: ['CrewAI', 'Google Gemini', 'Pandas', 'Matplotlib', 'Seaborn'],
    github: 'https://github.com/vinit-solanki/DataCrewAI',
  },
  {
    id: '003',
    visual: 'pulse',
    name: 'DocPlus',
    tagline: 'Doctor appointment booking platform',
    points: [
      'Appointment booking platform on React.js, Express.js and MongoDB.',
      'BotPress chatbot (Dr. Ross) for patient inquiries and a sandbox RazorPay payment flow.',
    ],
    stats: [
      ['Dr. Ross', 'BotPress patient chatbot'],
      ['Full stack', 'React · Express · MongoDB'],
    ],
    tech: ['React.js', 'Express.js', 'MongoDB', 'BotPress', 'RazorPay'],
    github: 'https://github.com/vinit-solanki/DocPlus',
    demo: 'https://docplus-frontend.vercel.app/',
  },
]

export const archive = [
  {
    id: '004',
    name: 'End-to-End Vendor Performance Analytics',
    category: 'DATA',
    tech: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'PowerBI'],
    github: 'https://github.com/vinit-solanki/End-To-End-Vendor-Performanc-Analytics',
  },
  {
    id: '005',
    name: 'AQI Forecasting System',
    category: 'ML',
    tech: ['Python', 'Time Series', 'XGBoost'],
    github: 'https://github.com/vinit-solanki/AQI-Prediction-System-Using-XGBoost',
  },
  {
    id: '006',
    name: 'Bank Customer Churn Prediction',
    category: 'ML',
    tech: ['Python', 'ANN', 'Pandas', 'Streamlit', 'Flask'],
    github: 'https://github.com/vinit-solanki/Churn-Prediction-ANN',
  },
  {
    id: '007',
    name: 'High-Frequency Trading Pipeline Simulation',
    category: 'SYSTEMS',
    tech: ['C++', 'OOP', 'STL', 'Algorithms'],
    github: 'https://github.com/vinit-solanki/C-OOPs/tree/main/hft-pipeline-sim',
  },
  {
    id: '008',
    name: 'Data Warehousing & Mining Lab',
    category: 'DATA',
    tech: ['Python', 'Data Warehousing', 'Data Mining'],
    github: 'https://github.com/vinit-solanki/DataWarehouse-Mining_Codes',
  },
  {
    id: '009',
    name: 'Task Manager — MERN',
    category: 'FULL STACK',
    tech: ['MongoDB', 'Express.js', 'React.js', 'Node.js'],
    github: 'https://github.com/vinit-solanki/TaskManager-MERN-App',
    demo: 'https://task-manager-mern-app-frontend.vercel.app/',
  },
  {
    id: '010',
    name: 'VFLIX — Streaming Frontend',
    category: 'FRONTEND',
    tech: ['React.js', 'Tailwind CSS'],
    github: 'https://github.com/vinit-solanki/streaming_website',
    demo: 'https://streaming-website-zeta.vercel.app/',
  },
  {
    id: '011',
    name: 'Amrutam Landing Pages',
    category: 'FRONTEND',
    tech: ['React.js', 'Tailwind CSS'],
    github: 'https://github.com/vinit-solanki/Amrutam_Landing_Pages',
    demo: 'https://amrutam-landing-pages.vercel.app/',
  },
  {
    id: '012',
    name: 'MyDrawer — Website Builder',
    category: 'FRONTEND',
    tech: ['React.js', 'React DnD', 'Tailwind CSS'],
    github: 'https://github.com/vinit-solanki/MyDrawer',
  },
]

export const nav = [
  { id: 'profile', label: 'Profile' },
  { id: 'arsenal', label: 'Arsenal' },
  { id: 'operations', label: 'Operations' },
  { id: 'cases', label: 'Case Files' },
  { id: 'terminal', label: 'Terminal' },
  { id: 'contact', label: 'Signal' },
]
