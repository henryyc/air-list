# Air List
AirBnB Analyzer

Completed as part of the Capital One SWE Summit MindSumo Challenge for 2017.
See it live here: [air-list.herokuapp.com](https://air-list.herokuapp.com)

Assumptions
======
*From the listings data, I assumed that if a listing was not available for any amount of time, that meant it was booked.*
*When using booking data, I used data for the next 90 days. I felt a month or two is too short, and a year is too long.*

Features
======
1. Data Visualization:
    * Cost: Heatmap based off of all provided AirBnB listings. Used the Google Maps Visualization API.
    * Popularity: Bubble chart based off of total number of listings per district, and total & percent of bookings per district.
    * SOON AAAAAH
    
2. Price Estimation:
    * Find other listings within 1 km distance, and average their weekly profit in the next 90 days.

3. Bookings Optimization:
    * Find other listings within 1 km distance, and take the top 10 most profitable listings.
    * From the top 10, take the average price and charge 10% below that.
