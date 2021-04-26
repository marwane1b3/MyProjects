import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Col,
  Row,
  ListGroup,
  Form,
  Image,
  Button,
  Card,
  Nav
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Message from '../components/Message';
import { addToCart, removeFromCart } from '../store/actions/cartActions';

const CartScreen = ({ match, history, location }) => {
  const productId = match.params.id;
  const qty = location.search ? Number(location.search.split('=')[1]) : 1;
  const dispatch = useDispatch();
  const cartList = useSelector(state => state.cart);
  const { cartItems } = cartList;
  //   console.log(cartItems);

  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty));
    }
  }, [productId, qty, dispatch]);

  const removeFromCartHandler = id => {
    dispatch(removeFromCart(id));
  };
  const checkoutHandler = () => {
    history.push('/login?redirect=shipping');
  };
  return (
    <>
      <Row>
        <Col md="8">
          <h1>Shopping Cart</h1>
          {cartItems.length === 0 ? (
            <Message>
              Your cart is empty
              <Link to="/" style={{ color: 'blue' }}>
                Go back
              </Link>
            </Message>
          ) : (
            <ListGroup variant="flush">
              {cartItems.map(x => (
                <ListGroup.Item key={x.product}>
                  <Row>
                    <Col md="2">
                      <Image
                        src={x.image}
                        alt={x.name}
                        fluid
                        style={{
                          borderRadius: '50%',

                          position: 'relative'
                        }}
                      />
                    </Col>

                    <Col md="2" className="mt-4">
                      <Link
                        to={`/product/${x.product}`}
                        style={{ color: 'crimson' }}
                      >
                        {x.name}
                      </Link>
                    </Col>
                    <Col md="2" className="mt-4">
                      {x.price}DH
                    </Col>
                    <Col md="3" className="mt-4">
                      <Form.Control
                        as="select"
                        value={x.qty}
                        onChange={e => {
                          dispatch(
                            addToCart(x.product, Number(e.target.value))
                          );
                        }}
                      >
                        {[...Array(x.countInStock).keys()].map(qtyNum => (
                          <option key={qtyNum + 1} value={qtyNum + 1}>
                            {qtyNum + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>

                    <Col md="1" className="mt-4">
                      <Button
                        type="button"
                        variant="light"
                        onClick={() => {
                          removeFromCartHandler(x.product);
                        }}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md="4" style={{ marginTop: '100px' }}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>
                  subTotal({cartItems.reduce((acc, curr) => acc + curr.qty, 0)})
                </h2>
                <h2>
                  Total :
                  {cartItems
                    .reduce((acc, item) => acc + item.qty * item.price, 0)
                    .toFixed(2)}
                  DH
                </h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn btn-block btn-success"
                  disabled={cartItems.length === 0}
                  onClick={checkoutHandler}
                >
                  Verifier Paiment
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};
export default CartScreen;
