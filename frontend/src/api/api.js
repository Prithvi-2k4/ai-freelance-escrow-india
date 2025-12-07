import axios from 'axios';
const base = process.env.REACT_APP_API || process.env.REACT_APP_API_URL || '';
export default axios.create({ baseURL: base });
