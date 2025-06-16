export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  photoSrc: string;
  githubUrl: string;
}

export const team: TeamMember[] = [
  {
    name: 'Andrej Dortmann',
    role: 'Frontend Engineer & team lead',
    bio: 'Always ready to lend a hand and explain complex concepts. An excellent team lead and technical specialist.',
    photoSrc: '',
    githubUrl: 'https://github.com/FranticMario',
  },
  {
    name: 'Elena Volkova',
    role: 'Frontend Engineer',
    bio: 'Great technical specialist delivering fast, high-quality, and cost-effective solutions.',
    photoSrc: '',
    githubUrl: 'https://github.com/elena-v-volkova',
  },
  {
    name: 'Artsem Rogovenko',
    role: 'Frontend Engineer',
    bio: 'Highly responsible and deeply invested in the project’s success, with strong problem-solving and communication skills.',
    photoSrc: '',
    githubUrl: 'https://github.com/artsemrogovenko',
  },
];
