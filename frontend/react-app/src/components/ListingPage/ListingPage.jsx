import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toggleUserFavorite, fetchListingDetails, apartmentTypeConverter } from './ListingPage';
import './ListingPage.css';

export default function ListingPage() {
    const token = localStorage.getItem('jsonwebtoken');
    const { id: listing_id } = useParams()
    const [isFavorite, setIsFavorite] = useState(false);
    const [user_id, setUser_id] = useState('');
    const [listing, setListing] = useState(null);
    const [listing_user_id, setListing_user_id] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [updatedListing, setUpdatedListing] = useState(listing);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleModalOpen = () => {
        setUpdatedListing(listing);
        setIsModalOpen(true);
    };
    const handleModalClose = () => {
        setIsModalOpen(false);
    };
    const handleSave = () => {
        let token = localStorage.getItem('jsonwebtoken');
        setUpdatedListing(listing);
        setListing(updatedListing)
        handleModalClose();
        alert("Please log back in to see the changes made to your Account");
        handleLogout()
      };
    useEffect(() => {
        fetchListingDetails(token, listing_id, setListing, setIsFavorite, setLoading, setError, setUser_id, setListing_user_id);
    }, [listing_id, token]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="listingPage-container">
            <div className="listing-container">
                <h1 className="listing-title">{listing.title}</h1>
                <h6 className="listing-id">#{listing_id}</h6>
                <div className="listing-details">
                    <p><strong>Description:</strong> {listing.description}</p>
                    <p><strong>Type:</strong> {apartmentTypeConverter(listing.apt_type)}</p>
                    <p><strong>Price:</strong> ${listing.price}</p>
                    <p><strong>Available from:</strong> {listing.availability_start}</p>
                    <p><strong>Available until:</strong> {listing.availability_end}</p>
                    <p><strong>Location:</strong> {listing.location}</p>
                </div>
                {user_id === listing_user_id && (
                    <button className="edit-info-button" onClick={handleModalOpen}>&#9998;</button>)}
                {user_id && user_id !== listing_user_id && (
                    <div
                        className={`favorite-icon ${isFavorite ? 'favorited' : ''}`}
                        onClick={() => toggleUserFavorite(token, listing_id, setIsFavorite)}>
                        <i className={`fas fa-heart ${isFavorite ? 'favorited' : ''}`}></i>
                    </div>
                )}
            </div>
            <div className='listing-image-container'>
                <img src={listing.image1} alt="Image1" className="listing-image" />
                <img src={listing.image2} alt="Image2" className="listing-image" />
            </div>
        </div>

    );
}
