# TE Dividend Visualization

A web-based dashboard that visualizes dividend data from companies worldwide using the Trading Economics API.

## Overview
This application provides a simple, intuitive interface to explore and analyze dividend payments across global companies. Users can search for specific companies and view their historical dividend data through interactive charts.

## Prerequisites
- Trading Economics API key (Sign up at [developer.tradingeconomics.com](https://developer.tradingeconomics.com))
  - Free tier available with limited data access

## Setup Instructions

1. Clone this repository
2. Create a `config.js` file in the `js` directory with your API credentials
3. Use the template provided in `config.example.js`

Example configuration:
```javascript
const CONFIG = {
    API_KEY: "your_api_key_here",
    BASE_URL: "https://api.tradingeconomics.com/v1"
};