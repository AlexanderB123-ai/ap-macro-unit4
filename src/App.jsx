import { useState, useRef, useEffect } from "react";

// ─── Color Palette & Theme ───
const THEME = {
  bg: "#0a0e1a",
  card: "#111827",
  cardHover: "#1a2236",
  accent: "#22d3ee",
  accentDim: "#0e7490",
  green: "#34d399",
  red: "#f87171",
  yellow: "#fbbf24",
  orange: "#fb923c",
  purple: "#a78bfa",
  text: "#e2e8f0",
  textDim: "#94a3b8",
  border: "#1e293b",
  inputBg: "#0f172a",
};

// ─── Instructional Content Data ───
const TOPICS = [
  {
    id: "money",
    title: "Functions & Types of Money",
    icon: "💵",
    content: [
      {
        heading: "Three Functions of Money",
        body: `**Medium of Exchange** — Money is accepted as payment for goods and services. Example: Paying $5 for a coffee at Starbucks.

**Unit of Account** — Money provides a standard measure of value. Example: Comparing the price of a Honda ($30k) vs a BMW ($60k).

**Store of Value** — Money retains purchasing power over time. Example: Keeping $1,000 in a savings account for future use.`,
      },
      {
        heading: "Money Supply Measures",
        body: `**M0 (Monetary Base)** — Physical currency in circulation + bank reserves at the Fed. Not all of this is "money" in the economic sense.

**M1 (Most Liquid Money)** — Currency in circulation + checkable/demand deposits + traveler's checks. This is the narrowest definition of money.

**M2 (M1 + Near Money)** — M1 + savings deposits + money market funds + small time deposits (CDs < $100k). Near money is highly liquid but not directly spendable.`,
      },
    ],
  },
  {
    id: "banking",
    title: "Banking & Money Creation",
    icon: "🏦",
    content: [
      {
        heading: "Bank Balance Sheet",
        body: `A bank's balance sheet has two sides:

**Assets** (what the bank owns): Total Reserves, Loans, Securities
**Liabilities** (what the bank owes): Demand Deposits, Savings Deposits, Other Liabilities

**Assets − Liabilities = Owner's Equity (Net Worth)**

Reserves break down into:
• **Required Reserves** = Reserve Requirement Rate × Demand Deposits
• **Excess Reserves** = Total Reserves − Required Reserves
• Banks can only lend out their **excess reserves**`,
      },
      {
        heading: "The Money Multiplier",
        body: `**Money Multiplier = 1 / Reserve Requirement**

Example: If RR = 10%, multiplier = 1/0.10 = **10**
If RR = 20%, multiplier = 1/0.20 = **5**
If RR = 25%, multiplier = 1/0.25 = **4**
If RR = 50%, multiplier = 1/0.50 = **2**

**Key Formulas for a cash deposit:**
• Initial money created = the deposit amount
• Max loaned by single bank = Deposit × (1 − RR)
• Max money created in system = Deposit × Multiplier
• Max loans created in system = Deposit × (Multiplier − 1)
• Max deposits created in system = Max money created

**For open market operations (Fed buys/sells bonds):**
• Max money created = Purchase × Multiplier
• Max loans created = Purchase × (Multiplier − 1)

**Why less money is actually created:**
1. Banks may hold excess reserves (not lend everything)
2. People may hold cash rather than depositing it all`,
      },
    ],
  },
  {
    id: "moneymarket",
    title: "The Money Market",
    icon: "📊",
    content: [
      {
        heading: "Money Demand",
        body: `The demand for money has two components:

**Transaction Demand** — Money held for everyday purchases. Increases when GDP/income rises or price level rises.

**Asset Demand** — Money held as a safe store of wealth. Increases when interest rates fall (lower opportunity cost of holding money).

The money demand curve is **downward sloping**: at higher interest rates, the opportunity cost of holding money is higher, so people demand less money.`,
      },
      {
        heading: "Money Supply & Equilibrium",
        body: `The money supply is **perfectly inelastic (vertical)** because the central bank controls the quantity of money, regardless of the interest rate.

**Equilibrium** occurs where money demand = money supply, determining the nominal interest rate.

When the central bank **buys bonds** → MS shifts right → interest rate falls
When the **price level rises** → MD shifts right → interest rate rises

**The relationship**: money demand shows there is an **inverse** relationship between the nominal interest rate and the quantity of money demanded in the short run.`,
      },
    ],
  },
  {
    id: "limitedpolicy",
    title: "Monetary Policy (Limited Reserves)",
    icon: "🏛️",
    content: [
      {
        heading: "Limited Reserves Framework (Pre-2008 / AP Exam Traditional)",
        body: `In the **limited reserves** framework, the Fed uses three traditional tools:

**Open Market Operations (OMO)** — Buying/selling government bonds
• Buy bonds → ↑ money supply → ↓ interest rates (expansionary)
• Sell bonds → ↓ money supply → ↑ interest rates (contractionary)

**Discount Rate** — Interest rate the Fed charges banks for loans
• Lower discount rate → banks borrow more → ↑ money supply (expansionary)
• Raise discount rate → banks borrow less → ↓ money supply (contractionary)

**Reserve Requirement** — % of deposits banks must hold
• Lower RR → banks can lend more → ↑ money supply (expansionary)
• Raise RR → banks lend less → ↓ money supply (contractionary)`,
      },
      {
        heading: "The Monetary Policy Chain (Limited Reserves)",
        body: `**Expansionary Policy** (fight recession/recessionary gap):
Fed buys bonds / lowers discount rate / lowers RR
→ Money Supply ↑ → Interest Rate ↓ → Gross Investment ↑ → AD ↑
→ Price Level ↑, Real Output ↑, Unemployment ↓

**Contractionary Policy** (fight inflation/inflationary gap):
Fed sells bonds / raises discount rate / raises RR
→ Money Supply ↓ → Interest Rate ↑ → Gross Investment ↓ → AD ↓
→ Price Level ↓, Real Output ↓, Unemployment ↑`,
      },
      {
        heading: "How Open Market Operations Work in Limited Reserves",
        body: `In the limited-reserves framework, the supply curve intersects the **downward-sloping** part of the demand curve. Relatively small shifts of the supply curve move the FFR.

**To lower the FFR:** The Fed buys U.S. Treasury securities → banks receive reserves → supply curve shifts RIGHT → FFR falls.

**To raise the FFR:** The Fed sells U.S. Treasury securities → banks pay with reserves → supply curve shifts LEFT → FFR rises.

The Fed used **daily** open market operations to fine-tune the supply of reserves and keep the FFR at the FOMC's target.

The discount rate was set ABOVE the FFR target as a ceiling. The Fed typically adjusted the discount rate at the same time the FOMC changed the FFR target.`,
      },
    ],
  },
  {
    id: "amplepolicy",
    title: "Monetary Policy (Ample Reserves)",
    icon: "⚡",
    content: [
      {
        heading: "Ample Reserves Framework (Current / Post-2008)",
        body: `After the 2008 Financial Crisis, the Fed flooded the banking system with reserves through large-scale asset purchases (from ~$15 billion in 2007 to ~$2.7 trillion by 2014). Reserves became **ample**, meaning small changes in supply don't affect the federal funds rate.

**Key tools in the ample reserves framework:**

**IORB Rate (Interest on Reserve Balances)** — The PRIMARY tool. The Fed pays banks this rate for deposits at the Fed. Acts as a "reservation rate" — banks won't lend for less than they earn risk-free at the Fed. Arbitrage keeps the FFR near the IORB rate.

**ON RRP Rate (Overnight Reverse Repo)** — Supplementary tool. Sets a FLOOR for the FFR. Available to non-bank institutions (money market funds, government-sponsored enterprises). Works like a reservation rate for these institutions.

**Discount Rate** — Sets a CEILING for the FFR. Banks won't borrow at a higher rate than the discount window offers.

**Open Market Operations** — Now used mainly to ensure reserves remain ample, NOT to fine-tune the FFR daily.`,
      },
      {
        heading: "How the Ample Reserves Graph Works",
        body: `The supply curve intersects demand on the **flat portion** of the demand curve. This means small shifts in supply have NO effect on the FFR.

**To implement expansionary policy:** Fed LOWERS its administered rates (IORB, ON RRP, discount rate) → the flat portion of demand shifts DOWN → FFR falls → lower market interest rates → more spending → AD increases.

**To implement contractionary policy:** Fed RAISES its administered rates → flat portion of demand shifts UP → FFR rises → higher market interest rates → less spending → AD decreases.

**Key difference from limited reserves:** The Fed shifts the DEMAND curve endpoints (by changing administered rates), NOT the supply curve.`,
      },
      {
        heading: "Arbitrage and Reservation Rates",
        body: `**Reservation Rate:** The IORB rate is the lowest rate banks will accept for lending. Since depositing at the Fed is risk-free, banks won't lend for less.

**Arbitrage Example:** If the FFR = 2% and IORB = 2.5%, banks borrow in the federal funds market at 2% and deposit at the Fed earning 2.5%, pocketing the 0.5% difference. This borrowing pushes the FFR up toward the IORB rate.

**ON RRP works similarly** for non-bank institutions. They won't lend below the ON RRP rate because they can deposit at the Fed and earn that rate risk-free.

This is why the IORB rate effectively **steers** the FFR — arbitrage ensures market rates stay near the administered rates.`,
      },
    ],
  },
  {
    id: "adas",
    title: "AD-AS Model Review",
    icon: "📈",
    content: [
      {
        heading: "Why AD Slopes Downward",
        body: `Three effects explain the inverse relationship between price level and real GDP demanded:

**1. Wealth Effect (Real Balances):** Higher prices → your money buys less → you spend less. Lower prices → your money buys more → you spend more.

**2. Interest Rate Effect:** Higher prices → people save less / need more money → interest rates rise → investment falls → less spending. Vice versa.

**3. Net Export Effect:** Higher US prices → US goods are more expensive for foreigners (↓ exports) and foreign goods are relatively cheaper (↑ imports) → net exports fall → less spending.`,
      },
      {
        heading: "AD Shifters (C + I + G + NX)",
        body: `AD shifts RIGHT (increases) when any component of GDP increases:
• **C:** ↑ consumer confidence, ↑ disposable income, ↑ transfer payments
• **I:** ↑ business confidence, ↓ interest rates, ↑ expected returns
• **G:** ↑ government spending on goods/services (roads, bridges, military)
• **NX:** ↑ exports (foreign economic boom), ↓ imports

AD shifts LEFT (decreases) with the opposite:
• ↑ taxes (reduces C), ↓ business confidence (reduces I), ↓ government spending (reduces G), consumers buy more foreign goods (reduces NX)

**Movement along AD** (NOT a shift): caused by changes in the price level (inflation/deflation). The GDP Deflator changing means movement along the curve, not a shift.`,
      },
      {
        heading: "SRAS and LRAS Shifters",
        body: `**SRAS shifts RIGHT** (increases) when production costs fall:
• ↓ energy prices, ↓ wages, ↓ business taxes, ↑ worker productivity, ↓ expected inflation

**SRAS shifts LEFT** (decreases) when production costs rise:
• ↑ energy prices, ↑ wages, ↑ business taxes, ↑ expected inflation

**Movement along SRAS:** caused by price level changes (CPI/inflation changes)

**LRAS shifts RIGHT:** ↑ technology, ↑ human capital (job training), ↑ labor force, ↑ natural resources, ↑ physical capital
**LRAS shifts LEFT:** depleted natural resources, shrinking labor force (retirements), destruction of capital

**When Real GDP increases:** Real income ↑, Employment ↑, Unemployment ↓`,
      },
      {
        heading: "Recessionary vs. Inflationary Gaps",
        body: `**Recessionary Gap:** Actual GDP < Potential GDP (Full Employment GDP). Equilibrium is to the LEFT of LRAS. Unemployment is above the natural rate. In the long run, wages fall → SRAS shifts right → economy self-corrects to full employment at a lower price level.

**Inflationary Gap:** Actual GDP > Potential GDP. Equilibrium is to the RIGHT of LRAS. Unemployment is below the natural rate. In the long run, wages rise → SRAS shifts left → economy self-corrects to full employment at a higher price level.

**Long-Run Equilibrium:** AD, SRAS, and LRAS all intersect at the same point. Economy is at full employment GDP.`,
      },
    ],
  },
];

// ─── Practice Questions ───
const QUESTIONS = [
  // === MONEY ===
  {
    id: 1,
    topic: "money",
    question: "Which of the following is included in M1 but NOT in M0?",
    options: ["Federal Reserve notes", "Demand deposits (checking accounts)", "Savings deposits", "Coins in circulation"],
    correct: 1,
    explanation: "M1 includes currency in circulation PLUS demand deposits (checking accounts). M0 is just the monetary base (currency + reserves). Savings deposits are in M2, not M1.",
  },
  {
    id: 17,
    topic: "money",
    question: "Which function of money is being used when you compare the price of two laptops?",
    options: ["Medium of exchange", "Unit of account", "Store of value", "Standard of deferred payment"],
    correct: 1,
    explanation: "When you compare prices, money is serving as a unit of account — a standard measure of value that allows you to compare the relative worth of different goods.",
  },
  {
    id: 19,
    topic: "money",
    question: "A person puts $5,000 under their mattress for a rainy day. Which function of money does this BEST illustrate?",
    options: ["Medium of exchange", "Unit of account", "Store of value", "Measure of liquidity"],
    correct: 2,
    explanation: "Holding money for future use demonstrates money as a store of value — it retains purchasing power over time so you can spend it later.",
  },
  {
    id: 20,
    topic: "money",
    question: "Which of the following is included in M2 but NOT in M1?",
    options: ["Demand deposits", "Currency in circulation", "Savings deposits and money market funds", "Traveler's checks"],
    correct: 2,
    explanation: "M2 = M1 + near money. Near money includes savings deposits, money market funds, and small time deposits (CDs < $100k). These are highly liquid but not directly spendable.",
  },
  {
    id: 21,
    topic: "money",
    question: "Why is a $20 bill considered money but a $20 gift card to Target is not?",
    options: [
      "The gift card has no store of value",
      "The $20 bill is backed by gold",
      "The $20 bill is universally accepted as payment; the gift card is not",
      "Gift cards cannot be used as a unit of account",
    ],
    correct: 2,
    explanation: "Money must serve as a medium of exchange that is universally accepted. A gift card is only accepted at specific stores, so it fails the medium of exchange function for the general economy.",
  },

  // === BANKING ===
  {
    id: 2,
    topic: "banking",
    question: "A bank has $500,000 in demand deposits and a 10% reserve requirement. Total reserves are $80,000. What are the bank's excess reserves?",
    options: ["$50,000", "$30,000", "$80,000", "$20,000"],
    correct: 1,
    explanation: "Required reserves = 10% × $500,000 = $50,000. Excess reserves = Total reserves − Required reserves = $80,000 − $50,000 = $30,000.",
  },
  {
    id: 3,
    topic: "banking",
    question: "If the reserve requirement is 20% and someone deposits $1,000 in cash, what is the maximum amount of NEW money that can be created in the entire banking system?",
    options: ["$1,000", "$4,000", "$5,000", "$800"],
    correct: 2,
    explanation: "Money multiplier = 1/0.20 = 5. Maximum money created = $1,000 × 5 = $5,000. This includes the original deposit.",
  },
  {
    id: 4,
    topic: "banking",
    question: "If the reserve requirement is 20% and someone deposits $1,000, what is the maximum amount of NEW LOANS created in the entire banking system?",
    options: ["$5,000", "$4,000", "$800", "$1,000"],
    correct: 1,
    explanation: "Max loans = Deposit × (Multiplier − 1) = $1,000 × (5 − 1) = $4,000. The original deposit isn't a loan, so we subtract it.",
  },
  {
    id: 14,
    topic: "banking",
    question: "Chase Bank's balance sheet: Reserves $9,000, Loans $1,000, Securities $5,000, Demand Deposits $10,000, Other Deposits $3,000, Owner's Equity $2,000. With a 10% reserve requirement, what are the required reserves and excess reserves?",
    options: [
      "RR = $1,000, ER = $8,000",
      "RR = $1,300, ER = $7,700",
      "RR = $900, ER = $8,100",
      "RR = $1,500, ER = $7,500",
    ],
    correct: 0,
    explanation: "Required Reserves = 10% × Demand Deposits = 10% × $10,000 = $1,000. Excess Reserves = Total Reserves − Required Reserves = $9,000 − $1,000 = $8,000. Note: only demand deposits factor into required reserves.",
  },
  {
    id: 16,
    topic: "banking",
    question: "If the Fed purchases $10 million in government securities on the open market and the reserve requirement is 10%, what is the maximum amount of money created in the banking system?",
    options: ["$10 million", "$90 million", "$100 million", "$110 million"],
    correct: 2,
    explanation: "Money multiplier = 1/0.10 = 10. Maximum money created = $10 million × 10 = $100 million.",
  },
  {
    id: 22,
    topic: "banking",
    question: "If a Chase Bank customer deposits $4,000 into their checking account (10% reserve requirement, starting reserves $9,000), how do required reserves change?",
    options: [
      "Required reserves increase by $4,000",
      "Required reserves increase by $400",
      "Required reserves decrease by $400",
      "Required reserves stay the same",
    ],
    correct: 1,
    explanation: "A $4,000 deposit increases demand deposits by $4,000. Required reserves = RR × Demand Deposits. The increase in required reserves = 10% × $4,000 = $400.",
  },
  {
    id: 23,
    topic: "banking",
    question: "Why does the actual amount of money created typically fall short of what the money multiplier predicts?",
    options: [
      "The Fed limits how much banks can lend",
      "Banks hold excess reserves and people hold cash instead of depositing it",
      "The money multiplier formula is incorrect",
      "Banks charge interest that reduces the money supply",
    ],
    correct: 1,
    explanation: "Two reasons: (1) Banks may choose to hold excess reserves rather than lending everything out. (2) People may hold cash rather than depositing all of it, which prevents that cash from being multiplied through the banking system.",
  },
  {
    id: 24,
    topic: "banking",
    question: "On a bank's balance sheet, what is the relationship between assets and liabilities?",
    options: [
      "Assets always equal liabilities",
      "Assets minus liabilities equals owner's equity (net worth)",
      "Liabilities minus assets equals reserves",
      "Assets plus liabilities equals total deposits",
    ],
    correct: 1,
    explanation: "The fundamental accounting equation: Assets − Liabilities = Owner's Equity (Net Worth). Assets = what the bank owns (reserves, loans, securities). Liabilities = what the bank owes (deposits).",
  },

  // === MONEY MARKET ===
  {
    id: 5,
    topic: "moneymarket",
    question: "The money supply curve is vertical because:",
    options: [
      "Banks choose how much to lend",
      "The central bank controls the quantity of money regardless of the interest rate",
      "Money demand is always constant",
      "Interest rates are set by Congress",
    ],
    correct: 1,
    explanation: "The money supply is perfectly inelastic (vertical) because the central bank determines the total quantity of money in the economy — it doesn't change based on the interest rate.",
  },
  {
    id: 6,
    topic: "moneymarket",
    question: "If the central bank purchases bonds on the open market, what happens to the nominal interest rate in the money market?",
    options: ["It increases", "It decreases", "It stays the same", "It becomes indeterminate"],
    correct: 1,
    explanation: "Buying bonds increases the money supply (MS shifts right). With more money available, the equilibrium interest rate falls.",
  },
  {
    id: 18,
    topic: "moneymarket",
    question: "An increase in the price level will cause what change in the money market?",
    options: [
      "Money supply shifts right, interest rate falls",
      "Money demand shifts right, interest rate rises",
      "Money demand shifts left, interest rate falls",
      "Money supply shifts left, interest rate rises",
    ],
    correct: 1,
    explanation: "A higher price level means people need more money for transactions (transaction demand increases). Money demand shifts right, and the equilibrium interest rate rises.",
  },
  {
    id: 25,
    topic: "moneymarket",
    question: "Transaction demand for money increases when:",
    options: [
      "Interest rates rise",
      "GDP or real income increases",
      "The money supply increases",
      "Bond prices rise",
    ],
    correct: 1,
    explanation: "Transaction demand is money held for everyday purchases. When GDP/income rises, people engage in more transactions and need more money for purchases.",
  },
  {
    id: 26,
    topic: "moneymarket",
    question: "If interest rates are ABOVE the equilibrium in the money market, what happens?",
    options: [
      "There is a surplus of money; people buy bonds, driving interest rates down",
      "There is a shortage of money; people sell bonds, driving interest rates up",
      "The Fed must intervene to restore equilibrium",
      "Money demand shifts left to restore equilibrium",
    ],
    correct: 0,
    explanation: "Above equilibrium, the quantity of money supplied exceeds quantity demanded (surplus). People use excess money to buy bonds. Higher bond demand drives bond prices up, which drives interest rates down toward equilibrium.",
  },

  // === LIMITED RESERVES POLICY ===
  {
    id: 7,
    topic: "limitedpolicy",
    question: "The central bank raises the reserve requirement. In order, what happens to the money supply, interest rate, investment, and AD?",
    options: [
      "↑ MS, ↓ IR, ↑ Ig, ↑ AD",
      "↓ MS, ↑ IR, ↓ Ig, ↓ AD",
      "↓ MS, ↓ IR, ↑ Ig, ↑ AD",
      "↑ MS, ↑ IR, ↓ Ig, ↓ AD",
    ],
    correct: 1,
    explanation: "Raising the reserve requirement is contractionary. Banks must hold more reserves → lend less → MS decreases → IR rises → Investment falls → AD falls.",
  },
  {
    id: 8,
    topic: "limitedpolicy",
    question: "Which of the following is an example of expansionary monetary policy?",
    options: [
      "The Fed sells government securities",
      "The Fed raises the discount rate",
      "The Fed lowers the reserve requirement",
      "The Fed increases the federal funds rate target",
    ],
    correct: 2,
    explanation: "Lowering the reserve requirement allows banks to lend more, increasing the money supply. This is expansionary. Selling bonds, raising the discount rate, and raising the FFR target are all contractionary.",
  },
  {
    id: 15,
    topic: "limitedpolicy",
    question: "Expansionary monetary policy will cause which of the following in the short run?",
    options: [
      "Price level ↑, Real output ↑, Unemployment ↑",
      "Price level ↓, Real output ↑, Unemployment ↓",
      "Price level ↑, Real output ↑, Unemployment ↓",
      "Price level ↓, Real output ↓, Unemployment ↑",
    ],
    correct: 2,
    explanation: "Expansionary policy increases AD. This raises the price level, increases real output, and decreases unemployment in the short run.",
  },
  {
    id: 27,
    topic: "limitedpolicy",
    question: "In the limited reserves framework, why does the demand curve for reserves slope downward?",
    options: [
      "Banks demand fewer reserves when the Fed raises rates",
      "As the cost of borrowing (FFR) decreases, banks are willing to hold more reserves",
      "The Fed controls demand directly",
      "Banks always want the same amount of reserves",
    ],
    correct: 1,
    explanation: "The demand curve slopes down because as the federal funds rate (cost of borrowing) decreases, banks are willing to borrow more funds to increase their holdings of reserves. When borrowing is cheap, banks hold more.",
  },
  {
    id: 28,
    topic: "limitedpolicy",
    question: "The Fed lowers the discount rate. Trace the chain of effects on the money supply, interest rate, gross investment, and aggregate demand.",
    options: [
      "MS ↑, IR ↑, Ig ↓, AD ↓",
      "MS ↑, IR ↓, Ig ↑, AD ↑",
      "MS ↓, IR ↑, Ig ↓, AD ↓",
      "MS ↓, IR ↓, Ig ↑, AD ↑",
    ],
    correct: 1,
    explanation: "Lowering the discount rate is expansionary. Banks can borrow from the Fed more cheaply → they borrow more → MS increases → IR falls → businesses invest more (Ig ↑) → AD increases.",
  },
  {
    id: 29,
    topic: "limitedpolicy",
    question: "The central bank makes an open market sale of government securities. What happens to the money supply and nominal interest rate?",
    options: [
      "MS increases, IR decreases",
      "MS decreases, IR increases",
      "MS increases, IR increases",
      "MS decreases, IR decreases",
    ],
    correct: 1,
    explanation: "When the Fed SELLS bonds, buyers pay with bank reserves, removing reserves from the banking system. This decreases the money supply (MS shifts left), causing the nominal interest rate to rise.",
  },
  {
    id: 30,
    topic: "limitedpolicy",
    question: "Contractionary monetary policy will cause which of the following in the short run?",
    options: [
      "Price level ↑, Real output ↑, Unemployment ↓",
      "Price level ↑, Real output ↓, Unemployment ↑",
      "Price level ↓, Real output ↓, Unemployment ↑",
      "Price level ↓, Real output ↑, Unemployment ↓",
    ],
    correct: 2,
    explanation: "Contractionary policy decreases AD. This lowers the price level, decreases real output, and increases unemployment in the short run.",
  },

  // === AMPLE RESERVES POLICY ===
  {
    id: 9,
    topic: "amplepolicy",
    question: "In the ample reserves framework, what is the Fed's PRIMARY tool for adjusting the federal funds rate?",
    options: [
      "Open market operations",
      "The reserve requirement",
      "Interest on reserve balances (IORB) rate",
      "The discount rate",
    ],
    correct: 2,
    explanation: "In the ample reserves framework, the IORB rate is the primary tool. Banks won't lend for less than the IORB rate (reservation rate), and arbitrage keeps the FFR near the IORB rate.",
  },
  {
    id: 10,
    topic: "amplepolicy",
    question: "In the ample reserves framework, what role does the ON RRP rate play?",
    options: [
      "It sets a ceiling for the federal funds rate",
      "It sets a floor for the federal funds rate",
      "It directly determines the money supply",
      "It replaces the discount rate",
    ],
    correct: 1,
    explanation: "The ON RRP rate is a supplementary tool that sets a FLOOR for the FFR. Non-bank institutions (like money market funds) won't lend for less than the ON RRP rate. The discount rate sets the ceiling.",
  },
  {
    id: 11,
    topic: "amplepolicy",
    question: "In the ample reserves graph, when the Fed implements expansionary policy, what shifts?",
    options: [
      "The supply curve shifts right",
      "The supply curve shifts left",
      "The endpoints of the demand curve shift down",
      "The demand curve shifts right",
    ],
    correct: 2,
    explanation: "In the ample reserves framework, the Fed lowers its administered rates (IORB, ON RRP, discount rate), which shifts the flat endpoints of the demand curve DOWN. The vertical supply curve doesn't change. The FFR falls as a result.",
  },
  {
    id: 31,
    topic: "amplepolicy",
    question: "Why can't the Fed use small changes in the supply of reserves to influence the FFR in the ample reserves framework?",
    options: [
      "The Fed has lost control of reserve supply",
      "Banks no longer need reserves",
      "The supply curve intersects the flat portion of the demand curve, so small shifts don't change the FFR",
      "The discount rate prevents any FFR movement",
    ],
    correct: 2,
    explanation: "When reserves are ample, the supply curve intersects the demand curve on its flat (horizontal) portion. Small shifts of supply to the left or right along this flat region result in no change to the FFR.",
  },
  {
    id: 32,
    topic: "amplepolicy",
    question: "The IORB rate is 2.5% and the FFR drops to 2.0%. Banks will likely:",
    options: [
      "Lend more in the federal funds market to earn the higher FFR",
      "Borrow in the federal funds market at 2% and deposit at the Fed to earn 2.5%, profiting from arbitrage",
      "Move all deposits out of the Fed",
      "Stop lending entirely",
    ],
    correct: 1,
    explanation: "Banks can borrow at 2% in the federal funds market and deposit at the Fed earning 2.5%, making a risk-free 0.5% profit. This arbitrage activity increases demand for funds in the federal funds market, pushing the FFR back up toward the IORB rate.",
  },
  {
    id: 33,
    topic: "amplepolicy",
    question: "Why was the ON RRP facility created in addition to IORB?",
    options: [
      "To replace open market operations entirely",
      "Because not all important financial institutions can earn IORB, so ON RRP extends the floor to non-bank institutions",
      "To increase the money supply faster",
      "To set a ceiling for the FFR",
    ],
    correct: 1,
    explanation: "Not all institutions have reserve accounts at the Fed or can earn IORB. The ON RRP facility allows non-bank institutions (money market funds, government-sponsored enterprises) to deposit at the Fed and earn the ON RRP rate, preventing short-term rates from falling below it.",
  },
  {
    id: 34,
    topic: "amplepolicy",
    question: "How did the Financial Crisis of 2007-09 change the level of reserves in the banking system?",
    options: [
      "Reserves decreased from $2.7 trillion to $15 billion",
      "Reserves stayed roughly constant",
      "Reserves increased from about $15 billion to about $2.7 trillion through large-scale asset purchases",
      "Reserves were eliminated entirely",
    ],
    correct: 2,
    explanation: "The Fed conducted large-scale asset purchases to lower longer-term interest rates and support economic activity. These purchases increased reserves from ~$15 billion in 2007 to ~$2.7 trillion by late 2014, making reserves 'ample.'",
  },
  {
    id: 35,
    topic: "amplepolicy",
    question: "What is the current status of reserve requirements in the United States?",
    options: [
      "The reserve requirement is 10%",
      "The reserve requirement is 20%",
      "Reserve requirements have been set to zero since March 2020",
      "Reserve requirements vary by bank size",
    ],
    correct: 2,
    explanation: "As of March 26, 2020, the Board of Governors reduced reserve requirements to zero. With ample reserves, reserve requirements are not a factor in policy implementation.",
  },

  // === AD-AS MODEL ===
  {
    id: 12,
    topic: "adas",
    question: "According to the interest rate effect, a higher price level leads to:",
    options: [
      "Lower interest rates and more investment",
      "Higher interest rates and less investment",
      "No change in interest rates",
      "Lower interest rates and less investment",
    ],
    correct: 1,
    explanation: "Higher prices → people need more money for transactions → they save less → interest rates rise → businesses invest less. This is why AD slopes downward.",
  },
  {
    id: 13,
    topic: "adas",
    question: "An economy is experiencing a recessionary gap. In the long run, without government intervention, what will happen?",
    options: [
      "AD shifts right to restore full employment",
      "LRAS shifts left to match actual output",
      "Wages fall, SRAS shifts right, price level drops, output returns to Yf",
      "Nothing — the economy cannot self-correct",
    ],
    correct: 2,
    explanation: "In a recessionary gap, unemployment is high. Over time, wages fall (workers accept lower pay). This decreases production costs, shifting SRAS right. The economy returns to full employment at a lower price level.",
  },
  {
    id: 36,
    topic: "adas",
    question: "There is a decline in gross investment due to a drop in business confidence. What happens to AD?",
    options: [
      "AD shifts right (I is a component of GDP)",
      "AD shifts left (decrease in I reduces total spending)",
      "Movement down along the AD curve",
      "AD is unaffected; only SRAS changes",
    ],
    correct: 1,
    explanation: "Investment (I) is a component of aggregate demand (C + I + G + NX). A decline in business confidence reduces investment spending, shifting AD to the left.",
  },
  {
    id: 37,
    topic: "adas",
    question: "The GDP Deflator decreases. What happens in the AD-AS model?",
    options: [
      "AD shifts left",
      "AD shifts right",
      "Movement DOWN along the AD curve (price level fell, quantity demanded increased)",
      "SRAS shifts right",
    ],
    correct: 2,
    explanation: "The GDP Deflator is a measure of the price level. A decrease in the price level causes movement ALONG the AD curve (downward), not a shift. Only non-price-level factors shift AD.",
  },
  {
    id: 38,
    topic: "adas",
    question: "There is an increase in energy prices. What curve shifts and in what direction?",
    options: [
      "AD shifts left (higher costs reduce spending)",
      "SRAS shifts left (higher input costs increase production costs)",
      "SRAS shifts right (firms produce more to cover costs)",
      "LRAS shifts left (potential output falls)",
    ],
    correct: 1,
    explanation: "Energy prices are an input/production cost. Higher energy prices increase the cost of production, reducing short-run aggregate supply. SRAS shifts LEFT, causing higher prices and lower output (stagflation).",
  },
  {
    id: 39,
    topic: "adas",
    question: "The government builds more roads and bridges. What happens to AD?",
    options: [
      "AD shifts right (G increases)",
      "AD shifts left (government debt increases)",
      "Movement along AD curve",
      "Only LRAS changes",
    ],
    correct: 0,
    explanation: "Government spending on goods and services (G) is a direct component of aggregate demand. Building roads and bridges is government spending, so AD shifts RIGHT.",
  },
  {
    id: 40,
    topic: "adas",
    question: "An increase in worker productivity will shift which curve?",
    options: [
      "AD shifts right",
      "SRAS shifts right (lower per-unit production costs)",
      "SRAS shifts left",
      "Only AD shifts left",
    ],
    correct: 1,
    explanation: "Higher worker productivity means more output per worker, reducing per-unit production costs. This shifts SRAS to the RIGHT, increasing output and decreasing the price level.",
  },
  {
    id: 41,
    topic: "adas",
    question: "New technology increases labor productivity. What happens to LRAS?",
    options: [
      "LRAS shifts right (potential output increases)",
      "LRAS shifts left",
      "LRAS is unaffected; only SRAS changes",
      "LRAS shifts right only if the economy is at full employment",
    ],
    correct: 0,
    explanation: "Technology that increases labor productivity expands the economy's potential output. LRAS shifts RIGHT, meaning the full-employment level of real GDP increases.",
  },
  {
    id: 42,
    topic: "adas",
    question: "Wages rise in an economy experiencing an inflationary gap. What curve shifts and what is the result?",
    options: [
      "AD shifts left, output falls, prices fall",
      "SRAS shifts left, output falls back to Yf, price level rises",
      "SRAS shifts right, output increases beyond Yf",
      "LRAS shifts right, economy grows",
    ],
    correct: 1,
    explanation: "In an inflationary gap, low unemployment causes wages to rise. Higher wages increase production costs, shifting SRAS LEFT. This is the long-run self-correction: output returns to full employment (Yf) at a HIGHER price level.",
  },
  {
    id: 43,
    topic: "adas",
    question: "The economy is in long-run equilibrium when:",
    options: [
      "AD intersects SRAS to the left of LRAS",
      "AD intersects SRAS to the right of LRAS",
      "AD, SRAS, and LRAS all intersect at the same point",
      "The unemployment rate is zero",
    ],
    correct: 2,
    explanation: "Long-run equilibrium occurs when all three curves — AD, SRAS, and LRAS — intersect at the same point. The economy is at full employment GDP, and the actual unemployment rate equals the natural rate.",
  },
  {
    id: 44,
    topic: "adas",
    question: "There is an increase in government transfer payments (unemployment compensation, welfare). What happens to AD?",
    options: [
      "AD shifts right (consumers have more disposable income to spend)",
      "AD shifts left (government budget deficit increases)",
      "AD is unaffected — transfers are not government purchases",
      "Movement along AD curve",
    ],
    correct: 0,
    explanation: "Transfer payments increase consumers' disposable income, which increases consumption spending (C). Since C is a component of AD, aggregate demand shifts RIGHT. Note: transfers affect AD indirectly through C, unlike direct government spending (G).",
  },
  {
    id: 45,
    topic: "adas",
    question: "Major trade partners have an economic boom. What happens to US aggregate demand?",
    options: [
      "AD shifts left — foreign competition increases",
      "AD shifts right — foreign countries buy more US exports (NX increases)",
      "AD is unaffected by foreign economies",
      "Only SRAS shifts",
    ],
    correct: 1,
    explanation: "When trade partners' economies boom, their consumers and businesses have more income to spend on US goods, increasing US net exports (NX). Since NX is a component of AD (C+I+G+NX), AD shifts RIGHT.",
  },
];

// ─── Graphing Scenarios ───
const GRAPH_SCENARIOS = [
  {
    id: "mm_exp",
    title: "Money Market: Fed Buys Bonds",
    type: "moneymarket",
    instruction: "The Federal Reserve purchases government bonds on the open market. Show what shifts and the new equilibrium.",
    correctShift: "ms_right",
    explanation: "When the Fed buys bonds, it pays with new reserves, increasing the money supply. MS shifts RIGHT. The new equilibrium has a LOWER interest rate and HIGHER quantity of money.",
  },
  {
    id: "mm_con",
    title: "Money Market: Fed Sells Bonds",
    type: "moneymarket",
    instruction: "The Federal Reserve sells government securities on the open market. Show what shifts and the new equilibrium.",
    correctShift: "ms_left",
    explanation: "When the Fed sells bonds, banks pay with reserves, decreasing the money supply. MS shifts LEFT. The new equilibrium has a HIGHER interest rate and LOWER quantity of money.",
  },
  {
    id: "mm_pl",
    title: "Money Market: Price Level Rises",
    type: "moneymarket",
    instruction: "The overall price level in the economy increases. Show what shifts and the new equilibrium.",
    correctShift: "md_right",
    explanation: "A higher price level increases transaction demand for money. MD shifts RIGHT. The new equilibrium has a HIGHER interest rate at the same quantity of money (since MS doesn't change).",
  },
  {
    id: "mm_gdp",
    title: "Money Market: GDP Increases",
    type: "moneymarket",
    instruction: "Real GDP and national income increase significantly. Show what shifts and the new equilibrium.",
    correctShift: "md_right",
    explanation: "Higher GDP means more economic transactions, increasing transaction demand for money. MD shifts RIGHT. The new equilibrium has a HIGHER interest rate. The money supply doesn't change because only the central bank controls it.",
  },
  {
    id: "adas_exp",
    title: "AD-AS: Expansionary Monetary Policy",
    type: "adas",
    instruction: "The central bank implements expansionary monetary policy (buys bonds/lowers rates). Show the short-run effect on the AD-AS model.",
    correctShift: "ad_right",
    explanation: "Expansionary monetary policy lowers interest rates, increasing investment and consumption. AD shifts RIGHT. In the short run: price level rises, real GDP increases, and unemployment falls.",
  },
  {
    id: "adas_con",
    title: "AD-AS: Contractionary Monetary Policy",
    type: "adas",
    instruction: "The central bank implements contractionary monetary policy (sells bonds/raises rates). Show the short-run effect on the AD-AS model.",
    correctShift: "ad_left",
    explanation: "Contractionary monetary policy raises interest rates, decreasing investment and consumption. AD shifts LEFT. In the short run: price level falls, real GDP decreases, and unemployment rises.",
  },
  {
    id: "adas_energy",
    title: "AD-AS: Increase in Energy Prices",
    type: "adas",
    instruction: "Oil prices spike dramatically. Show the effect on the AD-AS model.",
    correctShift: "sras_left",
    explanation: "Higher energy prices increase production costs for businesses. SRAS shifts LEFT. This is a supply shock (stagflation): price level RISES while real GDP FALLS and unemployment RISES.",
  },
  {
    id: "adas_rec_lr",
    title: "AD-AS: Recessionary Gap Long-Run Correction",
    type: "adas_gap",
    instruction: "The economy is in a recessionary gap (AD intersects SRAS to the LEFT of LRAS). Show how the economy self-corrects in the long run.",
    correctShift: "sras_right",
    explanation: "In a recessionary gap, unemployment is high. Over time, wages fall, reducing production costs. SRAS shifts RIGHT until it intersects AD at the full employment level (LRAS). The price level falls.",
  },
  {
    id: "adas_inf_lr",
    title: "AD-AS: Inflationary Gap Long-Run Correction",
    type: "adas_gap",
    instruction: "The economy is in an inflationary gap (AD intersects SRAS to the RIGHT of LRAS). Show how the economy self-corrects in the long run.",
    correctShift: "sras_left",
    explanation: "In an inflationary gap, unemployment is below the natural rate. Workers demand higher wages, increasing production costs. SRAS shifts LEFT until output returns to full employment (LRAS). The price level rises.",
  },
];

// ─── Subcomponents ───

function MarkdownLite({ text }) {
  const lines = text.split("\n");
  return (
    <div style={{ lineHeight: 1.7 }}>
      {lines.map((line, i) => {
        let processed = line
          .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#22d3ee">$1</strong>')
          .replace(/\*(.+?)\*/g, "<em>$1</em>")
          .replace(/↑/g, '<span style="color:#34d399">↑</span>')
          .replace(/↓/g, '<span style="color:#f87171">↓</span>');
        if (line.startsWith("•")) {
          return (
            <div key={i} style={{ paddingLeft: 16, margin: "2px 0" }} dangerouslySetInnerHTML={{ __html: processed }} />
          );
        }
        return <div key={i} style={{ margin: line === "" ? "8px 0" : "2px 0" }} dangerouslySetInnerHTML={{ __html: processed }} />;
      })}
    </div>
  );
}

// ─── Topic Card ───
function TopicSection({ topic }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        background: THEME.card,
        border: `1px solid ${THEME.border}`,
        borderRadius: 12,
        marginBottom: 16,
        overflow: "hidden",
        transition: "border-color 0.2s",
        borderColor: open ? THEME.accentDim : THEME.border,
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "18px 20px",
          background: "none",
          border: "none",
          color: THEME.text,
          cursor: "pointer",
          fontSize: 17,
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 600,
          textAlign: "left",
        }}
      >
        <span style={{ fontSize: 26 }}>{topic.icon}</span>
        <span style={{ flex: 1 }}>{topic.title}</span>
        <span
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s",
            fontSize: 18,
            color: THEME.accent,
          }}
        >
          ▼
        </span>
      </button>
      {open && (
        <div style={{ padding: "0 20px 20px" }}>
          {topic.content.map((section, i) => (
            <div key={i} style={{ marginBottom: 20 }}>
              <h3
                style={{
                  color: THEME.accent,
                  fontSize: 15,
                  fontWeight: 700,
                  marginBottom: 8,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {section.heading}
              </h3>
              <MarkdownLite text={section.body} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Quiz Component ───
function QuizSection() {
  const [filter, setFilter] = useState("all");
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);

  const filtered = filter === "all" ? QUESTIONS : QUESTIONS.filter((q) => q.topic === filter);
  const q = filtered[current];

  const handleSelect = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowExplanation(true);
    setAnswered((a) => a + 1);
    if (idx === q.correct) setScore((s) => s + 1);
  };

  const next = () => {
    setCurrent((c) => (c + 1) % filtered.length);
    setSelected(null);
    setShowExplanation(false);
  };

  const reset = () => {
    setCurrent(0);
    setSelected(null);
    setShowExplanation(false);
    setScore(0);
    setAnswered(0);
  };

  const topics = [
    { val: "all", label: "All Topics" },
    { val: "money", label: "Money" },
    { val: "banking", label: "Banking" },
    { val: "moneymarket", label: "Money Market" },
    { val: "limitedpolicy", label: "Limited Reserves" },
    { val: "amplepolicy", label: "Ample Reserves" },
    { val: "adas", label: "AD-AS" },
  ];

  return (
    <div>
      {/* Score bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          padding: "10px 16px",
          background: THEME.inputBg,
          borderRadius: 10,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 14,
        }}
      >
        <span>
          Score: <span style={{ color: THEME.green }}>{score}</span>/{answered}
          {answered > 0 && (
            <span style={{ color: THEME.textDim, marginLeft: 8 }}>
              ({Math.round((score / answered) * 100)}%)
            </span>
          )}
        </span>
        <span style={{ color: THEME.textDim }}>
          Question {current + 1} of {filtered.length}
        </span>
        <button
          onClick={reset}
          style={{
            background: THEME.border,
            border: "none",
            color: THEME.textDim,
            padding: "4px 12px",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 12,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          Reset
        </button>
      </div>

      {/* Topic filter */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
        {topics.map((t) => (
          <button
            key={t.val}
            onClick={() => {
              setFilter(t.val);
              setCurrent(0);
              setSelected(null);
              setShowExplanation(false);
            }}
            style={{
              padding: "6px 14px",
              borderRadius: 20,
              border: `1px solid ${filter === t.val ? THEME.accent : THEME.border}`,
              background: filter === t.val ? THEME.accentDim + "33" : "transparent",
              color: filter === t.val ? THEME.accent : THEME.textDim,
              cursor: "pointer",
              fontSize: 13,
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              transition: "all 0.2s",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Question */}
      {q && (
        <div
          style={{
            background: THEME.card,
            border: `1px solid ${THEME.border}`,
            borderRadius: 12,
            padding: 24,
          }}
        >
          <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 18, lineHeight: 1.5 }}>{q.question}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {q.options.map((opt, idx) => {
              let bg = "transparent";
              let borderColor = THEME.border;
              if (selected !== null) {
                if (idx === q.correct) {
                  bg = THEME.green + "22";
                  borderColor = THEME.green;
                } else if (idx === selected && idx !== q.correct) {
                  bg = THEME.red + "22";
                  borderColor = THEME.red;
                }
              }
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 16px",
                    background: bg,
                    border: `1px solid ${borderColor}`,
                    borderRadius: 10,
                    color: THEME.text,
                    cursor: selected !== null ? "default" : "pointer",
                    fontSize: 14,
                    fontFamily: "'DM Sans', sans-serif",
                    textAlign: "left",
                    transition: "all 0.2s",
                  }}
                >
                  <span
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      border: `2px solid ${borderColor === THEME.border ? THEME.textDim : borderColor}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      fontWeight: 700,
                      flexShrink: 0,
                      color: borderColor === THEME.border ? THEME.textDim : borderColor,
                    }}
                  >
                    {"ABCD"[idx]}
                  </span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>
          {showExplanation && (
            <div
              style={{
                marginTop: 16,
                padding: 16,
                background: selected === q.correct ? THEME.green + "11" : THEME.red + "11",
                borderRadius: 10,
                borderLeft: `4px solid ${selected === q.correct ? THEME.green : THEME.red}`,
              }}
            >
              <p style={{ fontWeight: 700, marginBottom: 6, color: selected === q.correct ? THEME.green : THEME.red }}>
                {selected === q.correct ? "Correct!" : "Incorrect"}
              </p>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: THEME.textDim }}>{q.explanation}</p>
            </div>
          )}
          {selected !== null && (
            <button
              onClick={next}
              style={{
                marginTop: 16,
                padding: "10px 28px",
                background: THEME.accent,
                border: "none",
                borderRadius: 8,
                color: THEME.bg,
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Next Question →
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Graph Practice Component ───
function GraphPractice() {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const scenario = GRAPH_SCENARIOS[scenarioIdx];

  const shiftOptions = {
    moneymarket: [
      { val: "ms_right", label: "Money Supply shifts RIGHT" },
      { val: "ms_left", label: "Money Supply shifts LEFT" },
      { val: "md_right", label: "Money Demand shifts RIGHT" },
      { val: "md_left", label: "Money Demand shifts LEFT" },
    ],
    adas: [
      { val: "ad_right", label: "AD shifts RIGHT" },
      { val: "ad_left", label: "AD shifts LEFT" },
      { val: "sras_right", label: "SRAS shifts RIGHT" },
      { val: "sras_left", label: "SRAS shifts LEFT" },
    ],
    adas_gap: [
      { val: "ad_right", label: "AD shifts RIGHT" },
      { val: "ad_left", label: "AD shifts LEFT" },
      { val: "sras_right", label: "SRAS shifts RIGHT" },
      { val: "sras_left", label: "SRAS shifts LEFT" },
    ],
  };

  const options = shiftOptions[scenario.type] || [];

  const check = () => setShowAnswer(true);
  const next = () => {
    setScenarioIdx((i) => (i + 1) % GRAPH_SCENARIOS.length);
    setUserAnswer(null);
    setShowAnswer(false);
  };

  // Draw mini SVG graph
  const GraphSVG = ({ type, shift, showShift }) => {
    if (type === "moneymarket") {
      return (
        <svg viewBox="0 0 300 240" style={{ width: "100%", maxWidth: 360 }}>
          <line x1="50" y1="20" x2="50" y2="200" stroke={THEME.textDim} strokeWidth="2" />
          <line x1="50" y1="200" x2="280" y2="200" stroke={THEME.textDim} strokeWidth="2" />
          <text x="10" y="110" fill={THEME.textDim} fontSize="11" transform="rotate(-90,18,110)" fontFamily="JetBrains Mono" textAnchor="middle">Nominal IR</text>
          <text x="165" y="225" fill={THEME.textDim} fontSize="11" fontFamily="JetBrains Mono" textAnchor="middle">Quantity of Money</text>
          <line x1="160" y1="30" x2="160" y2="190" stroke={THEME.accent} strokeWidth="2.5" />
          <text x="163" y="25" fill={THEME.accent} fontSize="11" fontFamily="JetBrains Mono" fontWeight="700">MS</text>
          <line x1="70" y1="50" x2="250" y2="180" stroke={THEME.yellow} strokeWidth="2.5" />
          <text x="252" y="185" fill={THEME.yellow} fontSize="11" fontFamily="JetBrains Mono" fontWeight="700">MD</text>
          <circle cx="160" cy="118" r="5" fill={THEME.green} />
          <line x1="50" y1="118" x2="157" y2="118" stroke={THEME.green} strokeWidth="1" strokeDasharray="4" />
          <text x="35" y="121" fill={THEME.green} fontSize="9" fontFamily="JetBrains Mono">i1</text>
          {showShift && shift === "ms_right" && (
            <>
              <line x1="200" y1="30" x2="200" y2="190" stroke={THEME.accent} strokeWidth="2" strokeDasharray="6" />
              <text x="203" y="25" fill={THEME.accent} fontSize="10" fontFamily="JetBrains Mono">MS'</text>
              <circle cx="200" cy="140" r="5" fill={THEME.orange} />
              <line x1="50" y1="140" x2="197" y2="140" stroke={THEME.orange} strokeWidth="1" strokeDasharray="4" />
              <text x="35" y="143" fill={THEME.orange} fontSize="9" fontFamily="JetBrains Mono">i2</text>
              <text x="100" y="15" fill={THEME.green} fontSize="10" fontFamily="JetBrains Mono">MS shifts right, IR falls</text>
            </>
          )}
          {showShift && shift === "ms_left" && (
            <>
              <line x1="120" y1="30" x2="120" y2="190" stroke={THEME.accent} strokeWidth="2" strokeDasharray="6" />
              <text x="123" y="25" fill={THEME.accent} fontSize="10" fontFamily="JetBrains Mono">MS'</text>
              <circle cx="120" cy="96" r="5" fill={THEME.orange} />
              <line x1="50" y1="96" x2="117" y2="96" stroke={THEME.orange} strokeWidth="1" strokeDasharray="4" />
              <text x="35" y="99" fill={THEME.orange} fontSize="9" fontFamily="JetBrains Mono">i2</text>
              <text x="90" y="15" fill={THEME.red} fontSize="10" fontFamily="JetBrains Mono">MS shifts left, IR rises</text>
            </>
          )}
          {showShift && shift === "md_right" && (
            <>
              <line x1="100" y1="50" x2="270" y2="170" stroke={THEME.yellow} strokeWidth="2" strokeDasharray="6" />
              <text x="272" y="175" fill={THEME.yellow} fontSize="10" fontFamily="JetBrains Mono">MD'</text>
              <circle cx="160" cy="100" r="5" fill={THEME.orange} />
              <line x1="50" y1="100" x2="157" y2="100" stroke={THEME.orange} strokeWidth="1" strokeDasharray="4" />
              <text x="35" y="103" fill={THEME.orange} fontSize="9" fontFamily="JetBrains Mono">i2</text>
              <text x="80" y="15" fill={THEME.red} fontSize="10" fontFamily="JetBrains Mono">MD shifts right, IR rises</text>
            </>
          )}
          {showShift && shift === "md_left" && (
            <>
              <line x1="55" y1="60" x2="220" y2="180" stroke={THEME.yellow} strokeWidth="2" strokeDasharray="6" />
              <text x="222" y="185" fill={THEME.yellow} fontSize="10" fontFamily="JetBrains Mono">MD'</text>
              <circle cx="160" cy="135" r="5" fill={THEME.orange} />
              <line x1="50" y1="135" x2="157" y2="135" stroke={THEME.orange} strokeWidth="1" strokeDasharray="4" />
              <text x="35" y="138" fill={THEME.orange} fontSize="9" fontFamily="JetBrains Mono">i2</text>
              <text x="80" y="15" fill={THEME.green} fontSize="10" fontFamily="JetBrains Mono">MD shifts left, IR falls</text>
            </>
          )}
        </svg>
      );
    }
    // AD-AS graph
    return (
      <svg viewBox="0 0 320 260" style={{ width: "100%", maxWidth: 380 }}>
        <line x1="50" y1="20" x2="50" y2="220" stroke={THEME.textDim} strokeWidth="2" />
        <line x1="50" y1="220" x2="300" y2="220" stroke={THEME.textDim} strokeWidth="2" />
        <text x="10" y="120" fill={THEME.textDim} fontSize="11" transform="rotate(-90,18,120)" fontFamily="JetBrains Mono" textAnchor="middle">Price Level</text>
        <text x="175" y="248" fill={THEME.textDim} fontSize="11" fontFamily="JetBrains Mono" textAnchor="middle">Real GDP</text>
        <line x1="180" y1="30" x2="180" y2="210" stroke={THEME.purple} strokeWidth="2.5" />
        <text x="183" y="25" fill={THEME.purple} fontSize="11" fontFamily="JetBrains Mono" fontWeight="700">LRAS</text>
        <line x1="70" y1="180" x2="270" y2="50" stroke={THEME.yellow} strokeWidth="2.5" />
        <text x="272" y="50" fill={THEME.yellow} fontSize="11" fontFamily="JetBrains Mono" fontWeight="700">SRAS</text>
        <line x1="70" y1="40" x2="260" y2="190" stroke={THEME.accent} strokeWidth="2.5" />
        <text x="262" y="195" fill={THEME.accent} fontSize="11" fontFamily="JetBrains Mono" fontWeight="700">AD</text>
        <circle cx="170" cy="112" r="5" fill={THEME.green} />
        {showShift && shift === "ad_right" && (
          <>
            <line x1="100" y1="40" x2="290" y2="190" stroke={THEME.accent} strokeWidth="2" strokeDasharray="6" />
            <text x="290" y="195" fill={THEME.accent} fontSize="10" fontFamily="JetBrains Mono">AD'</text>
            <circle cx="195" cy="100" r="5" fill={THEME.orange} />
            <text x="90" y="15" fill={THEME.green} fontSize="10" fontFamily="JetBrains Mono">AD right: PL up, GDP up, U down</text>
          </>
        )}
        {showShift && shift === "ad_left" && (
          <>
            <line x1="55" y1="50" x2="230" y2="190" stroke={THEME.accent} strokeWidth="2" strokeDasharray="6" />
            <text x="232" y="195" fill={THEME.accent} fontSize="10" fontFamily="JetBrains Mono">AD'</text>
            <circle cx="145" cy="125" r="5" fill={THEME.orange} />
            <text x="80" y="15" fill={THEME.red} fontSize="10" fontFamily="JetBrains Mono">AD left: PL down, GDP down, U up</text>
          </>
        )}
        {showShift && shift === "sras_right" && (
          <>
            <line x1="100" y1="185" x2="290" y2="55" stroke={THEME.yellow} strokeWidth="2" strokeDasharray="6" />
            <text x="292" y="55" fill={THEME.yellow} fontSize="10" fontFamily="JetBrains Mono">SRAS'</text>
            <circle cx="185" cy="120" r="5" fill={THEME.orange} />
            <text x="80" y="15" fill={THEME.green} fontSize="10" fontFamily="JetBrains Mono">SRAS right: PL down, GDP up</text>
          </>
        )}
        {showShift && shift === "sras_left" && (
          <>
            <line x1="55" y1="170" x2="240" y2="40" stroke={THEME.yellow} strokeWidth="2" strokeDasharray="6" />
            <text x="242" y="40" fill={THEME.yellow} fontSize="10" fontFamily="JetBrains Mono">SRAS'</text>
            <circle cx="155" cy="103" r="5" fill={THEME.orange} />
            <text x="80" y="15" fill={THEME.red} fontSize="10" fontFamily="JetBrains Mono">SRAS left: PL up, GDP down</text>
          </>
        )}
      </svg>
    );
  };

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
        {GRAPH_SCENARIOS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => { setScenarioIdx(i); setUserAnswer(null); setShowAnswer(false); }}
            style={{
              padding: "6px 12px",
              borderRadius: 20,
              border: `1px solid ${i === scenarioIdx ? THEME.accent : THEME.border}`,
              background: i === scenarioIdx ? THEME.accentDim + "33" : "transparent",
              color: i === scenarioIdx ? THEME.accent : THEME.textDim,
              cursor: "pointer",
              fontSize: 12,
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <div style={{ background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 24 }}>
        <h3 style={{ color: THEME.accent, fontSize: 16, marginBottom: 8, fontFamily: "'JetBrains Mono', monospace" }}>
          {scenario.title}
        </h3>
        <p style={{ marginBottom: 18, lineHeight: 1.6 }}>{scenario.instruction}</p>

        <div style={{ background: THEME.inputBg, borderRadius: 10, padding: 16, marginBottom: 18, textAlign: "center" }}>
          <GraphSVG type={scenario.type} shift={showAnswer ? scenario.correctShift : null} showShift={showAnswer} />
        </div>

        <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 10, color: THEME.textDim }}>What shifts?</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          {options.map((opt) => {
            let bg = "transparent";
            let bc = THEME.border;
            if (showAnswer) {
              if (opt.val === scenario.correctShift) { bg = THEME.green + "22"; bc = THEME.green; }
              else if (opt.val === userAnswer && opt.val !== scenario.correctShift) { bg = THEME.red + "22"; bc = THEME.red; }
            } else if (opt.val === userAnswer) { bg = THEME.accent + "22"; bc = THEME.accent; }
            return (
              <button
                key={opt.val}
                onClick={() => !showAnswer && setUserAnswer(opt.val)}
                style={{
                  padding: "10px 16px", background: bg, border: `1px solid ${bc}`, borderRadius: 8,
                  color: THEME.text, cursor: showAnswer ? "default" : "pointer", fontSize: 14,
                  textAlign: "left", fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {!showAnswer && userAnswer && (
          <button onClick={check} style={{ padding: "10px 28px", background: THEME.accent, border: "none", borderRadius: 8, color: THEME.bg, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
            Check Answer
          </button>
        )}

        {showAnswer && (
          <>
            <div style={{ padding: 16, background: userAnswer === scenario.correctShift ? THEME.green + "11" : THEME.red + "11", borderRadius: 10, borderLeft: `4px solid ${userAnswer === scenario.correctShift ? THEME.green : THEME.red}`, marginBottom: 16 }}>
              <p style={{ fontWeight: 700, color: userAnswer === scenario.correctShift ? THEME.green : THEME.red, marginBottom: 6 }}>
                {userAnswer === scenario.correctShift ? "Correct!" : "Incorrect"}
              </p>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: THEME.textDim }}>{scenario.explanation}</p>
            </div>
            <button onClick={next} style={{ padding: "10px 28px", background: THEME.accent, border: "none", borderRadius: 8, color: THEME.bg, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Next Scenario →
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Chatbot Component ───
function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hey! I'm your AP Macro Unit 4 study assistant. I can help with:\n\n- Money functions & supply measures (M0, M1, M2)\n- Bank balance sheets & money multiplier calculations\n- Money market graphs (supply, demand, equilibrium)\n- Limited reserves policy (OMO, discount rate, reserve req)\n- Ample reserves policy (IORB, ON RRP, arbitrage)\n- AD-AS model (shifters, gaps, self-correction)\n\nAsk me anything, or say 'quiz me' for a practice question!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEnd = useRef(null);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const SYSTEM_PROMPT = `You are an expert AP Macroeconomics tutor helping a student study for their Unit 4 exam. You have deep knowledge of the following topics and should use the specific details below when answering:

## FUNCTIONS OF MONEY
- Medium of Exchange: accepted as payment for goods/services
- Unit of Account: standard measure of value for comparing prices
- Store of Value: retains purchasing power over time
- Example: A $20 bill is money because it's universally accepted; a $20 Target gift card is NOT money because it's only accepted at one store

## MONEY SUPPLY MEASURES
- M0 (Monetary Base): physical currency in circulation + bank reserves at the Fed
- M1: currency in circulation + demand deposits (checking accounts) + traveler's checks
- M2: M1 + savings deposits + money market funds + small time deposits (CDs < $100k)

## BANK BALANCE SHEETS
- Assets: Total Reserves, Loans, Securities
- Liabilities: Demand Deposits, Savings Deposits, Other Liabilities
- Assets − Liabilities = Owner's Equity (Net Worth)
- Required Reserves = Reserve Requirement Rate × Demand Deposits
- Excess Reserves = Total Reserves − Required Reserves
- Banks can only lend excess reserves

## MONEY MULTIPLIER
- Formula: 1 / Reserve Requirement
- Max money created = Deposit × Multiplier
- Max loans created = Deposit × (Multiplier − 1)
- For open market operations: Max money created = Purchase amount × Multiplier
- Less money is actually created because: (1) banks hold excess reserves, (2) people hold cash

## MONEY MARKET
- Money Demand has two components:
  - Transaction Demand: money for everyday purchases; increases with GDP/income or price level
  - Asset Demand: money as safe store of wealth; increases when interest rates fall
- Money Demand curve slopes downward (inverse relationship with interest rate)
- Money Supply is vertical (perfectly inelastic) — central bank controls quantity regardless of interest rate
- Equilibrium: where MD = MS, determines nominal interest rate

## LIMITED RESERVES FRAMEWORK (Pre-2008)
- Supply curve intersects the DOWNWARD-SLOPING portion of demand
- Three tools: Open Market Operations (primary), Discount Rate, Reserve Requirement
- OMO: Buy bonds → MS↑ → IR↓ (expansionary); Sell bonds → MS↓ → IR↑ (contractionary)
- Discount Rate: Lower → banks borrow more → MS↑; Raise → banks borrow less → MS↓
- Reserve Requirement: Lower → banks lend more → MS↑; Raise → banks lend less → MS↓
- Fed used DAILY open market operations to fine-tune the FFR to the FOMC target
- Discount rate set ABOVE FFR target as a ceiling

## AMPLE RESERVES FRAMEWORK (Current, Post-2008)
- After 2008 Financial Crisis, reserves went from ~$15 billion to ~$2.7 trillion
- Supply curve intersects the FLAT portion of demand curve
- Small shifts in supply do NOT affect the FFR
- IORB Rate (Interest on Reserve Balances) = PRIMARY tool
  - Fed pays banks this rate on deposits at the Fed
  - Acts as "reservation rate" — banks won't lend for less than IORB
  - Arbitrage keeps FFR near IORB: if FFR < IORB, banks borrow at FFR and deposit at Fed for profit
- ON RRP Rate = Supplementary tool, sets FLOOR for FFR
  - Available to non-bank institutions (money market funds, GSEs)
  - These institutions won't lend below ON RRP rate
- Discount Rate = sets CEILING for FFR
- Open Market Operations = maintenance tool to keep reserves ample (NOT daily fine-tuning)
- Reserve requirements set to ZERO since March 2020
- KEY DIFFERENCE: Fed shifts DEMAND curve endpoints (by changing administered rates), NOT supply curve

## MONETARY POLICY TRANSMISSION CHAIN
- Expansionary: Fed action → MS↑ → IR↓ → Ig↑ → AD↑ → PL↑, GDP↑, Unemployment↓
- Contractionary: Fed action → MS↓ → IR↑ → Ig↓ → AD↓ → PL↓, GDP↓, Unemployment↑
- These outcomes apply to BOTH limited and ample reserves frameworks

## AD-AS MODEL
- AD slopes down due to: (1) Wealth Effect, (2) Interest Rate Effect, (3) Net Export Effect
- AD Shifters (C+I+G+NX): consumer confidence, taxes, government spending, investment, net exports, transfer payments
- Price level changes cause MOVEMENT ALONG AD, not a shift
- SRAS Shifters: input prices (energy, wages), business taxes, productivity, expected inflation
- CPI/inflation changes cause MOVEMENT ALONG SRAS, not a shift
- LRAS Shifters: technology, human capital, labor force, natural resources, physical capital

## GAPS AND SELF-CORRECTION
- Recessionary Gap: actual GDP < potential GDP, unemployment above natural rate
  - Long-run: wages fall → SRAS shifts right → returns to Yf at lower PL
- Inflationary Gap: actual GDP > potential GDP, unemployment below natural rate
  - Long-run: wages rise → SRAS shifts left → returns to Yf at higher PL
- Long-Run Equilibrium: AD, SRAS, LRAS all intersect at the same point

## INSTRUCTIONS FOR TUTORING
- Be concise and clear. Use arrows (→, ↑, ↓) for chains of effects.
- If asked "quiz me," generate an AP-exam-style multiple choice question with 4 options, then explain the answer after they respond.
- If the student seems confused, break things down step by step with examples.
- Always tie answers back to AP exam content and how it would be tested.
- When explaining graphs, describe what shifts, what direction, and the resulting changes to equilibrium.
- Use concrete numerical examples when explaining money multiplier or balance sheet problems.
- Be encouraging but direct. Correct misconceptions clearly.
- When comparing limited vs ample reserves, explicitly state the key differences.`;

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const apiMessages = newMessages
        .filter((m) => m.role !== "system")
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: SYSTEM_PROMPT,
          messages: apiMessages,
        }),
      });
      const data = await response.json();
      const assistantText = data.content?.map((c) => c.text || "").join("") || "Sorry, I couldn't generate a response. Try again!";
      setMessages((prev) => [...prev, { role: "assistant", content: assistantText }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Connection issue. Make sure the API is configured — check that ANTHROPIC_API_KEY is set in your Netlify environment variables." }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{
          flex: 1, overflowY: "auto", padding: "16px 0",
          display: "flex", flexDirection: "column", gap: 12,
          minHeight: 300, maxHeight: 480,
        }}
      >
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div
              style={{
                maxWidth: "85%", padding: "12px 16px",
                borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                background: m.role === "user" ? THEME.accentDim : THEME.card,
                border: `1px solid ${m.role === "user" ? THEME.accent + "44" : THEME.border}`,
                fontSize: 14, lineHeight: 1.65, whiteSpace: "pre-wrap", wordBreak: "break-word",
              }}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{ padding: "12px 20px", borderRadius: "16px 16px 16px 4px", background: THEME.card, border: `1px solid ${THEME.border}`, fontSize: 14, color: THEME.textDim }}>
              <span className="dot-pulse">Thinking</span>
              <style>{`
                .dot-pulse::after { content: ''; animation: dots 1.5s steps(4, end) infinite; }
                @keyframes dots { 0%, 20% { content: ''; } 40% { content: '.'; } 60% { content: '..'; } 80%, 100% { content: '...'; } }
              `}</style>
            </div>
          </div>
        )}
        <div ref={messagesEnd} />
      </div>

      <div style={{ display: "flex", gap: 8, paddingTop: 12, borderTop: `1px solid ${THEME.border}` }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask about money, banking, monetary policy, AD-AS..."
          style={{
            flex: 1, padding: "12px 16px", background: THEME.inputBg,
            border: `1px solid ${THEME.border}`, borderRadius: 10,
            color: THEME.text, fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none",
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{
            padding: "0 20px", background: input.trim() ? THEME.accent : THEME.border,
            border: "none", borderRadius: 10,
            color: input.trim() ? THEME.bg : THEME.textDim,
            fontWeight: 700, fontSize: 16, cursor: input.trim() ? "pointer" : "default",
            fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

// ─── Quick Reference / Cheat Sheet ───
function CheatSheet() {
  return (
    <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
      <div style={{ background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 20 }}>
        <h3 style={{ color: THEME.accent, fontSize: 14, fontFamily: "'JetBrains Mono', monospace", marginBottom: 12 }}>MONEY MULTIPLIER</h3>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, lineHeight: 2 }}>
          <div>Multiplier = <span style={{ color: THEME.accent }}>1 / RR</span></div>
          <div>Max $ created = Deposit x Mult</div>
          <div>Max loans = Deposit x (Mult - 1)</div>
          <div style={{ marginTop: 8, color: THEME.textDim, fontSize: 12 }}>10% = 10x | 20% = 5x | 25% = 4x<br />33.3% = 3x | 50% = 2x</div>
        </div>
      </div>

      <div style={{ background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 20 }}>
        <h3 style={{ color: THEME.green, fontSize: 14, fontFamily: "'JetBrains Mono', monospace", marginBottom: 12 }}>EXPANSIONARY CHAIN</h3>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, lineHeight: 2, color: THEME.green }}>
          <div>Buy bonds / lower disc rate / lower RR</div>
          <div>-&gt; MS up -&gt; IR down -&gt; Ig up -&gt; AD up</div>
          <div>-&gt; PL up | GDP up | Unemp down</div>
        </div>
      </div>

      <div style={{ background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 20 }}>
        <h3 style={{ color: THEME.red, fontSize: 14, fontFamily: "'JetBrains Mono', monospace", marginBottom: 12 }}>CONTRACTIONARY CHAIN</h3>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, lineHeight: 2, color: THEME.red }}>
          <div>Sell bonds / raise disc rate / raise RR</div>
          <div>-&gt; MS down -&gt; IR up -&gt; Ig down -&gt; AD down</div>
          <div>-&gt; PL down | GDP down | Unemp up</div>
        </div>
      </div>

      <div style={{ background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 20 }}>
        <h3 style={{ color: THEME.purple, fontSize: 14, fontFamily: "'JetBrains Mono', monospace", marginBottom: 12 }}>AMPLE RESERVES TOOLS</h3>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, lineHeight: 2 }}>
          <div><span style={{ color: THEME.accent }}>IORB</span> = Primary tool (reservation rate)</div>
          <div><span style={{ color: THEME.yellow }}>ON RRP</span> = Floor for FFR</div>
          <div><span style={{ color: THEME.red }}>Discount</span> = Ceiling for FFR</div>
          <div><span style={{ color: THEME.textDim }}>OMO</span> = Keep reserves ample</div>
          <div style={{ marginTop: 6, color: THEME.textDim, fontSize: 11 }}>Fed shifts demand curve endpoints (not supply)</div>
        </div>
      </div>

      <div style={{ background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 20 }}>
        <h3 style={{ color: THEME.orange, fontSize: 14, fontFamily: "'JetBrains Mono', monospace", marginBottom: 12 }}>WHY AD SLOPES DOWN</h3>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, lineHeight: 2 }}>
          <div><span style={{ color: THEME.accent }}>1.</span> Wealth Effect</div>
          <div><span style={{ color: THEME.accent }}>2.</span> Interest Rate Effect</div>
          <div><span style={{ color: THEME.accent }}>3.</span> Net Export Effect</div>
          <div style={{ marginTop: 6, color: THEME.textDim, fontSize: 11 }}>All: Higher PL = less quantity demanded</div>
        </div>
      </div>

      <div style={{ background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 20 }}>
        <h3 style={{ color: THEME.yellow, fontSize: 14, fontFamily: "'JetBrains Mono', monospace", marginBottom: 12 }}>LONG-RUN SELF-CORRECTION</h3>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, lineHeight: 2 }}>
          <div><span style={{ color: THEME.red }}>Recession:</span> wages fall -&gt; SRAS right</div>
          <div><span style={{ color: THEME.green }}>Inflation:</span> wages rise -&gt; SRAS left</div>
          <div style={{ marginTop: 6, color: THEME.textDim, fontSize: 11 }}>Both return to Yf (LRAS)</div>
        </div>
      </div>

      <div style={{ background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 20 }}>
        <h3 style={{ color: THEME.accent, fontSize: 14, fontFamily: "'JetBrains Mono', monospace", marginBottom: 12 }}>AD SHIFTERS (C+I+G+NX)</h3>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, lineHeight: 1.8 }}>
          <div><span style={{ color: THEME.green }}>Right:</span> more C, I, G, or NX</div>
          <div><span style={{ color: THEME.red }}>Left:</span> less C, I, G, or NX</div>
          <div style={{ marginTop: 4, color: THEME.textDim, fontSize: 11 }}>Price level changes = movement ALONG curve</div>
        </div>
      </div>

      <div style={{ background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 20 }}>
        <h3 style={{ color: THEME.accent, fontSize: 14, fontFamily: "'JetBrains Mono', monospace", marginBottom: 12 }}>SRAS SHIFTERS</h3>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, lineHeight: 1.8 }}>
          <div><span style={{ color: THEME.green }}>Right:</span> lower input costs, higher productivity</div>
          <div><span style={{ color: THEME.red }}>Left:</span> higher input costs, higher wages</div>
          <div style={{ marginTop: 4, color: THEME.textDim, fontSize: 11 }}>CPI/inflation changes = movement ALONG curve</div>
        </div>
      </div>
    </div>
  );
}

// ─── Main App ───
export default function App() {
  const [tab, setTab] = useState("learn");

  const tabs = [
    { id: "learn", label: "Learn", icon: "📚" },
    { id: "quiz", label: "Quiz", icon: "✍️" },
    { id: "graph", label: "Graphs", icon: "📊" },
    { id: "cheat", label: "Cheat Sheet", icon: "⚡" },
    { id: "chat", label: "AI Tutor", icon: "🤖" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: THEME.bg,
        color: THEME.text,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet" />

      {/* Header */}
      <div
        style={{
          borderBottom: `1px solid ${THEME.border}`,
          padding: "28px 24px 20px",
          background: `linear-gradient(135deg, ${THEME.bg} 0%, #0f1729 100%)`,
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 4 }}>
            <h1
              style={{
                fontSize: 28,
                fontFamily: "'Playfair Display', serif",
                fontWeight: 800,
                background: `linear-gradient(135deg, ${THEME.accent}, ${THEME.purple})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: -0.5,
              }}
            >
              AP Macro
            </h1>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13,
                color: THEME.textDim,
                background: THEME.border,
                padding: "2px 10px",
                borderRadius: 6,
              }}
            >
              UNIT 4
            </span>
          </div>
          <p style={{ color: THEME.textDim, fontSize: 14 }}>Money, Banking, Monetary Policy & AD-AS</p>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, marginTop: 20, flexWrap: "wrap" }}>
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  padding: "10px 18px",
                  background: tab === t.id ? THEME.accent + "18" : "transparent",
                  border: `1px solid ${tab === t.id ? THEME.accent + "44" : "transparent"}`,
                  borderRadius: 10,
                  color: tab === t.id ? THEME.accent : THEME.textDim,
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: tab === t.id ? 600 : 400,
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 24px 60px" }}>
        {tab === "learn" && (
          <div>
            <p style={{ color: THEME.textDim, marginBottom: 20, fontSize: 14 }}>
              Click any topic to expand the study material. Covers all Unit 4 content.
            </p>
            {TOPICS.map((t) => (
              <TopicSection key={t.id} topic={t} />
            ))}
          </div>
        )}

        {tab === "quiz" && (
          <div>
            <p style={{ color: THEME.textDim, marginBottom: 20, fontSize: 14 }}>
              {QUESTIONS.length} practice questions covering all Unit 4 topics. Filter by topic or try them all.
            </p>
            <QuizSection />
          </div>
        )}

        {tab === "graph" && (
          <div>
            <p style={{ color: THEME.textDim, marginBottom: 20, fontSize: 14 }}>
              {GRAPH_SCENARIOS.length} interactive graph scenarios. Select your answer, then check it.
            </p>
            <GraphPractice />
          </div>
        )}

        {tab === "cheat" && (
          <div>
            <p style={{ color: THEME.textDim, marginBottom: 20, fontSize: 14 }}>
              Quick reference cards for the most important formulas, chains, and shifters.
            </p>
            <CheatSheet />
          </div>
        )}

        {tab === "chat" && (
          <div>
            <p style={{ color: THEME.textDim, marginBottom: 16, fontSize: 14 }}>
              AI tutor trained on your Unit 4 material. Ask questions, request explanations, or say "quiz me."
            </p>
            <div style={{ background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 20 }}>
              <Chatbot />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
