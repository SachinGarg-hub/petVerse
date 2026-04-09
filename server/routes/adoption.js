const router = require('express').Router();
const auth = require('../middleware/auth');
const {
  createListing,
  getAllListings,
  getListingById,
  updateListing,
  deleteListing,
  markAdopted,
} = require('../controllers/adoptionController');

router.post('/', auth, createListing);
router.get('/', getAllListings);
router.get('/:id', getListingById);
router.put('/:id', auth, updateListing);
router.delete('/:id', auth, deleteListing);
router.put('/:id/adopt', auth, markAdopted);

module.exports = router;
