import Listing from "../models/listingModel.js"
import { errorHandler } from "../utils/error.js"

export const createListing = async (req, res) => {
  try {
    const listing = await Listing.create(req.body) 
    res.status(201).json(listing)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id)
  if (!listing) {
    return next(errorHandler(404, "Listing not found"))
  }
  if (req.user._id !== listing.userRef) {
    return next(errorHandler(401, "You can only delete your own listing"))
  }

  try {
    await Listing.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: "Listing was deleted successfully" })
  } catch (error) {
    next(error)
  }
}

export const updatedListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id)
  if (!listing) {
    return next(errorHandler(404, "Listing not found"))
  }
  if (req.user._id !== listing.userRef) {
    return next(errorHandler(401, "You can only update your own listing"))
  }
  try {
    const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.status(200).json(updatedListing)
  } catch (error) {
    next(error)
  }
}

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id)
    if (!listing) {
      return next(errorHandler(404, "Listing not found"))
    }
    res.status(200).json(listing)
  } catch (error) {
    next(error)
  }
}
