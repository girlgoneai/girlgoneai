# Habit Streak Tracker

Import this data into Google Sheets or Excel. Copy everything below the line.

---

```
--- SHEET: Habit Dashboard ---

HABIT STREAK TRACKER — DASHBOARD,,,,,,,,
Last Updated:,=TODAY(),,,,,,
Month:,April 2026,,,,,,
,,,,,,,,
=== MY HABITS ===,,,,,,,,
#,Habit Name,Category,Frequency,Current Streak,Best Streak,Completion Rate %,Status,Notes
1,Morning Meditation,Mental Health,Daily,14,22,87%,Active,10 minutes mindfulness
2,Exercise / Workout,Exercise,Daily,7,31,72%,Active,Any movement counts
3,Read 20 Pages,Learning,Daily,21,21,93%,On Fire!,Physical or e-book
4,Drink 8 Glasses Water,Nutrition,Daily,3,45,68%,Active,Track with water bottle marks
5,No Phone First Hour,Morning Routine,Daily,2,14,55%,Struggling,Leave phone in other room
6,Weekly Meal Prep,Nutrition,Weekly,3,8,75%,Active,Sunday prep session
7,Call Family / Friend,Social,Weekly,2,12,80%,Active,Meaningful catch-up call
8,Journaling,Mental Health,Daily,9,18,81%,Active,5 minutes minimum
9,Learn Spanish (Duolingo),Learning,Daily,45,45,96%,Streak Master!,15 minutes daily
10,Savings Transfer,Financial,Weekly,8,8,100%,Perfect!,Auto-transfer on payday
11,Cold Shower,Morning Routine,Daily,0,6,40%,Restart Needed,30 seconds minimum
12,Stretch / Yoga,Exercise,Daily,5,14,63%,Active,Morning or evening
13,No Alcohol,Wellness,Daily,30,30,100%,Perfect!,Sober challenge
14,Gratitude List,Mental Health,Daily,12,19,78%,Active,3 things each night
15,Deep Work Block,Productivity,Daily,4,11,69%,Active,2 hours focused work
16,Walk 10000 Steps,Exercise,Daily,6,23,74%,Active,Use phone pedometer
17,Budget Review,Financial,Weekly,5,5,100%,Perfect!,Review transactions
18,Learn New Recipe,Learning,Weekly,1,4,60%,Active,Try one new dish weekly
19,Digital Sunset (No screens 9pm),Wellness,Daily,0,8,35%,Restart Needed,Winds down sleep
20,Floss / Oral Care,Morning Routine,Daily,18,18,91%,Active,After brushing
,,,,,,,,
=== SUMMARY STATS ===,,,,,,,,
Total Habits Tracked:,=COUNTA(B7:B26)-COUNTBLANK(B7:B26),,,,,,,
Active Habits:,=COUNTIF(G7:G26,"Active")+COUNTIF(G7:G26,"On Fire!")+COUNTIF(G7:G26,"Streak Master!")+COUNTIF(G7:G26,"Perfect!"),,,,,,,
Habits Needing Attention:,=COUNTIF(G7:G26,"Restart Needed")+COUNTIF(G7:G26,"Struggling"),,,,,,,
Average Completion Rate:,=AVERAGE(F7:F26),,,,,,,
Longest Active Streak (Current):,=MAX(D7:D26),,,,,,,
Best Streak Ever (All Habits):,=MAX(E7:E26),,,,,,,
Habits at 100% Rate:,=COUNTIF(F7:F26,"100%"),,,,,,,
,,,,,,,,
STATUS KEY:,,,,,,,,
"Streak Master! = 30+ day streak","On Fire! = 14+ day streak","Active = tracking normally","Struggling = below 50% rate","Restart Needed = current streak = 0",,,,

--- SHEET: Daily Tracker ---

DAILY TRACKER — APRIL 2026,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
Instructions: Enter X for completed. Leave blank for missed. Formula columns calculate automatically.,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
Habit,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,Done,Possible,Rate %,Current Streak
Morning Meditation,X,X,X,X,X,X,X,X,X,X,X,X,X,X,,X,X,X,X,X,X,X,X,X,X,X,X,X,X,,28,30,"=AC6/AD6*100","=IF(AE6>=1,COUNTIF(OFFSET(AF6,0,-2,1,31-DAY(TODAY())+1),""X""),0)"
Exercise / Workout,X,,X,X,,X,X,X,,X,X,,X,X,X,X,,X,X,X,,X,X,,X,X,,X,X,,22,30,=AC7/AD7*100,
Read 20 Pages,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,,29,30,=AC8/AD8*100,
Drink 8 Glasses Water,X,X,,X,X,X,,X,X,,X,X,X,,X,X,X,,X,X,X,,X,X,,X,X,,X,,21,30,=AC9/AD9*100,
No Phone First Hour,,X,X,,X,,X,X,,X,,X,,X,X,,X,,X,X,,X,,X,X,,X,,X,,16,30,=AC10/AD10*100,
Weekly Meal Prep,,,,,,,X,,,,,,,X,,,,,,,X,,,,,,,X,,,4,4,=AC11/AD11*100,
Call Family / Friend,,,,,,X,,,,,X,,,,,,X,,,,,X,,,,,,,,4,4,=AC12/AD12*100,
Journaling,X,X,X,X,,X,X,X,X,,X,X,X,X,,X,X,X,X,X,,X,X,X,X,,X,X,X,,25,30,=AC13/AD13*100,
Learn Spanish,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,,29,30,=AC14/AD14*100,
Savings Transfer,X,,,,,,,X,,,,,,,X,,,,,,,X,,,,,,,X,,5,5,=AC15/AD15*100,
Cold Shower,,,X,,X,,,,X,,,,X,,,X,,,,X,,,,X,,,,,,8,30,=AC16/AD16*100,
Stretch / Yoga,X,X,,X,X,,X,X,,X,X,,X,X,,X,X,,X,X,,X,X,,X,X,,X,X,,22,30,=AC17/AD17*100,
No Alcohol,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,,29,30,=AC18/AD18*100,
Gratitude List,X,X,X,X,,X,X,X,X,,X,X,X,X,,X,X,X,X,X,,X,X,X,X,,X,X,X,,24,30,=AC19/AD19*100,
Deep Work Block,X,,X,X,X,,X,X,X,,X,X,X,,X,X,X,,X,X,X,,X,X,X,,X,X,X,,22,30,=AC20/AD20*100,
Walk 10000 Steps,X,X,X,,X,X,,X,X,X,,X,X,X,,X,X,X,,X,X,X,,X,X,X,,X,X,,22,30,=AC21/AD21*100,
Budget Review,,,,,,,X,,,,,,,X,,,,,,,X,,,,,,,X,,,4,4,=AC22/AD22*100,
Learn New Recipe,,,,,,X,,,,,,,X,,,,,,,X,,,,,,,,,3,4,=AC23/AD23*100,
Digital Sunset,,,X,,,,X,,,,,X,,,,X,,,,,X,,,,X,,,,,8,30,=AC24/AD24*100,
Floss / Oral Care,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,,X,X,X,X,X,X,X,X,X,X,,28,30,=AC25/AD25*100,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
Daily Completions:,"=COUNTIF(B6:B25,""X"")","=COUNTIF(C6:C25,""X"")","=COUNTIF(D6:D25,""X"")","=COUNTIF(E6:E25,""X"")","=COUNTIF(F6:F25,""X"")","=COUNTIF(G6:G25,""X"")","=COUNTIF(H6:H25,""X"")","=COUNTIF(I6:I25,""X"")","=COUNTIF(J6:J25,""X"")","=COUNTIF(K6:K25,""X"")","=COUNTIF(L6:L25,""X"")","=COUNTIF(M6:M25,""X"")","=COUNTIF(N6:N25,""X"")","=COUNTIF(O6:O25,""X"")","=COUNTIF(P6:P25,""X"")","=COUNTIF(Q6:Q25,""X"")","=COUNTIF(R6:R25,""X"")","=COUNTIF(S6:S25,""X"")","=COUNTIF(T6:T25,""X"")","=COUNTIF(U6:U25,""X"")","=COUNTIF(V6:V25,""X"")","=COUNTIF(W6:W25,""X"")","=COUNTIF(X6:X25,""X"")","=COUNTIF(Y6:Y25,""X"")","=COUNTIF(Z6:Z25,""X"")","=COUNTIF(AA6:AA25,""X"")","=COUNTIF(AB6:AB25,""X"")","=COUNTIF(AC6:AC25,""X"")","=COUNTIF(AD6:AD25,""X"")","=COUNTIF(AE6:AE25,""X"")",,,,,
Daily % (of 20 habits):,"=B27/20*100","=C27/20*100","=D27/20*100","=E27/20*100","=F27/20*100","=G27/20*100","=H27/20*100","=I27/20*100","=J27/20*100","=K27/20*100","=L27/20*100","=M27/20*100","=N27/20*100","=O27/20*100","=P27/20*100","=Q27/20*100","=R27/20*100","=S27/20*100","=T27/20*100","=U27/20*100","=V27/20*100","=W27/20*100","=X27/20*100","=Y27/20*100","=Z27/20*100","=AA27/20*100","=AB27/20*100","=AC27/20*100","=AD27/20*100","=AE27/20*100",,,,,

--- SHEET: Weekly Review ---

WEEKLY REVIEW LOG,,,,,,,
,,,,,,,
Week,Date Range,Habits Completed,Habits Possible,Completion %,Top Habit,Most Missed Habit,Reflection Notes
Week 1,Mar 31 - Apr 6,82,120,=D4/E4*100,Learn Spanish,No Phone First Hour,Strong start. Spanish streak holding. Phone habit harder than expected.
Week 2,Apr 7 - Apr 13,88,120,=D5/E5*100,No Alcohol + Learn Spanish,Cold Shower,Second week feel. Sobriety feeling natural. Cold showers keep slipping.
Week 3,Apr 14 - Apr 20,91,120,=D6/E6*100,Read 20 Pages,Digital Sunset,Best week yet. Reading momentum is real. Need to set a phone alarm for screen off.
Week 4,Apr 21 - Apr 27,85,120,=D7/E7*100,Journaling,No Phone First Hour,Slight dip. Journaling becoming a real habit. Phone habit still weak.
Week 5 (partial),Apr 28 - Apr 30,35,40,=D8/E8*100,,,Month wrapping up — final push.
,,,,,,,
Month Average:,,=AVERAGE(D4:D8),,=AVERAGE(F4:F8),,,
,,,,,,,
=== 4-WEEK ROLLING AVERAGE ===,,,,,,,
This formula gives you your rolling average across the last 4 complete weeks.,,,,,,,
Current 4-Week Average Completion %:,=AVERAGE(F4:F7),,,,,,,
Previous 4-Week Average (update manually):,Enter prior month avg here:,,,,,
Trend:,"=IF(C13>C14,""Improving - keep it up!"",IF(C13=C14,""Holding steady"",""Declining - revisit your habit stack""))",,,,,
,,,,,,,
=== WEEKLY HABIT SCOREBOARD ===,,,,,,,
Habit,Week 1,Week 2,Week 3,Week 4,Monthly Total,Best Week,
Morning Meditation,6,7,7,6,=SUM(B22:E22),=MAX(B22:E22),
Exercise / Workout,5,4,6,5,=SUM(B23:E23),=MAX(B23:E23),
Read 20 Pages,7,7,7,7,=SUM(B24:E24),=MAX(B24:E24),
Drink 8 Glasses Water,5,5,6,5,=SUM(B25:E25),=MAX(B25:E25),
No Phone First Hour,4,4,5,4,=SUM(B26:E26),=MAX(B26:E26),
Journaling,5,6,7,7,=SUM(B27:E27),=MAX(B27:E27),
Learn Spanish,7,7,7,7,=SUM(B28:E28),=MAX(B28:E28),
No Alcohol,7,7,7,7,=SUM(B29:E29),=MAX(B29:E29),
Gratitude List,5,6,7,6,=SUM(B30:E30),=MAX(B30:E30),
Deep Work Block,5,5,6,6,=SUM(B31:E31),=MAX(B31:E31),

--- SHEET: Monthly Summary ---

MONTHLY SUMMARY — ALL MONTHS,,,,,,,,,,,,,,
,,,,,,,,,,,,,,
Month,Total Completions,Total Possible,Completion %,New Habits Added,Habits Dropped,Streak Milestones Hit,Best Single Day,Top Performing Habit,Most Improved,Notes
January 2026,280,400,70%,5,0,2 (7-day streaks),18/20,Morning Meditation,Exercise,Started the year with 5 core habits
February 2026,310,400,77%,3,0,1 (14-day streak on Meditation),17/20,Learn Spanish,Journaling,Added Spanish and journaling
March 2026,340,560,60%,4,1,2 (Spanish 21-day + No Alcohol 7-day),19/20,Learn Spanish,No Alcohol,Expanded to 12 habits — some strain
April 2026,381,480,79%,1,0,3 (Spanish 45-day + No Alcohol 30-day + Reading 21-day),20/20,Learn Spanish,Read 20 Pages,Best month yet — system is clicking
May 2026,,,,,,,,,,
June 2026,,,,,,,,,,
July 2026,,,,,,,,,,
August 2026,,,,,,,,,,
September 2026,,,,,,,,,,
October 2026,,,,,,,,,,
November 2026,,,,,,,,,,
December 2026,,,,,,,,,,
,,,,,,,,,,,,,,
YEAR-TO-DATE:,=SUM(B4:B15),=SUM(C4:C15),=AVERAGE(D4:D7),,,=SUM(G4:G15),,,,,
ANNUAL GOAL:,"Set your target here: ___",,,,,,,,,,,
,,,,,,,,,,,,,,
=== YEAR-AT-A-GLANCE GRID ===,,,,,,,,,,,,,,
Monthly Completion Rate by Year:,,,,,,,,,,,,,,
,Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec,Annual Avg
2026,70%,77%,60%,79%,,,,,,,,,=AVERAGE(B22:M22)
2027,,,,,,,,,,,,,=AVERAGE(B23:M23)
,,,,,,,,,,,,,,
=== STREAK MILESTONES LOG ===,,,,,,,,,,,,,,
Date,Habit,Milestone,Streak Length,Notes,,,,,,,,
2026-02-14,Morning Meditation,14-Day Streak,14,Valentine's Day — kept the streak,,,,,,,,
2026-03-15,Learn Spanish,21-Day Streak,21,Three weeks without missing!,,,,,,,,
2026-03-31,No Alcohol,30-Day Streak,30,Full month sober — huge milestone,,,,,,,,
2026-04-04,Learn Spanish,45-Day Streak,45,Personal record,,,,,,,,
2026-04-08,Read 20 Pages,21-Day Streak,21,Three straight weeks,,,,,,,,
Add new rows as you hit milestones!,,,,,,,,,,,,

--- SHEET: Habit Library ---

HABIT LIBRARY — 50 POPULAR HABITS,,,,
Organized by category with suggested frequency and difficulty. Use this as inspiration.,,,
,,,,
=== MORNING ROUTINE ===,,,,
#,Habit,Suggested Frequency,Difficulty,Why It Works
1,Wake up at consistent time,Daily,Medium,Anchors your circadian rhythm — everything downstream improves
2,Make your bed,Daily,Easy,Starts the day with a small win — primes your brain for follow-through
3,No phone for first 30-60 minutes,Daily,Hard,Prevents reactive mode — your first hour sets the emotional tone for the day
4,Drink a full glass of water on waking,Daily,Easy,Rehydrates after sleep — improves alertness before caffeine
5,Cold shower or face splash,Daily,Hard,Activates the nervous system — builds mental toughness through daily discomfort
6,5-minute stretching or mobility,Daily,Easy,Reduces morning stiffness — particularly important for desk workers
7,Review your top 3 priorities for the day,Daily,Easy,Ensures you start proactively rather than reactively
8,Sunlight exposure within first hour,Daily,Easy,Regulates melatonin — dramatically improves sleep quality at night
,,,,
=== EXERCISE ===,,,,
#,Habit,Suggested Frequency,Difficulty,Why It Works
9,30-minute walk,Daily,Easy,Lowest-barrier physical habit — improves mood cardiovascular health and creativity
10,Strength training,3x per week,Medium,Builds muscle mass — protects metabolic health as you age
11,Yoga or flexibility work,Daily or 3x week,Easy-Medium,Counteracts the damage of prolonged sitting — improves recovery from harder workouts
12,10000 steps per day,Daily,Medium,Active movement goal that works without a gym — track with any smartphone
13,Zone 2 cardio (easy effort),3x per week,Medium,The most researched form of exercise for longevity — improves mitochondrial health
14,Weekly hike or outdoor activity,Weekly,Easy,Combines exercise with nature exposure — powerful for mental health
15,Track workouts in a log,Each workout,Easy,Athletes who log workouts improve faster — accountability creates consistency
,,,,
=== NUTRITION ===,,,,
#,Habit,Suggested Frequency,Difficulty,Why It Works
16,Meal prep for the week,Weekly,Medium,Removes decision fatigue — healthy eating becomes the path of least resistance
17,Eat a protein-rich breakfast,Daily,Easy-Medium,Protein at breakfast stabilizes blood sugar and reduces afternoon cravings
18,Cook at home (vs. ordering out),5x per week,Medium,Dramatically reduces calorie intake and food spending — home cooks eat 150-200 fewer calories per day on average
19,Eat vegetables with every meal,Daily,Medium,Simple heuristic that crowds out processed food — no calorie counting required
20,Track food intake,Daily,Hard,Awareness is the first step — even 3 days of tracking reveals patterns invisible to memory
21,No snacking after 8pm,Daily,Medium,Extends overnight fast — reduces late-night empty calories
22,Drink 8 glasses of water,Daily,Easy,Most people are chronically mildly dehydrated — affects focus mood and energy
,,,,
=== MENTAL HEALTH ===,,,,
#,Habit,Suggested Frequency,Difficulty,Why It Works
23,10-minute mindfulness meditation,Daily,Medium,Reduces cortisol levels — changes gray matter density with consistent practice over 8 weeks
24,Journaling (brain dump or structured),Daily,Easy-Medium,Externalizes rumination — writing about problems reduces their emotional charge
25,Gratitude list (3 things),Daily,Easy,Rewires attentional bias toward positive — measurable improvement in wellbeing within 2 weeks
26,Therapy or coaching session,Weekly or biweekly,Medium,Professional support for processing and growth — normalized by high performers
27,Digital detox (1 hour screen-free),Daily,Hard,Reduces anxiety and comparison — restores attention span damaged by constant stimulation
28,Nature walk or time outside,Daily,Easy,Even 20 minutes in nature reduces cortisol — improves mood and creative thinking
29,Breathwork (box breathing or 4-7-8),Daily,Easy,Activates parasympathetic nervous system in under 5 minutes — immediate stress reduction
,,,,
=== PRODUCTIVITY ===,,,,
#,Habit,Suggested Frequency,Difficulty,Why It Works
30,Deep work block (2+ hours focused work),Daily,Hard,Cognitively demanding work done in distraction-free blocks produces 4x output of scattered work
31,Weekly review (review goals and tasks),Weekly,Medium,Identifies what matters vs. what's merely urgent — prevents drift from long-term priorities
32,End-of-day shutdown ritual,Daily,Medium,Creates a clear boundary between work and rest — reduces work-related rumination at night
33,Single-tasking (one task at a time),Daily,Hard,Multitasking reduces performance on both tasks by up to 40% — focus is the highest-leverage skill
34,Inbox zero or email batching,Daily or 2x day,Medium,Reduces cognitive overhead of a cluttered inbox — creates predictable times for communication
35,Write your top 3 MITs (Most Important Tasks),Daily,Easy,Ensures high-priority work gets done before the day fills with reactive tasks
,,,,
=== LEARNING ===,,,,
#,Habit,Suggested Frequency,Difficulty,Why It Works
36,Read 20 pages of a book,Daily,Easy-Medium,20 pages per day = 12-15 books per year — the most reliable way to become widely read
37,Learn a language (Duolingo or lessons),Daily,Easy-Medium,Language learning is the most cognitively demanding skill — daily practice beats long infrequent sessions
38,Listen to educational podcast or audiobook,Daily,Easy,Converts commute and chore time into learning — 30-min commute = 1 book per month
39,Take an online course,Weekly (1 module),Medium,Structured learning with accountability — pairs well with a specific skill goal
40,Teach or explain something you learned,Weekly,Medium,The protege effect: teaching reveals gaps in your own understanding — accelerates mastery
41,Practice a musical instrument,Daily,Medium,Activates more areas of the brain simultaneously than any other activity — protects cognitive function with age
,,,,
=== SOCIAL ===,,,,
#,Habit,Suggested Frequency,Difficulty,Why It Works
42,Call or text a friend or family member,Daily or weekly,Easy,Relationships are the #1 predictor of happiness and longevity — they require maintenance to stay strong
43,Send one genuine compliment or thank-you,Daily,Easy,Strengthens relationships — the giver benefits as much as the receiver
44,Schedule one social activity per week,Weekly,Medium,Social isolation accelerates cognitive decline — proactive scheduling beats hoping it happens organically
45,Do something for someone else (small act),Weekly,Easy,Prosocial behavior is one of the most reliable predictors of happiness
,,,,
=== FINANCIAL ===,,,,
#,Habit,Suggested Frequency,Difficulty,Why It Works
46,Track every transaction,Daily,Medium,What gets measured gets managed — financial awareness is the foundation of all other money habits
47,Automated savings transfer on payday,Each paycheck,Easy,Pay yourself first — removing friction makes saving the default behavior
48,Weekly budget review (15 minutes),Weekly,Easy,Catches overspending early — prevents end-of-month surprise deficits
49,Read one article about personal finance,Weekly,Easy,Financial literacy compounds — small consistent learning closes large knowledge gaps over time
50,No-spend day (or weekend),Weekly,Easy-Medium,Breaks automatic spending habits — forces creativity and reveals what you actually value vs. habitual purchases

```
