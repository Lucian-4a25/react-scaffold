import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/index';
import './index.css';

const domNode = document.getElementById('app');
const root = createRoot(domNode);

root.render(<App text='dwad' obj={{ n: 2233 }} />);
