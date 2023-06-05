import React, { FC } from 'react';

type SuggestionLineProps = {
  suggestion: string;
  onClick: (param: string) => void;
  className?: string;
};

const SuggestionLine: FC<SuggestionLineProps> = ({ suggestion, onClick, className }) => {
  return (
    <button className="co-suggestion-line" onClick={() => onClick(suggestion)}>
      <span className={className}>{suggestion}</span>
    </button>
  );
};

export default SuggestionLine;
