# Air List
AirBnB Analyzer

Completed as part of the Capital One SWE Summit MindSumo Challenge for 2017.
See it live here: [air-list.herokuapp.com](https://air-list.herokuapp.com)

Assumptions
======
*From the listings data, I assumed that if a listing was not available for any amount of time, that meant it was booked.*
*When using booking data, I used data for the next 90 days. I felt a month or two is too short, and a year is too long.*
*For the investment calculation, I used [TrustedChoice's](https://www.trustedchoice.com/insurance-articles/home-family/buying-a-condo-or-rent/) example of a Price to Annual Rent ratio of 16.7. I also used the average cleaning cost in San Francisco from [HomeAdvisor](https://www.homeadvisor.com/cost/cleaning-services/), and assumed about a week average stay per booking.*
*For the price estimation, I factored in a 3% fee from AirBnB, sourced from [RentingYourPlace](http://rentingyourplace.com/airbnb-101/pricing/to-fee-or-not-to-fee/).*

Features
======
1. Data Visualization:
    * Cost: Heatmap based off of all provided AirBnB listings. Used the Google Maps Visualization API.
    * Popularity: Bubble chart based off of total number of listings per district, and total & percent of bookings per district.
    * Investment: Area Chart, graphed district by district. Can change the currently graphed district with a dropdown menu.
    
2. Price Estimation:
    * Find other listings within 1 km distance, and average their weekly profit in the next 90 days.

3. Bookings Optimization:
    * Find other listings within 1 km distance, and charge 10% below the average price rate.
