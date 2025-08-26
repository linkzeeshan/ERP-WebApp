import { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  defaultTabId?: string;
  onChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
}

export default function Tabs({ 
  tabs, 
  defaultTabId, 
  onChange,
  variant = 'default'
}: TabsProps) {
  const [activeTabId, setActiveTabId] = useState(defaultTabId || tabs[0]?.id);

  const handleTabClick = (tabId: string) => {
    setActiveTabId(tabId);
    if (onChange) {
      onChange(tabId);
    }
  };

  const getTabStyles = (tabId: string, disabled?: boolean) => {
    const isActive = activeTabId === tabId;
    
    if (disabled) {
      return 'text-gray-400 cursor-not-allowed';
    }
    
    switch (variant) {
      case 'pills':
        return isActive
          ? 'bg-indigo-100 text-indigo-700 font-medium'
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100';
      case 'underline':
        return isActive
          ? 'border-b-2 border-indigo-500 text-indigo-600 font-medium'
          : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';
      default:
        return isActive
          ? 'border-indigo-500 text-indigo-600 font-medium'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';
    }
  };

  const tabListClasses = {
    default: 'border-b border-gray-200',
    pills: 'flex space-x-1',
    underline: 'border-b border-gray-200'
  };

  const tabClasses = {
    default: 'py-4 px-1 border-b-2 -mb-px',
    pills: 'px-3 py-2 rounded-md',
    underline: 'py-4 px-1 border-b-2 -mb-px'
  };

  return (
    <div>
      <div className={`${tabListClasses[variant]}`}>
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && handleTabClick(tab.id)}
              className={`${tabClasses[variant]} ${getTabStyles(tab.id, tab.disabled)}`}
              disabled={tab.disabled}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-4">
        {tabs.find(tab => tab.id === activeTabId)?.content}
      </div>
    </div>
  );
}
