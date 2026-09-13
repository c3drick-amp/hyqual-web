import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../firebase";

export function useFirestoreCollection(collectionName) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, collectionName)), (snapshot) => {
      setItems(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (snapshotError) => {
      setError(snapshotError);
      setLoading(false);
    });

    return unsubscribe;
  }, [collectionName]);

  return { items, loading, error };
}
