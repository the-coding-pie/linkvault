const failure = (message?: string, statusCode?: number) => {
  return {
    success: false,
    message: message || "",
    statusCode: statusCode || 400,
  };
};

export default failure;
