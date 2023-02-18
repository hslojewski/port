import moment from 'moment';
import Moment from 'react-moment';
import 'moment-timezone';

import 'bootstrap/dist/css/bootstrap.css';
import "bootstrap-icons/font/bootstrap-icons.css";

import './App.css';

import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom";

const React = require('react'),
      $ = require('jquery'),
      { useState, useEffect } = require('react');

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="about" element={<About />}>
          {/* <Route path="resume" element={<Resume />} /> */}
        </Route>
      </Routes>
    </div>
  );
}

function Home() {
  return <h2>Home</h2>;
  // Intro
  // Projects/Categories list
  // Contact/Links
}

function About() {
  return <h2>About</h2>;
}

const Navbar = () => {
  return (
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/about">About</a></li>
    </ul>
  );
}

export default App;
