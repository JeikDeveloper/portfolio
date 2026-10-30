/**
 * Textos de "Sobre mí" y de disponibilidad.
 * Lo que dice [COMPLETAR] solo se ve en desarrollo; en producción se oculta.
 */
import type { Lang } from '../i18n/ui';

type About = {
  story: string[];
  /** Compromiso con un empleo y servicios freelance. */
  lookingFor: string[];
  /** Modalidad. */
  conditions: string[];
};

export const about: Record<Lang, About> = {
  es: {
    story: [
      'Soy desarrollador Python y llevo cinco años llevando inteligencia artificial a producción, moviendo los datos que la alimentan y automatizando el proceso alrededor.',
      'Empecé en 2021 construyendo backends con Django para el sector salud. En una insurtech entrené modelos de visión por computadora que deciden sobre siniestros y documentos reales. Hoy, en Tata Consultancy Services, construyo agentes con LLM, automatizo procesos con AWS (Lambda, S3, CloudWatch) y n8n, y desarrollo sistemas de extracción que operan sin intervención manual. En varios proyectos he sido el líder técnico del equipo.',
      'En paralelo construyo NEXOR ONE, una plataforma de gestión empresarial con agentes de IA que atienden por WhatsApp y correo, y estudio Ingeniería de Software en la Universidad Manuela Beltrán, en Bogotá.',
      'Me interesa el problema completo: del negocio al despliegue.',
    ],
    lookingFor: [
      'Empleo de tiempo completo, con compromiso a largo plazo: me integro al equipo, respondo por lo que entrego y me quedo el tiempo que la empresa lo necesite.',
      'Roles: ingeniero de IA (AI engineering), desarrollador backend Python, ingeniero de automatización o full-stack.',
      'Freelance: agentes de IA y chatbots, automatizaciones con n8n, AWS y Python, integraciones entre sistemas, extracción de datos y páginas web.',
    ],
    conditions: ['Remoto, híbrido o presencial en Bogotá: me adapto a la forma de trabajo del equipo.'],
  },
  en: {
    story: [
      "I'm a Python developer with five years taking artificial intelligence to production, moving the data that feeds it and automating the process around it.",
      "I started in 2021 building Django backends for the healthcare sector. At an insurtech I trained computer vision models that make decisions on real claims and documents. Today, at Tata Consultancy Services, I build LLM agents, automate processes with AWS (Lambda, S3, CloudWatch) and n8n, and develop extraction systems that run without manual intervention. On several projects I have been the team's technical lead.",
      'Alongside that I build NEXOR ONE, a business management platform with AI agents that answer over WhatsApp and email, and I study Software Engineering at Universidad Manuela Beltrán in Bogotá.',
      "I care about the whole problem: from the business to the deployment.",
    ],
    lookingFor: [
      'Full-time employment with a long-term commitment: I become part of the team, I own what I deliver and I stay for as long as the company needs me.',
      'Roles: AI engineer, Python backend developer, automation engineer or full-stack developer.',
      'Freelance: AI agents and chatbots, automations with n8n, AWS and Python, system integrations, data extraction and websites.',
    ],
    conditions: ['Remote, hybrid or on-site in Bogotá: I adapt to the way the team works.'],
  },
};

/**
 * Estado de disponibilidad. Cambia aquí y se actualiza en todo el sitio
 * (portada, "Sobre mí" y el bloque de disponibilidad del inicio):
 *   'open'    → disponible para empleo y freelance
 *   'limited' → solo proyectos pequeños o conversaciones
 *   'closed'  → sin disponibilidad por ahora
 */
export type AvailabilityStatus = 'open' | 'limited' | 'closed';
export const availability: AvailabilityStatus = 'open';
