// src/AddMediaForm.js
import React, { useState, useEffect } from 'react';
import { Button, Typography, Paper, Grid } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { saveMediaForPrints } from './db';

const AddMediaForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedPrintIds, prints, artworkId } = location.state || {};

  const [images, setImages] = useState([]);

  useEffect(() => {
    if (!artworkId || !selectedPrintIds || selectedPrintIds.length === 0) {
      console.error("Missing required data for Add Media form. Redirecting...");
      navigate(`/prints/${artworkId || ''}`);
    }
  }, [artworkId, selectedPrintIds, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prevImages) => [...prevImages, reader.result]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveMedia = async () => {
    await saveMediaForPrints(selectedPrintIds, images);
    navigate(`/prints/${artworkId}`);
  };

  const handleBack = () => {
    navigate(`/prints/${artworkId}`);
  };

  // Correctly reorder images on drag-and-drop
  const handleOnDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const reorderedImages = Array.from(images);
    const [movedImage] = reorderedImages.splice(source.index, 1);
    reorderedImages.splice(destination.index, 0, movedImage);

    setImages(reorderedImages);
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Add Media
      </Typography>
      <Paper style={{ padding: '20px', marginBottom: '20px' }}>
        <Typography variant="h6">Selected Prints</Typography>
        <ul>
          {selectedPrintIds?.map((printId) => {
            const print = prints.find((p) => p.id === printId);
            return (
              <li key={printId}>
                {print.edition}, {print.material}, {print.scale}
              </li>
            );
          })}
        </ul>

        <Typography variant="h6" style={{ marginTop: '20px' }}>
          Upload Images
        </Typography>
        <Button variant="contained" component="label" style={{ marginTop: '10px' }}>
          Upload Image
          <input type="file" accept="image/*" hidden onChange={handleImageChange} />
        </Button>

        {/* Drag-and-Drop Context */}
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="images" direction="horizontal">
            {(provided) => (
              <div
                style={{
                  display: 'flex',
                  gap: '5px',
                  flexWrap: 'wrap',
                  marginTop: '10px'
                }}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {images.map((img, index) => (
                  <Draggable key={index} draggableId={`image-${index}`} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...provided.draggableProps.style,
                          marginBottom: '10px',
                          display: 'inline-block',
                        }}
                      >
                        <img
                          src={img}
                          alt={`Preview ${index}`}
                          style={{
                            width: '100px',
                            height: '100px',
                            objectFit: 'cover',
                            borderRadius: '4px',
                          }}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <Button variant="contained" color="primary" onClick={handleSaveMedia} style={{ marginTop: '20px' }}>
          Save
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleBack} style={{ marginTop: '20px', marginLeft: '10px' }}>
          Cancel
        </Button>
      </Paper>
    </div>
  );
};

export default AddMediaForm;
