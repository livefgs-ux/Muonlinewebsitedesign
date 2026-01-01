/**
 * 🧭 NAVIGATION MENU - Menu de Navegação do AdminCP
 * 
 * Menu lateral com todas as seções
 * Sistema de cores por seção
 * 
 * @version 1.0.0
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

interface Section {
  name: string;
  color: string;
  icon: LucideIcon;
}

interface NavigationMenuProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
  sections: Record<string, Section>;
}

export function NavigationMenu({
  currentSection,
  onSectionChange,
  sections
}: NavigationMenuProps) {
  return (
    <nav className="space-y-1">
      {Object.entries(sections).map(([key, section]) => {
        const Icon = section.icon;
        const isActive = currentSection === key;
        
        return (
          <Button
            key={key}
            variant="ghost"
            onClick={() => onSectionChange(key)}
            className={cn(
              'w-full justify-start gap-3 transition-all duration-200',
              isActive
                ? `bg-${section.color}-500/20 text-${section.color}-400 border-l-4 border-${section.color}-500`
                : 'text-gray-400 hover:text-white hover:bg-white/5 border-l-4 border-transparent'
            )}
          >
            <Icon className={cn(
              'size-5',
              isActive ? `text-${section.color}-400` : 'text-gray-500'
            )} />
            <span className="font-medium">{section.name}</span>
          </Button>
        );
      })}
    </nav>
  );
}
