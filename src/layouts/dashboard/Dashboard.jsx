import React, { useState, useEffect } from "react";
import "./dashboard.css";
import { Modal, Spinner } from "react-bootstrap";
import { FaFilter } from "react-icons/fa";
import Sidenav from "../../components/sidebar/Sidenav";
import Navbar from "../../components/navbar/Navbar";
import offeer from "../../assets/dashboard/offer.png";
import sent_offer from "../../assets/dashboard/sent-offer.png";
import order from "../../assets/dashboard/order.png";
import heart from "../../assets/dashboard/heart.png";
import fillheart from "../../assets/dashboard/fill-heart.png";
import search from "../../assets/dashboard/search.png";
import filter from "../../assets/dashboard/filter.png";
import saveheart from "../../assets/dashboard/save-heart.png";
import leftarrow from "../../assets/dashboard/left-arrow.png";
import rightarrow from "../../assets/dashboard/right-arrow.png";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import Pagination from "@mui/material/Pagination";
import axios from "axios";
import { Navigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Dashboard() {
  const [offer, setOffer] = useState(null);
  const [selectedleadtype, setSelectedleadtype] = useState("Lead Types");
  const [selectedPropertytype, setSelectedPropertyType] =
    useState("Property Types");
  const [properties, setProperties] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loader, setloader] = useState(true);
  const [modalData, setModalData] = useState();
  const [showPriceRange, setShowPriceRange] = useState(true);
  const [address, setAddress] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minPriceList, setMinPriceList] = useState("");
  const [maxPriceList, setMaxPriceList] = useState("");
  const [showDataMessage, setShowDataMessage] = useState(false);
  const [showBeds, setShowBeds] = useState(true);
  const [showBaths, setShowBaths] = useState(false);
  const [selectedBeds, setSelectedBeds] = useState("");
  const [selectedBaths, setSelectedBaths] = useState("");
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [savedProperties, setSavedProperties] = useState([]);
  const [savedOfferSent, setSavedOfferSent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInputField, setShowInputField] = useState(false);
  const [activeButton, setActiveButton] = useState("");
  //more filters states
  const [minStories, setMinStories] = useState("");
  const [maxStories, setMaxStories] = useState("");
  const [minBuildingSize, setMinBuildingSize] = useState("");
  const [maxBuildingSize, setMaxBuildingSize] = useState("");
  const [minLotSize, setMinLotSize] = useState("");
  const [maxLotSize, setMaxLotSize] = useState("");
  const [minYearBuilt, setMinYearBuilt] = useState("");
  const [maxYearBuilt, setMaxYearBuilt] = useState("");
  const [occupancyStatus, setOccupancyStatus] = useState([]);
  //more filters states end
  //owner filter states
  const [minYearOwner, setMinYearOwner] = useState("");
  const [maxYearOwner, setMaxYearOwner] = useState("");
  const [minTaxDelinquent, setMinTaxDelinquent] = useState("");
  const [maxTaxDelinquent, setMaxTaxDelinquent] = useState("");

  const [minPropertyOwned, setMinPropertyOwned] = useState("");
  const [maxPropertyOwned, setMaxPropertyOwned] = useState("");
  const [minPortfolioValue, setMinPortfolioValue] = useState("");
  const [maxPortfolioValue, setMaxPortfolioValue] = useState("");
  //owner filter states end
  //financial filter states end
  const [minEstimatedValue, setMinEstimatedValue] = useState("");
  const [maxEstimatedValue, setMaxEstimatedValue] = useState("");
  const [minEstimatedEquity, setMinEstimatedEquity] = useState("");
  const [maxEstimatedEquity, setMaxEstimatedEquity] = useState("");

  const [minAssessedTotValue, setMinAssessedTotValue] = useState("");
  const [maxAssessedTotValue, setMaxAssessedTotValue] = useState("");
  const [minAssessedLandValue, setMinAssessedLandValue] = useState("");
  const [maxAssessedLandValue, setMaxAssessedLandValue] = useState("");
  const [minAssessedImpValue, setMinAssessedImpValue] = useState("");
  const [maxAssessedImpValue, setMaxAssessedImpValue] = useState("");
  const [minLastSalePrice, setMinLastSalePrice] = useState("");
  const [maxLastSalePrice, setMaxLastSalePrice] = useState("");
  const [minLastSaleDate, setMinLastSaleDate] = useState("");
  const [maxLastSaleDate, setMaxLastSaleDate] = useState("");
  //financial filter states end
  // forclousure filter start
  const [minRecDate, setMinRecDate] = useState("");
  const [maxRecDate, setMaxRecDate] = useState("");
  const [minAuctionDate, setMinAuctionDate] = useState("");
  const [maxAuctionDate, setMaxAuctionDate] = useState("");
  const [mlsforeclousureSelect, setMlsforeclousureSelect] = useState("Select");

  //financial filter states end
  // forclousure filter end

  // MLS filter start
  const [minDaysMarket, setMinDaysMarket] = useState("");
  const [maxDaysMarket, setMaxDaysMarket] = useState("");
  const [mlsStatus, setMlsStatus] = useState("Select");

  const [minWithDrawnDate, setMinWithDrawnDate] = useState("");
  const [maxWithDrawnDate, setMaxWithDrawnDate] = useState("");
  const [minListingPrice, setMinListingPrice] = useState("");
  const [maxListingPrice, setMaxListingPrice] = useState("");
  //MLS filter end

  const [showModal, setShowModal] = useState(false);
  const [showModalOffer, setShowModalOffer] = useState(false);
  const [formData, setFormData] = useState({});
  const [filters, setFilters] = useState([]);
  const [apiCalled, setApiCalled] = useState(true);
  const [filterValue, setFilterValue] = useState("");
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  const handlePropertySelet = (property) => {
    setSelectedPropertyType(property);
  };
  const handlePropertySelect = (property) => {
    setSelectedleadtype(property);
  };
  const handleFilterClick = (filter) => {
    function convertToNumbers(obj) {
      for (let key in obj) {
        if (key !== "address" && obj[key] !== null && !isNaN(obj[key])) {
          obj[key] = Number(obj[key]);
        }
      }
      return obj;
    }

    const address = filter.address;
    const convertedFilter = convertToNumbers(filter);

    setLoadingSearch(true);
    const token = localStorage.getItem("accessToken");
    axios
      .post(
        "/api/properties/filter",
        { ...convertedFilter, address: String(address) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        if (response.data.properties.length === 0) {
          toast.info("No properties found for selected filters");
          setProperties([]);
          setTotalPages([]);
        } else {
          toast.success("Properties found successfully");
          setProperties(response.data.properties);
          setTotalPages(response.data.total_pages);
          setFiltersApplied(true);
          setApiCalled(true);
          setFilterValue(convertedFilter);
        }
        setFormData({ filterName: "" });
        setLoadingSearch(false);
        setShowModal(false);
        setShowModalOffer(false);
      })
      .catch((error) => {
        toast.error(error.response.data.error);
        console.error("Error saving filters:", error);
        setLoadingSearch(false);
      });
  };

  const handleClose = () => {
    setShowModal(false);
    setShowModalOffer(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const fetchFilters = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await axios.get("/api/saved-filters", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFilters(response.data);
    } catch (error) {
      console.error("Error fetching filters", error);
    }
  };
  useEffect(() => {
    fetchFilters();
  }, []);
  const handleSubmit = () => {
    const filters = {
      min_est_value: parseInt(minPrice),
      max_est_value: parseInt(maxPrice),
      min_list_price: parseInt(minPriceList),
      max_list_price: parseInt(maxPriceList),
      no_of_beds: parseInt(selectedBeds),
      no_of_baths: parseInt(selectedBaths),
      address: address,
      min_stories: parseInt(minStories),
      max_stories: parseInt(maxStories),
      min_building_size: parseInt(minBuildingSize),
      max_building_size: parseInt(maxBuildingSize),
      min_lot_size: parseInt(minLotSize),
      max_lot_size: parseInt(maxLotSize),
      min_year_built: parseInt(minYearBuilt),
      max_year_built: parseInt(maxYearBuilt),
      min_year_owner: parseInt(minYearOwner),
      max_year_owner: parseInt(maxYearOwner),
      min_tax_delinquent: parseInt(minTaxDelinquent),
      max_tax_delinquent: parseInt(maxTaxDelinquent),
      min_property_owned: parseInt(minPropertyOwned),
      max_property_owned: parseInt(maxPropertyOwned),
      min_portfolio_value: parseInt(minPortfolioValue),
      max_portfolio_value: parseInt(maxPortfolioValue),
      finance_min_estimated_value: parseInt(minEstimatedValue),
      finance_max_estimated_value: parseInt(maxEstimatedValue),
      finance_min_estimated_equity: parseInt(minEstimatedEquity),
      finance_max_estimated_equity: parseInt(maxEstimatedEquity),

      finance_min_assessed_value: parseInt(minAssessedTotValue),
      finance_max_assessed_value: parseInt(maxAssessedTotValue),
      finance_min_assessed_land_value: parseInt(minAssessedLandValue),
      finance_max_assessed_land_value: parseInt(maxAssessedLandValue),
      finance_min_assessed_imp_value: parseInt(minAssessedImpValue),
      finance_max_assessed_imp_value: parseInt(maxAssessedImpValue),

      finance_min_last_sale_price: parseInt(minLastSalePrice),
      finance_max_last_sale_price: parseInt(maxLastSalePrice),
      finance_min_last_sale_date: parseInt(minLastSaleDate),
      finance_max_last_sale_date: parseInt(maxLastSaleDate),

      mls_status: parseInt(mlsStatus),
      mls_min_days_on_market: parseInt(minDaysMarket),
      mls_max_days_on_market: parseInt(maxDaysMarket),
      mls_min_withdrawn_date: parseInt(minWithDrawnDate),
      mls_max_withdrawn_date: parseInt(maxWithDrawnDate),

      mls_min_listing_price: parseInt(minListingPrice),
      mls_max_listing_price: parseInt(maxListingPrice),

      fore_status: parseInt(mlsforeclousureSelect),
      fore_min_rec_date: parseInt(minRecDate),
      fore_max_rec_date: parseInt(maxRecDate),

      fore_min_auction_date: parseInt(minAuctionDate),
      fore_max_auction_date: parseInt(maxAuctionDate),
      selected_lead_type: selectedleadtype,
      selected_property_type: selectedPropertytype,
      occupancy_status: occupancyStatus,
    };

    const requiredFields = [
      filters.min_est_value,
      filters.max_est_value,
      filters.min_list_price,
      filters.max_list_price,
      filters.no_of_beds,
      filters.no_of_baths,
      filters.min_stories,
      filters.max_stories,
      filters.min_building_size,
      filters.max_building_size,
      filters.min_lot_size,
      filters.max_lot_size,
      filters.min_year_built,
      filters.max_year_built,
      filters.min_year_owner,
      filters.max_year_owner,
      filters.min_tax_delinquent,
      filters.max_tax_delinquent,
      filters.min_property_owned,
      filters.max_property_owned,
      filters.min_portfolio_value,
      filters.max_portfolio_value,
      filters.finance_min_estimated_value,
      filters.finance_max_estimated_value,
      filters.finance_min_estimated_equity,
      filters.finance_max_estimated_equity,
      filters.finance_min_assessed_value,
      filters.finance_max_assessed_value,
      filters.finance_min_assessed_imp_value,
      filters.finance_max_assessed_imp_value,
      filters.finance_min_assessed_land_value,
      filters.finance_max_assessed_land_value,
      filters.finance_min_last_sale_date,
      filters.finance_max_last_sale_date,
      filters.finance_min_last_sale_price,
      filters.finance_max_last_sale_price,
      filters.mls_max_days_on_market,
      filters.mls_min_days_on_market,
      filters.mls_min_listing_price,
      filters.mls_max_listing_price,
      filters.mls_min_withdrawn_date,
      filters.mls_max_withdrawn_date,
      filters.fore_min_rec_date,
      filters.fore_max_rec_date,
      filters.fore_min_auction_date,
      filters.fore_max_auction_date,
    ];

    const hasValidFilters =
      requiredFields.some((value) => value !== "" && !isNaN(value)) ||
      address !== "" ||
      (selectedleadtype !== "" && selectedleadtype !== "Lead Types") ||
      (selectedPropertytype !== "" &&
        selectedPropertytype !== "Property Types");
    // selectedleadtype !== ""  ||
    // selectedPropertytype !== "";

    if (!hasValidFilters) {
      toast.error("At least one filter field is required");
      return;
    }

    setLoadingSearch(true);
    const token = localStorage.getItem("accessToken");
    axios
      .post("/api/properties/filter", filters, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.properties.length === 0) {
          toast.info("No properties found for selected filters");
          setProperties([]);
          setTotalPages([]);
        } else {
          toast.success("Properties found successfully");
          setProperties(response.data.properties);
          setTotalPages(response.data.total_pages);
          setFiltersApplied(true);
          setApiCalled(true);
          setFilterValue(filters);
        }

        setLoadingSearch(false);
      })
      .catch((error) => {
        toast.error("Failed to search filter. Please try again");
        setLoading(false);
      });
  };
  const [formDataOffer, setFormDataOffer] = useState({
    expirationDate: "",
    closingDate: "",
    offerAmount: "",
    listPricePercentage: "",
    escrowDeposit: "",
    inspectionPeriod: "",
    otherItems: "",
    terms: "",
  });
  const handleChangeOffer = (e) => {
    const { name, value } = e.target;
    setFormDataOffer({ ...formDataOffer, [name]: value });
  };
  const validateForm = () => {
    const requiredFields = [
      "expirationDate",
      "closingDate",
      "escrowDeposit",
      "inspectionPeriod",
    ];
    for (let field of requiredFields) {
      if (!formDataOffer[field]) {
        return false;
      }
    }
    return true;
  };
  const handleSaveFilterOffer = async (property) => {
    if (!validateForm()) {
      toast.error("Please fill in all required(*) fields.");
      return;
    }
    setLoading(true);
    const token = localStorage.getItem("accessToken");
    try {
      const webhookData = {
        sendOfferFormData: formDataOffer,
        property,
      };

      const response = await axios.post("/api/send-single-offer", webhookData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setSavedOfferSent((prevProperties) => [...prevProperties, response.data]);
      toast.success("Email and offer sent successfully");

      handleClose();
    } catch (error) {
      console.error("Error sending data to webhook:", error);
      toast.error("Failed to send offer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFilter = () => {
    if (!formData.filterName) {
      toast.error("Filter name is required");
      return;
    }
    const filters = {
      min_est_value: parseInt(minPrice),
      max_est_value: parseInt(maxPrice),
      min_list_price: parseInt(minPriceList),
      max_list_price: parseInt(maxPriceList),
      no_of_beds: parseInt(selectedBeds),
      no_of_baths: parseInt(selectedBaths),
      address: address,
      min_stories: parseInt(minStories),
      max_stories: parseInt(maxStories),
      min_building_size: parseInt(minBuildingSize),
      max_building_size: parseInt(maxBuildingSize),
      min_lot_size: parseInt(minLotSize),
      max_lot_size: parseInt(maxLotSize),
      min_year_built: parseInt(minYearBuilt),
      max_year_built: parseInt(maxYearBuilt),
      min_year_owner: parseInt(minYearOwner),
      max_year_owner: parseInt(maxYearOwner),
      min_tax_delinquent: parseInt(minTaxDelinquent),
      max_tax_delinquent: parseInt(maxTaxDelinquent),
      min_property_owned: parseInt(minPropertyOwned),
      max_property_owned: parseInt(maxPropertyOwned),
      min_portfolio_value: parseInt(minPortfolioValue),
      max_portfolio_value: parseInt(maxPortfolioValue),
      finance_min_estimated_value: parseInt(minEstimatedValue),
      finance_max_estimated_value: parseInt(maxEstimatedValue),
      finance_min_estimated_equity: parseInt(minEstimatedEquity),
      finance_max_estimated_equity: parseInt(maxEstimatedEquity),
      finance_min_assessed_value: parseInt(minAssessedTotValue),
      finance_max_assessed_value: parseInt(maxAssessedTotValue),
      finance_min_assessed_land_value: parseInt(minAssessedLandValue),
      finance_max_assessed_land_value: parseInt(maxAssessedLandValue),
      finance_min_assessed_imp_value: parseInt(minAssessedImpValue),
      finance_max_assessed_imp_value: parseInt(maxAssessedImpValue),
      finance_min_last_sale_price: parseInt(minLastSalePrice),
      finance_max_last_sale_price: parseInt(maxLastSalePrice),
      finance_min_last_sale_date: parseInt(minLastSaleDate),
      finance_max_last_sale_date: parseInt(maxLastSaleDate),
      mls_status: parseInt(mlsStatus),
      mls_min_days_on_market: parseInt(minDaysMarket),
      mls_max_days_on_market: parseInt(maxDaysMarket),
      mls_min_withdrawn_date: parseInt(minWithDrawnDate),
      mls_max_withdrawn_date: parseInt(maxWithDrawnDate),

      mls_min_listing_price: parseInt(minListingPrice),
      mls_max_listing_price: parseInt(maxListingPrice),
      fore_status: parseInt(mlsforeclousureSelect),
      fore_min_rec_date: parseInt(minRecDate),
      fore_max_rec_date: parseInt(maxRecDate),

      fore_min_auction_date: parseInt(minAuctionDate),
      fore_max_auction_date: parseInt(maxAuctionDate),
      selected_lead_type: selectedleadtype,
      selected_property_type: selectedPropertytype,
      occupancy_status: occupancyStatus,
      ...formData,
    };

    const requiredFields = [
      filters.min_est_value,
      filters.max_est_value,
      filters.min_list_price,
      filters.max_list_price,
      filters.no_of_beds,
      filters.no_of_baths,
      filters.min_stories,
      filters.max_stories,
      filters.min_building_size,
      filters.max_building_size,
      filters.min_lot_size,
      filters.max_lot_size,
      filters.min_year_built,
      filters.max_year_built,
      filters.min_year_owner,
      filters.max_year_owner,
      filters.min_tax_delinquent,
      filters.max_tax_delinquent,
      filters.min_property_owned,
      filters.max_property_owned,
      filters.min_portfolio_value,
      filters.max_portfolio_value,
      filters.finance_min_estimated_value,
      filters.finance_max_estimated_value,
      filters.finance_min_estimated_equity,
      filters.finance_max_estimated_equity,
      filters.finance_min_assessed_value,
      filters.finance_max_assessed_value,
      filters.finance_min_assessed_imp_value,
      filters.finance_max_assessed_imp_value,
      filters.finance_min_assessed_land_value,
      filters.finance_max_assessed_land_value,
      filters.finance_min_last_sale_date,
      filters.finance_max_last_sale_date,
      filters.finance_min_last_sale_price,
      filters.finance_max_last_sale_price,
      filters.mls_max_days_on_market,
      filters.mls_min_days_on_market,
      filters.mls_min_listing_price,
      filters.mls_max_listing_price,
      filters.mls_min_withdrawn_date,
      filters.mls_max_withdrawn_date,
      filters.fore_min_rec_date,
      filters.fore_min_rec_date,
      filters.fore_min_auction_date,
      filters.fore_max_auction_date,
      filters.selected_lead_type,
      filters.selected_property_type,
    ];
    const hasValidFilters =
      requiredFields.some((value) => value !== "" && !isNaN(value)) ||
      address !== "" ||
      (selectedleadtype !== "" && selectedleadtype !== "Lead Types") ||
      (selectedPropertytype !== "" &&
        selectedPropertytype !== "Property Types");
      // selectedleadtype !== "" ||
      // selectedPropertytype !== "";
    if (!hasValidFilters) {
      toast.error("At least one filter field is required");
      return;
    }
    setLoading(true);
    setLoadingSave(true);
    const token = localStorage.getItem("accessToken");
    axios
      .post("/api/properties/save-filter", filters, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        toast.success("Filter saved successfully");
        setFilterValue(filters);

        fetchFilters();
        setFormData({ filterName: "" });
        setLoadingSave(false);
        setShowModal(false);
        setShowModalOffer(false);
      })
      .catch((error) => {
        toast.error(error.response.data.error);
        console.error("Error saving filters:", error);
        setLoadingSave(false);
      });
  };
  const handleOccupancyChange = (status) => {
    setOccupancyStatus([status]);
  };

  const handleDropdownClick = (event) => {
    event.stopPropagation();
  };
  const handleBedsClick = (event) => {
    event.stopPropagation();

    setShowBeds(true);
    setShowBaths(false);

    setSelectedBeds(event.target.innerText);
    setActiveButton("beds");
  };

  const handleBathsClick = (event) => {
    event.stopPropagation();

    setShowBaths(true);
    setShowBeds(false);

    setSelectedBaths(event.target.innerText);
    setActiveButton("baths");
  };

  const handleShowPriceRange = (event) => {
    event.stopPropagation();
    setShowDataMessage(false);
    setShowInputField(false);
    setShowPriceRange(true);
    setActiveButton("priceRange");
  };

  const handleShowDataClick = (event) => {
    event.stopPropagation();
    setShowDataMessage(true);
    setShowPriceRange(false);
    setActiveButton("showData");
  };
  const handleResetProperty = () => {
    setSelectedPropertyType("Property Types");
  };
  const handleResetClickListprice = () => {
    setMinPrice("");
    setMaxPrice("");
    setMinPriceList("");
    setMaxPriceList("");
  };
  const handleResetClick = () => {
    setSelectedBeds("");
    setSelectedBaths("");
    setShowPriceRange(false);
    setShowDataMessage(false);
  };

  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <img className="brands_arrow" src={rightarrow} />,
    prevArrow: <img className="brands_arrow" src={leftarrow} />,
  };

  useEffect(() => {
    if (!filtersApplied) {
      axios
        .get(`/api/properties?page=${currentPage}`)
        .then((response) => {
          setloader(false);
          setProperties(response.data.properties);
          setCurrentPage(response.data.current_page);
          setTotalPages(response.data.total_pages);
          setLoading(false);
        })
        .catch((error) => {
          alert(error.message);
          setLoading(false);
        });
    } else {
      const token = localStorage.getItem("accessToken");
      axios
        .post(`/api/properties/filter?page=${currentPage}`, filterValue, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setloader(false);
          setProperties(response.data.properties);
          setCurrentPage(response.data.current_page);
          setTotalPages(response.data.total_pages);
        })
        .catch((error) => {
          alert(error.message);
          setLoading(false);
        });
    }
  }, [currentPage]);
  const handleSaveFiltersOffer = (property) => {
    setShowModalOffer(true);
    setModalData(property);
    // console.log("hndle save filter", property);
  };
  const handleSaveFilters = () => {
    setShowModal(true);
  };
  useEffect(() => {
    const offerSent = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get("/api/send-offer", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setSavedOfferSent(response.data);
        // setSavedProperties(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching saved properties:", error);
        setLoading(false);
      }
    };

    offerSent();
  }, []);
  useEffect(() => {
    const fetchSavedProperties = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get("/api/saved-lists", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSavedProperties(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching saved properties:", error);
        setLoading(false);
      }
    };

    fetchSavedProperties();
  }, []);

  const handleHeartClick = async (propertyId, address) => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await axios.post(
        "/api/saved-lists",
        {
          property_id: propertyId,
          property_address: address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Property added to saved");
      setSavedProperties((prevProperties) => [
        ...prevProperties,
        response.data,
      ]);
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };
  const handleFillHeartClick = async (propertyId) => {
    try {
      await axios.delete(`/api/saved-lists/${propertyId}`);
      toast.success("Property Unsaved successfully");

      const updatedSavedProperties = savedProperties.filter(
        (property) => property.id !== propertyId
      );
      setSavedProperties(updatedSavedProperties);
    } catch (error) {
      console.error("Failed to delete property ID", error);
      toast.error("Failed to delete property ID");
    }
  };
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
          <div className="dashboard-main-container">
            <p className="dashboard-text">Dashboard</p>
            <div className="filter-main-container">
              <div className="search-main-container">
                <img className="search-icon" src={search} alt="search" />
                <input
                  placeholder="Address, city, county, state, zip code or APN "
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div class="dropdown">
                <div
                  class="dropdown-toggle filter-types-main-container"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {selectedleadtype}
                </div>
                <ul class="dropdown-menu">
                  <li>
                    <a
                      className="dropdown-item dropdown_css"
                      onClick={() => handlePropertySelect("Absentee Owners")}
                    >
                      Absentee Owners
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item dropdown_css"
                      onClick={() => handlePropertySelect("Adjustable Loans")}
                    >
                      Adjustable Loans
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item dropdown_css"
                      onClick={() => handlePropertySelect("Auctions")}
                    >
                      Auctions
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item dropdown_css"
                      onClick={() => handlePropertySelect(" Bank Owned (REOs)")}
                    >
                      Bank Owned (REOs)
                    </a>
                  </li>
                  <li>
                    <a
                      class="dropdown-item dropdown_css"
                      onClick={() => handlePropertySelect("Cash buyers")}
                    >
                      Cash buyers
                    </a>
                  </li>
                  <li>
                    <a
                      class="dropdown-item dropdown_css"
                      onClick={() => handlePropertySelect("Empty Nesters")}
                    >
                      Empty Nesters
                    </a>
                  </li>
                  <li>
                    <a
                      class="dropdown-item dropdown_css"
                      onClick={() => handlePropertySelect("Flipped Properties")}
                    >
                      Flipped Properties
                    </a>
                  </li>
                  <li>
                    <a
                      class="dropdown-item dropdown_css"
                      onClick={() => handlePropertySelect("Free & Clear")}
                    >
                      Free & Clear
                    </a>
                  </li>
                  <li>
                    <a
                      class="dropdown-item dropdown_css"
                      onClick={() => handlePropertySelect("High Equity")}
                    >
                      High Equity
                    </a>
                  </li>
                  <li>
                    <a
                      class="dropdown-item dropdown_css"
                      onClick={() => handlePropertySelect("Low Equity")}
                    >
                      Low Equity
                    </a>
                  </li>
                  <li>
                    <a
                      class="dropdown-item dropdown_css"
                      onClick={() =>
                        handlePropertySelect("IntraFamily Transfers")
                      }
                    >
                      IntraFamily Transfers
                    </a>
                  </li>
                  <li>
                    <a
                      class="dropdown-item dropdown_css"
                      onClick={() => handlePropertySelect("MLS Active")}
                    >
                      MLS Active
                    </a>
                  </li>
                  <li>
                    <a
                      class="dropdown-item dropdown_css"
                      onClick={() => handlePropertySelect("MLS Pending")}
                    >
                      MLS Pending
                    </a>
                  </li>
                  <li>
                    <a
                      class="dropdown-item dropdown_css"
                      onClick={() => handlePropertySelect("MLS Sold")}
                    >
                      MLS Sold
                    </a>
                  </li>
                  <li>
                    <a
                      class="dropdown-item dropdown_css"
                      onClick={() => handlePropertySelect("MLS Withdrawn")}
                    >
                      MLS Withdrawn
                    </a>
                  </li>
                  <li>
                    <a
                      class="dropdown-item dropdown_css"
                      onClick={() =>
                        handlePropertySelect("Out-of-state Owners")
                      }
                    >
                      Out-of-state Owners
                    </a>
                  </li>
                  <li>
                    <a
                      class="dropdown-item dropdown_css"
                      onClick={() => handlePropertySelect("Preforeclosures")}
                    >
                      Preforeclosures
                    </a>
                  </li>
                  <li>
                    <a
                      class="dropdown-item dropdown_css"
                      onClick={() => handlePropertySelect("Probates")}
                    >
                      Probates
                    </a>
                  </li>
                  <li>
                    <a
                      class="dropdown-item dropdown_css"
                      onClick={() => handlePropertySelect("Tired Landlords")}
                    >
                      Tired Landlords
                    </a>
                  </li>
                  <li>
                    <a
                      class="dropdown-item dropdown_css"
                      onClick={() => handlePropertySelect(" Vacant Homes")}
                    >
                      Vacant Homes
                    </a>
                  </li>
                  <li>
                    <a
                      class="dropdown-item dropdown_css"
                      onClick={() => handlePropertySelect("Vacant Lords")}
                    >
                      Vacant Lords
                    </a>
                  </li>
                  <li>
                    <a
                      class="dropdown-item dropdown_css"
                      onClick={() => handlePropertySelect("Zombie Properties")}
                    >
                      Zombie Properties
                    </a>
                  </li>
                  <li className="reset-all">
                    <button
                      class="dropdown-item btn-reset"
                      type="button"
                      id="resetButton"
                      onClick={() => handlePropertySelect("Lead Types")}
                    >
                      Reset
                    </button>
                  </li>
                </ul>
              </div>
              <div class="dropdown">
                <div
                  class="dropdown-toggle filter-types-main-container"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {selectedPropertytype}
                </div>
                <ul class="dropdown-menu property-type-dropdown">
                  <li>
                    <a
                      class="dropdown-item dropdown_css"
                      onClick={() => handlePropertySelet("Single-Family Homes")}
                    >
                      Single-Family Homes
                    </a>
                  </li>
                  <li>
                    <a
                      class="dropdown-item dropdown_css"
                      onClick={() => handlePropertySelet("Condos-Town Houses")}
                    >
                      Condos-Town Houses
                    </a>
                  </li>
                  <li>
                    <a
                      class="dropdown-item dropdown_css"
                      onClick={() => handlePropertySelet("Mobile Homes")}
                    >
                      Mobile Homes
                    </a>
                  </li>
                  <li>
                    <a
                      class="dropdown-item dropdown_css"
                      onClick={() => handlePropertySelet("Multi-Family (2-4)")}
                    >
                      Multi-Family (2-4)
                    </a>
                  </li>
                  <li>
                    <a
                      class="dropdown-item dropdown_css"
                      onClick={() => handlePropertySelet("Multi-Family (5+)")}
                    >
                      Multi-Family (5+)
                    </a>
                  </li>
                  <li>
                    <a
                      class="dropdown-item dropdown_css"
                      onClick={() => handlePropertySelet("Land")}
                    >
                      Land
                    </a>
                  </li>
                  <li>
                    <a
                      class="dropdown-item dropdown_css"
                      onClick={() => handlePropertySelet("Condos")}
                    >
                      Condos
                    </a>
                  </li>
                  <li>
                    <a
                      class="dropdown-item dropdown_css"
                      onClick={() => handlePropertySelet("Townhouses")}
                    >
                      Townhouses
                    </a>
                  </li>
                  <li className="reset-all-property-type">
                    <button
                      class="dropdown-item btn-reset"
                      type="button"
                      id="resetButton"
                      onClick={handleResetProperty}
                    >
                      Reset
                    </button>
                  </li>
                </ul>
              </div>
              <div className="dropdown">
                <div
                  className="dropdown-toggle filter-types-main-container"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Price
                </div>
                <ul className="dropdown-menu bed-bath-hei">
                  <li>
                    <div className="d-flex justify-content-between btn-price-range-both">
                      <button
                        className={`dropdown-item btn-price-range ${
                          activeButton === "priceRange" ? "active" : ""
                        }`}
                        type="button"
                        onClick={handleShowPriceRange}
                      >
                        <span className="">Estimated Value</span>
                      </button>
                      <button
                        className={`dropdown-item btn-show-data ${
                          activeButton === "showData" ? "active" : ""
                        }`}
                        type="button"
                        onClick={handleShowDataClick}
                      >
                        <span>List Price</span>
                      </button>
                    </div>
                  </li>
                  {showPriceRange && (
                    <li className="price-range-section1">
                      <span>Estimated Value</span>
                      <div className="d-flex justify-content-between">
                        <input
                          type="text"
                          placeholder="$2000"
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                          className="input_css"
                        />
                        <hr className="vertical-divider" />
                        <input
                          type="text"
                          placeholder="$2000"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          className="input_css"
                        />
                      </div>
                    </li>
                  )}

                  {showDataMessage && (
                    <li className="price-range-section1">
                      <span>List Price</span>
                      <div className="d-flex justify-content-between">
                        <input
                          type="text"
                          placeholder="$2000"
                          value={minPriceList}
                          onChange={(e) => setMinPriceList(e.target.value)}
                          className="input_css"
                        />
                        <hr className="vertical-divider" />
                        <input
                          type="text"
                          placeholder="$2000"
                          value={maxPriceList}
                          onChange={(e) => setMaxPriceList(e.target.value)}
                          className="input_css"
                        />
                      </div>
                    </li>
                  )}
                  <li>
                    <button
                      className="dropdown-item btn-reset"
                      type="button"
                      id="resetPriceButton"
                      onClick={handleResetClickListprice}
                    >
                      Reset
                    </button>
                  </li>
                </ul>
              </div>

              <div className="dropdown">
                <div
                  className="dropdown-toggle filter-types-main-container"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Beds/Baths
                </div>
                <ul className="dropdown-menu bed-bath-hei">
                  <li>
                    <div className="d-flex justify-content-between btn-price-range-both">
                      <button
                        className={`dropdown-item btn-price-range ${
                          activeButton === "beds" ? "active" : ""
                        }`}
                        type="button"
                        onClick={handleBedsClick}
                      >
                        No. of Bedrooms
                      </button>
                      <button
                        className={`dropdown-item btn-show-data ${
                          activeButton === "baths" ? "active" : ""
                        }`}
                        type="button"
                        onClick={handleBathsClick}
                      >
                        No. of Bathrooms
                      </button>
                    </div>
                  </li>
                  {showBeds && (
                    <li className="price-range-section1">
                      <p>Bedrooms</p>
                      <div className="d-flex justify-content-between bed-bath_back">
                        {["Any", "1", "2", "3+", "4+", "5+"].map((bed) => (
                          <button
                            key={bed}
                            className={`btn-bed ${
                              selectedBeds === bed ? "selected" : ""
                            }`}
                            onClick={handleBedsClick}
                          >
                            {bed}
                          </button>
                        ))}
                      </div>
                      <button
                        className="dropdown-item btn-reset_bath-bed"
                        type="button"
                        id="resetPriceButton"
                        onClick={handleResetClick}
                      >
                        Reset
                      </button>
                    </li>
                  )}

                  {showBaths && (
                    <li className="price-range-section1">
                      <p>Bathrooms</p>
                      <div className="d-flex justify-content-between bed-bath_back">
                        {["Any", "1", "2", "3+", "4+", "5+"].map((bath) => (
                          <button
                            key={bath}
                            className={`btn-bed ${
                              selectedBaths === bath ? "selected" : ""
                            }`}
                            onClick={handleBathsClick}
                          >
                            {bath}
                          </button>
                        ))}
                      </div>
                      <button
                        className="dropdown-item btn-reset_bath-bed"
                        type="button"
                        id="resetPriceButton"
                        onClick={handleResetClick}
                      >
                        Reset
                      </button>
                    </li>
                  )}
                </ul>
              </div>

              <div className="dropdown">
                <div
                  className="dropdown-toggle filter-types-main-container"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img className="filter-icon" src={filter} alt="filter" />
                  More Filters
                </div>
                <ul
                  className="dropdown-menu more-filter-width p-3"
                  onClick={handleDropdownClick}
                >
                  <div className="accordion" id="accordionExample">
                    <div className="accordion-item accordian_border1">
                      <h2 className="accordion-header" id="heading1">
                        <button
                          className="accordion-button accordian_border collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapse1"
                          aria-expanded="false"
                          aria-controls="collapse1"
                        >
                          Property Filter
                        </button>
                      </h2>
                      <div
                        id="collapse1"
                        className="accordion-collapse collapse"
                        aria-labelledby="heading1"
                        data-bs-parent="#accordionExample"
                      >
                        <div className="accordion-body">
                          <form>
                            <div className="row">
                              <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Number of stories
                                </label>
                                <div className="d-flex">
                                  <input
                                    type="number"
                                    inputMode="numeric"
                                    className="form-control"
                                    placeholder="Min"
                                    value={minStories}
                                    onChange={(e) =>
                                      setMinStories(e.target.value)
                                    }
                                  />
                                  <span
                                    className="p-2"
                                    STYLE="font-size:17.0pt"
                                  >
                                    {" "}
                                    -{" "}
                                  </span>
                                  <input
                                    type="number"
                                    inputMode="numeric"
                                    className="form-control"
                                    placeholder="Max"
                                    value={maxStories}
                                    onChange={(e) =>
                                      setMaxStories(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Building size(Sq.ft.)
                                </label>
                                <div className="d-flex">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Min"
                                    value={minBuildingSize}
                                    onChange={(e) =>
                                      setMinBuildingSize(e.target.value)
                                    }
                                  />
                                  <span
                                    className="p-2"
                                    STYLE="font-size:17.0pt"
                                  >
                                    {" "}
                                    -{" "}
                                  </span>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Max"
                                    value={maxBuildingSize}
                                    onChange={(e) =>
                                      setMaxBuildingSize(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="row mt-3">
                              <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Lot Size
                                </label>
                                <div className="d-flex">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Min"
                                    value={minLotSize}
                                    onChange={(e) =>
                                      setMinLotSize(e.target.value)
                                    }
                                  />
                                  <span
                                    className="p-2"
                                    STYLE="font-size:17.0pt"
                                  >
                                    {" "}
                                    -{" "}
                                  </span>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Max"
                                    value={maxLotSize}
                                    onChange={(e) =>
                                      setMaxLotSize(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Year Built (YYYY)
                                </label>
                                <div className="d-flex">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Min"
                                    value={minYearBuilt}
                                    onChange={(e) =>
                                      setMinYearBuilt(e.target.value)
                                    }
                                  />
                                  <span
                                    className="p-2"
                                    STYLE="font-size:17.0pt"
                                  >
                                    {" "}
                                    -{" "}
                                  </span>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Max"
                                    value={maxYearBuilt}
                                    onChange={(e) =>
                                      setMaxYearBuilt(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Occupancy Status
                                </label>
                                <div className="d-flex align-items-center justify-content-around">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="occupiedCheckbox"
                                    onChange={() =>
                                      handleOccupancyChange("Occupied")
                                    }
                                    checked={occupancyStatus.includes(
                                      "Occupied"
                                    )}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="minCheckbox"
                                  >
                                    Occupied
                                  </label>

                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="vacantCheckbox"
                                    onChange={() =>
                                      handleOccupancyChange("Vacant")
                                    }
                                    checked={occupancyStatus.includes("Vacant")}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="maxCheckbox"
                                  >
                                    vacant
                                  </label>
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="anyCheckbox"
                                    onChange={() =>
                                      handleOccupancyChange("Any")
                                    }
                                    checked={occupancyStatus.includes("Any")}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="maxCheckbox"
                                  >
                                    Any
                                  </label>
                                </div>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>

                    <div className="accordion-item accordian_border">
                      <h2 className="accordion-header" id="heading2">
                        <button
                          className="accordion-button accordian_border collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapse2"
                          aria-expanded="false"
                          aria-controls="collapse2"
                        >
                          Owner Filter
                        </button>
                      </h2>
                      <div
                        id="collapse2"
                        className="accordion-collapse collapse"
                        aria-labelledby="heading2"
                        data-bs-parent="#accordionExample"
                      >
                        <div className="accordion-body">
                          <form>
                            <div className="row">
                              <div className="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Owner Occupied?
                                </label>
                                <div className="align-items-center justify-content-around">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="yesYwnerOccupiedCheckbox"
                                    onChange={() =>
                                      handleOccupancyChange("yesOwner_occupied")
                                    }
                                    checked={occupancyStatus.includes(
                                      "yesOwner_occupied"
                                    )}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="minCheckbox"
                                  >
                                    Yes
                                  </label>
                                  <div>
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      id="noOwnerCheckbox"
                                      onChange={() =>
                                        handleOccupancyChange("noOwner")
                                      }
                                      checked={occupancyStatus.includes(
                                        "noOwner"
                                      )}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="maxCheckbox"
                                    >
                                      No
                                    </label>
                                  </div>
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="anyOwnerCheckbox"
                                    onChange={() =>
                                      handleOccupancyChange("anyOwnerOccupied")
                                    }
                                    checked={occupancyStatus.includes(
                                      "anyOwnerOccupied"
                                    )}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="maxCheckbox"
                                  >
                                    Any
                                  </label>
                                </div>
                              </div>
                              <div className="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Absentee Location
                                </label>
                                <div className="align-items-center justify-content-around">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="inState"
                                    onChange={() =>
                                      handleOccupancyChange("inState")
                                    }
                                    checked={occupancyStatus.includes(
                                      "inState"
                                    )}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="minCheckbox"
                                  >
                                    In-State
                                  </label>
                                  <div>
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      id="outstateCheckbox"
                                      onChange={() =>
                                        handleOccupancyChange("outState")
                                      }
                                      checked={occupancyStatus.includes(
                                        "outState"
                                      )}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="maxCheckbox"
                                    >
                                      Out-of-State
                                    </label>
                                  </div>
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="anyabsenteeCheckbox"
                                    onChange={() =>
                                      handleOccupancyChange("Anyabsentee")
                                    }
                                    checked={occupancyStatus.includes(
                                      "Anyabsentee"
                                    )}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="maxCheckbox"
                                  >
                                    Any
                                  </label>
                                </div>
                              </div>
                              <div className="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Owner Type
                                </label>
                                <div className="align-items-center justify-content-around">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="individualCheckbox"
                                    onChange={() =>
                                      handleOccupancyChange("Individual")
                                    }
                                    checked={occupancyStatus.includes(
                                      "Individual"
                                    )}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="minCheckbox"
                                  >
                                    Individual
                                  </label>
                                  <div>
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      id="businessCheckbox"
                                      onChange={() =>
                                        handleOccupancyChange("Business")
                                      }
                                      checked={occupancyStatus.includes(
                                        "Business"
                                      )}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="maxCheckbox"
                                    >
                                      Business
                                    </label>
                                  </div>
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="bankTrustCheckbox"
                                    onChange={() =>
                                      handleOccupancyChange("BankTrust")
                                    }
                                    checked={occupancyStatus.includes(
                                      "BankTrust"
                                    )}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="maxCheckbox"
                                  >
                                    Bank or Trust
                                  </label>
                                </div>
                              </div>
                              <div className="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Cash Buyer?
                                </label>
                                <div className="align-items-center justify-content-around">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="yesCashBuyerCheckbox"
                                    onChange={() =>
                                      handleOccupancyChange("YesCashBuyer")
                                    }
                                    checked={occupancyStatus.includes(
                                      "YesCashBuyer"
                                    )}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="minCheckbox"
                                  >
                                    Yes
                                  </label>
                                  <div>
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      id="noCashBuyerCheckbox"
                                      onChange={() =>
                                        handleOccupancyChange("NoCashBuyer")
                                      }
                                      checked={occupancyStatus.includes(
                                        "NoCashBuyer"
                                      )}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="maxCheckbox"
                                    >
                                      No
                                    </label>
                                  </div>
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="anyCashBuyerCheckbox"
                                    onChange={() =>
                                      handleOccupancyChange("AnyCashBuyer")
                                    }
                                    checked={occupancyStatus.includes(
                                      "AnyCashBuyer"
                                    )}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="maxCheckbox"
                                  >
                                    Any
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div className="row mt-3">
                              <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Years of Ownership
                                </label>
                                <div className="d-flex">
                                  <input
                                    type="number"
                                    inputMode="numeric"
                                    className="form-control"
                                    placeholder="Min"
                                    value={minYearOwner}
                                    onChange={(e) =>
                                      setMinYearOwner(e.target.value)
                                    }
                                  />
                                  <span
                                    className="p-2"
                                    STYLE="font-size:17.0pt"
                                  >
                                    {" "}
                                    -{" "}
                                  </span>
                                  <input
                                    type="number"
                                    inputMode="numeric"
                                    className="form-control"
                                    placeholder="Max"
                                    value={maxYearOwner}
                                    onChange={(e) =>
                                      setMaxYearOwner(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Tax Delinquent Year (YYYY)
                                </label>
                                <div className="d-flex">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Min"
                                    value={minTaxDelinquent}
                                    onChange={(e) =>
                                      setMinTaxDelinquent(e.target.value)
                                    }
                                  />
                                  <span
                                    className="p-2"
                                    STYLE="font-size:17.0pt"
                                  >
                                    {" "}
                                    -{" "}
                                  </span>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Max"
                                    value={maxTaxDelinquent}
                                    onChange={(e) =>
                                      setMaxTaxDelinquent(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="row mt-3">
                              <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Properties Owned
                                </label>
                                <div className="d-flex">
                                  <input
                                    type="number"
                                    inputMode="numeric"
                                    className="form-control"
                                    placeholder="Min"
                                    value={minPropertyOwned}
                                    onChange={(e) =>
                                      setMinPropertyOwned(e.target.value)
                                    }
                                  />
                                  <span
                                    className="p-2"
                                    STYLE="font-size:17.0pt"
                                  >
                                    {" "}
                                    -{" "}
                                  </span>
                                  <input
                                    type="number"
                                    inputMode="numeric"
                                    className="form-control"
                                    placeholder="Max"
                                    value={maxPropertyOwned}
                                    onChange={(e) =>
                                      setMaxPropertyOwned(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Portfolio Value
                                </label>
                                <div className="d-flex">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="$ Min"
                                    value={minPortfolioValue}
                                    onChange={(e) =>
                                      setMinPortfolioValue(e.target.value)
                                    }
                                  />
                                  <span
                                    className="p-2"
                                    STYLE="font-size:17.0pt"
                                  >
                                    {" "}
                                    -{" "}
                                  </span>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="$ Max"
                                    value={maxPortfolioValue}
                                    onChange={(e) =>
                                      setMaxPortfolioValue(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>

                    {/* Dropdown item 3 */}
                    <div className="accordion-item accordian_border">
                      <h2 className="accordion-header" id="heading3">
                        <button
                          className="accordion-button accordian_border collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapse3"
                          aria-expanded="false"
                          aria-controls="collapse3"
                        >
                          Financial Filter
                        </button>
                      </h2>
                      <div
                        id="collapse3"
                        className="accordion-collapse collapse"
                        aria-labelledby="heading3"
                        data-bs-parent="#accordionExample"
                      >
                        <div className="accordion-body">
                          <form>
                            <div className="row">
                              <div className="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Private Lender?
                                </label>
                                <div className="d-flex  justify-content-around">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="yesPrivatelenderCheckbox"
                                    onChange={() =>
                                      handleOccupancyChange("yesPrivate_lender")
                                    }
                                    checked={occupancyStatus.includes(
                                      "yesPrivate_lender"
                                    )}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="minCheckbox"
                                  >
                                    Yes
                                  </label>

                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="noPrivatelenderCheckbox"
                                    onChange={() =>
                                      handleOccupancyChange("noPrivate_lender")
                                    }
                                    checked={occupancyStatus.includes(
                                      "noPrivate_lender"
                                    )}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="maxCheckbox"
                                  >
                                    No
                                  </label>

                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="anyPrivatelenderCheckbox"
                                    onChange={() =>
                                      handleOccupancyChange("anyPrivate_lender")
                                    }
                                    checked={occupancyStatus.includes(
                                      "anyPrivate_lender"
                                    )}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="maxCheckbox"
                                  >
                                    Any
                                  </label>
                                </div>
                              </div>
                              <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Estimated Value
                                </label>
                                <div className="d-flex">
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    className="form-control"
                                    placeholder="Min"
                                    value={minEstimatedValue}
                                    onChange={(e) =>
                                      setMinEstimatedValue(e.target.value)
                                    }
                                  />
                                  <span
                                    className="p-2"
                                    STYLE="font-size:17.0pt"
                                  >
                                    {" "}
                                    -{" "}
                                  </span>
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    className="form-control"
                                    placeholder="Max"
                                    value={maxEstimatedValue}
                                    onChange={(e) =>
                                      setMaxEstimatedValue(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Estimated Equity
                                </label>
                                <div className="d-flex">
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    className="form-control"
                                    placeholder="Min"
                                    value={minEstimatedEquity}
                                    onChange={(e) =>
                                      setMinEstimatedEquity(e.target.value)
                                    }
                                  />
                                  <span
                                    className="p-2"
                                    STYLE="font-size:17.0pt"
                                  >
                                    {" "}
                                    -{" "}
                                  </span>
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    className="form-control"
                                    placeholder="Max"
                                    value={maxEstimatedEquity}
                                    onChange={(e) =>
                                      setMaxEstimatedEquity(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="row mt-3">
                              <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Assessed Total Value
                                </label>
                                <div className="d-flex">
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    className="form-control"
                                    placeholder="Min"
                                    value={minAssessedTotValue}
                                    onChange={(e) =>
                                      setMinAssessedTotValue(e.target.value)
                                    }
                                  />
                                  <span
                                    className="p-2"
                                    STYLE="font-size:17.0pt"
                                  >
                                    {" "}
                                    -{" "}
                                  </span>
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    className="form-control"
                                    placeholder="Max"
                                    value={maxAssessedTotValue}
                                    onChange={(e) =>
                                      setMaxAssessedTotValue(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Assessed Land Value
                                </label>
                                <div className="d-flex">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Min"
                                    value={minAssessedLandValue}
                                    onChange={(e) =>
                                      setMinAssessedLandValue(e.target.value)
                                    }
                                  />
                                  <span
                                    className="p-2"
                                    STYLE="font-size:17.0pt"
                                  >
                                    {" "}
                                    -{" "}
                                  </span>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Max"
                                    value={maxAssessedLandValue}
                                    onChange={(e) =>
                                      setMaxAssessedLandValue(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Assessed Improvement Value
                                </label>
                                <div className="d-flex">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Min"
                                    value={minAssessedImpValue}
                                    onChange={(e) =>
                                      setMinAssessedImpValue(e.target.value)
                                    }
                                  />
                                  <span
                                    className="p-2"
                                    STYLE="font-size:17.0pt"
                                  >
                                    {" "}
                                    -{" "}
                                  </span>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Max"
                                    value={maxAssessedImpValue}
                                    onChange={(e) =>
                                      setMaxAssessedImpValue(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="row mt-3">
                              <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Last Sale Price
                                </label>
                                <div className="d-flex">
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    className="form-control"
                                    placeholder="Min"
                                    value={minLastSalePrice}
                                    onChange={(e) =>
                                      setMinLastSalePrice(e.target.value)
                                    }
                                  />
                                  <span
                                    className="p-2"
                                    STYLE="font-size:17.0pt"
                                  >
                                    {" "}
                                    -{" "}
                                  </span>
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    className="form-control"
                                    placeholder="Max"
                                    value={maxLastSalePrice}
                                    onChange={(e) =>
                                      setMaxLastSalePrice(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Last Sale Date
                                </label>
                                <div className="d-flex">
                                  <input
                                    type="date"
                                    className="form-control"
                                    placeholder="$ Min"
                                    value={minLastSaleDate}
                                    onChange={(e) =>
                                      setMinLastSaleDate(e.target.value)
                                    }
                                  />
                                  <span
                                    className="p-2"
                                    STYLE="font-size:17.0pt"
                                  >
                                    {" "}
                                    -{" "}
                                  </span>
                                  <input
                                    type="date"
                                    className="form-control"
                                    placeholder="$ Max"
                                    value={maxLastSaleDate}
                                    onChange={(e) =>
                                      setMaxLastSaleDate(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>

                    {/* Dropdown item 4 */}
                    <div className="accordion-item accordian_border">
                      <h2 className="accordion-header" id="heading4">
                        <button
                          className="accordion-button accordian_border collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapse4"
                          aria-expanded="false"
                          aria-controls="collapse4"
                        >
                          Foreclosure Filter
                        </button>
                      </h2>
                      <div
                        id="collapse4"
                        className="accordion-collapse collapse"
                        aria-labelledby="heading4"
                        data-bs-parent="#accordionExample"
                      >
                        <div className="accordion-body">
                          <form>
                            <div className="row">
                              <div className="col-xl-6 col-lg-12 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Recording Date (Preforeclosure)
                                </label>
                                <div className="d-flex">
                                  <input
                                    type="date"
                                    inputMode="numeric"
                                    className="form-control"
                                    placeholder="Min"
                                    value={minRecDate}
                                    onChange={(e) =>
                                      setMinRecDate(e.target.value)
                                    }
                                  />
                                  <span
                                    className="p-2"
                                    STYLE="font-size:17.0pt"
                                  >
                                    {" "}
                                    -{" "}
                                  </span>
                                  <input
                                    type="date"
                                    inputMode="numeric"
                                    className="form-control"
                                    placeholder="Max"
                                    value={maxRecDate}
                                    onChange={(e) =>
                                      setMaxRecDate(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-xl-6 col-lg-12 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  Auction Date
                                </label>
                                <div className="d-flex">
                                  <input
                                    type="date"
                                    className="form-control"
                                    placeholder="Min"
                                    value={minAuctionDate}
                                    onChange={(e) =>
                                      setMinAuctionDate(e.target.value)
                                    }
                                  />
                                  <span
                                    className="p-2"
                                    STYLE="font-size:17.0pt"
                                  >
                                    {" "}
                                    -{" "}
                                  </span>
                                  <input
                                    type="date"
                                    className="form-control"
                                    placeholder="Max"
                                    value={maxAuctionDate}
                                    onChange={(e) =>
                                      setMaxAuctionDate(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="row mt-3">
                              <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-">
                                <label className="form-label property_filter_head">
                                  REO Date
                                </label>
                                <div className="d-flex">
                                  <select
                                    className="w-100  form-control"
                                    value={mlsforeclousureSelect}
                                    onChange={(e) =>
                                      setMlsforeclousureSelect(e.target.value)
                                    }
                                  >
                                    <option value="Select">Select</option>
                                    <option value="">Within past month</option>
                                    <option value="">
                                      Within past 2 months
                                    </option>
                                    <option value="">
                                      Within past 3 months
                                    </option>
                                    <option value="">
                                      Within past 6 months
                                    </option>
                                    <option value="">Within past years</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>

                    {/* Dropdown item 5 */}
                    <div className="accordion-item accordian_border">
                      <h2 className="accordion-header" id="heading5">
                        <button
                          className="accordion-button accordian_border collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapse5"
                          aria-expanded="false"
                          aria-controls="collapse5"
                        >
                          MLS Filter
                        </button>
                      </h2>
                      <div
                        id="collapse5"
                        className="accordion-collapse collapse"
                        aria-labelledby="heading5"
                        data-bs-parent="#accordionExample"
                      >
                        <div className="accordion-body">
                          <form>
                            <div className="row">
                              <div className="col-xl-5 col-lg-6 col-md-12 col-12 mt-3">
                                <div>
                                  <label className="form-label property_filter_head">
                                    MLS Status
                                  </label>
                                  <div className="d-flex">
                                    <select
                                      className="w-100  form-control"
                                      value={mlsStatus}
                                      onChange={(e) =>
                                        setMlsStatus(e.target.value)
                                      }
                                    >
                                      <option value="Select">Select</option>
                                      <option value="">Active</option>
                                      <option value="">Pending</option>
                                      <option value="">Sold</option>
                                      <option value="">Withdrawn</option>
                                    </select>
                                  </div>
                                </div>
                                <div>
                                  <label className="form-label property_filter_head">
                                    MLS Withdrwan Date
                                  </label>
                                  <div className="d-flex">
                                    <input
                                      type="date"
                                      inputMode="numeric"
                                      className="form-control"
                                      placeholder="Min"
                                      value={minWithDrawnDate}
                                      onChange={(e) =>
                                        setMinWithDrawnDate(e.target.value)
                                      }
                                    />
                                    <span
                                      className="p-2"
                                      STYLE="font-size:17.0pt"
                                    >
                                      {" "}
                                      -{" "}
                                    </span>
                                    <input
                                      type="date"
                                      inputMode="numeric"
                                      className="form-control"
                                      placeholder="Max"
                                      value={maxWithDrawnDate}
                                      onChange={(e) =>
                                        setMaxWithDrawnDate(e.target.value)
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                                  <label className="form-label property_filter_head">
                                    Has Photos?
                                  </label>
                                  <div className="d-flex align-items-center justify-content-around">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      id="yesMlsHasPhotosCheckbox"
                                      onChange={() =>
                                        handleOccupancyChange("yesMlsHasPhotos")
                                      }
                                      checked={occupancyStatus.includes(
                                        "yesMlsHasPhotos"
                                      )}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="minCheckbox"
                                    >
                                      Yes
                                    </label>

                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      id="noMlsHasPhotosCheckbox"
                                      onChange={() =>
                                        handleOccupancyChange("noMlsHasPhotos")
                                      }
                                      checked={occupancyStatus.includes(
                                        "noMlsHasPhotos"
                                      )}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="maxCheckbox"
                                    >
                                      No
                                    </label>
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      id="anyMlsHasPhotosCheckbox"
                                      onChange={() =>
                                        handleOccupancyChange("anyMlsHasPhotos")
                                      }
                                      checked={occupancyStatus.includes(
                                        "anyMlsHasPhotos"
                                      )}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="maxCheckbox"
                                    >
                                      Any
                                    </label>
                                  </div>
                                </div>
                              </div>
                              <div className="col-xl-4 col-lg-6 col-md-12 col-12 mt-3">
                                <div>
                                  <label className="form-label property_filter_head">
                                    Days on Market
                                  </label>
                                  <div className="d-flex">
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="Min"
                                      value={minDaysMarket}
                                      onChange={(e) =>
                                        setMinDaysMarket(e.target.value)
                                      }
                                    />
                                    <span
                                      className="p-2"
                                      STYLE="font-size:17.0pt"
                                    >
                                      {" "}
                                      -{" "}
                                    </span>
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="Max"
                                      value={maxDaysMarket}
                                      onChange={(e) =>
                                        setMaxDaysMarket(e.target.value)
                                      }
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="form-label property_filter_head">
                                    Listing Price
                                  </label>
                                  <div className="d-flex">
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="$ Min"
                                      value={minListingPrice}
                                      onChange={(e) =>
                                        setMinListingPrice(e.target.value)
                                      }
                                    />
                                    <span
                                      className="p-2"
                                      STYLE="font-size:17.0pt"
                                    >
                                      {" "}
                                      -{" "}
                                    </span>
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="$ Max"
                                      value={maxListingPrice}
                                      onChange={(e) =>
                                        setMaxListingPrice(e.target.value)
                                      }
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="col-xl-3 col-lg-6 col-md-12 col-12 mt-3 mls_back">
                                <label className="form-label property_filter_head">
                                  MLS keyword
                                </label>
                                <div className="align-items-center justify-content-around">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="mlsInvestorOwnedCheckbox"
                                    onChange={() =>
                                      handleOccupancyChange("mlsInvestorOwned")
                                    }
                                    checked={occupancyStatus.includes(
                                      "mlsInvestorOwned"
                                    )}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="minCheckbox"
                                  >
                                    Investor-Owned
                                  </label>
                                  <div>
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      id="mlsCreativeFinancingCheckbox"
                                      onChange={() =>
                                        handleOccupancyChange(
                                          "mlsCreativeFinancing"
                                        )
                                      }
                                      checked={occupancyStatus.includes(
                                        "mlsCreativeFinancing"
                                      )}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="maxCheckbox"
                                    >
                                      Creative Financing
                                    </label>
                                  </div>
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="mlsMotivatedSellerCheckbox"
                                    onChange={() =>
                                      handleOccupancyChange(
                                        "mlsMotivatedSellerOccupied"
                                      )
                                    }
                                    checked={occupancyStatus.includes(
                                      "mlsMotivatedSellerOccupied"
                                    )}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="maxCheckbox"
                                  >
                                    Motivated Seller
                                  </label>
                                </div>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <div className="d-flex w-100 mt-3">
                    <button className="btn btn-reset_morefilter me-2 w-100">
                      Reset
                    </button>
                    <button className="btn btn-saveexit_morefilter  w-100">
                      Save/Exit
                    </button>
                  </div> */}
                </ul>
              </div>
              <div className="save-filter" onClick={handleSubmit}>
                {" "}
                {loadingSearch ? (
                  <CircularProgress size={20} sx={{ color: "white" }} />
                ) : (
                  "Search"
                )}
              </div>
              <div className="save-filter" onClick={handleSaveFilters}>
                {" "}
                {loadingSave ? (
                  <CircularProgress size={20} sx={{ color: "white" }} />
                ) : (
                  "Save Filter"
                )}
              </div>
              <Modal
                show={showModal}
                onHide={handleClose}
                centered
                size="md"
                dialogClassName="right-side-modal"
              >
                <Modal.Header closeButton>
                  <Modal.Title>
                    <p className="send-heading">Save Filter</p>
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="row mt-3">
                    <div className="col-12">
                      <p className="input-head">Write Filter name</p>
                      <input
                        className="send-input"
                        name="filterName"
                        required
                        value={formData.filterName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="send-offer-btn" onClick={handleSaveFilter}>
                    {loadingSave ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      "Save Filter"
                    )}
                  </div>
                </Modal.Body>
              </Modal>
              <Modal
                show={showModalOffer}
                onHide={handleClose}
                centered
                size="md"
                dialogClassName="right-side-modal"
              >
                <Modal.Header closeButton>
                  <Modal.Title>
                    <p className="send-heading">Send single offer</p>
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <p className="send-address-text">
                    {modalData && `${modalData.location}`}
                  </p>
                  <div className="row mt-5">
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                      <p className="input-head">Offer Expiration Date*</p>
                      <input
                        className="send-input"
                        name="expirationDate"
                        value={formDataOffer.expirationDate}
                        onChange={handleChangeOffer}
                      />
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                      <p className="input-head">Closing Date*</p>
                      <input
                        className="send-input"
                        name="closingDate"
                        value={formDataOffer.closingDate}
                        onChange={handleChangeOffer}
                      />
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                      <p className="input-head">Offer Amounts $ (Optional)</p>
                      <input
                        className="send-input"
                        name="offerAmount"
                        value={formDataOffer.offerAmount}
                        onChange={handleChangeOffer}
                      />
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                      <p className="input-head">% Of List Price (Optional)</p>
                      <input
                        className="send-input"
                        name="listPricePercentage"
                        value={formDataOffer.listPricePercentage}
                        onChange={handleChangeOffer}
                      />
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                      <p className="input-head">Escrow Deposit*</p>
                      <input
                        className="send-input"
                        name="escrowDeposit"
                        value={formDataOffer.escrowDeposit}
                        onChange={handleChangeOffer}
                      />
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                      <p className="input-head">Inspection Period*</p>
                      <input
                        className="send-input"
                        name="inspectionPeriod"
                        value={formDataOffer.inspectionPeriod}
                        onChange={handleChangeOffer}
                      />
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                      <p className="input-head">
                        Other Person Property Item Included (Optional)
                      </p>
                      <input
                        className="send-input"
                        name="otherItems"
                        value={formDataOffer.otherItems}
                        onChange={handleChangeOffer}
                      />
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-12">
                      <p className="input-head">Terms (Optional)</p>
                      <textarea
                        className="send-textarea"
                        name="terms"
                        value={formDataOffer.terms}
                        onChange={handleChangeOffer}
                        rows={5}
                      />
                    </div>
                  </div>
                  <div
                    className="send-offer-btn"
                    onClick={() => handleSaveFilterOffer(modalData)}
                  >
                    {loading ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      "Send Offer"
                    )}
                  </div>
                </Modal.Body>
              </Modal>
            </div>
            <div className="d-flex">
              <div className="dropdown">
                <div
                  className="dropdown-toggle saved-main-container"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    className="save-heart-icon"
                    src={saveheart}
                    alt="saveheart"
                  />
                  Saved
                </div>

                <ul className="dropdown-menu saved-dropmenu">
                  <>
                    <li className="dropdown-item">
                      <div className="accordion" id="savedPropertiesAccordion">
                        <div className="accordion-item">
                          <h2
                            className="accordion-header"
                            id="headingFavorites"
                          >
                            <button
                              className="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#collapseFavorites"
                              aria-expanded="false"
                              aria-controls="collapseFavorites"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              Favorites
                            </button>
                          </h2>
                          <div
                            id="collapseFavorites"
                            className="accordion-collapse collapse"
                            aria-labelledby="headingFavorites"
                            data-bs-parent="#savedPropertiesAccordion"
                          >
                            <div className="accordion-body">
                              {savedProperties.length > 0 ? (
                                savedProperties.map((savedProperty) => (
                                  <div
                                    key={savedProperty.id}
                                    className="content_overflow"
                                  >
                                    <Link
                                      to={`/dashboard/property-detail/${savedProperty.property_id}`}
                                      className="text-underline"
                                    >
                                      {savedProperty.property_address}
                                    </Link>
                                  </div>
                                ))
                              ) : (
                                <div>No saved properties</div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>

                    <li className="dropdown-item">
                      <div
                        className="accordion"
                        id="savedPropertiesAccordionFilter1"
                      >
                        <div className="accordion-item">
                          <h2 className="accordion-header" id="headingFilter1">
                            <button
                              className="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#collapseFilter1"
                              aria-expanded="false"
                              aria-controls="collapseFilter1"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              Offer Sent
                            </button>
                          </h2>
                          <div
                            id="collapseFilter1"
                            className="accordion-collapse collapse"
                            aria-labelledby="headingFilter1"
                            data-bs-parent="#savedPropertiesAccordionFilter1"
                          >
                            <div className="accordion-body">
                              {savedOfferSent.length > 0 ? (
                                savedOfferSent.map((savedPropertyOffer) => (
                                  <div
                                    key={savedPropertyOffer.id}
                                    className="content_overflow"
                                  >
                                    <Link
                                      to={`/dashboard/property-detail/${savedPropertyOffer.property_id}`}
                                      className="text-underline"
                                    >
                                      {savedPropertyOffer.property_address}
                                    </Link>
                                  </div>
                                ))
                              ) : (
                                <div>No Offer sent</div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>

                    <li className="dropdown-item">
                      <div
                        className="accordion"
                        id="savedPropertiesAccordionFilter2"
                      >
                        <div className="accordion-item">
                          <h2 className="accordion-header" id="headingFilter2">
                            <button
                              className="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#collapseFilter2"
                              aria-expanded="false"
                              aria-controls="collapseFilter2"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              Cash Buyer
                            </button>
                          </h2>
                          <div
                            id="collapseFilter2"
                            className="accordion-collapse collapse"
                            aria-labelledby="headingFilter2"
                            data-bs-parent="#savedPropertiesAccordionFilter2"
                          >
                            <div className="accordion-body">
                              <p>No Cash Buyer Found</p>
                              {/* Add more details as needed */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  </>
                </ul>
              </div>
              <div className="dropdown">
                <div
                  className="filter-flask"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <FaFilter />
                </div>
                <ul className="dropdown-menu">
                  {filters.map((filter) => (
                    <li key={filter.id}>
                      <a
                        className="dropdown-item filter_flask"
                        // href="#"
                        onClick={() => handleFilterClick(filter)}
                      >
                        {filter.filterName}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="d-flex justify-content-center mt-4">
              {loader && <CircularProgress color="secondary" />}
            </div>
            <div className="card-parent-container">
              {properties &&
                properties.map((property) => {
                  const hasMultiplePhotos =
                    property.alt_photos && property.alt_photos.length >= 1;

                  const address = property.location;
                  const isSaved = savedProperties.some(
                    (svProperty) => svProperty.property_id === property.id
                  );
                  const savedProperty = savedProperties.find(
                    (svProperty) => svProperty.property_id === property.id
                  );

                  const isSavedOffer = savedOfferSent.some(
                    (svPropertyOffer) =>
                      svPropertyOffer.property_id === property.id
                  );
                  // const savedPropertyOffer = savedOfferSent.find(
                  //   (svPropertyOffer) =>
                  //     svPropertyOffer.property_id === property.id
                  // );

                  return (
                    hasMultiplePhotos && (
                      <div key={property.id}>
                        <div className="main-card-container">
                          <Slider {...settings} className="slider-h">
                            {property.alt_photos.map((photo, index) => (
                              <div key={index}>
                                <img
                                  className="prop-img"
                                  src={photo || "N/A"}
                                  alt={`property-${index}`}
                                />
                              </div>
                            ))}
                          </Slider>
                          <div className="d-flex flex-row justify-content-between p-2 order-container">
                            <img
                              className="order"
                              src={order || "N/A"}
                              alt="order"
                            />

                            <div className="d-flex flex-row gap-2">
                              {isSavedOffer ? (
                                <img
                                  className="order"
                                  src={sent_offer || "N/A"}
                                  alt="offer"
                                />
                              ) : (
                                <img
                                  className="order"
                                  src={offeer || "N/A"}
                                  alt="offer"
                                  onClick={() => {
                                    handleSaveFiltersOffer(property);
                                  }}
                                />
                              )}

                              {isSaved ? (
                                <img
                                  className="order"
                                  src={fillheart || "N/A"}
                                  alt="fillheart"
                                  onClick={() =>
                                    handleFillHeartClick(
                                      savedProperty ? savedProperty.id : null
                                    )
                                  }
                                />
                              ) : (
                                <img
                                  className="order"
                                  src={heart || "N/A"}
                                  alt="heart"
                                  onClick={() =>
                                    handleHeartClick(property.id, address)
                                  }
                                />
                              )}
                              {/* {property.is_saved === "0" ? (
                              <img
                                className="order"
                                src={heart || "N/A"}
                                alt="heart"
                                onClick={() =>
                                  handleHeartClick(property.id, address)
                                }
                              />
                            ) : (
                              <img
                                className="order"
                                src={fillheart || "N/A"}
                                alt="fillheart"
                              />
                            )} */}
                            </div>
                          </div>
                          <div className="d-flex flex-row justify-content-between p-2 rate-container">
                            <div className="rate">
                              <span className="rate-text">
                                MI Rate:{" "}
                                <span>{property.mi_rate || "N/A"}</span>
                              </span>
                            </div>
                            <div className="rate">
                              <span className="rate-text">
                                Spread: <span>{property.spread || "N/A"}</span>
                              </span>
                            </div>
                          </div>
                          <Link
                            to={`/dashboard/property-detail/${property.id}`}
                            className="text-underline"
                          >
                            <div className="card-content-container">
                              <div className="row">
                                <div className="col-8">
                                  <p className="prop-address-text">
                                    Property Address
                                  </p>
                                </div>
                                <div className="col-4">
                                  <div className="row">
                                    <div className="col-6">
                                      <p className="prop-address-text">
                                        PI: <span>{property.pi || "N/A"}</span>
                                      </p>
                                    </div>
                                    <div className="col-6">
                                      <p className="prop-address-text">
                                        Taxes:{" "}
                                        <span>{property.taxes || "N/A"}</span>
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-8">
                                  <p className="address-text">
                                    {property.location || "N/A"}
                                  </p>
                                </div>
                                <div className="col-4">
                                  <p className="prop-address-text">
                                    HOA: <span>{property.hoa || "N/A"}</span>
                                  </p>
                                </div>
                              </div>
                              <div className="row mt-2 mb-3">
                                <div className="col border-right">
                                  <p className="row-value">
                                    {property.beds || "N/A"}
                                  </p>
                                  <p className="row-text">Beds</p>
                                </div>
                                <div className="col border-right">
                                  <p className="row-value">
                                    {property.full_baths || "N/A"}
                                  </p>
                                  <p className="row-text">Baths</p>
                                </div>
                                <div className="col border-right">
                                  <p className="row-value">
                                    {property.sqft || "N/A"}
                                  </p>
                                  <p className="row-text">Sq Ft</p>
                                </div>
                                <div className="col border-right">
                                  <p className="row-value">
                                    ${property.estimated_value || "N/A"}
                                  </p>
                                  <p className="row-text">Est. Value</p>
                                </div>
                                <div className="col">
                                  <p className="row-value">
                                    {property.rent_rate || "N/A"}
                                  </p>
                                  <p className="row-text">Rent Rate</p>
                                </div>
                              </div>
                              <div className="d-flex flex-row justify-content-between">
                                <p className="list-price-text">
                                  List Price:{" "}
                                  <span>${property.list_price || "N/A"}</span>
                                </p>
                                {/**       <p className="list-price-text">
                                Date: <span>{property.date || "N/A"}</span>
                              </p>
                              */}
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    )
                  );
                })}
            </div>

            {properties && properties.length > 1 && (
              <div className="d-flex justify-content-center mt-5 ">
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(event, page) => setCurrentPage(page)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" />
    </>
  );
}

export default Dashboard;
