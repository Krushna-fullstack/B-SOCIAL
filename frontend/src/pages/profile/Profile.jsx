import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaPlus, FaCheck } from "react-icons/fa6"; // Add FaCheck for Unfollow icon
import { useQuery } from "@tanstack/react-query";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";

const Profile = () => {
  let [isFollowing, setIsFollowing] = useState(false); // Track follow status
  let [countFollower, setCountFollower] = useState(0);
  let [countFollowing, setCountFollowing] = useState(0);

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing); // Toggle follow status
    setCountFollower(isFollowing ? countFollower - 1 : countFollower + 1); // Adjust followers count
  };

  const [coverImg, setCoverImg] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [feedType, setFeedType] = useState("posts");

  const coverImgRef = useRef(null);
  const profileImgRef = useRef(null);

  const { username } = useParams();

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const {
    data: user,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/v1/user/profile/${username}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error);
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  const isMyProfile = authUser._id === user?._id;
  const amIFollowing = authUser?.following.includes(user?._id);

  useEffect(() => {
    refetch();
  }, [username, refetch]);

  const handleImgChange = (e, state) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        state === "coverImg" && setCoverImg(reader.result);
        state === "profileImg" && setProfileImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full min-h-screen  flex flex-col items-center bg-secondary">
      {/* Banner */}
      {isLoading && <ProfileHeaderSkeleton />}
      <div className="w-full h-48  flex flex-col justify-end bg-white">
        <img src="https://dummyimage.com/hd1080" alt="Banner" />
        <input type="file" className="hidden" accept="/image" />
      </div>

      {/* Profile Section */}
      <div className="flex flex-col items-center mt-[-4rem]">
        <div className="avatar online">
          <div className="ring-primary ring-offset-base-100 w-24 rounded-full ring ring-offset-2">
            <img
              src="https://www.pngkit.com/png/detail/797-7975330_donna-picarro-dummy-avatar-png.png"
              alt="Profile"
            />
            <input type="file" className="hidden" accept="image/" />
          </div>
        </div>
        <div className="text-center mt-4">
          <h2 className="text-2xl font-bold">{authUser?.fullName}</h2>
          <p className="text-gray-500">
            <span>@</span>
            {authUser?.username}
          </p>
          <p className="mt-2 max-w-lg mx-auto text-center">
            {authUser?.bio || "No bio available"}
          </p>
          {authUser?.link && (
            <a
              href={authUser?.link}
              target="_blank"
              rel="noreferrer"
              className="text-primary"
            >
              {authUser?.link}
            </a>
          )}

          {/* Follow Button */}
          <div className="mt-4 flex space-x-4 justify-center mb-3">
            <button
              className="btn bg-black btn-wide mt-2 text-white rounded-lg text-lg hover:opacity-75"
              onClick={handleFollowToggle}
            >
              {isFollowing ? "Unfollow" : "Follow"} {/* Toggle text */}
              {isFollowing ? <FaCheck /> : <FaPlus />} {/* Toggle icon */}
            </button>
          </div>

          {/* Followers Section */}
          <div className="flex justify-around my-3">
            <p>
              <span className="font-bold text-lg">{countFollower}</span>{" "}
              Followers
            </p>
            <p>
              <span className="font-bold text-lg">{countFollowing}</span>{" "}
              Following
            </p>
          </div>

          <hr />

          {/* Posts Section */}
          <div>
            <div>
              <h3 className="text-xl font-medium">Posts</h3>
            </div>

            <div className="flex flex-wrap mt-3 ml-3">
              <div className="card bg-base-100 w-48 shadow-xl mb-1 mr-1">
                <figure>
                  <img
                    src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                    alt="Post"
                  />
                </figure>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
