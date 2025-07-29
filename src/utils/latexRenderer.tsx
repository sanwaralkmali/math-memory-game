import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

export const renderMathContent = (content: string): React.ReactNode => {
  // Check if content contains LaTeX delimiters
  if (content.includes('$') && content.startsWith('$') && content.endsWith('$')) {
    // Remove the $ delimiters and render as inline math
    const latexContent = content.slice(1, -1);
    return <InlineMath>{latexContent}</InlineMath>;
  }
  
  // Check for block math ($$...$$)
  if (content.includes('$$') && content.startsWith('$$') && content.endsWith('$$')) {
    // Remove the $$ delimiters and render as block math
    const latexContent = content.slice(2, -2);
    return <BlockMath>{latexContent}</BlockMath>;
  }
  
  // If no LaTeX delimiters, render as regular text
  return content;
};

export const isLatexContent = (content: string): boolean => {
  return (content.includes('$') && content.startsWith('$') && content.endsWith('$')) ||
         (content.includes('$$') && content.startsWith('$$') && content.endsWith('$$'));
};