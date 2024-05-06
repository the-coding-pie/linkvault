const success = (message?: string, data?: any) => {
  return {
    success: true,
    message: message || "",
    data: data || {},
  };
};

export default success;
