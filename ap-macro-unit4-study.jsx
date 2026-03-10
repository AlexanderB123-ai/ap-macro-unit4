import { useState, useRef, useEffect, useCallback } from "react";

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
    ],
  },
  {
    id: "amplepolicy",
    title: "Monetary Policy (Ample Reserves)",
    icon: "⚡",
    content: [
      {
        heading: "Ample Reserves Framework (Current / Post-2008)",
        body: `After the 2008 Financial Crisis, the Fed flooded the banking system with reserves through large-scale asset purchases. Reserves became **ample**, meaning small changes in supply don't affect the federal funds rate.

**Key tools in the ample reserves framework:**

**IORB Rate (Interest on Reserve Balances)** — The PRIMARY tool. The Fed pays banks this rate for deposits at the Fed. Acts as a "reservation rate" — banks won't lend for less than they earn risk-free at the Fed. Arbitrage keeps the FFR near the IORB rate.

**ON RRP Rate (Overnight Reverse Repo)** — Supplementary tool. Sets a FLOOR for the FFR. Available to non-bank institutions (money market funds, etc.).

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
  {
    id: 1,
    topic: "money",
    question: "Which of the following is included in M1 but NOT in M0?",
    options: ["Federal Reserve notes", "Demand deposits (checking accounts)", "Savings deposits", "Coins in circulation"],
    correct: 1,
    explanation: "M1 includes currency in circulation PLUS demand deposits (checking accounts). M0 is just the monetary base (currency + reserves). Savings deposits are in M2, not M1.",
  },
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
    explanation: "The ON RRP rate is a supplementary tool that sets a FLOOR for the FFR. Non-bank institutions won't lend for less than the ON RRP rate. The discount rate sets the ceiling.",
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
    id: 14,
    topic: "banking",
    question: "Looking at Chase Bank's balance sheet: Reserves $9,000, Loans $1,000, Securities $5,000, Demand Deposits $10,000, Other Deposits $3,000, Owner's Equity $2,000. With a 10% reserve requirement, what are the required reserves and excess reserves?",
    options: [
      "RR = $1,000, ER = $8,000",
      "RR = $1,300, ER = $7,700",
      "RR = $900, ER = $8,100",
      "RR = $1,500, ER = $7,500",
    ],
    correct: 0,
    explanation: "Required Reserves = 10% × Demand Deposits = 10% × $10,000 = $1,000. Excess Reserves = Total Reserves − Required Reserves = $9,000 − $1,000 = $8,000.",
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
    id: 16,
    topic: "banking",
    question: "If the Fed purchases $10 million in government securities on the open market and the reserve requirement is 10%, what is the maximum amount of money created in the banking system?",
    options: ["$10 million", "$90 million", "$100 million", "$110 million"],
    correct: 2,
    explanation: "Money multiplier = 1/0.10 = 10. Maximum money created = $10 million × 10 = $100 million.",
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
    id: "adas_exp",
    title: "AD-AS: Expansionary Monetary Policy",
    type: "adas",
    instruction: "The central bank implements expansionary monetary policy. Show the short-run effect on the AD-AS model.",
    correctShift: "ad_right",
    explanation: "Expansionary monetary policy lowers interest rates, increasing investment and consumption. AD shifts RIGHT. In the short run: price level rises, real GDP increases, and unemployment falls.",
  },
  {
    id: "adas_con",
    title: "AD-AS: Contractionary Monetary Policy",
    type: "adas",
    instruction: "The central bank implements contractionary monetary policy. Show the short-run effect on the AD-AS model.",
    correctShift: "ad_left",
    explanation: "Contractionary monetary policy raises interest rates, decreasing investment and consumption. AD shifts LEFT. In the short run: price level falls, real GDP decreases, and unemployment rises.",
  },
  {
    id: "adas_rec_lr",
    title: "AD-AS: Recessionary Gap Long-Run Correction",
    type: "adas_gap",
    instruction: "The economy is in a recessionary gap (AD intersects SRAS to the LEFT of LRAS). Show how the economy self-corrects in the long run.",
    correctShift: "sras_right",
    explanation: "In a recessionary gap, unemployment is high. Over time, wages fall, reducing production costs. SRAS shifts RIGHT until it intersects AD at the full employment level (LRAS). The price level falls.",
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
                {selected === q.correct ? "✓ Correct!" : "✗ Incorrect"}
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
    if (type === "moneymarket" || type === "moneymarket") {
      return (
        <svg viewBox="0 0 300 240" style={{ width: "100%", maxWidth: 360 }}>
          {/* Axes */}
          <line x1="50" y1="20" x2="50" y2="200" stroke={THEME.textDim} strokeWidth="2" />
          <line x1="50" y1="200" x2="280" y2="200" stroke={THEME.textDim} strokeWidth="2" />
          <text x="10" y="110" fill={THEME.textDim} fontSize="11" transform="rotate(-90,18,110)" fontFamily="JetBrains Mono" textAnchor="middle">
            Nominal IR
          </text>
          <text x="165" y="225" fill={THEME.textDim} fontSize="11" fontFamily="JetBrains Mono" textAnchor="middle">
            Quantity of Money
          </text>
          {/* MS vertical line */}
          <line x1="160" y1="30" x2="160" y2="190" stroke={THEME.accent} strokeWidth="2.5" />
          <text x="163" y="25" fill={THEME.accent} fontSize="11" fontFamily="JetBrains Mono" fontWeight="700">
            MS
          </text>
          {/* MD downward sloping */}
          <line x1="70" y1="50" x2="250" y2="180" stroke={THEME.yellow} strokeWidth="2.5" />
          <text x="252" y="185" fill={THEME.yellow} fontSize="11" fontFamily="JetBrains Mono" fontWeight="700">
            MD
          </text>
          {/* Equilibrium dot */}
          <circle cx="160" cy="118" r="5" fill={THEME.green} />
          <line x1="50" y1="118" x2="157" y2="118" stroke={THEME.green} strokeWidth="1" strokeDasharray="4" />
          <text x="35" y="121" fill={THEME.green} fontSize="9" fontFamily="JetBrains Mono">
            i₁
          </text>
          {/* Shifted curve */}
          {showShift && shift === "ms_right" && (
            <>
              <line x1="200" y1="30" x2="200" y2="190" stroke={THEME.accent} strokeWidth="2" strokeDasharray="6" />
              <text x="203" y="25" fill={THEME.accent} fontSize="10" fontFamily="JetBrains Mono">
                MS'
              </text>
              <circle cx="200" cy="140" r="5" fill={THEME.orange} />
              <line x1="50" y1="140" x2="197" y2="140" stroke={THEME.orange} strokeWidth="1" strokeDasharray="4" />
              <text x="35" y="143" fill={THEME.orange} fontSize="9" fontFamily="JetBrains Mono">
                i₂
              </text>
              <text x="100" y="15" fill={THEME.green} fontSize="10" fontFamily="JetBrains Mono">
                → MS shifts right, IR ↓
              </text>
            </>
          )}
          {showShift && shift === "ms_left" && (
            <>
              <line x1="120" y1="30" x2="120" y2="190" stroke={THEME.accent} strokeWidth="2" strokeDasharray="6" />
              <text x="123" y="25" fill={THEME.accent} fontSize="10" fontFamily="JetBrains Mono">
                MS'
              </text>
              <circle cx="120" cy="96" r="5" fill={THEME.orange} />
              <line x1="50" y1="96" x2="117" y2="96" stroke={THEME.orange} strokeWidth="1" strokeDasharray="4" />
              <text x="35" y="99" fill={THEME.orange} fontSize="9" fontFamily="JetBrains Mono">
                i₂
              </text>
              <text x="90" y="15" fill={THEME.red} fontSize="10" fontFamily="JetBrains Mono">
                ← MS shifts left, IR ↑
              </text>
            </>
          )}
          {showShift && shift === "md_right" && (
            <>
              <line x1="100" y1="50" x2="270" y2="170" stroke={THEME.yellow} strokeWidth="2" strokeDasharray="6" />
              <text x="272" y="175" fill={THEME.yellow} fontSize="10" fontFamily="JetBrains Mono">
                MD'
              </text>
              <circle cx="160" cy="100" r="5" fill={THEME.orange} />
              <line x1="50" y1="100" x2="157" y2="100" stroke={THEME.orange} strokeWidth="1" strokeDasharray="4" />
              <text x="35" y="103" fill={THEME.orange} fontSize="9" fontFamily="JetBrains Mono">
                i₂
              </text>
              <text x="80" y="15" fill={THEME.red} fontSize="10" fontFamily="JetBrains Mono">
                → MD shifts right, IR ↑
              </text>
            </>
          )}
          {showShift && shift === "md_left" && (
            <>
              <line x1="55" y1="60" x2="220" y2="180" stroke={THEME.yellow} strokeWidth="2" strokeDasharray="6" />
              <text x="222" y="185" fill={THEME.yellow} fontSize="10" fontFamily="JetBrains Mono">
                MD'
              </text>
              <circle cx="160" cy="135" r="5" fill={THEME.orange} />
              <line x1="50" y1="135" x2="157" y2="135" stroke={THEME.orange} strokeWidth="1" strokeDasharray="4" />
              <text x="35" y="138" fill={THEME.orange} fontSize="9" fontFamily="JetBrains Mono">
                i₂
              </text>
              <text x="80" y="15" fill={THEME.green} fontSize="10" fontFamily="JetBrains Mono">
                ← MD shifts left, IR ↓
              </text>
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
        <text x="10" y="120" fill={THEME.textDim} fontSize="11" transform="rotate(-90,18,120)" fontFamily="JetBrains Mono" textAnchor="middle">
          Price Level
        </text>
        <text x="175" y="248" fill={THEME.textDim} fontSize="11" fontFamily="JetBrains Mono" textAnchor="middle">
          Real GDP
        </text>
        {/* LRAS */}
        <line x1="180" y1="30" x2="180" y2="210" stroke={THEME.purple} strokeWidth="2.5" />
        <text x="183" y="25" fill={THEME.purple} fontSize="11" fontFamily="JetBrains Mono" fontWeight="700">
          LRAS
        </text>
        {/* SRAS */}
        <line x1="70" y1="180" x2="270" y2="50" stroke={THEME.yellow} strokeWidth="2.5" />
        <text x="272" y="50" fill={THEME.yellow} fontSize="11" fontFamily="JetBrains Mono" fontWeight="700">
          SRAS
        </text>
        {/* AD */}
        <line x1="70" y1="40" x2="260" y2="190" stroke={THEME.accent} strokeWidth="2.5" />
        <text x="262" y="195" fill={THEME.accent} fontSize="11" fontFamily="JetBrains Mono" fontWeight="700">
          AD
        </text>
        {/* Equilibrium */}
        <circle cx="170" cy="112" r="5" fill={THEME.green} />
        {/* Shifted curves */}
        {showShift && shift === "ad_right" && (
          <>
            <line x1="100" y1="40" x2="290" y2="190" stroke={THEME.accent} strokeWidth="2" strokeDasharray="6" />
            <text x="290" y="195" fill={THEME.accent} fontSize="10" fontFamily="JetBrains Mono">
              AD'
            </text>
            <circle cx="195" cy="100" r="5" fill={THEME.orange} />
            <text x="90" y="15" fill={THEME.green} fontSize="10" fontFamily="JetBrains Mono">
              → AD right: PL↑, GDP↑, U↓
            </text>
          </>
        )}
        {showShift && shift === "ad_left" && (
          <>
            <line x1="55" y1="50" x2="230" y2="190" stroke={THEME.accent} strokeWidth="2" strokeDasharray="6" />
            <text x="232" y="195" fill={THEME.accent} fontSize="10" fontFamily="JetBrains Mono">
              AD'
            </text>
            <circle cx="145" cy="125" r="5" fill={THEME.orange} />
            <text x="80" y="15" fill={THEME.red} fontSize="10" fontFamily="JetBrains Mono">
              ← AD left: PL↓, GDP↓, U↑
            </text>
          </>
        )}
        {showShift && shift === "sras_right" && (
          <>
            <line x1="100" y1="185" x2="290" y2="55" stroke={THEME.yellow} strokeWidth="2" strokeDasharray="6" />
            <text x="292" y="55" fill={THEME.yellow} fontSize="10" fontFamily="JetBrains Mono">
              SRAS'
            </text>
            <circle cx="185" cy="120" r="5" fill={THEME.orange} />
            <text x="80" y="15" fill={THEME.green} fontSize="10" fontFamily="JetBrains Mono">
              → SRAS right: PL↓, GDP↑
            </text>
          </>
        )}
        {showShift && shift === "sras_left" && (
          <>
            <line x1="55" y1="170" x2="240" y2="40" stroke={THEME.yellow} strokeWidth="2" strokeDasharray="6" />
            <text x="242" y="40" fill={THEME.yellow} fontSize="10" fontFamily="JetBrains Mono">
              SRAS'
            </text>
            <circle cx="155" cy="103" r="5" fill={THEME.orange} />
            <text x="80" y="15" fill={THEME.red} fontSize="10" fontFamily="JetBrains Mono">
              ← SRAS left: PL↑, GDP↓
            </text>
          </>
        )}
      </svg>
    );
  };

  return (
    <div>
      {/* Scenario nav */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
        {GRAPH_SCENARIOS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => {
              setScenarioIdx(i);
              setUserAnswer(null);
              setShowAnswer(false);
            }}
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

        {/* Graph display */}
        <div style={{ background: THEME.inputBg, borderRadius: 10, padding: 16, marginBottom: 18, textAlign: "center" }}>
          <GraphSVG type={scenario.type} shift={showAnswer ? scenario.correctShift : null} showShift={showAnswer} />
        </div>

        {/* Answer options */}
        <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 10, color: THEME.textDim }}>What shifts?</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          {options.map((opt) => {
            let bg = "transparent";
            let bc = THEME.border;
            if (showAnswer) {
              if (opt.val === scenario.correctShift) {
                bg = THEME.green + "22";
                bc = THEME.green;
              } else if (opt.val === userAnswer && opt.val !== scenario.correctShift) {
                bg = THEME.red + "22";
                bc = THEME.red;
              }
            } else if (opt.val === userAnswer) {
              bg = THEME.accent + "22";
              bc = THEME.accent;
            }
            return (
              <button
                key={opt.val}
                onClick={() => !showAnswer && setUserAnswer(opt.val)}
                style={{
                  padding: "10px 16px",
                  background: bg,
                  border: `1px solid ${bc}`,
                  borderRadius: 8,
                  color: THEME.text,
                  cursor: showAnswer ? "default" : "pointer",
                  fontSize: 14,
                  textAlign: "left",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {!showAnswer && userAnswer && (
          <button
            onClick={check}
            style={{
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
            Check Answer
          </button>
        )}

        {showAnswer && (
          <>
            <div
              style={{
                padding: 16,
                background: userAnswer === scenario.correctShift ? THEME.green + "11" : THEME.red + "11",
                borderRadius: 10,
                borderLeft: `4px solid ${userAnswer === scenario.correctShift ? THEME.green : THEME.red}`,
                marginBottom: 16,
              }}
            >
              <p style={{ fontWeight: 700, color: userAnswer === scenario.correctShift ? THEME.green : THEME.red, marginBottom: 6 }}>
                {userAnswer === scenario.correctShift ? "✓ Correct!" : "✗ Incorrect"}
              </p>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: THEME.textDim }}>{scenario.explanation}</p>
            </div>
            <button
              onClick={next}
              style={{
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
      content:
        "Hey Rahul! I'm your AP Macro Unit 4 study assistant. Ask me anything about money, banking, the money market, monetary policy (limited or ample reserves), or the AD-AS model. I can also quiz you or explain graphs!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEnd = useRef(null);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const SYSTEM_PROMPT = `You are an AP Macroeconomics tutor helping a student study for their Unit 4 test. Unit 4 covers:
- Functions of money (medium of exchange, unit of account, store of value)
- Money supply measures (M0, M1, M2)
- Bank balance sheets (assets, liabilities, owner's equity)
- Required reserves, excess reserves, the money multiplier
- The money market (money demand, money supply, nominal interest rate)
- Monetary policy in the LIMITED reserves framework: open market operations, discount rate, reserve requirement
- Monetary policy in the AMPLE reserves framework: IORB rate (primary tool), ON RRP rate (floor), discount rate (ceiling), open market operations (maintenance tool)
- The monetary policy transmission chain: Fed action → money supply/interest rate → investment → AD → price level, output, unemployment
- AD-AS model: why AD slopes down (wealth effect, interest rate effect, net export effect), recessionary vs inflationary gaps, long-run self-correction
- Expansionary vs contractionary policy outcomes

Be concise, clear, and use arrows (↑↓) when showing chains of effects. If the student seems confused, break things down step by step. You can create mini practice questions if asked. Keep answers focused on AP exam content. Use examples when helpful. Be encouraging but direct.`;

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

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: apiMessages,
        }),
      });
      const data = await response.json();
      const assistantText = data.content?.map((c) => c.text || "").join("") || "Sorry, I couldn't generate a response. Try again!";
      setMessages((prev) => [...prev, { role: "assistant", content: assistantText }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Oops — connection issue. Try asking again!" }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 0",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          minHeight: 300,
          maxHeight: 480,
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: m.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "85%",
                padding: "12px 16px",
                borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                background: m.role === "user" ? THEME.accentDim : THEME.card,
                border: `1px solid ${m.role === "user" ? THEME.accent + "44" : THEME.border}`,
                fontSize: 14,
                lineHeight: 1.65,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div
              style={{
                padding: "12px 20px",
                borderRadius: "16px 16px 16px 4px",
                background: THEME.card,
                border: `1px solid ${THEME.border}`,
                fontSize: 14,
                color: THEME.textDim,
              }}
            >
              <span className="dot-pulse">Thinking</span>
              <style>{`
                .dot-pulse::after {
                  content: '';
                  animation: dots 1.5s steps(4, end) infinite;
                }
                @keyframes dots {
                  0%, 20% { content: ''; }
                  40% { content: '.'; }
                  60% { content: '..'; }
                  80%, 100% { content: '...'; }
                }
              `}</style>
            </div>
          </div>
        )}
        <div ref={messagesEnd} />
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: 8, paddingTop: 12, borderTop: `1px solid ${THEME.border}` }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask about money, banking, monetary policy..."
          style={{
            flex: 1,
            padding: "12px 16px",
            background: THEME.inputBg,
            border: `1px solid ${THEME.border}`,
            borderRadius: 10,
            color: THEME.text,
            fontSize: 14,
            fontFamily: "'DM Sans', sans-serif",
            outline: "none",
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{
            padding: "0 20px",
            background: input.trim() ? THEME.accent : THEME.border,
            border: "none",
            borderRadius: 10,
            color: input.trim() ? THEME.bg : THEME.textDim,
            fontWeight: 700,
            fontSize: 16,
            cursor: input.trim() ? "pointer" : "default",
            fontFamily: "'DM Sans', sans-serif",
            transition: "all 0.2s",
          }}
        >
          ↑
        </button>
      </div>
    </div>
  );
}

// ─── Quick Reference / Cheat Sheet ───
function CheatSheet() {
  return (
    <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
      {/* Money Multiplier */}
      <div style={{ background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 20 }}>
        <h3 style={{ color: THEME.accent, fontSize: 14, fontFamily: "'JetBrains Mono', monospace", marginBottom: 12 }}>
          💰 MONEY MULTIPLIER
        </h3>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, lineHeight: 2 }}>
          <div>
            Multiplier = <span style={{ color: THEME.accent }}>1 / RR</span>
          </div>
          <div>Max $ created = Deposit × Mult</div>
          <div>Max loans = Deposit × (Mult − 1)</div>
          <div style={{ marginTop: 8, color: THEME.textDim, fontSize: 12 }}>
            10% → 10x | 20% → 5x | 25% → 4x
            <br />
            33⅓% → 3x | 50% → 2x
          </div>
        </div>
      </div>

      {/* Expansionary Chain */}
      <div style={{ background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 20 }}>
        <h3 style={{ color: THEME.green, fontSize: 14, fontFamily: "'JetBrains Mono', monospace", marginBottom: 12 }}>
          📈 EXPANSIONARY CHAIN
        </h3>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, lineHeight: 2, color: THEME.green }}>
          <div>Buy bonds / ↓ disc rate / ↓ RR</div>
          <div>→ MS ↑ → IR ↓ → Ig ↑ → AD ↑</div>
          <div>→ PL ↑ | GDP ↑ | Unemp ↓</div>
        </div>
      </div>

      {/* Contractionary Chain */}
      <div style={{ background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 20 }}>
        <h3 style={{ color: THEME.red, fontSize: 14, fontFamily: "'JetBrains Mono', monospace", marginBottom: 12 }}>
          📉 CONTRACTIONARY CHAIN
        </h3>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, lineHeight: 2, color: THEME.red }}>
          <div>Sell bonds / ↑ disc rate / ↑ RR</div>
          <div>→ MS ↓ → IR ↑ → Ig ↓ → AD ↓</div>
          <div>→ PL ↓ | GDP ↓ | Unemp ↑</div>
        </div>
      </div>

      {/* Ample Reserves */}
      <div style={{ background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 20 }}>
        <h3 style={{ color: THEME.purple, fontSize: 14, fontFamily: "'JetBrains Mono', monospace", marginBottom: 12 }}>
          ⚡ AMPLE RESERVES TOOLS
        </h3>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, lineHeight: 2 }}>
          <div>
            <span style={{ color: THEME.accent }}>IORB</span> = Primary tool
          </div>
          <div>
            <span style={{ color: THEME.yellow }}>ON RRP</span> = Floor for FFR
          </div>
          <div>
            <span style={{ color: THEME.red }}>Discount</span> = Ceiling for FFR
          </div>
          <div>
            <span style={{ color: THEME.textDim }}>OMO</span> = Keep reserves ample
          </div>
          <div style={{ marginTop: 6, color: THEME.textDim, fontSize: 11 }}>Fed shifts demand curve endpoints</div>
        </div>
      </div>

      {/* AD reasons */}
      <div style={{ background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 20 }}>
        <h3 style={{ color: THEME.orange, fontSize: 14, fontFamily: "'JetBrains Mono', monospace", marginBottom: 12 }}>
          📊 WHY AD SLOPES DOWN
        </h3>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, lineHeight: 2 }}>
          <div>
            <span style={{ color: THEME.accent }}>1.</span> Wealth Effect
          </div>
          <div>
            <span style={{ color: THEME.accent }}>2.</span> Interest Rate Effect
          </div>
          <div>
            <span style={{ color: THEME.accent }}>3.</span> Net Export Effect
          </div>
          <div style={{ marginTop: 6, color: THEME.textDim, fontSize: 11 }}>All: Higher PL → less quantity demanded</div>
        </div>
      </div>

      {/* Self-correction */}
      <div style={{ background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 20 }}>
        <h3 style={{ color: THEME.yellow, fontSize: 14, fontFamily: "'JetBrains Mono', monospace", marginBottom: 12 }}>
          🔄 LONG-RUN SELF-CORRECTION
        </h3>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, lineHeight: 2 }}>
          <div>
            <span style={{ color: THEME.red }}>Recession:</span> wages ↓ → SRAS →
          </div>
          <div>
            <span style={{ color: THEME.green }}>Inflation:</span> wages ↑ → SRAS ←
          </div>
          <div style={{ marginTop: 6, color: THEME.textDim, fontSize: 11 }}>Both return to Yf (LRAS)</div>
        </div>
      </div>
    </div>
  );
}

// ─── Main App ───
export default function App() {
  const [tab, setTab] = useState("learn");

  const tabs = [
    { id: "learn", label: "📚 Learn", desc: "Instructional Content" },
    { id: "quiz", label: "✍️ Quiz", desc: "Practice Questions" },
    { id: "graph", label: "📊 Graphs", desc: "Graphing Practice" },
    { id: "cheat", label: "⚡ Cheat Sheet", desc: "Quick Reference" },
    { id: "chat", label: "🤖 Tutor", desc: "AI Study Assistant" },
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
                {t.label}
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
              Click any topic to expand the study material. Covers all Unit 4 content from your notes guide and readings.
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
              Practice identifying the correct shifts for money market and AD-AS scenarios. Select your answer, then check it to see the graph update.
            </p>
            <GraphPractice />
          </div>
        )}

        {tab === "cheat" && (
          <div>
            <p style={{ color: THEME.textDim, marginBottom: 20, fontSize: 14 }}>
              Quick reference cards for the most important formulas and chains. Great for last-minute review.
            </p>
            <CheatSheet />
          </div>
        )}

        {tab === "chat" && (
          <div>
            <p style={{ color: THEME.textDim, marginBottom: 16, fontSize: 14 }}>
              AI tutor trained on your Unit 4 material. Ask questions, request explanations, or get practice problems.
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
