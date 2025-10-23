from flask import Flask, render_template, request
import os
app = Flask(__name__)

# the default route
@app.route("/")
def index():
      return render_template("index.html")

# *************************************************

# Task: Variables and JinJa Templates
@app.route("/t1")
def t1():
      the_topic = "donuts"
      number_of_donuts = 28
      donut_data= {
      "flavours":["Regular", "Chocolate", "Blueberry", "Devil's Food"],
      "toppings": ["None","Glazed","Sugar","Powdered Sugar",
                   "Chocolate with Sprinkles","Chocolate","Maple"]
                   }
      
      icecream_flavors = ["Vanilla","Raspberry","Cherry", "Lemon"]

      # Passing the values here
      return render_template("t1.html", the_topic = the_topic, number_of_donuts = number_of_donuts, donut_data = donut_data, icecream_flavors = icecream_flavors)

# *************************************************

#Task: HTML Form get & Data 
@app.route("/t2")
def t2():
    return render_template("t2.html")

@app.route("/thank_you_t2")
def thank_you_t2():
    app.logger.info(request.args)

    # Defining these out here because its annoying when they are in a line
    name = request.args["name"]
    email = request.args["email"]
    choice = request.args["choice"]
    amount = request.args["amount"]
    address = request.args["address"]
    delivery = request.args["delivery"]
    notes = request.args["notes"]

    # Also because doing something like this is much easier than doing replace a bunch of times
    nameAddressNotes = name + address + notes

    # For amount of these vowels in nameAddressNotes replace the current value with an asterisk
    for x in "aeiouAEIOU":
        nameAddressNotes = nameAddressNotes.replace(x, "*")

    # Passing the values here
    return render_template("thankyou_t2.html", name = name, email = email, choice = choice, amount = amount, address = address, delivery = delivery, notes = notes, nameAddressNotes = nameAddressNotes)



#*************************************************

#run
app.run(debug=True)