import React, { Suspense } from "react";
import AddUser from "../components/screens/Auth/AddUser";

function LoadingFallback() {
  return <div>Loading...</div>;
}

export default function AddUserPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AddUser />
    </Suspense>
  );
}
