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
const commonStyle = `padding:10px;background:#f9f9f9;border:1px solid #ccc;border-radius:5px;z-index:9999;box-shadow:0 4px 8px rgba(0,0,0,0.1);display:none;flex-direction:column;align-items:flex-start;transition:all 0.3s ease;overflow:hidden;`;

const controlPanel = document.createElement('div');
controlPanel.style.cssText = `position:fixed;top:10px;right:10px;display:flex;flex-direction:column;align-items:flex-end;z-index:10000;height:auto;`;

function createToggleElement(id, defaultText, element) {
    const toggleButton = document.createElement('button');
    toggleButton.textContent = '>>';
    toggleButton.style.cssText = `background:#0078D7;color:white;border:none;border-radius:5px;padding:5px 10px;cursor:pointer;margin-top:5px;`;
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

const urlCustomizationForm = document.createElement('div');
urlCustomizationForm.id = 'urlCustomizationForm';
urlCustomizationForm.style.cssText = `position:relative;top:0;width:300px;${commonStyle}`;

const adControlForm = document.createElement('div');
adControlForm.classList.add('ad-control-form');
adControlForm.innerHTML = `<label for="minAds">Minimum Number of Ads to Keep:</label><input type="number" id="minAdsInput" min="0" value="3"><button id="applyFilterBtn">Apply Filter</button>`;
adControlForm.style.cssText = `${commonStyle}`;
document.body.appendChild(adControlForm);

const scrollContainer = document.createElement('div');
scrollContainer.innerHTML = `<label for="connectControl">Connect with controlAds:</label><input type="checkbox" id="connectControl"><button id="connecControlButton">Apply Filter</button>`;
document.body.appendChild(scrollContainer);
scrollContainer.style.cssText = `${commonStyle}`;

createToggleElement('urlCustomizationForm', 'URL Form', urlCustomizationForm);
createToggleElement('adControlForm', 'Ad Control', adControlForm);
createToggleElement('scrollButton', 'Scroll', scrollContainer);

document.body.appendChild(controlPanel);


//------------ first script functions (Link save filters) ------------



    // Update form on initial page load
updateUrlParams();

// New MutationObserver to detect URL changes
let previousUrl = window.location.href;
const observer = new MutationObserver(mutations => {
  if (window.location.href !== previousUrl) {
    console.log(`URL changed from ${previousUrl} to ${window.location.href}`);
    previousUrl = window.location.href;
    updateUrlParams(); // Call your function to handle the URL change
  }
});

// The observer is not observing by default now. It will only start observing when the 'Start Observer' button is clicked.
// The 'Start Observer' button is added in the updateUrlParams function.

function updateUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);

    urlCustomizationForm.innerHTML = '';

    for (const [key, value] of urlParams) {
        const paramDiv = document.createElement('div');
        const label = document.createElement('label');
        const input = document.createElement('input');
        const toggleButton = document.createElement('button');

        label.setAttribute('for', `input_${key}`);
        label.textContent = `${key}: `;
        input.id = `input_${key}`;
        input.type = 'text';
        input.value = value;
        toggleButton.textContent = 'X';
        toggleButton.className = 'toggleParamBtn';
        toggleButton.dataset.key = key;

        toggleButton.addEventListener('click', function() {
            input.disabled = !input.disabled;
            label.style.textDecoration = input.disabled ? 'line-through' : 'none';

            if (input.disabled) {
                urlParams.delete(key);
            } else {
                urlParams.set(key, input.value);
            }
        });

        paramDiv.appendChild(label);
        paramDiv.appendChild(input);
        paramDiv.appendChild(toggleButton);
        urlCustomizationForm.appendChild(paramDiv);
    }

    const observerButton = document.createElement('button');
    observerButton.textContent = 'Start Observer';
    observerButton.addEventListener('click', function() {
        if (observerButton.textContent === 'Start Observer') {
            observer.observe(document.body, { childList: true, subtree: true });
            observerButton.textContent = 'Stop Observer';
        } else {
            observer.disconnect();
            observerButton.textContent = 'Start Observer';
        }
    });

    const updateUrlButton = document.createElement('button');
    updateUrlButton.textContent = 'Launch URL';
    updateUrlButton.addEventListener('click', function() {
        const newUrlParams = Array.from(urlCustomizationForm.querySelectorAll('input[type="text"]'))
            .filter(input => !input.disabled)
            .map(input => `${encodeURIComponent(input.id.replace('input_', ''))}=${encodeURIComponent(input.value)}`)
            .join('&');

        const newUrl = window.location.href.split('?')[0] + '?' + newUrlParams;
        window.open(newUrl, '_blank');
    });

    const runUrlButton = document.createElement('button');
    runUrlButton.textContent = 'Refresh URL';
    runUrlButton.addEventListener('click', function() {
        updateUrlParams();
    });

    urlCustomizationForm.appendChild(observerButton);
    urlCustomizationForm.appendChild(runUrlButton);
    urlCustomizationForm.appendChild(updateUrlButton);
}



//observer.disconnect(); // Turn off the observer by default


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
let scrollButton = document.getElementById("connecControlButton");
let ScrollObserver;

function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

const scrollToBottom = throttle(() => {
  window.scrollTo(0, document.body.scrollHeight);
}, 100);

const waitForItemsToLoad = () => {
  ScrollObserver = new MutationObserver(throttle((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        scrollToBottom();
        if (applyFilterCheckbox && applyFilterCheckbox.checked && scrolling) {
          applyFilter(); // Ensure applyFilter is a defined function
        }
      }
    });
  }, 100));

  const config = { childList: true, subtree: true };
  const targetNode = document.querySelector('body');
  ScrollObserver.observe(targetNode, config);

  return ScrollObserver;
};

scrollButton.onclick = throttle(() => {
  scrolling = !scrolling;
  scrollButton.innerText = scrolling ? 'Stop Scrolling' : 'Start Scrolling';
  if (scrolling) {
    scrollToBottom();
    ScrollObserver = waitForItemsToLoad();
  } else if (ScrollObserver) {
    ScrollObserver.disconnect();
  }
}, 100);



})();
