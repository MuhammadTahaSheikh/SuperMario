import React, { useState, useEffect } from "react";
import "./propertyDetail.css";
import Sidenav from "../../../components/sidebar/Sidenav";
import Navbar from "../../../components/navbar/Navbar";
import demo from "../../../assets/dashboard/demo.jpg";
import bucket from "../../../assets/dashboard/bucket.png";
import offer from "../../../assets/dashboard/offer.svg";
import SendSingleOfferModal from "../modals/SendSingleOfferModal";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Navigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Spinner from "react-bootstrap/Spinner";

export default function PropertyDetail() {
  const [showModal, setShowModal] = useState(false);
  const [property, setProperty] = useState(null);
  const [primaryImage, setPrimaryImage] = useState(null);
  const [propertyImage, setPropertyImage] = useState([]);
  const { id } = useParams();
  const [loader, setloader] = useState(true);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  const [loading, setLoading] = useState(false);

  const [savedOfferSent, setSavedOfferSent] = useState([]);
  const isSavedOffer = savedOfferSent.some(
    (svPropertyOffer) => svPropertyOffer.property_id === property?.id
  );

  useEffect(() => {
    const fetchSavedOffers = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get("/api/send-offer", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSavedOfferSent(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching saved properties:", error);
        setLoading(false);
      }
    };

    fetchSavedOffers();
  }, []);
  const fetchData = async () => {
    try {
      const response = await axios.get(`/api/properties/${id}`);
      setloader(false);
      let priImage = response.data.primary_photo;
      let images = response.data.alt_photos;
      const slicedImages = images.slice(0, 3);
      setProperty(response.data);
      setPrimaryImage(priImage);
      setPropertyImage(slicedImages);
    } catch (error) {
      console.error("Error fetching property data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [id]);

  const token = localStorage.getItem("accessToken");
  if (!token) {
    return <Navigate to="/" />;
  }
  return (
    <>
      <div className="app-main-container">
        <div className="app-main-left-container">
          <Sidenav />
        </div>
        <div className="app-main-right-container">
          <Navbar />
          <SendSingleOfferModal
            show={showModal}
            handleClose={handleClose}
            property={property}
          />
          <div className="dashboard-main-container">
            <div className="d-flex justify-content-center m-1">
              {loader && <CircularProgress color="secondary" />}
            </div>
            {property && (
              <div className="row">
                <div className="col-xl-4 col-lg-12 col-md-12 col-sm-12">
                  <p className="prop-detail-text mb-4">PROPERTY DETAILS</p>
                  <div>
                    <img
                      className="prop-main-img"
                      src={primaryImage}
                      alt="demo"
                    />
                  </div>
                  <div className="d-flex flex-row gap-3 mt-3 mb-3">
                    {propertyImage.map((photo, index) => (
                      <img
                        key={index}
                        className="prop-small-img"
                        src={photo}
                        alt="demo"
                      />
                    ))}
                  </div>
                </div>
                <div className="col-xl-8 col-lg-12 col-md-12 col-sm-12">
                  <div className="row gap-3 mb-3">
                    <div className="bucket-container">
                      <p className="bucket-text">Save to the Bucket</p>
                      <img className="" src={bucket} alt="bucket" />
                    </div>
                    <div
                      className="offer-container"
                      onClick={!isSavedOffer ? handleShow : undefined}
                    >
                      {isSavedOffer ? (
                        <span className="already_sent">Offer Already Sent</span>
                      ) : (
                        <>
                          {loading ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            <p className="offer-text">Send Single Offer</p>
                          )}
                        </>
                      )}
                      <img className="" src={offer} alt="offer" />
                    </div>
                  </div>
                  <p className="property-address-text">
                    {property.location || "N/A"}
                  </p>
                  <div className="row">
                    <div className="col-xl-4 col-lg-12 col-md-12 col-sm-12">
                      <div class="d-flex flex-row mt-3">
                        <p class="field-text">Year Built</p>
                        <p class="field-value">
                          {property.year_built || "N/A"}
                        </p>
                      </div>
                      <div class="d-flex flex-row">
                        <p class="field-text">Living Area SqFt</p>
                        <p class="field-value">{property.sqft || "N/A"}</p>
                      </div>
                      <div class="d-flex flex-row">
                        <p class="field-text">Bedrooms</p>
                        <p class="field-value">{property.beds || "N/A"}</p>
                      </div>
                      <div class="d-flex flex-row">
                        <p class="field-text">Bathrooms</p>
                        <p class="field-value">
                          {property.full_baths || "N/A"}
                        </p>
                      </div>
                      <div class="d-flex flex-row">
                        <p class="field-text">No. of Units</p>
                        <p class="field-value">{property.unit || "N/A"}</p>
                      </div>
                      <div class="d-flex flex-row">
                        <p class="field-text">Last Sale Date</p>
                        <p class="field-value">
                          {property.last_sold_date || "N/A"}
                        </p>
                      </div>
                      <div class="d-flex flex-row">
                        <p class="field-text">Property Vacant</p>
                        <p class="field-value">N/A</p>
                      </div>
                      <div class="d-flex flex-row">
                        <p class="field-text">Mail Vacant</p>
                        <p class="field-value">N/A</p>
                      </div>
                      <div class="d-flex flex-row">
                        <p class="field-text">Owner Name</p>
                        <p class="field-value">N/A</p>
                      </div>
                      <div class="d-flex flex-row">
                        <p class="field-text">APN</p>
                        <p class="field-value">N/A</p>
                      </div>
                      <div class="d-flex flex-row">
                        <p class="field-text">Owner Type</p>
                        <p class="field-value">N/A</p>
                      </div>
                      <div class="d-flex flex-row">
                        <p class="field-text">Ownership Length</p>
                        <p class="field-value">N/A</p>
                      </div>
                      <div class="d-flex flex-row">
                        <p class="field-text">Owner Occupied</p>
                        <p class="field-value">N/A</p>
                      </div>
                      <div class="d-flex flex-row">
                        <p class="field-text">Skiped Traced</p>
                        <p class="field-value">N/A</p>
                      </div>
                      <div class="d-flex flex-row">
                        <p class="field-text">Opt-Out</p>
                        <p class="field-value">N/A</p>
                      </div>
                    </div>

                    <div className="col-xl-4 col-lg-12 col-md-12 col-sm-12">
                      <div className="value-container mt-3">
                        <p className="value-text">Value</p>
                        <div class="d-flex flex-row mt-3">
                          <p class="field-text">Estimated Value</p>
                          <p class="field-value">
                            {property.estimated_value || "N/A"}
                          </p>
                        </div>
                        <div class="d-flex flex-row">
                          <p class="field-text">Confidence Score</p>
                          <p class="field-value">N/A</p>
                        </div>
                        <div class="d-flex flex-row">
                          <p class="field-text">Est. Equity</p>
                          <p class="field-value">N/A</p>
                        </div>
                        <div class="d-flex flex-row">
                          <p class="field-text">Estimated Rent</p>
                          <p class="field-value">N/A</p>
                        </div>
                      </div>
                      <div className="value-container mt-3">
                        <p className="value-text">MLS</p>
                        <div class="d-flex flex-row mt-3">
                          <p class="field-text">MLS Status</p>
                          <p class="field-value">{property.status || "N/A"}</p>
                        </div>
                        <div class="d-flex flex-row">
                          <p class="field-text">MLS Number</p>
                          <p class="field-value">{property.mls_id || "N/A"}</p>
                        </div>
                        <div class="d-flex flex-row">
                          <p class="field-text">Listing Date</p>
                          <p class="field-value">
                            {property.list_date || "N/A"}
                          </p>
                        </div>
                        <div class="d-flex flex-row">
                          <p class="field-text">Listing Amount</p>
                          <p class="field-value">
                            ${property.list_price || "N/A"}
                          </p>
                        </div>
                        <div class="d-flex flex-row">
                          <p class="field-text">After Repair Value</p>
                          <p class="field-value">N/A</p>
                        </div>
                        <div class="d-flex flex-row">
                          <p class="field-text">Agent Name</p>
                          <p class="field-value">N/A</p>
                        </div>
                        <div class="d-flex flex-row">
                          <p class="field-text">Office</p>
                          <p class="field-value">N/A</p>
                        </div>
                      </div>
                    </div>

                    <div className="col-xl-4 col-lg-12 col-md-12 col-sm-12">
                      <div className="value-container mt-3">
                        <p className="value-text">Mortgage / Debt Summary</p>
                        <div class="d-flex flex-row mt-3">
                          <p class="field-text">Open Mortgages</p>
                          <p class="field-value">N/A</p>
                        </div>
                        <div class="d-flex flex-row">
                          <p class="field-text">Total Mortgage Balance</p>
                          <p class="field-value">N/A</p>
                        </div>
                        <div class="d-flex flex-row">
                          <p class="field-text">Recording Date</p>
                          <p class="field-value">N/A</p>
                        </div>
                        <div class="d-flex flex-row">
                          <p class="field-text">Sale Amount</p>
                          <p class="field-value">
                            ${property.sold_price || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="value-container mt-3">
                        <p className="value-text">Distress Indicators</p>
                        <div class="d-flex flex-row mt-3">
                          <p class="field-text">Active Auction</p>
                          <p class="field-value">N/A</p>
                        </div>
                        <div class="d-flex flex-row">
                          <p class="field-text">Expired Listing</p>
                          <p class="field-value">N/A</p>
                        </div>
                        <div class="d-flex flex-row">
                          <p class="field-text">Inherited</p>
                          <p class="field-value">N/A</p>
                        </div>
                        <div class="d-flex flex-row">
                          <p class="field-text">Active Pre-Foreclosure</p>
                          <p class="field-value">N/A</p>
                        </div>
                        <div class="d-flex flex-row">
                          <p class="field-text">Tax Default</p>
                          <p class="field-value">N/A</p>
                        </div>
                        <div class="d-flex flex-row">
                          <p class="field-text">Tired Landlord</p>
                          <p class="field-value">N/A</p>
                        </div>
                        <div class="d-flex flex-row">
                          <p class="field-text">Unknown Equity</p>
                          <p class="field-value">N/A</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="prop-detail-main-container mt-5">
              <div className="d-flex flex-wrap justify-content-start gap-2">
                <div className="prop-text-container default-prop">
                  Comparable
                </div>
                <div className="prop-text-container">Sale & Loan</div>
                <div className="prop-text-container">MLS</div>
                <div className="prop-text-container">List & Tags</div>
                <div className="prop-text-container">Foreclosure & Lien</div>
                <div className="prop-text-container">Owner Profile</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
