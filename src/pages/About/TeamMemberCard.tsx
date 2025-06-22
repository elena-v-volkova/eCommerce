import { Card, Avatar, Link } from '@heroui/react';

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  photoSrc: string;
  githubUrl: string;
  contribution: string[];
}

export function TeamMemberCard({
  name,
  role,
  bio,
  photoSrc,
  githubUrl,
  contribution,
}: TeamMember) {
  return (
    <Card className="flex flex-col items-center p-6">
      <Avatar alt={name} className="mb-4 size-24" src={photoSrc} />
      <h3 className="mb-1 text-center text-xl font-semibold">{name}</h3>
      <p className="mb-2 text-center text-sm font-medium text-indigo-600">
        {role}
      </p>
      <p className="mb-3 text-center text-gray-700 dark:text-gray-300">{bio}</p>
      <h3 className="font-medium capitalize text-yellow-500">
        contribution to development
      </h3>
      <div className="p-2 text-center font-semibold capitalize">
        {contribution.map((value) => (
          <p key={value}>{value}</p>
        ))}
      </div>
      <Link
        className="mt-auto font-semibold hover:underline"
        href={githubUrl}
        target="_blank"
      >
        View GitHub Profile
      </Link>
    </Card>
  );
}
