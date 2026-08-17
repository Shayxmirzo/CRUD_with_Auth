import { useState } from "react";
import api from "../API/AxiosInstance";

function usePost(url) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const postData = async (body) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post(url, body);

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
    postData,
    data,
    loading,
    error,
  };
}

export default usePost;