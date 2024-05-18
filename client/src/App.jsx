import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Header from "./components/Header"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import About from "./pages/About"
import Profile from "./pages/Profile"
import CreateListing from "./pages/CreateListing"
import PrivateRoute from "./components/PrivateRoute"
import { UpdateListing } from "./pages/UpdateListing"
import { Listing } from "./pages/Listing"

export default function App() {

  return (
    <div>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<About />} />
          <Route path="/listing/:listingId" element={<Listing />} />
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/create-listing" element={<CreateListing />} />
            <Route path="/update-listing/:listingID" element={<UpdateListing />} />
            <Route path="*" />
          </Route>
        </Routes>
      </Router>
    </div>
  )
}

