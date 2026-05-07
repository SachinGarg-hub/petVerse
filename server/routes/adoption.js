const router = require('express').Router();
const auth = require('../middleware/auth');
const checkDemo = require('../middleware/checkDemo');
const {
  createListing,
  getAllListings,
  getListingById,
  updateListing,
  deleteListing,
  markAdopted,
} = require('../controllers/adoptionController');

router.post('/', auth, checkDemo, createListing);
router.get('/', getAllListings);
router.get('/:id', getListingById);
router.put('/:id', auth, checkDemo, updateListing);
router.delete('/:id', auth, checkDemo, deleteListing);
router.put('/:id/adopt', auth, checkDemo, markAdopted);

module.exports = router;
