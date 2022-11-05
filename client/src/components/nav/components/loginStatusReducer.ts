type Actions =
  | { type: "registerPassword"; payload: string }
  | { type: "loginPassword"; payload: string }
  | { type: "username"; payload: string }
  | { type: "confirmPassword"; payload: string }
  | { type: "error"; payload: boolean; errorMessage: string | null };

type LoginStatus = {
  username: string;
  password: string;
  confirmPassword: string;
  error: boolean;
  errorMessage: string | null;
};

export const reducer = (state: LoginStatus, action: Actions) => {
  switch (action.type) {
    case "username": {
      if (state.confirmPassword !== state.password) {
        return { ...state, username: action.payload };
      } else {
        return {
          ...state,
          username: action.payload,
          error: false,
          errorMessage: null,
        };
      }
    }
    case "loginPassword": {
      return { ...state, password: action.payload };
    }
    case "registerPassword": {
      if (state.confirmPassword !== action.payload) {
        return {
          ...state,
          password: action.payload,
          error: true,
          errorMessage: "passwords do not match",
        };
      }
      return {
        ...state,
        password: action.payload,
        error: false,
        errorMessage: null,
      };
    }
    case "confirmPassword": {
      if (state.password !== action.payload) {
        return {
          ...state,
          confirmPassword: action.payload,
          error: true,
          errorMessage: "passwords do not match",
        };
      }
      return {
        ...state,
        confirmPassword: action.payload,
        error: false,
        errorMessage: null,
      };
    }
    case "error": {
      return {
        ...state,
        error: action.payload,
        errorMessage: action.errorMessage,
      };
    }
    default:
      return state;
  }
};
