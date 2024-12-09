// src/AddPrintsForm.js
import React, { useState, useEffect } from 'react';
import { Button, TextField, Select, MenuItem, Typography, Paper, Grid, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { savePrints, getPrintsByArtworkId } from './db';

const AddPrintsForm = () => {
  const { artworkId } = useParams();
  const navigate = useNavigate();
  const [prints, setPrints] = useState([]);
  const [existingPrints, setExistingPrints] = useState([]);

  useEffect(() => {
    fetchExistingPrints();
  }, [artworkId]);

  const fetchExistingPrints = async () => {
    const artworkPrints = await getPrintsByArtworkId(Number(artworkId));
    setExistingPrints(artworkPrints);
  };

  const handleAddLine = () => {
    setPrints([...prints, { material: '', edition: '', scale: '', price: '' }]);
  };

  const handleChange = (index, field, value) => {
    const updatedPrints = [...prints];
    updatedPrints[index][field] = value;
    setPrints(updatedPrints);
  };

  const handleSave = async () => {
    const printsToSave = prints.map((print) => ({
      ...print,
      artworkId: Number(artworkId),
    }));
    await savePrints(printsToSave);
    navigate(`/prints/${artworkId}`);
  };

  const handleBackToArtworks = () => {
    navigate('/');
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Add Prints
      </Typography>
      <Button variant="contained" color="secondary" onClick={handleBackToArtworks} style={{ marginBottom: '20px' }}>
        Back to Artworks List
      </Button>

      {/* Form for Adding New Prints */}
      <Paper style={{ padding: '20px', marginBottom: '20px' }}>
        <Typography variant="h6">New Print Entries</Typography>
        {prints.map((print, index) => (
          <Grid container spacing={2} alignItems="center" key={index} style={{ marginBottom: '10px' }}>
            <Grid item xs={3}>
              <FormControl fullWidth>
                <Select
                  value={print.material}
                  onChange={(e) => handleChange(index, 'material', e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Material
                  </MenuItem>
                  <MenuItem value="fine art paper">Fine Art Paper</MenuItem>
                  <MenuItem value="canvas">Canvas</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={2}>
              <TextField
                label="Edition"
                value={print.edition}
                onChange={(e) => handleChange(index, 'edition', e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                label="Scale"
                value={print.scale}
                onChange={(e) => handleChange(index, 'scale', e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                label="Price"
                type="number"
                value={print.price}
                onChange={(e) => handleChange(index, 'price', e.target.value)}
                fullWidth
              />
            </Grid>
          </Grid>
        ))}
        <Button variant="outlined" color="primary" onClick={handleAddLine} style={{ marginTop: '10px' }}>
          Add Item
        </Button>
      </Paper>
      <Button variant="contained" color="primary" onClick={handleSave} style={{ marginBottom: '20px' }}>
        Save
      </Button>

      {/* Display Existing Prints */}
      <Typography variant="h6" gutterBottom>
        Existing Prints
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Edition</TableCell>
              <TableCell>Material</TableCell>
              <TableCell>Scale</TableCell>
              <TableCell>Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {existingPrints.map((print) => (
              <TableRow key={print.id}>
                <TableCell>{print.edition}</TableCell>
                <TableCell>{print.material}</TableCell>
                <TableCell>{print.scale}</TableCell>
                <TableCell>${print.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AddPrintsForm;
