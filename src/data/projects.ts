export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  /** Single cover image path (relative to /public) */
  image?: string;
  /** Multiple images shown as a simple gallery */
  carouselImages?: string[];
  links?: ProjectLink[];
  techStack?: string[];
  /** "contain" shows carousel photos whole instead of cropping them to the frame */
  imageFit?: "cover" | "contain";
  /** Shows a "Try it live" button that opens the CV match window */
  liveDemo?: "cv-match";
}

const projects: Project[] = [
  {
    id: 1,
    title: "Growize App",
    description:
      "A mobile gardening assistant that uses AI to provide precise planting schedules for edible plants like potatoes and Kūmara. Built with React Native and Firebase for full-stack mobile development.",
    image: "/images/Growize_cover.jpg",
    links: [
      {
        label: "Website Version",
        url: "https://youtu.be/13jQNGben08",
      },
      {
        label: "iOS Mobile Version",
        url: "https://youtube.com/shorts/Hirs7L8AYwM?feature=share",
      },
    ],
    techStack: [
      "React Native",
      "Firebase",
      "Google Gemini AI",
      "JavaScript",
      "Mobile Development",
    ],
  },
  {
    id: 2,
    title: "Foodstuffs Data Pipeline",
    description:
      "End-to-end data pipeline delivering key metric insights for Cortex scorecards and Power BI dashboards. Built in Node.js, containerised with Docker, and deployed via Kubernetes.",
    image: "/images/Foodstuffs_project.png",
    links: [
      {
        label: "Work Experience Video",
        url: "https://youtu.be/mesa6q1y6Oo",
      },
    ],
    techStack: [
      "Node.js",
      "Docker",
      "Kubernetes",
      "Power BI",
      "Google Cloud Storage",
      "BigQuery",
      "REST APIs",
    ],
  },
  {
    id: 3,
    title: "AI Image Recognition",
    description:
      "Azure Custom Vision project to classify images in real time. Includes dataset preparation, model training and evaluation, and a simple REST integration.",
    image: "/images/AI_truck.jpg",
    links: [
      {
        label: "Demo Video",
        url: "https://youtu.be/D8pBg92bsQk",
      },
    ],
    techStack: [
      "Azure",
      "Azure Custom Vision",
      "React",
      "Express.js",
      "REST APIs",
    ],
  },
  {
    id: 4,
    title: "mySnapShare",
    description:
      "Event photo sharing: a host creates an event, guests scan a QR code to upload photos from their phones, and everyone sees them in one shared gallery. Next.js and TypeScript frontend on Vercel, with a Python FastAPI backend on AWS Lambda behind API Gateway, using Cognito, DynamoDB, S3 and CloudFront, all defined in AWS CDK.",
    image: "/images/mySnapShare_card.jpg",
    links: [
      {
        label: "Live Site",
        url: "https://my-snap-share.vercel.app",
      },
    ],
    techStack: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Python",
      "FastAPI",
      "AWS Lambda",
      "AWS CDK",
      "DynamoDB",
      "S3",
      "Cognito",
    ],
  },
  {
    id: 5,
    title: "Tautoko — RAG Support Assistant",
    description:
      "Proof-of-concept member portal and support assistant for a New Zealand carbon-certification body. Members ask questions in their own words and get answers grounded in the programme documents, citing the rule and page. A Bedrock guardrail keeps the assistant from advising members, protecting the certifier's ISO 14065 impartiality. Hybrid retrieval (embeddings + BM25), an eval gate on every change, and an admin review loop where a person approves each update before it goes live on AWS Lambda.",
    image: "/images/Tautoko_safety_layers.jpg",
    links: [],
    techStack: [
      "Python",
      "FastAPI",
      "RAG",
      "Anthropic API",
      "AWS Bedrock Guardrails",
      "AWS Lambda",
      "Next.js",
      "Terraform",
      "LLM Evals",
    ],
  },
  {
    id: 6,
    title: "Electronic Repairs",
    description:
      "Console-focused repairs and custom mods: HDMI/USB-C port replacements, power and overheating fixes, controller stick-drift repairs, SSD and cooling upgrades, and LED mods for PlayStation and Xbox.",
    carouselImages: [
      "/images/E1.JPG",
      "/images/E2.JPG",
      "/images/E3.JPG",
      "/images/E4.JPG",
    ],
    links: [
      {
        label: "PS5 Repair Video",
        url: "https://youtu.be/j_oQK9LvAjQ",
      },
    ],
    techStack: ["Electronic Repairs", "Problem Solving", "Debugging"],
  },
  {
    id: 7,
    title: "CV to Job Guestimator",
    description:
      "Fine-tuned Llama-3.2-3B with LoRA so three structured-extraction agents run on one small self-hosted model instead of a per-token API. Ships as a FastAPI pipeline that redacts PII, pulls the requirements out of a job listing and scores a CV against them, served either locally through Ollama or on an L4 GPU via vLLM on Modal. Try it live: drop in a job listing and it scores my CV against it.",
    image: "/images/ft_model.png",
    liveDemo: "cv-match",
    links: [
      {
        label: "Guestimator Repo",
        url: "https://github.com/Realist2022/CV_to_Job_Guestimator",
      },
      {
        label: "Fine-Tuning Repo",
        url: "https://github.com/Realist2022/FT_MODEL2",
      },
    ],
    techStack: [
      "Python",
      "SLM Fine-Tuning",
      "LoRA",
      "QLoRA",
      "Unsloth",
      "vLLM",
      "Modal",
      "FastAPI",
      "Docker",
      "REST APIs",
    ],
  },
  {
    id: 8,
    title: "Hobbies & Projects",
    description:
      "Personal passions and side projects: greenhouse gardening and aquaponics with sensor monitoring, a rooftop solar install, laser-cut and engraved home decor, DIY builds around the house and plenty of BBQ. All of it keeps me curious, sharpens practical skills and keeps creativity in motion.",
    carouselImages: [
      "/images/Greenhouse.PNG",
      "/images/Aquaponics.PNG",
      "/images/Solar.JPG",
      "/images/LaserCutter.JPG",
      "/images/Art.PNG",
      "/images/BBQ.JPG",
    ],
    imageFit: "contain",
    links: [
      {
        label: "Greenhouse Video",
        url: "https://youtu.be/mZ6pkkDKlR0",
      },
    ],
    techStack: ["Side Projects", "Automation", "Problem Solving", "Creative"],
  },
];

export default projects;
