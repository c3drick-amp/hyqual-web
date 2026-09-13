import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../firebase";

export function useFarms() {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let farmsLoaded = false;
    let pondsLoaded = false;
    let farmsData = [];
    let pondsData = [];
    let usersData = [];

    const normalizeReferenceId = (value, prefix) => (
      value == null ? "" : String(value).replace(prefix, "")
    );

    const getUserName = (ownerId) => {
      const normalizedOwnerId = normalizeReferenceId(ownerId, "user_");
      const user = usersData.find((item) => [
        item.id,
        item.uid,
        item.userId,
      ].some((value) => normalizeReferenceId(value, "user_") === normalizedOwnerId));

      if (!user) return "";
      if (user.displayName) return user.displayName;
      return [user.firstName, user.lastName].filter(Boolean).join(" ");
    };

    const combine = () => {
      if (!farmsLoaded || !pondsLoaded) return;

      setFarms(farmsData.map((farm) => ({
        ...farm,
        ponds: pondsData
          .filter((pond) => String(pond.farmId) === String(farm.id))
          .map((pond) => ({
            id: pond.id,
            name: pond.name,
            temp: pond.latestReading?.temperature ?? null,
            ph: pond.latestReading?.phLevel ?? null,
            do: pond.latestReading?.dissolvedOxygen ?? null,
            sal: pond.latestReading?.salinity ?? null,
          })),
      })));
      setLoading(false);
    };

    const farmsUnsubscribe = onSnapshot(query(collection(db, "farms")), (snapshot) => {
      farmsData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id.replace("farm_", ""),
          name: data.farmName ?? data.name ?? "Unnamed farm",
          ownerId: data.ownerId ?? data.owner_id ?? data.farmerId ?? data.farmer_id,
          owner: getUserName(data.ownerId ?? data.owner_id ?? data.farmerId ?? data.farmer_id),
          location: data.location ?? "Location unavailable",
          lat: Number(data.latitude),
          lng: Number(data.longitude),
          updatedAt: data.updatedAt,
        };
      });
      farmsLoaded = true;
      combine();
    }, (err) => {
      setError(err);
      setLoading(false);
    });

    const pondsUnsubscribe = onSnapshot(query(collection(db, "ponds")), (snapshot) => {
      pondsData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id.replace("pond_", ""),
          farmId: String(data.farmId ?? "").replace("farm_", ""),
          name: data.pondName ?? data.name ?? doc.id,
          latestReading: data.latestReading,
        };
      });
      pondsLoaded = true;
      combine();
    }, (err) => {
      setError(err);
      setLoading(false);
    });

    const usersUnsubscribe = onSnapshot(query(collection(db, "users")), (snapshot) => {
      usersData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      farmsData = farmsData.map((farm) => ({
        ...farm,
        owner: getUserName(farm.ownerId),
      }));
      combine();
    }, (err) => {
      setError(err);
    });

    return () => {
      farmsUnsubscribe();
      pondsUnsubscribe();
      usersUnsubscribe();
    };
  }, []);

  return { farms, loading, error };
}