import React, { useEffect } from 'react';
// import axios from 'axios';
import { MDBRow, MDBCol } from 'mdbreact';
import Product from '../components/Product';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../store/actions/productActions';
import Loader from '../components/Loader';
import Message from '../components/Message';

const HomeScreen = () => {
  //   const [products, setProducts] = useState([]);
  const dispatch = useDispatch();
  const productList = useSelector(state => state.productList);
  let { loading, error, products } = productList;
  useEffect(() => {
    // const getProducts = async () => {
    //   const { data } = await axios.get('/api/products');
    //   setProducts(data);
    // };
    // getProducts();
    dispatch(listProducts());
  }, [dispatch]);

  return (
    <>
      <h2>Latest Products </h2>
      {loading ? (
        <h2>
          <Loader />
        </h2>
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <MDBRow>
          {products.map(product => (
            <MDBCol key={product._id} sm={12} md={6} lg={4} xl={3}>
              <Product product={product} />
            </MDBCol>
          ))}
        </MDBRow>
      )}
    </>
  );
};

export default HomeScreen;
