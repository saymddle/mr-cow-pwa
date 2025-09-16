import { MenuItem } from '../types/menu.js';

// Step 1: Choose Your Flavor - Korean Corndogs
const corndogFlavors: MenuItem[] = [
  {
    id: 'mr-cow-classic',
    name: 'Mr. Cow Classic',
    koreanName: '기본 콘도그',
    description: 'Basic style corn dog with crispy golden coating',
    price: 5.50,
    category: 'corndogs',
    allergens: ['gluten', 'eggs'],
    dietaryInfo: [],
    isPopular: true,
    customizationOptions: [
      {
        name: 'Coating',
        options: ['Sugar Coated (Recommended)', 'Plain'],
        required: true
      },
      {
        name: 'Filling',
        options: ['Whole Hot Dog', 'Whole Mozzarella', 'Half Mozzarella & Half Hot Dog', 'Half Cheddar & Half Hot Dog', 'Half Cheddar & Half Mozzarella'],
        required: true
      }
    ],
    imageUrl: '/assets/images/menu/mr-cow-classic.jpg'
  },
  {
    id: 'fried-potato',
    name: 'Fried Potato',
    koreanName: '감자 핫도그',
    description: 'Wrapped with bite-size crispy potato fries',
    price: 7.00,
    category: 'corndogs',
    allergens: ['gluten', 'eggs'],
    dietaryInfo: [],
    isPopular: true,
    customizationOptions: [
      {
        name: 'Coating',
        options: ['Sugar Coated (Recommended)', 'Plain'],
        required: true
      },
      {
        name: 'Filling',
        options: ['Whole Hot Dog', 'Whole Mozzarella', 'Half Mozzarella & Half Hot Dog', 'Half Cheddar & Half Hot Dog', 'Half Cheddar & Half Mozzarella'],
        required: true
      }
    ],
    imageUrl: '/assets/images/menu/fried-potato.jpg'
  },
  {
    id: 'flaming-potato',
    name: 'Flaming Potato',
    koreanName: '플레이밍 포테이토',
    description: 'Potato fries + Cheetos with spicy kick',
    price: 8.00,
    category: 'corndogs',
    allergens: ['gluten', 'eggs', 'dairy'],
    dietaryInfo: [],
    isSpicy: true,
    customizationOptions: [
      {
        name: 'Sauce',
        options: ['Hot Sauce 🌶️', 'Mild Sauce'],
        required: true
      },
      {
        name: 'Filling',
        options: ['Whole Hot Dog', 'Whole Mozzarella', 'Half Mozzarella & Half Hot Dog', 'Half Cheddar & Half Hot Dog', 'Half Cheddar & Half Mozzarella'],
        required: true
      }
    ],
    imageUrl: '/assets/images/menu/flaming-potato.jpg'
  },
  {
    id: 'flaming-cheetah',
    name: 'Flaming Cheetah',
    koreanName: '플레이밍 치타',
    description: 'Covered in crunchy Cheetos with bold flavor',
    price: 6.50,
    category: 'corndogs',
    allergens: ['gluten', 'eggs', 'dairy'],
    dietaryInfo: [],
    isSpicy: true,
    customizationOptions: [
      {
        name: 'Sauce',
        options: ['Hot Sauce 🌶️', 'Mild Sauce'],
        required: true
      },
      {
        name: 'Filling',
        options: ['Whole Hot Dog', 'Whole Mozzarella', 'Half Mozzarella & Half Hot Dog', 'Half Cheddar & Half Hot Dog', 'Half Cheddar & Half Mozzarella'],
        required: true
      }
    ],
    imageUrl: '/assets/images/menu/flaming-cheetah.jpg'
  },
  {
    id: 'firecracker',
    name: 'Firecracker',
    koreanName: '파이어크래커',
    description: 'Extremely spicy & sweet combination that pops',
    price: 6.50,
    category: 'corndogs',
    allergens: ['gluten', 'eggs'],
    dietaryInfo: [],
    isSpicy: true,
    customizationOptions: [
      {
        name: 'Filling',
        options: ['Whole Hot Dog', 'Whole Mozzarella', 'Half Mozzarella & Half Hot Dog', 'Half Cheddar & Half Hot Dog', 'Half Cheddar & Half Mozzarella'],
        required: true
      }
    ],
    imageUrl: '/assets/images/menu/firecracker.jpg'
  },
  {
    id: 'yam-yam-churro',
    name: 'Yam-Yam Churro',
    koreanName: '얌얌 츄로',
    description: 'Sweet potato fries with cinnamon sugar coating',
    price: 7.00,
    category: 'corndogs',
    allergens: ['gluten', 'eggs'],
    dietaryInfo: ['vegetarian'],
    customizationOptions: [
      {
        name: 'Coating',
        options: ['Cinnamon Sugar (Recommended)', 'Plain'],
        required: true
      },
      {
        name: 'Filling',
        options: ['Whole Hot Dog', 'Whole Mozzarella', 'Half Mozzarella & Half Hot Dog', 'Half Cheddar & Half Hot Dog', 'Half Cheddar & Half Mozzarella'],
        required: true
      }
    ],
    imageUrl: '/assets/images/menu/yam-yam-churro.jpg'
  },
  {
    id: 'caramel-puff',
    name: 'Caramel Puff',
    koreanName: '캐러멜 퍼프',
    description: 'Wrapped with sweet barley puffs and caramel',
    price: 6.00,
    category: 'corndogs',
    allergens: ['gluten', 'eggs', 'dairy'],
    dietaryInfo: ['vegetarian'],
    customizationOptions: [
      {
        name: 'Coating',
        options: ['Cinnamon Sugar (Recommended)', 'Plain'],
        required: true
      },
      {
        name: 'Filling',
        options: ['Whole Hot Dog', 'Whole Mozzarella', 'Half Mozzarella & Half Hot Dog', 'Half Cheddar & Half Hot Dog', 'Half Cheddar & Half Mozzarella'],
        required: true
      }
    ],
    imageUrl: '/assets/images/menu/caramel-puff.jpg'
  },
  {
    id: 'fruity-pop',
    name: 'Fruity Pop',
    koreanName: '프루티 팝',
    description: 'Wrapped with crunchy fruity rice puffs',
    price: 6.00,
    category: 'corndogs',
    allergens: ['gluten', 'eggs'],
    dietaryInfo: ['vegetarian'],
    customizationOptions: [
      {
        name: 'Coating',
        options: ['Sugar Coated (Recommended)', 'Plain'],
        required: true
      },
      {
        name: 'Filling',
        options: ['Whole Hot Dog', 'Whole Mozzarella', 'Half Mozzarella & Half Hot Dog', 'Half Cheddar & Half Hot Dog', 'Half Cheddar & Half Mozzarella'],
        required: true
      }
    ],
    imageUrl: '/assets/images/menu/fruity-pop.jpg'
  },
  {
    id: 'spaghetti-stix',
    name: 'Spaghetti Stix',
    koreanName: '스파게티 스틱',
    description: 'Sprinkled with parmesan cheese over marinara sauce',
    price: 6.50,
    category: 'corndogs',
    allergens: ['gluten', 'eggs', 'dairy'],
    dietaryInfo: [],
    customizationOptions: [
      {
        name: 'Filling',
        options: ['Whole Hot Dog', 'Whole Mozzarella', 'Half Mozzarella & Half Hot Dog', 'Half Cheddar & Half Hot Dog', 'Half Cheddar & Half Mozzarella'],
        required: true
      }
    ],
    imageUrl: '/assets/images/menu/spaghetti-stix.jpg'
  },
  {
    id: 'messy-kinako',
    name: 'Messy Kinako',
    koreanName: '메시 키나코',
    description: 'Condensed milk & roasted yellow bean powder (Kinako)',
    price: 6.50,
    category: 'corndogs',
    allergens: ['gluten', 'eggs', 'dairy', 'soy'],
    dietaryInfo: ['vegetarian'],
    customizationOptions: [
      {
        name: 'Filling',
        options: ['Whole Hot Dog', 'Whole Mozzarella', 'Half Mozzarella & Half Hot Dog', 'Half Cheddar & Half Hot Dog', 'Half Cheddar & Half Mozzarella'],
        required: true
      }
    ],
    imageUrl: '/assets/images/menu/messy-kinako.jpg'
  }
];

// Drinks - Ade Category
const adeItems: MenuItem[] = [
  {
    id: 'mango-strawberry-ade',
    name: 'Mango & Strawberry Ade',
    koreanName: '망고 딸기 에이드',
    description: 'Refreshing tropical mango with sweet strawberry',
    price: 5.00,
    category: 'drinks',
    allergens: [],
    dietaryInfo: ['vegan'],
    customizationOptions: [
      {
        name: 'Size',
        options: ['16oz - $5.00', '24oz - $6.00'],
        required: true
      },
      {
        name: 'Toppings',
        options: ['Tapioca Pearl', 'Strawberry Poppers', 'Mango Poppers', 'Rainbow Jelly', 'Coconut Jelly'],
        required: false
      }
    ],
    imageUrl: '/assets/images/menu/mango-strawberry-ade.jpg'
  },
  {
    id: 'strawberry-mango-ade',
    name: 'Strawberry & Mango Ade',
    koreanName: '딸기 망고 에이드',
    description: 'Sweet strawberry with tropical mango twist',
    price: 5.00,
    category: 'drinks',
    allergens: [],
    dietaryInfo: ['vegan'],
    customizationOptions: [
      {
        name: 'Size',
        options: ['16oz - $5.00', '24oz - $6.00'],
        required: true
      },
      {
        name: 'Toppings',
        options: ['Tapioca Pearl', 'Strawberry Poppers', 'Mango Poppers', 'Rainbow Jelly', 'Coconut Jelly'],
        required: false
      }
    ],
    imageUrl: '/assets/images/menu/strawberry-mango-ade.jpg'
  },
  {
    id: 'passion-rainbow-ade',
    name: 'Passion & Rainbow Ade',
    koreanName: '패션프루트 레인보우 에이드',
    description: 'Exotic passion fruit with colorful rainbow layers',
    price: 5.00,
    category: 'drinks',
    allergens: [],
    dietaryInfo: ['vegan'],
    customizationOptions: [
      {
        name: 'Size',
        options: ['16oz - $5.00', '24oz - $6.00'],
        required: true
      },
      {
        name: 'Toppings',
        options: ['Tapioca Pearl', 'Strawberry Poppers', 'Mango Poppers', 'Rainbow Jelly', 'Coconut Jelly'],
        required: false
      }
    ],
    imageUrl: '/assets/images/menu/passion-rainbow-ade.jpg'
  },
  {
    id: 'peach-mango-ade',
    name: 'Peach & Mango Ade',
    koreanName: '복숭아 망고 에이드',
    description: 'Juicy peach with tropical mango blend',
    price: 5.00,
    category: 'drinks',
    allergens: [],
    dietaryInfo: ['vegan'],
    customizationOptions: [
      {
        name: 'Size',
        options: ['16oz - $5.00', '24oz - $6.00'],
        required: true
      },
      {
        name: 'Toppings',
        options: ['Tapioca Pearl', 'Strawberry Poppers', 'Mango Poppers', 'Rainbow Jelly', 'Coconut Jelly'],
        required: false
      }
    ],
    imageUrl: '/assets/images/menu/peach-mango-ade.jpg'
  }
];

// Sparkling Drinks
const sparklingItems: MenuItem[] = [
  {
    id: 'kiwi-strawberry-sparkling',
    name: 'Kiwi & Strawberry Sparkling',
    koreanName: '키위 딸기 스파클링',
    description: 'Tangy kiwi with sweet strawberry bubbles',
    price: 5.00,
    category: 'drinks',
    allergens: [],
    dietaryInfo: ['vegan'],
    customizationOptions: [
      {
        name: 'Size',
        options: ['16oz - $5.00', '24oz - $6.00'],
        required: true
      },
      {
        name: 'Toppings',
        options: ['Tapioca Pearl', 'Strawberry Poppers', 'Mango Poppers', 'Rainbow Jelly', 'Coconut Jelly'],
        required: false
      }
    ],
    imageUrl: '/assets/images/menu/kiwi-strawberry-sparkling.jpg'
  },
  {
    id: 'pineapple-coconut-sparkling',
    name: 'Pineapple & Coconut Sparkling',
    koreanName: '파인애플 코코넛 스파클링',
    description: 'Tropical pineapple with creamy coconut fizz',
    price: 5.00,
    category: 'drinks',
    allergens: [],
    dietaryInfo: ['vegan'],
    customizationOptions: [
      {
        name: 'Size',
        options: ['16oz - $5.00', '24oz - $6.00'],
        required: true
      },
      {
        name: 'Toppings',
        options: ['Tapioca Pearl', 'Strawberry Poppers', 'Mango Poppers', 'Rainbow Jelly', 'Coconut Jelly'],
        required: false
      }
    ],
    imageUrl: '/assets/images/menu/pineapple-coconut-sparkling.jpg'
  },
  {
    id: 'blueberry-coconut-sparkling',
    name: 'Blueberry & Coconut Sparkling',
    koreanName: '블루베리 코코넛 스파클링',
    description: 'Antioxidant-rich blueberry with coconut sparkle',
    price: 5.00,
    category: 'drinks',
    allergens: [],
    dietaryInfo: ['vegan'],
    customizationOptions: [
      {
        name: 'Size',
        options: ['16oz - $5.00', '24oz - $6.00'],
        required: true
      },
      {
        name: 'Toppings',
        options: ['Tapioca Pearl', 'Strawberry Poppers', 'Mango Poppers', 'Rainbow Jelly', 'Coconut Jelly'],
        required: false
      }
    ],
    imageUrl: '/assets/images/menu/blueberry-coconut-sparkling.jpg'
  }
];

// Milk Tea
const milkTeaItems: MenuItem[] = [
  {
    id: 'strawberry-milk-tea',
    name: 'Strawberry Milk Tea',
    koreanName: '딸기 밀크티',
    description: 'Creamy milk tea with fresh strawberry flavor',
    price: 5.00,
    category: 'drinks',
    allergens: ['dairy'],
    dietaryInfo: ['vegetarian'],
    isPopular: true,
    customizationOptions: [
      {
        name: 'Size',
        options: ['16oz - $5.00', '24oz - $6.00'],
        required: true
      },
      {
        name: 'Toppings',
        options: ['Tapioca Pearl', 'Strawberry Poppers', 'Mango Poppers', 'Rainbow Jelly', 'Coconut Jelly'],
        required: false
      }
    ],
    imageUrl: '/assets/images/menu/strawberry-milk-tea.jpg'
  },
  {
    id: 'brown-sugar-milk-tea',
    name: 'Brown Sugar Milk Tea',
    koreanName: '흑설탕 밀크티',
    description: 'Rich brown sugar syrup with creamy milk tea',
    price: 5.00,
    category: 'drinks',
    allergens: ['dairy'],
    dietaryInfo: ['vegetarian'],
    isPopular: true,
    customizationOptions: [
      {
        name: 'Size',
        options: ['16oz - $5.00', '24oz - $6.00'],
        required: true
      },
      {
        name: 'Toppings',
        options: ['Tapioca Pearl', 'Strawberry Poppers', 'Mango Poppers', 'Rainbow Jelly', 'Coconut Jelly'],
        required: false
      }
    ],
    imageUrl: '/assets/images/menu/brown-sugar-milk-tea.jpg'
  },
  {
    id: 'matcha-milk-tea',
    name: 'Matcha Milk Tea',
    koreanName: '말차 밀크티',
    description: 'Premium Japanese matcha with smooth milk tea',
    price: 5.00,
    category: 'drinks',
    allergens: ['dairy'],
    dietaryInfo: ['vegetarian'],
    customizationOptions: [
      {
        name: 'Size',
        options: ['16oz - $5.00', '24oz - $6.00'],
        required: true
      },
      {
        name: 'Toppings',
        options: ['Tapioca Pearl', 'Strawberry Poppers', 'Mango Poppers', 'Rainbow Jelly', 'Coconut Jelly'],
        required: false
      }
    ],
    imageUrl: '/assets/images/menu/matcha-milk-tea.jpg'
  },
  {
    id: 'signature-milk-tea',
    name: 'Signature Milk Tea',
    koreanName: '시그니처 밀크티',
    description: 'Mr. Cow special blend milk tea recipe',
    price: 5.00,
    category: 'drinks',
    allergens: ['dairy'],
    dietaryInfo: ['vegetarian'],
    isPopular: true,
    customizationOptions: [
      {
        name: 'Size',
        options: ['16oz - $5.00', '24oz - $6.00'],
        required: true
      },
      {
        name: 'Toppings',
        options: ['Tapioca Pearl', 'Strawberry Poppers', 'Mango Poppers', 'Rainbow Jelly', 'Coconut Jelly'],
        required: false
      }
    ],
    imageUrl: '/assets/images/menu/signature-milk-tea.jpg'
  }
];

// K-Popsicle
const kPopsicleItems: MenuItem[] = [
  {
    id: 'blue-moo',
    name: 'Blue Moo',
    koreanName: '블루 무',
    description: 'Refreshing blue soda flavor popsicle',
    price: 5.00,
    category: 'drinks',
    allergens: [],
    dietaryInfo: ['vegan'],
    customizationOptions: [
      {
        name: 'Size',
        options: ['16oz - $5.00', '24oz - $6.00'],
        required: true
      },
      {
        name: 'Toppings',
        options: ['Tapioca Pearl', 'Strawberry Poppers', 'Mango Poppers', 'Rainbow Jelly', 'Coconut Jelly'],
        required: false
      }
    ],
    imageUrl: '/assets/images/menu/blue-moo.jpg'
  },
  {
    id: 'yellow-moo',
    name: 'Yellow Moo',
    koreanName: '옐로우 무',
    description: 'Creamy banana milk flavor popsicle',
    price: 5.00,
    category: 'drinks',
    allergens: ['dairy'],
    dietaryInfo: ['vegetarian'],
    customizationOptions: [
      {
        name: 'Size',
        options: ['16oz - $5.00', '24oz - $6.00'],
        required: true
      },
      {
        name: 'Toppings',
        options: ['Tapioca Pearl', 'Strawberry Poppers', 'Mango Poppers', 'Rainbow Jelly', 'Coconut Jelly'],
        required: false
      }
    ],
    imageUrl: '/assets/images/menu/yellow-moo.jpg'
  },
  {
    id: 'green-moo',
    name: 'Green Moo',
    koreanName: '그린 무',
    description: 'Sweet honeydew melon flavor popsicle',
    price: 5.00,
    category: 'drinks',
    allergens: [],
    dietaryInfo: ['vegan'],
    customizationOptions: [
      {
        name: 'Size',
        options: ['16oz - $5.00', '24oz - $6.00'],
        required: true
      },
      {
        name: 'Toppings',
        options: ['Tapioca Pearl', 'Strawberry Poppers', 'Mango Poppers', 'Rainbow Jelly', 'Coconut Jelly'],
        required: false
      }
    ],
    imageUrl: '/assets/images/menu/green-moo.jpg'
  }
];

// Combine all menu items
export const menuItems: MenuItem[] = [
  ...corndogFlavors,
  ...adeItems,
  ...sparklingItems,
  ...milkTeaItems,
  ...kPopsicleItems
];

// Category helper for menu organization
export const menuCategories = {
  corndogs: 'Korean Corndogs',
  drinks: 'Drinks'
} as const;

// Helper function to get items by category
export const getItemsByCategory = (category: string): MenuItem[] => {
  return menuItems.filter(item => item.category === category);
};

// Helper function to get popular items
export const getPopularItems = (): MenuItem[] => {
  return menuItems.filter(item => item.isPopular);
};

// Helper function to get spicy items
export const getSpicyItems = (): MenuItem[] => {
  return menuItems.filter(item => item.isSpicy);
};
