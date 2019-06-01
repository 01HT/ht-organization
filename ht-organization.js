"use strict";
import { LitElement, html, css } from "lit-element";
import "@polymer/paper-tooltip";

import "@01ht/ht-user-avatar";
import "@01ht/ht-spinner";

import "./ht-organization-about";
import "./ht-organization-portfolio";

import {
  updateMetadata,
  getMetaDescriptionFromQuillObject
} from "@01ht/ht-client-helper-functions/metadata.js";

import { stylesBasicWebcomponents } from "@01ht/ht-theme/styles";

class HTOrganization extends LitElement {
  static get styles() {
    return [
      stylesBasicWebcomponents,
      css`
        a {
          outline: none;
        }

        iron-icon {
          color: var(--secondary-text-color);
          min-width: 22px;
          min-height: 22px;
        }

        #container[loading] {
          display: flex;
          flex-direction: column;
        }

        #container {
          display: grid;
          grid-template-columns: 0.25fr 0.75fr;
          width: 100%;
          margin-top: 32px;
          grid-gap: 32px;
        }

        #main,
        #sidebar {
          display: flex;
          flex-direction: column;
        }

        #sidebar {
          overflow: hidden;
        }

        #sidebar h1,
        #sidebar #displayName,
        #sidebar #fullname,
        .text {
          word-wrap: break-word;
          overflow: hidden;
          width: 100%;
        }

        #displayName {
          font-size: 24px;
          color: #2d2d2d;
          line-height: 1.42;
          font-weight: 500;
          margin: 0;
          padding: 0;
          margin-top: 16px;
        }

        #fullname {
          font-size: 16px;
          color: var(--secondary-text-color);
        }

        #social {
          display: flex;
          flex-wrap: wrap;
          margin-top: 16px;
        }

        #social a {
          margin-right: 8px;
          outline: none;
        }

        #info {
          margin-top: 32px;
          width: 100%;
        }

        .info {
          display: flex;
          align-items: center;
          color: var(--secondary-text-color);
          margin-bottom: 8px;
          position: relative;
        }

        .icon-block {
          position: relative;
        }

        .info iron-icon {
          margin-right: 8px;
          color: var(--secondary-text-color);
          min-width: 18px;
          min-height: 18px;
          width: 18px;
          height: 18px;
        }

        #sales {
          margin-top: 16px;
        }

        #nav {
          display: flex;
          margin-bottom: 16px;
        }

        .menu {
          text-decoration: none;
          color: #414549;
          font-weight: 500;
          font-size: 14px;
          text-transform: uppercase;
          padding: 16px;
          margin: 0 9px;
        }

        .menu:hover {
          border-bottom: 4px solid #dfe1e5;
        }

        .menu[active],
        .menu[active]:hover {
          border-bottom: 4px solid var(--accent-color);
        }

        #main > .page {
          display: none;
        }

        #main > .page[active] {
          display: block;
        }

        @media (max-width: 650px) {
          #container {
            grid-template-columns: auto;
          }

          #sidebar {
            align-items: center;
          }

          #displayName {
            text-align: center;
          }

          #nav {
            justify-content: center;
          }
        }

        #social[hidden],
        #info[hidden],
        #main[hidden],
        #sidebar[hidden],
        ht-spinner[hidden] {
          display: none;
        }
      `
    ];
  }

  render() {
    const { orgData, loading, page, cartChangeInProcess } = this;
    if (orgData === undefined) {
      return html`<ht-spinner page></ht-spinner>`;
    }
    return html`
    <iron-iconset-svg size="24" name="ht-user-icons">
        <svg>
            <defs>
              <g id="language"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"></path></g>
              <g id="location-city"><path d="M15 11V5l-3-3-3 3v2H3v14h18V11h-6zm-8 8H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm6 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm6 12h-2v-2h2v2zm0-4h-2v-2h2v2z"></path></g>
              <g id="email"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"></path></g>
              <g id="phone"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"></path></g>
              <g id="flag"><path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"></path></g>
              <g id="business"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"></path></g>
              <g id="assignment-ind"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V19z"></path></g>
              <g id="shopping-cart"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"></path></g>
            </defs>
        </svg>
    </iron-iconset-svg>
    <div id="container" ?loading="${loading}">
      <ht-spinner ?hidden="${!loading}" page></ht-spinner>
      <div id="sidebar" ?hidden="${loading}">
        <ht-user-avatar .data="${orgData}" .size="${128}" .verifiedSize="${28}"></ht-user-avatar>
        <h1 id="displayName">${orgData.displayName}</h1>
        <div id="fullname" ?hidden="${orgData.firstName === "" &&
          orgData.lastName === ""}">${orgData.firstName} ${
      orgData.lastName
    }</div>
        <div id="social" ?hidden="${orgData.website === "" &&
          orgData.google === "" &&
          orgData.facebook === "" &&
          orgData.twitter === "" &&
          orgData.github === ""}">
          ${
            orgData.website !== ""
              ? html`<a href="${
                  orgData.website
                }" target="_blank" rel="noopener nofollow">
            <iron-icon src="https://res.cloudinary.com/cdn-01ht/image/upload/v1532588175/logos/website/website-color.svg"></iron-icon>
            <paper-tooltip position="right" animation-delay="0" offset="4">Сайт пользователя</paper-tooltip>
          </a>`
              : ""
          }
          ${
            orgData.twitter !== ""
              ? html`<a href="${
                  orgData.twitter
                }" target="_blank" rel="noopener nofollow">
            <iron-icon src="https://res.cloudinary.com/cdn-01ht/image/upload/v1532587138/logos/twitter/twitter-color.svg"></iron-icon>
            <paper-tooltip position="right" animation-delay="0" offset="4">Профайл Twitter</paper-tooltip>
          </a>`
              : ""
          }
          ${
            orgData.facebook !== ""
              ? html`<a href="${
                  orgData.facebook
                }" target="_blank" rel="noopener nofollow">
            <iron-icon src="https://res.cloudinary.com/cdn-01ht/image/upload/v1532586978/logos/facebook/logo-color.svg"></iron-icon>
            <paper-tooltip position="right" animation-delay="0" offset="4">Профайл Facebook</paper-tooltip>
          </a>`
              : ""
          }
           ${
             orgData.google !== ""
               ? html`<a href="${
                   orgData.google
                 }" target="_blank" rel="noopener nofollow">
            <iron-icon src="https://res.cloudinary.com/cdn-01ht/image/upload/v1532600717/logos/google/google-plus.svg"></iron-icon>
            <paper-tooltip position="right" animation-delay="0" offset="4">Профайл Google+</paper-tooltip>
          </a>`
               : ""
           }
          ${
            orgData.github !== ""
              ? html`<a href="${
                  orgData.github
                }" target="_blank" rel="noopener nofollow">
            <iron-icon src="https://res.cloudinary.com/cdn-01ht/image/upload/v1532587414/logos/github/github-color.svg"></iron-icon>
            <paper-tooltip position="right" animation-delay="0" offset="4">Профайл GitHub</paper-tooltip>
          </a>`
              : ""
          }
        </div>
        <div id="info" ?hidden="${orgData.email === "" &&
          orgData.phone === "" &&
          orgData.country === "" &&
          orgData.city === "" &&
          orgData.company === "" &&
          orgData.position === ""}">
          ${
            orgData.email !== ""
              ? html`<div class="info">
            <div class="icon-block">
              <iron-icon icon="ht-user-icons:email"></iron-icon>
              <paper-tooltip position="right" animation-delay="0" offset="4">Email</paper-tooltip>
            </div>
            <div class="text">${orgData.email}</div>
            </div>`
              : ""
          }
          ${
            orgData.phone !== ""
              ? html`<div class="info">
            <div class="icon-block">
              <iron-icon icon="ht-user-icons:phone"></iron-icon>
              <paper-tooltip position="right" animation-delay="0" offset="4">Телефон</paper-tooltip>
            </div>
            <div class="text">${orgData.phone}</div>
            </div>`
              : ""
          }
          ${
            orgData.country !== ""
              ? html`<div class="info">
            <div class="icon-block">
              <iron-icon icon="ht-user-icons:flag"></iron-icon>
              <paper-tooltip position="right" animation-delay="0" offset="4">Страна</paper-tooltip>
            </div>
            <div class="text">${orgData.country}</div>
            </div>`
              : ""
          }
          ${
            orgData.city !== ""
              ? html`<div class="info">
            <div class="icon-block">
              <iron-icon icon="ht-user-icons:location-city"></iron-icon>
              <paper-tooltip position="right" animation-delay="0" offset="4">Город</paper-tooltip>
            </div>
            <div class="text">${orgData.city}</div>
            </div>`
              : ""
          }
            ${
              orgData.sales > 0
                ? html`<div id="sales" class="info">
              <div class="icon-block">
                <iron-icon icon="ht-user-icons:shopping-cart"></iron-icon>
                <paper-tooltip position="right" animation-delay="0" offset="4">Продажи</paper-tooltip>
              </div>
              <div class="text">${orgData.sales}</div>
              </div>`
                : ""
            }
        </div>
      </div>
      <div id="main" ?hidden="${loading}">
        <div id="nav">
          <a href="/organization/${orgData.nameInURL}/${
      orgData.organizationNumber
    }/about" class="menu" ?active="${page === "about"}">О нас</a>
          <a href="/organization/${orgData.nameInURL}/${
      orgData.organizationNumber
    }/portfolio" class="menu" ?active="${page === "portfolio"}">Портфолио</a>
        </div>
        <ht-organization-about class="page" ?active="${page ===
          "about"}" .data="${orgData}"></ht-organization-about>
        <ht-organization-portfolio class="page" ?active="${page ===
          "portfolio"}" .data="${orgData}" .cartChangeInProcess="${cartChangeInProcess}"></ht-organization-portfolio>
      </div>
    </div>`;
  }

  static get properties() {
    return {
      orgData: { type: Object },
      loading: { type: Boolean },
      page: { type: String },
      orgId: { type: String },
      cartChangeInProcess: { type: Boolean }
    };
  }

  updated() {
    if (this.orgData === undefined) return;
    let description = "";
    if (this.page === "about") {
      try {
        description = getMetaDescriptionFromQuillObject(
          JSON.parse(this.orgData.description)
        );
      } catch (err) {
        description = "";
      }
    }

    updateMetadata({
      title:
        this.page === "about"
          ? `${this.orgData.displayName} | Профайл на Elements`
          : `${this.orgData.displayName} - Портфолио | Elements`,
      image: `${cloudinaryURL}/c_scale,f_auto,h_512,w_512/v${
        this.orgData.avatar.version
      }/${this.orgData.avatar.public_id}.png`,
      imageAlt: `${this.orgData.displayName}`,
      canonical: `${
        this.page === "about"
          ? `https://elements.01.ht/organization/${this.orgData.nameInURL}/${
              this.orgData.organizationNumber
            }`
          : `https://elements.01.ht/organization/${this.orgData.nameInURL}/${
              this.orgData.organizationNumber
            }/portfolio`
      }`,
      description: description
    });
  }

  async updateData(organizationNumber, page) {
    try {
      this.page = page;
      if (this.organizationNumber === organizationNumber) return;
      this.organizationNumber = organizationNumber;
      this.loading = true;
      let snapshot = await window.firebase
        .firestore()
        .collection("organizations")
        .where("organizationNumber", "==", organizationNumber)
        .limit(1)
        .get();
      this.loading = false;
      if (snapshot.empty) {
        this.dispatchEvent(
          new CustomEvent("page-not-found", {
            bubbles: true,
            composed: true
          })
        );
        return;
      }
      let orgData;
      snapshot.forEach(doc => {
        orgData = doc.data();
        orgData.orgId = doc.id;
        orgData.uid = doc.id;
        orgData.isOrg = true;
      });
      this.orgData = orgData;
    } catch (error) {
      console.log("update: " + error.message);
    }
  }
}

customElements.define("ht-organization", HTOrganization);
