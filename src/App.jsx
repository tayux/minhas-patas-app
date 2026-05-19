import { useState, useCallback, useRef } from 'react';
import { NavCtx } from './components/NavContext.jsx';
import { PetProvider } from './components/PetContext.jsx';
import { useAuth } from './components/AuthContext.jsx';
import { PhoneShell } from './components/Shared.jsx';
import { T } from './theme.js';

import Onboarding       from './screens/Onboarding.jsx';
import Home             from './screens/Home.jsx';
import Meds             from './screens/Meds.jsx';
import AIReader         from './screens/AIReader.jsx';
import Today            from './screens/Today.jsx';
import Pet              from './screens/Pet.jsx';
import Finance          from './screens/Finance.jsx';
import LockNotif        from './screens/LockNotif.jsx';
import Calendar         from './screens/Calendar.jsx';
import Notifications    from './screens/Notifications.jsx';
import PetOnboarding    from './screens/PetOnboarding.jsx';
import Health           from './screens/Health.jsx';
import ExamUpload       from './screens/ExamUpload.jsx';
import AddMedication    from './screens/AddMedication.jsx';
import BehaviorDiary    from './screens/BehaviorDiary.jsx';
import Feeding          from './screens/Feeding.jsx';
import WalksActivities  from './screens/WalksActivities.jsx';
import HygieneGrooming  from './screens/HygieneGrooming.jsx';
import VetConsultations from './screens/VetConsultations.jsx';
import DocumentsLibrary from './screens/DocumentsLibrary.jsx';
import Settings         from './screens/Settings.jsx';
import Vaccines         from './screens/Vaccines.jsx';
import ReportsExport    from './screens/ReportsExport.jsx';

const SCREENS = {
  onboarding:     { component: Onboarding,       dark: false, modal: false },
  home:           { component: Home,             dark: false, modal: false },
  meds:           { component: Meds,             dark: false, modal: false },
  ai:             { component: AIReader,         dark: false, modal: true  },
  today:          { component: Today,            dark: false, modal: false },
  pet:            { component: Pet,              dark: false, modal: false },
  finance:        { component: Finance,          dark: false, modal: false },
  lock:           { component: LockNotif,        dark: true,  modal: false },
  calendar:       { component: Calendar,         dark: false, modal: true  },
  notifications:  { component: Notifications,    dark: false, modal: true  },
  petonboarding:  { component: PetOnboarding,    dark: false, modal: true  },
  health:         { component: Health,           dark: false, modal: false },
  examupload:     { component: ExamUpload,       dark: false, modal: true  },
  addmedication:  { component: AddMedication,    dark: false, modal: true  },
  behaviordiary:  { component: BehaviorDiary,    dark: false, modal: false },
  feeding:        { component: Feeding,          dark: false, modal: false },
  walks:          { component: WalksActivities,  dark: false, modal: false },
  hygiene:        { component: HygieneGrooming,  dark: false, modal: false },
  vet:            { component: VetConsultations, dark: false, modal: false },
  documents:      { component: DocumentsLibrary, dark: false, modal: false },
  settings:       { component: Settings,         dark: false, modal: false },
  vaccines:       { component: Vaccines,         dark: false, modal: false },
  reports:        { component: ReportsExport,    dark: false, modal: false },
};

export default function App() {
  const { user } = useAuth();
  const [screen, setScreen]       = useState(() => user ? 'home' : 'onboarding');
  const [history, setHistory]     = useState([]);
  const [direction, setDirection] = useState('forward');
  const [screenKey, setScreenKey] = useState(0);

  const nav = useCallback((id) => {
    if (!SCREENS[id]) return;
    setDirection('forward');
    setHistory(h => [...h, screen]);
    setScreen(id);
    setScreenKey(k => k + 1);
  }, [screen]);

  const back = useCallback(() => {
    setHistory(h => {
      const prev = h[h.length - 1] || 'home';
      setDirection('back');
      setScreen(prev);
      setScreenKey(k => k + 1);
      return h.slice(0, -1);
    });
  }, []);

  const { component: Screen, dark, modal } = SCREENS[screen] || SCREENS.home;
  const animClass = modal
    ? 'screen-enter-modal'
    : direction === 'back'
      ? 'screen-enter-back'
      : 'screen-enter-forward';

  return (
    <NavCtx.Provider value={{ nav, back, screen, direction }}>
      <PetProvider>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center',
          justifyContent:'center', minHeight:'100vh', background:T.bgWash, padding:'0' }}>
          <div style={{
            width:'100%', maxWidth:430,
            height:'100dvh', maxHeight:930,
            position:'relative', overflow:'hidden',
            boxShadow:'0 30px 80px rgba(0,0,0,0.18)',
          }}>
            <PhoneShell dark={dark}>
              <div key={screenKey} className={animClass} style={{ height:'100%' }}>
                <Screen />
              </div>
            </PhoneShell>
          </div>
        </div>
      </PetProvider>
    </NavCtx.Provider>
  );
}
