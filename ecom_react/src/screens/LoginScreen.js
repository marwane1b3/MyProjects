import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { login } from '../store/actions/userActions';
import FormContainer from '../components/FormContainer';
const LoginScreen = ({ location, history }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const redirect = location.search ? location.search.split('=')[1] : '/';
  const userLogin = useSelector(state => state.userLogin);
  const { loading, error, userInfo } = userLogin;
  /** if already logged in redirect */
  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
  }, [history, userInfo, redirect]);
  const submitHandler = e => {
    e.preventDefault();
    //DISPATCH LOGGING
    dispatch(login(email, password));
  };
  return (
    <FormContainer>
      <h1>Sign in</h1>
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="email">
          <Form.Label>Email adress</Form.Label>
          <Form.Control
            type="email"
            placeholder="enter email"
            value={email}
            onChange={e => {
              setEmail(e.target.value);
            }}
            autoComplete="off"
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>enter password</Form.Label>
          <Form.Control
            type="password"
            placeholder="enter password"
            value={password}
            onChange={e => {
              setPassword(e.target.value);
            }}
            autoComplete="off"
          ></Form.Control>
        </Form.Group>
        <Button type="submit" variant="primary">
          Sign in
        </Button>
      </Form>
      <Row className="py-3">
        <Col>
          New customer ?
          <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
            Register
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginScreen;
