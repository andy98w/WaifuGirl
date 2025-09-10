export interface Level {
  id: number;
  name: string;
  image: any;
  unlocked: boolean;
  completed: boolean;
  bestMoves?: number;
}

export const levels: Level[] = [
  {
    id: 1,
    name: "Level 1",
    image: require('../assets/images/1.jpg'),
    unlocked: true,
    completed: false
  },
  {
    id: 2,
    name: "Level 2",
    image: require('../assets/images/2.jpg'),
    unlocked: true,
    completed: false
  },
  {
    id: 3,
    name: "Level 3",
    image: require('../assets/images/3.jpg'),
    unlocked: true,
    completed: false
  },
  {
    id: 4,
    name: "Level 4",
    image: require('../assets/images/4.jpg'),
    unlocked: true,
    completed: false
  },
  {
    id: 5,
    name: "Level 5",
    image: require('../assets/images/5.jpg'),
    unlocked: true,
    completed: false
  },
  {
    id: 6,
    name: "Level 6",
    image: require('../assets/images/6.jpg'),
    unlocked: true,
    completed: false
  },
  {
    id: 7,
    name: "Level 7",
    image: require('../assets/images/7.jpg'),
    unlocked: true,
    completed: false
  },
  {
    id: 8,
    name: "Level 8",
    image: require('../assets/images/8.jpg'),
    unlocked: true,
    completed: false
  },
  {
    id: 9,
    name: "Level 9",
    image: require('../assets/images/9.jpg'),
    unlocked: true,
    completed: false
  },
  {
    id: 10,
    name: "Level 10",
    image: require('../assets/images/10.jpg'),
    unlocked: true,
    completed: false
  },
  {
    id: 11,
    name: "Level 11",
    image: require('../assets/images/11.jpg'),
    unlocked: true,
    completed: false
  },
  {
    id: 12,
    name: "Level 12",
    image: require('../assets/images/12.jpg'),
    unlocked: true,
    completed: false
  },
  {
    id: 13,
    name: "Level 13",
    image: require('../assets/images/13.jpg'),
    unlocked: true,
    completed: false
  },
  {
    id: 14,
    name: "Level 14",
    image: require('../assets/images/14.jpg'),
    unlocked: true,
    completed: false
  },
  {
    id: 15,
    name: "Level 15",
    image: require('../assets/images/15.jpg'),
    unlocked: true,
    completed: false
  },
  {
    id: 16,
    name: "Level 16",
    image: require('../assets/images/16.jpg'),
    unlocked: true,
    completed: false
  },
  {
    id: 17,
    name: "Level 17",
    image: require('../assets/images/17.jpg'),
    unlocked: true,
    completed: false
  },
  {
    id: 18,
    name: "Level 18",
    image: require('../assets/images/18.jpg'),
    unlocked: true,
    completed: false
  },
  {
    id: 19,
    name: "Level 19",
    image: require('../assets/images/19.jpg'),
    unlocked: true,
    completed: false
  },
  {
    id: 20,
    name: "Level 20",
    image: require('../assets/images/20.jpg'),
    unlocked: true,
    completed: false
  }
];