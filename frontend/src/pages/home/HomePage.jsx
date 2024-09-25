import React from "react";
import CreatePost from "./CreatePost";
import Posts from "../../components/common/Posts";

const HomePage = () => {
  return (
    <div className="items-center flex flex-col">
      <img src="/BJB-SOCIAL-LOGO.png" className="w-20 h-auto my-2 mx-auto" />
      <CreatePost />
      <Posts />
    </div>
  );
};

export default HomePage;
