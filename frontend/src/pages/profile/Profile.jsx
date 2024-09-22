import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useFollow from "../../hooks/useFollow";
import { formatMemberSinceDate } from "../../utils/date";
import Posts from "../../components/common/Posts";
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";
import EditProfileModal from "./EditProfileModal";
import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink, FaCamera } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

const Profile = () => {
  const { username } = useParams();
  const [coverImg, setCoverImg] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const coverImgRef = useRef(null);
  const profileImgRef = useRef(null);

  const { follow, isPending } = useFollow();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const res = await fetch(`/api/v1/user/profile/${username}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error);
      }
      return data;
    },
  });

  const { updateProfile, isUpdatingProfile } = useUpdateUserProfile();

  const isMyProfile = authUser?._id === user?._id;
  const amIFollowing = authUser?.following.includes(user?._id);

  useEffect(() => {
    refetch();
  }, [username, refetch]);

  // Handle cover image change
  const handleCoverImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImg(file);
      updateProfile({ coverImg: file });
    }
  };

  // Handle profile image change
  const handleProfileImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImg(file);
      updateProfile({ profileImg: file });
    }
  };

  return (
    <div className="container mx-auto my-8">
      <div className="bg-secondary rounded-lg shadow-lg">
        {/* Cover Image */}
        <div className="relative w-full h-56 bg-gray-300">
          {user?.coverImg ? (
            <img
              src={user.coverImg}
              alt="Cover"
              className="w-full h-full object-cover rounded-t-lg"
            />
          ) : (
            <div className="w-full h-full bg-gray-400 rounded-t-lg"></div>
          )}

          {isMyProfile && (
            <div
              className="absolute bottom-4 right-4 bg-gray-700 p-2 rounded-full cursor-pointer"
              onClick={() => coverImgRef.current.click()}
            >
              <FaCamera className="text-white" />
            </div>
          )}
          <input
            type="file"
            ref={coverImgRef}
            className="hidden"
            onChange={handleCoverImgChange}
            accept="image/*"
          />
        </div>

        {/* Profile Section */}
        <div className="flex items-center p-4 -mt-16 relative">
          {/* Profile Image */}
          <div className="relative w-32 h-32 rounded-full border-4 border-secondary bg-gray-200 overflow-hidden">
            {user?.profileImg ? (
              <img
                src={user.profileImg}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300"></div>
            )}

            {isMyProfile && (
              <div
                className="absolute bottom-0 right-0 bg-gray-700 p-1 rounded-full cursor-pointer"
                onClick={() => profileImgRef.current.click()}
              >
                <FaCamera className="text-white" />
              </div>
            )}
            <input
              type="file"
              ref={profileImgRef}
              className="hidden"
              onChange={handleProfileImgChange}
              accept="image/*"
            />
          </div>

          {/* User Info */}
          <div className="ml-6">
            <h1 className="text-3xl font-bold text-white">{user?.fullName}</h1>
            <p className="text-gray-300">@{user?.username}</p>
            <p className="text-gray-400 mt-1">
              {user?.bio || "No bio available"}
            </p>
            <p className="text-gray-400">
              Department: {user?.department || "N/A"}
            </p>
            <p className="text-gray-400">
              Joined: {formatMemberSinceDate(user?.createdAt)}
            </p>
          </div>

          {/* Follow/Unfollow Button */}
          {!isMyProfile && (
            <button
              className={`ml-auto btn ${
                amIFollowing ? "btn-error" : "btn-primary"
              } rounded-full`}
              onClick={() => follow(user._id)}
              disabled={isPending}
            >
              {amIFollowing ? "Unfollow" : "Follow"}
            </button>
          )}

          {/* Edit Profile Button */}
          {isMyProfile && <EditProfileModal authUser={authUser} />}
        </div>
      </div>

      <Posts feedType="posts" username={username} />
    </div>
  );
};

export default Profile;
