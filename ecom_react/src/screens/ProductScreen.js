import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form
} from 'react-bootstrap';
import Rating from '../components/Rating';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { listProductDetails } from '../store/actions/productActions.js';
import Message from '../components/Message';
import Loader from '../components/Loader';

const ProductScreen = ({ history, match }) => {
  const [qty, setQty] = useState(1);
  /** match is used to get the params in url match.params. */
  // const [product, setProduct] = useState({});
  const dispatch = useDispatch();
  const detailProduct = useSelector(state => state.productDetail);
  const { loading, error, product } = detailProduct;
  useEffect(() => {
    // const getProduct = async () => {
    //   const { data } = await axios.get(`/api/products/${match.params.id}`);
    //   setProduct(data);

    // getProduct();
    dispatch(listProductDetails(match.params.id));
  }, [dispatch, match]);
  const cartSubmitHandler = () => {
    history.push(`/cart/${match.params.id}?qty=${qty}`);
  };

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        go back
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message>{error}</Message>
      ) : (
        <Row>
          <Col md={4}>
            <Image
              src={product.image}
              alt={product.name}
              fluid
              width={450}
              height={450}
            />
          </Col>
          <Col md={4}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>{product.name}</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Rating
                  value={product.rating}
                  text={`${product.numReviews} reviews`}
                />
              </ListGroup.Item>
              <ListGroup.Item>price : ${product.price}</ListGroup.Item>
              <ListGroup.Item>
                Description : {product.description}
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={4}>
            <Card>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>
                      <strong>${product.price}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>status:</Col>
                    <Col>
                      {product.countInStock > 0 ? 'in stock' : 'out of stock'}
                    </Col>
                  </Row>
                </ListGroup.Item>
                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <Row>
                      <Col>QTY</Col>
                      <Col>
                        <Form.Control
                          as="select"
                          value={qty}
                          onChange={e => {
                            setQty(e.target.value);
                          }}
                        >
                          {[...Array(product.countInStock).keys()].map(x => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}
                <ListGroup.Item>
                  <Button
                    onClick={cartSubmitHandler}
                    className="btn btn-block btn-info ml-auto"
                    type="button"
                    disabled={product.countInStock === 0}
                  >
                    add To cart
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

export default ProductScreen;
