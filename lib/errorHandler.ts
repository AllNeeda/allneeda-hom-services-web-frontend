import toast from "react-hot-toast";


interface BackendError {
  message?: string;
  error?: string;
  detail?: string;
  title?: string;
  success?: boolean;
  errors?: Array<string | { message?: string; field?: string }>;
}




interface ApiError {
  response?: {
    status: number;
    data?: BackendError;
  };
  request?: any;
  message: string;
}
const extractDuplicateKeyMessage = (data: any): string | null => {
  if (!data) return null;
  const errorMessage = data.error || data.message || data.detail;

  if (errorMessage && errorMessage.includes('E11000 duplicate key error')) {
    const indexMatch = errorMessage.match(/index: (\w+)/);
    const dupKeyMatch = errorMessage.match(/dup key: { (.*): "(.*)" }/);

    if (dupKeyMatch && indexMatch) {
      const fieldName = dupKeyMatch[1];
      const fieldValue = dupKeyMatch[2];
      switch (fieldName) {
        case 'username':
          return `Username "${fieldValue}" is already taken. Please choose a different username.`;
        case 'email':
          return `Email "${fieldValue}" is already registered. Please use a different email or try logging in.`;
        case 'phone':
          return `Phone number "${fieldValue}" is already registered.`;
        default:
          return `This ${fieldName} is already in use. Please choose a different one.`;
      }
    }
    return "This information is already in use. Please check your input and try again.";
  }

  return null;
};

const extractBackendMessage = (data: any): string | null => {
  if (!data) return null;

  // Handle duplicate key (Mongo)
  const duplicateMessage = extractDuplicateKeyMessage(data);
  if (duplicateMessage) return duplicateMessage;
  if (data.validation && data.validation.body) {
    const v = data.validation.body;

    if (v.message) return v.message;
    if (v.keys) return ` ${v.keys.join(", ")}`;
  }
  if (data.error) return data.error;
  if (data.message) return data.message;
  if (typeof data === "string") return data;
  if (data.detail) return data.detail;
  if (data.title) return data.title;

  // Array errors
  if (Array.isArray(data.errors) && data.errors.length > 0) {
    return data.errors
      .map((err: any) => err.message || err.msg || err.error || JSON.stringify(err))
      .join(", ");
  }

  return null;
};

let lastErrorMessage: string | null = null;
let lastErrorTime: number = 0;

export const handleApiError = (error: unknown): Error => {
  let message = "Something went wrong. Please try again.";
  let userMessage = message;

  const isApiError = (err: any): err is ApiError => {
    return err && typeof err === 'object' && 'message' in err;
  };

  if (!isApiError(error)) {
    console.error("Unknown error type:", error);
    if (lastErrorMessage !== message || Date.now() - lastErrorTime > 1000) {
      toast.error(message);
      lastErrorMessage = message;
      lastErrorTime = Date.now();
    }
    return new Error(message);
  }

  if (error.response) {
    console.error("API Response Error:", error.response.status, error.response.data);
    const backendMessage = extractBackendMessage(error.response.data);

    switch (error.response.status) {
      case 400:
        userMessage = backendMessage || "Bad request. Please check your input.";
        break;
      case 401:
        userMessage = backendMessage || "Unauthorized. Please login again.";
        break;
      case 403:
        userMessage = backendMessage || "Access denied.";
        break;
      case 404:
        userMessage = backendMessage || "Resource not found.";
        break;
      case 409:
        userMessage = backendMessage || "Conflict. Resource already exists.";
        break;
      case 422:
        userMessage = backendMessage || "Validation failed. Please check your input.";
        break;
      case 429:
        userMessage = "Too many requests. Please slow down.";
        break;
      case 500:
        userMessage = backendMessage || "Server error. Please try later.";
        break;
      case 502:
      case 503:
      case 504:
        userMessage = "Service temporarily unavailable. Please try again later.";
        break;
      default:
        userMessage = backendMessage || `Error: ${error.response.status}`;
    }
  } else if (error.request) {
    userMessage = "Cannot reach server. Check your internet connection.";
  } else {
    userMessage = error.message || userMessage;
  }
  if (lastErrorMessage !== userMessage || Date.now() - lastErrorTime > 1000) {
    toast.error(userMessage);
    lastErrorMessage = userMessage;
    lastErrorTime = Date.now();
  }

  return new Error(userMessage);
};