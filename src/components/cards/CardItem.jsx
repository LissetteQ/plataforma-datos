import React from 'react';
import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const CardItem = ({ title, description, image, route }) => {
  return (
    <Card>
      <CardActionArea
        component={Link}
        to={route}
        sx={{
          height: '100%',
        }}
      >
        <CardMedia component="img" height="140" image={image} alt={title} />
        <CardContent>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default CardItem;