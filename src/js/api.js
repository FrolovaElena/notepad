import axios from "axios";

const URL = "http://localhost:3000/notes";

export const get = async () => {
  try {
    const response = await axios.get(URL);
    return response.data;
  } catch (error) {
    throw new Error(`Error while fetching: ${response.statusText}`);
  }
};

export const save = async note => {
  try {
    const response = await axios.post(URL, note);
    return response.data;
  } catch (error) {
    throw new Error(`Error while fetching: ${response.statusText}`);
  }
};

export const del = async noteId => {
  try {
    const response = await axios.delete(`${URL}/${noteId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error while fetching: ${response.statusText}`);
  }
};

export const update = async (noteId, data) => {
  try {
    const response = await axios.patch(`${URL}/${noteId}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
