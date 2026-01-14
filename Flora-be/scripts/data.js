// Data configuration for Flora English Training Platform
// Edit this file to update your database content

module.exports = {
  // Groups configuration
  groups: [
    {
      group_number: 1,
      name: "Start the Lesson / Lead In",
      description:
        "Instructions for starting class, warm-up activities, and introducing topics",
      color_hex: "#0066CC",
    },
    {
      group_number: 2,
      name: "Giving Instructions for Activities",
      description:
        "Instructions for explaining tasks, activities, and exercises",
      color_hex: "#00AA66",
    },
    {
      group_number: 3,
      name: "Monitoring and Supporting",
      description:
        "Instructions for encouraging, helping, and guiding students during activities",
      color_hex: "#FF6600",
    },
    {
      group_number: 4,
      name: "Checking & Feedback",
      description:
        "Instructions for reviewing answers, giving feedback, and correcting mistakes",
      color_hex: "#9900CC",
    },
    {
      group_number: 5,
      name: "Transition + Closing",
      description:
        "Instructions for transitions between activities, homework, and ending class",
      color_hex: "#CC0066",
    },
  ],

  // Instructions for each group
  instructionsByGroup: {
    1: [
      "Settle down, everyone.",
      "Let's get started.",
      "How are you today?",
      "Do you want to play a game?",
      "Tell me some natural disasters in our country that you know.",
      "Open your books to Unit 5.",
      "Today, we're going to study Unit 5, Global Warming.",
      "Look at the title of the unit.",
      "What do you think this unit is about?",
      "Look at the pictures on page 52.",
      "What can you see in the picture?",
      "Discuss this question with your partner.",
      "Have you ever experienced this situation?",
      "Raise your hand if you agree.",
      "Let's start with a short discussion.",
      "Work in pairs for the warm-up.",
      "You have one minute to think.",
      "Don't worry about right or wrong answers.",
      "Just say what you think.",
      "Okay, let's move on.",
    ],
    2: [
      "I'll divide all of you into groups of three.",
      "Who volunteers to read out loud the tasks' requirements?",
      "Read the text carefully and answer the questions below.",
      "Listen carefully to the recording and take note.",
      "Read the questions first and underline key words.",
      "Write your answers in your notebook.",
      "Match the words with their meanings.",
      "Complete the sentences using the words given.",
      "Choose the correct answer.",
      "Tick the correct option.",
      "Underline the key information.",
      "Scan the text for specific details.",
      "Don't write yet. Just listen.",
      "Write your answers in full sentences.",
      "Discuss your answers with your partner.",
      "Take turns to ask and answer.",
      "Use the structure in the box.",
      "Raise your hand if you choose A.",
      "You have five minutes to complete.",
      "Five minutes start now.",
      "Pay attention to the spelling.",
    ],
    3: [
      "That's correct. Congratulation!",
      "Do you need any help?",
      "Have you all finished?",
      "Keep going. Try another option.",
      "You're doing well.",
      "Try to use English as much as possible.",
      "Talk to your partner, please.",
      "Tell me your answer, please.",
      "Do you want to listen one more time?",
      "Think about the meaning, not just the words.",
      "That's a good idea.",
      "You're on the right track.",
      "Try again.",
      "Don't worry. Take your time.",
      "Compare your answers with your partner.",
      "Speak a bit louder, please.",
      "Make sure everyone in your group participates.",
      "Stay on task, please.",
      "You still have two minutes.",
      "Time's up. Eyes on me now!",
    ],
    4: [
      "Time's up.",
      "Let's check the answers together.",
      "Who would like to answer?",
      "Can you read your answer aloud?",
      "Two students write answers on the board. Others compare and check.",
      "Do you agree or disagree? Thumbs up for agreement, and thumbs down for disagreement.",
      "Any other ideas?",
      "That's correct.",
      "Good job.",
      "Well done.",
      "That's partly correct.",
      "Almost right, but check again.",
      "Listen carefully to this part.",
      "Can anyone help?",
      "That's a common mistake.",
      "Remember to use the correct tense.",
      "Pay attention to pronunciation.",
      "Nice try.",
      "Thank you for your answer.",
      "Let's move to the next question.",
    ],
    5: [
      "Let's move on to the next activity.",
      "Now we're going to focus on speaking.",
      "Put your books away.",
      "Look at the screen, please.",
      "Let's review what we've learned today.",
      "Tell me at least THREE new words you have learnt today?",
      "Can you summarise the main point?",
      "Before we finish, one more question.",
      "Any questions?",
      "For homework, please do exercise …",
      "Prepare the next lesson.",
      "Review the vocabulary at home.",
      "Practice speaking using today's topic.",
      "Don't forget your homework.",
      "We'll continue this part next time.",
      "That's all for today.",
      "Thank you for your attention.",
      "See you next lesson.",
      "Have a nice day.",
      "Class dismissed.",
    ],
  },

  // Situation templates (will be created for each group)
  situations: [
    {
      title: "Student Not Paying Attention",
      description:
        "A student is looking at their phone during the lesson. What do you say?",
      choices: [
        {
          choice_id: "A",
          text: "Please put your phone away and focus on the lesson.",
          rating: "best",
          explanation: "Direct, clear, and maintains classroom management.",
        },
        {
          choice_id: "B",
          text: "Could you please pay attention?",
          rating: "acceptable",
          explanation: "Polite but less specific about the issue.",
        },
        {
          choice_id: "C",
          text: "Give me your phone!",
          rating: "not_recommended",
          explanation: "Too aggressive and may create conflict.",
        },
      ],
      best_choice_id: "A",
    },
    {
      title: "Student Doesn't Understand",
      description:
        "A student raises their hand and says they don't understand the task. What do you say?",
      choices: [
        {
          choice_id: "A",
          text: "Let me explain it again in a different way.",
          rating: "best",
          explanation: "Supportive and offers alternative explanation.",
        },
        {
          choice_id: "B",
          text: "I already explained this. Listen carefully.",
          rating: "not_recommended",
          explanation: "Dismissive and discourages questions.",
        },
        {
          choice_id: "C",
          text: "Ask your partner for help.",
          rating: "acceptable",
          explanation:
            "Promotes peer learning but may not fully address the issue.",
        },
      ],
      best_choice_id: "A",
    },
    {
      title: "Group Work Not Progressing",
      description:
        "You notice a group is not working together effectively. What do you say?",
      choices: [
        {
          choice_id: "A",
          text: "Make sure everyone in your group participates.",
          rating: "best",
          explanation: "Encourages collaboration and equal participation.",
        },
        {
          choice_id: "B",
          text: "Work faster, please.",
          rating: "not_recommended",
          explanation: "Focuses on speed rather than quality of collaboration.",
        },
        {
          choice_id: "C",
          text: "Do you need any help?",
          rating: "acceptable",
          explanation:
            "Supportive but doesn't directly address the collaboration issue.",
        },
      ],
      best_choice_id: "A",
    },
  ],

  // Test users
  users: [
    {
      username: "admin",
      email: "admin@flora.local",
      password: "admin123",
      full_name: "Admin User",
      role: "admin",
    },
    {
      username: "user1",
      email: "user1@flora.local",
      password: "user123",
      full_name: "Nguyễn Văn A",
      role: "user",
    },
    {
      username: "user2",
      email: "user2@flora.local",
      password: "user123",
      full_name: "Trần Thị B",
      role: "user",
    },
  ],
};
