import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import {
  ACTIVE_AUTH_SESSION_KEY,
  hasActiveAuthSession,
  hasRememberedSession,
} from "../utils/authSession";
import { markUserOffline } from "../utils/presence";

function getAccountBlockReason(userData = {}) {
  if (userData.archived === true) {
    return "This account has been archived. Please contact an administrator.";
  }

  const status = String(userData.status || "").toLowerCase();
  const approvalStatus = String(userData.approvalStatus || "").toLowerCase();

  if (status === "pending" || approvalStatus === "pending") {
    return "Your account is still pending approval.";
  }

  if (status === "inactive" || status === "disabled") {
    return "This account is inactive. Please contact an administrator.";
  }

  return "";
}

function ProtectedRoute({ children, allowedRoles }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [blockedReason, setBlockedReason] = useState("");
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    let revokedReason = "";
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setRole(null);
        setBlockedReason(revokedReason);
        setLoading(false);
        return;
      }

      if (!hasRememberedSession() && !hasActiveAuthSession()) {
        sessionStorage.removeItem(ACTIVE_AUTH_SESSION_KEY);
        await signOut(auth);
        setUser(null);
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (!userDoc.exists()) {
          revokedReason = "This account no longer exists. Please contact an administrator.";
          localStorage.removeItem("hyqual_user");
          await markUserOffline(currentUser.uid).catch((error) => {
            console.error("Unable to update user presence:", error);
          });
          setUser(null);
          setRole(null);
          setBlockedReason(revokedReason);
          await signOut(auth);
          setLoading(false);
          return;
        }

        const userData = userDoc.data();
        const nextRole = userData.role || null;

        const reason = getAccountBlockReason(userData);
        if (reason) {
          localStorage.removeItem("hyqual_user");
          setUser(null);
          setRole(null);
          setBlockedReason(reason);
          setLoading(false);
          return;
        }

        if (nextRole) {
          localStorage.setItem(
            "hyqual_user",
            JSON.stringify({
              uid: currentUser.uid,
              ...userData,
              role: nextRole,
            })
          );
        }

        setUser(currentUser);
        setRole(nextRole);
      } catch (error) {
        console.error("Failed to load user profile for route guard:", error);
        const storedUser = JSON.parse(localStorage.getItem("hyqual_user") || "null");
        const fallbackRole = storedUser?.role || null;
        const fallbackReason = getAccountBlockReason(storedUser || {});

        if (fallbackReason) {
          localStorage.removeItem("hyqual_user");
          setUser(null);
          setRole(null);
          setBlockedReason(fallbackReason);
        } else {
          setUser(currentUser);
          setRole(fallbackRole);
        }
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return null;
  }

  if (blockedReason) {
    return <Navigate to="/login" replace state={{ from: location.pathname, reason: blockedReason }} />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return (
      <Navigate
        to={role === "Superadmin" ? "/superadmin/overview" : "/dashboard"}
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;
