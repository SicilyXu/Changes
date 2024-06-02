import React, { useState } from 'react';

const GeneralImageSelector = ({ width, height }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [objectFit, setObjectFit] = useState('none');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const imageObjectURL = URL.createObjectURL(file);
    setImagePreview(imageObjectURL);
  };

  const containerStyle = {
    width: `${width}px`,
    height: `${height}px`,
    overflow: 'hidden',
    position: 'relative',
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: objectFit,
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} accept="image/*" />
      <div style={{ marginTop: '10px' }}>
        <label htmlFor="objectFit">Object Fit: </label>
        <select id="objectFit" value={objectFit} onChange={(e) => setObjectFit(e.target.value)}>
          <option value="none">Default</option>
          <option value="fill">Fill</option>
          <option value="cover">Cover</option>
        </select>
      </div>
      {imagePreview && (
        <div style={containerStyle}>
          <img src={imagePreview} alt="Preview" style={imageStyle} />
        </div>
      )}
    </div>
  );
};

export default GeneralImageSelector;
