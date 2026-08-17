import { useEffect, useState } from "react";
import api from "../API/AxiosInstance";

function useGet(url) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshIndex, setRefreshIndex] = useState(0);

  const refresh = () => {
    setRefreshIndex((prev) => prev + 1);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get(url);

        setData(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [url, refreshIndex]);

  return {
    data,
    loading,
    error,
    refresh,
  };
}

export default useGet;