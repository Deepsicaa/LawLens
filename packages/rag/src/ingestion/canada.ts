import type { LegalDocument } from "../types";

export const CANADA_DOCUMENTS: LegalDocument[] = [
  // ─── Canadian Charter of Rights and Freedoms ─────────────────────────────
  {
    id: "ca-charter-s1",
    text: `CANADIAN CHARTER OF RIGHTS AND FREEDOMS, 1982 — Section 1 — Reasonable limits
The Charter guarantees rights and freedoms subject only to such reasonable limits prescribed by law as can be demonstrably justified in a free and democratic society (the Oakes test). Section 2: Fundamental freedoms — freedom of conscience, thought, belief, opinion and expression, peaceful assembly, and association. Section 7: Right to life, liberty and security of the person, not to be deprived except in accordance with the principles of fundamental justice.`,
    source: "Canadian Charter of Rights and Freedoms, 1982", act: "Canadian Charter of Rights and Freedoms", section: "Sections 1, 2, 7",
    title: "Charter rights — fundamental freedoms, life and liberty", jurisdiction: "canada",
    url: "https://laws-lois.justice.gc.ca/eng/const/page-12.html", year: 1982,
    topics: ["charter rights", "freedom of expression", "freedom of religion", "life liberty security", "constitutional law"],
  },
  {
    id: "ca-charter-s8-11",
    text: `CANADIAN CHARTER OF RIGHTS AND FREEDOMS — Sections 8–11 — Legal Rights
Section 8: Right to be secure against unreasonable search or seizure. Section 9: Right not to be arbitrarily detained or imprisoned. Section 10: On arrest or detention — right to be informed of reasons; right to retain and instruct counsel without delay; right to habeas corpus. Section 11: Rights of persons charged with an offence — to be tried within a reasonable time; presumption of innocence; right not to be tried or punished twice for the same offence (double jeopardy); right to a jury trial for offences with imprisonment of 5+ years.`,
    source: "Canadian Charter of Rights and Freedoms, 1982", act: "Canadian Charter of Rights and Freedoms", section: "Sections 8-11",
    title: "Legal rights — search and seizure, detention, right to counsel, fair trial", jurisdiction: "canada",
    url: "https://laws-lois.justice.gc.ca/eng/const/page-12.html", year: 1982,
    topics: ["search and seizure", "detention", "right to counsel", "fair trial", "presumption of innocence", "criminal law"],
  },
  {
    id: "ca-charter-s15",
    text: `CANADIAN CHARTER OF RIGHTS AND FREEDOMS — Section 15 — Equality rights
Every individual is equal before and under the law and has the right to equal protection and benefit of the law without discrimination based on race, national or ethnic origin, colour, religion, sex, age, or mental or physical disability. Section 24: Anyone whose Charter rights are infringed may apply to a court for such remedy as the court considers appropriate and just in the circumstances, including exclusion of evidence (Section 24(2)).`,
    source: "Canadian Charter of Rights and Freedoms, 1982", act: "Canadian Charter of Rights and Freedoms", section: "Sections 15 and 24",
    title: "Equality rights and Charter remedies", jurisdiction: "canada",
    url: "https://laws-lois.justice.gc.ca/eng/const/page-12.html", year: 1982,
    topics: ["equality", "discrimination", "charter remedies", "exclusion of evidence", "constitutional law"],
  },

  // ─── Divorce Act ──────────────────────────────────────────────────────────
  {
    id: "ca-divorce-s8",
    text: `DIVORCE ACT, R.S.C. 1985, c. 3 (2nd Supp.) — Grounds for divorce
There is only one ground for divorce in Canada: marriage breakdown. Breakdown is established by: (a) separation for at least one year (most common); (b) adultery; (c) physical or mental cruelty. The one-year separation can be established even if the spouses live under the same roof. No reconciliation attempt defeats the petition if it was less than 90 days. The 2020 amendments to the Act introduced best interests of the child provisions and the family violence consideration.`,
    source: "Divorce Act, R.S.C. 1985", act: "Divorce Act", section: "Section 8",
    title: "Grounds for divorce in Canada — separation, adultery, cruelty", jurisdiction: "canada",
    url: "https://laws-lois.justice.gc.ca/eng/acts/D-3.4/", year: 1985,
    topics: ["divorce", "family law", "marriage breakdown", "separation", "Canada"],
  },
  {
    id: "ca-divorce-s15-2",
    text: `DIVORCE ACT — Section 15.2 — Spousal support order
A court may make an order for one spouse to pay support to the other spouse. Objectives of spousal support: (a) recognise economic advantages and disadvantages arising from the marriage or its breakdown; (b) apportion between spouses any financial consequences arising from care of children; (c) relieve economic hardship arising from the breakdown; (d) promote economic self-sufficiency within a reasonable period of time. The Spousal Support Advisory Guidelines (SSAGs) provide ranges for amount and duration (not binding but widely used). Factors include: income of both parties, length of marriage, roles during marriage, childcare responsibilities.`,
    source: "Divorce Act, R.S.C. 1985", act: "Divorce Act", section: "Section 15.2",
    title: "Spousal support — objectives, amount and duration", jurisdiction: "canada",
    url: "https://laws-lois.justice.gc.ca/eng/acts/D-3.4/", year: 1985,
    topics: ["spousal support", "alimony", "divorce", "family law", "maintenance", "Canada"],
  },
  {
    id: "ca-divorce-s16",
    text: `DIVORCE ACT — Section 16 — Parenting orders and best interests of the child
The court shall take into consideration only the best interests of the child of the marriage in making a parenting order or contact order. Best interests factors (Section 16(3)): (a) child's needs, given age and stage of development; (b) nature and strength of child's relationship with parents, siblings; (c) each parent's willingness to support the child's relationship with the other parent; (d) history of care of the child; (e) child's views and preferences; (f) cultural, linguistic, religious and spiritual upbringing; (g) any family violence and its impact.`,
    source: "Divorce Act, R.S.C. 1985", act: "Divorce Act", section: "Section 16",
    title: "Child custody and parenting orders — best interests of the child", jurisdiction: "canada",
    url: "https://laws-lois.justice.gc.ca/eng/acts/D-3.4/", year: 1985,
    topics: ["child custody", "parenting order", "best interests", "family law", "Canada", "family violence"],
  },

  // ─── Criminal Code of Canada ──────────────────────────────────────────────
  {
    id: "ca-cc-assault",
    text: `CRIMINAL CODE OF CANADA — Sections 265–268 — Assault offences
Section 265: Assault — applying force to another person intentionally, without consent; threatening or attempting to apply force; accosting or impeding another while openly wearing or carrying a weapon. Section 266: Simple assault — summary or indictable offence, up to 5 years. Section 267: Assault with a weapon or causing bodily harm — up to 10 years. Section 268: Aggravated assault (wounds, maims, disfigures, endangers life) — up to 14 years. Section 271: Sexual assault — up to 10 years. Section 272: Sexual assault with a weapon — up to 14 years.`,
    source: "Criminal Code of Canada, R.S.C. 1985, c. C-46", act: "Criminal Code of Canada", section: "Sections 265-268",
    title: "Assault offences — simple, bodily harm, aggravated, sexual assault", jurisdiction: "canada",
    url: "https://laws-lois.justice.gc.ca/eng/acts/C-46/", year: 1985,
    topics: ["assault", "criminal law", "bodily harm", "sexual assault", "Canada"],
  },
  {
    id: "ca-cc-theft-fraud",
    text: `CRIMINAL CODE OF CANADA — Theft and fraud offences
Section 322: Theft — fraudulently and without colour of right taking anything with intent to deprive. Section 334: Punishment — theft over $5,000 is indictable (up to 10 years); theft under $5,000 is hybrid (up to 2 years). Section 380: Fraud — by deceit, falsehood or fraudulent means defrauding the public or any person of property, money or valuable security. Fraud over $5,000: up to 14 years. Fraud under $5,000: up to 2 years. Section 343: Robbery — theft using violence or threats — up to life imprisonment.`,
    source: "Criminal Code of Canada, R.S.C. 1985, c. C-46", act: "Criminal Code of Canada", section: "Sections 322, 334, 380",
    title: "Theft and fraud — offences and punishments", jurisdiction: "canada",
    url: "https://laws-lois.justice.gc.ca/eng/acts/C-46/", year: 1985,
    topics: ["theft", "fraud", "criminal law", "property offences", "Canada"],
  },
  {
    id: "ca-cc-homicide",
    text: `CRIMINAL CODE OF CANADA — Homicide and murder
Section 229: Culpable homicide is murder when: (a) intended to cause death; (b) intended to cause bodily harm likely to cause death and is reckless; (c) during the commission of certain listed offences. Section 235: First degree murder — planned and deliberate, or while committing hijacking, sexual assault, kidnapping, hostage-taking, terrorism — mandatory life imprisonment with no parole for 25 years. Second degree murder — all other murder — mandatory life with no parole for 10–25 years. Section 234: Manslaughter — culpable homicide not amounting to murder — up to life imprisonment.`,
    source: "Criminal Code of Canada, R.S.C. 1985, c. C-46", act: "Criminal Code of Canada", section: "Sections 229, 234, 235",
    title: "Murder — first degree, second degree and manslaughter", jurisdiction: "canada",
    url: "https://laws-lois.justice.gc.ca/eng/acts/C-46/", year: 1985,
    topics: ["murder", "homicide", "manslaughter", "criminal law", "Canada"],
  },

  // ─── Canada Labour Code ───────────────────────────────────────────────────
  {
    id: "ca-labour-termination",
    text: `CANADA LABOUR CODE, R.S.C. 1985, c. L-2 — Termination and unjust dismissal
Section 230: Notice of termination — employers must provide written notice or pay in lieu. Notice required: 2 weeks after 3 months; longer notice tied to service. Section 240: Unjust dismissal complaint — employees with 12+ months' service who are not managers may file a complaint if dismissed without just cause. Remedies include reinstatement, compensation for lost wages, and other relief. Adjudicators have wide remedial powers. Just cause for dismissal includes serious misconduct, repeated performance issues after warnings, and fundamental breach of trust.`,
    source: "Canada Labour Code, R.S.C. 1985, c. L-2", act: "Canada Labour Code", section: "Sections 230 and 240",
    title: "Termination notice and unjust dismissal — federal employees", jurisdiction: "canada",
    url: "https://laws-lois.justice.gc.ca/eng/acts/L-2/", year: 1985,
    topics: ["termination", "unjust dismissal", "labour law", "employment", "notice", "Canada federal"],
  },

  // ─── PIPEDA / Privacy ─────────────────────────────────────────────────────
  {
    id: "ca-pipeda",
    text: `PERSONAL INFORMATION PROTECTION AND ELECTRONIC DOCUMENTS ACT (PIPEDA), S.C. 2000, c. 5
Key principles: (1) Accountability — organisation responsible for personal information under its control; (2) Identifying purposes — purpose identified at time of collection; (3) Consent — knowledge and consent required for collection, use, disclosure; (4) Limiting collection — only what is necessary; (5) Limiting use and disclosure — only for identified purposes; (6) Accuracy — information must be accurate; (7) Safeguards — appropriate security measures; (8) Openness; (9) Individual access — right to access and correct personal information; (10) Challenging compliance. Privacy Commissioner of Canada enforces. Replaced in provinces with substantially similar legislation.`,
    source: "Personal Information Protection and Electronic Documents Act (PIPEDA), S.C. 2000, c. 5", act: "PIPEDA", section: "Schedule 1",
    title: "Privacy rights — consent, access, and data protection (PIPEDA)", jurisdiction: "canada",
    url: "https://laws-lois.justice.gc.ca/eng/acts/P-8.6/", year: 2000,
    topics: ["privacy", "personal information", "data protection", "PIPEDA", "consent", "Canada"],
  },

  // ─── Residential Tenancies (Ontario) ────────────────────────────────────
  {
    id: "ca-ont-rta",
    text: `RESIDENTIAL TENANCIES ACT, 2006 (Ontario) — Key tenant and landlord rights
Rent increases: landlord may increase rent once per year with 90 days' notice, limited to the rent increase guideline set by the province. Eviction grounds include: non-payment of rent (N4 notice, 14 days to pay or vacate); interference with reasonable enjoyment; illegal act; damage; landlord's own use (60 days' notice after N12 form). Eviction requires a hearing at the Landlord and Tenant Board (LTB). Tenant can dispute at LTB. Security deposit: maximum is one month's rent (last month's rent deposit). Landlord must maintain property in a good state of repair, fit for habitation.`,
    source: "Residential Tenancies Act, 2006 (Ontario)", act: "Residential Tenancies Act", section: "Key provisions",
    title: "Tenant and landlord rights — rent, eviction, repairs (Ontario)", jurisdiction: "canada",
    url: "https://www.ontario.ca/laws/statute/06r17", year: 2006,
    topics: ["tenancy", "rent", "eviction", "landlord", "tenant rights", "Ontario", "LTB"],
  },

  // ─── Income Tax Act Canada ────────────────────────────────────────────────
  {
    id: "ca-ita-basics",
    text: `INCOME TAX ACT, R.S.C. 1985, c. 1 (5th Supp.) — Basic provisions
Canada uses a progressive federal income tax system: 15% on first $55,867; 20.5% on $55,867–$111,733; 26% on $111,733–$154,906; 29% on $154,906–$220,000; 33% above $220,000 (2024 rates). Basic Personal Amount: $15,705 (2024) — non-refundable tax credit reducing federal tax. RRSP (Registered Retirement Savings Plan): contributions deductible, contribution room is 18% of prior year earned income to annual maximum. TFSA (Tax-Free Savings Account): contributions not deductible but income earned and withdrawals are tax-free. Capital gains: 50% inclusion rate (proposed 2/3 for gains over $250,000 from June 2024).`,
    source: "Income Tax Act, R.S.C. 1985", act: "Income Tax Act", section: "Key provisions",
    title: "Income tax — rates, RRSP, TFSA, capital gains (Canada)", jurisdiction: "canada",
    url: "https://laws-lois.justice.gc.ca/eng/acts/I-3.3/", year: 1985,
    topics: ["income tax", "RRSP", "TFSA", "capital gains", "tax rates", "Canada"],
  },
];
