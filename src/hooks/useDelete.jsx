import { useState } from "react";
import api from "../API/AxiosInstance";

const useDelete = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteData = async (id, customBaseUrl = url) => {
    setLoading(true);
    setError(null);

    const targetUrl = id
      ? `${customBaseUrl}/${id}`
      : customBaseUrl;

    console.log("[useDelete] delete >", targetUrl);

    try {
      const res = await api.delete(targetUrl);

      setData(res.data);

      return res.data;
    } catch (err) {
      const errMessage =
        err?.response?.data ||
        err?.message ||
        "Something went wrong";

      setError(errMessage);

      console.error("[useDelete] error >", err);

      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteData,
    execute: deleteData,
    data,
    loading,
    error,
  };
};

export default useDelete;