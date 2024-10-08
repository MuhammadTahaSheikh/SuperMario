import React, { useState, useEffect } from "react";
import "./emailSetting.css";
import Sidenav from "../../components/sidebar/Sidenav";
import Navbar from "../../components/navbar/Navbar";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "react-bootstrap/Spinner";
import axios from "axios";

function EmailSettings() {
  const [formData, setFormData] = useState({
    list_price_percent: "",
    offer_expiration_days: "",
    closing_days: "",
    escrow_deposit: "",
    inspection_period_days: "",
    terms_conditions: "",
    email_subject: "",
    email_body: "",
    template_name: "",
    save_filter: "",
  });
  const handleSaveFilterChange = (e) => {
    setFormData({ ...formData, save_filter: e.target.value });
  };
  const [selectedFilter, setSelectedFilter] = useState("Saved Filters");

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
    setSelectedFilter(filter.filterName);
    setFormData({ ...formData, save_filter: filter });
  };
  const [filters, setFilters] = useState([]);

  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [saveClick, setSaveClick] = useState(false);
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const filteredTemplates = templates.filter((template) =>
    template.template_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  useEffect(() => {}, [filters]);

  useEffect(() => {
    if (selectedTemplate === null) {
      setFormData({
        list_price_percent: "",
        offer_expiration_days: "",
        closing_days: "",
        escrow_deposit: "",
        inspection_period_days: "",
        terms_conditions: "",
        email_subject: "",
        email_body: "",
        template_name: "",
        save_filter: "",
      });
    } else {
      setFormData({
        list_price_percent: selectedTemplate.list_price_percent,
        offer_expiration_days: selectedTemplate.offer_expiration_days,
        closing_days: selectedTemplate.closing_days,
        escrow_deposit: selectedTemplate.escrow_deposit,
        inspection_period_days: selectedTemplate.inspection_period_days,
        terms_conditions: selectedTemplate.terms_conditions,
        email_subject: selectedTemplate.email_subject,
        email_body: selectedTemplate.email_body,
        template_name: selectedTemplate.template_name,
      });
    }
  }, [selectedTemplate, saveClick]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setFormData({ ...formData, email_body: data });
  };

  const handleEditTemplate = (template) => {
    setSelectedTemplate(template);
    setFormData({
      list_price_percent: template?.list_price_percent,
      offer_expiration_days: template?.offer_expiration_days,
      closing_days: template?.closing_days,
      escrow_deposit: template?.escrow_deposit,
      inspection_period_days: template?.inspection_period_days,
      terms_conditions: template?.terms_conditions,
      email_subject: template?.email_subject,
      email_body: template?.email_body,
      template_name: template?.template_name,
    });
    setSelectedFilter(template.save_filter.filterName || "Saved Filter");
  };

  const handleUpdateTemplate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.put(
        `/api/auto-offer-send-setting/${selectedTemplate.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedTemplates = templates.map((template) =>
        template.id === selectedTemplate.id
          ? { ...template, ...formData }
          : template
      );

      setTemplates(updatedTemplates);

      setFormData({
        list_price_percent: "",
        offer_expiration_days: "",
        closing_days: "",
        escrow_deposit: "",
        inspection_period_days: "",
        terms_conditions: "",
        email_subject: "",
        email_body: "",
        template_name: "",
        save_filter: "",
      });
      setSelectedTemplate(null);
      setSelectedFilter("Saved Filters");
      toast.success("Offer setting is updated successfully!");
    } catch (error) {
      toast.error("Failed to update. Please try again.");
      console.error("Error updating data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        "/api/auto-offer-send-setting",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSaveClick(true);
      const newTemplate = {
        ...formData,
        id: response.data.id,
      };
      if (response.status === 201) {
        fetchTemplates();
      }

      setSelectedFilter("Saved Filters");
      setTemplates([...templates, newTemplate]);
      setFormData({
        list_price_percent: "",
        offer_expiration_days: "",
        closing_days: "",
        escrow_deposit: "",
        inspection_period_days: "",
        terms_conditions: "",
        email_subject: "",
        email_body: "",
        template_name: "",
        save_filter: "",
      });
      setSelectedTemplate(null);
      toast.success("Offer setting is saved successfully!");
    } catch (error) {
      toast.error("Failed to save. Please try again.");
      console.error("Error sending data:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchTemplates = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const response = await axios.get("/api/auto-offer-send-setting", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setTemplates(response.data.offers);

      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch templates:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTemplates();
  }, []);
  useEffect(() => {
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

    fetchFilters();
  }, []);
  return (
    <>
      <div>
        <div className="app-main-container">
          <div className="app-main-left-container app-main-left-container1">
            <Sidenav />
          </div>
          <div className="app-main-right-container">
            <Navbar />
            <div className="dashboard-main-container">
              <div className="row">
                <div>
                  {" "}
                  <p className="noti-heading mt-3">Email SETTINGS</p>
                </div>
                <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                  <div className="row mt-3">
                    <p className="auto_offer_send">Auto Offer Send Settings</p>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                      <p className="input-head-uprofile">% of list price</p>
                      <input
                        className="send-input-uprofile"
                        placeholder="6%"
                        name="list_price_percent"
                        value={formData.list_price_percent}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                      <p className="input-head-uprofile">
                        Offer expiration days
                      </p>
                      <input
                        className="send-input-uprofile"
                        placeholder="20"
                        name="offer_expiration_days"
                        value={formData.offer_expiration_days}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                      <p className="input-head-uprofile">Closing days</p>
                      <input
                        className="send-input-uprofile"
                        placeholder="10"
                        name="closing_days"
                        value={formData.closing_days}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                      <p className="input-head-uprofile">Escrow deposit ($)</p>
                      <input
                        className="send-input-uprofile"
                        placeholder="$2000"
                        name="escrow_deposit"
                        value={formData.escrow_deposit}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                      <p className="input-head-uprofile">
                        Inspection period days
                      </p>
                      <input
                        className="send-input-uprofile"
                        placeholder="5"
                        name="inspection_period_days"
                        value={formData.inspection_period_days}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-12">
                      <p className="input-head-uprofile">
                        Terms and Conditions
                      </p>
                      <textarea
                        className="send-textarea-uprofile"
                        rows={5}
                        name="terms_conditions"
                        value={formData.terms_conditions}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-xl-8 col-lg-8 col-md-6 col-sm-12">
                  <div className="dropdown mt-3">
                    <div
                      className="dropdown-toggle filter-types-main-container-uprofile"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <div className="selected_filter">{selectedFilter}</div>
                    </div>
                    <ul className="dropdown-menu">
                      {filters.map((filter) => (
                        <li key={filter.id}>
                          <a
                            className="dropdown-item"
                            // href="#"
                            onClick={() => handleFilterClick(filter)}
                          >
                            {filter.filterName}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="col-12 email-head-margin">
                    <p className="input-head-uprofile">Email Subject</p>
                    <input
                      className="send-input-uprofile"
                      placeholder=""
                      name="email_subject"
                      value={formData.email_subject}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="row mt-3">
                    <div className="col-12">
                      <p className="input-head-uprofile">Email Body</p>
                      <CKEditor
                        editor={ClassicEditor}
                        data={formData.email_body}
                        onChange={handleEditorChange}
                      />
                    </div>
                    {selectedTemplate ? (
                      <div className="col-xl-12 col-lg-8 col-md-12 col-sm-12">
                        <p className="noti-heading mt-3">Template Name</p>
                        <div className="d-flex flex-row gap-2 mt-1">
                          <input
                            className="send-input-uprofile"
                            placeholder="Chicago Template"
                            name="template_name"
                            value={formData.template_name}
                            onChange={handleInputChange}
                          />
                          <div
                            className="copy-btn"
                            onClick={handleUpdateTemplate}
                          >
                            {loading ? (
                              <Spinner animation="border" size="sm" />
                            ) : (
                              "Update"
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="col-xl-12 col-lg-8 col-md-12 col-sm-12">
                        <p className="noti-heading mt-3">Template Name</p>
                        <div className="d-flex flex-row gap-2 mt-1">
                          <input
                            className="send-input-uprofile"
                            placeholder="Chicago Template"
                            name="template_name"
                            value={formData.template_name}
                            onChange={handleInputChange}
                          />
                          <div className="copy-btn" onClick={handleSubmit}>
                            {loading ? (
                              <Spinner animation="border" size="sm" />
                            ) : (
                              "Save"
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="app-main-container">
          <div className="app-main-left-container"></div>
          <div className="app-main-right-container">
            <div className="email-template-container">
              <h2>Email Templates</h2>
              {loading ? (
                <div className="center-spinner">
                  <Spinner animation="border" role="status">
                    <span className="sr-only"></span>
                  </Spinner>
                </div>
              ) : (
                <>
                  <div className="email-input-container">
                    <input
                      type="text"
                      placeholder="🔍 Template name"
                      className="email-input search-icon"
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                    />
                    <select className="email-input search-button">
                      <option value="category1" className="category_css">
                        Category
                      </option>
                      <option value="category2" className="category_css">
                        Category 1
                      </option>
                      <option value="category3" className="category_css">
                        Category 2
                      </option>
                    </select>
                  </div>
                  <div className="box-container">
                    {filteredTemplates.map((template) => (
                      <div className="box" key={template.id}>
                        <>
                          <div className="box_head">
                            <p className="template_name">
                              {template.template_name}
                            </p>
                            <button
                              className="edit_template"
                              onClick={() => handleEditTemplate(template)}
                            >
                              Edit
                            </button>
                          </div>
                          <p className="template_contact_box">
                            <span className="template_contact_box_span">
                              Email Subject:
                            </span>
                            {template.email_subject}
                          </p>
                          <p className="template_contact_box">
                            <span className="template_contact_box_span">
                              Closing days:
                            </span>
                            {template.closing_days}
                          </p>
                          <p className="template_contact_box">
                            <span className="template_contact_box_span">
                              Offer expiration days:
                            </span>
                            {template.offer_expiration_days}
                          </p>
                          <p className="template_contact_box">
                            <span className="template_contact_box_span">
                              Escrow deposit ($):
                            </span>
                            {template.escrow_deposit}
                          </p>
                        </>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
}

export default EmailSettings;
