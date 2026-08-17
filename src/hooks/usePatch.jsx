import { useState } from "react";
import api from "../API/AxiosInstance";

function usePatch(url) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const patchData = async (body) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.patch(url, body);

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
    patchData,
    data,
    loading,
    error,
  };
}

export default usePatch;