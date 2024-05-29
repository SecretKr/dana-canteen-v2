import { BrowserRouter, Route, Routes, Link } from "react-router-dom"

// Pages
import Scan from "./pages/Scan"
import Summary from "./pages/Summary";

function App() {
  return (
    <BrowserRouter>
      {/* <link to="/summary"></link> */}
      <Routes>
        <Route path="/" element={<Scan />} />
        <Route path="/summary" element={<Summary />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
