import React from 'react';
import './Slide.scss';

interface SlideProps {
  image: string;
  title: string;
  type: string;
  onClick?: () => void;
}

export const Slide: React.FC<SlideProps> = ({
  image,
  title,
  type,
  onClick,
}) => {
  return (
    <div className="slide" onClick={onClick}>
      <img src={image} alt={title} />
      <p>{type}</p>
      <h3>{title}</h3>
    </div>
  );
};

export default Slide;
