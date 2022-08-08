import { Link } from "react-router-dom";
const NotFound = () => {
  return (
    <h1>
      Page not found. How about you go back to
      <Link to="/">the main page</Link>?
    </h1>
  );
};

export default NotFound;
