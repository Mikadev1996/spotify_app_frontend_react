import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.scss';
import './styles/Nav.scss';
import './styles/Home.scss';
import './styles/Forms.scss';
import './styles/SearchSong.scss';
import './styles/LogIn.scss';
import './styles/Footer.scss';
import RouteSwitch from "./RouteSwitch";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouteSwitch />
  </React.StrictMode>
);

