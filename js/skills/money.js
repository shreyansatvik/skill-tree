/* ==================================================================
   Money & Finance — earning it, keeping it, growing it, and not
   being quietly separated from it.
================================================================== */

addSkills({ cat: 'money', group: 'Foundations' }, [
  { id:'money-basics', name:'Money Basics', tier:1,
    desc:'Track what comes in and what goes out; understand a bank statement.' },
  { id:'price-awareness', name:'Price Awareness', tier:1,
    desc:'Know what things should cost, so you notice when one does not.' },
  { id:'bank-account', name:'Opening & Running an Account', tier:1,
    desc:'Current accounts, standing orders, direct debits and clearing times.' },
  { id:'payment-methods', name:'Payments & Transfers', tier:2, req:['bank-account','digital-safety'],
    desc:'Cards, transfers, international payments and which is safest for what.' },
  { id:'financial-vocabulary', name:'Financial Vocabulary', tier:2, req:['money-basics'],
    desc:'APR, compounding, liquidity, yield — the words that hide the actual terms.' },
  { id:'money-psychology', name:'Your Money Psychology', tier:3, req:['self-awareness','money-basics'],
    desc:'Know the scripts you inherited about money and where they cost you.' },
  { id:'talking-about-money', name:'Talking About Money', tier:3, req:['money-psychology','assertive'],
    desc:'Discuss salary, splitting bills and lending with friends and family, out loud.' },
]);

addSkills({ cat: 'money', group: 'Budgeting & Spending' }, [
  { id:'expense-tracking', name:'Expense Tracking', tier:2, req:['money-basics'],
    desc:'Know where the money actually went last month, to the category.' },
  { id:'budgeting', name:'Budgeting', tier:2, req:['money-basics'],
    desc:'Run a monthly budget with categories, buffers and honest review.' },
  { id:'frugality', name:'Frugality', tier:3, req:['budgeting','price-awareness'],
    desc:'Cut cost without cutting quality of life, on the categories that actually matter.' },
  { id:'comparison-shopping', name:'Comparison Shopping', tier:2, req:['price-awareness','web-search'],
    desc:'Compare total cost of ownership, not sticker price, and switch providers annually.' },
  { id:'negotiating-price', name:'Negotiating a Price', tier:3, req:['comparison-shopping','asking'],
    desc:'Ask for a discount, a retention deal or a fee waiver as routine practice.' },
  { id:'subscription-audit', name:'Auditing Subscriptions', tier:2, req:['expense-tracking'],
    desc:'Find and kill the recurring charges you forgot you agreed to.' },
  { id:'big-purchase', name:'Making a Big Purchase', tier:3, req:['comparison-shopping','decision-making'],
    desc:'Research, sleep on it, buy once, and ignore the finance offer at the till.' },
  { id:'consumer-defence', name:'Resisting Marketing', tier:3, req:['misinformation','money-psychology'],
    desc:'Recognise scarcity, anchoring and dark patterns while they are being used on you.' },
]);

addSkills({ cat: 'money', group: 'Credit & Debt' }, [
  { id:'credit-basics', name:'Credit & Credit Scores', tier:2, req:['bank-account','financial-vocabulary'],
    desc:'How scoring works, what damages it, and how to check yours for free.' },
  { id:'credit-cards', name:'Using Credit Cards Well', tier:3, req:['credit-basics','budgeting'],
    desc:'Full repayment, protection on purchases, and never treating a limit as income.' },
  { id:'loans', name:'Loans & Borrowing', tier:3, req:['credit-basics','financial-vocabulary'],
    desc:'Compare true cost across terms, and know when borrowing is rational.' },
  { id:'debt-management', name:'Getting Out of Debt', tier:4, req:['loans','budgeting','discipline'],
    desc:'Prioritise by rate, consolidate carefully, and negotiate with creditors.' },
  { id:'debt-crisis', name:'Handling a Debt Crisis', tier:5, req:['debt-management','bureaucracy','help-seeking'],
    desc:'Free advice, payment plans, statutory options — and stopping the spiral early.' },
  { id:'guaranteeing', name:'Lending & Guaranteeing', tier:4, req:['loans','talking-about-money'],
    desc:'The rules for lending to family and co-signing without losing the money or the person.' },
]);

addSkills({ cat: 'money', group: 'Saving & Protection' }, [
  { id:'saving', name:'Saving & Banking', tier:3, req:['budgeting'],
    desc:'Emergency fund, accounts, credit and interest working in your favour.' },
  { id:'emergency-fund', name:'Building an Emergency Fund', tier:3, req:['budgeting'],
    desc:'Three to six months of costs, liquid, boring, and not touched for anything else.' },
  { id:'sinking-funds', name:'Saving for Known Costs', tier:3, req:['budgeting','expense-tracking'],
    desc:'Car, boiler, Christmas — save monthly for the annual things that always surprise people.' },
  { id:'insurance', name:'Insurance', tier:3, req:['financial-vocabulary','risk-assessment'],
    desc:'Insure what would ruin you, self-insure the rest, and read the exclusions.' },
  { id:'life-insurance', name:'Life & Income Protection', tier:4, req:['insurance','wills'],
    desc:'Cover the people who depend on your income for as long as they depend on it.' },
  { id:'fraud-defence', name:'Fraud & Scam Defence', tier:3, req:['digital-safety','consumer-defence'],
    desc:'Recognise the common scripts, verify independently, and know how to report and recover.' },
  { id:'financial-admin', name:'Financial Admin', tier:3, req:['record-keeping','budgeting'],
    desc:'Statements, receipts, deadlines and a yearly review that takes an afternoon.' },
]);

addSkills({ cat: 'money', group: 'Investing' }, [
  { id:'investing', name:'Investing', tier:4, req:['saving','statistics'],
    desc:'Risk, diversification, fees and horizon — investing rather than gambling.' },
  { id:'asset-classes', name:'Asset Classes', tier:4, req:['financial-vocabulary','investing'],
    desc:'Equities, bonds, cash, property and commodities, and how they behave together.' },
  { id:'index-investing', name:'Index Investing', tier:4, req:['investing'],
    desc:'Low-cost broad funds, automatic contributions, and doing nothing for decades.' },
  { id:'fees-literacy', name:'Fees & Costs', tier:4, req:['investing','estimation'],
    desc:'Compute what a one-percent charge costs over thirty years, then act on it.' },
  { id:'portfolio-construction', name:'Portfolio Construction', tier:5, req:['asset-classes','probabilistic-thinking'],
    desc:'Allocation, rebalancing and a policy you wrote down before the market fell.' },
  { id:'financial-statements', name:'Reading Financial Statements', tier:4, req:['spreadsheets','financial-vocabulary'],
    desc:'Balance sheet, P&L and cash flow — and why the third one is the honest one.' },
  { id:'company-analysis', name:'Analysing a Company', tier:5, req:['financial-statements','critical-reading'],
    desc:'Read a report, model the business and form a view you could defend.' },
  { id:'behavioural-investing', name:'Investor Behaviour', tier:5, req:['index-investing','bias-awareness'],
    desc:'Not selling in a crash — the single behaviour that determines most real returns.' },
  { id:'alternative-assets', name:'Alternative & Speculative Assets', tier:5, req:['portfolio-construction','probabilistic-thinking'],
    desc:'Crypto, startups, collectibles — sizing a bet you can afford to lose entirely.' },
]);

addSkills({ cat: 'money', group: 'Tax & Structure' }, [
  { id:'tax-basics', name:'How Tax Works', tier:3, req:['money-basics','payslip'],
    desc:'Brackets, allowances, national insurance and what your payslip is doing.' },
  { id:'taxes', name:'Taxes & Admin', tier:4, req:['budgeting','saving'],
    desc:'Filings, insurance, contracts and the paperwork of being an adult.' },
  { id:'self-assessment', name:'Filing a Return', tier:4, req:['tax-basics','record-keeping'],
    desc:'Gather, claim what you are entitled to, file on time, and keep the evidence.' },
  { id:'tax-efficiency', name:'Tax-Efficient Saving', tier:5, req:['self-assessment','investing'],
    desc:'Use the wrappers and allowances available to you, legally and deliberately.' },
  { id:'freelance-finance', name:'Freelance Finances', tier:5, req:['self-assessment','invoicing','cash-flow'],
    desc:'Set aside tax, smooth irregular income, and pay yourself a salary from chaos.' },
  { id:'benefits-system', name:'Benefits & Entitlements', tier:3, req:['bureaucracy','form-filling'],
    desc:'Find out what you or a relative are entitled to and actually claim it.' },
]);

addSkills({ cat: 'money', group: 'Housing & Big Money' }, [
  { id:'renting', name:'Renting a Home', tier:3, req:['budgeting','contracts-reading'],
    desc:'Viewings, deposits, references, inventories and getting the deposit back.' },
  { id:'mortgage', name:'Mortgages', tier:4, req:['loans','financial-vocabulary'],
    desc:'Fixes, terms, overpayments and stress-testing the payment against a rate rise.' },
  { id:'home-buying', name:'Buying a Home', tier:5, req:['mortgage','negotiating-price','contracts-reading'],
    desc:'Survey, conveyancing, chains and the total cost beyond the asking price.' },
  { id:'property-investing', name:'Property as an Investment', tier:5, req:['home-buying','portfolio-construction'],
    desc:'Yield, void periods, maintenance and whether it beats the boring alternative.' },
  { id:'pension', name:'Pensions', tier:4, req:['investing','tax-basics'],
    desc:'Contributions, employer match, consolidation and what you will actually have.' },
  { id:'retirement-planning', name:'Retirement Planning', tier:5, req:['pension','portfolio-construction','forecasting'],
    desc:'Model the drawdown, not just the pot; sequence risk, inflation and longevity.' },
  { id:'financial-independence', name:'Financial Independence', tier:5, req:['investing','taxes'],
    desc:'A funded long-horizon plan where work becomes a choice.' },
  { id:'generosity-giving', name:'Giving Money Away', tier:4, req:['budgeting','philosophy-of-life'],
    desc:'Decide how much, to whom, and on what evidence — and then actually do it.' },
  { id:'inheritance', name:'Inheritance & Passing On Wealth', tier:5, req:['wills','tax-efficiency','talking-about-money'],
    desc:'Plan the transfer, and have the conversation with everyone involved first.' },
]);

addSkills({ cat: 'money', group: 'Earning' }, [
  { id:'first-income', name:'Earning Your First Money', tier:1,
    desc:'A job, a chore or a sale — the link between effort and money made concrete.' },
  { id:'income-diversification', name:'Multiple Income Streams', tier:5, req:['freelance-finance','portfolio-career'],
    desc:'Build income that does not all stop at once when one thing goes wrong.' },
  { id:'side-income', name:'Starting a Side Income', tier:4, req:['invoicing','time-management'],
    desc:'Earn outside your job without breaching a contract or burning yourself out.' },
  { id:'passive-income-scepticism', name:'Evaluating Income Claims', tier:4, req:['fraud-defence','unit-economics'],
    desc:'Work out what a scheme really pays, net of time, risk and the people selling it.' },
]);

addSkills({ cat: 'money', group: 'Money With Others' }, [
  { id:'splitting-costs', name:'Splitting Costs Fairly', tier:2, req:['money-basics','numeracy'],
    desc:'Shared bills, trips and dinners settled without anyone quietly resenting it.' },
  { id:'financial-abuse', name:'Recognising Financial Abuse', tier:4, req:['manipulation-defence','shared-finances'],
    desc:'Control over money as a form of coercion, in a partner or a relative.' },
  { id:'teaching-money', name:'Teaching Children About Money', tier:4, req:['budgeting','explaining'],
    desc:'Pocket money, saving and letting them make small expensive mistakes early.' },
  { id:'supporting-relatives', name:'Supporting Family Financially', tier:5, req:['guaranteeing','family-boundaries','budgeting'],
    desc:'Help sustainably, with clear terms, without wrecking your own position.' },
  { id:'financial-advice', name:'Using a Financial Adviser', tier:4, req:['fees-literacy','investing'],
    desc:'Independent vs. tied, how they are paid, and what to ask before you sign.' },
]);

addSkills({ cat: 'money', group: 'Economy & Context' }, [
  { id:'inflation', name:'Understanding Inflation', tier:3, req:['financial-vocabulary','economics-literacy'],
    desc:'Real vs. nominal, and what a decade of it does to cash, wages and debt.' },
  { id:'interest-rates', name:'Interest Rates & Cycles', tier:4, req:['inflation','asset-classes'],
    desc:'Why rates move, and what that does to mortgages, savings and markets.' },
  { id:'currency', name:'Currency & Exchange', tier:4, req:['travel-money','economics-literacy'],
    desc:'Rates, spreads and hedging when you earn in one currency and spend in another.' },
  { id:'market-history', name:'Financial History', tier:5, req:['behavioural-investing','historical-context'],
    desc:'Bubbles, crashes and recoveries — the pattern that keeps repeating with new names.' },
  { id:'financial-crisis-personal', name:'Surviving a Financial Shock', tier:5, req:['emergency-fund','debt-crisis','resilience'],
    desc:'Job loss, illness or a crash met with a plan rather than by improvising.' },
]);

addSkills({ cat: 'money', group: 'Money Habits' }, [
  { id:'saving-habit', name:'Saving Something Every Month', tier:2, req:['bank-account','habits'],
    desc:'Automate a transfer on payday so saving happens before spending does.' },
  { id:'waiting-rule', name:'The Waiting Rule', tier:3, req:['money-basics','delayed-gratification'],
    desc:'Sleep on anything above a threshold you set in advance.' },
  { id:'cash-discipline', name:'Spending Deliberately', tier:2, req:['expense-tracking','money-basics'],
    desc:'Notice each purchase as a decision rather than a reflex.' },
  { id:'money-review', name:'A Monthly Money Hour', tier:3, req:['budgeting','weekly-review'],
    desc:'One hour a month on accounts, bills and next month — most problems die here.' },
  { id:'annual-money-review', name:'An Annual Financial Review', tier:4, req:['money-review','fees-literacy','insurance'],
    desc:'Rates, fees, cover and goals checked once a year against reality.' },
  { id:'net-worth', name:'Tracking Net Worth', tier:3, req:['spreadsheets','financial-admin'],
    desc:'Assets minus liabilities, monthly, as the single number that actually matters.' },
]);

addSkills({ cat: 'money', group: 'Life Stages' }, [
  { id:'student-finance', name:'Student Money', tier:3, req:['budgeting','loans'],
    desc:'Loans, term-time budgeting and the costs nobody warns first-years about.' },
  { id:'first-salary', name:'Your First Salary', tier:3, req:['payslip','budgeting'],
    desc:'Pension opt-in, tax code, and setting the habits before lifestyle expands.' },
  { id:'moving-out-costs', name:'Costing Moving Out', tier:3, req:['renting','sinking-funds'],
    desc:'Deposit, first month, furniture and bills — the real number, in advance.' },
  { id:'parental-leave-finance', name:'Money Around a Baby', tier:4, req:['budgeting','benefits-system','life-insurance'],
    desc:'Leave pay, childcare costs and one income for a while, planned before it happens.' },
  { id:'midlife-finance', name:'Midlife Financial Check', tier:5, req:['pension','net-worth','retirement-planning'],
    desc:'Are you actually on track, and what are the levers still available.' },
  { id:'later-life-finance', name:'Money in Later Life', tier:5, req:['retirement-planning','inheritance','elder-care'],
    desc:'Drawdown, care costs, scams and putting affairs in order while you can.' },
]);
