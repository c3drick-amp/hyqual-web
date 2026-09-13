import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

import { useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import logoIcon from "../assets/hyqual-logo-icon.png";
import logoText from "../assets/hyqual-logo-text.png";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const firebaseUser = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

      if (!userDoc.exists()) {
        setError("User profile not found.");
        return;
      }

      const userData = userDoc.data();

      localStorage.setItem(
        "hyqual_user",
        JSON.stringify({
          uid: firebaseUser.uid,
          ...userData,
        })
      );

      if (userData.role === "Superadmin") {
        navigate("/superadmin/overview");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <img src={logoIcon} alt="HyQual icon" className="logo-icon" />
          <img src={logoText} alt="HyQual" className="logo-text-img" />
        </div>

        <h1>Sign in to your portal</h1>
        <p className="subtext">Select the portal that matches your account.</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <div className="password-field">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="sign-in-btn">
            Sign In <ArrowRight size={18} />
          </button>
        </form>

        <a href="#" className="forgot-password">
          Forgot Password?
        </a>
      </div>
    </div>
  );
}

export default Login;

