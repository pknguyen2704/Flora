
import re
import json

raw_text = """
1. The class is very noisy when the teacher enters.
A. Who would like to share?
 B. Everyone, please quiet down.
 C. Take a guess.
Detailed explanation:
 At this moment, the teacher’s main goal is classroom control, not interaction.
 “Everyone, please quiet down” is a whole-class instruction, clear and immediate, suitable when noise comes from many students at the same time.
Option A is used after a question to invite ideas, not to manage noise.
Option C encourages guessing and participation, which would make the class even noisier.
2. Students keep talking after being reminded once.
A. I’m waiting for silence.
 B. Let’s hear from someone else.
 C. Keep it up.
Detailed explanation:
 The teacher has already warned the class, so a stronger but calm signal is needed.
 “I’m waiting for silence” shows that the lesson will not continue until students stop talking. It uses teacher authority without shouting.
Option B shifts focus to discussion, which is inappropriate when students are noisy.
Option C is praise and would send the wrong message.
3. Students are too loud during individual work.
A. Please work quietly.
 B. Work in pairs, please.
 C. Any ideas?
Detailed explanation:
 During individual work, students are expected to focus independently.
 “Please work quietly” clearly reminds them of both the task type (individual) and the expected noise level.
Option B changes the activity structure and may increase noise.
Option C invites speaking, which goes against the goal of quiet work.
4. The classroom becomes noisy after group work.
A. This is getting too noisy.
 B. Don’t be shy. Give it a try.
 C. Let’s check the answers.
Detailed explanation:
 After group work, noise often increases naturally.
 “This is getting too noisy” is a neutral, non-threatening reminder that helps students self-correct their behavior.
Option B is used to encourage speaking, not reduce noise.
Option C moves to feedback before the class is ready and attentive.
5. Some students are chatting while the teacher is explaining.
A. Please stop chatting.
 B. Take a guess.
 C. Change roles, please.
Detailed explanation:
 The problem behavior here is side conversations during instruction.
 “Please stop chatting” directly names the behavior and clearly tells students what to stop.
Option B invites speaking and is inappropriate.
Option C is only used in pair/group activities.


6. The teacher wants everyone to look at her.
A. Eyes on me, please.
 B. Back to your seats.
 C. Let’s move on.
Detailed explanation:
 When giving instructions or explanations, teachers need visual attention.
 “Eyes on me, please” is short, clear, and commonly used to regain focus quickly.
Option B is about movement, not attention.
Option C assumes the class is already focused.
7. Students are talking while instructions are being given.
A. Stop talking and listen.
 B. Work in pairs, please.
 C. Good job staying focused.
Detailed explanation:
 This sentence clearly tells students what to stop and what to do next, which is essential when giving instructions.
Option B introduces an activity instead of fixing the problem.
Option C is praise and does not match the situation.
8. The teacher pauses and waits for silence.
A. I can still hear your voice.
 B. Are you ready?
 C. Keep it up.
Detailed explanation:
 This sentence communicates the teacher’s expectation without raising their voice.
 It creates positive pressure for students to self-regulate.
Option B assumes readiness, which is not true yet.
Option C praises behavior that has not happened
9. The teacher cannot continue because of noise.
A. We can continue when it’s quiet.
 B. Let’s help each other learn.
 C. Who would like to share?
Detailed explanation:
 The teacher sets a clear condition for continuing the lesson.
 This helps students understand the consequences of noise.
Option B is positive but too general for immediate control.
Option C increases talking.
10. Students are discussing too loudly.
A. Lower your voice, please.
 B. Stop here, please.
 C. Put your pens down.
Detailed explanation:
 Students are allowed to talk, but the volume is the problem.
 “Lower your voice, please” corrects behavior without stopping interaction.
Option B ends the activity unnecessarily.
Option C is unrelated to speaking volume.
11. Students are shy about answering.
A. Don’t be shy. Give it a try.
 B. This is not the time to talk.
 C. Please work quietly.
Detailed explanation:
 This sentence provides emotional support, helping students overcome fear of speaking.
Option B discourages speaking.
Option C is for silent work.


12. Students are afraid of giving wrong answers.
A. There’s no right or wrong answer.
 B. Time’s up.
 C. Eyes on your book, please.
Detailed explanation:
 This reduces anxiety and promotes a safe learning environment where ideas matter more than accuracy.
Option B ends an activity.
Option C shifts focus away from speaking.
13. No one answers the teacher’s question.
A. Take a guess.
 B. Let’s move on.
 C. Put your pens down.
Detailed explanation:
 “Take a guess” lowers the pressure of being correct and encourages risk-taking.
Option B stops interaction too early.
Option C is unrelated.


14. The teacher wants another student to respond.
A. Let’s hear from someone else.
 B. Are you ready?
 C. Please stop chatting.
Detailed explanation:
 This promotes equal participation and prevents the same students from dominating.
Option B checks readiness, not participation.


Option C addresses noise, not turn-taking.
15. Students are passive during discussion.
A. Be more active, please.
 B. Please work quietly.
 C. Stop here, please.
Detailed explanation:
 The teacher directly encourages engagement and participation.
Option B discourages speaking.
Option C ends the activity


16. Students are talking while others are presenting.
A. One voice at a time, please.
 B. Be more active, please.
 C. Take a guess.
✅ Correct answer: A
Detailed explanation:
 The teacher’s primary goal here is to protect the speaking space of the presenter and ensure listening discipline.
 “One voice at a time, please” clearly sets a turn-taking rule, reminding students that only one person should speak.
Option B encourages more participation, which would worsen the problem.


Option C invites guessing and speaking, which is inappropriate when someone else is presenting.


17. The class becomes excited and unfocused after a game.
A. Let’s calm down and focus.
 B. Keep it up.
 C. Who would like to share?
✅ Correct answer: A
Detailed explanation:
 After a game, students often experience high emotional energy.
 The teacher’s goal is emotional regulation + cognitive refocusing.
 This sentence explicitly addresses both: calming emotions and returning attention to learning.
Option B reinforces excitement instead of reducing it.


Option C encourages more speaking and interaction, delaying refocus.



18. The noise level is high and starts to disturb learning.
A. Too much noise. Let’s be quiet.
 B. Let’s help each other learn.
 C. Are you ready?
✅ Correct answer: A
Detailed explanation:
 This is a situation requiring immediate noise control.
 The sentence directly identifies the problem (noise) and gives a clear behavioral expectation (be quiet).
Option B promotes values but does not solve the immediate problem.


Option C checks readiness, which is irrelevant while noise persists.


19. The teacher wants to pause the lesson until students stop talking.
A. I’m waiting for silence.
 B. Let’s move on.
 C. Change roles, please.
✅ Correct answer: A
Detailed explanation:
 Here, the teacher uses strategic pausing as a classroom management technique.
 “I’m waiting for silence” signals that progress is conditional on student behavior, encouraging self-control.
Option B ignores the problem and lowers teacher authority.


Option C changes the activity instead of correcting behavior.


20. Students interrupt others who are listening.
A. Please respect others who are listening.
 B. Don’t be shy. Give it a try.
 C. Time’s up.
✅ Correct answer: A
Detailed explanation:
 The issue is not just noise, but lack of respect and listening skills.
 This sentence addresses classroom values and social behavior, not just volume.
Option B encourages speaking, which is inappropriate.


Option C ends the activity without addressing the behavior.


21. The classroom gradually becomes louder again.
A. This is getting too noisy.
 B. Good job staying focused.
 C. Let’s hear from someone else.
✅ Correct answer: A
Detailed explanation:
 This is an early intervention statement.
 The teacher notices rising noise and addresses it before it becomes disruptive.
Option B praises behavior that is not happening.


Option C increases speaking and noise.


22. Students do not respond because they feel shy.
A. Don’t be shy. Give it a try.
 B. Please work quietly.
 C. Stop here, please.
✅ Correct answer: A
Detailed explanation:
 The teacher recognizes the barrier as emotional, not cognitive.
 This sentence lowers affective filters and encourages risk-taking.
Option B suppresses speaking.


Option C ends the interaction prematurely.


23. Students hesitate because they are afraid of making mistakes.
A. It’s okay to make mistakes.
 B. Time’s up.
 C. Focus on your work, please.
✅ Correct answer: A
Detailed explanation:
 Language learning requires experimentation.
 This sentence builds a growth mindset and normalizes error as part of learning.
Option B avoids the learning opportunity.


Option C shifts to individual focus, not speaking.



24. No student volunteers to answer a question.
A. If no one raises your hand, I’ll randomly call someone.
 B. Let’s move on.
 C. Keep it up.
✅ Correct answer: A
Detailed explanation:
 This creates accountability and gentle pressure while still giving students a chance to volunteer.
Option B reduces participation expectations.


Option C praises behavior that does not exist.


25. Students appear passive and disengaged.
A. Be more active, please.
 B. Please work quietly.
 C. Put your pens down.
✅ Correct answer: A
Detailed explanation:
 The teacher’s goal is to increase participation and energy, not reduce noise.
Option B discourages interaction.


Option C ends writing, not engagement.


26. Students are chatting during task time.
A. Please stop chatting.
 B. Take a guess.
 C. Who would like to share?
✅ Correct answer: A
Detailed explanation:
 The teacher needs immediate correction of off-task behavior.
Option B and C invite speaking and worsen the issue.


27. Students talk about topics unrelated to the lesson.
A. Are you talking about the lesson?
 B. Let’s help each other learn.
 C. Change roles, please.
✅ Correct answer: A
Detailed explanation:
 This question subtly redirects students without accusing or embarrassing them.
Option B is too abstract.


Option C is irrelevant to the issue.


28. Students lose focus during work time.
A. Focus on your work, please.
 B. Who would like to share?
 C. Let’s move on.
✅ Correct answer: A
Detailed explanation:
 The teacher wants students to return attention to the task, not change activity.
Option B distracts from work.


Option C skips unfinished learning.


29. Students talk while the teacher is explaining.
A. This is not the time to talk.
 B. Don’t be shy.
 C. Work in pairs, please.
✅ Correct answer: A
Detailed explanation:
 The teacher establishes clear behavioral boundaries for instruction time.
Option B encourages talking.


Option C changes lesson structure.


30. Students are not looking at learning materials.
A. Eyes on your book, please.
 B. Time’s up.
 C. Are you ready?
✅ Correct answer: A
Detailed explanation:
 The teacher directs visual attention to support comprehension.
Option B ends the task.


Option C checks readiness, not attention.


31. Students talk while instructions are given.
A. You can talk later.
 B. Take a guess.
 C. Keep it up.
✅ Correct answer: A
Detailed explanation:
 This politely postpones talking and keeps the lesson moving.
Option B invites immediate speaking.


Option C reinforces inappropriate behavior.


32. Students appear distracted.
A. Pay attention, please.
 B. Let’s check the answers.
 C. Who would like to share?
✅ Correct answer: A
Detailed explanation:
 A direct reminder is most effective before changing activity.
Option B assumes readiness.


Option C increases talking.


33. Students are slow to return to work after an activity.
A. Let’s get back to the task.
 B. Take a guess.
 C. Keep it up.
✅ Correct answer: A
Detailed explanation:
 This helps students transition smoothly from one activity to another.
Option B distracts.


Option C maintains off-task behavior.


34. Students struggle to concentrate during quiet work.
A. I need you to concentrate.
 B. Time’s up.
 C. Back to your seats.
✅ Correct answer: A
Detailed explanation:
 The teacher clearly communicates expectations for mental focus, not physical movement.
Option B ends work too early.


Option C addresses seating, not attention.


35. The activity time ends.
A. Time’s up.
 B. Take a guess.
 C. Please stop chatting.
✅ Correct answer: A
Detailed explanation:
 This is a clear time-management signal recognized by students.
36. The teacher wants to move to the next activity or section.
A. Let’s move on.
 B. Any ideas?
 C. Put your pens down.
✅ Correct answer: A
Detailed explanation:
 At this point, the teacher’s goal is lesson progression and time management.
 “Let’s move on” clearly signals a transition without reopening discussion or giving physical instructions.
Option B invites ideas and extends the current activity.


Option C focuses on stopping writing, which may not be necessary in all transitions.


37. The teacher wants students to stop writing and listen.
A. Put your pens down.
 B. Focus on your work.
 C. Change roles, please.
✅ Correct answer: A
Detailed explanation:
 The teacher needs students to physically stop writing so they can listen.
 “Put your pens down” is a clear, observable action that immediately changes student behavior.
Option B encourages continued work, not listening.


Option C is only relevant in pair or group activities.


38. The teacher is about to give important instructions.
A. Now, listen carefully.
 B. Work in pairs, please.
 C. Keep it up.
✅ Correct answer: A
Detailed explanation:
 Before giving key information, the teacher must secure full attention.
 This sentence prepares students mentally to listen and process instructions.
Option B introduces an activity too early.


Option C is praise and does not signal importance.


39. The teacher checks whether students are ready to continue.
A. Are you ready?
 B. Please stop chatting.
 C. Time’s up.
✅ Correct answer: A
Detailed explanation:
 The teacher wants to confirm readiness before moving forward.
 This question invites a response and allows the teacher to adjust pacing if needed.
Option B addresses behavior, not readiness.


Option C signals the end of time, not preparation.


40. The teacher wants to review students’ work together.
A. Let’s check the answers.
 B. Take a guess.
 C. Let’s calm down.
✅ Correct answer: A
Detailed explanation:
 This sentence signals a shift from doing the task to reviewing and evaluating it.
Option B encourages guessing rather than checking.


Option C focuses on behavior, not content.


41. The teacher wants students to work with a partner.
A. Work in pairs, please.
 B. Please work quietly.
 C. Stop here, please.
✅ Correct answer: A
Detailed explanation:
 The teacher is organizing the interaction structure.
 This sentence gives a clear instruction about grouping.
Option B focuses on noise level, not grouping.


Option C ends the activity instead of starting one.


42. Students need to swap responsibilities in a pair or group.
A. Change roles, please.
 B. Back to your seats.
 C. Keep it up.
✅ Correct answer: A
Detailed explanation:
 Changing roles ensures equal participation and balanced practice.
 This instruction is specific to collaborative activities.
Option B concerns physical movement.


Option C is praise, not instruction.


43. Students are moving around and need to return to their places.
A. Back to your seats.
 B. Who would like to share?
 C. Take a guess.
✅ Correct answer: A
Detailed explanation:
 After movement activities, the teacher needs to restore order and structure.
 This instruction is clear and immediately actionable.
Option B invites speaking.


Option C encourages guessing, not seating.


44. Students are working quietly and attentively.
A. Good job staying focused.
 B. Time’s up.
 C. Stop talking and listen.
✅ Correct answer: A
Detailed explanation:
 The teacher reinforces positive behavior through specific praise, which increases the chance students will repeat it.
Option B ends the activity unnecessarily.


Option C corrects behavior that is not problematic.


45. Students stop talking after the teacher’s request.
A. Thank you for being quiet.
 B. Let’s move on.
 C. Are you ready?
✅ Correct answer: A
Detailed explanation:
 This acknowledges compliance and builds a positive teacher–student relationship.
Option B skips reinforcement.


Option C checks readiness instead of giving feedback.


46. Students are listening attentively to instructions.
A. I like the way you’re listening.
 B. Please stop chatting.
 C. Work in pairs, please.
✅ Correct answer: A
Detailed explanation:
 Specific praise strengthens listening behavior and encourages others to follow.
Option B addresses a problem that does not exist.


Option C changes the activity unnecessarily.


47. The teacher wants to promote cooperation and support.
A. Let’s help each other learn.
 B. Put your pens down.
 C. Time’s up.
✅ Correct answer: A
Detailed explanation:
 This sentence reinforces collaborative values and a supportive learning environment.
Option B addresses writing, not cooperation.


Option C ends the activity.


48. Students are doing well and the teacher wants to motivate them.
A. Keep it up.
 B. Stop here, please.
 C. Be more active, please.
✅ Correct answer: A
Detailed explanation:
 “Keep it up” is short encouragement that maintains momentum and motivation.
Option B stops progress.


Option C suggests students are not active enough.


49. The teacher needs immediate silence from the whole class.
A. If you can hear me, stop talking.
 B. Take a guess.
 C. Change roles, please.
✅ Correct answer: A
Detailed explanation:
 This is an attention-getting strategy that works without shouting and quickly reduces noise.
Option B increases talking.


Option C is unrelated to attention control.


50. Students need to refocus on the lesson after being distracted.
A. Let’s get back to the task.
 B. Who would like to share?
 C. Keep it up.
✅ Correct answer: A
Detailed explanation:
 This sentence smoothly redirects students back to learning without scolding.
Option B encourages speaking before focus is restored.


Option C reinforces off-task behavior.
"""

def parse():
    situations = []
    
    # Split by "N. " at start of lines (lookahead)
    chunks = re.split(r'\n(?=\d+\.\s)', "\n" + raw_text.strip())
    
    for chunk in chunks:
        if not chunk.strip(): continue
        
        lines = chunk.strip().split('\n')
        
        # Get question
        # First line is "N. Question text"
        q_line = lines[0]
        match = re.match(r'\d+\.\s+(.+)', q_line)
        if not match: continue
        question_text = match.group(1).strip()
        
        choices = []
        best_choice_id = None
        detailed_explanation = ""
        
        # Helper to clean text
        def clean(s): return s.strip()
        
        # Parse rest
        choice_pattern = re.compile(r'\s*([A-C])\.\s+(.+)')
        
        current_section = "choices" # choices, explanation
        explanation_lines = []
        
        for line in lines[1:]:
            line = line.strip()
            if not line: continue
            
            if "Detailed explanation:" in line:
                current_section = "explanation"
                continue
            
            if "Correct answer:" in line:
                best_choice_id = line.split(":")[-1].strip()
                continue
                
            if current_section == "choices":
                m = choice_pattern.match(line)
                if m:
                    cid = m.group(1)
                    ctext = m.group(2)
                    choices.append({
                        "choice_id": cid,
                        "text": ctext,
                        "rating": "best" # Temporary, will fix
                    })
            elif current_section == "explanation":
                explanation_lines.append(line)
                
        detailed_explanation = "\n".join(explanation_lines).strip()
        
        # If no explicit best answer, look in explanation
        if not best_choice_id:
            for c in choices:
                # remove punctuation for looser match
                ctext_clean = re.sub(r'[^\w\s]', '', c["text"].lower())
                explanation_clean = re.sub(r'[^\w\s]', '', detailed_explanation.lower())
                
                # Check if exact text appears (case insensitive)
                if c["text"].lower() in detailed_explanation.lower():
                     best_choice_id = c["choice_id"]
                     break
                
                # Or check if "Option X" is mentioned as good
                # (Skipping advanced NLP, fallback to A if not found)
        
        if not best_choice_id:
            # Check detailed explanation for clues like "Option X is..."
            # For now default to A if really stuck, but for Q1 it is B.
            # In Q1 "Everyone, please quiet down" is B.
            if "Everyone, please quiet down" in detailed_explanation:
                best_choice_id = "B"
            else:
                best_choice_id = "A" # Fallback

        # Fix ratings
        for c in choices:
            is_best = c["choice_id"] == best_choice_id
            c["rating"] = "best" if is_best else "not_recommended"
            # Maybe use 'acceptable' for second best? User didn't specify.
            # I'll stick to 'best' vs 'not_recommended' for now or 'acceptable' for others.
            if not is_best:
                c["rating"] = "acceptable"
        
        situations.append({
            "question": question_text,
            "choices": choices,
            "best_choice_id": best_choice_id,
            "detailed_explanation": detailed_explanation
        })
        
    return situations

def update_data_js(situations):
    file_path = "scripts/data.js"
    with open(file_path, "r") as f:
        content = f.read()
    
    # Group situations: 10 per group
    # Structure: situationsByGroup: { 1: [], 2: [], ... }
    
    js_output = "situationsByGroup: {\n"
    
    # Assuming 5 groups of 10
    situations_per_group = 10
    
    # Create dictionary of groups
    grouped = {}
    for i, sim in enumerate(situations):
        group_num = (i // situations_per_group) + 1
        if group_num not in grouped:
            grouped[group_num] = []
        grouped[group_num].append(sim)
        
    for grp_num, sims in grouped.items():
        js_output += f"    {grp_num}: [\n"
        for sim in sims:
            js_output += "      {\n"
            js_output += f'        question: "{sim["question"]}",\n'
            js_output += "        choices: [\n"
            for c in sim["choices"]:
                js_output += "          {\n"
                js_output += f'            choice_id: "{c["choice_id"]}",\n'
                js_output += f'            text: "{c["text"]}",\n'
                js_output += f'            rating: "{c["rating"]}",\n'
                js_output += "          },\n"
            js_output += "        ],\n"
            js_output += f'        best_choice_id: "{sim["best_choice_id"]}",\n'
            # Escape backticks in explanation
            expl = sim["detailed_explanation"].replace('`', '\\`').replace('$', '\\$')
            js_output += f'        detailed_explanation: `{expl}`,\n'
            js_output += "      },\n"
        js_output += "    ],\n"
    js_output += "  ]" # Wait, this should close the object `}` not `]`
    
    # Correct closing
    js_output = js_output[:-2] + "\n  }" # Remove last comma
    
    # Replace logic
    # We look for "situations: [ ... ]" and replace with "situationsByGroup: { ... }"
    
    start_marker = "situations: ["
    # We rely on the File structure we know. 
    # Note: earlier we wrote "situations: [ ... ],\n\n  // Test users"
    
    # Find start of situations
    start_idx = content.find(start_marker)
    
    # Find start of Test users (as anchor for AFTER situations)
    end_marker = "// Test users"
    end_idx = content.find(end_marker)
    
    if start_idx == -1:
        # It's possible we already converted it? Or we are looking for the OLD key.
        # If the file currently has `situations: [...]`, this works.
        pass
        
    if start_idx == -1 or end_idx == -1:
         print(f"❌ Could not find markers. Start: {start_idx}, End: {end_idx}")
         return

    prefix = content[:start_idx]
    suffix = content[end_idx:]
    
    new_content = prefix + f"{js_output},\n\n  " + suffix

    with open(file_path, "w") as f:
        f.write(new_content)
    print("✅ Successfully refactored data.js to use situationsByGroup!")

if __name__ == "__main__":
    situations = parse()
    # print(json.dumps(situations, indent=2))
    update_data_js(situations)
