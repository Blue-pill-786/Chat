import { createContext, useContext, useReducer } from "react";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);

  const INITIAL_STATE = {
    chatId: null,
    user: null,
  };

  const chatReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_USER": {
        const { user, currentUid } = action.payload;

        const combinedId =
          currentUid > user.uid
            ? currentUid + user.uid
            : user.uid + currentUid;

        return {
          chatId: combinedId,
          user,
        };
      }
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};
