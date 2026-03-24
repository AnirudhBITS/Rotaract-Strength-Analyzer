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
  // Executive Leadership
  { id: 1, title: 'DRR Special Representative - Membership Development', category: ROLE_CATEGORIES.EXECUTIVE_LEADERSHIP, tier: 'lead' },

  // Administration
  { id: 2, title: 'Associate District Rotaract Secretary', category: ROLE_CATEGORIES.ADMINISTRATION, tier: 'associate' },
  { id: 3, title: 'Associate District Treasurer', category: ROLE_CATEGORIES.ADMINISTRATION, tier: 'associate' },

  // Event Management
  { id: 4, title: 'Chairperson - Women Empowerment', category: ROLE_CATEGORIES.EVENT_MANAGEMENT, tier: 'lead' },

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
  { id: 18, title: 'Head - Orientation', category: ROLE_CATEGORIES.SPECIALIZED, tier: 'lead' },

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
  { id: 27, title: 'Deputy - Public Relations', category: ROLE_CATEGORIES.COMMUNICATIONS_MEDIA, tier: 'deputy' },
  { id: 28, title: 'Associate - Public Relations', category: ROLE_CATEGORIES.COMMUNICATIONS_MEDIA, tier: 'associate' },
  { id: 29, title: 'Head - Media', category: ROLE_CATEGORIES.COMMUNICATIONS_MEDIA, tier: 'lead' },
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
  { id: 40, title: 'Head - Orientation Team', category: ROLE_CATEGORIES.SPECIALIZED, tier: 'lead' },
  { id: 41, title: 'Secretary - Annual District Rotaract Assembly', category: ROLE_CATEGORIES.EVENT_MANAGEMENT, tier: 'lead' },
  { id: 42, title: 'Co - Chairperson - Annual District Rotaract Assembly', category: ROLE_CATEGORIES.EVENT_MANAGEMENT, tier: 'lead' },
];

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

module.exports = {
  STRENGTH_THEMES,
  ROLE_CATEGORIES,
  ROLE_STRENGTH_MAP,
  DISTRICT_POSITIONS,
  BLOOD_GROUPS,
};
