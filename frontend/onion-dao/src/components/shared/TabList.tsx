import React, { useRef, useCallback } from 'react';
import './TabList.css';

interface Tab {
  id: string;
  label: string;
  icon?: string;
  disabled?: boolean;
}

interface TabListProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  ariaLabel?: string;
  className?: string;
}

const TabList: React.FC<TabListProps> = ({
  tabs,
  activeTab,
  onTabChange,
  ariaLabel = 'Tabs',
  className = ''
}) => {
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const setTabRef = useCallback((id: string, el: HTMLButtonElement | null) => {
    if (el) {
      tabRefs.current.set(id, el);
    } else {
      tabRefs.current.delete(id);
    }
  }, []);

  const getNextTab = (currentIndex: number, direction: 1 | -1): number => {
    const enabledTabs = tabs.filter(t => !t.disabled);
    const currentEnabledIndex = enabledTabs.findIndex(t => t.id === tabs[currentIndex].id);

    let nextIndex = currentEnabledIndex + direction;
    if (nextIndex >= enabledTabs.length) nextIndex = 0;
    if (nextIndex < 0) nextIndex = enabledTabs.length - 1;

    return tabs.findIndex(t => t.id === enabledTabs[nextIndex].id);
  };

  const handleKeyDown = (event: React.KeyboardEvent, currentIndex: number) => {
    const { key } = event;
    let newIndex: number | null = null;

    switch (key) {
      case 'ArrowLeft':
        event.preventDefault();
        newIndex = getNextTab(currentIndex, -1);
        break;
      case 'ArrowRight':
        event.preventDefault();
        newIndex = getNextTab(currentIndex, 1);
        break;
      case 'Home': {
        event.preventDefault();
        const firstEnabled = tabs.findIndex(t => !t.disabled);
        if (firstEnabled !== -1) newIndex = firstEnabled;
        break;
      }
      case 'End':
        event.preventDefault();
        for (let i = tabs.length - 1; i >= 0; i--) {
          if (!tabs[i].disabled) {
            newIndex = i;
            break;
          }
        }
        break;
    }

    if (newIndex !== null && tabs[newIndex]) {
      const newTab = tabs[newIndex];
      onTabChange(newTab.id);
      tabRefs.current.get(newTab.id)?.focus();
    }
  };

  return (
    <div
      className={`tab-list ${className}`}
      role="tablist"
      aria-label={ariaLabel}
    >
      {tabs.map((tab, index) => {
        const isActive = tab.id === activeTab;

        return (
          <button
            key={tab.id}
            ref={(el) => setTabRef(tab.id, el)}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            aria-disabled={tab.disabled}
            tabIndex={isActive ? 0 : -1}
            className={`tab-button ${isActive ? 'tab-active' : ''} ${tab.disabled ? 'tab-disabled' : ''}`}
            onClick={() => !tab.disabled && onTabChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            disabled={tab.disabled}
          >
            {tab.icon && (
              <span className="material-icons tab-icon" aria-hidden="true">
                {tab.icon}
              </span>
            )}
            <span className="tab-label">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

// TabPanel component for content
interface TabPanelProps {
  id: string;
  activeTab: string;
  children: React.ReactNode;
  className?: string;
}

export const TabPanel: React.FC<TabPanelProps> = ({
  id,
  activeTab,
  children,
  className = ''
}) => {
  const isActive = id === activeTab;

  return (
    <div
      role="tabpanel"
      id={`tabpanel-${id}`}
      aria-labelledby={`tab-${id}`}
      hidden={!isActive}
      className={`tab-panel ${className}`}
      tabIndex={0}
    >
      {isActive && children}
    </div>
  );
};

export default TabList;
