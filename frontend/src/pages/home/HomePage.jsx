import React from "react";
import CreatePost from "./CreatePost";
import Posts from "../../components/common/Posts";

const HomePage = () => {
  return (
    <div className="items-center flex flex-col">
      <CreatePost />
      <Posts />
    </div>
  );
};

export default HomePage;
