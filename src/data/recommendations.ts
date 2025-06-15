
import { Recommendations } from '../types';

export const recommendations: Recommendations = {
  "Technology": {
    "HIGH": {
      "actions": [
        "Migrate to Cloud Infrastructure: Move systems to a secure, scalable cloud platform to improve accessibility and reduce maintenance costs.",
        "Integrate Systems Using Middleware/ESB: Connect disconnected systems to enable seamless data flow and reduce manual processes.",
        "Automate Manual Processes: Implement automation tools to streamline repetitive tasks and improve efficiency."
      ],
      "priority": "URGENT"
    },
    "MEDIUM": {
      "actions": [
        "Upgrade Core Systems and Automation: Enhance partially automated systems to achieve greater efficiency and integration.",
        "Enhance System Integration: Strengthen system connectivity to improve data consistency and workflow automation.",
        "Optimize Digital Tools: Upgrade existing digital tools to support better collaboration and productivity."
      ],
      "priority": "IMPORTANT"
    },
    "LOW": {
      "actions": [
        "Adopt Advanced Analytics and AI Tools: Introduce AI-driven insights to optimize operations and decision-making.",
        "Improve System Scalability: Ensure that current systems can handle future growth and increased demand.",
        "Enhance Cybersecurity Measures: Strengthen security protocols to protect against evolving digital threats."
      ],
      "priority": "FOLLOW UP"
    }
  },
  "Digital Culture": {
    "HIGH": {
      "actions": [
        "Implement Digital Literacy Training Programs: Educate employees on digital tools and their benefits to reduce resistance.",
        "Foster a Culture of Innovation: Encourage experimentation with new digital solutions and reward innovative thinking.",
        "Introduce Change Management Strategies: Guide the organization through digital transformation with clear communication and support."
      ],
      "priority": "URGENT"
    },
    "MEDIUM": {
      "actions": [
        "Expand Digital Tool Usage: Broaden the adoption of digital tools across different departments and functions.",
        "Leadership Digital Champions: Establish digital champions at leadership level to drive cultural change.",
        "Regular Digital Culture Assessments: Monitor and measure digital culture progress through surveys and feedback."
      ],
      "priority": "IMPORTANT"
    },
    "LOW": {
      "actions": [
        "Continuous Innovation Programs: Establish ongoing programs for digital innovation and improvement.",
        "Digital Mentorship Networks: Create peer-to-peer learning networks to maintain digital culture momentum.",
        "Recognition and Rewards: Implement systems to recognize and reward digital innovation and adoption."
      ],
      "priority": "FOLLOW UP"
    }
  },
  "Skills": {
    "HIGH": {
      "actions": [
        "Launch a Digital Skills Upskilling Program: Provide foundational and hands-on training for essential digital competencies.",
        "Establish a Mentorship and Peer-Learning System: Pair tech-savvy employees with those needing support to accelerate learning.",
        "Introduce Mandatory Digital Literacy Courses: Implement structured digital literacy programs for all employees."
      ],
      "priority": "URGENT"
    },
    "MEDIUM": {
      "actions": [
        "Targeted Skills Development: Focus on specific digital skills gaps identified through assessments.",
        "Cross-functional Digital Training: Provide training that spans multiple departments and skill areas.",
        "External Training Partnerships: Partner with external providers for specialized digital skills training."
      ],
      "priority": "IMPORTANT"
    },
    "LOW": {
      "actions": [
        "Advanced Certification Programs: Offer advanced digital certifications for high-performing employees.",
        "Innovation Labs and Workshops: Create spaces for experimentation with cutting-edge digital technologies.",
        "Skills Assessment and Planning: Regular assessment of digital skills to maintain competitive advantage."
      ],
      "priority": "FOLLOW UP"
    }
  }
};
