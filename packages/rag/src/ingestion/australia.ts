import type { LegalDocument } from "../types";

export const AUSTRALIA_DOCUMENTS: LegalDocument[] = [
  // ─── Australian Constitution, 1901 ───────────────────────────────────────
  {
    id: "au-const-s51",
    text: `COMMONWEALTH OF AUSTRALIA CONSTITUTION ACT, 1901
Section 51 — Legislative powers of the Parliament

The Parliament shall, subject to this Constitution, have power to make laws for the peace, order, and good government of the Commonwealth with respect to:—
  (i.) Trade and commerce with other countries, and among the States;
  (ii.) Taxation; but so as not to discriminate between States or parts of States;
  (v.) Postal, telegraphic, telephonic, and other like services;
  (vi.) The naval and military defence of the Commonwealth and of the several States, and the control of the forces to execute and maintain the laws of the Commonwealth;
  (xiii.) Banking, other than State banking; also State banking extending beyond the limits of the State concerned, the incorporation of banks, and the issue of paper money;
  (xix.) Naturalization and aliens;
  (xx.) Foreign corporations, and trading or financial corporations formed within the limits of the Commonwealth;
  (xxix.) External affairs;
  (xxxv.) Conciliation and arbitration for the prevention and settlement of industrial disputes extending beyond the limits of any one State;
  (xxxix.) Matters incidental to the execution of any power vested by this Constitution in the Parliament or in either House thereof, or in the Government of the Commonwealth, or in the Federal Judicature, or in any department or officer of the Commonwealth.`,
    source: "Commonwealth of Australia Constitution Act, 1901",
    act: "Australian Constitution",
    section: "Section 51",
    title: "Legislative powers of the Parliament",
    jurisdiction: "australia",
    url: "https://www.legislation.gov.au/Details/C2013Q00005",
    year: 1901,
    topics: ["constitutional law", "Commonwealth powers", "legislative powers", "federalism"],
  },
  {
    id: "au-const-s109",
    text: `COMMONWEALTH OF AUSTRALIA CONSTITUTION ACT, 1901
Section 109 — Inconsistency of laws

When a law of a State is inconsistent with a law of the Commonwealth, the latter shall prevail, and the former shall, to the extent of the inconsistency, be invalid.

This is the federal inconsistency doctrine. Where Commonwealth law "covers the field" of a subject matter, State law in the same area is invalid to the extent of inconsistency.

Section 116 — Commonwealth not to legislate in respect of religion:
The Commonwealth shall not make any law for establishing any religion, or for imposing any religious observance, or for prohibiting the free exercise of any religion, and no religious test shall be required as a qualification for any office or public trust under the Commonwealth.`,
    source: "Commonwealth of Australia Constitution Act, 1901",
    act: "Australian Constitution",
    section: "Sections 109 and 116",
    title: "Inconsistency of State and Commonwealth laws; freedom of religion",
    jurisdiction: "australia",
    url: "https://www.legislation.gov.au/Details/C2013Q00005",
    year: 1901,
    topics: ["constitutional law", "federalism", "inconsistency", "freedom of religion"],
  },

  // ─── Fair Work Act 2009 (Cth) ────────────────────────────────────────────
  {
    id: "au-fwa-s385",
    text: `FAIR WORK ACT 2009 (Cth)
Section 385 — What is an unfair dismissal

A person has been unfairly dismissed if the Fair Work Commission is satisfied that:
  (a) the person has been dismissed; and
  (b) the dismissal was harsh, unjust or unreasonable; and
  (c) the dismissal was not consistent with the Small Business Fair Dismissal Code; and
  (d) the dismissal was not a case of genuine redundancy.

Section 387 — Criteria for considering whether dismissal is harsh, unjust or unreasonable:
In considering whether it is satisfied that a dismissal was harsh, unjust or unreasonable, the Commission must take into account:
  (a) whether there was a valid reason for the dismissal related to the person's capacity or conduct (including its effect on the safety and welfare of other employees);
  (b) whether the person was notified of that reason;
  (c) whether the person was given an opportunity to respond to any reason related to the capacity or conduct of the person;
  (d) any unreasonable refusal by the employer to allow the person to have a support person present to assist at any discussions relating to dismissal;
  (e) if the dismissal related to unsatisfactory performance — whether the person had been warned about that unsatisfactory performance before the dismissal;
  (f) the degree to which the size of the employer's enterprise would be likely to impact on the procedures followed in effecting the dismissal;
  (g) the degree to which the absence of dedicated human resource management specialists or expertise in the enterprise would be likely to impact on the procedures followed in effecting the dismissal;
  (h) any other matters that the Commission considers relevant.`,
    source: "Fair Work Act 2009 (Cth)",
    act: "Fair Work Act",
    section: "Sections 385 and 387",
    title: "Unfair dismissal — definition and criteria",
    jurisdiction: "australia",
    url: "https://www.legislation.gov.au/Details/C2023C00086",
    year: 2009,
    topics: ["employment law", "unfair dismissal", "Fair Work Commission", "termination"],
  },
  {
    id: "au-fwa-nes",
    text: `FAIR WORK ACT 2009 (Cth)
National Employment Standards (NES) — Sections 59–131

The NES are 11 minimum employment entitlements that cannot be displaced by enterprise agreements or awards:

1. Maximum weekly hours: 38 hours plus reasonable additional hours (s.62)
2. Requests for flexible working arrangements (s.65)
3. Parental leave and related entitlements: up to 12 months unpaid (s.67)
4. Annual leave: 4 weeks per year for full-time employees; 5 weeks for shift workers (s.87)
5. Personal/carer's leave and compassionate leave: 10 days paid personal leave per year (s.96)
6. Community service leave (s.108)
7. Long service leave (s.113)
8. Public holidays (s.114)
9. Notice of termination and redundancy pay (s.117): minimum 1 week for service less than 1 year; increases to 4 weeks for 5+ years; over 45 with 2+ years' service: additional 1 week
10. Fair Work Information Statement (s.125)
11. Superannuation: employers must pay superannuation guarantee (currently 11.5% of ordinary time earnings) into the employee's nominated fund under the Superannuation Guarantee (Administration) Act 1992.`,
    source: "Fair Work Act 2009 (Cth)",
    act: "Fair Work Act",
    section: "National Employment Standards (ss.59–131)",
    title: "National Employment Standards — minimum entitlements",
    jurisdiction: "australia",
    url: "https://www.legislation.gov.au/Details/C2023C00086",
    year: 2009,
    topics: ["employment law", "NES", "minimum entitlements", "annual leave", "parental leave", "notice period"],
  },
  {
    id: "au-fwa-redundancy",
    text: `FAIR WORK ACT 2009 (Cth)
Section 119 — Redundancy pay entitlement

(1) An employee is entitled to be paid redundancy pay by the employer if the employee's employment is terminated:
  (a) at the employer's initiative because the employer no longer requires the job done by the employee to be done by anyone, except where this is due to the ordinary and customary turnover of labour; or
  (b) because of the insolvency or bankruptcy of the employer.

Redundancy pay scale (based on completed years of continuous service):
  1–2 years: 4 weeks' pay
  2–3 years: 6 weeks' pay
  3–4 years: 7 weeks' pay
  4–5 years: 8 weeks' pay
  5–6 years: 10 weeks' pay
  6–7 years: 11 weeks' pay
  7–8 years: 13 weeks' pay
  8–9 years: 14 weeks' pay
  9–10 years: 16 weeks' pay
  10+ years: 12 weeks' pay

Section 121: Does not apply to employees of small business employers (fewer than 15 employees).

Genuine redundancy: A dismissal is a genuine redundancy if the employer no longer required the job to be performed AND consulted with the employee as required by any applicable award or enterprise agreement.`,
    source: "Fair Work Act 2009 (Cth)",
    act: "Fair Work Act",
    section: "Sections 119–121",
    title: "Redundancy pay entitlement",
    jurisdiction: "australia",
    url: "https://www.legislation.gov.au/Details/C2023C00086",
    year: 2009,
    topics: ["employment law", "redundancy", "redundancy pay", "termination"],
  },

  // ─── Australian Consumer Law (Competition and Consumer Act 2010, Schedule 2) ─
  {
    id: "au-acl-s18",
    text: `AUSTRALIAN CONSUMER LAW (Competition and Consumer Act 2010, Cth — Schedule 2)
Section 18 — Misleading or deceptive conduct

(1) A person must not, in trade or commerce, engage in conduct that is misleading or deceptive or is likely to mislead or deceive.
(2) Nothing in Part 2-1 limits by implication anything in this section.

This is the most frequently litigated provision in Australian consumer law. It applies to businesses and individuals. Silence can constitute misleading conduct if there was an obligation to disclose. There is no requirement for intention or negligence.

Section 29 — False or misleading representations about goods or services:
A person must not, in trade or commerce, in connection with the supply or possible supply of goods or services or in connection with the promotion by any means of the supply or use of goods or services: make a false or misleading representation about the quality, value, price or nature of the goods or services.

Remedies: injunction, damages, compensation orders, non-party redress orders. Penalties for businesses: up to $50 million or 3 times the benefit obtained or 30% of adjusted turnover.`,
    source: "Australian Consumer Law (Competition and Consumer Act 2010, Cth — Schedule 2)",
    act: "Australian Consumer Law",
    section: "Section 18",
    title: "Misleading or deceptive conduct",
    jurisdiction: "australia",
    url: "https://www.legislation.gov.au/Details/C2023C00106",
    year: 2010,
    topics: ["consumer law", "misleading conduct", "deceptive conduct", "trade and commerce", "ACL"],
  },
  {
    id: "au-acl-s51-54",
    text: `AUSTRALIAN CONSUMER LAW (Competition and Consumer Act 2010, Cth — Schedule 2)
Section 51 — Guarantee as to title (goods acquired by supply)
There is a guarantee that the supplier has the right to supply the goods.

Section 54 — Guarantee as to acceptable quality
(1) If a person supplies, in trade or commerce, goods to a consumer, there is a guarantee that the goods are of acceptable quality.
(2) Goods are of acceptable quality if they are as:
  (a) fit for all the purposes for which goods of that kind are commonly supplied; and
  (b) acceptable in appearance and finish; and
  (c) free from defects; and
  (d) safe; and
  (e) durable; as a reasonable consumer fully acquainted with the state and condition of the goods (including any hidden defects of the goods), would regard as acceptable having regard to the circumstances.

Section 55 — Guarantee as to fitness for any disclosed purpose:
If the consumer makes known to the supplier the particular purpose for which the goods are being acquired, there is a guarantee that the goods are reasonably fit for that purpose.

Section 59 — Guarantee as to repairs and spare parts (manufacturer's guarantee).

Section 60 — Services: guarantee of due care and skill.
Section 61 — Services: guarantee of fitness for purpose.`,
    source: "Australian Consumer Law (Competition and Consumer Act 2010, Cth — Schedule 2)",
    act: "Australian Consumer Law",
    section: "Sections 51, 54–55, 60–61",
    title: "Consumer guarantees for goods and services",
    jurisdiction: "australia",
    url: "https://www.legislation.gov.au/Details/C2023C00106",
    year: 2010,
    topics: ["consumer law", "consumer guarantees", "acceptable quality", "goods", "services", "ACL"],
  },
  {
    id: "au-acl-s259",
    text: `AUSTRALIAN CONSUMER LAW (Competition and Consumer Act 2010, Cth — Schedule 2)
Section 259 — Action against supplier if guarantee contravened

(1) A consumer may take action against a supplier of goods in accordance with this Subdivision if any of the following guarantees are not complied with:
  (a) the guarantee under section 54 (acceptable quality);
  (b) the guarantee under section 55 (fitness for disclosed purpose);
  (c) the guarantee under section 56 (correspondence with description);
  (d) the guarantee under section 57 (correspondence with sample or demonstration model).

Remedies:
(a) Major failure: the consumer is entitled to choose a refund OR replacement of goods of the same type of similar value. A "major failure" is where: goods are not of acceptable quality and would not have been acquired if the consumer knew of the failure; goods are substantially unfit for purpose; goods are unsafe.
(b) Minor failure: the consumer may require the supplier to repair or replace the goods or refund the price within a reasonable time.

Section 267 — Action against manufacturer if guarantee contravened:
A consumer may also claim compensation from the manufacturer (not just the supplier) for consequential losses.`,
    source: "Australian Consumer Law (Competition and Consumer Act 2010, Cth — Schedule 2)",
    act: "Australian Consumer Law",
    section: "Sections 259 and 267",
    title: "Remedies for breach of consumer guarantees — refund, repair, replacement",
    jurisdiction: "australia",
    url: "https://www.legislation.gov.au/Details/C2023C00106",
    year: 2010,
    topics: ["consumer law", "remedies", "refund", "replacement", "repair", "consumer guarantees", "ACL"],
  },

  // ─── Privacy Act 1988 (Cth) ──────────────────────────────────────────────
  {
    id: "au-privacy-apps",
    text: `PRIVACY ACT 1988 (Cth)
Australian Privacy Principles (Schedule 1)

The 13 Australian Privacy Principles (APPs) apply to APP entities (Australian Government agencies and private sector organisations with turnover of $3 million+, as well as some smaller businesses with health information):

APP 1 — Open and transparent management of personal information
APP 2 — Anonymity and pseudonymity: individuals must have the option of not identifying themselves
APP 3 — Collection of solicited personal information: must be reasonably necessary
APP 4 — Dealing with unsolicited personal information
APP 5 — Notification of the collection of personal information
APP 6 — Use or disclosure of personal information: only for the primary purpose of collection
APP 7 — Direct marketing: individuals may opt out
APP 8 — Cross-border disclosure of personal information
APP 9 — Adoption, use or disclosure of government related identifiers
APP 10 — Quality of personal information: must be accurate, up-to-date and complete
APP 11 — Security of personal information: must be protected from misuse, interference, loss and unauthorised access
APP 12 — Access to personal information: individuals have a right of access
APP 13 — Correction of personal information

The Office of the Australian Information Commissioner (OAIC) enforces the Privacy Act. Serious or repeated breaches can result in civil penalties of up to $2.22 million for individuals and $50 million for organisations.`,
    source: "Privacy Act 1988 (Cth)",
    act: "Privacy Act",
    section: "Schedule 1 — Australian Privacy Principles",
    title: "Australian Privacy Principles",
    jurisdiction: "australia",
    url: "https://www.legislation.gov.au/Details/C2023C00113",
    year: 1988,
    topics: ["privacy law", "personal information", "data protection", "Australian Privacy Principles", "OAIC"],
  },

  // ─── Corporations Act 2001 (Cth) ─────────────────────────────────────────
  {
    id: "au-corps-s181",
    text: `CORPORATIONS ACT 2001 (Cth)
Section 181 — Good faith — civil obligations

(1) A director or other officer of a corporation must exercise their powers and discharge their duties:
  (a) in good faith in the best interests of the corporation; and
  (b) for a proper purpose.

Section 182 — Use of position — civil obligations:
A director, other officer or employee of a corporation must not improperly use their position to: (a) gain an advantage for themselves or someone else; or (b) cause detriment to the corporation.

Section 183 — Use of information — civil obligations:
A person who obtains information because they are, or have been, a director or other officer or employee of a corporation must not improperly use the information to: (a) gain an advantage; or (b) cause detriment.

Section 180 — Care and diligence — civil obligation:
A director or other officer of a corporation must exercise their powers and discharge their duties with the degree of care and diligence that a reasonable person would exercise if they were a director or officer of a corporation in the corporation's circumstances.

Business Judgment Rule (s.180(2)): A director who makes a business judgment is taken to have met the duty of care and diligence if they: (a) made the judgment in good faith; (b) did not have a material personal interest in the subject matter; (c) informed themselves to the extent they reasonably believed appropriate; and (d) rationally believed the judgment was in the best interests of the corporation.`,
    source: "Corporations Act 2001 (Cth)",
    act: "Corporations Act",
    section: "Sections 180–183",
    title: "Directors' duties — care, good faith, use of position and information",
    jurisdiction: "australia",
    url: "https://www.legislation.gov.au/Details/C2023C00107",
    year: 2001,
    topics: ["corporations law", "directors' duties", "good faith", "business judgment rule", "fiduciary duties"],
  },

  // ─── Residential Tenancies ────────────────────────────────────────────────
  {
    id: "au-rta-nsw",
    text: `RESIDENTIAL TENANCIES ACT 2010 (NSW) — Tenant and landlord rights
Fixed-term tenancy may be ended at expiry with 14–90 days notice depending on circumstances. Periodic tenancy: tenant can end with 21 days notice; landlord can end without grounds with 90 days notice (reform to abolish no-grounds eviction ongoing). Rent increases: maximum once per 12 months with 60 days written notice. Bond: maximum 4 weeks rent (or 6 weeks for rent over $1,400/week) lodged with NSW Fair Trading. Landlord must keep premises in good repair and fit for habitation. Tenants may apply to NSW Civil and Administrative Tribunal (NCAT) for disputes. Urgent repairs must be actioned immediately; non-urgent repairs within a reasonable time.`,
    source: "Residential Tenancies Act 2010 (NSW)", act: "Residential Tenancies Act 2010", section: "Key provisions",
    title: "Tenancy — notice, bond, repairs, disputes (NSW Australia)", jurisdiction: "australia",
    url: "https://www.legislation.nsw.gov.au/view/html/inforce/current/act-2010-042", year: 2010,
    topics: ["tenancy", "rent", "bond", "eviction", "landlord", "tenant rights", "NSW", "Australia"],
  },

  // ─── Family Law Act 1975 (Cth) ───────────────────────────────────────────
  {
    id: "au-fla-s48-divorce",
    text: `FAMILY LAW ACT 1975 (Cth) — Section 48 — Divorce (dissolution of marriage)
Australia has a single ground for divorce: irretrievable breakdown of the marriage, established by 12 months' separation. The parties may live separately under the same roof during the separation period (the court must be satisfied they actually lived as separated). Section 55A: court must be satisfied proper arrangements have been made for any children under 18 before granting divorce. Applications are made to the Federal Circuit and Family Court of Australia (FCFCOA) and can be filed by one or both parties. The divorce order takes effect one month and one day after it is made.`,
    source: "Family Law Act 1975 (Cth)", act: "Family Law Act 1975", section: "Sections 48 and 55A",
    title: "Divorce in Australia — irretrievable breakdown, 12 months separation", jurisdiction: "australia",
    url: "https://www.legislation.gov.au/Details/C2022C00164", year: 1975,
    topics: ["divorce", "family law", "separation", "marriage breakdown", "FCFCOA", "Australia"],
  },
  {
    id: "au-fla-s74-maintenance",
    text: `FAMILY LAW ACT 1975 (Cth) — Sections 72 and 74 — Spousal maintenance (alimony)
Section 72: A party to a marriage is liable to maintain the other party to the extent that the first-mentioned party is reasonably able to do so, if and only if, the other party is unable to support herself or himself adequately. Section 74: Court may make an order for maintenance, taking into account: age and health of parties; income, property and financial resources; ability to work (including child care responsibilities); duration of marriage and standard of living; commitments of the party to support others; eligibility for social security; and any other relevant factor. Maintenance can be periodic, lump sum, or by transfer of property. Section 83: Court may discharge, suspend, revive or vary a maintenance order if circumstances change.`,
    source: "Family Law Act 1975 (Cth)", act: "Family Law Act 1975", section: "Sections 72, 74 and 83",
    title: "Spousal maintenance (alimony) — eligibility, amount, variation (Australia)", jurisdiction: "australia",
    url: "https://www.legislation.gov.au/Details/C2022C00164", year: 1975,
    topics: ["spousal maintenance", "alimony", "family law", "support", "maintenance order", "Australia"],
  },
  {
    id: "au-fla-s79-property",
    text: `FAMILY LAW ACT 1975 (Cth) — Section 79 — Property settlement
On breakdown of a marriage the court may make orders to alter the interests of the parties in property. The court applies a four-step process: (1) identify the asset pool — all property, liabilities and financial resources of both parties; (2) assess the contributions of each party — financial contributions (income, inheritance), non-financial contributions (improvements to property), and homemaking/parenting contributions; (3) consider future needs factors — age, health, earning capacity, care of children, standard of living; (4) assess whether the order is just and equitable overall. There is no automatic 50/50 split. Superannuation is treated as property and can be split (Superannuation splitting order). Section 90B/90C: Binding Financial Agreements (pre-nups and post-nups) can pre-empt court orders if they meet formal requirements.`,
    source: "Family Law Act 1975 (Cth)", act: "Family Law Act 1975", section: "Section 79",
    title: "Property settlement — asset pool, contributions, future needs (Australia)", jurisdiction: "australia",
    url: "https://www.legislation.gov.au/Details/C2022C00164", year: 1975,
    topics: ["property settlement", "asset division", "family law", "superannuation", "contributions", "Australia"],
  },
  {
    id: "au-child-support",
    text: `CHILD SUPPORT (ASSESSMENT) ACT 1989 (Cth) — Child support formula
Child support is calculated by Services Australia using a formula. Key elements: both parents' taxable incomes; the costs of raising children (Costs of Children table indexed annually); the percentage of time each parent cares for the child (care percentage). A parent with less than 35% overnight care pays child support; the primary carer has 65%+ care. The formula calculates each parent's income percentage and care percentage, then determines liability. Child support continues until the child turns 18 or completes secondary school. Parents may enter Limited Child Support Agreements or Binding Child Support Agreements as alternatives. The Child Support Assessment Act 1989 and the Child Support (Registration and Collection) Act 1988 together govern collection and enforcement.`,
    source: "Child Support (Assessment) Act 1989 (Cth)", act: "Child Support (Assessment) Act 1989", section: "Key provisions",
    title: "Child support — formula, care percentages, agreements (Australia)", jurisdiction: "australia",
    url: "https://www.legislation.gov.au/Series/C2004A03772", year: 1989,
    topics: ["child support", "family law", "maintenance", "children", "care percentage", "Australia"],
  },

  {
    id: "au-fla-s60cc",
    text: `FAMILY LAW ACT 1975 (Cth)
Section 60CC — How a court determines what is in a child's best interests

(1) Subject to subsection (5), in determining what is in the child's best interests, the court must consider the matters set out in subsections (2) and (3).
(2) The primary considerations are:
  (a) the benefit to the child of having a meaningful relationship with both of the child's parents; and
  (b) the need to protect the child from physical or psychological harm from being subjected to, or exposed to, abuse, neglect or family violence.
  Note: If there is any conflict between the primary considerations in applying them to the facts of a particular case, the court is to give greater weight to the consideration in paragraph (b).
(3) Additional considerations include:
  (a) any views expressed by the child and any factors (such as the child's maturity or level of understanding) that the court thinks are relevant to the weight it should give to the child's views;
  (b) the nature of the relationship of the child with each of the child's parents and other persons;
  (c) the extent to which each of the child's parents has taken, or failed to take, the opportunity to participate in making decisions about major long-term issues in relation to the child;
  (d) the likely effect of any changes in the child's circumstances, including the likely effect on the child of any separation from either parent;
  (e) the practical difficulty and expense of a child spending time with and communicating with a parent and whether that difficulty or expense will substantially affect the child's right to maintain personal relations and direct contact with both parents on a regular basis.`,
    source: "Family Law Act 1975 (Cth)",
    act: "Family Law Act",
    section: "Section 60CC",
    title: "Best interests of the child — parenting arrangements",
    jurisdiction: "australia",
    url: "https://www.legislation.gov.au/Details/C2023C00108",
    year: 1975,
    topics: ["family law", "parenting", "best interests of child", "custody", "divorce"],
  },
];
