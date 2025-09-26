import { CodeBlock } from './CodeBlock';

interface Parameter {
  name: string;
  type: string;
  description: string;
  required?: boolean;
}

interface ApiMethodProps {
  name: string;
  description: string;
  parameters?: Parameter[];
  returnType?: {
    type: string;
    description: string;
    example?: string;
  };
  example?: {
    code: string;
    language?: string;
  };
}

export function ApiMethod({ 
  name, 
  description, 
  parameters = [], 
  returnType,
  example 
}: ApiMethodProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <h4 className="font-mono text-lg font-semibold text-gray-900 mb-2">
        {name}
      </h4>
      <p className="text-gray-600 mb-3">{description}</p>
      
      {parameters.length > 0 && (
        <div className="mb-4">
          <h5 className="font-semibold text-gray-700 mb-2">Parameters</h5>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium text-gray-700">Parameter</th>
                  <th className="text-left py-2 font-medium text-gray-700">Type</th>
                  <th className="text-left py-2 font-medium text-gray-700">Description</th>
                </tr>
              </thead>
              <tbody>
                {parameters.map((param, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 font-mono text-xs">
                      {param.name}
                      {!param.required && '?'}
                    </td>
                    <td className="py-2 text-gray-600 font-mono text-xs">{param.type}</td>
                    <td className="py-2 text-gray-600">{param.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {returnType && (
        <div className="mb-4">
          <h5 className="font-semibold text-gray-700 mb-2">Returns</h5>
          <div className="bg-gray-50 rounded p-3">
            <p className="text-sm font-semibold text-gray-700 mb-1">
              {returnType.type}
            </p>
            <p className="text-sm text-gray-600">{returnType.description}</p>
            {returnType.example && (
              <pre className="text-xs text-gray-600 mt-2 overflow-x-auto">
                {returnType.example}
              </pre>
            )}
          </div>
        </div>
      )}

      {example && (
        <div>
          <h5 className="font-semibold text-gray-700 mb-2">Example</h5>
          <CodeBlock 
            language={example.language || 'javascript'} 
            code={example.code}
          />
        </div>
      )}
    </div>
  );
}