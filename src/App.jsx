import React, { useEffect, useRef } from "react";
import {
  Github,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Code2,
  Brain,
  Database,
  Sparkles,
  ArrowUpRight,
  Briefcase,
  GraduationCap,
  Award,
  Twitter,
  Instagram,
} from "lucide-react";

const App = () => {
  /* ------------------------ Smooth Cursor Orb ------------------------ */
  const orbRef = useRef(null);

  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      if (orbRef.current) {
        orbRef.current.style.transform = `translate(${mouseX - 300}px, ${
          mouseY - 300
        }px)`;
      }
      requestAnimationFrame(animate);
    };

    animate();
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  /* ------------------------ Data ------------------------ */

  const projects = [
  {
    name: "Tunist",
    tagline: "AI-Powered Music Recommendation Platform",
    description:
      "Microservice architecture with Express.js, MongoDB, Redis, and Cloudinary.",
    tech: ["Express.js", "MongoDB", "Redis", "Python", "ML"],
    github: "https://github.com/vinit-solanski/Tunist",
    demo: "https://tunist-frontend.vercel.app/",
    gradient: "from-purple-500 via-pink-500 to-rose-500",
  },
  {
    name: "DocPlus",
    tagline: "Healthcare Appointment Platform",
    description:
      "Doctor booking system with AI chatbot (Dr.Ross) using BotPress & RazorPay.",
    tech: ["React.js", "Express.js", "MongoDB", "BotPress"],
    github: "https://github.com/vinit-solanki/DocPlus",
    demo: "https://docplus-frontend.vercel.app/",
    gradient: "from-purple-500 via-pink-500 to-rose-500",
  },
  {
    name: "DataCrew-AI",
    tagline: "Agentic Data Analysis Platform",
    description:
      "CrewAI-powered analysis with Gemini API and dynamic visualization.",
    tech: ["CrewAI", "Gemini API", "Pandas", "Streamlit"],
    github: "https://github.com/vinit-solanki/DataCrewAI",
    demo: "#",
    gradient: "from-purple-500 via-pink-500 to-rose-500",
  },
  {
    name: "Modern Designed Task Manager MERN App",
    tagline: "End to End Task Management Application using MERN Stack",
    description:
      "A full-stack task management app with user authentication, CRUD operations, and responsive design.",
    tech: ["MongoDB", "Express.js", "React.js", "Node.js", "Tailwind CSS"],
    github: "https://github.com/vinit-solanki/TaskManager-MERN-App",
    demo: "https://task-manager-mern-app-frontend.vercel.app/",
    gradient: "from-cyan-500 via-blue-500 to-indigo-500",
  },
  {
    name: "End-To-End Vendor Performance Analytics",
    tagline: "Data Analysis at Production Scale",
    description:
      "Data Analysis + Best Practices",
    tech: [
      "Python",
      "Pandas",
      "NumPy",
      "Matplotlib",
      "PowerBI",
      "Data Analysis",
      "Data Visualization",
    ],
    github:
      "https://github.com/vinit-solanki/End-To-End-Vendor-Performanc-Analytics",
    demo: "#",
    gradient: "from-cyan-500 via-blue-500 to-indigo-500",
  },
  {
    name: "Bank Customer Churn Prediction using ANN",
    tagline: "ANN Model to Predict Customer Churn",
    description:
      "Build an Artificial Neural Network (ANN) model to predict customer churn for a bank using CrewAI and Gemini API for analysis and Streamlit for deployment.",
    tech: ["Python", "Deep Learning - ANN", "Pandas", "Streamlit", "Flask"],
    github: "https://github.com/vinit-solanki/Churn-Prediction-ANN",
    demo: "#",
    gradient: "from-cyan-500 via-blue-500 to-indigo-500",
  },
  {
    name: "AQI Forecasting System",
    tagline: "Time Series Forecasting using XGBoost",
    description:
      "XGBoost forecasting models for Mumbai AQI monitoring.",
    tech: ["Python", "Time Series", "XGBoost"],
    github:
      "https://github.com/vinit-solanki/AQI-Prediction-System-Using-XGBoost",
    demo: "",
    gradient: "from-orange-500 via-red-500 to-pink-500",
  },
  {
    name: "Streaming Website Frontend",
    tagline: "A frontend for a streaming website - VFLIX",
    description:
      "A responsive streaming website frontend using React.js and Tailwind CSS.",
    tech: ["React.js", "Tailwind CSS", "Responsive Design"],
    github: "https://github.com/vinit-solanki/streaming_website",
    demo: "https://streaming-website-zeta.vercel.app/",
    gradient: "from-orange-500 via-red-500 to-pink-500",
  },
  {
    name: "Amrutam Landing Pages",
    tagline: "Asthetics meets Functionality",
    description:
      "Frontend of landing pages for various Ayurvedic products using Pure React.js and Tailwind CSS.",
    tech: ["React.js", "Tailwind CSS", "Responsive Design"],
    github: "https://github.com/vinit-solanki/Amrutam_Landing_Pages",
    demo: "https://amrutam-landing-pages.vercel.app/",
    gradient: "from-orange-500 via-red-500 to-pink-500",
  },
  {
    name: "MyDrawer - Website Builder",
    tagline: "Simple Website Builder Template Website",
    description:
      "Simple website builder with drag & drop components (buttons, text, images).",
    tech: ["React.js", "React DnD", "Tailwind CSS"],
    github: "https://github.com/vinit-solanki/MyDrawer",
    demo: "#",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
  },
  {
    name: "Data Warehousing and Mining Codes",
    tagline: "DWM Lab Course",
    description:
      "Repository containing all DWM (TE/AIDS/SEM5) lab codes.",
    tech: ["Python", "Data Warehousing", "Data Mining"],
    github: "https://github.com/vinit-solanki/DataWarehouse-Mining_Codes",
    demo: "#",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
  },
  {
    name: "Movie Ticket Booking System in C++",
    tagline: "C++ in action",
    description:
      "Role-based Movie Ticket Booking System using OOP concepts in C++.",
    tech: ["C++", "OOP", "STL", "Algorithms"],
    github:
      "https://github.com/vinit-solanki/Movie-Ticket-Booking-System",
    demo: "#",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
  },
];


  const skillCategories = [
    {
      icon: <Code2 size={24} />,
      title: "Languages",
      skills: ["Python", "JavaScript", "C/C++", "Java", "SQL"],
      color: "cyan",
    },
    {
      icon: <Sparkles size={24} />,
      title: "Web Development",
      skills: ["React.js", "Node.js", "Express.js", "Tailwind CSS", "REST APIs"],
      color: "purple",
    },
    {
      icon: <Database size={24} />,
      title: "Data & Databases",
      skills: ["MongoDB", "PostgreSQL", "Redis", "MySQL"],
      color: "pink",
    },
    {
      icon: <Brain size={24} />,
      title: "ML & AI",
      skills: ["TensorFlow", "scikit-learn", "Pandas", "NumPy", "PySpark"],
      color: "blue",
    },
  ];

  const timeline = [
    {
      type: "work",
      icon: <Briefcase size={20} />,
      title: "Software Development Intern",
      org: "Panache Digilife Pvt. Ltd.",
      period: "Feb 2025 – Mar 2025",
      description: "Built AQI Forecasting System at production scale.",
      color: "blue",
    },
    {
      type: "education",
      icon: <GraduationCap size={20} />,
      title: "B.E. in AI & Data Science",
      org: "VESIT, Mumbai",
      period: "Nov 2022 – Present",
      description: "CGPI 8.82 — ML, Data Science, Software Engineering.",
      color: "purple",
    },
    {
      type: "leadership",
      icon: <Award size={20} />,
      title: "Graphics Head",
      org: "AI-CoLegion, VESIT",
      period: "Nov 2023 – Present",
      description: "Artwork, event management, website development.",
      color: "pink",
    },
  ];

  const achievements = [
    "Invictus'25 Hackathon Finalist",
    "Nvidia Deep Learning Certified",
    "AWS Cloud Foundation Certified",
    "Complete Web Development Bootcamp 2025",
  ];

  /* ======================================================================= */

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">

      {/* Smooth FOLLOWING ORB */}
      <div
        ref={orbRef}
        className="pointer-events-none fixed opacity-30 blur-3xl"
        style={{
          width: "600px",
          height: "600px",
          background:
            "radial-gradient(circle, rgba(234, 228, 239, 0.4), rgba(59,130,246,0.2), transparent)",
          top: 0,
          left: 0,
          willChange: "transform",
        }}
      />

      {/* ================================================================================================= */}
      {/* ========================================== HERO SECTION ========================================= */}
      {/* ================================================================================================= */}

      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">

        {/* Background image (PUBLIC FOLDER) */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
          style={{ backgroundImage: "url('/batman-bg.jpg')" }}
        ></div>

        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-20 max-w-5xl w-full text-center space-y-8">
          <div className="inline-block px-4 py-2 bg-white/5 border border-white/10 rounded-full">
            <span className="text-sm text-gray-300">Available for opportunities</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tight">
            Vinit Solanki
          </h1>

          <p className="text-2xl md:text-3xl text-gray-300">
            AI Engineer × Full Stack Developer
          </p>

          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Building intelligent systems and scalable applications.
          </p>

          <div className="flex flex-wrap gap-4 justify-center pt-6">
            <a href="#projects" className="group px-8 py-4 bg-white text-black rounded-full font-semibold">
              View My Work
              <ArrowUpRight className="inline ml-2 group-hover:-translate-y-1 transition" />
            </a>

            <a
              href="#contact"
              className="px-8 py-4 border border-white/20 rounded-full font-semibold hover:bg-white/5 transition"
            >
              Get In Touch
            </a>
          </div>
        </div>
      </section>

      {/* ================================================================================================= */}
      {/* ========================================== SKILLS SECTION ====================================== */}
      {/* ================================================================================================= */}

      <section className="relative py-20 px-6">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90"
          style={{ backgroundImage: "url('/batman-skills.jpg')" }}
        ></div>

        <div className="absolute inset-0 bg-black/30"></div>

        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold">Technical Arsenal</h2>
            <p className="text-gray-200">Technologies I work with daily</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-7">
            {skillCategories.map((category, idx) => (
              <div key={idx} className="group p-8 bg-white/5 border border-white/10 rounded-2xl">
                <div className={`inline-flex p-3 bg-${category.color}-500/10 rounded-lg`}>
                  {category.icon}
                </div>

                <h3 className="text-xl font-semibold mt-4 mb-4">{category.title}</h3>

                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 text-gray-300 bg-white/15 rounded-full border border-white/10 text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================================================= */}
      {/* ========================================== PROJECTS SECTION ==================================== */}
      {/* ================================================================================================= */}

      <section id="projects" className="relative py-20 px-6">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
          style={{ backgroundImage: "url('/batman-projects.jpg')" }}
        ></div>

        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative max-w-6xl mx-auto">

          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold">Featured Projects</h2>
            <p className="text-gray-200">Building solutions that matter</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {projects.map((project, idx) => (
              <div key={idx} className="group relative p-8 bg-white/5 border border-white/10 rounded-3xl">

                <div className="relative z-10">
                  <div className="flex justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold">{project.name}</h3>
                      <p className="text-gray-400 text-sm">{project.tagline}</p>
                    </div>

                    <div className="flex gap-2">
                      <a href={project.github} className="ml-3 p-2 rounded-lg">
                        <Github size={30} className="bg-black p-1 rounded-lg"/>
                      </a>

                      {project.demo !== "#" && (
                        <a href={project.demo} className="p-2 rounded-lg">
                          <ExternalLink size={30} className="bg-black p-1 rounded-lg"/>
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-400 mb-6">{project.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, i) => (
                      <span key={i} className="text-xs px-3 py-1 bg-white/10 rounded-full border border-white/20">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================================================= */}
      {/* ========================================== JOURNEY SECTION ===================================== */}
      {/* ================================================================================================= */}

      <section className="relative py-20 px-6">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
          style={{ backgroundImage: "url('/batman-journey.jpg')" }}
        ></div>

        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative max-w-4xl mx-auto">

          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold">Journey</h2>
            <p className="text-gray-200">Experience & Education</p>
          </div>

          <div className="space-y-10">
            {timeline.map((item, idx) => (
              <div key={idx} className="flex gap-6">

                <div className={`w-12 h-12 rounded-full bg-${item.color}-500/10 border border-${item.color}-500/30 flex items-center justify-center`}>
                  {item.icon}
                </div>

                <div className="flex-1 pb-8 border-b border-white/10">
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="text-gray-300">{item.org}</p>
                  <p className="text-gray-400 text-sm">{item.period}</p>
                  <p className="text-gray-300 text-sm mt-3">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 p-8 bg-white/5 border border-white/10 rounded-2xl">
            <h3 className="text-2xl font-semibold text-center mb-6">Achievements & Certifications</h3>

            <div className="grid md:grid-cols-2 gap-4">
              {achievements.map((ach, idx) => (
                <div key={idx} className="p-4 bg-white/5 rounded-lg border border-white/10 text-gray-300 text-lg">
                  {ach}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================================================= */}
      {/* ========================================== CONTACT SECTION ===================================== */}
      {/* ================================================================================================= */}

      <section id="contact" className="relative py-20 px-6">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
          style={{ backgroundImage: "url('/batman-footer.jpg')" }}
        ></div>

        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative max-w-4xl mx-auto text-center">

          <h2 className="text-5xl md:text-6xl font-bold mb-8">Let's Work Together</h2>

          <p className="text-xl text-gray-300 mb-10">
            Open to internships, collaborations, and exciting projects.
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">

            <a href="mailto:2022.vinit.solanki@ves.ac.in" className="p-6 bg-white/5 border border-white/10 rounded-2xl">
              <Mail className="mx-auto mb-3 text-red-400" size={32} />
              <p className="text-sm text-gray-400">Email</p>
              <p className="text-white">2022.vinit.solanki@ves.ac.in</p>
            </a>

            <a href="tel:7977675112" className="p-6 bg-white/5 border border-white/10 rounded-2xl">
              <Phone className="mx-auto mb-3 text-red-400" size={32} />
              <p className="text-sm text-gray-400">Phone</p>
              <p className="text-white">+91 7977675112</p>
            </a>
          </div>

          <div className="flex items-center justify-center gap-2 text-gray-200 mt-8">
            <MapPin size={20} />
            <span>Mumbai, Maharashtra, India</span>
          </div>

          <div className="flex gap-6 justify-center mt-8">
            <a href="https://github.com/vinit-solanki" className="p-4 bg-white/5 border border-white/10 rounded-xl">
              <Github size={24} />
            </a>

            <a href="https://www.linkedin.com/in/vinit-solanki-ba091127b/" className="p-4 bg-white/5 border border-white/10 rounded-xl">
              <Linkedin size={24} />
            </a>

            <a href="https://x.com/VINITSOLAN82916" className="p-4 bg-white/5 border border-white/10 rounded-xl">
              <Twitter size={24} />
            </a>

            <a href="https://www.instagram.com/notanerd_005.jsx/" className="p-4 bg-white/5 border border-white/10 rounded-xl">
              <Instagram size={24} />
            </a>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-8 px-6 text-center bg-black/80">
        <p className="text-gray-600">© 2025 Vinit Solanki • Crafted with React & Tailwind CSS</p>
        <p className="text-gray-700 text-sm mt-2">Last updated: November 27, 2025</p>
      </footer>
    </div>
  );
};

export default App;
