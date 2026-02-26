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
  quizzes: {
      "1": [
          {
              "question": "Students have just come back from break time. Some students are still talking loudly, laughing, and moving their chairs. The classroom is quite noisy. The teacher stands at the front and waits for a few seconds to gain attention. The teacher now wants to calm the class and prepare them to begin the lesson.",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "Let’s get started."
                  },
                  {
                      "choice_id": "B",
                      "text": "Settle down, everyone."
                  },
                  {
                      "choice_id": "C",
                      "text": "Open your books to Unit 5."
                  }
              ],
              "best_choice_id": "B",
              "explanation": "The teacher’s immediate goal is classroom management. The class is still noisy, so the teacher needs to restore order first. “Settle down, everyone” clearly signals that students should stop talking and get ready to focus.\nA would be appropriate after the class is already quiet.\nC moves directly to lesson content without ensuring students are attentive."
          },
          {
              "question": "The classroom is now quiet and students are seated properly. After students stop talking and face the front, the teacher smiles and checks that everyone is ready. The teacher wants to officially begin the lesson.",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "How are you today?"
                  },
                  {
                      "choice_id": "B",
                      "text": "Let’s get started."
                  },
                  {
                      "choice_id": "C",
                      "text": "Look at the pictures on page 52."
                  }
              ],
              "best_choice_id": "B",
              "explanation": "The teacher is transitioning from settling the class to starting the lesson. “Let’s get started” clearly signals the beginning of the teaching stage.\nA is used to build rapport before beginning content.\nC jumps directly into an activity without clearly marking the lesson start."
          },
          {
              "question": "Before introducing the lesson content, the teacher wants to create a friendly and relaxed atmosphere. The class is ready, but the teacher wants to build rapport and lower students’ anxiety.",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "Tick the correct option."
                  },
                  {
                      "choice_id": "B",
                      "text": "Time’s up."
                  },
                  {
                      "choice_id": "C",
                      "text": "How are you today?"
                  }
              ],
              "best_choice_id": "C",
              "explanation": "The teacher’s purpose is to create a positive classroom environment. “How are you today?” helps build a friendly connection and makes students feel comfortable.\nA is an instruction for an exercise.\nB is used to end an activity."
          },
          {
              "question": "The teacher plans to begin the lesson with a short warm-up activity. Instead of announcing the activity directly, the teacher wants to increase students’ motivation and curiosity.",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "Do you want to play a game?"
                  },
                  {
                      "choice_id": "B",
                      "text": "Have you all finished?"
                  },
                  {
                      "choice_id": "C",
                      "text": "Let’s check the answers together."
                  }
              ],
              "best_choice_id": "A",
              "explanation": "The teacher wants to engage students and generate excitement. Asking “Do you want to play a game?” increases motivation and participation.\nB is used to check task completion.\nC is used during correction stage."
          },
          {
              "question": "The teacher is introducing Unit 5 about Global Warming. Before opening the textbook, the teacher wants to activate students’ background knowledge and connect the topic to real-life experiences.",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "Tell me some natural disasters in our country that you know."
                  },
                  {
                      "choice_id": "B",
                      "text": "That’s correct. Congratulations!"
                  },
                  {
                      "choice_id": "C",
                      "text": "Keep going. Try another option."
                  }
              ],
              "best_choice_id": "A",
              "explanation": "The teacher is activating prior knowledge related to the topic. This question helps students think about real-world examples before studying the new unit.\nB and C are feedback phrases used after students respond."
          },
          {
              "question": "After finishing the warm-up activity, the teacher wants students to move to the textbook. The teacher is holding the book and wants students to follow.",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "Open your books to Unit 5."
                  },
                  {
                      "choice_id": "B",
                      "text": "Do you agree or disagree?"
                  },
                  {
                      "choice_id": "C",
                      "text": "Who would like to answer?"
                  }
              ],
              "best_choice_id": "A",
              "explanation": "The teacher is giving a clear procedural instruction to transition to textbook work.\nB is for checking opinions.\nC is used to elicit responses."
          },
          {
              "question": "All students have opened their books. The teacher now wants to clearly introduce the lesson focus for today.",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "Look at the pictures on page 52."
                  },
                  {
                      "choice_id": "B",
                      "text": "Today, we’re going to study Unit 5, Global Warming."
                  },
                  {
                      "choice_id": "C",
                      "text": "Almost right, but check again."
                  }
              ],
              "best_choice_id": "B",
              "explanation": "The teacher is announcing the lesson objective and focus. This helps students understand what they will learn.\nA is for directing attention to visuals.\nC is feedback after an incorrect answer."
          },
          {
              "question": "To begin the lead-in activity, the teacher wants students to focus on the unit heading. The teacher points to the top of the page.",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "Look at the title of the unit."
                  },
                  {
                      "choice_id": "B",
                      "text": "Time’s up."
                  },
                  {
                      "choice_id": "C",
                      "text": "Write your answers in your notebook."
                  }
              ],
              "best_choice_id": "A",
              "explanation": "The teacher is directing students’ attention to a specific element of the textbook for prediction or discussion.\nB ends an activity.\nC gives an instruction unrelated to prediction."
          },
          {
              "question": "After students read the unit title silently, the teacher wants them to predict the topic. The teacher encourages critical thinking and student participation.",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "What do you think this unit is about?"
                  },
                  {
                      "choice_id": "B",
                      "text": "Settle down, everyone."
                  },
                  {
                      "choice_id": "C",
                      "text": "Tick the correct option."
                  }
              ],
              "best_choice_id": "A",
              "explanation": "The teacher is encouraging prediction and activating thinking skills. This promotes student-centered learning.\nB is for classroom management.\nC is an exercise instruction."
          },
          {
              "question": "The teacher wants to continue the introduction by using visual prompts in the textbook. Students have their books open. The teacher wants them to focus on the images before discussion.",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "Look at the pictures on page 52."
                  },
                  {
                      "choice_id": "B",
                      "text": "Have you all finished?"
                  },
                  {
                      "choice_id": "C",
                      "text": "That’s correct."
                  }
              ],
              "best_choice_id": "A",
              "explanation": "The teacher is guiding attention to visual material as part of the lead-in stage.\nB checks completion.\nC gives feedback."
          }
      ],
      "2": [
          {
              "question": "The teacher is about to start a speaking activity. Students are sitting individually. The teacher wants them to work collaboratively in small groups of three before starting the discussion task. The teacher looks around the classroom to check the number of students and plans to organize them clearly.",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "I’ll divide all of you into groups of three."
                  },
                  {
                      "choice_id": "B",
                      "text": "Who would like to answer?"
                  },
                  {
                      "choice_id": "C",
                      "text": "Let’s check the answers together."
                  }
              ],
              "best_choice_id": "A",
              "explanation": "The teacher’s goal is classroom organization before beginning the activity. Option A clearly provides procedural instructions and sets up group work effectively.\nB is used to elicit answers during feedback or discussion, not to organize groups.\nC signals a correction stage, which is not happening yet."
          },
          {
              "question": "Before starting a task, the teacher wants to make sure students understand what to do. The exercise instructions are displayed on the screen. Instead of explaining everything again, the teacher wants one student to read the instructions aloud so everyone can follow.",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "Read the text carefully."
                  },
                  {
                      "choice_id": "B",
                      "text": "Who volunteers to read out loud the task’s requirements?"
                  },
                  {
                      "choice_id": "C",
                      "text": "Time’s up."
                  }
              ],
              "best_choice_id": "B",
              "explanation": "The teacher is checking comprehension of instructions. Asking a volunteer to read aloud ensures clarity and reinforces understanding before the task begins.\nA gives task instructions but does not check whether students understand them.\nC is used to stop an activity, not to begin one."
          },
          {
              "question": "During a reading lesson, students are about to start a comprehension activity. The teacher wants students to read silently and answer the questions that follow the passage.",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "Read the text carefully and answer the questions below."
                  },
                  {
                      "choice_id": "B",
                      "text": "Do you agree or disagree?"
                  },
                  {
                      "choice_id": "C",
                      "text": "That’s correct."
                  }
              ],
              "best_choice_id": "A",
              "explanation": "Option A is a clear, direct academic instruction appropriate for a reading comprehension task.\nB is used in opinion-based discussions.\nC is feedback after a student’s answer."
          },
          {
              "question": "In a listening lesson, students will hear an audio recording twice. Before playing the recording, the teacher wants students to focus and write down important information while listening.",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "Listen carefully to the recording and take note."
                  },
                  {
                      "choice_id": "B",
                      "text": "Have you all finished?"
                  },
                  {
                      "choice_id": "C",
                      "text": "Almost right, but check again."
                  }
              ],
              "best_choice_id": "A",
              "explanation": "The teacher is giving listening instructions and encouraging note-taking as a listening strategy.\nB checks completion of a task.\nC is corrective feedback after an incorrect response."
          },
          {
              "question": "Before playing a listening recording, the teacher wants students to prepare strategically. Students have a worksheet with questions in front of them. The teacher wants them to identify important information first.",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "Read the questions first and underline key words."
                  },
                  {
                      "choice_id": "B",
                      "text": "Let’s get started."
                  },
                  {
                      "choice_id": "C",
                      "text": "Tell me your answer, please."
                  }
              ],
              "best_choice_id": "A",
              "explanation": "Option A develops listening strategy by helping students predict and focus on key details before listening.\nB signals the beginning of a lesson, not a strategy instruction.\nC is used after students have already prepared answers."
          },
          {
              "question": "Students have discussed answers with their partners. Now the teacher wants them to write their final answers individually in order to consolidate learning.",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "Write your answers in your notebook."
                  },
                  {
                      "choice_id": "B",
                      "text": "Do you need any help?"
                  },
                  {
                      "choice_id": "C",
                      "text": "That’s correct. Congratulations!"
                  }
              ],
              "best_choice_id": "A",
              "explanation": "The teacher is moving from oral discussion to written consolidation. Option A clearly instructs students to record their work.\nB is used during monitoring.\nC is positive feedback, not an instruction."
          },
          {
              "question": "During a vocabulary lesson, students see a list of new words and definitions on the board. The teacher wants them to complete a matching task individually.",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "Match the words with their meanings."
                  },
                  {
                      "choice_id": "B",
                      "text": "Time’s up."
                  },
                  {
                      "choice_id": "C",
                      "text": "Keep going. Try another option."
                  }
              ],
              "best_choice_id": "A",
              "explanation": "Option A clearly states the task requirement for a vocabulary activity.\nB is used to stop a timed activity.\nC is encouragement after an incorrect attempt."
          },
          {
              "question": "In a grammar exercise, students must fill in blanks using given words. The teacher wants to give a precise instruction before students begin.",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "Complete the sentences using the words given."
                  },
                  {
                      "choice_id": "B",
                      "text": "Who would like to answer?"
                  },
                  {
                      "choice_id": "C",
                      "text": "I’m waiting for silence."
                  }
              ],
              "best_choice_id": "A",
              "explanation": "Option A clearly explains what students need to do in a grammar task.\nB is used during feedback or elicitation.\nC is classroom management language."
          },
          {
              "question": "Students are working on a multiple-choice exercise. The teacher wants to give a short, clear instruction before students start.",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "Choose the correct answer."
                  },
                  {
                      "choice_id": "B",
                      "text": "Let’s check the answers together."
                  },
                  {
                      "choice_id": "C",
                      "text": "Do you agree or disagree?"
                  }
              ],
              "best_choice_id": "A",
              "explanation": "Option A is the standard instruction for multiple-choice activities.\nB signals a correction stage.\nC is used for opinion-based discussion."
          },
          {
              "question": "At the end of a short checking task, students need to mark the correct statements. The teacher wants to give a simple instruction.",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "Tick the correct option."
                  },
                  {
                      "choice_id": "B",
                      "text": "Have you all finished?"
                  },
                  {
                      "choice_id": "C",
                      "text": "Almost right, but check again."
                  }
              ],
              "best_choice_id": "A",
              "explanation": "Option A clearly instructs students to mark their answers.\nB checks task completion.\nC is corrective feedback."
          }
      ],
      "3": [
          {
              "question": "During a vocabulary checking activity, a student gives the correct answer confidently. The teacher wants to provide positive reinforcement and encourage further participation.",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "That’s correct. Congratulations!"
                  },
                  {
                      "choice_id": "B",
                      "text": "Time’s up."
                  },
                  {
                      "choice_id": "C",
                      "text": "Open your books."
                  }
              ],
              "best_choice_id": "A",
              "explanation": "The teacher is providing positive feedback to reinforce correct performance and increase motivation.\nB is used to stop an activity.\nC is a procedural instruction unrelated to feedback."
          },
          {
              "question": "Students are working in pairs on a reading task. While monitoring, the teacher notices that one group looks confused and is whispering uncertainly. The teacher wants to offer support without interrupting the whole class.",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "Do you need any help?"
                  },
                  {
                      "choice_id": "B",
                      "text": "Let’s check the answers together."
                  },
                  {
                      "choice_id": "C",
                      "text": "That’s wrong."
                  }
              ],
              "best_choice_id": "A",
              "explanation": "The teacher uses supportive monitoring language to scaffold learning and encourage students to express difficulties.\nB signals whole-class correction.\nC is negative feedback and may discourage learners."
          },
          {
              "question": "Students are completing a writing task individually. Most students have stopped writing, but a few are still finishing. The teacher wants to check task completion before moving on.",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "Have you all finished?"
                  },
                  {
                      "choice_id": "B",
                      "text": "Do you agree or disagree?"
                  },
                  {
                      "choice_id": "C",
                      "text": "Keep going. Try another option."
                  }
              ],
              "best_choice_id": "A",
              "explanation": "The teacher is checking readiness before transitioning to the next stage.\nB is used for discussion.\nC is used after an incorrect answer."
          },
          {
              "question": "A student attempts to answer a difficult grammar question but gives an incorrect answer. The teacher wants to encourage self-correction instead of correcting immediately.",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "Keep going. Try another option."
                  },
                  {
                      "choice_id": "B",
                      "text": "That’s wrong."
                  },
                  {
                      "choice_id": "C",
                      "text": "Time’s up."
                  }
              ],
              "best_choice_id": "A",
              "explanation": "The teacher promotes learner autonomy and self-repair, which supports deeper learning.\nB may reduce confidence.\nC is irrelevant in this context."
          },
          {
              "question": "During group discussion, one group is actively speaking English and exchanging ideas confidently. The teacher wants to acknowledge their effort and motivate them.",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "You’re doing well."
                  },
                  {
                      "choice_id": "B",
                      "text": "Tick the correct option."
                  },
                  {
                      "choice_id": "C",
                      "text": "Have you all finished?"
                  }
              ],
              "best_choice_id": "A",
              "explanation": "The teacher is giving positive reinforcement to maintain motivation and engagement.\nB is task instruction.\nC checks completion."
          },
          {
              "question": "While monitoring pair work, the teacher hears some students switching to their first language. The teacher wants to gently encourage English use without interrupting the task flow.",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "Try to use English as much as possible."
                  },
                  {
                      "choice_id": "B",
                      "text": "That’s correct."
                  },
                  {
                      "choice_id": "C",
                      "text": "Let’s get started."
                  }
              ],
              "best_choice_id": "A",
              "explanation": "The teacher reminds students of the target language use in a supportive way.\nB is feedback.\nC signals the start of a lesson."
          },
          {
              "question": "After asking a question, the teacher wants students to discuss briefly with their partners before answering publicly.",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "Talk to your partner, please."
                  },
                  {
                      "choice_id": "B",
                      "text": "Tell me your answer now."
                  },
                  {
                      "choice_id": "C",
                      "text": "Time’s up."
                  }
              ],
              "best_choice_id": "A",
              "explanation": "The teacher uses pair discussion (think–pair–share technique) to increase participation and confidence.\nB skips peer interaction.\nC ends an activity."
          },
          {
              "question": "A student has raised their hand after thinking time. The teacher wants the student to share their response with the class.",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "Tell me your answer, please."
                  },
                  {
                      "choice_id": "B",
                      "text": "Open your books."
                  },
                  {
                      "choice_id": "C",
                      "text": "Almost right, but check again."
                  }
              ],
              "best_choice_id": "A",
              "explanation": "The teacher is eliciting an answer from a volunteer.\nB is procedural.\nC is feedback after an incorrect response."
          },
          {
              "question": "During a listening activity, some students look unsure about their answers. Before starting the correction, the teacher wants to give them another opportunity to listen.",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "Do you want to listen one more time?"
                  },
                  {
                      "choice_id": "B",
                      "text": "Let’s check the answers together."
                  },
                  {
                      "choice_id": "C",
                      "text": "That’s correct."
                  }
              ],
              "best_choice_id": "A",
              "explanation": "The teacher offers additional input to support comprehension before feedback.\nB moves directly to correction.\nC is feedback, which is premature."
          },
          {
              "question": "During a reading comprehension task, a student is translating word by word and seems confused about the overall meaning. The teacher wants to guide the student toward a better reading strategy.",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "Think about the meaning, not just the words."
                  },
                  {
                      "choice_id": "B",
                      "text": "Tick the correct option."
                  },
                  {
                      "choice_id": "C",
                      "text": "Time’s up."
                  }
              ],
              "best_choice_id": "A",
              "explanation": "The teacher is encouraging strategic reading by focusing on overall meaning rather than literal translation.\nB is task instruction.\nC ends an activity."
          }
      ],
      "4": [
          {
              "question": "Students are working in pairs discussing a debate topic about social media. The teacher has given them exactly ten minutes. Some groups are still deeply engaged in conversation, while others have already finished and are waiting. The teacher checks the clock, realizes the allocated time has ended, and gently claps to get attention.",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "Any other ideas?"
                  },
                  {
                      "choice_id": "B",
                      "text": "Time’s up."
                  },
                  {
                      "choice_id": "C",
                      "text": "Let’s check the answers together."
                  }
              ],
              "best_choice_id": "B",
              "explanation": "The activity has reached its planned time limit. The teacher needs to signal closure and transition to the next stage. “Time’s up” clearly indicates the end of the activity while maintaining lesson pacing.\nA is a strong participation prompt, but it would extend discussion instead of closing it.\nC is suitable for checking written exercises, not for ending a timed discussion."
          },
          {
              "question": "Students have just completed a grammar gap-fill exercise individually. The classroom becomes quiet as they put down their pens. The teacher walks to the front and notices that most students have finished. The teacher now wants to move to the correction stage as a whole class. What should the teacher say?",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "Let’s check the answers together."
                  },
                  {
                      "choice_id": "B",
                      "text": "Who would like to answer?"
                  },
                  {
                      "choice_id": "C",
                      "text": "Time’s up."
                  }
              ],
              "best_choice_id": "A",
              "explanation": "The time limit has already finished, and students are clearly ready for correction. The teacher’s goal is to transition into the feedback stage. “Let’s check the answers together” clearly signals that the correction phase is beginning.\nB is a good elicitation technique during correction, and it can be used after starting the checking stage. However, at this moment, the teacher needs to clearly announce the transition to whole-class correction first. Option B skips that step and does not signal the stage change clearly enough.\nC is used when stopping a timed activity, but students have already finished."
          },
          {
              "question": "After asking a comprehension question about the reading text, the teacher gives students thirty seconds to think. Several students look thoughtful, but no hands are raised yet. The teacher wants to encourage voluntary participation rather than selecting someone directly.",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "Who would like to answer?"
                  },
                  {
                      "choice_id": "B",
                      "text": "I’m waiting for silence."
                  },
                  {
                      "choice_id": "C",
                      "text": "Almost right, but check again."
                  }
              ],
              "best_choice_id": "A",
              "explanation": "The teacher promotes student-centered participation by inviting volunteers instead of calling on someone.\nB is effective in noisy situations, but the class is already quiet.\nC is used after an incorrect answer, which has not occurred yet."
          },
          {
              "question": "During a class discussion, one student begins sharing an opinion but speaks very softly. Several students at the back lean forward and look confused because they cannot hear clearly. Other students may not understand what the speaker is saying. What should the teacher say?",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "Can you speak louder, please?"
                  },
                  {
                      "choice_id": "B",
                      "text": "Do you agree or disagree?"
                  },
                  {
                      "choice_id": "C",
                      "text": "That’s correct."
                  }
              ],
              "best_choice_id": "A",
              "explanation": "The teacher needs to ensure audibility so that everyone can follow the discussion.\nB is interactive and engaging, but it shifts focus before clarity is established.\nC confirms correctness, which is unrelated to the volume issue."
          },
          {
              "question": "Students have just finished working in pairs to answer comprehension questions from a reading text. During the activity, they discussed their ideas and wrote their answers in their notebooks. Now, the teacher wants to check the answers with the whole class. However, instead of simply reading the answers aloud, the teacher wants students to participate actively in the correction process and compare their work with others. What should the teacher say?",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "Two students write the answers on the board. Others compare and check."
                  },
                  {
                      "choice_id": "B",
                      "text": "Time’s up."
                  },
                  {
                      "choice_id": "C",
                      "text": "Who would like to answer?"
                  }
              ],
              "best_choice_id": "A",
              "explanation": "This instruction promotes peer review and interactive correction.\nB signals the end of an activity, but correction is the current goal.\nC invites a single volunteer, whereas the teacher wants broader involvement."
          },
          {
              "question": "A student shares an opinion about whether school uniforms should be compulsory. The teacher wants to quickly check the class’s reaction and involve everyone, even those who are usually quiet.",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "Do you agree or disagree? Thumbs up for agreement, thumbs down for disagreement."
                  },
                  {
                      "choice_id": "B",
                      "text": "Let’s check the answers together."
                  },
                  {
                      "choice_id": "C",
                      "text": "Almost right, but check again."
                  }
              ],
              "best_choice_id": "A",
              "explanation": ""
          },
          {
              "question": "One student has provided a thoughtful answer to a discussion question. The teacher wants to broaden the discussion and hear from more students before summarizing. What should the teacher say?",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "Any other ideas?"
                  },
                  {
                      "choice_id": "B",
                      "text": "Time’s up."
                  },
                  {
                      "choice_id": "C",
                      "text": "That’s correct"
                  }
              ],
              "best_choice_id": "A",
              "explanation": "The teacher invites additional contributions to enrich discussion.\nB is used to end the interaction or the activity.\nC is used to confirm the answer  rather than encourage more ideas."
          },
          {
              "question": "A student provides an accurate explanation of a grammar rule. The rest of the class listens attentively. The teacher wants to confirm correctness and reinforce learning. What should the teacher say?",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "That’s correct. Well done."
                  },
                  {
                      "choice_id": "B",
                      "text": "Can anyone help her?"
                  },
                  {
                      "choice_id": "C",
                      "text": "Almost right, but check again."
                  }
              ],
              "best_choice_id": "A",
              "explanation": "Positive feedback confirms understanding and reinforces accurate responses.\nB is supportive in struggling situations, but the student answered correctly.\nC suggests partial error, which is not the case."
          },
          {
              "question": "A student answers a vocabulary question but uses the wrong preposition. The answer shows understanding of the concept but contains a small mistake. The teacher wants the student to self-correct. What should the teacher say?",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "Almost right, but check again."
                  },
                  {
                      "choice_id": "B",
                      "text": "That’s correct."
                  },
                  {
                      "choice_id": "C",
                      "text": "Time’s up."
                  }
              ],
              "best_choice_id": "A",
              "explanation": "The response encourages reflection and self-correction without discouraging the student.\nB incorrectly confirms the answer, which may reinforce the mistake.\nC is unrelated to feedback."
          },
          {
              "question": "The teacher asks a comprehension question about the reading text. One student raises her hand and tries to answer, but after saying a few words, she hesitates and looks unsure. She pauses several times and seems confused about how to continue. The teacher wants to support the student without making her feel embarrassed, and at the same time help the class move forward with the lesson. What should the teacher say?",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "Can anyone help her?"
                  },
                  {
                      "choice_id": "B",
                      "text": "Back to your seats."
                  },
                  {
                      "choice_id": "C",
                      "text": "Do you agree or disagree?"
                  }
              ],
              "best_choice_id": "A",
              "explanation": "This invites peer support and promotes collaborative learning while maintaining the struggling student’s dignity.\nB concerns classroom organization, not academic difficulty.\nC shifts to opinion discussion, which does not solve the comprehension issue."
          }
      ],
      "5": [
          {
              "question": "Students have just finished a listening task. The teacher has checked the answers with the whole class, clarified two difficult questions, and asked if anyone has further questions. No one raises their hand. The class looks ready for the next part of the lesson, and the teacher wants to transition smoothly to the following planned task. What should the teacher say?",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "Let’s move on to the next activity."
                  },
                  {
                      "choice_id": "B",
                      "text": "Time’s up."
                  },
                  {
                      "choice_id": "C",
                      "text": "Any other ideas?"
                  }
              ],
              "best_choice_id": "A",
              "explanation": "The task has already been completed and checked. The teacher now needs to signal a transition to a new stage of the lesson. “Let’s move on to the next activity” clearly indicates progression.\nB is used to stop an activity due to time limits.\nC invites more responses, but the correction stage has already ended."
          },
          {
              "question": "After completing a grammar exercise and checking answers, the teacher tells students that the next part of the lesson will help them use the grammar in real communication. The teacher wants to clearly introduce a new skill focus so students understand the change in activity type. What should the teacher say?",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "Now we’re going to focus on speaking."
                  },
                  {
                      "choice_id": "B",
                      "text": "Let’s review what we’ve learned today."
                  },
                  {
                      "choice_id": "C",
                      "text": "Put your books away."
                  }
              ],
              "best_choice_id": "A",
              "explanation": "The teacher is introducing a new stage that emphasizes oral practice. This sentence clearly signals a shift in skill focus.\nB is used at the end of the lesson.\nC is about classroom organization, not skill focus."
          },
          {
              "question": "The teacher is about to start a listening activity. The audio answers will be played, and students must listen carefully without reading the script. However, several students still have their textbooks open and are looking at previous exercises.",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "Look at the screen, please."
                  },
                  {
                      "choice_id": "B",
                      "text": "Put your books away."
                  },
                  {
                      "choice_id": "C",
                      "text": "Let’s review what we’ve learned today."
                  }
              ],
              "best_choice_id": "B",
              "explanation": "The teacher wants students to stop using their textbooks so they can focus on listening.\nA directs visual attention, but the issue is open books.\nC is used for lesson summary."
          },
          {
              "question": "The teacher is showing instructions for a group task onto the screen. Some students at the back are still chatting and not paying attention. The teacher needs everyone to focus on the displayed instructions before giving further explanation.",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "Look at the screen, please."
                  },
                  {
                      "choice_id": "B",
                      "text": "Back to your seats."
                  },
                  {
                      "choice_id": "C",
                      "text": "Review the vocabulary at home."
                  }
              ],
              "best_choice_id": "A",
              "explanation": "The teacher needs to redirect students’ visual attention to the projected material.\nB is about seating.\nC is homework assignment"
          },
          {
              "question": "The lesson is almost over. The main activities have been completed, and there are five minutes left before the bell rings. The teacher wants to summarize key vocabulary and grammar points before dismissing the class. What should the teacher say?",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "Let’s review what we’ve learned today."
                  },
                  {
                      "choice_id": "B",
                      "text": "Now we’re going to focus on speaking."
                  },
                  {
                      "choice_id": "C",
                      "text": "Time’s up."
                  }
              ],
              "best_choice_id": "A",
              "explanation": "The teacher is consolidating learning at the end of the lesson.\nB introduces a new stage.\nC stops an activity."
          },
          {
              "question": "The teacher has introduced ten new vocabulary items and practiced them through exercises and speaking activities. As the lesson comes to an end, the teacher wants students to continue practicing independently after class. What should the teacher say?",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "Review the vocabulary at home."
                  },
                  {
                      "choice_id": "B",
                      "text": "Let’s check the answers together."
                  },
                  {
                      "choice_id": "C",
                      "text": "Two students write the answers on the board."
                  }
              ],
              "best_choice_id": "A",
              "explanation": "The teacher is giving reinforcement guidance for after-class learning.\nB and C are used during correction stages in class."
          },
          {
              "question": "The teacher has written the homework task on the board and explained the requirements clearly. Students have copied it into their notebooks. The lesson is about to end, and the teacher wants to remind them once more before dismissal. What should the teacher say?",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "Don’t forget your homework."
                  },
                  {
                      "choice_id": "B",
                      "text": "That’s correct."
                  },
                  {
                      "choice_id": "C",
                      "text": "Who would like to answer?"
                  }
              ],
              "best_choice_id": "A",
              "explanation": "This sentence reinforces the reminder before students leave.\nB confirms correctness.\nC invites participation and encourages ideas."
          },
          {
              "question": "The class has been working on a role-play activity, but the bell is about to ring. The teacher realizes there is not enough time to complete the final stage. After briefly summarizing what has been done, the teacher wants to postpone the remaining part.",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "We’ll continue this part next time."
                  },
                  {
                      "choice_id": "B",
                      "text": "Let’s move on to the next activity."
                  },
                  {
                      "choice_id": "C",
                      "text": "Put your books away."
                  }
              ],
              "best_choice_id": "A",
              "explanation": "The teacher signals that the unfinished task will be resumed in the next lesson.\nB suggests starting something new.\nC is only used to organize the classroom, not to continue the lesson content."
          },
          {
              "question": "After reviewing the lesson’s key points and answering final questions, the teacher notices that the class time has officially ended. Students begin to close their notebooks and prepare to leave. What should the teacher say?",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "That’s all for today."
                  },
                  {
                      "choice_id": "B",
                      "text": "Any other ideas?"
                  },
                  {
                      "choice_id": "C",
                      "text": "Almost right, but check again."
                  }
              ],
              "best_choice_id": "A",
              "explanation": "This sentence formally signals the end of the lesson.\nB invites further discussion.\nC is used to give feedback to students' answer and encourage them to correct it."
          },
          {
              "question": "Students stand up and say goodbye to the teacher at the end of the lesson. The teacher wants to close the class politely and show appreciation for students’ participation during the lesson. What should the teacher say?",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "Thank you for your attention."
                  },
                  {
                      "choice_id": "B",
                      "text": "Back to your seats."
                  },
                  {
                      "choice_id": "C",
                      "text": "Time’s up."
                  }
              ],
              "best_choice_id": "A",
              "explanation": "This expression shows politeness and appreciation when closing the lesson.\nB and C are classroom management instructions, not closing remarks."
          }
      ],
      "6": [
          {
              "question": "The teacher is explaining the instructions for a new group project. At first, students seem attentive, but gradually small conversations start at the back of the classroom. Within seconds, more students begin whispering, and the teacher’s voice is no longer clearly heard. The teacher pauses, looks around the room, and waits briefly.What should the teacher say?",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "Work in pairs, please."
                  },
                  {
                      "choice_id": "B",
                      "text": "Everyone, please quiet down."
                  },
                  {
                      "choice_id": "C",
                      "text": "Any ideas? Just say what you think."
                  }
              ],
              "best_choice_id": "B",
              "explanation": "The main issue here is increasing noise that interferes with instruction. The teacher needs to regain control before continuing. This utterance directly addresses the behavior and re-establishes order.\nA is a thoughtful option, because it relates to group organization. However, the current problem is not task structure but classroom noise. Pair work would likely increase talking instead of reducing it.\nC shows encouragement and lowers pressure, which is very positive in participation contexts. However, students are not silent due to anxiety; they are talking over instructions. Therefore, this response does not solve the immediate issue."
          },
          {
              "question": "The teacher has just written important exam instructions on the board. Some students are copying them down, but a few others are still chatting, checking their phones under the desk, or looking out the window. The teacher knows this information is essential and does not want anyone to miss it.",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "I need your full attention now."
                  },
                  {
                      "choice_id": "B",
                      "text": "Are you ready?"
                  },
                  {
                      "choice_id": "C",
                      "text": "Change roles, please."
                  }
              ],
              "best_choice_id": "A",
              "explanation": "The teacher needs to signal urgency and importance. This sentence clearly communicates that students must stop distractions and focus immediately.\nB is a positive and interactive choice, but it merely checks readiness. It does not directly address the distraction or emphasize the importance of the information.\nC is appropriate in speaking or role-play activities, but in this case, students are not changing roles; they are being inattentive."
          },
          {
              "question": "During a whole-class discussion, several students become excited and start speaking at the same time. One student raises her hand but is interrupted by two others who call out their answers without waiting. The classroom becomes noisy, and it is difficult to follow any single response. The teacher raises one hand slightly and looks around the room.",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "One voice at a time, please."
                  },
                  {
                      "choice_id": "B",
                      "text": "Any ideas? Just say what you think."
                  },
                  {
                      "choice_id": "C",
                      "text": "Work in pairs, please."
                  }
              ],
              "best_choice_id": "A",
              "explanation": "The issue here is overlapping speech. The teacher needs to restore order and ensure that each student is heard clearly. This phrase directly manages turn-taking in discussion.\nB is encouraging and reduces pressure, which is excellent when students are hesitant. However, the problem here is not silence, but too many students speaking at once.\nC is useful for structured collaboration, but this moment requires whole-class control, not pair reorganization."
          },
          {
              "question": "The teacher asks a comprehension question about the reading passage. The classroom becomes completely silent. Several students look down at their desks, avoid eye contact, or pretend to write something. The teacher waits for a few seconds, but no one raises a hand.",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "If no one raises your hand, I’ll randomly call someone."
                  },
                  {
                      "choice_id": "B",
                      "text": "Let’s be respectful."
                  },
                  {
                      "choice_id": "C",
                      "text": "Back to your seats."
                  }
              ],
              "best_choice_id": "A",
              "explanation": "Students are avoiding volunteering. This statement encourages participation while subtly increasing accountability. It often motivates students to raise their hands voluntarily.\nB promotes a positive classroom climate, which is important. However, there is no disrespect happening in this situation.\nC is appropriate after movement activities, but students are already seated."
          },
          {
              "question": "During an individual writing task, the classroom is supposed to be quiet. The teacher notices two students whispering and occasionally glancing at each other’s notebooks. Other students nearby begin to lose focus because of the distraction. The teacher walks slowly toward their desks and pauses beside them.",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "Are you talking about the lesson?"
                  },
                  {
                      "choice_id": "B",
                      "text": "Any ideas? Just say what you think."
                  },
                  {
                      "choice_id": "C",
                      "text": "Change roles, please."
                  }
              ],
              "best_choice_id": "A",
              "explanation": "This question indirectly checks whether the conversation is task-related. It allows students to correct their behavior without immediate confrontation.\nB is supportive and participation-oriented, but this is not a brainstorming moment.\nC applies to role-play or pair speaking, which is not happening here."
          },
          {
              "question": "The teacher asks an open-ended speaking question about the topic. After a few seconds of silence, one student slowly raises their hand but looks a bit nervous. The student begins answering but hesitates several times and finally stops mid-sentence, saying softly, “I’m not sure if this is right,” while avoiding eye contact. The rest of the class remains quiet, waiting for the teacher’s response.",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "It’s okay to make mistakes."
                  },
                  {
                      "choice_id": "B",
                      "text": "I’m waiting for silence."
                  },
                  {
                      "choice_id": "C",
                      "text": "Back to your seats."
                  }
              ],
              "best_choice_id": "A",
              "explanation": "By saying “It’s okay to make mistakes,” the teacher normalizes errors as part of learning and reduces performance pressure. This reassurance encourages the student to continue speaking and helps maintain a psychologically safe classroom environment.\nB is effective for general noise control, but this situation requires emotional support, not silence management.\nC is suitable after physical movement, which is not occurring here."
          },
          {
              "question": "Several students finish a writing task early and begin whispering and tapping their pens on the desks. Other students are still writing and appear distracted. The teacher notices the noise level slowly increasing.",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "If you’ve finished, check your answers again or help your partner quietly."
                  },
                  {
                      "choice_id": "B",
                      "text": "Let’s settle down."
                  },
                  {
                      "choice_id": "C",
                      "text": "Eyes on me, please."
                  }
              ],
              "best_choice_id": "A",
              "explanation": "This response keeps early finishers engaged without interrupting those still working. It maintains productivity and classroom calm.\nB is helpful when the entire class is noisy, but here only a small group needs redirection.\nC shifts attention to the teacher, which is unnecessary since students are meant to be working independently."
          },
          {
              "question": "The teacher asks a student to explain why the main character in the story feels disappointed. The student replies briefly, and then stops speaking. The teacher knows from previous lessons that this student usually gives thoughtful answers and is capable of deeper analysis. The rest of the class is waiting, and there is a clear opportunity to expand the response.",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "Come on, I know you can do better."
                  },
                  {
                      "choice_id": "B",
                      "text": "I’m waiting for silence."
                  },
                  {
                      "choice_id": "C",
                      "text": "Work in pairs, please."
                  }
              ],
              "best_choice_id": "A",
              "explanation": "The student has answered, but the response is incomplete. The teacher’s goal is not discipline or task reorganization but cognitive expansion. This statement expresses confidence in the student’s ability and encourages elaboration without providing the answer.\nB is a strong classroom management phrase, and it works well when students are noisy. However, in this situation, the class is already quiet and attentive.\nC is a useful instructional strategy, especially for collaborative discussion. Nevertheless, the teacher wants this specific student to develop their individual answer, not shift to pair work."
          },
          {
              "question": "The bell rings after break time, but several students are still outside the classroom talking. Inside, a few students are sitting in different seats than usual and have not taken out their materials. The noise level remains high, and the lesson cannot begin effectively under these conditions.",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "Take your seats. I need everyone ready in ten seconds."
                  },
                  {
                      "choice_id": "B",
                      "text": "It’s okay to make mistakes."
                  },
                  {
                      "choice_id": "C",
                      "text": "Work in pairs, please."
                  }
              ],
              "best_choice_id": "A",
              "explanation": "This situation requires firm and time-bound classroom control. The instruction is clear, direct, and sets an immediate behavioral expectation.\nB provides emotional reassurance, which is valuable in speaking contexts, but this is a discipline issue.\nC would likely increase noise, as students are not yet organized."
          },
          {
              "question": "During a speaking task, a student mispronounces a word and immediately apologizes. A few classmates laugh softly. The student looks embarrassed and stops speaking. The teacher needs to protect the student’s confidence and restore a respectful atmosphere.",
              "choices": [
                  {
                      "choice_id": "A",
                      "text": "It's okay to make mistakes."
                  },
                  {
                      "choice_id": "B",
                      "text": "Take your seats."
                  },
                  {
                      "choice_id": "C",
                      "text": "I need your full attention now."
                  }
              ],
              "best_choice_id": "A",
              "explanation": "The teacher reassures the student and normalizes errors as part of learning. This helps reduce anxiety and maintain psychological safety.\nB addresses movement, which is unrelated to the situation.\nC emphasizes discipline, but the core issue here is emotional support rather than general attention."
          }
      ]
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
