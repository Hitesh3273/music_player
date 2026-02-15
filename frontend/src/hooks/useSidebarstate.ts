// src/hooks/useSidebarState.ts
import { useState, useCallback } from 'react';

interface UseSidebarStateProps {
  isMobile: boolean;
}

export const useSidebarState = ({ isMobile }: UseSidebarStateProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setSidebarOpen(prev => !prev);
    } else {
      setSidebarCollapsed(prev => !prev);
    }
  }, [isMobile]);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const openSidebar = useCallback(() => {
    setSidebarOpen(true);
  }, []);

  return {
    sidebarCollapsed,
    sidebarOpen,
    toggleSidebar,
    closeSidebar,
    openSidebar,
  };
};
