import axios from 'axios';

export const ACTION_REFRESH_PERSON= 'REFRESH_PERSON';

export const savePerson = (person) => ({
  type: ACTION_REFRESH_PERSON,
  person
});

export const getPerson = () => async (dispatch) => {
  try {
    const response = await axios.get('http://localhost:8080/api/v1/person');
    dispatch(savePerson(response.data.data.response));
  } catch (err) {
    console.error(err);
  }
};

export const createPerson = (data) => async (dispatch) => {
    try {
      await axios.post('http://localhost:8080/api/v1/person', data);
      dispatch(getPerson());
    } catch (err) {
      throw err;
    }
  };

export const updatePerson = (id, data) => (dispatch) => {
  try {
    return axios.put(`http://localhost:8080/api/v1/person/${id}`, data);
  } catch (err) {
    throw err;
  }
};

export const deletePerson = (id, excluded) => (dispatch) => {
    try {
      return axios.delete(`http://localhost:8080/api/v1/person/${id}?excluded=${excluded}`);
    } catch (err) {
      console.error(err);
    }
  };
