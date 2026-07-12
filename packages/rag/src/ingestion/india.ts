import type { LegalDocument } from "../types";

export const INDIA_DOCUMENTS: LegalDocument[] = [
  // ─── Constitution of India, 1950 ─────────────────────────────────────────
  {
    id: "india-const-art14",
    text: `CONSTITUTION OF INDIA, 1950 — Article 14 — Equality before law
The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India.`,
    source: "Constitution of India, 1950", act: "Constitution of India", section: "Article 14",
    title: "Equality before law", jurisdiction: "india", url: "https://www.indiacode.nic.in/handle/123456789/15240", year: 1950,
    topics: ["constitutional law", "equality", "fundamental rights"],
  },
  {
    id: "india-const-art19",
    text: `CONSTITUTION OF INDIA, 1950 — Article 19 — Freedom of speech and expression
All citizens shall have the right to freedom of speech and expression; to assemble peaceably and without arms; to form associations or unions; to move freely throughout India; to reside and settle in any part of India; to practise any profession or carry on any occupation, trade or business. These rights are subject to reasonable restrictions in the interests of sovereignty and integrity of India, public order, decency or morality.`,
    source: "Constitution of India, 1950", act: "Constitution of India", section: "Article 19",
    title: "Freedom of speech, assembly, movement, profession", jurisdiction: "india", url: "https://www.indiacode.nic.in/handle/123456789/15240", year: 1950,
    topics: ["constitutional law", "free speech", "fundamental rights"],
  },
  {
    id: "india-const-art21",
    text: `CONSTITUTION OF INDIA, 1950 — Article 21 — Protection of life and personal liberty
No person shall be deprived of his life or personal liberty except according to procedure established by law. The Supreme Court has interpreted Article 21 to include the right to dignity, privacy (K.S. Puttaswamy v. Union of India, 2017), livelihood, fair trial, legal aid, speedy trial, clean environment, and health.`,
    source: "Constitution of India, 1950", act: "Constitution of India", section: "Article 21",
    title: "Right to life and personal liberty", jurisdiction: "india", url: "https://www.indiacode.nic.in/handle/123456789/15240", year: 1950,
    topics: ["constitutional law", "right to life", "fundamental rights", "privacy"],
  },
  {
    id: "india-const-art22",
    text: `CONSTITUTION OF INDIA, 1950 — Article 22 — Protection against arrest and detention
No person arrested shall be detained without being informed of the grounds of arrest, nor denied the right to consult a legal practitioner. Every arrested person must be produced before the nearest magistrate within 24 hours of arrest. No person can be detained beyond 24 hours without a magistrate's authority.`,
    source: "Constitution of India, 1950", act: "Constitution of India", section: "Article 22",
    title: "Protection against arrest and detention", jurisdiction: "india", url: "https://www.indiacode.nic.in/handle/123456789/15240", year: 1950,
    topics: ["arrest", "detention", "fundamental rights", "criminal procedure"],
  },
  {
    id: "india-const-art32",
    text: `CONSTITUTION OF INDIA, 1950 — Article 32 — Remedies for enforcement of fundamental rights
The right to move the Supreme Court for enforcement of fundamental rights is guaranteed. The Supreme Court may issue writs of habeas corpus, mandamus, prohibition, quo warranto, and certiorari. Dr. B.R. Ambedkar called Article 32 the "heart and soul of the Constitution." Article 226 gives High Courts similar power.`,
    source: "Constitution of India, 1950", act: "Constitution of India", section: "Article 32",
    title: "Remedies — writ jurisdiction", jurisdiction: "india", url: "https://www.indiacode.nic.in/handle/123456789/15240", year: 1950,
    topics: ["writ jurisdiction", "habeas corpus", "Supreme Court", "enforcement"],
  },

  // ─── Hindu Marriage Act, 1955 ─────────────────────────────────────────────
  {
    id: "india-hma-s13",
    text: `HINDU MARRIAGE ACT, 1955 — Section 13 — Divorce
Either party to a marriage may present a petition for divorce on the grounds that the other party: (i) has committed adultery; (ii) has treated the petitioner with cruelty; (iii) has deserted the petitioner for a continuous period of not less than two years; (iv) has ceased to be Hindu by conversion; (v) has been of unsound mind or suffering from mental disorder; (vi) has been suffering from venereal disease in a communicable form; (vii) has renounced the world.
Section 13B — Divorce by mutual consent: Both parties together petition for divorce after living separately for one year. A second motion is filed after 6 months. The court may waive the 6-month cooling period in appropriate cases.`,
    source: "Hindu Marriage Act, 1955", act: "Hindu Marriage Act", section: "Section 13",
    title: "Grounds for divorce", jurisdiction: "india", url: "https://www.indiacode.nic.in/handle/123456789/2187", year: 1955,
    topics: ["divorce", "family law", "marriage", "grounds for divorce", "mutual consent divorce", "Hindu law"],
  },
  {
    id: "india-hma-s24",
    text: `HINDU MARRIAGE ACT, 1955 — Section 24 — Maintenance pendente lite and expenses of proceedings
Where in any proceeding under this Act it appears that either the wife or the husband, as the case may be, has no independent income sufficient for support and necessary expenses of the proceeding, it may, on the application of the wife or the husband, order the respondent to pay to the petitioner the expenses of the proceeding, and monthly maintenance. The amount is determined considering the income of both parties, lifestyle, and needs.`,
    source: "Hindu Marriage Act, 1955", act: "Hindu Marriage Act", section: "Section 24",
    title: "Maintenance pendente lite during divorce proceedings", jurisdiction: "india", url: "https://www.indiacode.nic.in/handle/123456789/2187", year: 1955,
    topics: ["maintenance", "alimony", "divorce", "family law", "interim maintenance", "Hindu law"],
  },
  {
    id: "india-hma-s25",
    text: `HINDU MARRIAGE ACT, 1955 — Section 25 — Permanent alimony and maintenance
Any court exercising jurisdiction under this Act may, at the time of passing any decree or at any time subsequent thereto, on application made to it for the purpose by either the wife or the husband, as the case may be, order that the respondent shall pay to the applicant for her or his maintenance and support such gross sum or such monthly or periodical sum for a term not exceeding the life of the applicant. The court considers: (a) income of both parties; (b) property of both parties; (c) conduct of parties; (d) other just and fair circumstances. Alimony can be modified or rescinded if the recipient remarries or becomes self-sufficient.`,
    source: "Hindu Marriage Act, 1955", act: "Hindu Marriage Act", section: "Section 25",
    title: "Permanent alimony and maintenance after divorce", jurisdiction: "india", url: "https://www.indiacode.nic.in/handle/123456789/2187", year: 1955,
    topics: ["alimony", "permanent alimony", "maintenance", "divorce", "family law", "Hindu law", "spousal support"],
  },
  {
    id: "india-hma-s26",
    text: `HINDU MARRIAGE ACT, 1955 — Section 26 — Custody of children
In any proceeding under this Act, the court may, from time to time, pass such interim orders and make such provisions in the decree as it deems just and proper with respect to the custody, maintenance and education of minor children, consistently with their wishes, wherever possible. The welfare of the child is the paramount consideration. Courts consider: (a) age and sex of child; (b) wishes of child if old enough; (c) financial capacity of each parent; (d) past conduct of parents.`,
    source: "Hindu Marriage Act, 1955", act: "Hindu Marriage Act", section: "Section 26",
    title: "Custody of children during divorce", jurisdiction: "india", url: "https://www.indiacode.nic.in/handle/123456789/2187", year: 1955,
    topics: ["child custody", "divorce", "children", "family law", "Hindu law", "welfare of child"],
  },
  {
    id: "india-hma-s9",
    text: `HINDU MARRIAGE ACT, 1955 — Section 9 — Restitution of conjugal rights
When either the husband or the wife has, without reasonable excuse, withdrawn from the society of the other, the aggrieved party may apply by petition to the district court for restitution of conjugal rights and the court, on being satisfied of the truth of the statements made in such petition, and that there is no legal ground why the application should not be granted, may decree restitution of conjugal rights accordingly.`,
    source: "Hindu Marriage Act, 1955", act: "Hindu Marriage Act", section: "Section 9",
    title: "Restitution of conjugal rights", jurisdiction: "india", url: "https://www.indiacode.nic.in/handle/123456789/2187", year: 1955,
    topics: ["restitution of conjugal rights", "marriage", "family law", "Hindu law"],
  },

  // ─── Hindu Adoption and Maintenance Act, 1956 ────────────────────────────
  {
    id: "india-hama-s18",
    text: `HINDU ADOPTIONS AND MAINTENANCE ACT, 1956 — Section 18 — Maintenance of wife
Subject to the provisions of this section, a Hindu wife, whether married before or after the commencement of this Act, shall be entitled to be maintained by her husband during her lifetime. A Hindu wife shall be entitled to live separately from her husband without forfeiting her claim to maintenance if he is guilty of: (a) desertion; (b) cruelty; (c) leprosy; (d) any other wife or mistress; (e) conversion to another religion; (f) any other cause justifying her living separately.`,
    source: "Hindu Adoptions and Maintenance Act, 1956", act: "Hindu Adoptions and Maintenance Act", section: "Section 18",
    title: "Maintenance of wife", jurisdiction: "india", url: "https://www.indiacode.nic.in/handle/123456789/2187", year: 1956,
    topics: ["maintenance", "wife", "family law", "Hindu law", "alimony", "spousal support"],
  },
  {
    id: "india-hama-s20",
    text: `HINDU ADOPTIONS AND MAINTENANCE ACT, 1956 — Section 20 — Maintenance of children and aged parents
A Hindu is bound to maintain his legitimate or illegitimate children and his aged or infirm parents. A child's right to maintenance continues until the child (if a girl) gets married, or (if a boy) is able to maintain himself. An aged or infirm parent unable to maintain himself or herself is entitled to maintenance from an adult child who is able to maintain such parent.`,
    source: "Hindu Adoptions and Maintenance Act, 1956", act: "Hindu Adoptions and Maintenance Act", section: "Section 20",
    title: "Maintenance of children and aged parents", jurisdiction: "india", url: "https://www.indiacode.nic.in/handle/123456789/2187", year: 1956,
    topics: ["child maintenance", "parental maintenance", "family law", "Hindu law"],
  },
  {
    id: "india-hama-s23",
    text: `HINDU ADOPTIONS AND MAINTENANCE ACT, 1956 — Section 23 — Amount of maintenance
In determining the amount of maintenance, the court shall have due regard to: (a) the position and status of the parties; (b) the reasonable wants of the claimant; (c) if the claimant is living separately, whether the claimant is justified in doing so; (d) the value of the claimant's property and income; (e) the number of persons entitled to maintenance under this Act.`,
    source: "Hindu Adoptions and Maintenance Act, 1956", act: "Hindu Adoptions and Maintenance Act", section: "Section 23",
    title: "Amount of maintenance — factors considered", jurisdiction: "india", url: "https://www.indiacode.nic.in/handle/123456789/2187", year: 1956,
    topics: ["maintenance amount", "alimony quantum", "family law", "Hindu law"],
  },

  // ─── Code of Criminal Procedure — Section 125 ───────────────────────────
  {
    id: "india-crpc-s125",
    text: `CODE OF CRIMINAL PROCEDURE, 1973 (now Bharatiya Nagarik Suraksha Sanhita, 2023 — Section 144)
Section 125 — Order for maintenance of wives, children and parents
If any person having sufficient means neglects or refuses to maintain: (a) his wife, unable to maintain herself; (b) his legitimate or illegitimate minor child, unable to maintain itself; (c) his legitimate or illegitimate child (not being a married daughter) who has attained majority, where such child is, by reason of physical or mental abnormality or injury, unable to maintain itself; (d) his father or mother, unable to maintain himself or herself — a Magistrate of the first class may order such person to make a monthly allowance for the maintenance of his wife or such child, father or mother, at such monthly rate as the Magistrate thinks fit. Maximum maintenance under this section was uncapped after 2001. Section 125 applies to all religions. The wife includes a divorced wife. The proceedings can be initiated in the place where the wife resides.`,
    source: "Code of Criminal Procedure, 1973", act: "Code of Criminal Procedure", section: "Section 125",
    title: "Maintenance of wives, children and parents", jurisdiction: "india", url: "https://www.indiacode.nic.in/handle/123456789/1611", year: 1973,
    topics: ["maintenance", "alimony", "wife", "children", "parents", "family law", "criminal procedure", "all religions"],
  },

  // ─── Hindu Succession Act, 1956 ──────────────────────────────────────────
  {
    id: "india-hsa-s6",
    text: `HINDU SUCCESSION ACT, 1956 — Section 6 — Devolution of interest in coparcenary property
(as amended by Hindu Succession (Amendment) Act, 2005)
On and from 9th September 2005, in a Joint Hindu family governed by the Mitakshara law, the daughter of a coparcener shall by birth become a coparcener in her own right in the same manner as the son. The daughter shall have the same rights in the coparcenary property as she would have had if she had been a son. This right applies even if the father died before 9 September 2005 (Vineeta Sharma v. Rakesh Sharma, Supreme Court 2020). The daughter is also subject to the same liabilities in respect of the said coparcenary property as that of a son.`,
    source: "Hindu Succession Act, 1956", act: "Hindu Succession Act", section: "Section 6",
    title: "Daughter's equal right in ancestral property", jurisdiction: "india", url: "https://www.indiacode.nic.in/handle/123456789/2187", year: 1956,
    topics: ["succession", "inheritance", "ancestral property", "daughter's rights", "coparcenary", "Hindu law"],
  },
  {
    id: "india-hsa-s8",
    text: `HINDU SUCCESSION ACT, 1956 — Section 8 — General rules of succession for males
The property of a male Hindu dying intestate shall devolve according to this section and the rules contained in the Schedule:
Class I heirs (take simultaneously, excluding all others): son, daughter, widow, mother, son of pre-deceased son, daughter of pre-deceased son, son of pre-deceased daughter, daughter of pre-deceased daughter, widow of pre-deceased son, son of pre-deceased son of pre-deceased son, daughter of pre-deceased son of pre-deceased son, widow of pre-deceased son of pre-deceased son.
If there are no Class I heirs, property goes to Class II heirs (father, siblings, etc.), then agnates, then cognates.`,
    source: "Hindu Succession Act, 1956", act: "Hindu Succession Act", section: "Section 8",
    title: "Succession rules for Hindu males — Class I heirs", jurisdiction: "india", url: "https://www.indiacode.nic.in/handle/123456789/2187", year: 1956,
    topics: ["succession", "inheritance", "intestate succession", "Hindu law", "heirs", "property"],
  },
  {
    id: "india-hsa-s15",
    text: `HINDU SUCCESSION ACT, 1956 — Section 15 — General rules of succession for females
Property of a female Hindu dying intestate shall devolve: (a) firstly, upon the sons and daughters (including children of pre-deceased son or daughter) and the husband; (b) secondly, upon the heirs of the husband; (c) thirdly, upon the mother and father; (d) fourthly, upon the heirs of the father; (e) lastly, upon the heirs of the mother. Property inherited from father/father's parents passes to father's heirs if no son/daughter. Property inherited from husband/husband's parents passes to husband's heirs if no son/daughter.`,
    source: "Hindu Succession Act, 1956", act: "Hindu Succession Act", section: "Section 15",
    title: "Succession rules for Hindu females", jurisdiction: "india", url: "https://www.indiacode.nic.in/handle/123456789/2187", year: 1956,
    topics: ["succession", "inheritance", "Hindu female", "intestate succession", "Hindu law"],
  },

  // ─── Transfer of Property Act, 1882 ──────────────────────────────────────
  {
    id: "india-tpa-s54",
    text: `TRANSFER OF PROPERTY ACT, 1882 — Section 54 — Sale defined
"Sale" is a transfer of ownership in exchange for a price paid or promised or part-paid and part-promised. Sale of immovable property of value of Rs.100 or upwards can only be made by a registered instrument. Sale of immovable property of value less than Rs.100 may be made either by registered instrument or by delivery of property. A contract for sale of immoveable property does not, of itself, create interest in or charge on such property.`,
    source: "Transfer of Property Act, 1882", act: "Transfer of Property Act", section: "Section 54",
    title: "Sale of immovable property", jurisdiction: "india", url: "https://www.indiacode.nic.in/handle/123456789/2104", year: 1882,
    topics: ["property law", "sale", "immovable property", "registration", "transfer"],
  },
  {
    id: "india-tpa-s105",
    text: `TRANSFER OF PROPERTY ACT, 1882 — Section 105 — Lease defined
A lease of immoveable property is a transfer of a right to enjoy such property, made for a certain time, express or implied, or in perpetuity, in consideration of a price paid or promised, or of money, a share of crops, service or any other thing of value, to be rendered periodically or on specified occasions to the transferor by the transferee, who accepts the transfer on such terms. The transferor is called the lessor, the transferee is called the lessee, the price is called the premium, and the money, share, service or other thing to be so rendered is called the rent. Lease of immovable property from year to year or for any term exceeding one year can only be made by a registered instrument.`,
    source: "Transfer of Property Act, 1882", act: "Transfer of Property Act", section: "Section 105",
    title: "Lease of immovable property", jurisdiction: "india", url: "https://www.indiacode.nic.in/handle/123456789/2104", year: 1882,
    topics: ["property law", "lease", "rent", "tenancy", "immovable property"],
  },

  // ─── Negotiable Instruments Act, 1881 — Cheque Bounce ───────────────────
  {
    id: "india-nia-s138",
    text: `NEGOTIABLE INSTRUMENTS ACT, 1881 — Section 138 — Dishonour of cheque for insufficiency of funds
Where any cheque drawn by a person for the discharge of any legally enforceable debt or other liability is returned unpaid by the bank (because the amount is insufficient or the amount exceeds the arrangement made), that person shall be deemed to have committed an offence and shall be punished with imprisonment for a term which may be extended to two years, or with fine which may extend to twice the amount of the cheque, or with both. Requirements: (1) cheque must be presented within 3 months; (2) payee must send notice within 30 days of dishonour; (3) drawer must fail to pay within 15 days of notice. Complaint must be filed in court within 30 days of expiry of 15-day notice period.`,
    source: "Negotiable Instruments Act, 1881", act: "Negotiable Instruments Act", section: "Section 138",
    title: "Cheque bounce — dishonour of cheque", jurisdiction: "india", url: "https://www.indiacode.nic.in/handle/123456789/2187", year: 1881,
    topics: ["cheque bounce", "negotiable instruments", "dishonour", "bank", "criminal liability"],
  },

  // ─── Motor Vehicles Act, 1988 ─────────────────────────────────────────────
  {
    id: "india-mva-s166",
    text: `MOTOR VEHICLES ACT, 1988 — Section 166 — Application for compensation (Motor Accident Claims)
An application for compensation arising out of an accident of the nature specified in sub-section (1) of section 165 may be made: (a) by the person who has sustained the injury; (b) by the owner of the property; (c) where death has resulted from the accident, by all or any of the legal representatives of the deceased. The application shall be made to the Claims Tribunal having jurisdiction over the area where the accident occurred or to the Claims Tribunal within whose jurisdiction the claimant resides. There is no limitation period for filing claims (Supreme Court: Rani Gupta v. Union of India). Compensation is calculated on the basis of the victim's age, income and dependency.`,
    source: "Motor Vehicles Act, 1988", act: "Motor Vehicles Act", section: "Section 166",
    title: "Motor accident compensation claims", jurisdiction: "india", url: "https://www.indiacode.nic.in/handle/123456789/1798", year: 1988,
    topics: ["motor accident", "compensation", "personal injury", "claims tribunal", "road accident"],
  },

  // ─── Indian Penal Code ────────────────────────────────────────────────────
  {
    id: "india-ipc-s302",
    text: `INDIAN PENAL CODE, 1860 — Section 302 — Punishment for murder
Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine. Murder (Section 300) is culpable homicide when done with intent to cause death, or intent to cause bodily injury likely to cause death, or with knowledge that the act is imminently dangerous and must in all probability cause death.`,
    source: "Indian Penal Code, 1860", act: "Indian Penal Code", section: "Section 302",
    title: "Punishment for murder", jurisdiction: "india", url: "https://www.indiacode.nic.in/handle/123456789/2128", year: 1860,
    topics: ["murder", "criminal law", "punishment", "IPC", "capital punishment"],
  },
  {
    id: "india-ipc-s376",
    text: `INDIAN PENAL CODE, 1860 — Section 376 — Punishment for rape
Minimum punishment: rigorous imprisonment of 7 years (may extend to life imprisonment) plus fine. Aggravated forms (gang rape, rape of minor, rape by public servant) carry minimum 10 years to life. Section 375 defines rape as sexual intercourse by a man with a woman against her will, without her consent, or with consent obtained by fear, fraud or intoxication, or with a woman under 18 years of age.`,
    source: "Indian Penal Code, 1860", act: "Indian Penal Code", section: "Section 376",
    title: "Punishment for rape", jurisdiction: "india", url: "https://www.indiacode.nic.in/handle/123456789/2128", year: 1860,
    topics: ["rape", "sexual assault", "criminal law", "IPC", "punishment", "women's rights"],
  },
  {
    id: "india-ipc-s420",
    text: `INDIAN PENAL CODE, 1860 — Section 420 — Cheating
Whoever cheats and thereby dishonestly induces the person deceived to deliver any property, shall be punished with imprisonment up to 7 years and fine. Section 415 defines cheating as deceiving any person fraudulently or dishonestly to deliver property or do something that causes harm to body, mind, reputation or property.`,
    source: "Indian Penal Code, 1860", act: "Indian Penal Code", section: "Section 420",
    title: "Cheating and fraud", jurisdiction: "india", url: "https://www.indiacode.nic.in/handle/123456789/2128", year: 1860,
    topics: ["cheating", "fraud", "criminal law", "IPC", "property offences"],
  },
  {
    id: "india-ipc-s498a",
    text: `INDIAN PENAL CODE, 1860 — Section 498A — Cruelty by husband or relatives
Whoever, being the husband or relative of the husband of a woman, subjects her to cruelty shall be punished with imprisonment up to 3 years and fine. "Cruelty" means: (a) wilful conduct likely to drive the woman to suicide or cause grave injury; (b) harassment to coerce her to meet unlawful demands for property or dowry. The offence is cognizable and non-bailable.`,
    source: "Indian Penal Code, 1860", act: "Indian Penal Code", section: "Section 498A",
    title: "Cruelty by husband or relatives — domestic cruelty", jurisdiction: "india", url: "https://www.indiacode.nic.in/handle/123456789/2128", year: 1983,
    topics: ["domestic violence", "cruelty", "matrimonial offences", "husband", "dowry harassment"],
  },
  {
    id: "india-ipc-s378",
    text: `INDIAN PENAL CODE, 1860 — Sections 378–379 — Theft
Section 378: Whoever intending to take dishonestly any moveable property out of the possession of any person without that person's consent, moves that property, commits theft. Section 379: Punishment for theft — imprisonment up to 3 years, or fine, or both. Aggravated theft (Section 380 — theft in dwelling house) carries up to 7 years.`,
    source: "Indian Penal Code, 1860", act: "Indian Penal Code", section: "Sections 378-379",
    title: "Theft", jurisdiction: "india", url: "https://www.indiacode.nic.in/handle/123456789/2128", year: 1860,
    topics: ["theft", "criminal law", "property offences", "IPC"],
  },

  // ─── Contract Act ─────────────────────────────────────────────────────────
  {
    id: "india-contract-s10",
    text: `INDIAN CONTRACT ACT, 1872 — Section 10 — What agreements are contracts
All agreements are contracts if made by free consent of parties competent to contract, for a lawful consideration, with a lawful object, and not expressly declared void. Essential elements: (1) offer and acceptance; (2) free consent (not coerced, unduly influenced, fraudulent or mistaken); (3) competency (majority, sound mind); (4) lawful consideration; (5) lawful object; (6) not expressly void.`,
    source: "Indian Contract Act, 1872", act: "Indian Contract Act", section: "Section 10",
    title: "What agreements are contracts", jurisdiction: "india", url: "https://www.indiacode.nic.in/handle/123456789/2187", year: 1872,
    topics: ["contract law", "agreements", "commercial law"],
  },
  {
    id: "india-contract-s73",
    text: `INDIAN CONTRACT ACT, 1872 — Section 73 — Compensation for breach of contract
When a contract has been broken, the party who suffers from such breach is entitled to receive compensation for any loss or damage caused which naturally arose from the breach, or which the parties knew, when they made the contract, to be likely to result from the breach. Such compensation is not to be given for remote and indirect loss or damage. Section 74: If a sum is named in the contract as the amount to be paid in case of breach, the party complaining receives reasonable compensation not exceeding the penalty.`,
    source: "Indian Contract Act, 1872", act: "Indian Contract Act", section: "Section 73",
    title: "Compensation for loss or damage on breach of contract", jurisdiction: "india", url: "https://www.indiacode.nic.in/handle/123456789/2187", year: 1872,
    topics: ["breach of contract", "compensation", "damages", "contract law"],
  },

  // ─── Consumer Protection Act, 2019 ───────────────────────────────────────
  {
    id: "india-consumer-s35",
    text: `CONSUMER PROTECTION ACT, 2019 — Filing a consumer complaint
A consumer may file a complaint with the District Consumer Commission (claims up to Rs. 1 crore), State Consumer Commission (Rs. 1–10 crore), or National Consumer Commission (above Rs. 10 crore). Complaints can be filed electronically. Time limit: within 2 years of the cause of action (with power to condone delay). Reliefs available: replacement or repair of goods, refund of price, removal of deficiency, cessation of unfair trade practice, discontinuance of restrictive trade practice, compensation for loss or injury, punitive damages.`,
    source: "Consumer Protection Act, 2019", act: "Consumer Protection Act", section: "Section 35",
    title: "Filing consumer complaint — jurisdiction and relief", jurisdiction: "india", url: "https://consumeraffairs.nic.in", year: 2019,
    topics: ["consumer complaint", "consumer forum", "defect", "deficiency", "consumer rights", "refund"],
  },

  // ─── RTI Act ──────────────────────────────────────────────────────────────
  {
    id: "india-rti-s3",
    text: `RIGHT TO INFORMATION ACT, 2005
Section 3: All citizens have the right to information. Section 6: Request to CPIO/SPIO in writing or electronically with fee. Section 7: Information to be provided within 30 days (48 hours if life or liberty is involved). Section 8: Exemptions include national security, cabinet deliberations, personal information, trade secrets. Second appeal lies to Central/State Information Commission. Penalty for failure: Rs. 250 per day up to Rs. 25,000.`,
    source: "Right to Information Act, 2005", act: "Right to Information Act", section: "Sections 3, 6, 7, 8",
    title: "Right to information — procedure and exemptions", jurisdiction: "india", url: "https://www.indiacode.nic.in/handle/123456789/2021", year: 2005,
    topics: ["RTI", "transparency", "government information", "public authority"],
  },

  // ─── Protection of Women from Domestic Violence Act, 2005 ────────────────
  {
    id: "india-dv-s3",
    text: `PROTECTION OF WOMEN FROM DOMESTIC VIOLENCE ACT, 2005 — Section 3 — Definition of domestic violence
Domestic violence includes: physical abuse (assault, hurt, threat); sexual abuse; verbal and emotional abuse (insults, humiliation, threats); economic abuse (denial of financial resources, disposal of assets). Section 12: An aggrieved woman can apply to Magistrate for protection order, residence order, monetary relief, custody order, or compensation order. Section 23: Magistrate may pass ex parte interim protection order.`,
    source: "Protection of Women from Domestic Violence Act, 2005", act: "Protection of Women from Domestic Violence Act", section: "Section 3",
    title: "Definition of domestic violence and remedies", jurisdiction: "india", url: "https://www.indiacode.nic.in/handle/123456789/2021", year: 2005,
    topics: ["domestic violence", "protection order", "women's rights", "family law", "abuse"],
  },

  // ─── Labour Law ───────────────────────────────────────────────────────────
  {
    id: "india-id-s25f",
    text: `INDUSTRIAL DISPUTES ACT, 1947 — Section 25F — Conditions for retrenchment
No workman employed for not less than one year shall be retrenched until: (a) one month's written notice with reasons has been given, or wages in lieu thereof paid; (b) compensation of 15 days' average pay for every completed year of service has been paid; (c) notice served on the appropriate government. "Retrenchment" means termination for any reason other than disciplinary action, voluntary retirement, superannuation, or non-renewal of contract.`,
    source: "Industrial Disputes Act, 1947", act: "Industrial Disputes Act", section: "Section 25F",
    title: "Conditions for retrenchment — notice and compensation", jurisdiction: "india", url: "https://www.indiacode.nic.in/handle/123456789/1552", year: 1947,
    topics: ["retrenchment", "labour law", "termination", "employment", "workmen", "notice period"],
  },
  {
    id: "india-gratuity-s4",
    text: `PAYMENT OF GRATUITY ACT, 1972 — Section 4 — Payment of gratuity
Gratuity shall be payable to an employee on termination of his employment after he has rendered continuous service for not less than 5 years: on superannuation, retirement, resignation, death, or disablement. Gratuity = 15/26 × last drawn salary × completed years of service. Maximum gratuity is Rs. 20 lakhs (as amended). In case of death or disablement, 5-year minimum service is not required. Gratuity is fully exempt from income tax (for government employees; up to Rs. 20 lakhs for private employees).`,
    source: "Payment of Gratuity Act, 1972", act: "Payment of Gratuity Act", section: "Section 4",
    title: "Gratuity — eligibility and calculation", jurisdiction: "india", url: "https://www.indiacode.nic.in/handle/123456789/2187", year: 1972,
    topics: ["gratuity", "labour law", "employment benefits", "retirement", "termination"],
  },

  // ─── Information Technology Act, 2000 ────────────────────────────────────
  {
    id: "india-it-s66",
    text: `INFORMATION TECHNOLOGY ACT, 2000 — Cyber offences
Section 66: Computer related offences (hacking) — imprisonment up to 3 years or fine up to Rs. 5 lakh or both. Section 66C: Identity theft — imprisonment up to 3 years and fine up to Rs. 1 lakh. Section 66D: Cheating by impersonation using computer — imprisonment up to 3 years and fine up to Rs. 1 lakh. Section 67: Publishing obscene material electronically — up to 3 years on first conviction. Section 66E: Violation of privacy (publishing private images) — imprisonment up to 3 years or fine up to Rs. 2 lakh.`,
    source: "Information Technology Act, 2000", act: "Information Technology Act", section: "Sections 66, 66C, 66D, 66E, 67",
    title: "Cyber crimes and digital offences", jurisdiction: "india", url: "https://www.indiacode.nic.in/handle/123456789/1999", year: 2000,
    topics: ["cyber law", "hacking", "identity theft", "online crimes", "privacy violation", "IT Act"],
  },

  // ─── Rent Control / Tenancy ───────────────────────────────────────────────
  {
    id: "india-rent-model",
    text: `MODEL TENANCY ACT, 2021 — Key provisions on renting property in India
Security deposit: Maximum 2 months' rent for residential property, 6 months for non-residential property. Rent Agreement: Must be in writing and registered with the Rent Authority. Rent increase: Landlord must give 3 months' notice before increasing rent. Eviction: Landlord can seek eviction if tenant (a) defaults in rent for 2 months; (b) misuses premises; (c) sublets without consent; (d) premises needed for landlord's own use; (e) building requires demolition. Eviction process is through the Rent Court. Landlord cannot cut off essential services (water, electricity) to force eviction.`,
    source: "Model Tenancy Act, 2021", act: "Model Tenancy Act", section: "Sections 4, 11, 21",
    title: "Tenancy rights — rent, deposit, eviction", jurisdiction: "india", url: "https://mohua.gov.in", year: 2021,
    topics: ["tenancy", "rent", "landlord", "tenant rights", "eviction", "security deposit", "rental property"],
  },

  // ─── Income Tax Act ───────────────────────────────────────────────────────
  {
    id: "india-income-tax-s80c",
    text: `INCOME TAX ACT, 1961 — Section 80C — Deductions from total income
Deduction up to Rs. 1,50,000 per year for: life insurance premiums, PPF (Public Provident Fund), ELSS mutual funds, tuition fees for children, home loan principal repayment, NSC (National Savings Certificates), 5-year bank FD, Sukanya Samriddhi Yojana. Section 80D: Premium for health insurance — deduction up to Rs. 25,000 (Rs. 50,000 for senior citizens). Section 24(b): Interest on housing loan — deduction up to Rs. 2 lakh for self-occupied property. Standard deduction for salaried employees: Rs. 50,000.`,
    source: "Income Tax Act, 1961", act: "Income Tax Act", section: "Section 80C",
    title: "Tax deductions — 80C, 80D, housing loan interest", jurisdiction: "india", url: "https://www.incometax.gov.in", year: 1961,
    topics: ["income tax", "tax deductions", "80C", "PPF", "insurance", "home loan", "tax savings"],
  },
];
