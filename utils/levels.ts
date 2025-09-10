export interface Level {
  id: number;
  name: string;
  image: any;
  unlocked: boolean;
  completed: boolean;
  bestMoves?: number;
  requiresPurchase?: boolean;
}

export const levels: Level[] = [
  {
    id: 1,
    name: "Level 1",
    image: require('../assets/images/1.png'),
    unlocked: true,
    completed: false
  },
  {
    id: 2,
    name: "Level 2",
    image: require('../assets/images/2.png'),
    unlocked: false,
    completed: false
  },
  {
    id: 3,
    name: "Level 3",
    image: require('../assets/images/3.png'),
    unlocked: false,
    completed: false
  },
  {
    id: 4,
    name: "Level 4",
    image: require('../assets/images/4.png'),
    unlocked: false,
    completed: false
  },
  {
    id: 5,
    name: "Level 5",
    image: require('../assets/images/5.png'),
    unlocked: false,
    completed: false
  },
  {
    id: 6,
    name: "Level 6",
    image: require('../assets/images/6.png'),
    unlocked: false,
    completed: false
  },
  {
    id: 7,
    name: "Level 7",
    image: require('../assets/images/7.png'),
    unlocked: false,
    completed: false
  },
  {
    id: 8,
    name: "Level 8",
    image: require('../assets/images/8.png'),
    unlocked: false,
    completed: false
  },
  {
    id: 9,
    name: "Level 9",
    image: require('../assets/images/9.png'),
    unlocked: false,
    completed: false
  },
  {
    id: 10,
    name: "Level 10",
    image: require('../assets/images/10.png'),
    unlocked: false,
    completed: false
  },
  {
    id: 11,
    name: "Level 11",
    image: require('../assets/images/11.png'),
    unlocked: false,
    completed: false
  },
  {
    id: 12,
    name: "Level 12",
    image: require('../assets/images/12.png'),
    unlocked: false,
    completed: false
  },
  {
    id: 13,
    name: "Level 13",
    image: require('../assets/images/13.png'),
    unlocked: false,
    completed: false,
    requiresPurchase: true
  },
  {
    id: 14,
    name: "Level 14",
    image: require('../assets/images/14.png'),
    unlocked: false,
    completed: false,
    requiresPurchase: true
  },
  {
    id: 15,
    name: "Level 15",
    image: require('../assets/images/15.png'),
    unlocked: false,
    completed: false,
    requiresPurchase: true
  },
  {
    id: 16,
    name: "Level 16",
    image: require('../assets/images/16.png'),
    unlocked: false,
    completed: false,
    requiresPurchase: true
  },
  {
    id: 17,
    name: "Level 17",
    image: require('../assets/images/17.png'),
    unlocked: false,
    completed: false,
    requiresPurchase: true
  },
  {
    id: 18,
    name: "Level 18",
    image: require('../assets/images/18.png'),
    unlocked: false,
    completed: false,
    requiresPurchase: true
  },
  {
    id: 19,
    name: "Level 19",
    image: require('../assets/images/19.png'),
    unlocked: false,
    completed: false,
    requiresPurchase: true
  },
  {
    id: 20,
    name: "Level 20",
    image: require('../assets/images/20.png'),
    unlocked: false,
    completed: false,
    requiresPurchase: true
  }
];