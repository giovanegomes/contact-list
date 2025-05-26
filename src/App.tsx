import { BrowserRouter } from "react-router";
import "./App.css";
import "./theme.css";
import Routes from "./routes";
import { AuthProvider } from "./routes/AuthContext/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
