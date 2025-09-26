import { HiInformationCircle, HiExclamationCircle, HiCheckCircle, HiExclamation } from 'react-icons/hi';

interface InfoBoxProps {
  type: 'info' | 'warning' | 'success' | 'error';
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const typeStyles = {
  info: {
    container: 'bg-blue-50 border-blue-200 text-blue-800',
    icon: <HiInformationCircle className="w-5 h-5 text-blue-600" />,
    titleColor: 'text-blue-900'
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    icon: <HiExclamationCircle className="w-5 h-5 text-yellow-600" />,
    titleColor: 'text-yellow-900'
  },
  success: {
    container: 'bg-green-50 border-green-200 text-green-800',
    icon: <HiCheckCircle className="w-5 h-5 text-green-600" />,
    titleColor: 'text-green-900'
  },
  error: {
    container: 'bg-red-50 border-red-200 text-red-700',
    icon: <HiExclamation className="w-5 h-5 text-red-600" />,
    titleColor: 'text-red-900'
  }
};

export function InfoBox({ type, title, children, className = '' }: InfoBoxProps) {
  const styles = typeStyles[type];
  
  return (
    <div className={`border rounded-lg p-4 ${styles.container} ${className}`}>
      <div className="flex items-start space-x-2">
        {styles.icon}
        <div className="flex-1">
          {title && (
            <p className={`text-sm font-semibold ${styles.titleColor} mb-1`}>
              {title}
            </p>
          )}
          <div className="text-sm">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}