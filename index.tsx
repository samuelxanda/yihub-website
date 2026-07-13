
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import ActivityPage from './pages/ActivityPage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import ParticipantRegistrationPage from './pages/ParticipantRegistrationPage';
import ProjectSubmissionPage from './pages/ProjectSubmissionPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import SchoolsPage from './pages/SchoolsPage';
import SchoolDetailPage from './pages/SchoolDetailPage';
import GalleryPage from './pages/GalleryPage';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        {/* Showcase feature routes — must sit above the catch-all */}
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:eventSlug" element={<EventDetailPage />} />
        <Route path="/events/:eventSlug/register" element={<ParticipantRegistrationPage />} />
        <Route path="/events/:eventSlug/submit" element={<ProjectSubmissionPage />} />
        <Route path="/projects/:projectSlug" element={<ProjectDetailPage />} />
        <Route path="/schools" element={<SchoolsPage />} />
        <Route path="/schools/:schoolSlug" element={<SchoolDetailPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        {/* Activity pages (catch-all slug) — must be last */}
        <Route path="/:slug" element={<ActivityPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
