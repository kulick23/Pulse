import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const MainPage = lazy(() => import('../Pages/MainPage/MainPage'));
const AboutPage = lazy(() => import('../Pages/AboutPage/AboutPage'));
const JobPage = lazy(() => import('../Pages/JobPage/JobPage'));
const VacanciesPage = lazy(() => import('../Pages/VacanciesPage/VacanciesPage'));
const ContactPage = lazy(() => import('../Pages/ContactPage/ContactPage'));
const RegistrationPage = lazy(() => import('../Pages/RegistrationPage/RegistrationPage'));
const NewsPage = lazy(() => import('../Pages/NewsPage/NewsPage'));
const NewsItemPage = lazy(() => import('../Pages/NewsItemPage/NewsItemPage'));
const PrivacyPage = lazy(() => import('../Pages/PolicyPage/PolicyPage'));
const ServicesPage = lazy(() => import('../Pages/ServicesPage/ServicesPage'));
const ServicesItemPage = lazy(() => import('../Pages/ServicesItemPage/ServicesItemPage'));
const ProfilePage = lazy(() => import('../Pages/ProfilePage/ProfilePage'));
const RecoveryPage = lazy(() => import('../Pages/RecoveryPage/RecoveryPage'));
const ConfirmationPage = lazy(() => import('../Pages/ConfirmationPage/ConfirmationPage'));
const NotFoundPage = lazy(() => import('../Pages/NotFoundPage'));

const LoadingPage = () => (
  <div className="route-loading" role="status" aria-live="polite">
    <span aria-hidden="true" />
    <p>Pulse</p>
  </div>
);

function AppRoutes() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/job" element={<JobPage />} />
        <Route path="/vacancies/:id" element={<VacanciesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<ProfilePage />} />
        <Route path="/bank/*" element={<ProfilePage />} />
        <Route path="/travel" element={<ProfilePage />} />
        <Route path="/travel/:slug" element={<ProfilePage />} />
        <Route path="/shop" element={<ProfilePage />} />
        <Route path="/shop/product/:slug" element={<ProfilePage />} />
        <Route path="/business/*" element={<ProfilePage />} />
        <Route path="/investing/*" element={<ProfilePage />} />
        <Route path="/mobile/*" element={<ProfilePage />} />
        <Route path="/insurance/*" element={<ProfilePage />} />
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
        <Route path="/recovery" element={<RecoveryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:id" element={<NewsItemPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:id" element={<ServicesItemPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
