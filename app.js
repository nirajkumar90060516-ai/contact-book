
// 1) Modules import
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");

const app = express();

// 2) Middleware
app.use(express.urlencoded({ extended: true }));  
app.use(express.json());                          

app.use(expressLayouts);                         
app.set("layout", "layout");                  

// Static files (CSS, JS, Images)
app.use(express.static(path.join(__dirname, "public")));

// View Engine (EJS)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// 3) MongoDB Connection
const MONGO_URL = "mongodb://127.0.0.1:27017/contactbook";

async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((err) => console.log("MongoDB error:", err));

// 4) Contact Schema + Model
const contactSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String
});

const Contact = mongoose.model("Contact", contactSchema);

// Home Route (Search + List )

app.get("/", async (req, res) => {
    const q = req.query.q || "";             // Search query (empty )
    let contacts = [];

    if (q) {
        // search वाला result
        contacts = await Contact.find({ 
            name: { $regex: q, $options: "i" }
        });
    } else {
        // सारे contacts दिखाओ
        contacts = await Contact.find();
    }

    res.render("index", { q, contacts });
});


// Contact Create

app.post("/contacts", async (req, res) => {
    await Contact.create(req.body);
    res.redirect("/");
});

// 6) Server Start
app.listen(8080, () => {
    console.log("Server running on port 8080");
});
