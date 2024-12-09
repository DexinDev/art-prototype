// src/EditPrintForm.js
import React, { useState, useEffect } from 'react';
import { Button, TextField, Select, MenuItem, Typography, Paper, FormControl } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { getPrintById, savePrint } from './db';

const EditPrintForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [printData, setPrintData] = useState({
    material: '',
    edition: '',
    scale: '',
    price: '',
  });

  useEffect(() => {
    const fetchPrint = async () => {
      const print = await getPrintById(Number(id));
      if (print) {
        setPrintData(print);
      }
    };
    fetchPrint();
  }, [id]);

  const handleChange = (field, value) => {
    setPrintData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    await savePrint(printData);
    navigate(`/prints/${printData.artworkId}`);
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Edit Print
      </Typography>
      <Paper style={{ padding: '20px', marginBottom: '20px' }}>
        <FormControl fullWidth margin="normal">
          <Select
            value={printData.material}
            onChange={(e) => handleChange('material', e.target.value)}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Material
            </MenuItem>
            <MenuItem value="fine art paper">Fine Art Paper</MenuItem>
            <MenuItem value="canvas">Canvas</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Edition"
          value={printData.edition}
          onChange={(e) => handleChange('edition', e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Scale"
          value={printData.scale}
          onChange={(e) => handleChange('scale', e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Price"
          type="number"
          value={printData.price}
          onChange={(e) => handleChange('price', e.target.value)}
          fullWidth
          margin="normal"
        />
      </Paper>
      <Button variant="contained" color="primary" onClick={handleSave}>
        Save
      </Button>
      <Button variant="outlined" color="secondary" onClick={() => navigate(`/prints/${printData.artworkId}`)} style={{ marginLeft: '10px' }}>
        Cancel
      </Button>
    </div>
  );
};

export default EditPrintForm;
