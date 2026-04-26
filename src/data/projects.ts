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
}

const projects: Project[] = [
  {
    id: 1,
    title: "Growise App",
    description:
      "A mobile gardening assistant that uses AI to provide precise planting schedules for edible plants like potatoes and Kūmara. Built with React Native and Firebase for full-stack mobile development.",
    image: "/images/Growise_IOS.png",
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
    title: "Z App — Station Locator",
    description:
      "React + Google Maps frontend with Node.js/Express APIs and MongoDB Atlas. Interactive mapping with real-time search built in a collaborative Agile workflow.",
    links: [],
    techStack: [
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Google Maps API",
      "REST APIs",
      "Agile",
    ],
  },
  {
    id: 5,
    title: "AI Chat Bot",
    description:
      "Custom AI chatbot for interview prep — rehearse answers, get instant feedback, and iterate. Built with React, Node.js, Express, and Google AI Studio.",
    links: [],
    techStack: [
      "React",
      "Node.js",
      "Express.js",
      "Google AI Studio",
      "REST APIs",
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
];

export default projects;
