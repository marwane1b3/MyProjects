import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL
} from '../../constants/productConstant';
import axios from 'axios';

export const listProducts = () => async dispatch => {
  try {
    dispatch({ type: PRODUCT_LIST_REQUEST });
    const { data } = await axios.get('/api/products');

    if (!Array.isArray(data)) {
      dispatch({
        type: PRODUCT_LIST_FAIL,
        payload: data.message
      });
    } else {
      dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data });
    }
  } catch (error) {
    dispatch({
      type: PRODUCT_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    });
  }
};

export const listProductDetails = id => async dispatch => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST });
    const { data } = await axios.get(`/api/products/${id}`);

    if (!data.message) {
      dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data });
    } else {
      dispatch({ type: PRODUCT_DETAILS_FAIL, payload: data.message });
    }
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    });
  }
};
