import { useState } from "react";
import api from "../API/AxiosInstance";

function useDelete(url) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteData = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.delete(`${url}/${id}`);

      return response.data;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteData,
    loading,
    error,
  };
}

export default useDelete;