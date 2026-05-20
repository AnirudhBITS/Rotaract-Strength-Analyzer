const STRENGTH_THEMES = {
  ACHIEVER: 'Achiever',
  ACTIVATOR: 'Activator',
  ANALYTICAL: 'Analytical',
  ARRANGER: 'Arranger',
  COMMAND: 'Command',
  COMMUNICATION: 'Communication',
  CONNECTEDNESS: 'Connectedness',
  CONSISTENCY: 'Consistency',
  DELIBERATIVE: 'Deliberative',
  DEVELOPER: 'Developer',
  DISCIPLINE: 'Discipline',
  EMPATHY: 'Empathy',
  FOCUS: 'Focus',
  FUTURISTIC: 'Futuristic',
  IDEATION: 'Ideation',
  INCLUDER: 'Includer',
  MAXIMIZER: 'Maximizer',
  RESPONSIBILITY: 'Responsibility',
  STRATEGIC: 'Strategic',
};

const ROLE_CATEGORIES = {
  EXECUTIVE_LEADERSHIP: 'Executive Leadership',
  ADMINISTRATION: 'Administration',
  EVENT_MANAGEMENT: 'Event Management',
  GROUP_MANAGEMENT: 'Group Management',
  OPERATIONS_PROTOCOL: 'Operations/Protocol',
  SERVICE_AVENUES: 'Service Avenues',
  SPECIALIZED: 'Specialized',
  COMMUNICATIONS_MEDIA: 'Communications & Media',
};

const ROLE_STRENGTH_MAP = {
  [ROLE_CATEGORIES.EXECUTIVE_LEADERSHIP]: [
    'Strategic', 'Futuristic', 'Command', 'Communication',
    'Achiever', 'Deliberative', 'Developer', 'Maximizer',
  ],
  [ROLE_CATEGORIES.ADMINISTRATION]: [
    'Discipline', 'Responsibility', 'Analytical', 'Deliberative',
    'Focus', 'Consistency',
  ],
  [ROLE_CATEGORIES.EVENT_MANAGEMENT]: [
    'Arranger', 'Activator', 'Strategic', 'Command',
    'Developer', 'Communication', 'Focus',
  ],
  [ROLE_CATEGORIES.GROUP_MANAGEMENT]: [
    'Developer', 'Empathy', 'Communication', 'Includer',
    'Responsibility', 'Connectedness',
  ],
  [ROLE_CATEGORIES.OPERATIONS_PROTOCOL]: [
    'Command', 'Discipline', 'Responsibility', 'Focus', 'Consistency',
  ],
  [ROLE_CATEGORIES.SERVICE_AVENUES]: [
    'Ideation', 'Empathy', 'Connectedness', 'Includer',
    'Achiever', 'Futuristic',
  ],
  [ROLE_CATEGORIES.SPECIALIZED]: [
    'Communication', 'Developer', 'Connectedness', 'Includer', 'Activator',
  ],
  [ROLE_CATEGORIES.COMMUNICATIONS_MEDIA]: [
    'Communication', 'Ideation', 'Maximizer', 'Focus', 'Strategic',
  ],
};

const DISTRICT_POSITIONS = [
  // Administration
  { id: 2, title: 'Associate District Rotaract Secretary', category: ROLE_CATEGORIES.ADMINISTRATION, tier: 'associate' },
  { id: 3, title: 'Associate District Treasurer', category: ROLE_CATEGORIES.ADMINISTRATION, tier: 'associate' },

  // Group Management
  { id: 5, title: 'Group Rotaract Representative', category: ROLE_CATEGORIES.GROUP_MANAGEMENT, tier: 'associate' },

  // Operations/Protocol
  { id: 6, title: 'Deputy Sergeant-At-Arms', category: ROLE_CATEGORIES.OPERATIONS_PROTOCOL, tier: 'deputy' },
  { id: 7, title: 'Associate Sergeant-At-Arms', category: ROLE_CATEGORIES.OPERATIONS_PROTOCOL, tier: 'associate' },

  // Service Avenues - Club Service
  { id: 8, title: 'Deputy - Club Service', category: ROLE_CATEGORIES.SERVICE_AVENUES, tier: 'deputy' },
  { id: 9, title: 'Associate - Club Service', category: ROLE_CATEGORIES.SERVICE_AVENUES, tier: 'associate' },
  { id: 10, title: 'District Sports Director', category: ROLE_CATEGORIES.SERVICE_AVENUES, tier: 'lead' },

  // Service Avenues - Community Service
  { id: 11, title: 'Deputy - Community Service', category: ROLE_CATEGORIES.SERVICE_AVENUES, tier: 'deputy' },
  { id: 12, title: 'Associate - Community Service', category: ROLE_CATEGORIES.SERVICE_AVENUES, tier: 'associate' },
  { id: 13, title: 'Head - Blood Donation', category: ROLE_CATEGORIES.SERVICE_AVENUES, tier: 'lead' },
  { id: 14, title: 'Associate - Blood Donation', category: ROLE_CATEGORIES.SERVICE_AVENUES, tier: 'associate' },

  // Service Avenues - Professional Service
  { id: 15, title: 'Deputy - Professional Service', category: ROLE_CATEGORIES.SERVICE_AVENUES, tier: 'deputy' },
  { id: 16, title: 'Associate - Professional Service', category: ROLE_CATEGORIES.SERVICE_AVENUES, tier: 'associate' },

  // Specialized
  { id: 17, title: 'Membership Development Team', category: ROLE_CATEGORIES.SPECIALIZED, tier: 'associate' },
  { id: 18, title: 'Head - Orientation Team', category: ROLE_CATEGORIES.SPECIALIZED, tier: 'lead' },

  // International Service
  { id: 19, title: 'Deputy - International Service', category: ROLE_CATEGORIES.SERVICE_AVENUES, tier: 'deputy' },
  { id: 20, title: 'Associate - International Service', category: ROLE_CATEGORIES.SERVICE_AVENUES, tier: 'associate' },
  { id: 21, title: 'Head - Rotaract Inter District Exchange', category: ROLE_CATEGORIES.SPECIALIZED, tier: 'lead' },
  { id: 22, title: 'Head - Rotaract Inter Club Exchange', category: ROLE_CATEGORIES.SPECIALIZED, tier: 'lead' },

  // Communications & Media
  { id: 23, title: 'Head - Editorial Board', category: ROLE_CATEGORIES.COMMUNICATIONS_MEDIA, tier: 'lead' },
  { id: 24, title: 'Associate - Editorial Board', category: ROLE_CATEGORIES.COMMUNICATIONS_MEDIA, tier: 'associate' },
  { id: 25, title: 'Head - Creatives', category: ROLE_CATEGORIES.COMMUNICATIONS_MEDIA, tier: 'lead' },
  { id: 26, title: 'Associate - Creatives', category: ROLE_CATEGORIES.COMMUNICATIONS_MEDIA, tier: 'associate' },
  { id: 30, title: 'Associate - Media', category: ROLE_CATEGORIES.COMMUNICATIONS_MEDIA, tier: 'associate' },
  { id: 31, title: 'Head - Videography', category: ROLE_CATEGORIES.COMMUNICATIONS_MEDIA, tier: 'lead' },
  { id: 32, title: 'Deputy - PRO', category: ROLE_CATEGORIES.COMMUNICATIONS_MEDIA, tier: 'deputy' },
  { id: 33, title: 'Associate - PRO', category: ROLE_CATEGORIES.COMMUNICATIONS_MEDIA, tier: 'associate' },
  { id: 34, title: 'Deputy - Merchandise', category: ROLE_CATEGORIES.SPECIALIZED, tier: 'deputy' },
  { id: 35, title: 'Associate - Merchandise', category: ROLE_CATEGORIES.SPECIALIZED, tier: 'associate' },
  { id: 36, title: 'Deputy - Public Image', category: ROLE_CATEGORIES.COMMUNICATIONS_MEDIA, tier: 'deputy' },
  { id: 37, title: 'Associate - Public Image', category: ROLE_CATEGORIES.COMMUNICATIONS_MEDIA, tier: 'associate' },
  { id: 38, title: 'Deputy - World Record Team', category: ROLE_CATEGORIES.SPECIALIZED, tier: 'deputy' },
  { id: 39, title: 'Associate - World Record Team', category: ROLE_CATEGORIES.SPECIALIZED, tier: 'associate' },
  { id: 41, title: 'Secretary - Annual District Rotaract Assembly', category: ROLE_CATEGORIES.EVENT_MANAGEMENT, tier: 'lead' },
  { id: 42, title: 'Co - Chairperson - Annual District Rotaract Assembly', category: ROLE_CATEGORIES.EVENT_MANAGEMENT, tier: 'lead' },

  { id: 43, title: 'Associate - Sports', category: ROLE_CATEGORIES.SERVICE_AVENUES, tier: 'associate' },
  { id: 44, title: 'Head - Employment Cell', category: ROLE_CATEGORIES.SERVICE_AVENUES, tier: 'lead' },
  { id: 45, title: 'Associate - Employment Cell', category: ROLE_CATEGORIES.SERVICE_AVENUES, tier: 'associate' },
  { id: 46, title: 'Deputy - Women Empowerment', category: ROLE_CATEGORIES.EVENT_MANAGEMENT, tier: 'deputy' },
  { id: 47, title: 'Associate - Women Empowerment', category: ROLE_CATEGORIES.EVENT_MANAGEMENT, tier: 'associate' },
  { id: 48, title: 'Associate - Rotaract Inter District Exchange', category: ROLE_CATEGORIES.SPECIALIZED, tier: 'associate' },
  { id: 49, title: 'Associate - Rotaract Inter Club Exchange', category: ROLE_CATEGORIES.SPECIALIZED, tier: 'associate' },
  { id: 50, title: 'Head - Photography', category: ROLE_CATEGORIES.COMMUNICATIONS_MEDIA, tier: 'lead' },
  { id: 51, title: 'Deputy - Photography', category: ROLE_CATEGORIES.COMMUNICATIONS_MEDIA, tier: 'deputy' },
  { id: 52, title: 'Associate - Photography', category: ROLE_CATEGORIES.COMMUNICATIONS_MEDIA, tier: 'associate' },
  { id: 53, title: 'Associate - Videography', category: ROLE_CATEGORIES.COMMUNICATIONS_MEDIA, tier: 'associate' },
  { id: 54, title: 'Head - Membership', category: ROLE_CATEGORIES.SPECIALIZED, tier: 'lead' },
  { id: 55, title: 'Deputy - Membership', category: ROLE_CATEGORIES.SPECIALIZED, tier: 'deputy' },
  { id: 56, title: 'Deputy - Social Media', category: ROLE_CATEGORIES.COMMUNICATIONS_MEDIA, tier: 'deputy' },
  { id: 57, title: 'Deputy - Editorial Board', category: ROLE_CATEGORIES.COMMUNICATIONS_MEDIA, tier: 'deputy' },
];

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

module.exports = {
  STRENGTH_THEMES,
  ROLE_CATEGORIES,
  ROLE_STRENGTH_MAP,
  DISTRICT_POSITIONS,
  BLOOD_GROUPS,
};
