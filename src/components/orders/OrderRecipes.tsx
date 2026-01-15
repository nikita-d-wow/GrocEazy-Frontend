import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Utensils,
  Clock,
  Flame,
  ChefHat,
  ArrowRight,
  X,
  Check,
  ShoppingCart,
  Info,
  Sparkles,
  Hammer,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Order } from '../../redux/types/orderTypes';
import { generateSmartSuggestion } from '../../services/AIChefService';
import type { AISuggestion } from '../../services/AIChefService';
import toast from 'react-hot-toast';

interface OrderRecipesProps {
  order: Order;
}

// Extended Mock Database with Ingredients and Instructions
const RECIPE_DATABASE = [
  {
    id: 1,
    name: 'Spicy Basil Pasta',
    keywords: ['pasta', 'tomato', 'basil', 'garlic', 'cheese', 'sauce'],
    image:
      'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=80',
    time: '25 min',
    calories: '450 kcal',
    difficulty: 'Easy',
    ingredients: [
      'Pasta',
      'Tomato Sauce',
      'Fresh Basil',
      'Garlic Cloves',
      'Parmesan Cheese',
      'Olive Oil',
      'Chili Flakes',
    ],
    instructions: [
      'Boil pasta in salted water until al dente.',
      'Sauté garlic and chili flakes in olive oil.',
      'Add tomato sauce and simmer for 10 minutes.',
      'Toss pasta with sauce and fresh basil.',
      'Serve topped with generous parmesan cheese.',
    ],
    category: 'meal',
  },
  {
    id: 2,
    name: 'Fresh Garden Salad',
    keywords: ['lettuce', 'tomato', 'cucumber', 'onion', 'lemon', 'vegetable'],
    image:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    time: '15 min',
    calories: '180 kcal',
    difficulty: 'Easy',
    ingredients: [
      'Lettuce Head',
      'Cherry Tomatoes',
      'Cucumber',
      'Red Onion',
      'Lemon',
      'Olive Oil',
      'Black Pepper',
    ],
    instructions: [
      'Chop lettuce, cucumber, and tomatoes into bite-sized pieces.',
      'Thinly slice the red onion.',
      'Whisk lemon juice, olive oil, salt, and pepper for dressing.',
      'Toss vegetables with dressing just before serving.',
    ],
    category: 'meal',
  },
  {
    id: 3,
    name: 'Grilled Chicken Feast',
    keywords: ['chicken', 'lemon', 'garlic', 'herb', 'oil', 'meat'],
    image:
      'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=800&q=80',
    time: '45 min',
    calories: '620 kcal',
    difficulty: 'Medium',
    ingredients: [
      'Chicken Breast',
      'Lemon',
      'Garlic',
      'Mixed Herbs',
      'Butter',
      'Asparagus',
    ],
    instructions: [
      'Marinate chicken with lemon juice, garlic, and herbs.',
      'Grill chicken for 6-7 minutes per side.',
      'Sauté asparagus in butter until tender.',
      'Serve hot with lemon wedges.',
    ],
    category: 'meal',
  },
  {
    id: 4,
    name: 'Classic Omelette',
    keywords: ['egg', 'milk', 'butter', 'cheese', 'onion', 'breakfast'],
    image:
      'https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&w=800&q=80',
    time: '10 min',
    calories: '320 kcal',
    difficulty: 'Easy',
    ingredients: [
      'Eggs',
      'Milk',
      'Butter',
      'Cheddar Cheese',
      'Green Onion',
      'Salt',
      'Pepper',
    ],
    instructions: [
      'Whisk eggs, milk, salt, and pepper in a bowl.',
      'Melt butter in a non-stick pan over medium heat.',
      'Pour in eggs and let set slightly.',
      'Sprinkle cheese and onions, then fold over.',
      'Cook until cheese melts.',
    ],
    category: 'meal',
  },
  {
    id: 5,
    name: 'Loaded Party Nachos',
    keywords: [
      'chips',
      'cheese',
      'salsa',
      'coke',
      'pepsi',
      'sprite',
      'drink',
      'snack',
      'soda',
    ],
    image:
      'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=800&q=80',
    time: '15 min',
    calories: '550 kcal',
    difficulty: 'Easy',
    ingredients: [
      'Tortilla Chips',
      'Cheddar Cheese',
      'Jalapeños',
      'Salsa',
      'Sour Cream',
      'Guacamole',
    ],
    instructions: [
      'Spread chips on a baking sheet.',
      'Top generously with cheese and jalapeños.',
      'Bake at 400°F (200°C) for 5-10 minutes until melted.',
      'Serve immediately with salsa, sour cream, and guacamole.',
      'Perfect pairing for your cold drinks!',
    ],
    category: 'snack',
  },
  {
    id: 6,
    name: 'Refreshing Lime Mojito (Mocktail)',
    keywords: ['lemon', 'lime', 'mint', 'soda', 'sprite', 'drink', 'beverage'],
    image:
      'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    time: '5 min',
    calories: '90 kcal',
    difficulty: 'Easy',
    ingredients: [
      'Fresh Lime',
      'Mint Leaves',
      'Sugar/Syrup',
      'Club Soda/Sprite',
      'Ice',
    ],
    instructions: [
      'Muddle mint leaves and lime wedges in a glass.',
      'Add sugar or syrup.',
      'Fill glass with ice.',
      'Top with soda and stir gently.',
      'Garnish with a sprig of mint.',
    ],
    category: 'drink',
  },
];

import { useNavigate } from 'react-router-dom';

export default function OrderRecipes({ order }: OrderRecipesProps) {
  const navigate = useNavigate();
  const [selectedRecipe, setSelectedRecipe] = useState<
    (typeof RECIPE_DATABASE)[0] | null
  >(null);

  // Derive extracted keywords from order items
  const orderKeywords = useMemo(() => {
    if (!order?.items) {
      return [];
    }
    return order.items
      .map((item) => {
        if (item?.productId && typeof item.productId === 'object') {
          return item.productId.name.toLowerCase().split(' ');
        }
        return [];
      })
      .flat();
  }, [order?.items]);

  const matchedRecipes = useMemo(() => {
    const matches = RECIPE_DATABASE.map((recipe) => {
      const matchCount = recipe.keywords.filter((k) =>
        orderKeywords.some((ok) => ok.includes(k))
      ).length;
      return { ...recipe, matchCount };
    });

    // Filter: If we have matches > 0, show them.
    const goodMatches = matches.filter((m) => m.matchCount > 0);

    if (goodMatches.length > 0) {
      return goodMatches
        .sort((a, b) => b.matchCount - a.matchCount)
        .slice(0, 3);
    }

    // FALLBACK: If "soda" or "pepsi" etc is in extracted strings but didn't match specific keywords enough,
    // or just general fallback, prefer Snacks/Drinks over Meals.
    const isDrinkOrder = orderKeywords.some((k) =>
      ['pepsi', 'coke', 'sprite', 'soda', 'drink', 'beverage'].includes(k)
    );

    if (isDrinkOrder) {
      return matches
        .filter((r) => r.category === 'snack' || r.category === 'drink')
        .slice(0, 2)
        .map((r) => ({ ...r, matchCount: 0 }));
    }

    // Generic Fallback (Top 2 trending)
    return matches.slice(0, 2).map((r) => ({ ...r, matchCount: 0 }));
  }, [orderKeywords]);

  // Helper to check if user likely has an ingredient
  const hasIngredient = (ingredient: string) => {
    return orderKeywords.some((k) => ingredient.toLowerCase().includes(k));
  };

  // AI Logic
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [showAllSteps, setShowAllSteps] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<AISuggestion | null>(null);

  const handleAskChef = async () => {
    setShowAiModal(true);
    setIsGenerating(true);
    setAiSuggestion(null);

    try {
      // Use Real Smart Assistant
      const suggestion = await generateSmartSuggestion(orderKeywords);
      setAiSuggestion(suggestion);
    } catch (error) {
      toast.error('AI Assistant is busy!');
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper for UI Icons based on Type
  const getHeaderIcon = (type?: string) => {
    switch (type) {
      case 'ROUTINE':
        return (
          <Sparkles
            size={48}
            className="mx-auto mb-3 text-purple-200 animate-pulse"
          />
        );
      case 'HACK':
        return (
          <Hammer
            size={48}
            className="mx-auto mb-3 text-blue-200 animate-bounce"
          />
        );
      default:
        return (
          <ChefHat
            size={48}
            className="mx-auto mb-3 text-orange-200 animate-bounce"
          />
        );
    }
  };

  const getTypeColor = (type?: string) => {
    switch (type) {
      case 'ROUTINE':
        return 'bg-purple-600';
      case 'HACK':
        return 'bg-blue-600';
      default:
        return 'bg-orange-600';
    }
  };

  // Dominant Category Logic
  const dominantCategory = useMemo(() => {
    let foodCount = 0;
    let beautyCount = 0;
    let householdCount = 0;

    const allKeywords = orderKeywords.map((k) => k.toLowerCase());

    allKeywords.forEach((k) => {
      if (
        [
          'pasta',
          'chicken',
          'sauce',
          'cheese',
          'milk',
          'egg',
          'bread',
          'fruit',
          'vegetable',
          'snack',
          'drink',
          'soda',
          'coke',
          'pepsi',
          'butter',
          'oil',
          'salt',
          'pepper',
        ].includes(k)
      ) {
        foodCount++;
      }
      if (
        [
          'shampoo',
          'soap',
          'wash',
          'lotion',
          'cream',
          'face',
          'body',
          'shower',
          'gel',
          'moisturizer',
          'serum',
          'mask',
        ].includes(k)
      ) {
        beautyCount++;
      }
      if (
        [
          'detergent',
          'cleaner',
          'spray',
          'tissue',
          'paper',
          'brush',
          'mop',
          'wipe',
          'bleach',
          'soap',
        ].includes(k)
      ) {
        householdCount++;
      }
    });

    if (beautyCount > foodCount && beautyCount > householdCount) {
      return 'BEAUTY';
    }
    if (householdCount > foodCount && householdCount > beautyCount) {
      return 'HOUSEHOLD';
    }
    return 'FOOD'; // Default
  }, [orderKeywords]);

  // Derived Banner Props
  const bannerProps = useMemo(() => {
    switch (dominantCategory) {
      case 'BEAUTY':
        return {
          gradient: 'from-purple-500 to-pink-500',
          icon: Sparkles,
          title: 'Unlock Your Glow Routine',
          desc: 'Get a personalized self-care ritual based on your beauty haul.',
        };
      case 'HOUSEHOLD':
        return {
          gradient: 'from-blue-500 to-cyan-500',
          icon: Hammer,
          title: 'Unlock Cleaning Hacks',
          desc: 'Discover pro tips and hacks using your new cleaning supplies.',
        };
      default:
        return {
          gradient: 'from-orange-500 to-red-500',
          icon: ChefHat,
          title: 'Unlock Chef Recipes',
          desc: 'Turn your groceries into a 5-star meal with one click.',
        };
    }
  }, [dominantCategory]);

  const BannerIcon = bannerProps.icon;

  return (
    <>
      {/* NEW AI BANNER */}
      <div
        className={`w-full rounded-3xl p-1 bg-gradient-to-r ${bannerProps.gradient} shadow-xl mb-8 transform hover:scale-[1.01] transition-all cursor-pointer group`}
        onClick={handleAskChef}
      >
        <div className="bg-white/10 backdrop-blur-sm rounded-[20px] p-6 sm:p-8 flex items-center justify-between relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-white/20 transition-colors"></div>

          <div className="relative z-10 flex-1 pr-4">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold mb-3 border border-white/10">
              <Sparkles size={12} className="animate-pulse" />
              AI SMART COMPANION
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white mb-2 tracking-tight">
              {bannerProps.title}
            </h3>
            <p className="text-white/90 font-medium text-sm sm:text-base max-w-lg">
              {bannerProps.desc}
            </p>
          </div>

          <div className="relative z-10 bg-white text-gray-900 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            {isGenerating ? (
              <div className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <BannerIcon
                size={28}
                className={
                  dominantCategory === 'BEAUTY'
                    ? 'text-purple-600'
                    : dominantCategory === 'HOUSEHOLD'
                      ? 'text-blue-600'
                      : 'text-orange-600'
                }
              />
            )}
          </div>
        </div>
      </div>

      {/* Existing "Cook with your Order" section (Hidden if AI is active or optional) - Keeping it but pushing it down or making it secondary as requested */}
      {dominantCategory === 'FOOD' && (
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-3xl border border-orange-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200/20 rounded-full blur-3xl"></div>

          <div className="flex items-center justify-between mb-6 relative z-10">
            <h3 className="font-bold text-gray-900 flex items-center gap-2 text-lg">
              <ChefHat size={20} className="text-orange-500" />
              Classic Recipes
            </h3>
          </div>

          {matchedRecipes.length === 0 ? (
            <div className="text-center py-10 bg-white/50 rounded-2xl border border-orange-100 border-dashed">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Utensils className="text-orange-400" size={24} />
              </div>
              <p className="text-gray-500 font-medium">
                No classic recipes match your cart.
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Try the AI Assistant above for custom ideas!
              </p>
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
              {matchedRecipes.map((recipe) => {
                const matchPercentage = Math.round(
                  (recipe.matchCount / recipe.keywords.length) * 100
                );

                return (
                  <motion.div
                    key={recipe.id}
                    whileHover={{ y: -5 }}
                    onClick={() => setSelectedRecipe(recipe)}
                    className="min-w-[260px] md:min-w-[280px] bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden cursor-pointer snap-start hover:shadow-md transition-all"
                  >
                    <div className="h-40 relative">
                      <img
                        src={recipe.image}
                        className="w-full h-full object-cover"
                        alt={recipe.name}
                      />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-orange-600 shadow-sm flex items-center gap-1">
                        <Flame size={12} fill="currentColor" />{' '}
                        {matchPercentage > 100 ? 100 : matchPercentage}% Match
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {recipe.time}
                        </span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className="text-orange-500 font-medium">
                          {recipe.calories}
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-900 mb-1 line-clamp-1">
                        {recipe.name}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-4">
                        Uses your{' '}
                        <span className="font-medium text-orange-600">
                          {orderKeywords
                            .filter((k) => recipe.keywords.includes(k))
                            .slice(0, 2)
                            .join(', ')}
                        </span>
                        ...
                      </p>
                      <button className="w-full bg-orange-50 text-orange-600 font-bold py-2 rounded-xl text-xs hover:bg-orange-100 transition-colors flex items-center justify-center gap-1">
                        View Recipe <ArrowRight size={12} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* FULL SCREEN RECIPE MODAL */}
      {createPortal(
        <AnimatePresence>
          {selectedRecipe && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 sm:p-6"
              onClick={() => setSelectedRecipe(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative"
              >
                <button
                  onClick={() => setSelectedRecipe(null)}
                  className="absolute top-4 right-4 z-20 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white hover:text-gray-900 transition-all shadow-lg"
                >
                  <X size={20} />
                </button>

                {/* Scrollable Content (Image Included now) */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  {/* Header Image */}
                  <div className="h-48 sm:h-64 relative">
                    <img
                      src={selectedRecipe.image}
                      className="w-full h-full object-cover"
                      alt={selectedRecipe.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                    <div className="absolute bottom-0 left-0 p-6 text-white w-full">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-orange-500 px-2 py-0.5 rounded text-xs font-bold">
                          {selectedRecipe.difficulty}
                        </span>
                        <span className="bg-black/30 backdrop-blur-md px-2 py-0.5 rounded text-xs flex items-center gap-1">
                          <Clock size={12} /> {selectedRecipe.time}
                        </span>
                      </div>
                      <h2 className="text-3xl font-bold">
                        {selectedRecipe.name}
                      </h2>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Left: Ingredients */}
                      <div>
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <Utensils size={18} className="text-orange-500" />{' '}
                          Ingredients
                        </h3>
                        <ul className="space-y-3">
                          {selectedRecipe.ingredients?.map((ing, i) => {
                            const haveIt = hasIngredient(ing);
                            return (
                              <li
                                key={i}
                                className="flex items-start gap-3 text-sm"
                              >
                                <div
                                  className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${haveIt ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-300'}`}
                                >
                                  {haveIt ? (
                                    <Check size={12} strokeWidth={3} />
                                  ) : (
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                                  )}
                                </div>
                                <span
                                  className={
                                    haveIt
                                      ? 'text-gray-900 font-medium'
                                      : 'text-gray-500'
                                  }
                                >
                                  {ing}
                                  {!haveIt && (
                                    <span className="block text-[10px] text-orange-500 font-bold uppercase tracking-wider mt-0.5">
                                      Missing
                                    </span>
                                  )}
                                </span>
                              </li>
                            );
                          })}
                        </ul>

                        <div className="mt-6 bg-orange-50 p-4 rounded-xl border border-orange-100">
                          <h4 className="font-bold text-orange-800 text-sm mb-2 flex items-center gap-2">
                            <ShoppingCart size={14} /> Shop the Look
                          </h4>
                          <button
                            onClick={() => {
                              toast.success('Redirecting to products...');
                              navigate('/products');
                            }}
                            className="w-full bg-white text-orange-600 border border-orange-200 font-bold py-2 rounded-xl text-sm hover:bg-orange-50 transition-colors mb-2"
                          >
                            Add Missing Ingredients
                          </button>
                        </div>
                      </div>

                      {/* Right: Instructions */}
                      <div>
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <Info size={18} className="text-blue-500" />{' '}
                          Instructions
                        </h3>
                        <div className="space-y-6 relative ml-2">
                          <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-gray-100"></div>
                          {selectedRecipe.instructions?.map((step, i) => (
                            <div key={i} className="relative pl-6">
                              <div className="absolute left-[-5px] top-0 w-3 h-3 rounded-full bg-blue-100 border-2 border-white ring-1 ring-blue-200"></div>
                              <p className="text-gray-600 text-sm leading-relaxed">
                                {step}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Footer Action */}
                    <div className="mt-8 pt-6 border-t border-gray-100">
                      <button
                        onClick={() => setSelectedRecipe(null)}
                        className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl transition-colors shadow-lg hover:bg-orange-600 flex items-center justify-center gap-2"
                      >
                        Start Cooking <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
      {/* AI SMART MODAL */}
      {createPortal(
        <AnimatePresence>
          {showAiModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 sm:p-6"
              onClick={() => {
                setShowAiModal(false);
                setShowAllSteps(false);
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className={`bg-white w-full max-w-4xl max-h-[85vh] overflow-y-auto custom-scrollbar rounded-3xl shadow-2xl relative border-4 ${aiSuggestion?.type === 'ROUTINE' ? 'border-purple-50' : 'border-indigo-50'}`}
              >
                <div
                  className={`${getTypeColor(aiSuggestion?.type ?? 'RECIPE')} p-6 text-white text-center relative overflow-hidden transition-colors duration-500 sticky top-0 z-10`}
                >
                  <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                  {getHeaderIcon(aiSuggestion?.type)}
                  <h3 className="text-xl font-bold">Smart Assistant</h3>
                  <p className="text-white/80 text-xs mt-1 uppercase tracking-widest font-medium">
                    Powered by Gemini AI (2.5 Flash)
                  </p>

                  <button
                    onClick={() => setShowAiModal(false)}
                    className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors text-white"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-8">
                  {isGenerating ? (
                    <div className="text-center py-8">
                      <div className="flex items-center justify-center gap-1 mb-4">
                        <div
                          className={`w-2 h-2 rounded-full animate-bounce [animation-delay:-0.3s] bg-gray-400`}
                        ></div>
                        <div
                          className={`w-2 h-2 rounded-full animate-bounce [animation-delay:-0.15s] bg-gray-400`}
                        ></div>
                        <div
                          className={`w-2 h-2 rounded-full animate-bounce bg-gray-400`}
                        ></div>
                      </div>
                      <p className="text-gray-500 font-medium animate-pulse">
                        Analyzing your {orderKeywords.length} items...
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        Checking for Food, Beauty, or Household matches.
                      </p>
                    </div>
                  ) : aiSuggestion ? (
                    <div className="animate-fadeIn">
                      <div
                        className={`p-4 rounded-xl mb-6 border relative ${aiSuggestion.type === 'ROUTINE' ? 'bg-purple-50 border-purple-100 text-purple-900' : 'bg-indigo-50 border-indigo-100 text-indigo-900'}`}
                      >
                        <div className="absolute -top-3 -left-2 bg-white px-2 py-1 rounded shadow text-[10px] font-bold transform -rotate-6 text-gray-600">
                          AI SAYS
                        </div>
                        <p className="text-sm italic">
                          "{aiSuggestion.persona_message}"
                        </p>
                      </div>

                      <h4 className="font-bold text-2xl text-gray-900 mb-2">
                        {aiSuggestion.title}
                      </h4>
                      <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                        {aiSuggestion.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-700 mb-8 bg-gray-50 p-3 rounded-lg">
                        <span className="flex items-center gap-1">
                          <Clock size={14} /> {aiSuggestion.time}
                        </span>
                        {aiSuggestion.metrics_label && (
                          <span className="flex items-center gap-1">
                            <Sparkles size={14} /> {aiSuggestion.metrics_value}{' '}
                            {aiSuggestion.metrics_label}
                          </span>
                        )}
                        <span className="bg-gray-200 px-2 py-0.5 rounded">
                          {aiSuggestion.difficulty}
                        </span>
                      </div>

                      {/* Steps Preview */}
                      <div className="bg-gray-50 rounded-xl p-6 mb-8">
                        <div className="flex items-center justify-between mb-4">
                          <h5 className="font-bold text-xs uppercase text-gray-400">
                            {aiSuggestion.type === 'RECIPE'
                              ? 'Instructions'
                              : 'Routine Steps'}
                          </h5>
                          {aiSuggestion.steps.length > 3 && (
                            <button
                              onClick={() => setShowAllSteps(!showAllSteps)}
                              className="text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors"
                            >
                              {showAllSteps
                                ? 'Show Less'
                                : `Show All (${aiSuggestion.steps.length})`}
                            </button>
                          )}
                        </div>
                        <ul className="text-sm text-gray-600 space-y-4">
                          {(showAllSteps
                            ? aiSuggestion.steps
                            : aiSuggestion.steps.slice(0, 3)
                          ).map((step, i) => (
                            <li key={i} className="flex gap-3">
                              <span className="font-bold text-gray-400 min-w-[20px]">
                                {i + 1}.
                              </span>
                              <span className="leading-relaxed">{step}</span>
                            </li>
                          ))}
                          {!showAllSteps && aiSuggestion.steps.length > 3 && (
                            <li className="pt-2">
                              <button
                                onClick={() => setShowAllSteps(true)}
                                className="w-full text-center py-2 text-xs font-bold text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all border border-dashed border-gray-300 hover:border-orange-300"
                              >
                                + {aiSuggestion.steps.length - 3} more steps
                              </button>
                            </li>
                          )}
                        </ul>
                      </div>

                      <button
                        onClick={() => setShowAiModal(false)}
                        className={`w-full text-white font-bold py-4 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2 text-lg hover:shadow-xl ${getTypeColor(aiSuggestion.type)}`}
                      >
                        {aiSuggestion.type === 'RECIPE'
                          ? 'Start Cooking'
                          : 'Start Routine'}{' '}
                        <ArrowRight size={20} />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center text-red-500 py-8">
                      <p>Thinking cap fell off. Try again!</p>
                      <button
                        onClick={() => setShowAiModal(false)}
                        className="mt-4 text-sm underline"
                      >
                        Close
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
