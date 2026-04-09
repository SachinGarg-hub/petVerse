const Adoption = require('../models/Adoption');

exports.createListing = async (req, res) => {
  try {
    const listing = await Adoption.create({
      ...req.body,
      user: req.userId,
    });
    const populated = await listing.populate('user', 'username profilePic');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllListings = async (req, res) => {
  try {
    const { petType, age, location } = req.query;
    const filter = { isAdopted: false };

    if (petType) filter.petType = petType;
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (age) filter.age = age;

    const listings = await Adoption.find(filter)
      .populate('user', 'username profilePic')
      .sort({ createdAt: -1 });

    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getListingById = async (req, res) => {
  try {
    const listing = await Adoption.findById(req.params.id).populate(
      'user',
      'username profilePic email'
    );
    if (!listing)
      return res.status(404).json({ message: 'Listing not found' });
    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateListing = async (req, res) => {
  try {
    const listing = await Adoption.findById(req.params.id);
    if (!listing)
      return res.status(404).json({ message: 'Listing not found' });
    if (listing.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const updated = await Adoption.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteListing = async (req, res) => {
  try {
    const listing = await Adoption.findById(req.params.id);
    if (!listing)
      return res.status(404).json({ message: 'Listing not found' });
    if (listing.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    await Adoption.findByIdAndDelete(req.params.id);
    res.json({ message: 'Listing deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.markAdopted = async (req, res) => {
  try {
    const listing = await Adoption.findById(req.params.id);
    if (!listing)
      return res.status(404).json({ message: 'Listing not found' });
    if (listing.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    listing.isAdopted = true;
    await listing.save();
    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
