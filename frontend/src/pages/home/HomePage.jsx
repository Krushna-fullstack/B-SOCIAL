import React from "react";
import CommunityPosts from "../../components/common/CommunityPosts";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div>
      <h1>
        <Link to="/profile">Profile</Link>

        <CommunityPosts />
      </h1>
    </div>
  );
};

export default HomePage;
