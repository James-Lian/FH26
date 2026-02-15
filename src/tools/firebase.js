import { db } from "../firebase";
import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";

// Adds registration under: registrationsBySchool / {school}
// Inside the document: { safeEmailKey: { userObj } }
export const addRegistrationGroupedBySchool = async ({
  fullName,
  email,
  school,
  dietaryRestrictions,
  additionalQuestions,
}) => {
  const userObj = {
    fullName,
    email,
    school,
    dietaryRestrictions,
    additionalQuestions,
  };


  const safeEmailKey = email.replaceAll(".", "_");

  const schoolDocRef = doc(db, "registrationsBySchool", school);

  await setDoc(
    schoolDocRef,
    {
      [safeEmailKey]: userObj,
    },
    { merge: true }
  );

  return true;
};

// Checks if email exists inside a school's document

export const emailExistsGlobally = async (email) => {
    if (!email) return false;
  
    const safeEmailKey = email.trim().toLowerCase().replaceAll(".", "_");
  
    // Pull every school document
    const snapshot = await getDocs(collection(db, "registrationsBySchool"));
  
    // Check if any school doc has a field matching the email key
    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      if (data && data[safeEmailKey] !== undefined) {
        return true;
      }
    }
  
    return false;
  };

