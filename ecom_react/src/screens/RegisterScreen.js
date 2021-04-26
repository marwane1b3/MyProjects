import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { register } from '../store/actions/userActions';
import FormContainer from '../components/FormContainer';

const RegisterScreen = ({ location, history }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const dispatch = useDispatch();

  const userRegister = useSelector(state => state.userRegister);
  const { loading, error, userInfo } = userRegister;

  const redirect = location.search ? location.search.split('=')[1] : '/';
  /** if already logged in redirect */
  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
  }, [history, userInfo, redirect]);
  const submitHandler = e => {
    e.preventDefault();
    //DISPATCH REGISTER
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else {
      dispatch(register(name, email, password));
    }
  };
  return (
    <FormContainer>
      <h1>Sign up</h1>
      {message && <Message variant="danger">{message}</Message>}
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="name">
          <Form.Label>name :</Form.Label>
          <Form.Control
            type="name"
            placeholder="enter name"
            value={name}
            onChange={e => {
              setName(e.target.value);
            }}
            autoComplete="off"
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="email">
          <Form.Label> Email adress :</Form.Label>
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
          <Form.Label>password :</Form.Label>
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
        <Form.Group controlId="confirmPassword">
          <Form.Label>confirm password</Form.Label>
          <Form.Control
            type="password"
            placeholder="confirm password"
            value={confirmPassword}
            onChange={e => {
              setConfirmPassword(e.target.value);
            }}
            autoComplete="off"
          ></Form.Control>
        </Form.Group>
        <Button type="submit" variant="primary">
          Register
        </Button>
      </Form>
      <Row className="py-3">
        <Col>
          have an account ?
          <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
            login
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
