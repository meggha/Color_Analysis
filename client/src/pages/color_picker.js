import React, { useState } from 'react';
import "./color_picker.css";

function ImageUploader() {
  const [imageUrl, setImageUrl] = useState('');
  const [hoverColor, setHoverColor] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [skinColor, setSkinColor] = useState('');
  const [hairColor, setHairColor] = useState('');
  const [eyeColor, setEyeColor] = useState('');
  const [response, setResponse] = useState('');

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleImageHover = (event) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      const x = event.nativeEvent.offsetX;
      const y = event.nativeEvent.offsetY;
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0);
      const pixelData = context.getImageData(x, y, 1, 1).data;
      const hex = '#' + ('000000' + rgbToHex(pixelData[0], pixelData[1], pixelData[2])).slice(-6);
      setHoverColor(hex);
    };
    img.src = imageUrl;
  };

  const handleDoubleClick = () => {
    setSelectedColor(hoverColor);
  };

  const handleAssignColor = (color) => {
    if (selectedColor) {
      switch (color) {
        case 'skin':
          setSkinColor(selectedColor);
          break;
        case 'hair':
          setHairColor(selectedColor);
          break;
        case 'eyes':
          setEyeColor(selectedColor);
          break;
        default:
          break;
      }
      setSelectedColor('');
    }
  };

  const rgbToHex = (r, g, b) => {
    return ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
  };

  const generateColor = async () => {
    try {
      //  console.log("one",skinColor, hairColor, eyeColor);
      const response = await fetch('/resultPage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skinColor, hairColor, eyeColor }),
      });
      //console.log("two");
      const data = await response.json();
      setResponse(data)
      console.log("three",data);
    } catch (error) {
      console.error('Error fetching color', error);
    }
  };

  return (
  <div class="card">
  <div class="card__border"></div>
  <div class="card_title__container">
    <span class="card_title">Colour Analysis</span>
    <p class="card_paragraph">
    Match your hair color, eye color, and the color of your skin to find the colors that will make you look absolutely remarkable!
    </p>
  </div>
  
  <hr class="line" />
  <ul class="card__list">
    <li class="card__list_item">
      <input type="file" accept="image/*" id="images" onChange={handleImageUpload} />
    </li>
      {imageUrl && (
        <li class="card__list_item">
          <div>
          <li class="card__list_items">
          <img src={imageUrl} alt="Uploaded" style={{ width: "350px", height: "350px" }} 
          onMouseMove={handleImageHover} onDoubleClick={handleDoubleClick} />
          </li>
          </div>
          <div>
          <li class="card__list_items">
        {hoverColor && <p>Hovered Color: {hoverColor}</p>}
        </li>
        <li class="card__list_items">
        {selectedColor && <p>Selected Color: {selectedColor}</p>}
        </li>
        </div>
        </li>
      )}
      
  </ul>
  <button class="button" onClick={() => handleAssignColor('skin')}>Assign Skin Color</button>
  <button class="button" onClick={() => handleAssignColor('hair')}>Assign Hair Color</button>
  <button class="button" onClick={() => handleAssignColor('eyes')}>Assign Eye Color</button>
  <button onClick={generateColor}>Submit</button>
      <div style={{color:"white",fontSize:"2rem"}}>
        Result: {response ? response["text"]:" Submit a response"}
      </div>
</div>
  );
}

export default ImageUploader;