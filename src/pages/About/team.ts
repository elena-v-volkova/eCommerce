import lena from '../../assets/lena.jpg';
import artsem from '../../assets/artsem.jpeg';
import andrej from '../../assets/andrej.jpg';

import { TeamMember } from './TeamMemberCard';

export const team: TeamMember[] = [
  {
    name: 'Andrej Dortmann',
    role: 'Frontend Engineer & team lead',
    bio: 'Always ready to lend a hand and explain complex concepts. An excellent team lead and technical specialist.',
    photoSrc: andrej,
    githubUrl: 'https://github.com/FranticMario',
    contribution: [
      'commerce tools api',
      'catalog page',
      'login page',
      'selection of tools',
    ],
  },
  {
    name: 'Elena Volkova',
    role: 'Frontend Engineer',
    bio: 'Great technical specialist delivering fast, high-quality, and cost-effective solutions.',
    photoSrc: lena,
    githubUrl: 'https://github.com/elena-v-volkova',
    contribution: [
      'product page',
      'about page',
      'structure project',
      'selection of tools',
    ],
  },
  {
    name: 'Artsem Rogovenko',
    role: 'Frontend Engineer',
    bio: 'Highly responsible and deeply invested in the project’s success, with strong problem-solving and communication skills.',
    photoSrc: artsem,
    githubUrl: 'https://github.com/artsemrogovenko',
    contribution: [
      'main page',
      'register page',
      'profile page',
      'cart page',
      'linter settings',
    ],
  },
];
