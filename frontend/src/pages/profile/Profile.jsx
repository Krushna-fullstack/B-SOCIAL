// src/Profile.js
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
const Profile = () => {
  // const [fileInput , setFileInput] = useRef(null);
  let [countFollower, setCountFollower] = useState(0);
  let [countFollowing, setCountFollowing] = useState(0);
  let countFollowers = useRef(0);
  let countFollowings = useRef(0);

  let cFollow = () => {
    setCountFollower(countFollowers + 1);
  };

  return (
    <div className="w-full min-h-screen  flex flex-col items-center bg-secondary" >
      {/* Banner */}
      <div className="w-full h-48  flex flex-col justify-end bg-white">
        <img src="https://dummyimage.com/hd1080"></img>
        <input type="file" className="hidden" accept="/image"></input>
      </div>

      {/* Profile Section */}
      <div className="flex flex-col items-center mt-[-4rem]">
        <div className="avatar online">
          <div className="ring-primary ring-offset-base-100 w-24 rounded-full ring ring-offset-2">
            <img src="https://www.pngkit.com/png/detail/797-7975330_donna-picarro-dummy-avatar-png.png" />
            <input type="file" className="hidden" accept="image/" />
          </div>
        </div>
        <div className="text-center mt-4">
          <h2 className="text-2xl font-bold">John Doe</h2>
          <p className="text-gray-500">
            <span>@</span>john_doe
          </p>
          <p className="mt-2 max-w-lg mx-auto text-center">
            Hi! I'm John, a web developer passionate about building web
            applications and learning new technologies.
          </p>
          <Link
            to="https://instagram.com/johndoe"
            className="text-primary font-semibold"
          >
            🔗Links
          </Link>
          {/* Links Section */}
          <div className="mt-4 flex space-x-4 justify-center mb-3">
            <button
              className="btn btn-primary btn-wide mt-2 text-white rounded-lg text-lg hover:opacity-75"
              onClick={()=>{
                cFollow();
              }}
            >
              Follow <FaPlus />
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
                    alt="Shoes"
                  />
                </figure>
              </div>

              <div className="card bg-base-100 w-48 shadow-xl mb-1 ">
                <figure>
                  <img
                    src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                    alt="Shoes"
                  />
                </figure>
              </div>

              <div className="card bg-base-100 w-48 shadow-xl mb-1 mr-1">
                <figure>
                  <img
                    src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                    alt="Shoes"
                  />
                </figure>
              </div>

              <div className="card bg-base-100 w-48 shadow-xl mb-1">
                <figure>
                  <img
                    src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                    alt="Shoes"
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
