import { useEffect, useState } from "react";
import {
  onSnapshot,
  collection,
  where,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../firebase/config";

const useFirestore = (collectionName, condition) => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    let q = query(collection(db, collectionName), orderBy("createdAt"));

    // condition
    /*
     * {
     *   fieldName: string,
     *   operator: '==',
     *   compareValue: string
     * }
     */
    if (condition) {
      if (!condition.compareValue || !condition.compareValue.length) {
        // reset documents data
        setDocuments([]);
        return;
      }

      q = query(
        collection(db, collectionName),
        where(condition.fieldName, condition.operator, condition.compareValue),
        orderBy("createdAt")
      );
    }
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const documents = [];
      snapshot.forEach((doc) => {
        documents.push({
          ...doc.data(),
          id: doc.id,
        });
      });
      setDocuments(documents);
    });
    return unsubscribe;
  }, [collectionName, condition]);
  return documents;
};

export default useFirestore;
