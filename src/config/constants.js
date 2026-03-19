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
  { id: 1, title: 'District Rotaract Representative', category: ROLE_CATEGORIES.EXECUTIVE_LEADERSHIP, tier: 'lead' },
  { id: 2, title: 'Chairperson - Rotaract Zone Institute', category: ROLE_CATEGORIES.EXECUTIVE_LEADERSHIP, tier: 'lead' },
  { id: 3, title: 'Associate DRR & Chairperson - Annual District Rotaract Conference', category: ROLE_CATEGORIES.EXECUTIVE_LEADERSHIP, tier: 'associate' },
  { id: 4, title: 'Associate District Rotaract Representative', category: ROLE_CATEGORIES.EXECUTIVE_LEADERSHIP, tier: 'associate' },
  { id: 5, title: 'Associate District Rotaract Representative', category: ROLE_CATEGORIES.EXECUTIVE_LEADERSHIP, tier: 'associate' },

  // Administration
  { id: 6, title: 'District Rotaract Secretary', category: ROLE_CATEGORIES.ADMINISTRATION, tier: 'lead' },
  { id: 7, title: 'Associate District Rotaract Secretary', category: ROLE_CATEGORIES.ADMINISTRATION, tier: 'associate' },
  { id: 8, title: 'Associate District Rotaract Secretary', category: ROLE_CATEGORIES.ADMINISTRATION, tier: 'associate' },
  { id: 9, title: 'Associate District Rotaract Secretary & Chairperson - Installation', category: ROLE_CATEGORIES.ADMINISTRATION, tier: 'associate' },
  { id: 10, title: 'Associate District Rotaract Secretary', category: ROLE_CATEGORIES.ADMINISTRATION, tier: 'associate' },
  { id: 11, title: 'DRR Support Functions - Women Empowerment & Membership Development', category: ROLE_CATEGORIES.ADMINISTRATION, tier: 'associate' },
  { id: 12, title: 'District Admin', category: ROLE_CATEGORIES.ADMINISTRATION, tier: 'associate' },
  { id: 13, title: 'District Treasurer', category: ROLE_CATEGORIES.ADMINISTRATION, tier: 'lead' },
  { id: 14, title: 'Associate District Treasurer', category: ROLE_CATEGORIES.ADMINISTRATION, tier: 'associate' },

  // Event Management
  { id: 15, title: 'Chairperson - District Rotaract Assembly', category: ROLE_CATEGORIES.EVENT_MANAGEMENT, tier: 'lead' },
  { id: 16, title: 'Chairperson - RYLA', category: ROLE_CATEGORIES.EVENT_MANAGEMENT, tier: 'lead' },
  { id: 17, title: 'Chairperson - GRM & Home Club President', category: ROLE_CATEGORIES.EVENT_MANAGEMENT, tier: 'lead' },
  { id: 18, title: 'Chairperson - PETS & SETS, Women Empowerment & Membership Development', category: ROLE_CATEGORIES.EVENT_MANAGEMENT, tier: 'lead' },
  { id: 19, title: 'Chairperson - DOTS & Deputy PRO', category: ROLE_CATEGORIES.EVENT_MANAGEMENT, tier: 'lead' },

  // Group Management
  { id: 20, title: 'Group Coordinator', category: ROLE_CATEGORIES.GROUP_MANAGEMENT, tier: 'lead' },
  { id: 21, title: 'Group Rotaract Representative', category: ROLE_CATEGORIES.GROUP_MANAGEMENT, tier: 'associate' },
  { id: 22, title: 'Group Rotaract Representative', category: ROLE_CATEGORIES.GROUP_MANAGEMENT, tier: 'associate' },
  { id: 23, title: 'Group Rotaract Representative', category: ROLE_CATEGORIES.GROUP_MANAGEMENT, tier: 'associate' },
  { id: 24, title: 'Group Rotaract Representative', category: ROLE_CATEGORIES.GROUP_MANAGEMENT, tier: 'associate' },
  { id: 25, title: 'Group Rotaract Representative', category: ROLE_CATEGORIES.GROUP_MANAGEMENT, tier: 'associate' },
  { id: 26, title: 'Group Rotaract Representative', category: ROLE_CATEGORIES.GROUP_MANAGEMENT, tier: 'associate' },
  { id: 27, title: 'Group Rotaract Representative', category: ROLE_CATEGORIES.GROUP_MANAGEMENT, tier: 'associate' },

  // Operations/Protocol
  { id: 28, title: 'Chief Sergeant-At-Arms', category: ROLE_CATEGORIES.OPERATIONS_PROTOCOL, tier: 'lead' },
  { id: 29, title: 'Deputy Sergeant-At-Arms', category: ROLE_CATEGORIES.OPERATIONS_PROTOCOL, tier: 'deputy' },
  { id: 30, title: 'Deputy Sergeant-At-Arms', category: ROLE_CATEGORIES.OPERATIONS_PROTOCOL, tier: 'deputy' },
  { id: 31, title: 'Associate Sergeant-At-Arms', category: ROLE_CATEGORIES.OPERATIONS_PROTOCOL, tier: 'associate' },
  { id: 32, title: 'Associate Sergeant-At-Arms', category: ROLE_CATEGORIES.OPERATIONS_PROTOCOL, tier: 'associate' },
  { id: 33, title: 'Associate Sergeant-At-Arms', category: ROLE_CATEGORIES.OPERATIONS_PROTOCOL, tier: 'associate' },
  { id: 34, title: 'Associate Sergeant-At-Arms', category: ROLE_CATEGORIES.OPERATIONS_PROTOCOL, tier: 'associate' },
  { id: 35, title: 'Associate Sergeant-At-Arms', category: ROLE_CATEGORIES.OPERATIONS_PROTOCOL, tier: 'associate' },
  { id: 36, title: 'Associate Sergeant-At-Arms', category: ROLE_CATEGORIES.OPERATIONS_PROTOCOL, tier: 'associate' },
  { id: 37, title: 'Associate Sergeant-At-Arms', category: ROLE_CATEGORIES.OPERATIONS_PROTOCOL, tier: 'associate' },

  // Service Avenues - Club Service
  { id: 38, title: 'Director - Club Service', category: ROLE_CATEGORIES.SERVICE_AVENUES, tier: 'lead' },
  { id: 39, title: 'Deputy Club Service Director', category: ROLE_CATEGORIES.SERVICE_AVENUES, tier: 'deputy' },
  { id: 40, title: 'Associate Club Service Director', category: ROLE_CATEGORIES.SERVICE_AVENUES, tier: 'associate' },
  { id: 41, title: 'Associate Club Service Director', category: ROLE_CATEGORIES.SERVICE_AVENUES, tier: 'associate' },
  { id: 42, title: 'Associate Club Service Director', category: ROLE_CATEGORIES.SERVICE_AVENUES, tier: 'associate' },
  { id: 43, title: 'Associate Club Service Director', category: ROLE_CATEGORIES.SERVICE_AVENUES, tier: 'associate' },
  { id: 44, title: 'Associate Club Service Director', category: ROLE_CATEGORIES.SERVICE_AVENUES, tier: 'associate' },
  { id: 45, title: 'District Fellowship Director', category: ROLE_CATEGORIES.SERVICE_AVENUES, tier: 'lead' },
  { id: 46, title: 'District Sports Director', category: ROLE_CATEGORIES.SERVICE_AVENUES, tier: 'lead' },

  // Service Avenues - Community Service
  { id: 47, title: 'Director - Community Service', category: ROLE_CATEGORIES.SERVICE_AVENUES, tier: 'lead' },
  { id: 48, title: 'Deputy Community Service Director', category: ROLE_CATEGORIES.SERVICE_AVENUES, tier: 'deputy' },
  { id: 49, title: 'Associate Community Service Director', category: ROLE_CATEGORIES.SERVICE_AVENUES, tier: 'associate' },
  { id: 50, title: 'Associate Community Service Director', category: ROLE_CATEGORIES.SERVICE_AVENUES, tier: 'associate' },
  { id: 51, title: 'Associate Community Service Director', category: ROLE_CATEGORIES.SERVICE_AVENUES, tier: 'associate' },
  { id: 52, title: 'Associate Community Service Director', category: ROLE_CATEGORIES.SERVICE_AVENUES, tier: 'associate' },
  { id: 53, title: 'Chairperson - Blood Donation', category: ROLE_CATEGORIES.SERVICE_AVENUES, tier: 'lead' },
  { id: 54, title: 'Blood Donation - Team', category: ROLE_CATEGORIES.SERVICE_AVENUES, tier: 'associate' },
  { id: 55, title: 'Blood Donation - Team', category: ROLE_CATEGORIES.SERVICE_AVENUES, tier: 'associate' },

  // Service Avenues - Professional Service
  { id: 56, title: 'Director - Professional Service', category: ROLE_CATEGORIES.SERVICE_AVENUES, tier: 'lead' },
  { id: 57, title: 'Deputy Professional Service Director', category: ROLE_CATEGORIES.SERVICE_AVENUES, tier: 'deputy' },
  { id: 58, title: 'Associate Professional Service Director', category: ROLE_CATEGORIES.SERVICE_AVENUES, tier: 'associate' },
  { id: 59, title: 'Associate Professional Service Director', category: ROLE_CATEGORIES.SERVICE_AVENUES, tier: 'associate' },
  { id: 60, title: 'Associate Professional Service Director', category: ROLE_CATEGORIES.SERVICE_AVENUES, tier: 'associate' },
  { id: 61, title: 'Associate Professional Service Director', category: ROLE_CATEGORIES.SERVICE_AVENUES, tier: 'associate' },
  { id: 62, title: 'Associate Professional Service Director', category: ROLE_CATEGORIES.SERVICE_AVENUES, tier: 'associate' },

  // Membership Development
  { id: 63, title: 'Deputy - Membership Development', category: ROLE_CATEGORIES.SPECIALIZED, tier: 'deputy' },
  { id: 64, title: 'Team - Membership Development', category: ROLE_CATEGORIES.SPECIALIZED, tier: 'associate' },
  { id: 65, title: 'Team - Membership Development', category: ROLE_CATEGORIES.SPECIALIZED, tier: 'associate' },
  { id: 66, title: 'Chairperson - District Orientation Team', category: ROLE_CATEGORIES.SPECIALIZED, tier: 'lead' },

  // International Service
  { id: 67, title: 'Director - International Service', category: ROLE_CATEGORIES.SERVICE_AVENUES, tier: 'lead' },
  { id: 68, title: 'Deputy International Service Director', category: ROLE_CATEGORIES.SERVICE_AVENUES, tier: 'deputy' },
  { id: 69, title: 'Associate International Service Director', category: ROLE_CATEGORIES.SERVICE_AVENUES, tier: 'associate' },
  { id: 70, title: 'Associate International Service Director', category: ROLE_CATEGORIES.SERVICE_AVENUES, tier: 'associate' },
  { id: 71, title: 'Associate International Service Director', category: ROLE_CATEGORIES.SERVICE_AVENUES, tier: 'associate' },
  { id: 72, title: 'Associate International Service Director', category: ROLE_CATEGORIES.SERVICE_AVENUES, tier: 'associate' },
  { id: 73, title: 'Associate International Service Director', category: ROLE_CATEGORIES.SERVICE_AVENUES, tier: 'associate' },
  { id: 74, title: 'Chairperson - Inter District Youth Exchange', category: ROLE_CATEGORIES.SPECIALIZED, tier: 'lead' },
  { id: 75, title: 'Associate - Inter District Youth Exchange', category: ROLE_CATEGORIES.SPECIALIZED, tier: 'associate' },
  { id: 76, title: 'Associate - Inter District Youth Exchange', category: ROLE_CATEGORIES.SPECIALIZED, tier: 'associate' },

  // Communications & Media
  { id: 77, title: 'Chairperson - Editorial Board', category: ROLE_CATEGORIES.COMMUNICATIONS_MEDIA, tier: 'lead' },
  { id: 78, title: 'Editorial - Team', category: ROLE_CATEGORIES.COMMUNICATIONS_MEDIA, tier: 'associate' },
  { id: 79, title: 'Chairperson - Directory', category: ROLE_CATEGORIES.COMMUNICATIONS_MEDIA, tier: 'lead' },
  { id: 80, title: 'Video Editor', category: ROLE_CATEGORIES.COMMUNICATIONS_MEDIA, tier: 'associate' },
  { id: 81, title: 'PRO - Chief', category: ROLE_CATEGORIES.COMMUNICATIONS_MEDIA, tier: 'lead' },
  { id: 82, title: 'PRO - Associate', category: ROLE_CATEGORIES.COMMUNICATIONS_MEDIA, tier: 'associate' },
  { id: 83, title: 'PRO - Associate', category: ROLE_CATEGORIES.COMMUNICATIONS_MEDIA, tier: 'associate' },
  { id: 84, title: 'PRO - Associate', category: ROLE_CATEGORIES.COMMUNICATIONS_MEDIA, tier: 'associate' },
  { id: 85, title: 'PRO - Associate', category: ROLE_CATEGORIES.COMMUNICATIONS_MEDIA, tier: 'associate' },
  { id: 86, title: 'PRO - Associate', category: ROLE_CATEGORIES.COMMUNICATIONS_MEDIA, tier: 'associate' },
  { id: 87, title: 'PRO - Associate', category: ROLE_CATEGORIES.COMMUNICATIONS_MEDIA, tier: 'associate' },
  { id: 88, title: 'Media - Head', category: ROLE_CATEGORIES.COMMUNICATIONS_MEDIA, tier: 'lead' },
  { id: 89, title: 'Media - Associate', category: ROLE_CATEGORIES.COMMUNICATIONS_MEDIA, tier: 'associate' },
  { id: 90, title: 'Media - Associate', category: ROLE_CATEGORIES.COMMUNICATIONS_MEDIA, tier: 'associate' },
  { id: 91, title: 'Media - Associate', category: ROLE_CATEGORIES.COMMUNICATIONS_MEDIA, tier: 'associate' },
  { id: 92, title: 'Media - Associate', category: ROLE_CATEGORIES.COMMUNICATIONS_MEDIA, tier: 'associate' },
  { id: 93, title: 'Media - Associate', category: ROLE_CATEGORIES.COMMUNICATIONS_MEDIA, tier: 'associate' },
  { id: 94, title: 'Media - Associate', category: ROLE_CATEGORIES.COMMUNICATIONS_MEDIA, tier: 'associate' },
  { id: 95, title: 'Videography - Head', category: ROLE_CATEGORIES.COMMUNICATIONS_MEDIA, tier: 'lead' },
  { id: 96, title: 'Social Media - Head', category: ROLE_CATEGORIES.COMMUNICATIONS_MEDIA, tier: 'lead' },
  { id: 97, title: 'Social Media - Associate', category: ROLE_CATEGORIES.COMMUNICATIONS_MEDIA, tier: 'associate' },
  { id: 98, title: 'Social Media - Associate', category: ROLE_CATEGORIES.COMMUNICATIONS_MEDIA, tier: 'associate' },
  { id: 99, title: 'Public Image Chairperson', category: ROLE_CATEGORIES.COMMUNICATIONS_MEDIA, tier: 'lead' },
];

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

module.exports = {
  STRENGTH_THEMES,
  ROLE_CATEGORIES,
  ROLE_STRENGTH_MAP,
  DISTRICT_POSITIONS,
  BLOOD_GROUPS,
};
