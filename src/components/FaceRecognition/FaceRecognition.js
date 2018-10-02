import React from 'react';
import './FaceRecognition.css';


const FaceRecognition = ({ box, imageUrl }) => {
  if (imageUrl !== '') {
  return (
    <div className='center ma4'>
      <div className="absolute mt2">
        <img id="inputimage" src={imageUrl} alt="face" width ='500px' height='auto' />
        <div className='bounding-box' style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}></div>
      </div>
    </div>

  );
  } else {
    return(<div></div>);
  }
}


export default FaceRecognition; 