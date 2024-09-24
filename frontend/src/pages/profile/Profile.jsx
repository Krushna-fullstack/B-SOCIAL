import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useFollow from "../../hooks/useFollow";
import { formatMemberSinceDate } from "../../utils/date";
import Posts from "../../components/common/Posts";
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";
import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink, FaCamera } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import EditProfileModal from "./EditProfileModal";
import ProfileHeaderSkeleton from "./../../components/skeletons/ProfileHeaderSkeleton";

const Profile = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  const { username } = useParams();
  const [feedType, setFeedType] = useState("posts");

  const [coverImg, setCoverImg] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const coverImgRef = useRef(null);
  const profileImgRef = useRef(null);

  const { follow, isPending } = useFollow();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const {
    data: user,
    isLoading,
    isRefetching,
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

  const memberSinceDate = formatMemberSinceDate(user?.createdAt);

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
    <div className="flex justify-center min-h-screen bg-black">
      <div className="w-full max-w-3xl mx-auto border-r border-gray-700 min-h-screen flex flex-col">
        {/* HEADER */}
        {(isLoading || isRefetching) && <ProfileHeaderSkeleton />}
        {!isLoading && !isRefetching && !user && (
          <p className="text-center text-lg mt-4">User not found</p>
        )}
        <div className="flex flex-col">
          {!isLoading && !isRefetching && user && (
            <>
              <div className="flex gap-10 px-4 py-2 items-center">
                <Link to="/">
                  <FaArrowLeft className="w-4 h-4" />
                </Link>
                <div className="flex flex-col">
                  <p className="font-bold text-lg">{user?.fullName}</p>
                </div>
              </div>

              {/* COVER IMAGE */}
              <div className="relative group/cover">
                <img
                  src={coverImg || user?.coverImg || "/cover.png"}
                  className="h-52 w-full object-cover"
                  alt="cover"
                />
                {isMyProfile && (
                  <div
                    className="absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200"
                    onClick={() => coverImgRef.current.click()}
                  >
                    <MdEdit className="w-5 h-5 text-white" />
                  </div>
                )}

                <input
                  type="file"
                  hidden
                  accept="image/*"
                  ref={coverImgRef}
                  onChange={(e) => handleImgChange(e, "coverImg")}
                />
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  ref={profileImgRef}
                  onChange={(e) => handleImgChange(e, "profileImg")}
                />

                {/* USER AVATAR */}
                <div className="avatar absolute -bottom-16 left-4">
                  <div className="w-32 rounded-full relative group/avatar">
                    <img
                      src={
                        profileImg ||
                        user?.profileImg ||
                        "/avatar-placeholder.png"
                      }
                      className="rounded-full"
                      alt="profile"
                    />
                    {isMyProfile && (
                      <div className="absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer">
                        <MdEdit
                          className="w-4 h-4 text-white"
                          onClick={() => profileImgRef.current.click()}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex justify-end px-4 mt-5">
                {isMyProfile && <EditProfileModal authUser={authUser} />}
                {!isMyProfile && (
                  <button
                    className="btn btn-outline rounded-full btn-sm"
                    onClick={() => follow(user?._id)}
                  >
                    {isPending && "Loading..."}
                    {!isPending && amIFollowing && "Unfollow"}
                    {!isPending && !amIFollowing && "Follow"}
                  </button>
                )}
                {(coverImg || profileImg) && (
                  <button
                    disabled={isUpdatingProfile}
                    className="btn btn-primary rounded-full btn-sm text-white px-4 ml-2"
                    onClick={async () => {
                      await updateProfile({ coverImg, profileImg });
                      setCoverImg(null);
                      setProfileImg(null);
                    }}
                  >
                    {isUpdatingProfile ? "Updating..." : "Update"}
                  </button>
                )}
              </div>

              {/* USER DETAILS */}
              <div className="flex flex-col gap-4 mt-14 px-4">
                <div className="flex flex-col">
                  <span className="font-bold text-lg">{user?.fullName}</span>
                  <span className="text-sm text-slate-500">
                    @{user?.username}
                  </span>
                  <span className="text-sm my-1">{user?.bio}</span>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {user?.link && (
                    <div className="flex gap-1 items-center">
                      <FaLink className="w-3 h-3 text-slate-500" />
                      <a
                        href={
                          user.link.startsWith("http")
                            ? user.link
                            : `https://${user.link}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-blue-500 hover:underline"
                      >
                        {user?.link}
                      </a>
                    </div>
                  )}
                  <div className="flex gap-2 items-center">
                    <IoCalendarOutline className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-500">
                      {memberSinceDate}
                    </span>
                  </div>
                </div>

                {/* FOLLOW STATS */}
                <div className="flex gap-2">
                  <div className="flex gap-1 items-center">
                    <span className="font-bold text-xs">
                      {user?.following.length}
                    </span>
                    <span className="text-slate-500 text-xs">Following</span>
                  </div>
                  <div className="flex gap-1 items-center">
                    <span className="font-bold text-xs">
                      {user?.followers.length}
                    </span>
                    <span className="text-slate-500 text-xs">Followers</span>
                  </div>
                </div>
              </div>
            </>
          )}
        <h1 className="text-xl font-semibold flex justify-center mt-5">Posts</h1>
          <Posts feedType={feedType} username={username} userId={user?._id} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
