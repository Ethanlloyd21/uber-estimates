# [Uber Estimates Chrome Extension](https://chrome.google.com/webstore/detail/uber-estimates/ldbofjhefihijnbcidfhaekdfmkbbocn)

![alt text](http://i.imgur.com/beWO4TZ.png)
![alt text](http://imgur.com/Eg5eMDU.png)
![alt text](http://imgur.com/SrZF6PB.png)

## Usage

Enter a start and end location and see the estimated cost and wait time for various Uber options.

Uber does not return API results for trips > 100 miles.

## Google and Uber APIs

Uber has an API for both ride [price](https://developer.uber.com/docs/v1-estimates-price) and [time](https://developer.uber.com/docs/v1-estimates-time). Both of these APIs take a start latitude/longitude and the price API also takes end latitude/longitude values.

Google has an API for [place autocompletion](https://developers.google.com/places/web-service/autocomplete) which powers the input suggestions. The place autocompletion API also returns coordinates for each option; these coordinates are then fed to the Uber API.
