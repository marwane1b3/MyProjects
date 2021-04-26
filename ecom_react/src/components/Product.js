import React from 'react';
import {
  MDBMask,
  MDBView,
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCardTitle,
  MDBCardText
} from 'mdbreact';
import { Link } from 'react-router-dom';
import Rating from './Rating';

const Product = ({ product }) => {
  return (
    <MDBCard className="my-3 p-3 rounded">
      <Link to={`/product/${product._id}`}>
        <MDBView zoom hover>
          <MDBCardImage
            src={product.image}
            variant="top"
            className="img-fluid"
          />
        </MDBView>
      </Link>
      <MDBCardBody>
        <Link to={`/product/${product._id}`} className="text-info">
          <MDBCardTitle as="div">
            <h5>{product.name}</h5>
          </MDBCardTitle>
        </Link>
        <MDBCardText as="div">
          <div className="my-3">
            <Rating
              value={product.rating}
              text={` ${product.numReviews} reviews`}
            />
          </div>
        </MDBCardText>
        <MDBCardText as="h6">{`brand : ${product.brand}`}</MDBCardText>
        <MDBCardText as="h4">${product.price}</MDBCardText>
      </MDBCardBody>
    </MDBCard>
  );
};

export default Product;
