const generateError = (message, statusCode, data) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.data = data || {};
    error.error = true;
    return error
}

export default generateError;