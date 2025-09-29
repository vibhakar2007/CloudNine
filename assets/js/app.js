"use strict";

import { fetchData, url } from "./api.js";
import * as module from "./module.js";

const addEventOnElements = function (elements, eventType, callback) {
  for (const element of elements) element.addEventListener(eventType, callback);
};

// Search Toggle

const searchView = document.querySelector("[data-search-view]");
const searchTogglers = document.querySelectorAll("[data-search-toggler]");

const toggleSearch = () => searchView.classList.toggle("active");

addEventOnElements(searchTogglers, "click", toggleSearch);

// Search API

const searchField = document.querySelector("[data-search-field]");
const searchResult = document.querySelector("[data-search-result]");

let searchTimeout = null;
const searchTimeoutDuration = 500;

searchField.addEventListener("input", () => {
  searchTimeout ?? clearTimeout(searchTimeoutDuration);

  if (!searchField.value) {
    searchResult.classList.remove("active");
    searchResult.innerHTML = "";
    searchField.classList.remove("searching");
  } else {
    searchField.classList.add("searching");
  }

  if (searchField.value) {
    searchTimeout = setTimeout(() => {
      fetchData(url.geo(searchField.value), (locations) => {
        searchField.classList.remove("searching");
        searchResult.classList.add("active");
        searchResult.innerHTML = `<ul class="view-list" data-search-list></ul>`;

        const items = [];

        for (const { name, lat, lon, country, state } of locations) {
            const searchItem = document.createElement("li");
            searchItem.classList.add("view-item");

            searchItem.innerHTML = `
                <span class="m-icon">location_on</span>

                <div>
                    <p class="item-title">${name}</p>
                    <p class="label-2 item-subtitle">${state || ""}, ${country}</p>
                </div>

                <a href="#/weather?lat=${lat}&lon=${lon}" aria-label="${name} weather" class="item-link has-state" data-search-toggler></a>
            `;

            searchResult.querySelector("[data-search-list]").appendChild(searchItem);
            items.push(searchItem.querySelector("[data-search-toggler]"));
        }
      });
    }, searchTimeoutDuration);
  }

});

