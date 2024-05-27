import { BrowserRouter, Route, Routes, Link } from "react-router-dom"

// Pages
import Scan from "./pages/Scan"

function App() {
  return (
    <BrowserRouter>
      {/* <link to="/summary"></link> */}
      <Routes>
        <Route path="/" element={<Scan />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
