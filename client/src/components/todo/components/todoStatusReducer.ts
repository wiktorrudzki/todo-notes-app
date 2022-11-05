type Actions =
  | { type: "category"; payload: string }
  | { type: "text"; payload: string }
  | { type: "date"; payload: string };

type LoginStatus = {
  category: string;
  text: string;
  progress: string;
  date: string;
};

export const todoStatusReducer = (state: LoginStatus, action: Actions) => {
  switch (action.type) {
    case "category":
      return { ...state, category: action.payload };
    case "date":
      return { ...state, date: action.payload };
    case "text":
      return { ...state, text: action.payload };
    default:
      return state;
  }
};
