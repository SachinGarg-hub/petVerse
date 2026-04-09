import { useState, useEffect } from 'react';
import { getAdoptions } from '../api';
import { HiOutlineLocationMarker, HiOutlineFilter, HiPlus } from 'react-icons/hi';
import { MdOutlinePets } from 'react-icons/md';
import { Link } from 'react-router-dom';
import CreateAdoptionModal from '../components/CreateAdoptionModal';

const PetCard = ({ pet }) => (
  <div className="card group overflow-hidden animate-scale-in">
    <div className="relative aspect-[4/5] overflow-hidden">
      <img 
        src={pet.imageUrl} 
        alt={pet.petName} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
      />
      <div className="absolute top-4 left-4 flex gap-2">
        <span className="px-3 py-1 rounded-full glass backdrop-blur-md text-[10px] font-bold text-gray-800 uppercase tracking-wider">
          {pet.petType}
        </span>
        <span className="px-3 py-1 rounded-full glass backdrop-blur-md text-[10px] font-bold text-gray-800 uppercase tracking-wider">
          {pet.age}
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white transform translate-y-2 group-hover:translate-y-0 transition-transform">
        <div className="flex items-center gap-1 text-xs opacity-90">
          <HiOutlineLocationMarker />
          <span>{pet.location}</span>
        </div>
      </div>
    </div>
    <div className="p-5">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white leading-tight">{pet.petName}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{pet.breed || 'Mixed Breed'}</p>
        </div>
        <span className={pet.gender === 'Male' ? 'text-blue-500' : 'text-pink-500'}>
          {pet.gender === 'Male' ? '♂' : '♀'}
        </span>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4 h-10">
        {pet.description}
      </p>
      <Link 
        to={`/adoption/${pet._id}`}
        className="w-full py-3 rounded-2xl bg-petverse-purple/10 text-petverse-purple font-bold text-sm block text-center hover:bg-petverse-purple hover:text-white transition-all"
      >
        Meet {pet.petName}
      </Link>
    </div>
  </div>
);

const Adoption = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ petType: '', location: '', age: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPets = async () => {
    setLoading(true);
    try {
      const res = await getAdoptions(filters);
      setPets(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, [filters]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-extrabold text-gray-800 dark:text-white mb-2">Find a Friend</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Hundreds of lovable pets are waiting for a home. 🏠🐾</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-4 rounded-2xl glass border transition-all ${showFilters ? 'border-petverse-purple text-petverse-purple shadow-glow' : 'border-gray-200 dark:border-white/10 text-gray-500'}`}
          >
            <HiOutlineFilter size={24} />
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <HiPlus size={20} />
            <span>Post Listing</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      {showFilters && (
        <div className="card p-6 grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-down">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Pet Type</label>
            <select 
              className="input-field appearance-none"
              value={filters.petType}
              onChange={(e) => setFilters({ ...filters, petType: e.target.value })}
            >
              <option value="">All Pets</option>
              <option value="Dog">Dogs</option>
              <option value="Cat">Cats</option>
              <option value="Bird">Birds</option>
              <option value="Rabbit">Rabbits</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Location</label>
            <input 
              type="text"
              placeholder="e.g. New York"
              className="input-field"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Age</label>
            <select 
              className="input-field appearance-none"
              value={filters.age}
              onChange={(e) => setFilters({ ...filters, age: e.target.value })}
            >
              <option value="">Any Age</option>
              <option value="Puppy/Kitten">Puppy/Kitten</option>
              <option value="Young">Young</option>
              <option value="Adult">Adult</option>
              <option value="Senior">Senior</option>
            </select>
          </div>
        </div>
      )}

      {/* Results Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="card h-[450px] animate-pulse-slow p-4 flex flex-col gap-4">
              <div className="flex-1 bg-gray-200 dark:bg-white/5 rounded-2xl" />
              <div className="h-6 w-2/3 bg-gray-200 dark:bg-white/5 rounded" />
              <div className="h-10 w-full bg-gray-200 dark:bg-white/5 rounded-xl" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {pets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {pets.map(pet => (
                <PetCard key={pet._id} pet={pet} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 card">
              <div className="inline-flex w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-full items-center justify-center text-gray-300 mb-6">
                <MdOutlinePets size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">No buddies found</h3>
              <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters or checking back later!</p>
            </div>
          )}
        </>
      )}
      <CreateAdoptionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onRefresh={fetchPets} 
      />
    </div>
  );
};

export default Adoption;
