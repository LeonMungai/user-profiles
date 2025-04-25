import React from "react";
import UserProfiles from "./components/UserProfiles/UserProfiles";

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <UserProfiles />
    </div>
  );
};

export default App;