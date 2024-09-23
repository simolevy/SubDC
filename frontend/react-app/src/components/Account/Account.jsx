import React, { useState, useEffect } from 'react';
import Carousel from 'react-multi-carousel';
import { useNavigate } from "react-router-dom";
import { getUserInfo, getUserListings, getUserFavorites, updateUserInfo } from './Account';
import { checkAuthentication } from '../Authentication/Authentication';
import ListingCard from './../Listings/ListingCard/ListingCard';
import "./Account.css";

const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 5 },
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
  tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
  mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
};

export default function Account() {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [userFavorites, setUserFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({
    user_id: '',
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    phone_number: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatedInfo, setUpdatedInfo] = useState({
    username: userInfo.username,
    first_name: userInfo.first_name,
    last_name: userInfo.last_name,
    email: userInfo.email,
    phone_number: userInfo.phone_number,
  });
  

  const resetUserInfo = () => {
    setUserInfo({
      user_id: '',
      first_name: '',
      last_name: '',
      username: '',
      email: '',
      phone_number: ''
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('jsonwebtoken');
    setAuthenticated(false);
    resetUserInfo();
    setUserListings([]);
    setUserFavorites([]);
    navigate('/Authentication');
  };

  const handleModalOpen = () => {
    setUpdatedInfo(userInfo);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  const handleSave = () => {
    let token = localStorage.getItem('jsonwebtoken');
    updateUserInfo(token, updatedInfo);
    setUserInfo(updatedInfo);
    handleModalClose();
    alert("Please log back in to see the changes made to your Account");
    handleLogout()
  };

  useEffect(() => {
    const token = localStorage.getItem('jsonwebtoken');
    checkAuthentication(token, setLoading, setAuthenticated, setUserInfo);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('jsonwebtoken');
    if (authenticated && token) {
      getUserInfo(token, setUserInfo);
      getUserListings(token, setUserListings);
      getUserFavorites(token, setUserFavorites)
    }
  }, [authenticated, userInfo.user_id]);

  useEffect(() => {
    // if (isModalOpen) {
    //   setUpdatedInfo({
    //     username: userInfo.username,
    //     first_name: userInfo.first_name,
    //     last_name: userInfo.last_name,
    //     email: userInfo.email,
    //     phone_number: userInfo.phone_number,
    //   });
    // }
  }, [isModalOpen, userInfo]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="account-page">
      <div className="user-info-section">
        <h2>Your Profile</h2>
        <button className="edit-info-button" onClick={handleModalOpen}>&#9998;</button>
        <p><strong>Username:</strong> {userInfo.username}</p>
        <p><strong>Name:</strong> {userInfo.first_name} {userInfo.last_name}</p>
        <p><strong>Email:</strong> {userInfo.email}</p>
        <p><strong>Phone:</strong> {userInfo.phone_number}</p>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Your Info</h3>
            <label>Username: <input name="username" value={updatedInfo.username}  onChange={(e) => setUpdatedInfo({ ...updatedInfo, [e.target.name]: e.target.value })} /></label>
            <label>First Name: <input name="first_name" value={updatedInfo.first_name}  onChange={(e) => setUpdatedInfo({ ...updatedInfo, [e.target.name]: e.target.value })}/></label>
            <label>Last Name: <input name="last_name" value={updatedInfo.last_name}  onChange={(e) => setUpdatedInfo({ ...updatedInfo, [e.target.name]: e.target.value })} /></label>
            <label>Phone Number: <input name="phone_number" value={updatedInfo.phone_number}  onChange={(e) => setUpdatedInfo({ ...updatedInfo, [e.target.name]: e.target.value })} /></label>
            <button onClick={handleSave}>Save</button>
            <button onClick={handleModalClose}>Cancel</button>
          </div>
        </div>
      )}

      <div className="user-listings-section">
        <h2>Your Listings</h2>
        {userListings.length > 0 ? (
          <Carousel responsive={responsive} infinite={true}>
            {userListings.map(listing => (
              <div key={listing.listing_id}>
                <ListingCard
                  listing_id={listing.listing_id}
                  listingName={listing.title}
                  listingPrice={listing.price}
                  listingImage={listing.image1}
                />
              </div>
            ))}
          </Carousel>
        ) : (
          <p>You have no listings.</p>
        )}
      </div>
      <div className="user-favorites-section">
        <h2>Your Favorite Listings</h2>
        {userFavorites.length > 0 ? (
          <Carousel responsive={responsive} infinite={true}>
            {userFavorites.map(favorite => (
              <div key={favorite.listing_id}>
                <ListingCard
                  listing_id={favorite.listing_id}
                  listingName={favorite.title}
                  listingPrice={favorite.price}
                  listingImage={favorite.image1}
                />
              </div>
            ))}
          </Carousel>
        ) : (
          <p>You have no favorite listings.</p>
        )}
      </div>
    </div>
  );
}
