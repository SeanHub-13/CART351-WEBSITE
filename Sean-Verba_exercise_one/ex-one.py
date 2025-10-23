# Imports the lib
import requests

# The API key / Token is an access code basically
token = "a2af25586bdde0c3263186c483372892c08c707a"

# Just the URL needed to access the API
url = "https://api.waqi.info/search/"

# This is our request to the API, basically this is us asking for it to give us stored information
# This time specifically on the parameters listed
response = requests.get(url, params={"token": token, "keyword": "montreal"})

# This displays the response as a JSON so that its readable
results = response.json()

# Prints the results
# print(results)


# Q1: In your script write the code to get the type of the results variable. Run the code and document the answer.

print(type(results))

# A1: <class 'dict'> - A dictionary.

# Q2: In your script write the code to get the keys of the results variable. Run the code and document the answer

print(results.keys())

# A2: dict_keys(['status', 'data'])

# Q3: Save the result from the expression as a variable called responseData. Then find out the type of responseData ... Document your findings.

responseData = results["data"]
print(type(responseData))

# A3: <class 'list'>

# Q4: What is the result of running the following code (put the code after the assignment above)

for item in responseData:
    print(item["station"])
    print("UID: ", item["uid"])
    print("lat: ", item["station"]["geo"][0])
    print("long: ", item["station"]["geo"][1])
    print("Air Quality: ", item["aqi"])

# A4: Ex: {'uid': 5922, 'aqi': '24', 'time': {'tz': '-04:00', 'stime': '2025-09-22 14:00:00', 'vtime': 1758564000}, 'station': {'name': 'Montreal', 'geo': [45.5086699, -73.5539925], 'url': 'montreal'}}

# Q5: What does each item represent?

# A5: Different locatins in Montreal, specifically in Montreal because of our keyword parameter when accessing the API

# Q6: Write the code to determine the type of the item variable

print(type(item))

# A6: <class 'dict'>

# Q7: Write the code to determine the keys associated with the item variable

print(item.keys())

# A7: dict_keys(['uid', 'aqi', 'time', 'station'])

# Q8: Modify the code above to now print out the name of each station from the responseData. Document the results.

# A8: {'name': 'Échangeur Décarie, Montreal, Canada', 'geo': [45.502648, -73.663913], 'url': 'canada/montreal/echangeur-decarie', 'country': 'CA'}

# Q9: Append the code above to also print out the geolocations of each station from the responseData.

# A9: Ex: 
# {'name': 'Aéroport de Montréal, Montreal, Canada', 'geo': [45.468297, -73.741185], 'url': 'canada/montreal/aeroport-de-montreal'}
# lat:  45.468297
# long:  -73.741185

# Q10: Append the code above to print out the air quality index for each item AND the uid for each item. 
# The output needs to be neat and labelled!

# A10:
# {'name': 'Sainte-Anne-de-Bellevue, Montreal, Canada', 'geo': [45.426509, -73.928944], 'url': 'canada/montreal/sainte-anne-de-bellevue'}
# UID:  5468
# lat:  45.426509
# long:  -73.928944
# Air Quality:  30

# Q11: Add the above code and run it

url_feed = "https://api.waqi.info/feed/@5468"
response_feed = requests.get(url_feed, params={"token": token})
results_feed = response_feed.json()
print(results_feed)

# A11: V(o_o)V

# Q12: So - now write the code to access the content associated with the data field. 
# Save the result from the expression as a variable called response_data_feed. What is the type of this variable

response_data_feed = results_feed["data"]
print(type(response_data_feed))

# A12: <class 'dict'>

# Q13: Write a for loop to iterate through the `response_data_feed` variable . Document the results

for item in response_data_feed:
    print(item)

# A13: 
# aqi
#idx
#attributions
#city
#dominentpol
#iaqi
#time
#forecast
#debug

# Q14: Next write the expression to access the aqi field and the dominentpol field
# According to the documentation what does this field represent? Save both values in new variables.

airQualityInfo = response_data_feed["aqi"]
dominantPollutor = response_data_feed["dominentpol"]

print("Air Quality Info: ", airQualityInfo)
print("Dominant Pollutor: ", dominantPollutor)

# A14: One is air quality info, the other is the dominant pollutor in the area, that being pm25(Particulate Matter less than 2.5 microns in width)

# Q15:OK ... now access you will access the iaqi field. You will see that the result is another dictionary, with keys for different pollutants. 
# Each one of those keys—somewhat inexplicably—has another dictionary for its values, whose only key (`v`) points to the actual value for that pollutant... 
# Write the code and document your results

measurementTimeInfo = response_data_feed["iaqi"]
print(measurementTimeInfo)

# A15: {'co': {'v': 6.4}, 'h': {'v': 78.8}, 'no2': {'v': 3.7}, 'o3': {'v': 18}, 'p': {'v': 1012.9}, 'pm25': {'v': 30}, 'so2': {'v': 5.1}, 't': {'v': 19.2}, 'w': {'v': 1.6}, 'wg': {'v': 2.6}}

# Q16: Well now - we want to use the value from the dominentpol field to access the actual value for that pollutant... (i.e. say the `dominentpol =so2') 
# How can we use the data from the iaqi field to access the actual value? ...
# Hint: the keys from the iaqi dictionary map directly to the `dominentpol` field.
# Write the code to access this value...and document your results

dominantPollutorValue = measurementTimeInfo[dominantPollutor]["v"]
print("Dominant Pollutor Value: ", dominantPollutorValue)

# A16: Dominant Pollutor Value:  30

# Q17: So - now that you can access the feed for a specific station in a particular city, 
# and from that feed you can access the value of its dominant pollutant.... : 
# explain theoretically (you do not have to write the code) what the process would be to 
# access the value of the dominant pollutant value from different cities ...

# A17: Theoretically, we would need to either create a loop based on the amount of cities, or perhaps an input panel in our console so that we can enter
# a name of a city. This value would then be saved and converted into that cities uid, which would also be stored in a variable.
# That variable would be put at the end of a modified url_feed variable instead of the hard-coded uid we put there as of now.
# This would allow a user to view the data of any individual city instead of the one we analyzed now, which means we can simply leave the rest of
# our code the same, and it will display the correct values.