export type LessonStatus = "completed" | "available" | "locked"

export interface Lesson {
  id: number
  title: string
  duration: string
  status: LessonStatus
  description: string
}

export interface Module {
  id: number
  title: string
  shortTitle: string
  description: string
  totalLessons: number
  completedLessons: number
  isLocked: boolean
  lessons: Lesson[]
}

export const modules: Module[] = [
  {
    id: 1,
    title: "What is Artificial Intelligence?",
    shortTitle: "What is AI?",
    description:
      "Discover the core principles of Artificial Intelligence and how it's shaping our modern world.",
    totalLessons: 10,
    completedLessons: 4,
    isLocked: false,
    lessons: [
      {
        id: 1,
        title: "Welcome to Safi AI Academy.",
        duration: "2 Mins",
        status: "completed",
        description:
          "Welcome to Safi AI Academy! Get a sneak peek at all the amazing things you'll discover about Artificial Intelligence. Your adventure starts here! 🚀",
      },
      {
        id: 2,
        title: "What is a Machine?",
        duration: "3 Mins",
        status: "available",
        description:
          "Discover what machines are and how they help us in our everyday lives.",
      },
      {
        id: 3,
        title: "Machines Follow Rules.",
        duration: "3 Mins",
        status: "locked",
        description:
          "Learn how machines follow instructions and rules to get things done.",
      },
      {
        id: 4,
        title: "Can Machines Think?",
        duration: "3 Mins",
        status: "locked",
        description:
          "Explore whether machines can think and make decisions like humans.",
      },
      {
        id: 5,
        title: "Machines vs Humans.",
        duration: "3 Mins",
        status: "locked",
        description:
          "Compare what machines can do versus what humans do best.",
      },
      {
        id: 6,
        title: "Guessing Game.",
        duration: "3 Mins",
        status: "locked",
        description:
          "Play a fun guessing game to understand how AI makes predictions.",
      },
      {
        id: 7,
        title: "Teaching a Machine.",
        duration: "3 Mins",
        status: "locked",
        description:
          "Learn how we teach machines by giving them lots of examples.",
      },
      {
        id: 8,
        title: "AI in Your Home.",
        duration: "3 Mins",
        status: "locked",
        description:
          "Discover AI tools that you might already have at home.",
      },
      {
        id: 9,
        title: "Being Smart with AI.",
        duration: "3 Mins",
        status: "locked",
        description:
          "Understand how to use AI tools wisely and responsibly.",
      },
      {
        id: 10,
        title: "AI Champions Quiz.",
        duration: "3 Mins",
        status: "locked",
        description:
          "Test everything you have learned in Module 1 with a fun quiz.",
      },
    ],
  },
  {
    id: 2,
    title: "AI Around Us",
    shortTitle: "AI Around Us",
    description:
      "Take a look at how AI is being used today in our daily lives.",
    totalLessons: 10,
    completedLessons: 0,
    isLocked: true,
    lessons: [],
  },
  {
    id: 3,
    title: "Thinking Like AI",
    shortTitle: "Thinking Like AI",
    description: "Understand how machines learn and make decisions.",
    totalLessons: 10,
    completedLessons: 0,
    isLocked: true,
    lessons: [],
  },
  {
    id: 4,
    title: "Using AI Safely",
    shortTitle: "Using AI Safely",
    description: "Safely use AI tools and understand their limitations.",
    totalLessons: 10,
    completedLessons: 0,
    isLocked: true,
    lessons: [],
  },
]

export const featuredLesson = {
  title: "The Pyramids of Gaza",
  duration: "03:00",
  moduleId: 1,
  lessonId: 1,
}

export const quickLessons = [
  {
    title: "Timbuktu",
    duration: "03:00",
    moduleId: 1,
    lessonId: 2,
    colorClass: "bg-gradient-to-b from-[#1a0505] via-[#3d0e0e] to-[#1a0505]",
  },
  {
    title: "The Nile River",
    duration: "02:57",
    moduleId: 1,
    lessonId: 3,
    colorClass: "bg-gradient-to-b from-[#0d0d2e] via-[#1a0a50] to-[#0d0d2e]",
  },
  {
    title: "Kilimanjaro",
    duration: "02:30",
    moduleId: 1,
    lessonId: 4,
    colorClass: "bg-[#E4D6B3]",
  },
]
