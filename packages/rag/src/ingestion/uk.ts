import type { LegalDocument } from "../types";

export const UK_DOCUMENTS: LegalDocument[] = [
  // ─── Matrimonial Causes Act 1973 ─────────────────────────────────────────
  {
    id: "uk-mca-s1",
    text: `MATRIMONIAL CAUSES ACT 1973 (as amended by Divorce, Dissolution and Separation Act 2020) — Divorce
The sole ground for divorce in England and Wales is irretrievable breakdown of the marriage. Under the 2020 Act (in force April 2022), no-fault divorce is available: one or both spouses state the marriage has irretrievably broken down without having to prove fault. A 20-week reflection period applies. Joint applications are possible. The court makes a conditional order then a final order.`,
    source: "Matrimonial Causes Act 1973", act: "Matrimonial Causes Act 1973", section: "Section 1",
    title: "Divorce — irretrievable breakdown, no-fault divorce", jurisdiction: "uk",
    url: "https://www.legislation.gov.uk/ukpga/1973/18", year: 2020,
    topics: ["divorce", "family law", "marriage dissolution", "no-fault divorce"],
  },
  {
    id: "uk-mca-s25",
    text: `MATRIMONIAL CAUSES ACT 1973 — Sections 23–25 — Financial orders on divorce
On divorce the court may order: periodical payments (maintenance/alimony); lump sum; property adjustment; pension sharing. Section 25 factors: (a) income, earning capacity and resources of both parties; (b) financial needs, obligations and responsibilities; (c) standard of living during marriage; (d) age and duration of marriage; (e) disability; (f) contributions made by each party including homemaking; (g) conduct if inequitable to disregard; (h) value of any lost benefit such as pension. The first consideration is welfare of any minor children. Courts aim for fairness — sharing, compensation, and meeting needs.`,
    source: "Matrimonial Causes Act 1973", act: "Matrimonial Causes Act 1973", section: "Sections 23-25",
    title: "Financial orders on divorce — maintenance, property, pension sharing", jurisdiction: "uk",
    url: "https://www.legislation.gov.uk/ukpga/1973/18", year: 1973,
    topics: ["financial orders", "divorce", "maintenance", "alimony", "spousal support", "property division", "pension sharing"],
  },
  {
    id: "uk-mca-s25a",
    text: `MATRIMONIAL CAUSES ACT 1973 — Section 25A — Clean break
The court shall consider whether financial obligations of each party towards the other should be terminated as soon after the divorce as just and reasonable. A "clean break" order dismisses claims for ongoing maintenance. Courts prefer clean break where parties are young, marriage was short, or both are financially independent. Spousal maintenance can be time-limited or joint-lives. Either party can apply to vary maintenance.`,
    source: "Matrimonial Causes Act 1973", act: "Matrimonial Causes Act 1973", section: "Section 25A",
    title: "Clean break financial settlement on divorce", jurisdiction: "uk",
    url: "https://www.legislation.gov.uk/ukpga/1973/18", year: 1973,
    topics: ["clean break", "divorce settlement", "spousal maintenance", "financial independence"],
  },

  // ─── Children Act 1989 ────────────────────────────────────────────────────
  {
    id: "uk-children-s1",
    text: `CHILDREN ACT 1989 — Section 1 — Welfare of the child is paramount
The child's welfare is the court's paramount consideration. The welfare checklist: (a) ascertainable wishes and feelings of the child; (b) physical, emotional and educational needs; (c) likely effect of change in circumstances; (d) age, sex, background and characteristics; (e) harm suffered or at risk of harm; (f) capability of each parent to meet the child's needs. Courts also consider parental responsibility (Section 3) — rights, duties, powers and authority a parent has over a child.`,
    source: "Children Act 1989", act: "Children Act 1989", section: "Section 1",
    title: "Welfare of the child — paramount principle, custody and parental responsibility", jurisdiction: "uk",
    url: "https://www.legislation.gov.uk/ukpga/1989/41", year: 1989,
    topics: ["child custody", "welfare of child", "parental responsibility", "family law", "children"],
  },
  {
    id: "uk-children-s8",
    text: `CHILDREN ACT 1989 — Section 8 — Child Arrangements Orders
A Child Arrangements Order regulates with whom a child lives, spends time, or has contact. Courts can also make: Specific Issue Orders (deciding a specific question about upbringing, e.g. schooling or medical treatment); Prohibited Steps Orders (preventing a parent taking a specific step without consent). CAFCASS advises the court on children's welfare. Parental alienation is a serious concern courts address. Courts encourage mediation before court proceedings.`,
    source: "Children Act 1989", act: "Children Act 1989", section: "Section 8",
    title: "Child arrangements orders — who the child lives with and contact", jurisdiction: "uk",
    url: "https://www.legislation.gov.uk/ukpga/1989/41", year: 1989,
    topics: ["child arrangements", "custody", "contact", "parental responsibility", "family law", "residence"],
  },

  // ─── Housing Act 1988 ─────────────────────────────────────────────────────
  {
    id: "uk-housing-s21",
    text: `HOUSING ACT 1988 — Section 21 — No-fault eviction notice
A landlord can recover possession from an assured shorthold tenant (AST) with at least 2 months' written notice (Section 21 notice) without giving a reason, after the fixed term expires. The notice is invalid if: (a) served within first 4 months; (b) deposit not protected in a government-approved scheme; (c) required documents (EPC, gas safety certificate, How to Rent guide) not provided. Court proceedings needed if tenant does not leave. The Renters' Rights Bill (2024) proposes to abolish Section 21.`,
    source: "Housing Act 1988", act: "Housing Act 1988", section: "Section 21",
    title: "No-fault eviction — Section 21 notice requirements", jurisdiction: "uk",
    url: "https://www.legislation.gov.uk/ukpga/1988/50", year: 1988,
    topics: ["eviction", "section 21", "tenancy", "landlord", "assured shorthold tenancy", "tenant rights"],
  },
  {
    id: "uk-housing-s8",
    text: `HOUSING ACT 1988 — Section 8 — Fault-based eviction
Landlords can apply for possession on specific grounds. Mandatory grounds (court MUST grant possession): Ground 8 — at least 2 months' rent arrears at both notice and hearing. Discretionary grounds (court decides if reasonable): Ground 10 — some rent arrears; Ground 11 — persistent delay in paying rent; Ground 14 — nuisance, annoyance or illegal use of property. Notice must specify the grounds. Court proceedings are required.`,
    source: "Housing Act 1988", act: "Housing Act 1988", section: "Section 8",
    title: "Fault-based eviction — rent arrears and grounds for possession", jurisdiction: "uk",
    url: "https://www.legislation.gov.uk/ukpga/1988/50", year: 1988,
    topics: ["eviction", "rent arrears", "section 8", "landlord", "possession order", "tenancy"],
  },
  {
    id: "uk-lta-s11",
    text: `LANDLORD AND TENANT ACT 1985 — Section 11 — Landlord's repair duties
Landlords of residential properties must: (a) keep in repair the structure and exterior (roof, walls, foundations, drains, gutters, external pipes); (b) keep in repair and working order installations for water, gas, electricity and sanitation; (c) keep in repair and working order space heating and water heating. Tenants must report disrepair and allow access on 24 hours' notice. The Homes (Fitness for Human Habitation) Act 2018 additionally requires landlords to ensure properties are fit for habitation throughout.`,
    source: "Landlord and Tenant Act 1985", act: "Landlord and Tenant Act 1985", section: "Section 11",
    title: "Landlord's duty to repair — structure, utilities, heating", jurisdiction: "uk",
    url: "https://www.legislation.gov.uk/ukpga/1985/70", year: 1985,
    topics: ["landlord repairs", "disrepair", "tenancy", "housing standards", "repairing covenant", "heating", "damp"],
  },

  // ─── Employment Rights Act 1996 ───────────────────────────────────────────
  {
    id: "uk-era-s94",
    text: `EMPLOYMENT RIGHTS ACT 1996 — Sections 94 and 98 — Unfair dismissal
Employees with 2+ years' service have the right not to be unfairly dismissed. Potentially fair reasons: (a) capability; (b) conduct; (c) redundancy; (d) statutory restriction; (e) some other substantial reason (SOSR). Even with a fair reason, dismissal must follow a fair procedure (ACAS Code). Compensation: basic award (up to £19,290) + compensatory award (lower of £105,707 or 52 weeks' gross pay). Automatic unfair dismissal (no qualifying period needed): whistleblowing, pregnancy, trade union activity.`,
    source: "Employment Rights Act 1996", act: "Employment Rights Act 1996", section: "Sections 94 and 98",
    title: "Unfair dismissal — qualifying period, fair reasons, compensation", jurisdiction: "uk",
    url: "https://www.legislation.gov.uk/ukpga/1996/18", year: 1996,
    topics: ["unfair dismissal", "employment law", "redundancy", "compensation", "employee rights", "ACAS"],
  },
  {
    id: "uk-era-s135",
    text: `EMPLOYMENT RIGHTS ACT 1996 — Statutory redundancy pay
Employees with 2+ years' continuous service dismissed for redundancy are entitled to: 0.5 weeks' pay per year under age 22; 1 week's pay per year aged 22–40; 1.5 weeks' pay per year aged 41+. Maximum 20 years counted. Weekly pay capped at £643 (April 2024). Maximum statutory redundancy pay: £19,290. Redundancy exists when: business closes; workplace closes; fewer employees are needed for a particular role. Employer must follow a fair redundancy process including meaningful consultation.`,
    source: "Employment Rights Act 1996", act: "Employment Rights Act 1996", section: "Sections 135-145",
    title: "Statutory redundancy pay — eligibility and calculation", jurisdiction: "uk",
    url: "https://www.legislation.gov.uk/ukpga/1996/18", year: 1996,
    topics: ["redundancy", "redundancy pay", "employment law", "dismissal", "employee rights"],
  },
  {
    id: "uk-era-s86",
    text: `EMPLOYMENT RIGHTS ACT 1996 — Section 86 — Minimum notice periods
Employers must give: 1 week after 1 month; 1 additional week per year of service up to 12 weeks maximum. Employees must give at least 1 week after 1 month of service. Contractual notice can be longer. Summary dismissal without notice is only lawful for gross misconduct. Pay in lieu of notice (PILON) is permissible if contractually provided or by agreement.`,
    source: "Employment Rights Act 1996", act: "Employment Rights Act 1996", section: "Section 86",
    title: "Minimum notice periods for dismissal and resignation", jurisdiction: "uk",
    url: "https://www.legislation.gov.uk/ukpga/1996/18", year: 1996,
    topics: ["notice period", "dismissal", "employment law", "PILON", "gross misconduct"],
  },

  // ─── Equality Act 2010 ────────────────────────────────────────────────────
  {
    id: "uk-equality-protected",
    text: `EQUALITY ACT 2010 — Protected characteristics and types of discrimination
Protected characteristics: age, disability, gender reassignment, marriage and civil partnership, pregnancy and maternity, race, religion or belief, sex, sexual orientation. Direct discrimination (Section 13): treating someone less favourably because of a protected characteristic. Indirect discrimination (Section 19): applying a provision that disadvantages those sharing a protected characteristic unless objectively justified. Harassment (Section 26): unwanted conduct violating dignity or creating hostile environment. Victimisation (Section 27): treating someone badly because they raised a discrimination complaint.`,
    source: "Equality Act 2010", act: "Equality Act 2010", section: "Sections 4, 13, 19, 26, 27",
    title: "Equality Act — protected characteristics, discrimination, harassment", jurisdiction: "uk",
    url: "https://www.legislation.gov.uk/ukpga/2010/15", year: 2010,
    topics: ["discrimination", "equality", "protected characteristics", "harassment", "race", "disability", "gender", "religion", "employment"],
  },

  // ─── Human Rights Act 1998 ────────────────────────────────────────────────
  {
    id: "uk-hra-rights",
    text: `HUMAN RIGHTS ACT 1998 — Convention rights in UK law
Article 2: Right to life. Article 3: Prohibition of torture, inhuman or degrading treatment. Article 5: Right to liberty — no unlawful arrest or detention; must be brought before a court promptly. Article 6: Right to a fair trial — public hearing within reasonable time by independent tribunal; presumption of innocence. Article 8: Right to private and family life — interference must be lawful, necessary and proportionate. Article 10: Freedom of expression — subject to restrictions protecting reputation, national security, public order. Article 14: Prohibition of discrimination in enjoyment of Convention rights. Claimable against public authorities in UK courts.`,
    source: "Human Rights Act 1998", act: "Human Rights Act 1998", section: "Schedule 1",
    title: "Human rights — life, liberty, fair trial, privacy, free expression", jurisdiction: "uk",
    url: "https://www.legislation.gov.uk/ukpga/1998/42", year: 1998,
    topics: ["human rights", "fair trial", "right to life", "privacy", "freedom of expression", "torture", "liberty"],
  },

  // ─── Consumer Rights Act 2015 ─────────────────────────────────────────────
  {
    id: "uk-cra-rights",
    text: `CONSUMER RIGHTS ACT 2015 — Rights when buying goods, services and digital content
Goods must be: of satisfactory quality (Section 9); fit for purpose (Section 10); as described (Section 11). Within 30 days: right to reject for full refund. After 30 days: right to repair or replacement; if unsuccessful, right to price reduction or final rejection. Services (Section 49) must be performed with reasonable care and skill. If not, consumer can require repeat performance or price reduction. Time for service must be reasonable if not agreed. Digital content must be of satisfactory quality, fit for purpose, and as described.`,
    source: "Consumer Rights Act 2015", act: "Consumer Rights Act 2015", section: "Sections 9-11, 19, 49, 56",
    title: "Consumer rights — faulty goods, poor services, refund rights", jurisdiction: "uk",
    url: "https://www.legislation.gov.uk/ukpga/2015/15", year: 2015,
    topics: ["consumer rights", "refund", "faulty goods", "services", "satisfactory quality", "digital content"],
  },

  // ─── Data Protection Act 2018 / UK GDPR ──────────────────────────────────
  {
    id: "uk-dpa-rights",
    text: `DATA PROTECTION ACT 2018 / UK GDPR — Data subject rights
Right of access (Article 15): Request a copy of your personal data (Subject Access Request) — controller must respond within 1 month at no charge. Right to erasure (Article 17): Have data deleted where no longer necessary, consent withdrawn, or processing unlawful. Right to rectification (Article 16): Correct inaccurate personal data. Right to object (Article 21): Stop processing for direct marketing (absolute right). Lawful bases: consent, contract, legal obligation, vital interests, public task, legitimate interests. ICO enforces: fines up to £17.5 million or 4% of global turnover.`,
    source: "Data Protection Act 2018 / UK GDPR", act: "Data Protection Act 2018", section: "UK GDPR Articles 15-21",
    title: "Data protection — subject access, erasure, rectification", jurisdiction: "uk",
    url: "https://www.legislation.gov.uk/ukpga/2018/12", year: 2018,
    topics: ["data protection", "GDPR", "privacy", "personal data", "subject access request", "right to erasure"],
  },

  // ─── Fraud Act 2006 ───────────────────────────────────────────────────────
  {
    id: "uk-fraud",
    text: `FRAUD ACT 2006 — Fraud offences in England and Wales
Fraud by false representation (Section 2): dishonestly making a false representation intending to make a gain or cause a loss — up to 10 years imprisonment. Fraud by failing to disclose information (Section 3): dishonestly failing to disclose where there is a legal duty to do so. Fraud by abuse of position (Section 4): using a position of trust dishonestly for gain — up to 10 years. Obtaining services dishonestly (Section 11): up to 5 years. Serious or organised fraud prosecuted by Serious Fraud Office.`,
    source: "Fraud Act 2006", act: "Fraud Act 2006", section: "Sections 1-4, 11",
    title: "Fraud — false representation, abuse of position, obtaining services", jurisdiction: "uk",
    url: "https://www.legislation.gov.uk/ukpga/2006/35", year: 2006,
    topics: ["fraud", "criminal law", "false representation", "financial crime", "dishonesty"],
  },

  // ─── Defamation Act 2013 ──────────────────────────────────────────────────
  {
    id: "uk-defamation",
    text: `DEFAMATION ACT 2013 — Defamation law in England and Wales
Section 1: A statement is not defamatory unless it has caused or is likely to cause serious harm to reputation. Section 2: Truth is a complete defence. Section 3: Honest opinion is a defence if the statement is clearly an opinion, on a matter of public interest, and the opinion could have been held on the facts. Section 4: Publication on matter of public interest is a defence. Limitation: 1 year from publication. Libel (written); slander (spoken, usually requires proof of actual damage). Claimant must prove the statement was published, identified them, and was defamatory.`,
    source: "Defamation Act 2013", act: "Defamation Act 2013", section: "Sections 1-5",
    title: "Defamation — libel, slander, serious harm, truth and honest opinion defences", jurisdiction: "uk",
    url: "https://www.legislation.gov.uk/ukpga/2013/26", year: 2013,
    topics: ["defamation", "libel", "slander", "reputation", "serious harm", "civil law"],
  },
];
