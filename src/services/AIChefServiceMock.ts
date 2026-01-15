// Simulated AI Service for Demo Purposes
// In a real app, this would call the Google Gemini API via a backend proxy

export const generateChefRecipe = async (
  ingredients: string[]
): Promise<any> => {
  // Simulate API Network Delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Intelligent Fallback Logic
  const lowerIngredients = ingredients.map((i) => i.toLowerCase());
  const isDrinkOrder = lowerIngredients.some((k) =>
    ['pepsi', 'coke', 'sprite', 'soda', 'drink', 'beverage'].includes(k)
  );
  const isBeautyOrder = lowerIngredients.some((k) =>
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
    ].includes(k)
  );
  const isHouseholdOrder = lowerIngredients.some((k) =>
    [
      'detergent',
      'cleaner',
      'spray',
      'tissue',
      'paper',
      'brush',
      'mop',
    ].includes(k)
  );

  let mockRecipe;

  if (isBeautyOrder) {
    // Beauty / Self-Care Fallback
    const beautyRoutines = [
      {
        name: 'Revitalizing Shower Ritual',
        description:
          'Turn your daily shower into a spa-like experience with your new products.',
        time: '15 min',
        difficulty: 'Easy',
        ingredients: ['Shower Gel', 'Warm Water', 'Soft Towel', 'Moisturizer'],
        instructions: [
          'Start with a warm steam to open your pores.',
          'Lather your new shower gel generously.',
          'Massage in circular motions for relaxation.',
          'Rinse with cool water to lock in moisture.',
          'Apply lotion immediately after drying.',
        ],
        category: 'routine',
        metrics_label: 'Effect',
        metrics_value: 'Relaxation',
      },
      {
        name: 'Morning Fresh Start',
        description: 'A quick routine to wake up your skin and senses.',
        time: '5 min',
        difficulty: 'Easy',
        ingredients: ['Face Wash', 'Cool Water', 'Clean Towel'],
        instructions: [
          'Splash face with lukewarm water.',
          'Gently massage face wash for 60 seconds.',
          'Rinse thoroughly with cold water.',
          "Pat dry (don't rub) with a clean towel.",
        ],
        category: 'routine', // Internal mock category
        metrics_label: 'Effect',
        metrics_value: 'Glowing Skin',
      },
    ];
    mockRecipe =
      beautyRoutines[Math.floor(Math.random() * beautyRoutines.length)];

    return {
      type: 'ROUTINE',
      title: mockRecipe.name,
      description: mockRecipe.description,
      items_needed: ingredients.slice(0, 3), // Just grab a few
      steps: mockRecipe.instructions,
      persona_message: "Self-care is non-negotiable! Here's a routine for you.",
      time: mockRecipe.time,
      difficulty: mockRecipe.difficulty,
      metrics_label: mockRecipe.metrics_label,
      metrics_value: mockRecipe.metrics_value,
    };
  } else if (isHouseholdOrder) {
    // Household / Cleaning Fallback
    const cleaningHacks = [
      {
        name: 'Super Effective Stain Removal',
        description: 'Maximize the power of your new detergent.',
        time: '10 min',
        difficulty: 'Medium',
        instructions: [
          'Pre-treat the stain with a drop of detergent.',
          'Let it sit for 5 minutes.',
          'Gently rub fabric together.',
          'Wash as normal.',
        ],
        category: 'hack',
        metrics_label: 'Result',
        metrics_value: 'Spotless',
      },
    ];
    mockRecipe = cleaningHacks[0];

    return {
      type: 'HACK',
      title: mockRecipe.name,
      description: mockRecipe.description,
      items_needed: ingredients.slice(0, 2),
      steps: mockRecipe.instructions,
      persona_message: "Let's make that house sparkle!",
      time: mockRecipe.time,
      difficulty: mockRecipe.difficulty,
      metrics_label: mockRecipe.metrics_label,
      metrics_value: mockRecipe.metrics_value,
    };
  } else if (isDrinkOrder) {
    // Drink Logic
    mockRecipe = {
      name: 'Ultimate Movie Night Popcorn',
      description: 'The perfect salty companion to your icy cold drinks.',
      time: '5 min',
      difficulty: 'Easy',
      ingredients: ['Popcorn Kernels', 'Butter'],
      instructions: [
        'Pop the kernels.',
        'Drizzle melted butter.',
        'Serve with your chilled Soda.',
      ],
      metrics_label: 'Calories',
      metrics_value: '150 kcal',
    };

    return {
      type: 'RECIPE',
      title: mockRecipe.name,
      description: mockRecipe.description,
      items_needed: mockRecipe.ingredients,
      steps: mockRecipe.instructions,
      persona_message: "Movie night isn't complete without this combo!",
      time: mockRecipe.time,
      difficulty: mockRecipe.difficulty,
      metrics_label: mockRecipe.metrics_label,
      metrics_value: mockRecipe.metrics_value,
    };
  } else {
    // Default FOOD Logic
    const defaultFood = {
      name: 'Lemon Garlic Butter Pasta',
      description: 'A zesty and creamy pasta dish.',
      time: '15 min',
      difficulty: 'Easy',
      instructions: [
        'Boil pasta until al dente.',
        'Sauté garlic in butter.',
        'Toss pasta in sauce.',
      ],
      metrics_label: 'Calories',
      metrics_value: '380 kcal',
    };
    mockRecipe = defaultFood;

    return {
      type: 'RECIPE',
      title: mockRecipe.name,
      description: mockRecipe.description,
      items_needed: ingredients.slice(0, 3),
      steps: mockRecipe.instructions,
      persona_message: "Here's a quick meal idea for you!",
      time: mockRecipe.time,
      difficulty: mockRecipe.difficulty,
      metrics_label: mockRecipe.metrics_label,
      metrics_value: mockRecipe.metrics_value,
    };
  }
};
