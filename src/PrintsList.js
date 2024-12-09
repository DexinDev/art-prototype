// src/PrintsList.js
import React, { useState, useEffect } from 'react';
import {
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Grid,
  FormControl,
  Select,
  MenuItem,
  TextField,
  IconButton
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { getPrintsByArtworkId, savePrints, deletePrintById, savePrint } from './db';
import DeleteIcon from '@mui/icons-material/Delete';
import './PrintsList.css'; // Import the CSS file

const PrintsList = () => {
  const { artworkId } = useParams();
  const navigate = useNavigate();
  const [prints, setPrints] = useState([]);
  const [newPrints, setNewPrints] = useState([]);
  const [selectedPrintIds, setSelectedPrintIds] = useState([]);

  useEffect(() => {
    if (artworkId && !isNaN(Number(artworkId))) {
      fetchPrints();
    } else {
      console.error("Invalid or missing artworkId:", artworkId);
    }
  }, [artworkId]);

  const fetchPrints = async () => {
    try {
      const artworkPrints = await getPrintsByArtworkId(Number(artworkId));
      setPrints(artworkPrints);
    } catch (error) {
      console.error("Error fetching prints:", error);
    }
  };

  const handleAddLine = () => {
    setNewPrints([...newPrints, { material: '', edition: '', scale: '', price: '' }]);
  };

  const handleNewPrintChange = (index, field, value) => {
    const updatedPrints = [...newPrints];
    updatedPrints[index][field] = value;
    setNewPrints(updatedPrints);
  };

  const handleSaveNewPrints = async () => {
    const printsToSave = newPrints.map((print) => ({
      ...print,
      artworkId: Number(artworkId),
    }));
    await savePrints(printsToSave);
    setNewPrints([]); // Clear the form after saving
    fetchPrints(); // Refresh the prints list
  };

  const handleCheckboxChange = (printId) => {
    setSelectedPrintIds((prevSelected) =>
      prevSelected.includes(printId)
        ? prevSelected.filter((id) => id !== printId)
        : [...prevSelected, printId]
    );
  };

  const handleAddMedia = () => {
    if (selectedPrintIds.length > 0) {
      navigate(`/prints/add-media`, {
        state: { selectedPrintIds, prints, artworkId },
      });
    }
  };

  const handleDeletePrint = async (id) => {
    await deletePrintById(id);
    fetchPrints();
  };

  const handleBackToArtworks = () => {
    navigate('/');
  };

  // Handle reordering of images within each print
  const handleImageDragEnd = async (result, printId) => {
    if (!result.destination) return;

    const printIndex = prints.findIndex((p) => p.id === printId);
    const updatedMedia = Array.from(prints[printIndex].media);
    const [movedImage] = updatedMedia.splice(result.source.index, 1);
    updatedMedia.splice(result.destination.index, 0, movedImage);

    const updatedPrints = [...prints];
    updatedPrints[printIndex].media = updatedMedia;
    setPrints(updatedPrints);

    // Optionally save the reordered media to the database
    const updatedPrint = { ...prints[printIndex], media: updatedMedia };
    await savePrint(updatedPrint);
  };

  const handleDeleteImage = async (printId, imageIndex) => {
    const printIndex = prints.findIndex((p) => p.id === printId);
    const updatedMedia = prints[printIndex].media.filter((_, idx) => idx !== imageIndex);

    const updatedPrints = [...prints];
    updatedPrints[printIndex].media = updatedMedia;
    setPrints(updatedPrints);

    // Optionally save the updated media to the database
    const updatedPrint = { ...prints[printIndex], media: updatedMedia };
    await savePrint(updatedPrint);
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Prints List
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleBackToArtworks}
        style={{ marginBottom: '20px' }}
      >
        Back to Artworks
      </Button>

      {/* Add Prints Form */}
      <Paper style={{ padding: '20px', marginBottom: '20px' }}>
        <Typography variant="h6">Add New Prints</Typography>
        {newPrints.map((print, index) => (
          <Grid container spacing={2} alignItems="center" key={index} style={{ marginBottom: '10px' }}>
            <Grid item xs={3}>
              <FormControl fullWidth>
                <Select
                  value={print.material}
                  onChange={(e) => handleNewPrintChange(index, 'material', e.target.value)}
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
                onChange={(e) => handleNewPrintChange(index, 'edition', e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                label="Scale"
                value={print.scale}
                onChange={(e) => handleNewPrintChange(index, 'scale', e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                label="Price"
                type="number"
                value={print.price}
                onChange={(e) => handleNewPrintChange(index, 'price', e.target.value)}
                fullWidth
              />
            </Grid>
          </Grid>
        ))}
        <Button variant="outlined" color="primary" onClick={handleAddLine} style={{ marginTop: '10px' }}>
          Add Item
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveNewPrints}
          style={{ marginLeft: '10px', marginTop: '10px' }}
        >
          Save New Prints
        </Button>
      </Paper>

      {/* Existing Prints Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Select</TableCell>
              <TableCell>Edition</TableCell>
              <TableCell>Material</TableCell>
              <TableCell>Scale</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Images</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {prints.map((print) => (
              <TableRow key={print.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedPrintIds.includes(print.id)}
                    onChange={() => handleCheckboxChange(print.id)}
                  />
                </TableCell>
                <TableCell>{print.edition}</TableCell>
                <TableCell>{print.material}</TableCell>
                <TableCell>{print.scale}</TableCell>
                <TableCell>${print.price}</TableCell>
                {/* Display images for each print with drag-and-drop */}
                <TableCell>
                  <DragDropContext onDragEnd={(result) => handleImageDragEnd(result, print.id)}>
                    <Droppable droppableId={`media-${print.id}`} direction="horizontal">
                      {(provided) => (
                        <div style={{ display: 'flex', gap: '5px' }} ref={provided.innerRef} {...provided.droppableProps}>
                          {print.media?.map((img, idx) => (
                            <Draggable key={idx} draggableId={`media-${print.id}-${idx}`} index={idx}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="image-container"
                                >
                                  <img
                                    src={img}
                                    alt={`Print ${print.id} - ${idx}`}
                                    className="image-preview"
                                  />
                                  <IconButton
                                    size="small"
                                    color="secondary"
                                    className="delete-button"
                                    onClick={() => handleDeleteImage(print.id, idx)}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDeletePrint(print.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Media Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddMedia}
        style={{ marginTop: '20px' }}
        disabled={selectedPrintIds.length === 0}
      >
        Add Media
      </Button>
    </div>
  );
};

export default PrintsList;
