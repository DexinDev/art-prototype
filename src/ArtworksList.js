// src/ArtworksList.js
import React, { useState, useEffect } from 'react';
import { Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getAllArtworks, deleteArtworkById } from './db';

const ArtworksList = () => {
  const [artworks, setArtworks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchArtworks();
  }, []);

  const fetchArtworks = async () => {
    const allArtworks = await getAllArtworks();
    setArtworks(allArtworks);
  };

  const handleAddNew = () => {
    navigate('/add');
  };

  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  const handleDelete = async (id) => {
    await deleteArtworkById(id);
    fetchArtworks();
  };

  const handlePrints = (id) => {
    navigate(`/prints/${id}`);
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Artworks List
      </Typography>
      <Button variant="contained" color="primary" onClick={handleAddNew} style={{ marginBottom: '20px' }}>
        Add New
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Main Image</TableCell>
              <TableCell>Artwork Name</TableCell>
              <TableCell>Artist</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Price</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {artworks.map((artwork) => (
              <TableRow key={artwork.id}>
                <TableCell>
                  {artwork.mainImage && (
                    <img
                      src={artwork.mainImage}
                      alt={artwork.name}
                      style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                  )}
                </TableCell>
                <TableCell>{artwork.name}</TableCell>
                <TableCell>{artwork.artist}</TableCell>
                <TableCell>{artwork.year}</TableCell>
                <TableCell>${artwork.price}</TableCell>
                <TableCell align="right">
                  <Button variant="outlined" onClick={() => handleEdit(artwork.id)} style={{ marginRight: '10px' }}>
                    Edit
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={() => handleDelete(artwork.id)} style={{ marginRight: '10px' }}>
                    Delete
                  </Button>
                  <Button variant="outlined" color="primary" onClick={() => handlePrints(artwork.id)}>
                    Prints
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ArtworksList;
