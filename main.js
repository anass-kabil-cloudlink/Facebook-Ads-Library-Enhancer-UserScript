// ==UserScript==
// @name         Facebook Ads Library Enhancer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Enhance the visibility and control of Facebook Ads Library interface
// @author       Anassk
// @match        *.facebook.com/ads/library/*
// @grant        none
// ==/UserScript==


(function() {
    'use strict';

// Create a container for the toggle buttons and elements
const controlPanel = document.createElement('div');
controlPanel.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    z-index: 10000;
`;

// Function to create a toggle button and associated element
function createToggleElement(id, defaultText, element) {
    const toggleButton = document.createElement('button');
    toggleButton.textContent = '>>';
    toggleButton.style.cssText = `
        background: #0078D7;
        color: white;
        border: none;
        border-radius: 5px;
        padding: 5px 10px;
        cursor: pointer;
        margin-top: 5px; // Space between buttons
    `;
    toggleButton.onclick = function() {
        if (element.style.display === 'none') {
            element.style.display = 'block';
            toggleButton.textContent = '<<';
        } else {
            element.style.display = 'none';
            toggleButton.textContent = '>>';
        }
    };

    controlPanel.appendChild(toggleButton);
    controlPanel.appendChild(element);
}

// First div
const urlCustomizationForm = document.createElement('div');
urlCustomizationForm.id = 'urlCustomizationForm';

urlCustomizationForm.style.cssText = `
    position: fixed;
    top: 10px;
    right: 40px; // Adjusted to not overlap the toggle button
    width: 300px; // Set initial width
    padding: 10px;
    background: #f9f9f9;
    border: 1px solid #ccc;
    border-radius: 5px;
    z-index: 9999;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    display: none; // Initially hidden
    flex-direction: column;
    align-items: flex-start;
    transition: all 0.3s ease;
    overflow: hidden;
    flex-direction: column;

`;

urlCustomizationForm.style.display = 'none'; // Initially hidden

// Second div
const adControlForm = document.createElement('div');
adControlForm.classList.add('ad-control-form');
adControlForm.innerHTML = `
    <label for="minAds">Minimum Number of Ads to Keep:</label>
    <input type="number" id="minAdsInput" min="0" value="3">
    <button id="applyFilterBtn">Apply Filter</button>
`;

adControlForm.style.padding = '10px';
adControlForm.style.background = '#fff';
adControlForm.style.border = '1px solid #ccc';
adControlForm.style.borderRadius = '5px';
adControlForm.style.zIndex = '9999';
document.body.appendChild(adControlForm);

adControlForm.style.display = 'none'; // Initially hidden

// Third element (scroller)

const scrollContainer = document.createElement('div');

    scrollContainer.innerHTML = `
    <label for="connectControl">Connect with controlAds:</label>
    <input type="checkbox" id="connectControl" >
    <button id="connecControlButton">Apply Filter</button>
`;
document.body.appendChild(scrollContainer);
    scrollContainer.style.cssText = `
    padding: 10px;
    background: #f9f9f9;
    border: 1px solid #ccc;
    border-radius: 5px;
    z-index: 9999;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    display: none; // Initially hidden
    flex-direction: column;
    align-items: flex-start;
    transition: all 0.3s ease;
    overflow: hidden;
    flex-direction: column;

`;


scrollContainer.style.display = 'none'; // Initially hidden

// Create toggle elements
createToggleElement('urlCustomizationForm', 'URL Form', urlCustomizationForm);
createToggleElement('adControlForm', 'Ad Control', adControlForm);
createToggleElement('scrollButton', 'Scroll', scrollContainer);

// Append the control panel to the body
document.body.appendChild(controlPanel);


//------------ first script functions (Link save filters) ------------

function updateUrlParams() {
    const currentUrl = window.location.href;
    const urlParams = new URLSearchParams(window.location.search);

    urlCustomizationForm.innerHTML = '';

    for (const [key, value] of urlParams) {
        const paramDiv = document.createElement('div');
        paramDiv.innerHTML = `
            <label for="input_${key}">${key}: </label>
            <input id="input_${key}" type="text" value="${value}">
            <button class="toggleParamBtn" data-key="${key}">X</button>
            <br>
        `;
        urlCustomizationForm.appendChild(paramDiv);
    }

    // Add event listeners to toggle parameter buttons
    document.querySelectorAll('.toggleParamBtn').forEach(button => {
        button.addEventListener('click', function() {
            const key = this.getAttribute('data-key');
            const input = document.getElementById('input_' + key);

            if (input.disabled) {
                input.disabled = false;
                this.previousElementSibling.style.textDecoration = 'none';
                this.textContent = 'X';
            } else {
                input.disabled = true;
                this.previousElementSibling.style.textDecoration = 'line-through';
                this.textContent = '✔';
            }
        });
    });

    // Add a button to open the customized URL
    const openButton = document.createElement('button');
    openButton.id = 'openCustomizedUrlBtn';
    openButton.textContent = 'Open Customized URL';
    urlCustomizationForm.appendChild(openButton);

    // Function to open the customized URL
    openButton.addEventListener('click', function() {
        let newUrl = currentUrl.split('?')[0] + '?';

        document.querySelectorAll('#urlCustomizationForm input[type="text"]').forEach(input => {
            const key = input.id.replace('input_', '');
            if (!input.disabled) { // Only add parameter if input is not disabled
                newUrl += `${encodeURIComponent(key)}=${encodeURIComponent(input.value)}&`;
            }
        });

        window.open(newUrl.slice(0, -1), '_blank'); // Remove the last '&' from the URL
    });
}

// Update form on initial page load
updateUrlParams();

// New MutationObserver to detect URL changes (Note: This might not be effective for URL changes. Consider using 'popstate' or 'hashchange' events)
let previousUrl = window.location.href;

const observer = new MutationObserver(mutations => {
  if (window.location.href !== previousUrl) {
    console.log(`URL changed from ${previousUrl} to ${window.location.href}`);
    previousUrl = window.location.href;
    updateUrlParams(); // Call your function to handle the URL change
  }
});

observer.observe(document, {
  childList: true,
  subtree: true
});

// Remember to disconnect the observer when it's no longer needed
// observer.disconnect();




//--------second script functions  (ads control) ------------

function applyFilter() {
    const minAds = parseInt(document.getElementById('minAdsInput').value, 10);
    if (isNaN(minAds)) return; // Exit if minAds is not a number

    const divBlocks = document.querySelectorAll('div._7jvw.x2izyaf.x1hq5gj4.x1d52u69');
    const blocksToRemove = []; // Use an array to store elements to remove

    divBlocks.forEach(block => {
        let text = block.textContent;
        let startIndex = text.indexOf('use this creative and text');

        if (startIndex !== -1) {
            let subText = text.substring(0, startIndex);
            let numberValue = subText.match(/\d+ ads/); // Extract the first number followed by ' ads'

            if (numberValue) {
                let numAds = parseInt(numberValue[0], 10);

                // Check whether to hide the block based on numAds
                if (numAds < minAds) {
                    blocksToRemove.push(block);
                }
            }
        } else {
            blocksToRemove.push(block);
        }
    });

    // Remove all identified blocks in one operation to minimize DOM manipulation
    blocksToRemove.forEach(block => block.parentNode && block.parentNode.remove());
}

// Event listener for the filter application button
document.getElementById('applyFilterBtn').addEventListener('click', applyFilter);

//-------------third script functions (scroller)-----------

let scrolling = false;
let applyFilterCheckbox = document.getElementById("connectControl");

// Function to scroll to the bottom
const scrollToBottom = () => {
  window.scrollTo(0, document.body.scrollHeight);
};

// Function to handle the loading of new items
const waitForItemsToLoad = () => {
  const ScrollObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        scrollToBottom();
        if (applyFilterCheckbox.checked && scrolling) {
          applyFilter();
        }
      }
    });
  });

  const config = { childList: true, subtree: true };
  const targetNode = document.querySelector('body');
  ScrollObserver.observe(targetNode, config);

  return ScrollObserver;
};

let ScrollObserver;

// Toggle scrolling on button click
let scrollButton=document.getElementById("connecControlButton");

scrollButton.onclick = () => {
  if (!scrolling) {
    scrolling = true;
    scrollButton.innerText = 'Stop Scrolling';

    // start scrolling
    scrollToBottom();
    ScrollObserver = waitForItemsToLoad();
  } else {
    // stop scrolling
    scrolling = false;
    scrollButton.innerText = 'Start Scrolling';

    if (ScrollObserver) {
      ScrollObserver.disconnect();
    }
  }
};


})();
