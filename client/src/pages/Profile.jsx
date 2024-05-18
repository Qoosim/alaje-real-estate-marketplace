import {
  getDownloadURL,
  getStorage,
  list,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  logoutUserStart,
  logoutUserSuccess,
  logoutUserFailure,
} from "../redux/user/userSlice";

const Profile = () => {
  const { currentUser, error, isLoading } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [successMsg, setSuccessMsg] = useState(false);
  const [userListing, setUserListing] = useState([]);
  const [showListingError, setShowListingError] = useState(false);
  const [deleteListingError, setDeleteListingError] = useState(false);
  const [isShowListingsClicked, setIsShowListingsClicked] = useState(false);

  // firebase storage
  // allow read;
  // allow write: if
  // request.resource.size < 2 * 1024 * 1024 &&
  // request.resource.contentType.matches('image/.*')
  useEffect(() => {
    if (file) {
      handleUpload(file);
    }
  }, [file]);

  const handleUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercentage(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setFormData({ ...formData, avatar: downloadUrl });
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const response = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const json = await response.json();
      if (!response.ok) {
        dispatch(updateUserFailure(json.error));
        return;
      }
      if (response.ok) {
        dispatch(updateUserSuccess(json));
        setSuccessMsg(true);
      }
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccessMsg(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [successMsg]);

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const response = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const json = await response.json();
      if (!response.ok) {
        dispatch(deleteUserFailure(json.error));
      }
      dispatch(deleteUserSuccess(json));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleUserLogout = async () => {
    try {
      dispatch(logoutUserStart());
      const response = await fetch("/api/auth/logout");
      const json = await response.json();
      if (!response.ok) {
        dispatch(logoutUserFailure(json.error));
      }
      if (response.ok) {
        dispatch(logoutUserSuccess(json));
      }
    } catch (error) {
      dispatch(logoutUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingError(true);
        return;
      }
      setUserListing(data);
    } catch (error) {
      setShowListingError(true);
    }
  };

  const handleDeleteListing = async (listingId) => {
    try {
      setDeleteListingError(false);
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserListing((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      setDeleteListingError(true);
    }
  };

  const onShowListingsClick = () => {
    handleShowListings();
    setIsShowListingsClicked(true);
  };

  return (
    <section className="p-3 max-w-[40%] mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <input
        type="file"
        ref={fileRef}
        hidden
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <img
          onClick={() => fileRef.current.click()}
          src={formData?.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full size-24 object-cover cursor-pointer self-center mt-2"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Image upload error(image must be less than 2mb)
            </span>
          ) : filePercentage > 0 && filePercentage < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePercentage}%`}</span>
          ) : filePercentage === 100 ? (
            <span className="text-green-700">Image successfully uploaded</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="Username"
          defaultValue={currentUser.username}
          className="border p-3 rounded-lg"
          id="username"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="Email"
          defaultValue={currentUser.email}
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={isLoading}
          className="bg-slate-700 p-3 uppercase rounded-lg text-white hover:opacity-95 disabled:opacity-80"
        >
          {isLoading ? `Loading...` : `update`}
        </button>
        <Link
          to="/create-listing"
          className="bg-green-700 p-3 rounded-lg text-white text-center uppercase hover:opacity-95"
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          className="text-red-700 cursor-pointer"
          onClick={handleDeleteUser}
        >
          Delete account
        </span>
        <span
          className="text-red-700 cursor-pointer"
          onClick={handleUserLogout}
        >
          Sign out
        </span>
      </div>
      {error && <p className="text-red-700 mt-5 text-center italic">{error}</p>}
      {successMsg && (
        <p className="text-green-700 mt-5 text-center italic">
          User details updated successfully
        </p>
      )}
      <div className="w-full mt-5">
        <button onClick={onShowListingsClick} className="text-green-700 w-full">
          Show Listings
        </button>
        {showListingError && (
          <p className="text-red-700 mt-2">Error showing listings.</p>
        )}
        <div className="w-full">
          {isShowListingsClicked && (
            <>
              {userListing && userListing.length > 0 ? (
                <div className="flex flex-col gap-6">
                  <h4 className="text-center mt-6 font-medium text-lg">
                    Your Listings
                  </h4>
                  {userListing.map((listing) => (
                    <div className="flex justify-between items-center gap-6 border p-3 rounded-lg">
                      <Link to={`/listing/${listing._id}`}>
                        <img
                          src={listing.imageUrls[0]}
                          alt="Listing Image"
                          className="w-16 h-16 object-contain"
                        />
                      </Link>
                      <Link
                        to={`/listing/${listing._id}`}
                        className="flex-1 hover:underline text-slate-700 truncate"
                      >
                        <p>{listing.title}</p>
                      </Link>
                      <div className="flex flex-col items-center">
                        <button
                          onClick={() => handleDeleteListing(listing._id)}
                          className="text-red-700 capitalize font-medium"
                        >
                          delete
                        </button>
                        <button className="text-green-700 capitalize font-medium">
                          edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center font-medium text-lg my-5">
                  You have no listing at the moment
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Profile;
