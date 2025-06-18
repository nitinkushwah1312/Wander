const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");


const validateListing = (req, res, next) =>{
    let { error } = listingSchema.validate(req.body);

    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// Index Route
router.get("/", wrapAsync(async(req,res) => {
    const allListings =  await Listing.find({});
    res.render("listings/index.ejs", {allListings});
    })
);
  
  
  //new Route
  router.get("/new",  (req,res)=>{
      res.render("listings/new.ejs");
  });
  
  
  //show route
  router.get("/:id",  wrapAsync(async(req,res) => {
      let {id } = req.params;
      const listing = await Listing.findById(id).populate("reviews");
      res.render("listings/show.ejs",{listing});
  }));
  
  // create route
  router.post("/", validateListing,
      wrapAsync(async (req,res,next)=> {
      // let {title,description etc} = req.body
      // let listing = req.body.listing;
      // console.log(listing);
      // if(!req.body.listing){
      //     throw new ExpressError(400,"send valid data for listing");
      // }
      //     const newListing =new Listing(req.body.listing);
      //     if(!newListing.title){
      //         throw new ExpressError(400, "Title is missing");
      //     }
      //     if(!newListing.description){
      //         throw new ExpressError(400, "Description is missing");
      //     }
      //     if(!newListing.location){
      //         throw new ExpressError(400, "location is missing");
      //     }  
         const newListing = new Listing(req.body.listing)
          await newListing.save();
          res.redirect("/listings");
      
  }));
  
  
  // edit rooute
  router.get("/:id/edit", wrapAsync(async(req,res) => {
      let { id} = req.params;
      const listing = await Listing.findById(id);
      res.render("listings/edit.ejs", {listing});
  }));
  
  //update route
  router.put("/:id", validateListing, wrapAsync(async(req,res) =>{
      // if(!req.body.listing){
      //     throw new ExpressError(400,"send valid data for listing");
      // }
      let { id} = req.params;
      await Listing.findByIdAndUpdate(id, {...req.body.listing});
      res.redirect(`/listings/${id}`);
  }));
  
  //delete route
  router.delete("/listings/:id", wrapAsync(async(req,res)=>{
      let {id} = req.params;
      let deletedListing = await Listing.findByIdAndDelete(id);
      console.log(deletedListing);
      res.redirect("/listings");
  }));
  
  module.exports = router;