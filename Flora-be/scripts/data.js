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
    {
      group_number: 6,
      name: "Classroom Management",
      description:
        "Instructions for maintaining discipline, focus, and managing the classroom environment",
      color_hex: "#607D8B",
    },
  ],

  // Instructions for each group
  instructionsByGroup: {
    1: [
      "Settle down, everyone.",
      "Let’s get started.",
      "How are you today?",
      "Do you want to play a game?",
      "Tell me some natural disasters in our country that you know.",
      "Open your books to Unit 5.",
      "Today, we’re going to study Unit 5, Global Warming.",
      "Look at the title of the unit.",
      "What do you think this unit is about?",
      "Look at the pictures on page 52",
      "What can you see in the picture?",
      "Discuss this question with your partner.",
      "Have you ever experienced this situation?",
      "Raise your hand if you agree.",
      "Let’s start with a short discussion.",
      "Work in pairs for the warm-up.",
      "You have one minute to think.",
      "Don’t worry about right or wrong answers.",
      "Just say what you think.",
      "Okay, let’s move on.",
    ],
    2: [
      "I’ll divide all of you into groups of three.",
      "Who volunteers to read out loud the tasks’ requirements?",
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
      "Don’t write yet. Just listen.",
      "Write your answers in full sentences.",
      "Discuss your answers with your partner.",
      "Take turns to ask and answer.",
      "Use the structure in the box.",
      "Raise your hand if you choose A",
      "You have five minutes to complete.",
      "Five minutes start now.",
      "Pay attention to the spelling.",
    ],
    3: [
      "That’s correct. Congratulation!",
      "Do you need any help?",
      "Have you all finished?",
      "Keep going. Try another option.",
      "You’re doing well.",
      "Try to use English as much as possible.",
      "Talk to your partner, please.",
      "Tell me your answer, please.",
      "Do you want to listen one more time?",
      "Think about the meaning, not just the words.",
      "That’s a good idea.",
      "You’re on the right track.",
      "Try again.",
      "Don’t worry. Take your time.",
      "Compare your answers with your partner.",
      "Speak a bit louder, please.",
      "Make sure everyone in your group participates.",
      "Stay on task, please.",
      "You still have two minutes.",
      "Time’s up. Eyes on me now!",
    ],
    4: [
      "Time’s up.",
      "Let’s check the answers together.",
      "Who would like to answer?",
      "Can you read your answer aloud?",
      "Two students write answers on the board. Others compare and check.",
      "Do you agree or disagree? Thumbs up for agreement, and thumbs down for disagreement",
      "Any other ideas?",
      "That’s correct.",
      "Good job.",
      "Well done.",
      "That’s partly correct.",
      "Almost right, but check again.",
      "Listen carefully to this part.",
      "Can anyone help?",
      "That’s a common mistake.",
      "Remember to use the correct tense.",
      "Pay attention to pronunciation.",
      "Nice try.",
      "Thank you for your answer.",
      "Let’s move to the next question.",
    ],
    5: [
      "Let’s move on to the next activity.",
      "Now we’re going to focus on speaking.",
      "Put your books away.",
      "Look at the screen, please.",
      "Let’s review what we’ve learned today.",
      "Tell me at least THREE new words you have learnt today?",
      "Can you summarise the main point?",
      "Before we finish, one more question.",
      "Any questions?",
      "For homework, please do exercise …",
      "Prepare the next lesson.",
      "Review the vocabulary at home.",
      "Practice speaking using today’s topic.",
      "Don’t forget your homework.",
      "We’ll continue this part next time.",
      "That’s all for today.",
      "Thank you for your attention.",
      "See you next lesson.",
      "Have a nice day.",
      "Class dismissed.",
    ],
    6: [
      "Everyone, please quiet down.",
      "Let’s keep our voices down, please.",
      "I need your full attention now.",
      "Eyes on me, please.",
      "Stop talking and listen.",
      "Let’s settle down.",
      "Too much noise. Let’s be quiet.",
      "I’m waiting for silence.",
      "If you can hear me, stop talking.",
      "One voice at a time, please.",
      "Lower your voice, please.",
      "Let’s calm down and focus.",
      "We can continue when it’s quiet.",
      "Please respect others who are listening.",
      "This is getting too noisy.",
      "Don’t be shy. Give it a try.",
      "Any ideas? Just say what you think.",
      "There’s no right or wrong answer.",
      "Who would like to share.",
      "Come on, I know you can do better.",
      "Let’s hear from someone else.",
      "Take a guess.",
      "It’s okay to make mistakes.",
      "If no one raises your hand, I’ll call randomly someone.",
      "Be more active, please.",
      "Please stop chatting.",
      "Are you talking about the lesson?",
      "Focus on your work, please.",
      "This is not the time to talk.",
      "Eyes on your book, please.",
      "You can talk later.",
      "Pay attention, please.",
      "Let’s get back to the task.",
      "Please work quietly.",
      "I need you to concentrate.",
      "Time’s up.",
      "Let’s move on.",
      "Stop here, please.",
      "Put your pens down.",
      "Now, listen carefully.",
      "Are you ready?",
      "Let’s check the answers.",
      "Work in pairs, please.",
      "Change roles, please.",
      "Back to your seats.",
      "Good job staying focused.",
      "Thank you for being quiet.",
      "I like the way you’re listening.",
      "Let’s help each other learn.",
      "Keep it up.",
    ],
  },

  // Situation templates (will be created for each group)
  situationsByGroup: {
    1: [
      {
        question: "The class is very noisy when the teacher enters.",
        choices: [
          {
            choice_id: "A",
            text: "Who would like to share?",
            rating: "acceptable",
          },
          {
            choice_id: "B",
            text: "Everyone, please quiet down.",
            rating: "best",
          },
          {
            choice_id: "C",
            text: "Take a guess.",
            rating: "acceptable",
          },
        ],
        best_choice_id: "B",
        detailed_explanation: `At this moment, the teacher’s main goal is classroom control, not interaction.
“Everyone, please quiet down” is a whole-class instruction, clear and immediate, suitable when noise comes from many students at the same time.
Option A is used after a question to invite ideas, not to manage noise.
Option C encourages guessing and participation, which would make the class even noisier.`,
      },
      {
        question: "Students keep talking after being reminded once.",
        choices: [
          {
            choice_id: "A",
            text: "I’m waiting for silence.",
            rating: "best",
          },
          {
            choice_id: "B",
            text: "Let’s hear from someone else.",
            rating: "acceptable",
          },
          {
            choice_id: "C",
            text: "Keep it up.",
            rating: "acceptable",
          },
        ],
        best_choice_id: "A",
        detailed_explanation: `The teacher has already warned the class, so a stronger but calm signal is needed.
“I’m waiting for silence” shows that the lesson will not continue until students stop talking. It uses teacher authority without shouting.
Option B shifts focus to discussion, which is inappropriate when students are noisy.
Option C is praise and would send the wrong message.`,
      },
      {
        question: "Students are too loud during individual work.",
        choices: [
          {
            choice_id: "A",
            text: "Please work quietly.",
            rating: "best",
          },
          {
            choice_id: "B",
            text: "Work in pairs, please.",
            rating: "acceptable",
          },
          {
            choice_id: "C",
            text: "Any ideas?",
            rating: "acceptable",
          },
        ],
        best_choice_id: "A",
        detailed_explanation: `During individual work, students are expected to focus independently.
“Please work quietly” clearly reminds them of both the task type (individual) and the expected noise level.
Option B changes the activity structure and may increase noise.
Option C invites speaking, which goes against the goal of quiet work.`,
      },
      {
        question: "The classroom becomes noisy after group work.",
        choices: [
          {
            choice_id: "A",
            text: "This is getting too noisy.",
            rating: "best",
          },
          {
            choice_id: "B",
            text: "Don’t be shy. Give it a try.",
            rating: "acceptable",
          },
          {
            choice_id: "C",
            text: "Let’s check the answers.",
            rating: "acceptable",
          },
        ],
        best_choice_id: "A",
        detailed_explanation: `After group work, noise often increases naturally.
“This is getting too noisy” is a neutral, non-threatening reminder that helps students self-correct their behavior.
Option B is used to encourage speaking, not reduce noise.
Option C moves to feedback before the class is ready and attentive.`,
      },
      {
        question: "Some students are chatting while the teacher is explaining.",
        choices: [
          {
            choice_id: "A",
            text: "Please stop chatting.",
            rating: "best",
          },
          {
            choice_id: "B",
            text: "Take a guess.",
            rating: "acceptable",
          },
          {
            choice_id: "C",
            text: "Change roles, please.",
            rating: "acceptable",
          },
        ],
        best_choice_id: "A",
        detailed_explanation: `The problem behavior here is side conversations during instruction.
“Please stop chatting” directly names the behavior and clearly tells students what to stop.
Option B invites speaking and is inappropriate.
Option C is only used in pair/group activities.`,
      },
      {
        question: "The teacher wants everyone to look at her.",
        choices: [
          {
            choice_id: "A",
            text: "Eyes on me, please.",
            rating: "best",
          },
          {
            choice_id: "B",
            text: "Back to your seats.",
            rating: "acceptable",
          },
          {
            choice_id: "C",
            text: "Let’s move on.",
            rating: "acceptable",
          },
        ],
        best_choice_id: "A",
        detailed_explanation: `When giving instructions or explanations, teachers need visual attention.
“Eyes on me, please” is short, clear, and commonly used to regain focus quickly.
Option B is about movement, not attention.
Option C assumes the class is already focused.`,
      },
      {
        question: "Students are talking while instructions are being given.",
        choices: [
          {
            choice_id: "A",
            text: "Stop talking and listen.",
            rating: "best",
          },
          {
            choice_id: "B",
            text: "Work in pairs, please.",
            rating: "acceptable",
          },
          {
            choice_id: "C",
            text: "Good job staying focused.",
            rating: "acceptable",
          },
        ],
        best_choice_id: "A",
        detailed_explanation: `This sentence clearly tells students what to stop and what to do next, which is essential when giving instructions.
Option B introduces an activity instead of fixing the problem.
Option C is praise and does not match the situation.`,
      },
      {
        question: "The teacher pauses and waits for silence.",
        choices: [
          {
            choice_id: "A",
            text: "I can still hear your voice.",
            rating: "best",
          },
          {
            choice_id: "B",
            text: "Are you ready?",
            rating: "acceptable",
          },
          {
            choice_id: "C",
            text: "Keep it up.",
            rating: "acceptable",
          },
        ],
        best_choice_id: "A",
        detailed_explanation: `This sentence communicates the teacher’s expectation without raising their voice.
It creates positive pressure for students to self-regulate.
Option B assumes readiness, which is not true yet.
Option C praises behavior that has not happened`,
      },
      {
        question: "The teacher cannot continue because of noise.",
        choices: [
          {
            choice_id: "A",
            text: "We can continue when it’s quiet.",
            rating: "best",
          },
          {
            choice_id: "B",
            text: "Let’s help each other learn.",
            rating: "acceptable",
          },
          {
            choice_id: "C",
            text: "Who would like to share?",
            rating: "acceptable",
          },
        ],
        best_choice_id: "A",
        detailed_explanation: `The teacher sets a clear condition for continuing the lesson.
This helps students understand the consequences of noise.
Option B is positive but too general for immediate control.
Option C increases talking.`,
      },
      {
        question: "Students are discussing too loudly.",
        choices: [
          {
            choice_id: "A",
            text: "Lower your voice, please.",
            rating: "best",
          },
          {
            choice_id: "B",
            text: "Stop here, please.",
            rating: "acceptable",
          },
          {
            choice_id: "C",
            text: "Put your pens down.",
            rating: "acceptable",
          },
        ],
        best_choice_id: "A",
        detailed_explanation: `Students are allowed to talk, but the volume is the problem.
“Lower your voice, please” corrects behavior without stopping interaction.
Option B ends the activity unnecessarily.
Option C is unrelated to speaking volume.`,
      },
    ],
    2: [
      {
        question: "Students are shy about answering.",
        choices: [
          {
            choice_id: "A",
            text: "Don’t be shy. Give it a try.",
            rating: "best",
          },
          {
            choice_id: "B",
            text: "This is not the time to talk.",
            rating: "acceptable",
          },
          {
            choice_id: "C",
            text: "Please work quietly.",
            rating: "acceptable",
          },
        ],
        best_choice_id: "A",
        detailed_explanation: `This sentence provides emotional support, helping students overcome fear of speaking.
Option B discourages speaking.
Option C is for silent work.`,
      },
      {
        question: "Students are afraid of giving wrong answers.",
        choices: [
          {
            choice_id: "A",
            text: "There’s no right or wrong answer.",
            rating: "best",
          },
          {
            choice_id: "B",
            text: "Time’s up.",
            rating: "acceptable",
          },
          {
            choice_id: "C",
            text: "Eyes on your book, please.",
            rating: "acceptable",
          },
        ],
        best_choice_id: "A",
        detailed_explanation: `This reduces anxiety and promotes a safe learning environment where ideas matter more than accuracy.
Option B ends an activity.
Option C shifts focus away from speaking.`,
      },
      {
        question: "No one answers the teacher’s question.",
        choices: [
          {
            choice_id: "A",
            text: "Take a guess.",
            rating: "best",
          },
          {
            choice_id: "B",
            text: "Let’s move on.",
            rating: "acceptable",
          },
          {
            choice_id: "C",
            text: "Put your pens down.",
            rating: "acceptable",
          },
        ],
        best_choice_id: "A",
        detailed_explanation: `“Take a guess” lowers the pressure of being correct and encourages risk-taking.
Option B stops interaction too early.
Option C is unrelated.`,
      },
      {
        question: "The teacher wants another student to respond.",
        choices: [
          {
            choice_id: "A",
            text: "Let’s hear from someone else.",
            rating: "best",
          },
          {
            choice_id: "B",
            text: "Are you ready?",
            rating: "acceptable",
          },
          {
            choice_id: "C",
            text: "Please stop chatting.",
            rating: "acceptable",
          },
        ],
        best_choice_id: "A",
        detailed_explanation: `This promotes equal participation and prevents the same students from dominating.
Option B checks readiness, not participation.
Option C addresses noise, not turn-taking.`,
      },
      {
        question: "Students are passive during discussion.",
        choices: [
          {
            choice_id: "A",
            text: "Be more active, please.",
            rating: "best",
          },
          {
            choice_id: "B",
            text: "Please work quietly.",
            rating: "acceptable",
          },
          {
            choice_id: "C",
            text: "Stop here, please.",
            rating: "acceptable",
          },
        ],
        best_choice_id: "A",
        detailed_explanation: `The teacher directly encourages engagement and participation.
Option B discourages speaking.
Option C ends the activity`,
      },
      {
        question: "Students are talking while others are presenting.",
        choices: [
          {
            choice_id: "A",
            text: "One voice at a time, please.",
            rating: "best",
          },
          {
            choice_id: "B",
            text: "Be more active, please.",
            rating: "acceptable",
          },
          {
            choice_id: "C",
            text: "Take a guess.",
            rating: "acceptable",
          },
        ],
        best_choice_id: "A",
        detailed_explanation: `The teacher’s primary goal here is to protect the speaking space of the presenter and ensure listening discipline.
“One voice at a time, please” clearly sets a turn-taking rule, reminding students that only one person should speak.
Option B encourages more participation, which would worsen the problem.
Option C invites guessing and speaking, which is inappropriate when someone else is presenting.`,
      },
      {
        question: "The class becomes excited and unfocused after a game.",
        choices: [
          {
            choice_id: "A",
            text: "Let’s calm down and focus.",
            rating: "best",
          },
          {
            choice_id: "B",
            text: "Keep it up.",
            rating: "acceptable",
          },
          {
            choice_id: "C",
            text: "Who would like to share?",
            rating: "acceptable",
          },
        ],
        best_choice_id: "A",
        detailed_explanation: `After a game, students often experience high emotional energy.
The teacher’s goal is emotional regulation + cognitive refocusing.
This sentence explicitly addresses both: calming emotions and returning attention to learning.
Option B reinforces excitement instead of reducing it.
Option C encourages more speaking and interaction, delaying refocus.`,
      },
      {
        question: "The noise level is high and starts to disturb learning.",
        choices: [
          {
            choice_id: "A",
            text: "Too much noise. Let’s be quiet.",
            rating: "best",
          },
          {
            choice_id: "B",
            text: "Let’s help each other learn.",
            rating: "acceptable",
          },
          {
            choice_id: "C",
            text: "Are you ready?",
            rating: "acceptable",
          },
        ],
        best_choice_id: "A",
        detailed_explanation: `This is a situation requiring immediate noise control.
The sentence directly identifies the problem (noise) and gives a clear behavioral expectation (be quiet).
Option B promotes values but does not solve the immediate problem.
Option C checks readiness, which is irrelevant while noise persists.`,
      },
      {
        question: "The teacher wants to pause the lesson until students stop talking.",
        choices: [
          {
            choice_id: "A",
            text: "I’m waiting for silence.",
            rating: "best",
          },
          {
            choice_id: "B",
            text: "Let’s move on.",
            rating: "acceptable",
          },
          {
            choice_id: "C",
            text: "Change roles, please.",
            rating: "acceptable",
          },
        ],
        best_choice_id: "A",
        detailed_explanation: `Here, the teacher uses strategic pausing as a classroom management technique.
“I’m waiting for silence” signals that progress is conditional on student behavior, encouraging self-control.
Option B ignores the problem and lowers teacher authority.
Option C changes the activity instead of correcting behavior.`,
      },
      {
        question: "Students interrupt others who are listening.",
        choices: [
          {
            choice_id: "A",
            text: "Please respect others who are listening.",
            rating: "best",
          },
          {
            choice_id: "B",
            text: "Don’t be shy. Give it a try.",
            rating: "acceptable",
          },
          {
            choice_id: "C",
            text: "Time’s up.",
            rating: "acceptable",
          },
        ],
        best_choice_id: "A",
        detailed_explanation: `The issue is not just noise, but lack of respect and listening skills.
This sentence addresses classroom values and social behavior, not just volume.
Option B encourages speaking, which is inappropriate.
Option C ends the activity without addressing the behavior.`,
      },
    ],
    3: [
      {
        question: "The classroom gradually becomes louder again.",
        choices: [
          {
            choice_id: "A",
            text: "This is getting too noisy.",
            rating: "best",
          },
          {
            choice_id: "B",
            text: "Good job staying focused.",
            rating: "acceptable",
          },
          {
            choice_id: "C",
            text: "Let’s hear from someone else.",
            rating: "acceptable",
          },
        ],
        best_choice_id: "A",
        detailed_explanation: `This is an early intervention statement.
The teacher notices rising noise and addresses it before it becomes disruptive.
Option B praises behavior that is not happening.
Option C increases speaking and noise.`,
      },
      {
        question: "Students do not respond because they feel shy.",
        choices: [
          {
            choice_id: "A",
            text: "Don’t be shy. Give it a try.",
            rating: "best",
          },
          {
            choice_id: "B",
            text: "Please work quietly.",
            rating: "acceptable",
          },
          {
            choice_id: "C",
            text: "Stop here, please.",
            rating: "acceptable",
          },
        ],
        best_choice_id: "A",
        detailed_explanation: `The teacher recognizes the barrier as emotional, not cognitive.
This sentence lowers affective filters and encourages risk-taking.
Option B suppresses speaking.
Option C ends the interaction prematurely.`,
      },
      {
        question: "Students hesitate because they are afraid of making mistakes.",
        choices: [
          {
            choice_id: "A",
            text: "It’s okay to make mistakes.",
            rating: "best",
          },
          {
            choice_id: "B",
            text: "Time’s up.",
            rating: "acceptable",
          },
          {
            choice_id: "C",
            text: "Focus on your work, please.",
            rating: "acceptable",
          },
        ],
        best_choice_id: "A",
        detailed_explanation: `Language learning requires experimentation.
This sentence builds a growth mindset and normalizes error as part of learning.
Option B avoids the learning opportunity.
Option C shifts to individual focus, not speaking.`,
      },
      {
        question: "No student volunteers to answer a question.",
        choices: [
          {
            choice_id: "A",
            text: "If no one raises your hand, I’ll randomly call someone.",
            rating: "best",
          },
          {
            choice_id: "B",
            text: "Let’s move on.",
            rating: "acceptable",
          },
          {
            choice_id: "C",
            text: "Keep it up.",
            rating: "acceptable",
          },
        ],
        best_choice_id: "A",
        detailed_explanation: `This creates accountability and gentle pressure while still giving students a chance to volunteer.
Option B reduces participation expectations.
Option C praises behavior that does not exist.`,
      },
      {
        question: "Students appear passive and disengaged.",
        choices: [
          {
            choice_id: "A",
            text: "Be more active, please.",
            rating: "best",
          },
          {
            choice_id: "B",
            text: "Please work quietly.",
            rating: "acceptable",
          },
          {
            choice_id: "C",
            text: "Put your pens down.",
            rating: "acceptable",
          },
        ],
        best_choice_id: "A",
        detailed_explanation: `The teacher’s goal is to increase participation and energy, not reduce noise.
Option B discourages interaction.
Option C ends writing, not engagement.`,
      },
      {
        question: "Students are chatting during task time.",
        choices: [
          {
            choice_id: "A",
            text: "Please stop chatting.",
            rating: "best",
          },
          {
            choice_id: "B",
            text: "Take a guess.",
            rating: "acceptable",
          },
          {
            choice_id: "C",
            text: "Who would like to share?",
            rating: "acceptable",
          },
        ],
        best_choice_id: "A",
        detailed_explanation: `The teacher needs immediate correction of off-task behavior.
Option B and C invite speaking and worsen the issue.`,
      },
      {
        question: "Students talk about topics unrelated to the lesson.",
        choices: [
          {
            choice_id: "A",
            text: "Are you talking about the lesson?",
            rating: "best",
          },
          {
            choice_id: "B",
            text: "Let’s help each other learn.",
            rating: "acceptable",
          },
          {
            choice_id: "C",
            text: "Change roles, please.",
            rating: "acceptable",
          },
        ],
        best_choice_id: "A",
        detailed_explanation: `This question subtly redirects students without accusing or embarrassing them.
Option B is too abstract.
Option C is irrelevant to the issue.`,
      },
      {
        question: "Students lose focus during work time.",
        choices: [
          {
            choice_id: "A",
            text: "Focus on your work, please.",
            rating: "best",
          },
          {
            choice_id: "B",
            text: "Who would like to share?",
            rating: "acceptable",
          },
          {
            choice_id: "C",
            text: "Let’s move on.",
            rating: "acceptable",
          },
        ],
        best_choice_id: "A",
        detailed_explanation: `The teacher wants students to return attention to the task, not change activity.
Option B distracts from work.
Option C skips unfinished learning.`,
      },
      {
        question: "Students talk while the teacher is explaining.",
        choices: [
          {
            choice_id: "A",
            text: "This is not the time to talk.",
            rating: "best",
          },
          {
            choice_id: "B",
            text: "Don’t be shy.",
            rating: "acceptable",
          },
          {
            choice_id: "C",
            text: "Work in pairs, please.",
            rating: "acceptable",
          },
        ],
        best_choice_id: "A",
        detailed_explanation: `The teacher establishes clear behavioral boundaries for instruction time.
Option B encourages talking.
Option C changes lesson structure.`,
      },
      {
        question: "Students are not looking at learning materials.",
        choices: [
          {
            choice_id: "A",
            text: "Eyes on your book, please.",
            rating: "best",
          },
          {
            choice_id: "B",
            text: "Time’s up.",
            rating: "acceptable",
          },
          {
            choice_id: "C",
            text: "Are you ready?",
            rating: "acceptable",
          },
        ],
        best_choice_id: "A",
        detailed_explanation: `The teacher directs visual attention to support comprehension.
Option B ends the task.
Option C checks readiness, not attention.`,
      },
    ],
    4: [
      {
        question: "Students talk while instructions are given.",
        choices: [
          {
            choice_id: "A",
            text: "You can talk later.",
            rating: "best",
          },
          {
            choice_id: "B",
            text: "Take a guess.",
            rating: "acceptable",
          },
          {
            choice_id: "C",
            text: "Keep it up.",
            rating: "acceptable",
          },
        ],
        best_choice_id: "A",
        detailed_explanation: `This politely postpones talking and keeps the lesson moving.
Option B invites immediate speaking.
Option C reinforces inappropriate behavior.`,
      },
      {
        question: "Students appear distracted.",
        choices: [
          {
            choice_id: "A",
            text: "Pay attention, please.",
            rating: "best",
          },
          {
            choice_id: "B",
            text: "Let’s check the answers.",
            rating: "acceptable",
          },
          {
            choice_id: "C",
            text: "Who would like to share?",
            rating: "acceptable",
          },
        ],
        best_choice_id: "A",
        detailed_explanation: `A direct reminder is most effective before changing activity.
Option B assumes readiness.
Option C increases talking.`,
      },
      {
        question: "Students are slow to return to work after an activity.",
        choices: [
          {
            choice_id: "A",
            text: "Let’s get back to the task.",
            rating: "best",
          },
          {
            choice_id: "B",
            text: "Take a guess.",
            rating: "acceptable",
          },
          {
            choice_id: "C",
            text: "Keep it up.",
            rating: "acceptable",
          },
        ],
        best_choice_id: "A",
        detailed_explanation: `This helps students transition smoothly from one activity to another.
Option B distracts.
Option C maintains off-task behavior.`,
      },
      {
        question: "Students struggle to concentrate during quiet work.",
        choices: [
          {
            choice_id: "A",
            text: "I need you to concentrate.",
            rating: "best",
          },
          {
            choice_id: "B",
            text: "Time’s up.",
            rating: "acceptable",
          },
          {
            choice_id: "C",
            text: "Back to your seats.",
            rating: "acceptable",
          },
        ],
        best_choice_id: "A",
        detailed_explanation: `The teacher clearly communicates expectations for mental focus, not physical movement.
Option B ends work too early.
Option C addresses seating, not attention.`,
      },
      {
        question: "The activity time ends.",
        choices: [
          {
            choice_id: "A",
            text: "Time’s up.",
            rating: "best",
          },
          {
            choice_id: "B",
            text: "Take a guess.",
            rating: "acceptable",
          },
          {
            choice_id: "C",
            text: "Please stop chatting.",
            rating: "acceptable",
          },
        ],
        best_choice_id: "A",
        detailed_explanation: `This is a clear time-management signal recognized by students.`,
      },
      {
        question: "The teacher wants to move to the next activity or section.",
        choices: [
          {
            choice_id: "A",
            text: "Let’s move on.",
            rating: "best",
          },
          {
            choice_id: "B",
            text: "Any ideas?",
            rating: "acceptable",
          },
          {
            choice_id: "C",
            text: "Put your pens down.",
            rating: "acceptable",
          },
        ],
        best_choice_id: "A",
        detailed_explanation: `At this point, the teacher’s goal is lesson progression and time management.
“Let’s move on” clearly signals a transition without reopening discussion or giving physical instructions.
Option B invites ideas and extends the current activity.
Option C focuses on stopping writing, which may not be necessary in all transitions.`,
      },
      {
        question: "The teacher wants students to stop writing and listen.",
        choices: [
          {
            choice_id: "A",
            text: "Put your pens down.",
            rating: "best",
          },
          {
            choice_id: "B",
            text: "Focus on your work.",
            rating: "acceptable",
          },
          {
            choice_id: "C",
            text: "Change roles, please.",
            rating: "acceptable",
          },
        ],
        best_choice_id: "A",
        detailed_explanation: `The teacher needs students to physically stop writing so they can listen.
“Put your pens down” is a clear, observable action that immediately changes student behavior.
Option B encourages continued work, not listening.
Option C is only relevant in pair or group activities.`,
      },
      {
        question: "The teacher is about to give important instructions.",
        choices: [
          {
            choice_id: "A",
            text: "Now, listen carefully.",
            rating: "best",
          },
          {
            choice_id: "B",
            text: "Work in pairs, please.",
            rating: "acceptable",
          },
          {
            choice_id: "C",
            text: "Keep it up.",
            rating: "acceptable",
          },
        ],
        best_choice_id: "A",
        detailed_explanation: `Before giving key information, the teacher must secure full attention.
This sentence prepares students mentally to listen and process instructions.
Option B introduces an activity too early.
Option C is praise and does not signal importance.`,
      },
      {
        question: "The teacher checks whether students are ready to continue.",
        choices: [
          {
            choice_id: "A",
            text: "Are you ready?",
            rating: "best",
          },
          {
            choice_id: "B",
            text: "Please stop chatting.",
            rating: "acceptable",
          },
          {
            choice_id: "C",
            text: "Time’s up.",
            rating: "acceptable",
          },
        ],
        best_choice_id: "A",
        detailed_explanation: `The teacher wants to confirm readiness before moving forward.
This question invites a response and allows the teacher to adjust pacing if needed.
Option B addresses behavior, not readiness.
Option C signals the end of time, not preparation.`,
      },
      {
        question: "The teacher wants to review students’ work together.",
        choices: [
          {
            choice_id: "A",
            text: "Let’s check the answers.",
            rating: "best",
          },
          {
            choice_id: "B",
            text: "Take a guess.",
            rating: "acceptable",
          },
          {
            choice_id: "C",
            text: "Let’s calm down.",
            rating: "acceptable",
          },
        ],
        best_choice_id: "A",
        detailed_explanation: `This sentence signals a shift from doing the task to reviewing and evaluating it.
Option B encourages guessing rather than checking.
Option C focuses on behavior, not content.`,
      },
    ],
    5: [
      {
        question: "The teacher wants students to work with a partner.",
        choices: [
          {
            choice_id: "A",
            text: "Work in pairs, please.",
            rating: "best",
          },
          {
            choice_id: "B",
            text: "Please work quietly.",
            rating: "acceptable",
          },
          {
            choice_id: "C",
            text: "Stop here, please.",
            rating: "acceptable",
          },
        ],
        best_choice_id: "A",
        detailed_explanation: `The teacher is organizing the interaction structure.
This sentence gives a clear instruction about grouping.
Option B focuses on noise level, not grouping.
Option C ends the activity instead of starting one.`,
      },
      {
        question: "Students need to swap responsibilities in a pair or group.",
        choices: [
          {
            choice_id: "A",
            text: "Change roles, please.",
            rating: "best",
          },
          {
            choice_id: "B",
            text: "Back to your seats.",
            rating: "acceptable",
          },
          {
            choice_id: "C",
            text: "Keep it up.",
            rating: "acceptable",
          },
        ],
        best_choice_id: "A",
        detailed_explanation: `Changing roles ensures equal participation and balanced practice.
This instruction is specific to collaborative activities.
Option B concerns physical movement.
Option C is praise, not instruction.`,
      },
      {
        question: "Students are moving around and need to return to their places.",
        choices: [
          {
            choice_id: "A",
            text: "Back to your seats.",
            rating: "best",
          },
          {
            choice_id: "B",
            text: "Who would like to share?",
            rating: "acceptable",
          },
          {
            choice_id: "C",
            text: "Take a guess.",
            rating: "acceptable",
          },
        ],
        best_choice_id: "A",
        detailed_explanation: `After movement activities, the teacher needs to restore order and structure.
This instruction is clear and immediately actionable.
Option B invites speaking.
Option C encourages guessing, not seating.`,
      },
      {
        question: "Students are working quietly and attentively.",
        choices: [
          {
            choice_id: "A",
            text: "Good job staying focused.",
            rating: "best",
          },
          {
            choice_id: "B",
            text: "Time’s up.",
            rating: "acceptable",
          },
          {
            choice_id: "C",
            text: "Stop talking and listen.",
            rating: "acceptable",
          },
        ],
        best_choice_id: "A",
        detailed_explanation: `The teacher reinforces positive behavior through specific praise, which increases the chance students will repeat it.
Option B ends the activity unnecessarily.
Option C corrects behavior that is not problematic.`,
      },
      {
        question: "Students stop talking after the teacher’s request.",
        choices: [
          {
            choice_id: "A",
            text: "Thank you for being quiet.",
            rating: "best",
          },
          {
            choice_id: "B",
            text: "Let’s move on.",
            rating: "acceptable",
          },
          {
            choice_id: "C",
            text: "Are you ready?",
            rating: "acceptable",
          },
        ],
        best_choice_id: "A",
        detailed_explanation: `This acknowledges compliance and builds a positive teacher–student relationship.
Option B skips reinforcement.
Option C checks readiness instead of giving feedback.`,
      },
      {
        question: "Students are listening attentively to instructions.",
        choices: [
          {
            choice_id: "A",
            text: "I like the way you’re listening.",
            rating: "best",
          },
          {
            choice_id: "B",
            text: "Please stop chatting.",
            rating: "acceptable",
          },
          {
            choice_id: "C",
            text: "Work in pairs, please.",
            rating: "acceptable",
          },
        ],
        best_choice_id: "A",
        detailed_explanation: `Specific praise strengthens listening behavior and encourages others to follow.
Option B addresses a problem that does not exist.
Option C changes the activity unnecessarily.`,
      },
      {
        question: "The teacher wants to promote cooperation and support.",
        choices: [
          {
            choice_id: "A",
            text: "Let’s help each other learn.",
            rating: "best",
          },
          {
            choice_id: "B",
            text: "Put your pens down.",
            rating: "acceptable",
          },
          {
            choice_id: "C",
            text: "Time’s up.",
            rating: "acceptable",
          },
        ],
        best_choice_id: "A",
        detailed_explanation: `This sentence reinforces collaborative values and a supportive learning environment.
Option B addresses writing, not cooperation.
Option C ends the activity.`,
      },
      {
        question: "Students are doing well and the teacher wants to motivate them.",
        choices: [
          {
            choice_id: "A",
            text: "Keep it up.",
            rating: "best",
          },
          {
            choice_id: "B",
            text: "Stop here, please.",
            rating: "acceptable",
          },
          {
            choice_id: "C",
            text: "Be more active, please.",
            rating: "acceptable",
          },
        ],
        best_choice_id: "A",
        detailed_explanation: `“Keep it up” is short encouragement that maintains momentum and motivation.
Option B stops progress.
Option C suggests students are not active enough.`,
      },
      {
        question: "The teacher needs immediate silence from the whole class.",
        choices: [
          {
            choice_id: "A",
            text: "If you can hear me, stop talking.",
            rating: "best",
          },
          {
            choice_id: "B",
            text: "Take a guess.",
            rating: "acceptable",
          },
          {
            choice_id: "C",
            text: "Change roles, please.",
            rating: "acceptable",
          },
        ],
        best_choice_id: "A",
        detailed_explanation: `This is an attention-getting strategy that works without shouting and quickly reduces noise.
Option B increases talking.
Option C is unrelated to attention control.`,
      },
      {
        question: "Students need to refocus on the lesson after being distracted.",
        choices: [
          {
            choice_id: "A",
            text: "Let’s get back to the task.",
            rating: "best",
          },
          {
            choice_id: "B",
            text: "Who would like to share?",
            rating: "acceptable",
          },
          {
            choice_id: "C",
            text: "Keep it up.",
            rating: "acceptable",
          },
        ],
        best_choice_id: "A",
        detailed_explanation: `This sentence smoothly redirects students back to learning without scolding.
Option B encourages speaking before focus is restored.
Option C reinforces off-task behavior.`,
      },
    ],
 
  },

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
      username: "thuychitest",
      email: "thuychitest@flora.local",
      password: "thuychitest",
      full_name: "Khuất Thị Thủy Chi",
      role: "user",
    },
    {
      username: "huonglinhtest",
      email: "huonglinhtest@flora.local",
      password: "huonglinhtest",
      full_name: "Tô Linh Hương",
      role: "user",
    },
    {
      username: "mytamtest",
      email: "mytamtest@flora.local",
      password: "mytamtest",
      full_name: "Nguyễn Thị Mỹ Tâm",
      role: "user",
    },
  ],
};
