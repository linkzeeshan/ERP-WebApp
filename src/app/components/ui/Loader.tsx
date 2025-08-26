interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'white';
  fullScreen?: boolean;
  text?: string;
}

export default function Loader({ 
  size = 'medium', 
  color = 'primary',
  fullScreen = false,
  text
}: LoaderProps) {
  const sizeClass = 
    size === 'small' ? 'w-5 h-5' : 
    size === 'large' ? 'w-12 h-12' : 
    'w-8 h-8';
  
  const colorClass = 
    color === 'primary' ? 'text-indigo-600' : 
    color === 'secondary' ? 'text-gray-600' : 
    'text-white';

  const spinner = (
    <div className="flex flex-col items-center justify-center">
      <svg 
        className={`animate-spin ${sizeClass} ${colorClass}`} 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        ></circle>
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      {text && <p className={`mt-2 text-sm ${colorClass}`}>{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
}

export function ButtonLoader({ 
  size = 'small', 
  color = 'white' 
}: { 
  size?: 'small' | 'medium'; 
  color?: 'primary' | 'secondary' | 'white';
}) {
  return <Loader size={size} color={color} />;
}

export function TableLoader() {
  return (
    <div className="w-full py-12 flex items-center justify-center">
      <Loader size="medium" color="primary" text="Loading data..." />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="w-full h-64 flex items-center justify-center">
      <Loader size="large" color="primary" text="Loading..." />
    </div>
  );
}
