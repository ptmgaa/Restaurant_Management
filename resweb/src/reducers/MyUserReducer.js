import cookies from "react-cookies";

const MyUserReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      cookies.save("user", action.payload, { path: "/" });
      return action.payload;
    case "LOGOUT":
      cookies.remove("token");
      cookies.remove("user");
      return null;
    default:
      return state;
  }
};

export default MyUserReducer;
