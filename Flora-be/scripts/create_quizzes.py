import sys
import re
import json
import os

def parse_and_update():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    sample_data_path = os.path.join(script_dir, "sample_data.txt")
    data_js_path = os.path.join(script_dir, "data.js")

    print(f"Reading {sample_data_path}...")
    with open(sample_data_path, "r", encoding="utf-8") as f:
        content = f.read()

    situations = {}

    
    # Normalize newlines
    content = content.replace('\r\n', '\n')
    
    # Extract blocks for each group
    group_pattern = re.compile(r'(?:NHÓM|GROUP)\s+(\d+)(.*?)(?=(?:NHÓM|GROUP)\s+\d+|$)', re.IGNORECASE | re.DOTALL)
    
    for group_match in group_pattern.finditer(content):
        group_num = int(group_match.group(1))
        group_text = group_match.group(2)
        
        q_pattern = re.compile(r'\n\d+\.\s+(.*?)(?=\n\d+\.\s+|$)', re.DOTALL)
        
        for q_match in q_pattern.finditer('\n' + group_text.strip()):
            q_full_text = q_match.group(1).strip()
            
            lines = q_full_text.split('\n')
            title = lines[0].strip()
            
            question_lines = [title]
            choices = []
            explanation = ""
            state = "QUESTION"
            
            for line in lines[1:]:
                stripped = line.strip()
                if not stripped:
                    continue
                
                if stripped.startswith("Explanation:"):
                    state = "EXPLANATION"
                    exp_text = stripped[len("Explanation:"):].strip()
                    if exp_text:
                        explanation += exp_text + "\n"
                    continue
                
                choice_match = re.match(r'^([A-D])\.\s*(.*)', stripped)
                if choice_match and state != "EXPLANATION":
                    state = "CHOICES"
                    text = choice_match.group(2).strip()
                    choices.append({
                        "choice_id": choice_match.group(1).upper(),
                        "text": text
                    })
                    continue
                
                if state == "QUESTION":
                    if stripped != "What should the teacher say?":
                        question_lines.append(stripped)
                elif state == "CHOICES":
                    if choices:
                        choices[-1]["text"] += " " + stripped
                    else:
                        question_lines.append(stripped)
                elif state == "EXPLANATION":
                    explanation += stripped + "\n"
            
            if len(choices) > 0 and choices[0]['choice_id'] == 'B':
                choices.insert(0, {
                    "choice_id": "A",
                    "text": "It's okay to make mistakes."
                })
                
            question = " ".join(question_lines).strip()
            explanation = explanation.strip()
            
            best_choice_id = choices[0]['choice_id'] if choices else "A"
            
            # Find choices that are explicitly explained as wrong 
            mentioned_as_wrong = set()
            for ch in choices:
                cid = ch['choice_id']
                if re.search(r'(?m)^\s*' + cid + r'\b', explanation):
                    mentioned_as_wrong.add(cid)
            
            unmentioned = [ch['choice_id'] for ch in choices if ch['choice_id'] not in mentioned_as_wrong]
            if len(unmentioned) == 1:
                best_choice_id = unmentioned[0]
            else:
                exp_lower = explanation.lower()
                for ch in choices:
                    cid = ch['choice_id'].lower()
                    
                    clean_text = re.sub(r'[^\w\s]', '', ch['text'].lower())
                    clean_exp = re.sub(r'[^\w\s]', '', exp_lower)
                    
                    if clean_text in clean_exp and clean_text != "":
                        best_choice_id = ch['choice_id']
                    
                    if f"answer {cid} is best" in exp_lower or f"answer {cid} gives" in exp_lower:
                        best_choice_id = ch['choice_id']
                    if f"option {cid} clearly" in exp_lower or f"option {cid} directly" in exp_lower:
                        best_choice_id = ch['choice_id']
                    if f" {cid} is best" in exp_lower:
                        best_choice_id = ch['choice_id']
                    
            for ch in choices:
                ch.pop('rating', None)
            
            grp_key = str(group_num)
            if grp_key not in situations:
                situations[grp_key] = []
                
            situations[grp_key].append({
                "question": question,
                "choices": choices,
                "best_choice_id": best_choice_id,
                "explanation": explanation
            })

            
    with open(data_js_path, "r", encoding="utf-8") as f:
        data_js = f.read()
        
    start_pos = data_js.find("quizzes: [")
    if start_pos == -1:
        start_pos = data_js.find("quizzes: {")
        
    end_str = "  // Test users"
    end_pos = data_js.find(end_str)
    
    if start_pos != -1 and end_pos != -1:
        quizzes_json = json.dumps(situations, indent=4, ensure_ascii=False)
        quizzes_json = quizzes_json.replace('\n', '\n  ')
        new_data_js = data_js[:start_pos] + "quizzes: " + quizzes_json + ",\n\n" + data_js[end_pos:]
        
        count = sum(len(qlist) for qlist in situations.values())
        with open(data_js_path, "w", encoding="utf-8") as f:
            f.write(new_data_js)
        print(f"data.js successfully updated with {count} quizzes across {len(situations)} groups!")
    else:
        print("Error: Could not find anchor points in data.js to inject data.")

if __name__ == "__main__":
    parse_and_update()
