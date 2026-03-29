import Navbar from "../../components/Navbar/Navbar";
import TeamDepartment from "../../components/Team/TeamDepartment";

/** Photos: explicit `imagePath` matches files in public/images/Team. */
const sectors = [
  {
    sectorName: "Co-leads",
    description: "Lead and organize all sectors of FraserHacks to bring you this hackathon.",
    teamMembers: [
      {
        name: "Darsh Gupta",
        position: "Co-lead",
        email: "1023835@pdsb.net",
        instagramUrl: "https://www.instagram.com/darshg321/",
        imagePath: "/images/Team/darsh.jpg",
        roleTier: "lead",
      },
      {
        name: "James Lian",
        position: "Co-lead",
        email: "755833@pdsb.net",
        instagramUrl: "https://www.instagram.com/james.lian._/",
        imagePath: "/images/Team/james.jpg",
        roleTier: "lead",
      },
    ],
  },
  {
    sectorName: "Finance + Outreach",
    description:
      "Budgeting, sponsorship outreach, and financial planning for the event.",
    teamMembers: [
      {
        name: "Irene Wang",
        position: "Director",
        email: "899545@pdsb.net",
        instagramUrl: "https://www.instagram.com/_irene.exe/",
        imagePath: "/images/Team/irene.jpg",
        roleTier: "sectorDirector",
      },
      {
        name: "Rachael Lu",
        position: "Assistant Director",
        email: "788826@pdsb.net",
        instagramUrl: "https://www.instagram.com/rachaelglu_/",
        imagePath: "/images/Team/racheal.jpg",
        roleTier: "assistantDirector",
      },
      {
        name: "Johnson Yu",
        position: "Member",
        email: "867570@pdsb.net",
        instagramUrl: "https://www.instagram.com/johnson.yu_0/",
        imagePath: "/images/Team/johnson.webp",
        roleTier: "member",
      },
      {
        name: "Jeff Duan",
        position: "Member",
        email: "866516@pdsb.net",
        instagramUrl: "https://www.instagram.com/linakrbcsfrbe/",
        imagePath: "/images/Team/jeff.webp",
        roleTier: "member",
      },
      {
        name: "Janeen Ragheb",
        position: "Member",
        email: "1027864@pdsb.net",
        roleTier: "member",
      },
      {
        name: "Aditi Panchakshikar",
        position: "Member",
        email: "767669@pdsb.net",
        roleTier: "member",
      },
    ],
  },
  {
    sectorName: "Marketing",
    description: "Outreach, branding, and promotion across channels. Maggie designed all our beautiful merch!",
    teamMembers: [
      {
        name: "Amrita",
        position: "Director",
        email: "782630@pdsb.net",
        instagramUrl: "https://www.instagram.com/4mr1ta/",
        imagePath: "/images/Team/amrita.jpg",
        roleTier: "sectorDirector",
      },
      {
        name: "Maggie",
        position: "Lead Designer",
        email: "760897@pdsb.net",
        imagePath: "/images/Team/ying.webp",
        roleTier: "assistantDirector",
      },
      {
        name: "Arjita",
        position: "Member",
        email: "890323@pdsb.net",
        roleTier: "member",
      },
      {
        name: "Scarlet Hao",
        position: "Member",
        email: "812129@pdsb.net",
        roleTier: "member",
      },
      {
        name: "Zoya Chaudary",
        position: "Member",
        email: "898056@pdsb.net",
        instagramUrl: "https://www.instagram.com/zfc_.09/",
        imagePath: "/images/Team/zoya.jpg",
        roleTier: "member",
      },
      {
        name: "Emma Le Kay",
        position: "Member",
        email: "906065@pdsb.net",
        roleTier: "member",
      },
    ],
  },
  {
    sectorName: "Logistics",
    description: "Event layout, operations, and day-of coordination.",
    teamMembers: [
      {
        name: "Danny",
        position: "Director",
        email: "1021722@pdsb.net",
        instagramUrl: "https://www.instagram.com/danny.k_777/",
        imagePath: "/images/Team/danny.jpg",
        roleTier: "sectorDirector",
      },
      {
        name: "Jia",
        position: "Assistant Director",
        email: "782425@pdsb.net",
        instagramUrl: "https://www.instagram.com/itsacedar_/",
        imagePath: "/images/Team/jia.jpg",
        roleTier: "assistantDirector",
      },
      {
        name: "Aryan Mittal",
        position: "Member",
        email: "755089@pdsb.net",
        instagramUrl: "https://www.instagram.com/rishu_rishu2022/",
        roleTier: "member",
      },
      {
        name: "Muskaan Bansal",
        position: "Member",
        email: "816186@pdsb.net",
        roleTier: "member",
      },
      {
        name: "Anish Sinha Roy",
        position: "Member",
        email: "898849@pdsb.net",
        instagramUrl: "https://www.instagram.com/anishsinharoy02/",
        roleTier: "member",
      },
      {
        name: "Rifa Saeed",
        position: "Member",
        email: "772313@pdsb.net",
        imagePath: "/images/Team/rifa.webp",
        roleTier: "member",
      },
      {
        name: "John Sun",
        position: "Member",
        email: "753737@pdsb.net",
        instagramUrl: "https://www.instagram.com/darkest_sun99/",
        roleTier: "member",
      },
      {
        name: "Clinton Chung",
        position: "Member",
        email: "761325@pdsb.net",
        instagramUrl: "https://www.instagram.com/clinterz1/",
        imagePath: "/images/Team/clinton.webp",
        roleTier: "member",
      },
      {
        name: "Mohammad Rayyan",
        position: "Member",
        email: "845331@pdsb.net",
        instagramUrl: "https://www.instagram.com/mo_ray2010/",
        roleTier: "member",
      },
    ],
  },
  {
    sectorName: "Tech",
    description: "Website, registration, attendance, and technical support for the hackathon. lonely section 😔",
    teamMembers: [
      {
        name: "Jason Chou",
        position: "Director",
        email: "778130@pdsb.net",
        instagramUrl: "https://www.instagram.com/jason_chou0105/",
        imagePath: "/images/Team/jason.jpg",
        roleTier: "sectorDirector",
      },
    ],
  },
  {
    sectorName: "Volunteers",
    description: "Volunteers helping run FraserHacks and organize all the hackers.",
    teamMembers: [
      {
        name: "John Sun",
        position: "Volunteer",
        email: "753737@pdsb.net",
        instagramUrl: "https://www.instagram.com/darkest_sun99/",
        roleTier: "member",
      },
      {
        name: "Catherine Luo",
        position: "Volunteer",
        email: "821448@pdsb.net",
        instagramUrl: "https://www.instagram.com/cathluo4444/",
        imagePath: "/images/Team/catherine.jpg",
        roleTier: "member",
      },
      {
        name: "Kagetsugu Suzuki",
        position: "Volunteer",
        email: "779345@pdsb.net",
        instagramUrl: "https://www.instagram.com/kag.suguzuki/",
        imagePath: "/images/Team/kagetsugu.jpg",
        roleTier: "member",
      },
      {
        name: "Justin Deng",
        position: "Volunteer",
        email: "780748@pdsb.net",
        instagramUrl: "https://www.instagram.com/justindeng_09/",
        imagePath: "/images/Team/justindeng.jpg",
        roleTier: "member",
      },
    ],
  },
];

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="flex flex-col items-center px-4 pb-20 pt-24 md:pt-28">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-200 via-fuchsia-400 to-purple-400 md:text-4xl">
            Our Team!!
          </h1>
          <p className="mt-2 max-w-lg text-sm text-white/55">
            Meet the people behind FraserHacks.
          </p>
        </div>
        <div id="team" className="flex w-full max-w-7xl flex-col">
          {sectors.map((sector) => (
            <TeamDepartment key={sector.sectorName} teamSector={sector} />
          ))}
        </div>
      </main>
    </div>
  );
}
