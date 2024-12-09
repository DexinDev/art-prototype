// src/ArtForm.js
import React, { useState, useEffect } from 'react';
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Typography,
  Autocomplete,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { saveArtwork, getArtworkById } from './db';

const artistOptions = [
    "Maria Semenskaya", "Yulia Guzik", "Lyubov Kharlamova", "Vladimir Kolesnikov",
    "Lyudmila Baronina", "Walter Limo", "Konstantin Lupanov", "Aslan Orazaev",
    "Dmitry Prokopovich", "Ilya Kutoboy", "Andrey Skripka", "Alexander Chursin",
    "Tim Vilgant", "Edward Churkin", "Alexander Savko", "Alisa Gorelova",
    "UNPLATE", "Dmitry Kotlyarov", "Petr Lybin", "Larisa Blokhina",
    "Inna Son", "Misak Cholokyan", "Alexander Singur", "Konstantin Slepukhin",
    "Gleb Gavrilenkov", "Igor Sudyin", "Igor Mikhailenko", "Nalbi Bugashev",
    "Sario De Nola", "Gleb Baranov", "Sarah Rupp", "Shannon Bulrice",
    "Dereck Hard", "August Henry", "Mitsushige Nishiwaki", "Ji Aime",
    "Edgard Rippel Barbosa", "Alexander Yakovlev", "Sava Hoch", "Slava Fokk",
    "Kimberly Paradeis", "Ian Demsky, aka @kindabloop"
  ];

  const mediumOptions = [
    "Acrylic", "Airbrush", "Algorithmic Art", "Aluminum", "Aquatint", "Ballpoint Pen",
    "Black & White", "Bronze", "Canvas", "Ceramic", "Chalk", "Charcoal", "Clay", "Color",
    "Conte", "Crayon", "C-type", "Decoupage", "Digital", "Drypoint", "Dye Transfer", "Enamel",
    "Encaustic", "Environmental", "Etching", "Fabric", "Fiber", "Fiberglass", "Found Objects",
    "Fractal", "Full spectrum", "Gelatin", "Gesso", "Giclée", "Glass", "Gouache", "Granite",
    "Graphite", "Household", "Ink", "Interactive", "Kinetic", "Latex", "Leather", "LED",
    "Lenticular", "Lights", "Linocuts", "Lithograph", "Manipulated", "Marble", "Marker",
    "Metal", "Mezzotint", "Monotype", "Mosaic", "Neon", "Oil", "Paint", "Paper", "Paper mache",
    "Pastel", "Pen", "Pencil", "Photo", "Photogram", "Pinhole", "Plaster", "Plastic", "Platinum",
    "Plywood", "Polaroid", "Pottery", "Printing", "Quill", "Resin", "Robotics", "Rubber",
    "Screenprinting", "Silverpoint", "Sound", "Spray Paint", "Steel", "Stencil", "Stone",
    "Taxidermy", "Tempera", "Textile", "Timber", "Vector", "Watercolor", "Wax", "Wood", "Woodcut"
  ];

const ArtForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    mainImage: null,
    additionalImages: [],
    about: '',
    artist: '',
    year: '',
    width: '',
    height: '',
    weight: '',
    category: '',
    medium: '',
    price: '', // Added price field
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState([]);

  useEffect(() => {
    if (isEdit) {
      const fetchArtwork = async () => {
        const artwork = await getArtworkById(Number(id));
        if (artwork) {
          setFormData(artwork);
          setImagePreview(artwork.mainImage);
          setAdditionalImagePreviews(artwork.additionalImages || []);
        }
      };
      fetchArtwork();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setFormData((prevData) => ({ ...prevData, mainImage: base64String }));
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const readers = files.map((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return new Promise((resolve) => {
        reader.onload = () => resolve(reader.result);
      });
    });
    Promise.all(readers).then((base64Images) => {
      setFormData((prevData) => ({
        ...prevData,
        additionalImages: base64Images,
      }));
      setAdditionalImagePreviews(base64Images);
    });
  };

  const handleSave = async () => {
    await saveArtwork({ ...formData, id: isEdit ? Number(id) : undefined });
    navigate('/');
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        {isEdit ? 'Edit Artwork' : 'Add New Artwork'}
      </Typography>
      <TextField
        label="Name of the artwork"
        name="name"
        value={formData.name}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" component="label">
        Main Image
        <input type="file" accept="image/*" hidden onChange={handleMainImageChange} />
      </Button><br></br>
      {imagePreview && <img src={imagePreview} alt="Main Preview" style={{ width: '100px', marginTop: '10px' }} />}
      
      <Button variant="contained" component="label" style={{ marginTop: '20px' }}>
        Additional Images
        <input type="file" accept="image/*" hidden multiple onChange={handleAdditionalImagesChange} />
      </Button><br></br>
      {additionalImagePreviews.map((img, index) => (
        <img key={index} src={img} alt={`Additional Preview ${index + 1}`} style={{ width: '50px', marginTop: '10px' }} />
      ))}

      <TextField
        label="About the artwork"
        name="about"
        value={formData.about}
        onChange={handleChange}
        fullWidth
        margin="normal"
        multiline
        rows={4}
      />
      <Autocomplete
        options={artistOptions}
        value={formData.artist}
        onChange={(event, newValue) => setFormData({ ...formData, artist: newValue })}
        renderInput={(params) => <TextField {...params} label="Artist" fullWidth margin="normal" />}
      />
      <TextField label="Year of Creation" name="year" value={formData.year} onChange={handleChange} fullWidth margin="normal" />
      <TextField label="Width" name="width" value={formData.width} onChange={handleChange} fullWidth margin="normal" />
      <TextField label="Height" name="height" value={formData.height} onChange={handleChange} fullWidth margin="normal" />
      <TextField label="Weight" name="weight" value={formData.weight} onChange={handleChange} fullWidth margin="normal" />

      <FormControl fullWidth margin="normal">
        <InputLabel>Category</InputLabel>
        <Select name="category" value={formData.category} onChange={handleChange}>
          <MenuItem value="original">Original</MenuItem>
          <MenuItem value="digital">Digital</MenuItem>
        </Select>
      </FormControl>

      <Autocomplete
        options={mediumOptions}
        value={formData.medium}
        onChange={(event, newValue) => setFormData({ ...formData, medium: newValue })}
        renderInput={(params) => <TextField {...params} label="Medium" fullWidth margin="normal" />}
      />

      <TextField
        label="Price"
        name="price"
        type="number"
        value={formData.price}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

      <Button variant="contained" color="primary" onClick={handleSave} style={{ marginTop: '20px' }}>
        Save
      </Button>
    </div>
  );
};

export default ArtForm;
