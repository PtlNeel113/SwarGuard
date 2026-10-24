/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className = 'h-4 w-full',
  count = 1,
}) => {
  return (
    <div className="space-y-2.5 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`bg-[#171F3A] animate-pulse rounded border border-[#263359]/40 ${className}`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
};
