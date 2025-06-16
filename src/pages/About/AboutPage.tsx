import React from 'react';
import { Card, Avatar, Link } from '@heroui/react';
import { team } from './teamData';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  photoSrc: string;
  githubUrl: string;
}

const TeamMemberCard: React.FC<TeamMember> = ({
  name,
  role,
  bio,
  photoSrc,
  githubUrl,
}) => (
  <Card className="flex flex-col items-center p-6">
    <Avatar alt={name} className="mb-4 size-24" src={photoSrc} />
    <h3 className="mb-1 text-center text-xl font-semibold">{name}</h3>
    <p className="mb-2 text-center text-sm font-medium text-indigo-600">
      {role}
    </p>
    <p className="mb-3 text-center text-gray-700">{bio}</p>
    <Link
      className="mt-auto font-semibold hover:underline"
      href={githubUrl}
      target="_blank"
    >
      View GitHub Profile
    </Link>
  </Card>
);

const AboutPage: React.FC = () => {
  return (
    <>
      <section className="container mx-auto px-4 py-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">Meet Our Team</h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          The best of the best professionals delivering excellence through
          collaboration and some hard work.
        </p>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="mb-8 rounded-lg bg-gray-200 p-6 shadow-lg">
          <h2 className="mb-4 text-2xl font-semibold text-indigo-700">
            Our Collaboration
          </h2>
          <p className="mx-auto max-w-3xl text-center text-indigo-800">
            Fueled by agile sprints, rigorous peer reviews, and daily stand-ups,
            our team harnessed collective creativity and technical precision to
            craft a resilient, high-impact solution.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => (
            <TeamMemberCard key={member.name} {...member} />
          ))}
        </div>
      </section>
    </>
  );
};

export default AboutPage;
