import type { CVData, CVDocument, CVReview } from "./types";

/**
 * Fictional student profile used for the landing page and /example.
 * Not a real person. Contact details use reserved example domains.
 */
export const EXAMPLE_DATA: CVData = {
  personal: {
    firstName: "Nino",
    lastName: "Beridze",
    email: "nino.beridze@example.com",
    phone: "+995 555 00 00 00",
    city: "Tbilisi",
    country: "Georgia",
    linkedin: "linkedin.com/in/nino-beridze-example",
    website: "github.com/ninoberidze-example",
  },
  education: [
    {
      id: "edu-1",
      institution: "Tbilisi Public School No. 51",
      city: "Tbilisi",
      country: "Georgia",
      degree: "High school diploma",
      fieldOfStudy: "Physics and Mathematics track",
      startDate: "2019-09",
      endDate: "2025-06",
      current: false,
      gpa: "9.6 / 10",
      subjects: "Mathematics, Physics, Informatics, English",
      achievements:
        "Graduated with a gold medal\nNational exams (ერთიანი ეროვნული გამოცდები): Mathematics 92/100, English 95/100",
    },
  ],
  languages: [
    { id: "l1", language: "Georgian", level: "native" },
    { id: "l2", language: "English", level: "C1" },
    { id: "l3", language: "German", level: "B1" },
  ],
  testScores: [{ id: "t1", test: "IELTS", score: "7.5", date: "2025-03" }],
  projects: [
    {
      id: "p1",
      name: "TbilisiTransit",
      description:
        "Built a web app showing live bus arrival times for Tbilisi using the city's open transport API. Around 300 students used it during the first semester.",
      technologies: "React, TypeScript, Node.js",
      date: "2024-11",
      link: "github.com/ninoberidze-example/tbilisitransit",
    },
    {
      id: "p2",
      name: "Handwritten Georgian letter classifier",
      description:
        "Collected 4,000 samples of handwritten Georgian letters from classmates and trained a CNN in PyTorch, reaching 94% test accuracy. Presented the results at the school science fair.",
      technologies: "Python, PyTorch, NumPy",
      date: "2025-02",
      link: "",
    },
  ],
  experience: [
    {
      id: "x1",
      type: "internship",
      organization: "Bank of Georgia, Digital Products",
      position: "Software Engineering Intern",
      location: "Tbilisi, Georgia",
      startDate: "2024-07",
      endDate: "2024-08",
      current: false,
      description:
        "Wrote automated tests for the mobile app's payment screens\nFixed 12 UI bugs in the React Native codebase\nPresented internship results to the team of 15 engineers",
    },
    {
      id: "x2",
      type: "volunteering",
      organization: "Girls in STEM Georgia",
      position: "Coding Workshop Mentor",
      location: "Tbilisi, Georgia",
      startDate: "2023-10",
      endDate: "",
      current: true,
      description:
        "Teach weekend Python workshops to groups of 10–15 girls aged 12–15\nCreated a 6-week beginner curriculum now used by three other mentors",
    },
  ],
  achievements: [
    {
      id: "a1",
      type: "olympiad",
      title: "National Olympiad in Informatics — Silver medal",
      issuer: "Ministry of Education of Georgia",
      date: "2024-04",
      description: "Placed 5th of 240 participants in the national final.",
    },
    {
      id: "a2",
      type: "competition",
      title: "Finalist, European Girls' Olympiad in Informatics selection",
      issuer: "Georgian Olympiad Committee",
      date: "2025-01",
      description: "",
    },
    {
      id: "a3",
      type: "scholarship",
      title: "Millennium Foundation STEM Scholarship",
      issuer: "San Diego State University Georgia",
      date: "2024-09",
      description: "Merit scholarship for a summer computing programme.",
    },
  ],
  activities: [
    {
      id: "ac1",
      type: "student-organization",
      title: "School Robotics Club",
      organization: "Tbilisi Public School No. 51",
      role: "President",
      startDate: "2023-09",
      endDate: "2025-06",
      description:
        "Led a 20-member club, organised weekly build sessions and the school's first robotics exhibition attended by 200 visitors.",
    },
    {
      id: "ac2",
      type: "music",
      title: "Classical piano",
      organization: "Tbilisi Music School No. 7",
      role: "",
      startDate: "2015-09",
      endDate: "2023-06",
      description: "Eight years of formal training; performed at two regional recitals.",
    },
  ],
  skills: {
    technical: ["Python", "TypeScript", "React", "PyTorch", "SQL", "Git"],
    soft: ["Leadership", "Mentoring", "Public speaking", "Research"],
  },
  application: {
    level: "bachelor",
    country: "Netherlands",
    fieldOfStudy: "Computer Science",
    university: "Delft University of Technology",
  },
};

/** What the example CV looks like after AI polishing. */
export const EXAMPLE_DOCUMENT: CVDocument = {
  header: {
    fullName: "Nino Beridze",
    headline: "Bachelor's applicant · Computer Science",
    email: "nino.beridze@example.com",
    phone: "+995 555 00 00 00",
    location: "Tbilisi, Georgia",
    linkedin: "linkedin.com/in/nino-beridze-example",
    website: "github.com/ninoberidze-example",
  },
  summary:
    "High school graduate from Tbilisi with a strong record in mathematics and informatics, a national olympiad silver medal, and hands-on software experience from an engineering internship and independent projects. Applying for a BSc in Computer Science with particular interest in machine learning and civic technology.",
  education: [
    {
      institution: "Tbilisi Public School No. 51",
      location: "Tbilisi, Georgia",
      degree: "High school diploma, Physics and Mathematics track",
      dates: "Sep 2019 – Jun 2025",
      gpa: "9.6 / 10",
      details: [
        "Relevant subjects: Mathematics, Physics, Informatics, English",
        "Graduated with a gold medal",
        "Georgian National Exams: Mathematics 92/100, English 95/100",
      ],
    },
  ],
  experience: [
    {
      organization: "Bank of Georgia, Digital Products",
      position: "Software Engineering Intern",
      location: "Tbilisi, Georgia",
      dates: "Jul 2024 – Aug 2024",
      type: "Internship",
      bullets: [
        "Wrote automated tests for the mobile banking app's payment screens",
        "Resolved 12 user-interface defects in a React Native codebase",
        "Presented internship outcomes to a team of 15 engineers",
      ],
    },
    {
      organization: "Girls in STEM Georgia",
      position: "Coding Workshop Mentor",
      location: "Tbilisi, Georgia",
      dates: "Oct 2023 – Present",
      type: "Volunteering",
      bullets: [
        "Teach weekend Python workshops to groups of 10–15 girls aged 12–15",
        "Designed a six-week beginner curriculum now used by three other mentors",
      ],
    },
  ],
  projects: [
    {
      name: "TbilisiTransit",
      technologies: "React, TypeScript, Node.js",
      date: "Nov 2024",
      link: "github.com/ninoberidze-example/tbilisitransit",
      bullets: [
        "Built a web application showing live bus arrival times using Tbilisi's open transport API",
        "Reached around 300 student users during its first semester",
      ],
    },
    {
      name: "Handwritten Georgian Letter Classifier",
      technologies: "Python, PyTorch, NumPy",
      date: "Feb 2025",
      link: "",
      bullets: [
        "Collected a dataset of 4,000 handwritten Georgian letter samples from classmates",
        "Trained a convolutional neural network reaching 94% test accuracy; presented results at the school science fair",
      ],
    },
  ],
  achievements: [
    {
      title: "National Olympiad in Informatics — Silver Medal",
      issuer: "Olympiad · Ministry of Education of Georgia",
      date: "Apr 2024",
      description: "Placed 5th of 240 participants in the national final.",
    },
    {
      title: "Finalist, European Girls' Olympiad in Informatics selection",
      issuer: "Competition · Georgian Olympiad Committee",
      date: "Jan 2025",
      description: "",
    },
    {
      title: "Millennium Foundation STEM Scholarship",
      issuer: "Scholarship · San Diego State University Georgia",
      date: "Sep 2024",
      description: "Merit scholarship for a summer computing programme.",
    },
  ],
  activities: [
    {
      title: "School Robotics Club — President",
      organization: "Tbilisi Public School No. 51 · Student organisation",
      dates: "Sep 2023 – Jun 2025",
      description:
        "Led a 20-member club, organised weekly build sessions and the school's first robotics exhibition, attended by 200 visitors.",
    },
    {
      title: "Classical piano",
      organization: "Tbilisi Music School No. 7 · Music",
      dates: "Sep 2015 – Jun 2023",
      description: "Eight years of formal training; performed at two regional recitals.",
    },
  ],
  skills: {
    technical: ["Python", "TypeScript", "React", "PyTorch", "SQL", "Git"],
    soft: ["Leadership", "Mentoring", "Public speaking", "Research"],
  },
  languages: [
    { language: "Georgian", level: "Native" },
    { language: "English", level: "C1 (Advanced)" },
    { language: "German", level: "B1 (Intermediate)" },
  ],
  certifications: ["IELTS 7.5 (Mar 2025)"],
};

export const EXAMPLE_REVIEW: CVReview = {
  overall:
    "A strong, well-rounded profile for a Computer Science bachelor's application, with clear evidence of technical ability and initiative.",
  strengths: [
    "The olympiad medal and internship give concrete, verifiable evidence of ability.",
    "Projects are specific and quantified (users, dataset size, accuracy).",
    "Leadership and mentoring show initiative beyond coursework.",
  ],
  missing: [
    "No link for the letter classifier project — a repository would make it more credible.",
    "German level B1 is listed without a certificate; a Goethe certificate would strengthen it if available.",
  ],
  suggestions: [
    {
      title: "Add a repository link to the classifier project",
      detail:
        "Your projects section is strong, but adding a GitHub link to the letter classifier would make your machine-learning experience more credible.",
      section: "projects",
    },
    {
      title: "Mention your intended specialisation in the summary",
      detail:
        "Dutch CS programmes value a clear motivation. One sentence about why machine learning or civic tech interests you would help.",
      section: "summary",
    },
  ],
};
