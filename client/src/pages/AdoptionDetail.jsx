import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAdoptionById, createConversation } from '../api';
import { useAuth } from '../context/AuthContext';
import { HiOutlineLocationMarker, HiOutlineMail, HiOutlinePhone, HiChevronLeft } from 'react-icons/hi';
import { MdOutlinePets, MdFormatQuote } from 'react-icons/md';
import { motion } from 'framer-motion';

const AdoptionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const res = await getAdoptionById(id);
        setPet(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPet();
  }, [id]);

  const handleContactOwner = async () => {
    if (!pet) return;
    try {
      await createConversation(pet.user._id);
      navigate('/chat');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-12 h-12 border-4 border-petverse-purple border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-gray-500 font-medium tracking-wide">Finding your buddy...</p>
    </div>
  );

  if (!pet) return (
    <div className="text-center py-20 card max-w-lg mx-auto">
      <h3 className="text-2xl font-bold dark:text-white mb-2">Pet not found</h3>
      <p className="text-gray-500 mb-6">This listing might have been removed or already adopted.</p>
      <button onClick={() => navigate('/adoption')} className="btn-primary">Back to Adoption</button>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto pb-12"
    >
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-gray-500 hover:text-petverse-purple font-bold mb-6 transition-colors group"
      >
        <HiChevronLeft className="group-hover:-translate-x-1 transition-transform" size={24} />
        Back to Listings
      </button>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left: Image Gallery */}
        <div className="flex-1">
          <div className="sticky top-24">
            <div className="rounded-[40px] overflow-hidden shadow-2xl bg-gray-100 dark:bg-white/5 aspect-[4/5] relative">
              <img src={pet.imageUrl} alt={pet.petName} className="w-full h-full object-cover" />
              {pet.isAdopted && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                  <span className="px-8 py-4 bg-white text-black font-black text-2xl rounded-full rotate-12 shadow-2xl">
                    ALREADY ADOPTED 💖
                  </span>
                </div>
              )}
            </div>
            
            <div className="mt-8 flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
               {[1,2,3].map(i => (
                 <div key={i} className="w-24 h-24 rounded-3xl bg-gray-100 dark:bg-white/5 overflow-hidden flex-shrink-0 cursor-pointer hover:ring-4 ring-petverse-purple transition-all">
                    <img src={pet.imageUrl} className="w-full h-full object-cover opacity-50" />
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Right: Info */}
        <div className="flex-1 space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-4 py-1.5 rounded-full bg-petverse-purple/10 text-petverse-purple text-xs font-black uppercase tracking-widest border border-petverse-purple/20">
                {pet.petType}
              </span>
              <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${pet.gender === 'Male' ? 'bg-blue-50 text-blue-500 border-blue-100' : 'bg-pink-50 text-pink-500 border-pink-100'}`}>
                {pet.gender}
              </span>
            </div>
            <h1 className="text-5xl font-display font-black text-gray-800 dark:text-white mb-2 leading-tight">
              {pet.petName} <span className="text-petverse-purple">.</span>
            </h1>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-medium">
              <HiOutlineLocationMarker size={20} className="text-petverse-pink" />
              <span>{pet.location}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="card p-5 border border-gray-100 dark:border-white/5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Breed</p>
              <p className="text-lg font-black text-gray-800 dark:text-white">{pet.breed || 'Unknown'}</p>
            </div>
            <div className="card p-5 border border-gray-100 dark:border-white/5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Age</p>
              <p className="text-lg font-black text-gray-800 dark:text-white">{pet.age}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-black text-gray-800 dark:text-white flex items-center gap-2">
              <MdOutlinePets className="text-petverse-purple" />
              About {pet.petName}
            </h3>
            <div className="relative">
              <MdFormatQuote className="absolute -left-4 -top-2 text-4xl text-petverse-purple/10" />
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg font-medium">
                {pet.description}
              </p>
            </div>
          </div>

          <div className="card p-8 space-y-6 bg-gradient-to-br from-white to-purple-50 dark:from-white/5 dark:to-purple-900/5 border-purple-100 dark:border-purple-800/10 shadow-glass-lg">
            <div className="flex items-center gap-4">
              <img src={pet.user.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${pet.user.username}`} className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md" alt="owner" />
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Listed by</p>
                <p className="text-lg font-black text-gray-800 dark:text-white leading-none">{pet.user.username}</p>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-purple-100/50 dark:border-white/5">
               <div className="flex items-center gap-3 text-sm font-bold text-gray-600 dark:text-gray-400">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/5 flex items-center justify-center text-petverse-purple shadow-sm">
                    <HiOutlineMail size={20} />
                  </div>
                  {pet.contactEmail}
               </div>
               {pet.contactPhone && (
                 <div className="flex items-center gap-3 text-sm font-bold text-gray-600 dark:text-gray-400">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/5 flex items-center justify-center text-petverse-pink shadow-sm">
                      <HiOutlinePhone size={20} />
                    </div>
                    {pet.contactPhone}
                 </div>
               )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
               {currentUser?._id !== pet.user._id && !pet.isAdopted && (
                 <button 
                  onClick={handleContactOwner}
                  className="btn-primary flex-1 py-4 text-center text-base"
                 >
                   Chat with Owner
                 </button>
               )}
               <button className="btn-outline flex-1 py-4 text-center text-base">
                 Adopt {pet.petName}
               </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdoptionDetail;
