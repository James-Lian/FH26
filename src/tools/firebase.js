import { db } from "../firebase";
import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";

// Adds registration under: registrationsBySchool / {school}
// Inside the document: { safeEmailKey: { userObj } }
export const addRegistrationGroupedBySchool = async ({
  fullName,
  schoolEmail,
  personalEmail,
  school,
  experience,
  tshirtSize,
  dietaryRestrictions,
  additionalQuestions,
}) => {
  const userObj = {
    fullName,
    schoolEmail,
    personalEmail,
    school,
    experience,
    tshirtSize,
    dietaryRestrictions,
    additionalQuestions,
  };

  const safeEmailKey = schoolEmail.trim().toLowerCase().replaceAll(".", "_");

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

// Checks if school email exists in any school document (one registration per school email globally)
export const emailExistsGlobally = async (schoolEmail) => {
  if (!schoolEmail) return false;

  const safeEmailKey = schoolEmail.trim().toLowerCase().replaceAll(".", "_");

  const snapshot = await getDocs(collection(db, "registrationsBySchool"));

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    if (data && data[safeEmailKey] !== undefined) {
      return true;
    }
  }

  return false;
};

