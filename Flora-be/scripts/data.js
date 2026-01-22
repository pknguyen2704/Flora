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

  // Global Quizzes
  quizzes: [
    {
      question: "Late Arrival: It’s 10 minutes past the bell. A student, Tom, opens the door and walks in.",
      choices: [
        { choice_id: "A", text: "You’re late.", rating: "not recommended" },
        { choice_id: "B", text: "That’s all right. Sit down and we can start.", rating: "best" },
        { choice_id: "C", text: "But try not to be late next time.", rating: "acceptable" }
      ],
      best_choice_id: "B",
      explanation: "Answer B keeps the lesson moving and avoids embarrassing the student in front of the class. It shows tolerance while maintaining lesson flow. Answer C can be used as a follow-up reminder but should not be the first reaction. Answer A is too direct and may create tension or anxiety.",
      principle: "In classroom routines, teachers should prioritize lesson continuity and a supportive atmosphere over public reprimands."
    },
    {
      question: "Noisy Start: The lesson should have started, but students are still chatting loudly about their weekend.",
      choices: [
        { choice_id: "A", text: "It’s time to start.", rating: "acceptable" },
        { choice_id: "B", text: "I’m waiting to start.", rating: "not recommended" },
        { choice_id: "C", text: "Settle down, everybody.", rating: "best" }
      ],
      best_choice_id: "C",
      explanation: "“Settle down, everybody” is a clear whole-class instruction that directly addresses noise and behavior. “It’s time to start” signals the lesson beginning but does not explicitly control noise. “I’m waiting to start” is passive and may not be effective with a noisy class.",
      principle: "When the whole class is noisy, instructions should be direct, explicit, and addressed to everyone."
    },
    {
      question: "Irrelevant Materials: A student has their Chemistry book open on their desk during the English lesson.",
      choices: [
        { choice_id: "A", text: "Put your things away, please.", rating: "best" },
        { choice_id: "B", text: "Put your geography book away.", rating: "acceptable" },
        { choice_id: "C", text: "This is an English lesson, not a biology lesson.", rating: "not recommended" }
      ],
      best_choice_id: "A",
      explanation: "Answer A corrects the behavior politely without embarrassing the student. Answer B works but assumes the wrong subject and may sound careless. Answer C sounds sarcastic and may damage teacher–student rapport.",
      principle: "Corrections should be neutral and task-focused rather than personal or sarcastic."
    },
    {
      question: "Forgotten Textbook: A student, Sara, realizes she forgot her textbook at home.",
      choices: [
        { choice_id: "A", text: "Is there anybody without a textbook?", rating: "acceptable" },
        { choice_id: "B", text: "Share with someone else.", rating: "best" },
        { choice_id: "C", text: "Don’t forget it next time.", rating: "not recommended" }
      ],
      best_choice_id: "B",
      explanation: "Answer B offers an immediate practical solution so learning can continue. Answer A is useful for identifying the situation but does not solve it yet. Answer C focuses on blame instead of supporting learning in the moment.",
      principle: "When materials are missing, teachers should first ensure participation, then address responsibility later."
    },
    {
      question: "Classroom Temperature: You walk into the room and immediately feel it is uncomfortably hot and stuffy.",
      choices: [
        { choice_id: "A", text: "Phew! It’s warm in here today.", rating: "not recommended" },
        { choice_id: "B", text: "Open a window, please.", rating: "best" },
        { choice_id: "C", text: "Let’s have/keep the door open.", rating: "acceptable" }
      ],
      best_choice_id: "B",
      explanation: "Answer B gives a clear, actionable instruction to improve learning conditions. Answer C is also practical but may not be enough on its own. Answer A only comments on the situation without solving it.",
      principle: "Teachers should give clear instructions rather than observations when action is needed."
    },
    {
      question: "Attendance Check: You are taking the register and notice a student, Mari, is absent.",
      choices: [
        { choice_id: "A", text: "Let’s see if everyone’s here.", rating: "acceptable" },
        { choice_id: "B", text: "Who’s absent?", rating: "not recommended" },
        { choice_id: "C", text: "Where’s Mari this morning?", rating: "best" },
        { choice_id: "D", text: "Does anybody know why?", rating: "acceptable" }
      ],
      best_choice_id: "C",
      explanation: "Answer C identifies the absent student clearly and naturally during the register. Answer A is general and suitable at the start of roll call. Answer D can be useful but may lead to speculation. Answer B is vague and less efficient.",
      principle: "Attendance language should be clear, specific, and factual."
    },
    {
      question: "Student’s Return: Kai returns to class after being away for two weeks due to illness.",
      choices: [
        { choice_id: "A", text: "Welcome back! We missed you.", rating: "best" },
        { choice_id: "B", text: "Are you feeling better today, Kai?", rating: "acceptable" },
        { choice_id: "C", text: "I hope you can catch up.", rating: "not recommended" }
      ],
      best_choice_id: "A",
      explanation: "Answer A creates a warm, supportive classroom atmosphere. Answer B shows care but focuses on health rather than reintegration. Answer C may sound pressuring instead of welcoming.",
      principle: "Returning students should feel emotionally supported before academic expectations are emphasized."
    },
    {
      question: "Checking Homework Status: You start the lesson by checking the assigned homework.",
      choices: [
        { choice_id: "A", text: "First of all, (this time) we’ll check your homework.", rating: "best" },
        { choice_id: "B", text: "Did you all (manage to) do exercise 12/prepare this chapter?", rating: "acceptable" }
      ],
      best_choice_id: "A",
      explanation: "Answer A clearly signals lesson structure and next steps. Answer B checks completion but does not organize the lesson sequence.",
      principle: "Clear lesson staging helps students follow classroom routines more easily."
    },
    {
      question: "End of Break Transition: The short break is over, and you need students to immediately return to their seats.",
      choices: [
        { choice_id: "A", text: "It’s time to get started again.", rating: "acceptable" },
        { choice_id: "B", text: "On/Off we go again!", rating: "not recommended" },
        { choice_id: "C", text: "Let’s get back to work.", rating: "best" }
      ],
      best_choice_id: "C",
      explanation: "Answer C directly signals the transition back to learning. Answer A is neutral but less action-oriented. Answer B is informal and may not prompt immediate compliance.",
      principle: "After breaks, transition language should be clear and task-focused."
    },
    {
      question: "Setting Homework: You need to assign the remaining reading task as homework for the next lesson.",
      choices: [
        { choice_id: "A", text: "This is your homework for tonight/next time/next lesson.", rating: "best" },
        { choice_id: "B", text: "Finish this off at home.", rating: "acceptable" },
        { choice_id: "C", text: "Don’t forget about your homework.", rating: "not recommended" }
      ],
      best_choice_id: "A",
      explanation: "Answer A clearly defines the task and time frame. Answer B works but lacks specificity. Answer C is a reminder, not a clear assignment.",
      principle: "Homework instructions should be explicit about task and deadline."
    },
    {
      question: "Switching Language: Students are discussing a task using their L1, and you need to remind them to use English.",
      choices: [
        { choice_id: "A", text: "In English, please.", rating: "best" },
        { choice_id: "B", text: "Try to use English.", rating: "acceptable" },
        { choice_id: "C", text: "Use English as much as you can.", rating: "acceptable" }
      ],
      best_choice_id: "A",
      explanation: "Answer A is short, clear, and immediately corrects the behavior. Answers B and C are softer reminders and work better when the problem is not serious.",
      principle: "Language reminders should be brief and non-disruptive."
    },
    {
      question: "Starting a New Task: You have finished checking homework and need to announce the next activity (e.g., group work).",
      choices: [
        { choice_id: "A", text: "Let’s move on.", rating: "best" },
        { choice_id: "B", text: "(Now) we’ll/let’s go on.", rating: "acceptable" },
        { choice_id: "C", text: "Now we’ll do another exercise.", rating: "acceptable" }
      ],
      best_choice_id: "A",
      explanation: "Answer A clearly signals a transition. Answers B and C also work but are less concise.",
      principle: "Transitions should be simple and clearly mark lesson progression."
    },
    {
      question: "Setting Time Limits: You assign an individual reading task and want to give them exactly five minutes.",
      choices: [
        { choice_id: "A", text: "You have five minutes.", rating: "best" },
        { choice_id: "B", text: "I’ll give you five minutes on this/to do this.", rating: "acceptable" },
        { choice_id: "C", text: "Don’t spend more than a few minutes on/doing this exercise.", rating: "not recommended" }
      ],
      best_choice_id: "A",
      explanation: "Answer A is precise and unambiguous. Answer C is vague and may confuse students.",
      principle: "Time limits should be clear and specific."
    },
    {
      question: "Checking Instructions: You have just explained a complex activity and need to check if everyone understood what to do.",
      choices: [
        { choice_id: "A", text: "Is everything clear?", rating: "acceptable" },
        { choice_id: "B", text: "Are there any questions (before we start)?", rating: "best" },
        { choice_id: "C", text: "Have you all understood?", rating: "acceptable" }
      ],
      best_choice_id: "B",
      explanation: "Answer B invites clarification more naturally than yes/no questions.",
      principle: "Effective instruction checking encourages questions, not silence."
    },
    {
      question: "Starting Work: The instructions are clear, and you need the students to immediately begin working.",
      choices: [
        { choice_id: "A", text: "Right. You can start.", rating: "best" },
        { choice_id: "B", text: "Away/Off you go.", rating: "acceptable" },
        { choice_id: "C", text: "Let’s get to work.", rating: "acceptable" }
      ],
      best_choice_id: "A",
      explanation: "Answer A is direct and signals immediate action.",
      principle: "Clear start signals reduce hesitation and wasted time."
    },
    {
      question: "Warning Time: Students are busy working in pairs, and you need to warn them they only have two minutes left.",
      choices: [
        { choice_id: "A", text: "OK, everybody. Two more minutes.", rating: "best" },
        { choice_id: "B", text: "(Just) a couple more minutes.", rating: "acceptable" },
        { choice_id: "C", text: "One minute left/remaining/to go.", rating: "acceptable" }
      ],
      best_choice_id: "A",
      explanation: "Answer A gives a clear and specific time warning.",
      principle: "Time warnings help students manage pace and finish tasks."
    },
    {
      question: "Stopping Work: The timer rings, and students need to stop immediately before checking the answers.",
      choices: [
        { choice_id: "A", text: "Right. That’s enough.", rating: "acceptable" },
        { choice_id: "B", text: "All right. Stop now.", rating: "acceptable" },
        { choice_id: "C", text: "Stop writing/working.", rating: "best" }
      ],
      best_choice_id: "C",
      explanation: "Answer C specifies the exact action to stop.",
      principle: "Stopping instructions should be explicit and observable."
    },
    {
      question: "Forming Pairs: You need the students to move from individual work to a pair activity quickly.",
      choices: [
        { choice_id: "A", text: "Find yourself a partner.", rating: "best" },
        { choice_id: "B", text: "I want you to pair off.", rating: "acceptable" },
        { choice_id: "C", text: "Work together with a friend/your neighbour/the person next to you.", rating: "acceptable" }
      ],
      best_choice_id: "A",
      explanation: "Answer A is natural and quick to process.",
      principle: "Grouping instructions should minimize confusion and movement time."
    },
    {
      question: "Forming Groups: You need to divide the class of 24 students into working groups of four.",
      choices: [
        { choice_id: "A", text: "Work in groups.", rating: "best" },
        { choice_id: "B", text: "Get into groups. Three students in/to each group.", rating: "acceptable" },
        { choice_id: "C", text: "I’d like you to arrange/divide yourselves into two teams/threes.", rating: "not recommended" }
      ],
      best_choice_id: "A",
      explanation: "Answer A fits the requirement clearly. Answer B gives incorrect numbers.",
      principle: "Group size instructions must match the task exactly."
    },
    {
      question: "Odd Number of Students: You have 15 students, and you asked them to work in pairs. Melanie is left alone.",
      choices: [
        { choice_id: "A", text: "Is there anybody on their own/left over/without a partner?", rating: "acceptable" },
        { choice_id: "B", text: "Could you join this group, Melanie?", rating: "best" },
        { choice_id: "C", text: "You’ll have to join Julia’s group.", rating: "not recommended" }
      ],
      best_choice_id: "B",
      explanation: "Answer B solves the problem politely and directly.",
      principle: "Individual students should be addressed respectfully and clearly."
    },
    {
      question: "Individual Work Instructions: You are giving a test and need to ensure students work independently.",
      choices: [
        { choice_id: "A", text: "Work on your own.", rating: "best" },
        { choice_id: "B", text: "Work by yourself/yourselves.", rating: "acceptable" },
        { choice_id: "C", text: "Everybody work individually.", rating: "acceptable" },
        { choice_id: "D", text: "No cheating, please.", rating: "not recommended" }
      ],
      best_choice_id: "A",
      explanation: "Answer A sets expectations positively without accusing students.",
      principle: "Instructions should focus on desired behavior, not suspicion."
    },
    {
      question: "Reading Aloud – Nomination: Students are reading a dialogue in turns. It is Tim’s turn.",
      choices: [
        { choice_id: "A", text: "Your turn.", rating: "acceptable" },
        { choice_id: "B", text: "It’s your turn (to read), Tim.", rating: "best" },
        { choice_id: "C", text: "Go ahead, Ibrahim.", rating: "not recommended" }
      ],
      best_choice_id: "B",
      explanation: "Answer B avoids ambiguity and names the student clearly.",
      principle: "Clear nomination prevents confusion in whole-class activities."
    },
    {
      question: "Reading Aloud – Stopping: Tim has read a long paragraph, and you want the next student to continue.",
      choices: [
        { choice_id: "A", text: "Stop there, please.", rating: "best" },
        { choice_id: "B", text: "That’s enough/fine, thank you.", rating: "acceptable" },
        { choice_id: "C", text: "That will do fine/nicely, thank you.", rating: "acceptable" }
      ],
      best_choice_id: "A",
      explanation: "Answer A gives a clear stopping point.",
      principle: "Stopping cues should be polite but firm."
    },
    {
      question: "Calling for Volunteers: You need someone to come to the board to write down the brainstormed ideas.",
      choices: [
        { choice_id: "A", text: "Who would like to do this?", rating: "best" },
        { choice_id: "B", text: "Are there any volunteers?", rating: "acceptable" },
        { choice_id: "C", text: "Anybody willing to clean the board for me?", rating: "not recommended" }
      ],
      best_choice_id: "A",
      explanation: "Answer A directly matches the task.",
      principle: "Volunteer requests should match the task purpose."
    },
    {
      question: "Managing Overeager Students: Piia keeps raising her hand to answer, even though she has already had two turns.",
      choices: [
        { choice_id: "A", text: "Not you again.", rating: "not recommended" },
        { choice_id: "B", text: "You’ve already had a turn/go.", rating: "acceptable" },
        { choice_id: "C", text: "Let’s give someone else a chance.", rating: "best" }
      ],
      best_choice_id: "C",
      explanation: "Answer C encourages fairness without embarrassing the student.",
      principle: "Participation management should be inclusive and respectful."
    },
    {
      question: "Excessive Noise Level: The classroom noise level during group work has become too high.",
      choices: [
        { choice_id: "A", text: "There’s too much noise.", rating: "acceptable" },
        { choice_id: "B", text: "Quiet, please!", rating: "not recommended" },
        { choice_id: "C", text: "Keep your voices down.", rating: "best" }
      ],
      best_choice_id: "C",
      explanation: "Answer C allows students to continue working while adjusting their volume appropriately. Answer A identifies the problem but does not clearly guide behavior. Answer B is abrupt and may sound impatient during group work.",
      principle: "When managing noise during activities, teachers should correct behavior without stopping productive interaction."
    },
    {
      question: "Inattentive Students: You are giving crucial instructions, but a group of students is looking elsewhere and talking.",
      choices: [
        { choice_id: "A", text: "Please listen to the instructions.", rating: "acceptable" },
        { choice_id: "B", text: "Can I have your attention?", rating: "acceptable" },
        { choice_id: "C", text: "It is important that I have your full attention now, please.", rating: "best" }
      ],
      best_choice_id: "C",
      explanation: "Answer C clearly communicates urgency and importance. Answer B is polite and effective in most situations. Answer A is correct but less emphatic.",
      principle: "Important instructions require explicit attention signals."
    },
    {
      question: "Student Out of Seat: Simon is wandering around the back of the class during quiet work time.",
      choices: [
        { choice_id: "A", text: "Simon, what are you doing out of your seat?", rating: "not recommended" },
        { choice_id: "B", text: "Sit down, please.", rating: "acceptable" },
        { choice_id: "C", text: "Go back to your seat.", rating: "best" }
      ],
      best_choice_id: "C",
      explanation: "Answer C is clear and corrective without confrontation. Answer B is polite but less specific. Answer A may embarrass the student publicly.",
      principle: "Correct behavior directly while preserving student dignity."
    },
    {
      question: "Distracting Behaviour: Joe is tapping his pen repeatedly on his desk, annoying other students.",
      choices: [
        { choice_id: "A", text: "Stop that.", rating: "not recommended" },
        { choice_id: "B", text: "Don’t keep fidgeting.", rating: "acceptable" },
        { choice_id: "C", text: "Please don’t tap your fingers.", rating: "best" }
      ],
      best_choice_id: "C",
      explanation: "Answer C is polite and specific. Answer B is informal but acceptable. Answer A is too abrupt.",
      principle: "Behavior correction should be calm and specific."
    },
    {
      question: "Positive Feedback (Correct Answer): Maria answers a complex question correctly.",
      choices: [
        { choice_id: "A", text: "That’s right.", rating: "acceptable" },
        { choice_id: "B", text: "Excellent.", rating: "best" },
        { choice_id: "C", text: "Well done.", rating: "acceptable" }
      ],
      best_choice_id: "B",
      explanation: "Answer B gives strong positive reinforcement. Answers A and C are supportive but less enthusiastic.",
      principle: "Specific praise reinforces successful learning."
    },
    {
      question: "Negative Feedback (Incorrect Answer): Tim answers a question, but his response is grammatically incorrect.",
      choices: [
        { choice_id: "A", text: "No, that’s wrong.", rating: "not recommended" },
        { choice_id: "B", text: "Not quite right.", rating: "acceptable" },
        { choice_id: "C", text: "Good try, but not quite right.", rating: "best" }
      ],
      best_choice_id: "C",
      explanation: "Answer C balances correction with encouragement. Answer B is neutral but less supportive. Answer A may discourage participation.",
      principle: "Error correction should support confidence and learning."
    },
    {
      question: "Encouraging Retry: A shy student, Lena, gives a wrong answer and looks discouraged.",
      choices: [
        { choice_id: "A", text: "Have another try.", rating: "acceptable" },
        { choice_id: "B", text: "Don’t give up.", rating: "acceptable" },
        { choice_id: "C", text: "You’re on the right track.", rating: "best" }
      ],
      best_choice_id: "C",
      explanation: "Answer C reassures the student and guides further effort. Answers A and B encourage persistence.",
      principle: "Encouragement reduces anxiety and promotes risk-taking."
    },
    {
      question: "Speaking Too Quietly: Minna answers your question but speaks so softly that you can barely hear her.",
      choices: [
        { choice_id: "A", text: "Sorry?", rating: "acceptable" },
        { choice_id: "B", text: "Louder, please.", rating: "acceptable" },
        { choice_id: "C", text: "Could you repeat what you said?", rating: "best" }
      ],
      best_choice_id: "C",
      explanation: "Answer C is polite and clear. Answer B is direct but acceptable. Answer A may sound unclear.",
      principle: "Teachers should request clarification politely."
    },
    {
      question: "Slow Work Pace: The deadline for a written exercise is approaching, but a few students are still moving slowly.",
      choices: [
        { choice_id: "A", text: "I’ll have to hurry you.", rating: "acceptable" },
        { choice_id: "B", text: "Let’s pick up the pace.", rating: "best" },
        { choice_id: "C", text: "Hurry up now.", rating: "not recommended" }
      ],
      best_choice_id: "B",
      explanation: "Answer B motivates without pressure. Answer A is neutral. Answer C may sound harsh.",
      principle: "Motivation works better than pressure."
    },
    {
      question: "Misunderstanding/Needs Repetition: A student asks you to repeat the instructions because they missed the beginning.",
      choices: [
        { choice_id: "A", text: "I didn’t catch what you said.", rating: "acceptable" },
        { choice_id: "B", text: "Could you speak more slowly?", rating: "acceptable" },
        { choice_id: "C", text: "Shall I go over the instructions again?", rating: "best" }
      ],
      best_choice_id: "C",
      explanation: "Answer C directly solves the problem. Answers A and B are clarification tools.",
      principle: "Teachers should ensure clarity of instructions."
    },
    {
      question: "Looking for Help: A student raises their hand and looks confused about the task.",
      choices: [
        { choice_id: "A", text: "Any problems?", rating: "acceptable" },
        { choice_id: "B", text: "What’s the matter?", rating: "acceptable" },
        { choice_id: "C", text: "Are you stuck?", rating: "best" }
      ],
      best_choice_id: "C",
      explanation: "Answer C clearly identifies learning difficulty.",
      principle: "Offer help without judgment."
    },
    {
      question: "Cleaning up: The class has finished an art project, and there is paper and glue all over the desks.",
      choices: [
        { choice_id: "A", text: "What a mess!", rating: "not recommended" },
        { choice_id: "B", text: "Let’s tidy up before we begin.", rating: "best" },
        { choice_id: "C", text: "Pick up the rubbish, please.", rating: "acceptable" }
      ],
      best_choice_id: "B",
      explanation: "Answer B encourages cooperation. Answer A sounds critical.",
      principle: "Use inclusive language for classroom management."
    },
    {
      question: "Returning to Normal Seating: After a group activity where students rearranged desks, you need to set the room back to rows.",
      choices: [
        { choice_id: "A", text: "We have to put the furniture back.", rating: "acceptable" },
        { choice_id: "B", text: "Put the desks in their original rows.", rating: "best" },
        { choice_id: "C", text: "Please make sure the desks are straight.", rating: "acceptable" }
      ],
      best_choice_id: "B",
      explanation: "Answer B gives clear instruction.",
      principle: "Be specific with physical classroom arrangements."
    },
    {
      question: "Apology for Teacher Mistake: You realize you wrote the wrong date or page number on the board.",
      choices: [
        { choice_id: "A", text: "I’m sorry. I’ve made a mistake.", rating: "best" },
        { choice_id: "B", text: "I didn’t notice it.", rating: "acceptable" },
        { choice_id: "C", text: "It should say…", rating: "acceptable" }
      ],
      best_choice_id: "A",
      explanation: "Answer A models accountability.",
      principle: "Teachers should model responsibility."
    },
    {
      question: "General Praise (End of Lesson): The class has worked diligently on a challenging task all lesson.",
      choices: [
        { choice_id: "A", text: "You have worked very well today.", rating: "best" },
        { choice_id: "B", text: "Well done everybody.", rating: "acceptable" },
        { choice_id: "C", text: "Excellent job!", rating: "acceptable" }
      ],
      best_choice_id: "A",
      explanation: "Answer A gives specific praise.",
      principle: "Reflective praise reinforces effort."
    },
    {
      question: "Giving Advice/Suggestion: You notice a student’s notes are disorganized, and you want to suggest a better approach.",
      choices: [
        { choice_id: "A", text: "How about using the spellchecker?", rating: "acceptable" },
        { choice_id: "B", text: "I suggest saving your work regularly.", rating: "acceptable" },
        { choice_id: "C", text: "I think you should copy these sentences down.", rating: "best" }
      ],
      best_choice_id: "C",
      explanation: "Answer C directly addresses the issue.",
      principle: "Advice should be practical and relevant."
    },
    {
      question: "Changing Room Announcement: You need to inform students that your next lesson will be in a different room.",
      choices: [
        { choice_id: "A", text: "I have something to tell you.", rating: "acceptable" },
        { choice_id: "B", text: "Next time we’ll meet in room 23.", rating: "best" },
        { choice_id: "C", text: "There’s been a change of room.", rating: "acceptable" }
      ],
      best_choice_id: "B",
      explanation: "Answer B gives clear information.",
      principle: "Important information should be explicit."
    },
    {
      question: "Collecting Materials: Students have finished a written test, and you need one person from each row to collect the papers.",
      choices: [
        { choice_id: "A", text: "Collect the books in.", rating: "acceptable" },
        { choice_id: "B", text: "Could the first person in each row collect the books?", rating: "best" },
        { choice_id: "C", text: "Pile the books up on my desk.", rating: "acceptable" }
      ],
      best_choice_id: "B",
      explanation: "Answer B gives clear roles.",
      principle: "Clear delegation saves time."
    },
    {
      question: "Confirming Vocabulary: You ask the class about a new word, ‘persistent,’ and need to explain its meaning clearly.",
      choices: [
        { choice_id: "A", text: "Do you know the meaning of this word?", rating: "acceptable" },
        { choice_id: "B", text: "This means the same as he left.", rating: "not recommended" },
        { choice_id: "C", text: "If I keep trying and don’t give up, I am persistent.", rating: "best" }
      ],
      best_choice_id: "C",
      explanation: "Answer C gives a clear definition. Answer A is acceptable. Answer B is not recommended.",
      principle: "Vocabulary should be explained with meaning, not guesses."
    },
    {
      question: "Dealing with Distraction (Daydreaming): Joe is staring out the window, clearly not concentrating on the task.",
      choices: [
        { choice_id: "A", text: "Return to your work please.", rating: "acceptable" },
        { choice_id: "B", text: "Stop daydreaming.", rating: "not recommended" },
        { choice_id: "C", text: "Keep your attention on your work.", rating: "best" }
      ],
      best_choice_id: "C",
      explanation: "Answer C redirects without blame. Principle: Redirection is better than criticism.",
      principle: "Redirection is better than criticism."
    },
    {
      question: "Student Apology for Lateness: Maria rushes in late and says, “Sorry I’m late.”",
      choices: [
        { choice_id: "A", text: "That’s all right.", rating: "acceptable" },
        { choice_id: "B", text: "Never mind. Let’s go on with the lesson.", rating: "best" }
      ],
      best_choice_id: "B",
      explanation: "Answer B accepts the apology and resumes learning.",
      principle: "Handling lateness should minimize disruption."
    },
    {
      question: "Asking for Group Opinions: The class has read an article about climate change, and you want to start a discussion about their views.",
      choices: [
        { choice_id: "A", text: "What do you think?", rating: "acceptable" },
        { choice_id: "B", text: "Let’s talk about the problem.", rating: "acceptable" },
        { choice_id: "C", text: "What’s your opinion on this topic?", rating: "best" }
      ],
      best_choice_id: "C",
      explanation: "Answer C invites thoughtful responses.",
      principle: "Open questions promote discussion."
    },
    {
      question: "Time Out: You need to step out of the classroom for a minute (e.g., talk to a colleague) and want the class to continue working quietly.",
      choices: [
        { choice_id: "A", text: "Excuse me for a moment.", rating: "acceptable" },
        { choice_id: "B", text: "Carry on with the exercise.", rating: "best" },
        { choice_id: "C", text: "I’ll leave you to it.", rating: "acceptable" }
      ],
      best_choice_id: "B",
      explanation: "Answer B clearly instructs continued work.",
      principle: "Maintain learning continuity."
    },
    {
      question: "Asking for Clarification of Opinion: A student makes a vague statement about the discussion topic (e.g., \"It's too much\").",
      choices: [
        { choice_id: "A", text: "I’m not sure what you mean.", rating: "acceptable" },
        { choice_id: "B", text: "Could you explain what you mean?", rating: "best" },
        { choice_id: "C", text: "What exactly are you trying to say?", rating: "acceptable" }
      ],
      best_choice_id: "B",
      explanation: "Answer B encourages elaboration politely.",
      principle: "Clarification supports deeper thinking."
    },
    {
      question: "Ending Class Greetings: The bell has rung, and students are packing up. You want to say a warm goodbye before a long holiday",
      choices: [
        { choice_id: "A", text: "That’s all for today.", rating: "acceptable" },
        { choice_id: "B", text: "Goodbye, everyone.", rating: "acceptable" },
        { choice_id: "C", text: "Have a nice weekend.", rating: "best" }
      ],
      best_choice_id: "C",
      explanation: "Answer C ends the lesson warmly and positively.",
      principle: "Positive closure strengthens teacher–student relationships."
    }
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
      username: "thuychitest",
      email: "thuychitest@flora.local",
      password: "thuychitest",
      full_name: "Khuất Thị Thủy Chi",
      role: "user",
    },
    {
      username: "linhhuongtest",
      email: "linhhuongtest@flora.local",
      password: "linhhuongtest",
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
