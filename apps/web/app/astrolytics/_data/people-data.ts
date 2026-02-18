import type { Person } from "../_lib/types";

const saNames: { name: string; email: string; profession: string; age: string; membership: string; plan: string }[] = [
  { name: "Dr. Sipho Nkosi", email: "sipho.nkosi@medpractice.co.za", profession: "Doctor", age: "42", membership: "Core", plan: "Premium" },
  { name: "Adv. Naledi Mokoena", email: "naledi.mokoena@lawchambers.co.za", profession: "Lawyer", age: "38", membership: "Core", plan: "Premium" },
  { name: "Thandi van der Merwe CA(SA)", email: "thandi.vdm@accounting.co.za", profession: "Accountant", age: "45", membership: "Core", plan: "Premium" },
  { name: "Dr. Pieter Botha", email: "pieter.botha@hospital.co.za", profession: "Doctor", age: "55", membership: "Core", plan: "Premium" },
  { name: "Adv. Lerato Dlamini", email: "lerato.dlamini@legal.co.za", profession: "Lawyer", age: "33", membership: "New", plan: "Free" },
  { name: "Zanele Mthembu CA(SA)", email: "zanele.mthembu@audit.co.za", profession: "Accountant", age: "36", membership: "Core", plan: "Premium" },
  { name: "Eng. Johan Pretorius", email: "johan.pretorius@engineering.co.za", profession: "Engineer", age: "48", membership: "Core", plan: "Premium" },
  { name: "Dr. Nomsa Khumalo", email: "nomsa.khumalo@clinic.co.za", profession: "Doctor", age: "40", membership: "New", plan: "Free" },
  { name: "Adv. Bongani Zulu", email: "bongani.zulu@advocates.co.za", profession: "Lawyer", age: "52", membership: "Core", plan: "Premium" },
  { name: "Fatima Patel CA(SA)", email: "fatima.patel@taxconsult.co.za", profession: "Accountant", age: "34", membership: "New", plan: "Free" },
  { name: "Dr. André Joubert", email: "andre.joubert@medspecialist.co.za", profession: "Doctor", age: "58", membership: "Core", plan: "Premium" },
  { name: "Eng. Palesa Molefe", email: "palesa.molefe@civileng.co.za", profession: "Engineer", age: "31", membership: "New", plan: "Free" },
  { name: "Adv. Kofi Mensah", email: "kofi.mensah@lawfirm.co.za", profession: "Lawyer", age: "44", membership: "Core", plan: "Premium" },
  { name: "Themba Ndlovu CA(SA)", email: "themba.ndlovu@financials.co.za", profession: "Accountant", age: "50", membership: "Core", plan: "Premium" },
  { name: "Dr. Lindiwe Sithole", email: "lindiwe.sithole@healthcentre.co.za", profession: "Doctor", age: "37", membership: "New", plan: "Free" },
  { name: "Eng. Willem Erasmus", email: "willem.erasmus@structeng.co.za", profession: "Engineer", age: "46", membership: "Core", plan: "Premium" },
  { name: "Adv. Ayanda Ngcobo", email: "ayanda.ngcobo@chambers.co.za", profession: "Lawyer", age: "41", membership: "Core", plan: "Premium" },
  { name: "Relebohile Tau CA(SA)", email: "relebohile.tau@advisory.co.za", profession: "Accountant", age: "39", membership: "New", plan: "Free" },
  { name: "Dr. Christo van Zyl", email: "christo.vanzyl@surgeons.co.za", profession: "Doctor", age: "62", membership: "Core", plan: "Premium" },
  { name: "Eng. Nompumelelo Shabalala", email: "nompumelelo.s@mecheng.co.za", profession: "Engineer", age: "35", membership: "New", plan: "Free" },
  { name: "Adv. Tshepo Mahlangu", email: "tshepo.mahlangu@litigation.co.za", profession: "Lawyer", age: "47", membership: "Core", plan: "Premium" },
  { name: "Dr. Priya Naidoo", email: "priya.naidoo@paediatrician.co.za", profession: "Doctor", age: "43", membership: "Core", plan: "Premium" },
  { name: "Sizwe Maseko CA(SA)", email: "sizwe.maseko@corporatefin.co.za", profession: "Accountant", age: "53", membership: "Core", plan: "Premium" },
  { name: "Eng. Francois du Plessis", email: "francois.dp@electrical.co.za", profession: "Engineer", age: "56", membership: "Core", plan: "Premium" },
  { name: "Adv. Zodwa Mkhize", email: "zodwa.mkhize@familylaw.co.za", profession: "Lawyer", age: "36", membership: "New", plan: "Free" },
  { name: "Dr. Kabelo Motshegare", email: "kabelo.m@orthopaedics.co.za", profession: "Doctor", age: "49", membership: "Core", plan: "Premium" },
  { name: "Nandi Cele CA(SA)", email: "nandi.cele@auditors.co.za", profession: "Accountant", age: "32", membership: "New", plan: "Free" },
  { name: "Eng. Musa Dube", email: "musa.dube@minengineer.co.za", profession: "Engineer", age: "44", membership: "Core", plan: "Premium" },
  { name: "Adv. Helena Brink", email: "helena.brink@commercial.co.za", profession: "Lawyer", age: "51", membership: "Core", plan: "Premium" },
  { name: "Dr. Tebogo Setlhare", email: "tebogo.setlhare@gp.co.za", profession: "Doctor", age: "39", membership: "New", plan: "Free" },
  { name: "Mpho Modise CA(SA)", email: "mpho.modise@taxpartner.co.za", profession: "Accountant", age: "47", membership: "Core", plan: "Premium" },
  { name: "Eng. Anele Xaba", email: "anele.xaba@chemeng.co.za", profession: "Engineer", age: "33", membership: "New", plan: "Free" },
  { name: "Adv. Jacques Fourie", email: "jacques.fourie@criminallaw.co.za", profession: "Lawyer", age: "59", membership: "Core", plan: "Premium" },
  { name: "Dr. Busisiwe Mabaso", email: "busisiwe.mabaso@dermatology.co.za", profession: "Doctor", age: "41", membership: "Core", plan: "Premium" },
  { name: "Lungelo Khoza CA(SA)", email: "lungelo.khoza@assurance.co.za", profession: "Accountant", age: "30", membership: "New", plan: "Free" },
  { name: "Eng. Anika Steyn", email: "anika.steyn@enviroeng.co.za", profession: "Engineer", age: "38", membership: "Core", plan: "Premium" },
  { name: "Adv. Sandile Mthethwa", email: "sandile.m@labourlaw.co.za", profession: "Lawyer", age: "45", membership: "Core", plan: "Premium" },
  { name: "Dr. Refilwe Moloto", email: "refilwe.moloto@psychiatry.co.za", profession: "Doctor", age: "54", membership: "Core", plan: "Premium" },
  { name: "Ismail Moosa CA(SA)", email: "ismail.moosa@corporateadvisory.co.za", profession: "Accountant", age: "48", membership: "Core", plan: "Premium" },
  { name: "Eng. Thabo Lekota", email: "thabo.lekota@projecteng.co.za", profession: "Engineer", age: "42", membership: "New", plan: "Free" },
  { name: "Adv. Dineo Rapoo", email: "dineo.rapoo@constitutionallaw.co.za", profession: "Lawyer", age: "37", membership: "New", plan: "Free" },
  { name: "Dr. Marco Petersen", email: "marco.petersen@cardiology.co.za", profession: "Doctor", age: "60", membership: "Core", plan: "Premium" },
  { name: "Yolandi Kruger CA(SA)", email: "yolandi.kruger@forensicacc.co.za", profession: "Accountant", age: "35", membership: "New", plan: "Free" },
  { name: "Eng. Sibusiso Nxumalo", email: "sibusiso.n@telecoms.co.za", profession: "Engineer", age: "50", membership: "Core", plan: "Premium" },
  { name: "Adv. Grace Osei", email: "grace.osei@iprights.co.za", profession: "Lawyer", age: "34", membership: "New", plan: "Free" },
  { name: "Dr. Zinhle Gumede", email: "zinhle.gumede@anaesthetics.co.za", profession: "Doctor", age: "46", membership: "Core", plan: "Premium" },
  { name: "Tumelo Phiri CA(SA)", email: "tumelo.phiri@managementacc.co.za", profession: "Accountant", age: "43", membership: "Core", plan: "Premium" },
  { name: "Eng. Liezel van Wyk", email: "liezel.vw@watereng.co.za", profession: "Engineer", age: "40", membership: "Core", plan: "Premium" },
  { name: "Adv. Mandla Buthelezi", email: "mandla.b@propertylaw.co.za", profession: "Lawyer", age: "57", membership: "Core", plan: "Premium" },
  { name: "Dr. Amahle Zungu", email: "amahle.zungu@radiology.co.za", profession: "Doctor", age: "36", membership: "New", plan: "Free" },
];

const eventTypes = ["gocard_completed", "path_started", "evidence_uploaded", "cv_builder_used", "mi_chat_opened", "milestone_completed", "mydna_updated", "portfolio_viewed"];

function generatePerson(index: number): Person {
  const profile = saNames[index]!;
  const id = `usr_${(1000 + index).toString(36)}`;
  const events = Math.floor(Math.random() * 350) + 20;
  const sessions = Math.floor(events / (3 + Math.random() * 5));
  const isActive = Math.random() > 0.25;
  const daysAgo = isActive ? Math.floor(Math.random() * 5) : Math.floor(Math.random() * 45) + 7;

  const activityData = Array.from({ length: 14 }, (_, i) => {
    const d = new Date("2026-02-03");
    d.setDate(d.getDate() + i);
    const dayOfWeek = d.getDay();
    // Professionals less active on weekends
    const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.3 : 1;
    return {
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      events: Math.floor(Math.random() * (isActive ? 25 : 4) * weekendFactor),
    };
  });

  const recentEvents = Array.from({ length: 8 }, (_, i) => {
    const d = new Date("2026-02-17");
    d.setDate(d.getDate() - i);
    // Professionals active 7am-9pm, peak at lunch and evening
    const hour = Math.random() > 0.5
      ? Math.floor(Math.random() * 3) + 12  // Lunch: 12-14
      : Math.floor(Math.random() * 3) + 18; // Evening: 18-20
    d.setHours(hour, Math.floor(Math.random() * 60));
    return {
      event: eventTypes[Math.floor(Math.random() * eventTypes.length)]!,
      timestamp: d.toISOString(),
    };
  });

  const isPremium = profile.plan === "Premium";
  const isCore = profile.membership === "Core";

  return {
    id,
    name: profile.name,
    email: profile.email,
    firstSeen: new Date(
      isCore ? 2025 : 2026,
      isCore ? Math.floor(Math.random() * 8) : Math.floor(Math.random() * 2),
      Math.floor(Math.random() * 28) + 1
    ).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    lastSeen: `${daysAgo === 0 ? "Today" : daysAgo === 1 ? "Yesterday" : `${daysAgo}d ago`}`,
    eventCount30d: events,
    sessionCount: sessions,
    country: "South Africa",
    status: isActive ? "active" : "inactive",
    properties: {
      Profession: profile.profession,
      "Age": profile.age,
      "Membership Type": profile.membership,
      Plan: profile.plan,
      Province: ["Gauteng", "Western Cape", "KwaZulu-Natal", "Eastern Cape", "Free State", "Limpopo", "Mpumalanga", "North West", "Northern Cape"][Math.floor(Math.random() * 9)]!,
    },
    recentEvents,
    cohorts: [
      ...(isCore ? ["Core Members"] : ["New Users"]),
      ...(isPremium ? ["Premium"] : []),
      ...(events > 150 ? ["Active Learners"] : []),
      ...(Math.random() > 0.6 ? ["CV Builder Users"] : []),
    ],
    featureFlags: [
      { name: "ai-cv-builder-v2", value: isPremium || Math.random() > 0.5 },
      { name: "mi-career-coach", value: true },
      { name: "evidence-auto-tag", value: Math.random() > 0.85 },
    ],
    activityData,
  };
}

export const people: Person[] = Array.from({ length: 50 }, (_, i) => generatePerson(i));
