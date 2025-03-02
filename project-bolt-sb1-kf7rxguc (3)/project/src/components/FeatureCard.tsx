import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

export function FeatureCard({ title, description, icon: Icon, href }: FeatureCardProps) {
  return (
    <a
      href={href}
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
    >
      <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-purple-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </a>
  );
}