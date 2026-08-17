import { useState } from "react";
import api from "../API/AxiosInstance";

function usePut(url) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const putData = async (id, body) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.put(`${url}/${id}`, body);

      setData(response.data);

      return response.data;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    putData,
    data,
    loading,
    error,
  };
}

export default usePut;