"use strict";
import { LitElement, html, css } from "lit-element";
import "@01ht/ht-wysiwyg/ht-wysiwyg-viewer.js";
import "@01ht/ht-nothing-found-placeholder";

class HTOrganizationAbout extends LitElement {
  static styles = css`<style>
    :host {
      display: block;
      position: relative;
      box-sizing: border-box;
    }
      
    #container {
      display: flex;
      flex-direction: column;
      margin: auto;
    }
  
    [hidden], [hide] {
      display: none;
    }

    ht-nothing-found-placeholder {
      display:none;
    }

    ht-nothing-found-placeholder[show] {
      display: block;
    }
  </style>`;

  render() {
    const { data } = this;
    return html`
    <div id="container">
      <ht-nothing-found-placeholder main="Нет информации" ?show="${
        data.description === '{"ops":[{"insert":"\\n"}]}' ||
        data.description === "{}"
          ? true
          : false
      }"></ht-nothing-found-placeholder>
      <ht-wysiwyg-viewer .data="${data.description}"></ht-wysiwyg-viewer>
    </div>`;
  }

  static get properties() {
    return {
      data: { type: Object }
    };
  }
}

customElements.define("ht-organization-about", HTOrganizationAbout);
