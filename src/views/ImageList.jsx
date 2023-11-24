import React, { useState, useEffect } from 'react';
import axios from 'axios';
import IconTrash from '../assets/icons/IconTrash';

const ImageList = () => {
  const [product, setProduct] = useState({
    id: null,
    brand: '',
    CPU: '',
    GPU: '',
    ram: '',
    storage: '',
    screen: '',
    price: '',
    description: null,
    images: []
  });

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = () => {
    axios.get('http://localhost:8000/api/laptops/3')
      .then(response => {
        setProduct(response.data.laptop);
      })
      .catch(error => {
        console.error('Error fetching images:', error);
      });
  };

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();

    const draggedImageId = e.dataTransfer.getData('text/plain');
    const updatedImages = [...product.images];
    const draggedImage = updatedImages.find(image => image.id.toString() === draggedImageId);

    if (draggedImage) {
      const draggedIndex = updatedImages.findIndex(image => image.id === draggedImage.id);
      updatedImages.splice(draggedIndex, 1);
      updatedImages.splice(targetIndex, 0, draggedImage);

      setProduct(prevState => ({
        ...prevState,
        images: updatedImages,
      }));

      const imageOrder = updatedImages.map(image => image.id);

      axios.post('http://localhost:8000/api/update-image', { imageOrder })
        .then(response => {
          console.log(response.data.message);
        })
        .catch(error => {
          console.error('Error updating image order:', error);
        });
    }
  };

  const deleteImage = (image) => {
    console.log('Deleting image:', image);
  };

  return (
    <div>
      {product.images.length > 0 &&  
        <div className='main-container'>
          <ul className='grid-wrapper'>
              {product.images.map((image, index) => {
                  if (image) {
                      return (
                          <li 
                            key={index}
                            onDragStart={(e) => handleDragStart(e, image.id)}
                            draggable
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, index)}
                            style={{
                              border: '1px solid #ddd',
                              padding: '8px',
                              marginBottom: '8px',
                              backgroundColor: 'white',
                            }}
                          >
                              <img
                                  src={`http://localhost:8000/storage/${image.image_path}`}
                                  alt={`Product ${product.id} Image`}
                                  style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }}
                              />
                              <div className="popup-icon" onClick= {ev => deleteImage(image)}>
                                  <IconTrash iconColor="#ffffff"/>
                              </div>
                          </li>
                      );
                  }
                  return null;
              })}
          </ul>
        </div>
      }
    </div>
  );
};

export default ImageList;
