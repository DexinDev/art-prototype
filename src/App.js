// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ArtworksList from './ArtworksList';
import ArtForm from './ArtForm';
import PrintsList from './PrintsList';
import AddMediaForm from './AddMediaForm';
import EditPrintForm from './EditPrintForm';

function App() {
  return (
    <Router>
      <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
        <Routes>
          <Route path="/" element={<ArtworksList />} />
          <Route path="/add" element={<ArtForm />} />
          <Route path="/edit/:id" element={<ArtForm />} />
          <Route path="/prints/:artworkId" element={<PrintsList />} />
          <Route path="/prints/add-media" element={<AddMediaForm />} />
          <Route path="/prints/edit/:id" element={<EditPrintForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
