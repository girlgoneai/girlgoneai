# Personal Budget Tracker

Import this data into Google Sheets or Excel. Copy everything below the line.

---

```
--- SHEET: Monthly Budget ---

MONTHLY BUDGET,,,,,,
Month:,April 2026,,,,,
,,,,,,
=== INCOME ===,,,,,,
Source,Amount,Frequency,Monthly Total,Notes,,
Salary / Primary Job,$5000.00,Monthly,"=B5*IF(C5=""Monthly"",1,IF(C5=""Bi-Weekly"",2.167,IF(C5=""Weekly"",4.333,1)))",,,"[FORMULA: Converts any frequency to monthly total]"
Freelance / Contract,$800.00,Monthly,=B6,,
Side Hustle,$250.00,Monthly,=B7,,
Investment Income,$120.00,Monthly,=B8,,
Other Income,$0.00,Monthly,=B9,,
,,,,,,
TOTAL MONTHLY INCOME,,,=SUM(D5:D9),,,
,,,,,,
=== FIXED EXPENSES ===,,,,,,
Expense,Amount,Frequency,Monthly Total,Notes,,
Rent / Mortgage,$1450.00,Monthly,=B15,,
Utilities (Electric/Gas),$110.00,Monthly,=B16,,
Water / Sewer,$45.00,Monthly,=B17,,
Internet,$65.00,Monthly,=B18,,
Cell Phone,$55.00,Monthly,=B19,,
Health Insurance,$220.00,Monthly,=B20,,
Car Insurance,$95.00,Monthly,=B21,,
Renter/Home Insurance,$30.00,Monthly,=B22,,
Car Payment,$0.00,Monthly,=B23,,
Student Loan,$250.00,Monthly,=B24,,
Other Loan Payment,$0.00,Monthly,=B25,,
Streaming Subscriptions,$45.00,Monthly,=B26,,
Gym / Fitness Membership,$35.00,Monthly,=B27,,
Other Subscriptions,$20.00,Monthly,=B28,,
,,,,,,
TOTAL FIXED EXPENSES,,,=SUM(D15:D28),,,
,,,,,,
=== VARIABLE EXPENSES ===,,,,,,
Expense,Budget,Actual Spent,Remaining,Notes,,
Groceries,$400.00,$380.00,"=B33-C33",,,"[FORMULA: =Budget-Actual]"
Dining Out / Takeout,$150.00,$210.00,=B34-C34,,
Coffee / Cafes,$40.00,$55.00,=B35-C35,,
Entertainment,$80.00,$60.00,=B36-C36,,
Clothing / Apparel,$100.00,$0.00,=B37-C37,,
Personal Care / Grooming,$60.00,$45.00,=B38-C38,,
Gas / Fuel,$80.00,$95.00,=B39-C39,,
Public Transit / Rideshare,$30.00,$25.00,=B40-C40,,
Home Supplies,$50.00,$35.00,=B41-C41,,
Gifts / Celebrations,$50.00,$0.00,=B42-C42,,
Medical / Pharmacy,$30.00,$0.00,=B43-C43,,
Pet Care,$0.00,$0.00,=B44-C44,,
Kids / Education,$0.00,$0.00,=B45-C45,,
Miscellaneous,$50.00,$40.00,=B46-C46,,
,,,,,,
TOTAL VARIABLE EXPENSES (Budget),,,"=SUM(B33:B46)",,,"[FORMULA: Sum of budget column]"
TOTAL VARIABLE EXPENSES (Actual),,,"=SUM(C33:C46)",,,"[FORMULA: Sum of actual column]"
,,,,,,
=== SAVINGS GOALS ===,,,,,,
Goal,Target Amount,Current Saved,Monthly Contribution,Months to Goal,% Complete,
Emergency Fund,$10000.00,$3200.00,$300.00,"=IF(B52-C52>0,(B52-C52)/D52,0)",,="=C52/B52*100&""%"""
Vacation Fund,$2500.00,$800.00,$150.00,=IF(B53-C53>0,(B53-C53)/D53,0),,=C53/B53*100
Retirement Contribution,$0.00,$0.00,$200.00,N/A,,
Down Payment Fund,$0.00,$0.00,$0.00,=IF(B55-C55>0,(B55-C55)/D55,0),,=IF(B55>0,C55/B55*100,0)
Custom Goal 1:,$0.00,$0.00,$0.00,=IF(B56-C56>0,(B56-C56)/D56,0),,=IF(B56>0,C56/B56*100,0)
Custom Goal 2:,$0.00,$0.00,$0.00,=IF(B57-C57>0,(B57-C57)/D57,0),,=IF(B57>0,C57/B57*100,0)
,,,,,,
TOTAL MONTHLY SAVINGS CONTRIBUTIONS,,,=SUM(D52:D57),,,
,,,,,,
=== MONTHLY SUMMARY ===,,,,,,
,,,,,,
Total Monthly Income,,,"=D11",,,"[Pull from income section]"
Total Fixed Expenses (-),,,"=D29",,,"[Pull from fixed expenses]"
Total Variable Expenses Actual (-),,,"=D49",,,"[Pull from variable actual]"
Total Savings Contributions (-),,,"=D59",,,"[Pull from savings goals]"
,,,,,,
NET REMAINING,,,"=D64-D65-D66-D67",,,"[FORMULA: Income - Fixed - Variable - Savings]"
,,,,,,
Savings Rate %,,,"=D67/D64*100",,,"[FORMULA: Savings / Income * 100 — target 20%+]"
Expenses as % of Income,,,"=(D65+D66)/D64*100",,,"[FORMULA: Total expenses / income * 100]"
,,,,,,
STATUS:,,,"=IF(D70>=0,""ON TRACK - You have surplus"",""OVER BUDGET - Review spending"")",,,"[FORMULA: Conditional status check]"

--- SHEET: Transaction Log ---

TRANSACTION LOG,,,,,,
,,,,,,
Instructions: Log every transaction. Use the Category Dropdown list below.,,,,,
,,,,,,
--- Category Reference ---,,,,,,
Category Options (copy these for data validation):,,,,,
Income,,,,,
Salary,,,,,
Freelance,,,,,
Investment,,,,,
Other Income,,,,,
Housing,,,,,
Utilities,,,,,
Insurance,,,,,
Subscriptions,,,,,
Loan / Debt,,,,,
Groceries,,,,,
Dining Out,,,,,
Coffee,,,,,
Entertainment,,,,,
Clothing,,,,,
Personal Care,,,,,
Gas / Fuel,,,,,
Transportation,,,,,
Home Supplies,,,,,
Gifts,,,,,
Medical,,,,,
Pet Care,,,,,
Kids / Education,,,,,
Savings Transfer,,,,,
Miscellaneous,,,,,
,,,,,,
--- Transaction Log ---,,,,,,
Date,Description,Category,Amount,Payment Method,Notes,Running Balance
2026-04-01,Opening Balance,,,,,=$0.00
2026-04-01,Paycheck Deposit,Salary,+$5000.00,Direct Deposit,April 15 paycheck,"=H31+E32"
2026-04-01,Rent Payment,Housing,-$1450.00,ACH Auto-Pay,April rent,"=H32+E33"
2026-04-01,Groceries - Trader Joe's,Groceries,-$87.42,Debit Card,Weekly grocery run,"=H33+E34"
2026-04-02,Netflix Subscription,Subscriptions,-$15.99,Credit Card,Monthly auto-charge,"=H34+E35"
2026-04-02,Coffee - Local Cafe,Coffee,-$6.50,Credit Card,,"=H35+E36"
2026-04-03,Gas Fill-up,Gas / Fuel,-$48.30,Credit Card,Full tank,"=H36+E37"
2026-04-04,Dinner Out,Dining Out,-$42.00,Credit Card,Friday dinner w/ partner,"=H37+E38"
2026-04-05,Gym Membership,Subscriptions,-$35.00,ACH Auto-Pay,Monthly fee,"=H38+E39"
2026-04-07,Freelance Invoice Paid,Freelance,+$800.00,ACH Transfer,Client XYZ project,"=H39+E40"
2026-04-07,Electric Bill,Utilities,-$110.00,ACH Auto-Pay,April bill,"=H40+E41"
2026-04-08,Grocery Run,Groceries,-$62.15,Debit Card,Costco run,"=H41+E42"
2026-04-10,Emergency Fund Transfer,Savings Transfer,-$300.00,ACH Transfer,Monthly savings goal,"=H42+E43"
2026-04-10,Vacation Fund Transfer,Savings Transfer,-$150.00,ACH Transfer,Monthly savings goal,"=H43+E44"
,,,,,,
[Add new rows below — copy the Running Balance formula down],,,,,
,,,,,,
--- MONTHLY TOTALS ---,,,,,,
Total Income This Month:,,=SUMIF(C:C,"Income",E:E)+SUMIF(C:C,"Salary",E:E)+SUMIF(C:C,"Freelance",E:E)+SUMIF(C:C,"Investment",E:E),,,,
Total Expenses This Month:,,=SUMIF(E:E,"<0",E:E),,,,
Net This Month:,,=C50+C51,,,,
Number of Transactions:,,=COUNTA(A32:A200)-COUNTBLANK(A32:A200),,,,

--- SHEET: Annual Overview ---

ANNUAL OVERVIEW — 2026,,,,,,,,,,,,,,
,,,,,,,,,,,,,,
=== MONTHLY INCOME vs EXPENSES ===,,,,,,,,,,,,,
Month,Income,Fixed Expenses,Variable Expenses,Savings,Net,Savings Rate %,Notes,,,,,,
January,$5800.00,$2420.00,$980.00,$650.00,"=$B6-$C6-$D6-$E6","=$F6/$B6*100",,,,,,
February,$5200.00,$2420.00,$750.00,$650.00,"=$B7-$C7-$D7-$E7","=$F7/$B7*100",,,,,,
March,$5950.00,$2420.00,$1100.00,$650.00,"=$B8-$C8-$D8-$E8","=$F8/$B8*100",,,,,,
April,$6050.00,$2420.00,$905.00,$650.00,"=$B9-$C9-$D9-$E9","=$F9/$B9*100",,,,,,
May,,,,,,,,,,,,,
June,,,,,,,,,,,,,
July,,,,,,,,,,,,,
August,,,,,,,,,,,,,
September,,,,,,,,,,,,,
October,,,,,,,,,,,,,
November,,,,,,,,,,,,,
December,,,,,,,,,,,,,
,,,,,,,,,,,,,,
YEAR-TO-DATE TOTALS:,=SUM(B6:B17),=SUM(C6:C17),=SUM(D6:D17),=SUM(E6:E17),=SUM(F6:F17),=AVERAGE(G6:G17),,,,,,
MONTHLY AVERAGE:,=AVERAGE(B6:B17),=AVERAGE(C6:C17),=AVERAGE(D6:D17),=AVERAGE(E6:E17),=AVERAGE(F6:F17),,,,,,,
PROJECTED ANNUAL:,"=B21*12","=C21*12","=D21*12","=E21*12","=F21*12",,,,,,,
,,,,,,,,,,,,,,
=== CATEGORY SPENDING BY MONTH ===,,,,,,,,,,,,,
Category,Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec,Annual Total
Housing / Rent,$1450,$1450,$1450,$1450,,,,,,,,,=SUM(B28:M28)
Utilities,$155,$140,$160,$155,,,,,,,,,=SUM(B29:M29)
Insurance,$345,$345,$345,$345,,,,,,,,,=SUM(B30:M30)
Subscriptions,$100,$100,$100,$100,,,,,,,,,=SUM(B31:M31)
Loan Payments,$250,$250,$250,$250,,,,,,,,,=SUM(B32:M32)
Groceries,$360,$310,$390,$380,,,,,,,,,=SUM(B33:M33)
Dining Out,$180,$150,$220,$210,,,,,,,,,=SUM(B34:M34)
Entertainment,$90,$70,$80,$60,,,,,,,,,=SUM(B35:M35)
Clothing,$0,$120,$0,$0,,,,,,,,,=SUM(B36:M36)
Transportation,$95,$80,$110,$95,,,,,,,,,=SUM(B37:M37)
Medical,$30,$0,$60,$0,,,,,,,,,=SUM(B38:M38)
Miscellaneous,$50,$80,$40,$50,,,,,,,,,=SUM(B39:M39)
,,,,,,,,,,,,,,
=== CHART DATA: INCOME vs EXPENSES TREND ===,,,,,,,,,,,,,
(Use this range to create a Line Chart in Google Sheets),,,,,,,,,,,,,
Month,Income,Total Expenses,Savings,,,,,,,,,
January,=Annual_Overview!B6,"=Annual_Overview!C6+Annual_Overview!D6",=Annual_Overview!E6,,,,,,,,,
February,=Annual_Overview!B7,"=Annual_Overview!C7+Annual_Overview!D7",=Annual_Overview!E7,,,,,,,,,
March,=Annual_Overview!B8,"=Annual_Overview!C8+Annual_Overview!D8",=Annual_Overview!E8,,,,,,,,,
April,=Annual_Overview!B9,"=Annual_Overview!C9+Annual_Overview!D9",=Annual_Overview!E9,,,,,,,,,
May,=Annual_Overview!B10,"=Annual_Overview!C10+Annual_Overview!D10",=Annual_Overview!E10,,,,,,,,,
June,=Annual_Overview!B11,"=Annual_Overview!C11+Annual_Overview!D11",=Annual_Overview!E11,,,,,,,,,
July,=Annual_Overview!B12,"=Annual_Overview!C12+Annual_Overview!D12",=Annual_Overview!E12,,,,,,,,,
August,=Annual_Overview!B13,"=Annual_Overview!C13+Annual_Overview!D13",=Annual_Overview!E13,,,,,,,,,
September,=Annual_Overview!B14,"=Annual_Overview!C14+Annual_Overview!D14",=Annual_Overview!E14,,,,,,,,,
October,=Annual_Overview!B15,"=Annual_Overview!C15+Annual_Overview!D15",=Annual_Overview!E15,,,,,,,,,
November,=Annual_Overview!B16,"=Annual_Overview!C16+Annual_Overview!D16",=Annual_Overview!E16,,,,,,,,,
December,=Annual_Overview!B17,"=Annual_Overview!C17+Annual_Overview!D17",=Annual_Overview!E17,,,,,,,,,

--- SHEET: Debt Payoff Tracker ---

DEBT PAYOFF TRACKER,,,,,,,,,,
,,,,,,,,,,
=== DEBT INVENTORY ===,,,,,,,,,,
Debt Name,Current Balance,Interest Rate (APR),Minimum Payment,Extra Payment,Total Monthly Payment,Payoff Date (Est.),Total Interest Remaining,Priority (Snowball),Priority (Avalanche)
Credit Card A,$2400.00,22.99%,$60.00,$100.00,=D5+E5,"=TEXT(EDATE(TODAY(),NPER(C5/12,-F5,B5)),""MMM YYYY"")","=B5*(C5/12/(1-(1+C5/12)^(-NPER(C5/12,-F5,B5))))-B5",1 (Lowest Balance),2
Credit Card B,$1100.00,19.99%,$30.00,$0.00,=D6+E6,"=TEXT(EDATE(TODAY(),NPER(C6/12,-F6,B6)),""MMM YYYY"")","=B6*(C6/12/(1-(1+C6/12)^(-NPER(C6/12,-F6,B6))))-B6",2,3
Student Loan,$8500.00,6.50%,$150.00,$0.00,=D7+E7,"=TEXT(EDATE(TODAY(),NPER(C7/12,-F7,B7)),""MMM YYYY"")","=B7*(C7/12/(1-(1+C7/12)^(-NPER(C7/12,-F7,B7))))-B7",3 (Highest Balance),4
Car Loan,$12000.00,7.25%,$280.00,$0.00,=D8+E8,"=TEXT(EDATE(TODAY(),NPER(C8/12,-F8,B8)),""MMM YYYY"")","=B8*(C8/12/(1-(1+C8/12)^(-NPER(C8/12,-F8,B8))))-B8",4,1 (Highest Rate)
Medical Bill,$650.00,0.00%,$50.00,$0.00,=D9+E9,N/A,$0.00,5,5
Personal Loan,$0.00,0.00%,$0.00,$0.00,=D10+E10,,,
,,,,,,,,,,
TOTALS:,=SUM(B5:B10),,(=SUM(D5:D10)),(=SUM(E5:E10)),=SUM(F5:F10),,=SUM(H5:H10),,
,,,,,,,,,,
=== DEBT PAYOFF STRATEGY COMPARISON ===,,,,,,,,,,
,,,,,,,,,,
DEBT SNOWBALL METHOD (Pay smallest balance first):,,,,,,,,,,
Why it works: Quick psychological wins keep you motivated. Eliminate Credit Card B first — then roll that payment into Credit Card A.,,,,,,,,,,
Step 1: Pay minimums on all debts,,,,,,,,,
Step 2: Put ALL extra money toward Credit Card B ($1100 - lowest balance),,,,,,,,,
Step 3: When Credit Card B is paid off — add its payment to Credit Card A,,,,,,,,,
Step 4: Continue rolling payments until all debts are cleared,,,,,,,,,
,,,,,,,,,,
DEBT AVALANCHE METHOD (Pay highest interest first):,,,,,,,,,,
Why it works: Mathematically optimal — saves the most money in interest charges.,,,,,,,,,,
Step 1: Pay minimums on all debts,,,,,,,,,
Step 2: Put ALL extra money toward Credit Card A (22.99% APR — highest rate),,,,,,,,,
Step 3: When Credit Card A is paid off — move to Credit Card B (19.99% APR),,,,,,,,,
Step 4: Continue in interest-rate order until debt-free,,,,,,,,,
,,,,,,,,,,
=== INTEREST SAVINGS CALCULATOR ===,,,,,,,,,,
,,,,,,,,,,
Total Debt Balance:,=SUM(B5:B10),,,,,,,,,
Total Minimum Payments:,=SUM(D5:D10),,,,,,,,,
Current Extra Payment Per Month:,$100.00,,,,,,,,,
,,,,,,,,,,
Estimated Total Interest (minimum payments only):,=SUM(H5:H10),,,,,,,,
With $100/month extra (Avalanche):,"[Savings depend on application order — use an online debt payoff calculator for precise figures]",,,,,,,,
,,,,,,,,,,
DEBT-FREE TARGET DATE:,Type your goal date here: _______,,,,,,,,,
Monthly Payment Needed to Hit Target:,Use formula: =PMT(rate/12,months,-balance) per debt,,,,,,,,,
,,,,,,,,,,
=== MONTHLY DEBT PAYMENT TRACKER ===,,,,,,,,,,
Month,Credit Card A,Credit Card B,Student Loan,Car Loan,Medical Bill,Total Paid,Remaining Balance,Notes,
January 2026,$160.00,$30.00,$150.00,$280.00,$50.00,=SUM(B39:F39),$24650.00,,
February 2026,$160.00,$30.00,$150.00,$280.00,$50.00,=SUM(B40:F40),"=H39-G40",,
March 2026,$160.00,$30.00,$150.00,$280.00,$50.00,=SUM(B41:F41),"=H40-G41",,
April 2026,$160.00,$30.00,$150.00,$280.00,$50.00,=SUM(B42:F42),"=H41-G42",,

```
