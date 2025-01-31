import { useQuery } from "@tanstack/react-query";
import CreatePost from "./CreatePost";
import Posts from "../../components/common/Posts";
import { Link } from "react-router-dom";
import { VscAccount } from "react-icons/vsc";
//home page component
const HomePage = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center justify-between w-full max-w-sm px-4 lg:ml-4">
        {/* Profile Image */}
        <Link to={`/profile/${authUser?.username}`} className="flex-shrink-0">
          {authUser?.profileImg ? (
            <div className="w-12 h-12 overflow-hidden rounded-full border border-gray-300">
              <img
                className="w-full h-full object-cover"
                src={authUser?.profileImg}
                alt="Profile"
              />
            </div>
          ) : (
            <VscAccount className="w-12 h-12 rounded-full text-gray-400" />
          )}
        </Link>

        {/* Logo */}
        <img
          src="/logo.png"
          alt="BJB Social Logo"
          className="w-20 h-auto my-1 mx-auto"
        />
      </div>

      {/* Horizontal Line */}
      <hr className="w-full max-w-sm border-t border-gray-300 my-4" />

      {/* Create Post and Posts Section */}
      <CreatePost />
      <Posts />
    </div>
  );
};

export default HomePage;
