import React, { useEffect, useState } from "react";
import "./userProfile.css";
import Sidenav from "../../components/sidebar/Sidenav";
import Navbar from "../../components/navbar/Navbar";
import userprofile from "../../assets/userProfile/user-profile.png";
import file from "../../assets/userProfile/file.png";
import download from "../../assets/userProfile/download.png";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axios from "axios";

function UserProfile() {
  const [profileData, setProfileData] = useState([]);
  useEffect(() => {
    const userdata = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const response = await axios.get("/api/user_name", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setProfileData(response.data);
      } catch (error) {
        console.error("Failed to fetch templates:", error);
      }
    };
    userdata();
  }, []);
  return (
    <>
      <div className="app-main-container">
        <div className="app-main-left-container">
          <Sidenav />
        </div>
        <div className="app-main-right-container">
          <Navbar />
          <div className="dashboard-main-container">
            <p className="dashboard-text">User Profile</p>
            <div className="row">
              <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                <img
                  className="userprofile"
                  src={userprofile}
                  alt="userprofile"
                />
                <div className="row mt-3">
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                    <p className="input-head-uprofile">First Name</p>
                    <p className="send-input-uprofilee">
                      {profileData.first_name}
                    </p>
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                    <p className="input-head-uprofile">Last Name</p>
                    <p className="send-input-uprofilee">
                      {profileData.last_name}
                    </p>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                    <p className="input-head-uprofile">
                      Email <span className="verified">Verified</span>
                    </p>
                    <p className="send-input-uprofile1">{profileData.email}</p>
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                    <p className="input-head-uprofile">
                      Phone <span className="not-verified">Not-Verified</span>
                    </p>
                    <p className="send-input-uprofile1">
                      {profileData.phone ? profileData.phone : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 mt-3">
                <p className="noti-heading mt-5">Notifications Settings</p>
                <p className="noti-sub-heading mt-4">Emails notifications</p>
                <div className="d-flex flex-row justify-content-between">
                  <p className="noti-text">Emails about new leads</p>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="flexSwitchCheckDefault"
                    ></input>
                  </div>
                </div>
                <div className="d-flex flex-row justify-content-between">
                  <p className="noti-text">Lead purchase email</p>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="flexSwitchCheckDefault"
                    ></input>
                  </div>
                </div>
                <div className="d-flex flex-row justify-content-between">
                  <p className="noti-text">Promo emails</p>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="flexSwitchCheckDefault"
                    ></input>
                  </div>
                </div>
                <div className="d-flex flex-row justify-content-between">
                  <p className="noti-text">System notification</p>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="flexSwitchCheckDefault"
                    ></input>
                  </div>
                </div>
                <div className="d-flex flex-row justify-content-between">
                  <p className="noti-text">Fixed price mode notifications</p>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="flexSwitchCheckDefault"
                    ></input>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                <p className="noti-sub-heading sms-margin">SMS notifications</p>
                <div className="d-flex flex-row justify-content-between">
                  <p className="noti-text">SMS about new leads in states</p>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="flexSwitchCheckDefault"
                    ></input>
                  </div>
                </div>
                <div className="d-flex flex-row justify-content-between">
                  <p className="noti-text">Promo sms</p>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="flexSwitchCheckDefault"
                    ></input>
                  </div>
                </div>
                <div className="d-flex flex-row justify-content-between">
                  <p className="noti-text">Lead purchase SMS</p>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="flexSwitchCheckDefault"
                    ></input>
                  </div>
                </div>
              </div>
            </div>

            <hr className="uprofile-hr" />

            {/* <div className="row">
              <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                <p className="noti-heading mt-3">Auto Offer Send Settings</p>
                <div className="row mt-5">
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                    <p className="input-head-uprofile">% of list price</p>
                    <input className="send-input-uprofile" placeholder="6%" />
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                    <p className="input-head-uprofile">Offer expiration days</p>
                    <input className="send-input-uprofile" placeholder="20" />
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                    <p className="input-head-uprofile">Closing days</p>
                    <input className="send-input-uprofile" placeholder="10" />
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                    <p className="input-head-uprofile">Escrow deposit ($)</p>
                    <input
                      className="send-input-uprofile"
                      placeholder="$2000"
                    />
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                    <p className="input-head-uprofile">
                      Inspection period days
                    </p>
                    <input className="send-input-uprofile" placeholder="5" />
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-12">
                    <p className="input-head-uprofile">Terms and Conditions</p>
                    <textarea className="send-textarea-uprofile" rows={5} />
                  </div>
                </div>
              </div>
              <div className="col-xl-8 col-lg-8 col-md-6 col-sm-12">
                <div class="dropdown mt-3">
                  <div
                    class="dropdown-toggle filter-types-main-container-uprofile"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Saved Filters
                  </div>
                  <ul class="dropdown-menu">
                    <li>
                      <a class="dropdown-item" href="#">
                        Action
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="col-12 email-head-margin">
                  <p className="input-head-uprofile">Email Subject</p>
                  <input
                    className="send-input-uprofile"
                    placeholder=""
                    an
                    email
                    to
                    the
                    realtor
                  />
                </div>
                <div className="row mt-3">
                  <div className="col-12">
                    <p className="input-head-uprofile">Email Body</p>
                    <CKEditor
                      editor={ClassicEditor}
                      data=""
                      onReady={(editor) => {
                        // console.log("Editor is ready to use!", editor);
                      }}
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        // console.log({ event, editor, data });
                      }}
                      onBlur={(event, editor) => {
                        // console.log("Blur.", editor);
                      }}
                      onFocus={(event, editor) => {
                        // console.log("Focus.", editor);
                      }}
                    />
                    <textarea
                      className="send-textarea-uprofile"
                      rows={13}
                      style={{ display: "none" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <hr className="uprofile-hr" />

            <div className="row">
              <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                <p className="noti-heading mt-3">Offer document section </p>
                <div className="d-flex flex-row justify-content-between mt-4">
                  <p className="doc-text">abcssd.pdf</p>
                  <div className="d-flex flex-row gap-2">
                    <img className="doc-icon" src={file} alt="file" />
                    <img className="doc-icon" src={download} alt="download" />
                  </div>
                </div>
                <div className="d-flex flex-row justify-content-between">
                  <p className="doc-text">abcssd.pdf</p>
                  <div className="d-flex flex-row gap-2">
                    <img className="doc-icon" src={file} alt="file" />
                    <img className="doc-icon" src={download} alt="download" />
                  </div>
                </div>
                <div className="d-flex flex-row justify-content-between">
                  <p className="doc-text">abcssd.pdf</p>
                  <div className="d-flex flex-row gap-2">
                    <img className="doc-icon" src={file} alt="file" />
                    <img className="doc-icon" src={download} alt="download" />
                  </div>
                </div>
                <div className="d-flex flex-row justify-content-between">
                  <p className="doc-text">abcssd.pdf</p>
                  <div className="d-flex flex-row gap-2">
                    <img className="doc-icon" src={file} alt="file" />
                    <img className="doc-icon" src={download} alt="download" />
                  </div>
                </div>
                <div className="d-flex flex-row justify-content-between">
                  <p className="doc-text">abcssd.pdf</p>
                  <div className="d-flex flex-row gap-2">
                    <img className="doc-icon" src={file} alt="file" />
                    <img className="doc-icon" src={download} alt="download" />
                  </div>
                </div>
              </div>
              <div className="col-xl-8 col-lg-8 col-md-6 col-sm-12">
                <p className="noti-heading mt-3">GHL web hook</p>
                <div className="d-flex flex-row gap-2 mt-4">
                  <input
                    className="send-input-uprofile"
                    placeholder="search?sca_esv=4ce04de13f7e18f6&sca_upv=1&rlz=1C1"
                  />
                  <div className="copy-btn">Copy</div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default UserProfile;
