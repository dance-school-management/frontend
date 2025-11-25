"use client";

import { useState } from "react";

import { truncateAtWordBoundary } from "@/lib/utils/text";

interface ExpandableDescriptionProps {
  text: string;
  maxLength?: number;
}

export function ExpandableDescription({ text, maxLength = 200 }: ExpandableDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const shouldTruncate = text.length > maxLength;
  const displayText = isExpanded || !shouldTruncate ? text : truncateAtWordBoundary(text, maxLength);

  return (
    <div className="space-y-2">
      <p className="text-muted-foreground">
        {displayText}
        {shouldTruncate && (
          <>
            {" ("}
            <span onClick={() => setIsExpanded(!isExpanded)} className='font-semibold text-foreground cursor-pointer underline'>
              {isExpanded ? 'Show less' : 'Show more'}
            </span>
            {")"}
          </>
        )}
      </p>
    </div>
  );
}