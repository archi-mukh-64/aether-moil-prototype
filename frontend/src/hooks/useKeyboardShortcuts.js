import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

/**
 * Global Keyboard Shortcuts for Industrial Mining Workstation
 * 1-8: Quick Route Navigation
 * M: Mine Selector focus / toggle
 * S: Scenario Lab toggle
 * R: Reset Baseline
 * ?: Support / Guide Modal
 */
export function useKeyboardShortcuts() {
  const navigate = useNavigate();
  const { 
    setIsCommandDrawerOpen, 
    setIsSupportModalOpen, 
    resetBaseline 
  } = useApp();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore when user is typing inside an input/textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
        return;
      }

      switch (e.key) {
        case '1':
          navigate('/');
          break;
        case '2':
          navigate('/command-center');
          break;
        case '3':
          navigate('/reserve-radar');
          break;
        case '4':
          navigate('/alert-engine');
          break;
        case '5':
          navigate('/protocol');
          break;
        case '6':
          navigate('/equipment');
          break;
        case '7':
          navigate('/analytics');
          break;
        case '8':
          navigate('/decision-log');
          break;
        case 's':
        case 'S':
          setIsCommandDrawerOpen(prev => !prev);
          break;
        case 'r':
        case 'R':
          resetBaseline();
          break;
        case '?':
        case 'h':
        case 'H':
          setIsSupportModalOpen(prev => !prev);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, setIsCommandDrawerOpen, setIsSupportModalOpen, resetBaseline]);
}
