'use client';

import { useState } from 'react';
import { HiClipboard, HiCheckCircle } from 'react-icons/hi';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  language: string;
  code: string;
  id?: string;
  showCopyButton?: boolean;
  customStyle?: React.CSSProperties;
}

export function CodeBlock({ language, code, id, showCopyButton = true, customStyle }: CodeBlockProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, blockId: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(blockId);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const blockId = id || `code-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="bg-gray-900 rounded-lg p-4 relative">
      {showCopyButton && (
        <button
          onClick={() => copyToClipboard(code, blockId)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
          title="Copy code"
        >
          {copiedCode === blockId ? (
            <HiCheckCircle className="w-5 h-5" />
          ) : (
            <HiClipboard className="w-5 h-5" />
          )}
        </button>
      )}
      <SyntaxHighlighter
        language={language}
        style={tomorrow}
        customStyle={{
          margin: 0,
          background: 'transparent',
          padding: 0,
          fontSize: '14px',
          lineHeight: '1.5',
          ...customStyle
        }}
        codeTagProps={{
          style: {
            fontSize: '14px',
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          }
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}