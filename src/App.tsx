import React from 'react';
import '@fontsource-variable/geist';
import './Styles/App.scss';
import HistoryRouter from './Routes/HistoryRouter';
import browserHistory from './Routes/browserHistory';
import AppRoutes from './Routes/AppRoutes';
import ScrollToTop from './Routes/ScrollToTop';
import { Provider } from 'react-redux';
import { store } from './redux';
import Footer from './Components/Footer/Footer';
import Navigation from './Components/Navigation/Navigation';
import { useNavigation } from './Hooks/useNavigation';
import { useLocation } from 'react-router-dom';
import AppErrorBoundary from './Components/AppErrorBoundary/AppErrorBoundary';

const App: React.FC = () => {
  useNavigation();
  const location = useLocation();
  const isBankApp = /^\/(?:profile|bank|business|investing|mobile|insurance|travel|shop|login|registration|recovery|confirmation)\/?(?:\/.*)?$/.test(
    location.pathname
  );

  return (
    <div className="App">
      <AppErrorBoundary>
        <Navigation />
        <AppRoutes />
        {!isBankApp && <Footer />}
      </AppErrorBoundary>
    </div>
  );
};

const AppWrapper: React.FC = () => {
  return (
    // @ts-ignore
    <Provider store={store}>
      <HistoryRouter history={browserHistory}>
        <ScrollToTop />
        <App />
      </HistoryRouter>
    </Provider>
  );
};

export default AppWrapper;
