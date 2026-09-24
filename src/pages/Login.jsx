import { useEffect, useRef, useState } from "react";
import {
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
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
  const [resetEmail, setResetEmail] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [isResetMode, setIsResetMode] = useState(false);
  const isSigningIn = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && !isSigningIn.current) {
        const storedUser = localStorage.getItem("hyqual_user");
        const role = JSON.parse(storedUser || "null")?.role;
        navigate(role === "Superadmin" ? "/superadmin/overview" : "/dashboard", {
          replace: true,
        });
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    isSigningIn.current = true;

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
      isSigningIn.current = false;
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setResetError("");
    setResetMessage("");

    const trimmedEmail = resetEmail.trim();

    if (!trimmedEmail) {
      setResetError("Please enter your email address.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, trimmedEmail);
      setResetMessage("Password reset email sent. Check your inbox and follow the link to reset your password.");
      setResetEmail("");
    } catch (err) {
      console.error("Password reset error:", err);
      const message =
        err?.code === "auth/user-not-found"
          ? "No account found with that email address."
          : "Unable to send reset email. Please try again.";
      setResetError(message);
    }
  };

  const handleForgotPasswordClick = () => {
    setIsResetMode(true);
    setResetError("");
    setResetMessage("");
    setEmail("");
  };

  const handleBackToLogin = () => {
    setIsResetMode(false);
    setResetError("");
    setResetMessage("");
    setResetEmail("");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <img src={logoIcon} alt="HyQual icon" className="logo-icon" />
          <img src={logoText} alt="HyQual" className="logo-text-img" />
        </div>

        {!isResetMode ? (
          <>
            <h1>Sign in to your portal</h1>

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

            <button
              type="button"
              className="forgot-password"
              onClick={handleForgotPasswordClick}
            >
              Forgot Password?
            </button>
          </>
        ) : (
          <>
            <h1>Reset your password</h1>
            <p className="subtext">
              Enter the email address for your account and we’ll send a reset link.
            </p>

            <form onSubmit={handleForgotPassword}>
              <label htmlFor="reset-email">Email address</label>
              <input
                id="reset-email"
                type="email"
                placeholder="Email address"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />

              {resetError && <p className="login-error">{resetError}</p>}
              {resetMessage && <p className="login-success">{resetMessage}</p>}

              <button type="submit" className="sign-in-btn reset-btn">
                Send Reset Link
              </button>
            </form>

            <button
              type="button"
              className="forgot-password back-to-login"
              onClick={handleBackToLogin}
            >
              Back to sign in
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;

