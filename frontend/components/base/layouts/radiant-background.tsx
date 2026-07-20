import React from 'react';

import { cn } from '../../lib/utils';

import './radiant-background.css';

function RadiantBackground({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('radiant-background size-full', className)} {...props}>
      <div className="radiant-background-circle radiant-background-circle--3" />
      <div className="radiant-background-circle radiant-background-circle--2" />
      <div className="radiant-background-circle radiant-background-circle--1" />
    </div>
  );
}

export default RadiantBackground;
