import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";
import { FaUserEdit, FaUserCog, FaTimes } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { RiFeedbackFill } from "react-icons/ri";
import { IoBug } from "react-icons/io5";
import { MdSupportAgent } from "react-icons/md";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { IoSettings } from "react-icons/io5";
import { MdOutlineLogout } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { TbRefresh } from "react-icons/tb";
import ShinyText from "../../ui-components/ShinyText";

const EditProfileModal = ({ authUser }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    bio: "",
    link: "",
    newPassword: "",
    currentPassword: "",
  });

  const queryClient = useQueryClient();
  const { updateProfile, isUpdatingProfile } = useUpdateUserProfile();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (authUser) {
      setFormData({
        fullName: authUser.fullName,
        username: authUser.username,
        email: authUser.email,
        bio: authUser.bio,
        link: authUser.link,
        newPassword: "",
        currentPassword: "",
      });
    }
  }, [authUser]);

  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/v1/auth/logout", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
    },
    onSuccess: () => {
      toast.success("Logout successful");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: () => {
      toast.error("Logout failed");
    },
  });

  const handleLogout = () => {
    logout();
  };

  return (
    <div>
      {/* Settings Dropdown */}
      <div className="dropdown dropdown-end">
        <button
          className="btn rounded-full btn-sm bg-primary text-white font-medium flex items-center gap-2"
          tabIndex={0}
        >
          <IoSettings className="text-lg" /> Settings
        </button>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow text-white font-normal"
        >
          <li>
            <button
              onClick={() =>
                document.getElementById("edit_profile_modal").showModal()
              }
            >
              <FaUserEdit className="text-lg" />
              Edit Profile
            </button>
          </li>
          <li>
            <a href="mailto:bjbsocial1957@gmail.com">
              <MdSupportAgent className="text-lg" />
              Help & Support
            </a>
          </li>
          <li>
            <a href="https://forms.gle/KyCu78Zx9oLTX3m56">
              <RiFeedbackFill className="text-lg" />
              Feedback
            </a>
          </li>
          <li>
            <Link to="https://forms.gle/xsKrDnecYTc7g2r78">
              <IoBug className="text-lg" />
              Report a Bug
            </Link>
          </li>

          <li>
            <button
              className="text-red-600"
              onClick={() =>
                document.getElementById("logout_confirmation_modal").showModal()
              }
            >
              <IoLogOut className="text-lg" />
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Edit Profile Modal */}
      <dialog id="edit_profile_modal" className="modal">
        <div className="modal-box border rounded-md border-gray-700 shadow-md">
          <div className="flex items-center gap-2">
            <FaUserCog className="text-xl" />
            <ShinyText
              text="Update Profile"
              disabled={false}
              speed={3}
              className="custom-class font-bold text-lg my-6 flex gap-2 items-center"
            />

            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-red-600 text-xl font-bold">
                <FaTimes />
              </button>
            </form>
          </div>

          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              updateProfile(formData);
            }}
          >
            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                placeholder="Full Name"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.fullName}
                name="fullName"
                onChange={handleInputChange}
              />
              <input
                type="text"
                placeholder="Username"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.username}
                name="username"
                onChange={handleInputChange}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <input
                type="email"
                placeholder="Email"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.email}
                name="email"
                onChange={handleInputChange}
              />
            </div>

            <div className="flex flex-col gap-2">
              <textarea
                placeholder="Bio"
                className="w-full input border border-gray-700 rounded p-2 input-md"
                value={formData.bio}
                name="bio"
                onChange={handleInputChange}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <input
                type="password"
                placeholder="Current Password"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.currentPassword}
                name="currentPassword"
                onChange={handleInputChange}
              />
              <input
                type="password"
                placeholder="New Password"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.newPassword}
                name="newPassword"
                onChange={handleInputChange}
              />
            </div>

            <input
              type="text"
              placeholder="Link"
              className="w-full input border border-gray-700 rounded p-2 input-md"
              value={formData.link}
              name="link"
              onChange={handleInputChange}
            />

            <button className="btn bg-primary flex items-center justify-center gap-2 rounded-full btn-sm text-white">
              <TbRefresh className="text-white text-lg" />
              {isUpdatingProfile ? "Updating..." : "Update"}
            </button>
          </form>
        </div>
      </dialog>

      {/* Logout Confirmation Modal */}
      <dialog id="logout_confirmation_modal" className="modal">
        <div className="modal-box border rounded-md border-gray-700 shadow-md bg-neutral-800 p-6">
          <h3 className="font-bold text-lg text-center my-4">
            Are you sure you want to log out?
          </h3>
          <div className="flex justify-center gap-4">
            <form method="dialog">
              <button className="btn btn-sm bg-gray-600 text-white rounded-full text-base font-medium">
                <RxCross2 className="text-lg" />
                Cancel
              </button>
            </form>
            <button
              className="btn btn-sm bg-red-600 text-white rounded-full text-base font-medium"
              onClick={handleLogout}
            >
              <MdOutlineLogout className="text-lg" />
              Logout
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default EditProfileModal;
