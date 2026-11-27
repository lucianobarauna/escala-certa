import { I18nProvider } from 'react-aria-components';

import { HomeView } from '@/views/HomeView/HomeView';

const APP_LOCALE = 'pt-BR';

function App() {
  return (
    <I18nProvider locale={APP_LOCALE}>
      <HomeView />
    </I18nProvider>
  );
}

export default App;
