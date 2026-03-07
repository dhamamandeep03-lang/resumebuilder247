"use client";

import { useState } from "react";

export default function ResumeBuilder() {

  const [profileMode, setProfileMode] = useState("fresher");
  const [selectedTemplate, setSelectedTemplate] = useState("template_corporate_premium");
  const [loading, setLoading] = useState(false);
  const [openSection, setOpenSection] = useState("personal");

  const [personal, setPersonal] = useState({
    name: "",
    dob: "",
    email: "",
    phone: "",
    city: "",
    summary: "",
  });

  const [education, setEducation] = useState([
    { degree: "", school: "", start: "", end: "", city: "" },
  ]);

  const [experience, setExperience] = useState([
    {
      role: "",
      company: "",
      start: "",
      end: "",
      currentlyWorking: false,
      bullets: [""],
    },
  ]);

  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const templatePreviewStyles = {
    "template_corporate_premium": {
      nameColor: "text-blue-800",
      titleColor: "text-blue-800",
    },
    "minimal-executive": {
      nameColor: "text-black",
      titleColor: "text-black",
    },
    "two-column-creative": {
      nameColor: "text-blue-600",
      titleColor: "text-blue-600",
    },
    "elegant-professional": {
      nameColor: "text-yellow-800",
      titleColor: "text-yellow-800",
    }
  };
  // FONT MAPPING FOR PREVIEW
  const fontClasses = {
    inter: "font-['Inter']",
    roboto: "font-['Roboto']",
    lato: "font-['Lato']",
    playfair: "font-['Playfair Display']",
    poppins: "font-['Poppins']",
  };

  // ---------------- INTERNSHIPS ----------------
  const [internships, setInternships] = useState([
    { role: "", company: "", start: "", end: "", bullets: [""] },
  ]);

  // ---------------- PROJECTS ----------------
  const [projects, setProjects] = useState([
    { title: "", tech: "", bullets: [""] },
  ]);

  // ---------------- CERTIFICATIONS ----------------
  const [certifications, setCertifications] = useState([
    { name: "", org: "", year: "" },
  ]);

  // ---------------- EXTRACURRICULAR ----------------
  const [extra, setExtra] = useState([
    { title: "", description: "" },
  ]);
  const [selectedFont, setSelectedFont] = useState("inter");

  // ---------------- DURATION ----------------

  const calculateDuration = (start, end, current) => {
    if (!start) return "";

    const startDate = new Date(start + "-01");
    const endDate = current ? new Date() : new Date(end + "-01");

    const diffMonths =
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth());

    if (diffMonths < 0) return "";

    const years = Math.floor(diffMonths / 12);
    const months = diffMonths % 12;

    return `${years > 0 ? years + " yr " : ""}${months > 0 ? months + " mo" : ""}`;
  };

  // ---------------- PDF ----------------

  const generatePDF = async () => {
    setLoading(true);

    const formattedExperience = experience.map((exp) => ({
      ...exp,
      duration: calculateDuration(exp.start, exp.end, exp.currentlyWorking),
    }));

    const payload = {
      template: selectedTemplate,
      font: selectedFont,
      ...personal,
      education,
      experience: formattedExperience,
      internships,
      projects,
      certifications,
      extracurricular: extra,
      skills,
    };

    try {
      const response = await fetch(
        "http://localhost:8080/api/generate-resume",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "resume.pdf";
      link.click();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Error generating PDF");
    }

    setLoading(false);
  };

  const getSectionOrder = () => {
    if (profileMode === "experienced") {
      return [
        "summary",
        "experience",
        "skills",
        "education",
        "certifications",
        "projects",
        "extracurricular",
        "internships",
      ];
    }

    return [
      "summary",
      "education",
      "internships",
      "projects",
      "skills",
      "certifications",
      "extracurricular",
      "experience",
    ];
  };

  // ---------------- PREVIEW ----------------
  const Preview = () => {
  // Helper for rendering bullets
  const BulletList = ({ list }) =>
    list.some(b => b.trim()) && (
      <ul className="list-disc ml-6 mt-2 text-sm">
        {list.map((b, i) => b.trim() && <li key={i}>{b}</li>)}
      </ul>
    );

  // Helper for experience date formatting
  const ExpDate = (e) => (
    <div className="text-xs text-gray-600">
      {e.start} - {e.currentlyWorking ? "Present" : e.end}
    </div>
  );

  // Helper for education meta
  const EduMeta = (e) => (
    <div className="text-xs text-gray-600">
      {e.start} - {e.end} {e.city && `| ${e.city}`}
    </div>
  );

  // Helper for ALL SECTIONS
  const Sections = (color) => (
    <>
      {/* SUMMARY */}
      {personal.summary && (
        <div className="mb-6">
          <div className={`font-bold uppercase text-sm mb-2 ${color}`}>
            Professional Summary
          </div>
          <div>{personal.summary}</div>
        </div>
      )}

      {/* EDUCATION */}
      {education.some(e => e.degree) && (
        <div className="mb-6">
          <div className={`font-bold uppercase text-sm mb-2 ${color}`}>
            Education
          </div>

          {education.map((e, i) =>
            e.degree && (
              <div key={i} className="mb-2">
                <div className="font-semibold">{e.degree} — {e.school}</div>
                {EduMeta(e)}
              </div>
            )
          )}
        </div>
      )}

      {/* INTERNSHIPS */}
      {internships.some(i => i.role) && (
        <div className="mb-6">
          <div className={`font-bold uppercase text-sm mb-2 ${color}`}>
            Internships
          </div>

          {internships.map((i, idx) =>
            i.role && (
              <div key={idx} className="mb-3">
                <div className="font-semibold">{i.role} — {i.company}</div>
                <div className="text-xs text-gray-600">{i.start} - {i.end}</div>
                <BulletList list={i.bullets} />
              </div>
            )
          )}
        </div>
      )}

      {/* PROJECTS */}
      {projects.some(p => p.title) && (
        <div className="mb-6">
          <div className={`font-bold uppercase text-sm mb-2 ${color}`}>
            Projects
          </div>

          {projects.map((p, i) =>
            p.title && (
              <div key={i} className="mb-3">
                <div className="font-semibold">{p.title}</div>
                {p.tech && (
                  <div className="text-xs text-gray-600">{p.tech}</div>
                )}
                <BulletList list={p.bullets} />
              </div>
            )
          )}
        </div>
      )}

      {/* SKILLS */}
      {skills.length > 0 && (
        <div className="mb-6">
          <div className={`font-bold uppercase text-sm mb-2 ${color}`}>
            Skills
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {skills.map((s, i) => <span key={i}>• {s}</span>)}
          </div>
        </div>
      )}

      {/* EXPERIENCE */}
      {experience.some(e => e.role) && (
        <div className="mb-6">
          <div className={`font-bold uppercase text-sm mb-2 ${color}`}>
            Experience
          </div>

          {experience.map((e, i) =>
            e.role && (
              <div key={i} className="mb-4">
                <div className="flex justify-between">
                  <div className="font-semibold">{e.role} — {e.company}</div>
                  {ExpDate(e)}
                </div>
                <BulletList list={e.bullets} />
              </div>
            )
          )}
        </div>
      )}

      {/* CERTIFICATIONS */}
      {certifications.some(c => c.name) && (
        <div className="mb-6">
          <div className={`font-bold uppercase text-sm mb-2 ${color}`}>
            Certifications
          </div>

          {certifications.map((c, i) =>
            c.name && (
              <div key={i} className="text-sm mb-2">
                {c.name}
                {c.org && ` — ${c.org}`}
                {c.year && ` (${c.year})`}
              </div>
            )
          )}
        </div>
      )}

      {/* EXTRACURRICULAR */}
      {extra.some(e => e.title) && (
        <div className="mb-6">
          <div className={`font-bold uppercase text-sm mb-2 ${color}`}>
            Extracurricular Activities
          </div>

          {extra.map((e, i) =>
            e.title && (
              <div key={i} className="mb-2 text-sm">
                <strong>{e.title}</strong>
                {e.description && (
                  <div className="text-gray-600">{e.description}</div>
                )}
              </div>
            )
          )}
        </div>
      )}
    </>
  );

  // -------------------------
  // TEMPLATE 1: CORPORATE
  // -------------------------
  if (selectedTemplate === "template_corporate_premium") {
    return (
      <div className="flex justify-center">
        <div
          className={`bg-white text-black ${fontClasses[selectedFont]}`}
          style={{
            width: "210mm",
            minHeight: "297mm",
            padding: "25mm",
            boxShadow: "0 15px 40px rgba(0,0,0,0.15)",
          }}
        >
          <div className="mb-6">
            <div className="text-3xl font-bold text-blue-800">
              {personal.name || "Your Name"}
            </div>
            <div className="text-sm text-gray-600">
              {personal.email}
              {personal.phone && " | " + personal.phone}
              {personal.city && " | " + personal.city}
              {personal.dob && " | DOB: " + personal.dob}
            </div>
          </div>

          {Sections("text-blue-800")}
        </div>
      </div>
    );
  }

  // -------------------------
  // TEMPLATE 2: MINIMAL
  // -------------------------
  if (selectedTemplate === "minimal-executive") {
    return (
      <div className="flex justify-center">
        <div
          className={`bg-white text-black ${fontClasses[selectedFont]}`}
          style={{
            width: "210mm",
            minHeight: "297mm",
            padding: "25mm",
            boxShadow: "0 15px 40px rgba(0,0,0,0.15)",
          }}
        >
          <div className="text-3xl font-bold text-black mb-2">
            {personal.name || "Your Name"}
          </div>

          <div className="text-sm text-gray-600 mb-6">
            {personal.email}
            {personal.phone && " | " + personal.phone}
            {personal.city && " | " + personal.city}
          </div>

          {Sections("text-black")}
        </div>
      </div>
    );
  }

  // -------------------------
  // TEMPLATE 3: TWO-COLUMN
  // -------------------------
  if (selectedTemplate === "two-column-creative") {
    return (
      <div className="flex justify-center">
        <div
          className={`${fontClasses[selectedFont]}`}
          style={{
            width: "210mm",
            minHeight: "297mm",
            background: "white",
            display: "flex",
            boxShadow: "0 15px 35px rgba(0,0,0,0.25)",
          }}
        >
          {/* SIDEBAR */}
          <div style={{ width: "30%", background: "#f3f4f6", padding: "20px" }}>
            <div className="text-xl font-semibold text-blue-600 mb-3">
              {personal.name || "Your Name"}
            </div>

            <div className="text-sm text-gray-600">{personal.email}</div>
            <div className="text-sm text-gray-600">{personal.phone}</div>

            {skills.length > 0 && (
              <>
                <div className="mt-6 font-bold text-blue-600 uppercase text-sm">
                  Skills
                </div>
                <ul className="list-disc ml-4 mt-2 text-sm">
                  {skills.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </>
            )}
          </div>

          {/* MAIN COLUMN */}
          <div style={{ width: "70%", padding: "30px" }}>
            {Sections("text-blue-600")}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------
  // TEMPLATE 4: ELEGANT
  // -------------------------
  if (selectedTemplate === "elegant-professional") {
    return (
      <div className="flex justify-center">
        <div
          className={`${fontClasses[selectedFont]}`}
          style={{
            width: "210mm",
            minHeight: "297mm",
            padding: "25mm",
            background: "white",
            boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
          }}
        >
          <div className="text-4xl font-semibold text-yellow-800 mb-2">
            {personal.name || "Your Name"}
          </div>

          <div className="text-sm text-gray-600 mb-6">
            {personal.email}
            {personal.phone && " | " + personal.phone}
          </div>

          {Sections("text-yellow-800")}
        </div>
      </div>
    );
  }

  return null;
};
  // ---------------- UI ----------------

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 to-gray-300 p-10 text-black">
      <div className="max-w-[1400px] mx-auto flex gap-8">

        {/* LEFT PANEL */}
        <div className="w-[500px] bg-white shadow-md rounded-xl p-6 overflow-y-auto">

          {/* TEMPLATE SELECTOR */}
          <div className="mb-6 p-3 bg-gray-100 rounded-lg">
            <div className="text-sm font-semibold mb-2">Choose Template</div>

            <select
              className="w-full border p-2 rounded"
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
            >
              <option value="template_corporate_premium">Corporate Premium</option>
              <option value="minimal-executive">Minimal Executive</option>
              <option value="two-column-creative">Two Column Creative</option>
              <option value="elegant-professional">Elegant Professional</option>
            </select>
          </div>
          {/* FONT SELECTOR */}
          <div className="mb-6 p-3 bg-gray-100 rounded-lg">
            <div className="text-sm font-semibold mb-2">Choose Font</div>

            <select
              className="w-full border p-2 rounded"
              value={selectedFont}
              onChange={(e) => setSelectedFont(e.target.value)}
            >
              <option value="inter">Inter (Default)</option>
              <option value="roboto">Roboto</option>
              <option value="lato">Lato</option>
              <option value="playfair">Playfair Display</option>
              <option value="poppins">Poppins</option>
            </select>
          </div>
          <div className="mb-6 p-3 bg-gray-100 rounded-lg">
            <div className="text-sm font-semibold mb-2">Profile Type</div>

            <div className="flex gap-4">
              <button
                className={`px-4 py-2 rounded ${profileMode === "fresher"
                  ? "bg-blue-700 text-white"
                  : "bg-white border"
                  }`}
                onClick={() => setProfileMode("fresher")}
              >
                Fresher
              </button>

              <button
                className={`px-4 py-2 rounded ${profileMode === "experienced"
                  ? "bg-blue-700 text-white"
                  : "bg-white border"
                  }`}
                onClick={() => setProfileMode("experienced")}
              >
                Experienced
              </button>
            </div>
          </div>


          {/* PERSONAL */}
          <div className="mb-6">
            <button
              onClick={() => setOpenSection(openSection === "personal" ? "" : "personal")}
              className="w-full text-left text-lg font-semibold flex justify-between"
            >
              Personal Details
              <span>{openSection === "personal" ? "−" : "+"}</span>
            </button>

            {openSection === "personal" && (
              <div className="mt-4">
                <input className="border w-full mb-3 p-2"
                  placeholder="Full Name"
                  value={personal.name}
                  onChange={(e) => setPersonal({ ...personal, name: e.target.value })}
                />
                <input type="date"
                  className="border w-full mb-3 p-2"
                  value={personal.dob}
                  onChange={(e) => setPersonal({ ...personal, dob: e.target.value })}
                />
                <input className="border w-full mb-3 p-2"
                  placeholder="Email"
                  value={personal.email}
                  onChange={(e) => setPersonal({ ...personal, email: e.target.value })}
                />
                <input className="border w-full mb-3 p-2"
                  placeholder="Phone"
                  value={personal.phone}
                  onChange={(e) => setPersonal({ ...personal, phone: e.target.value })}
                />
                <input className="border w-full mb-3 p-2"
                  placeholder="City"
                  value={personal.city}
                  onChange={(e) => setPersonal({ ...personal, city: e.target.value })}
                />
                <textarea className="border w-full h-24 p-2"
                  placeholder="Professional Summary"
                  value={personal.summary}
                  onChange={(e) => setPersonal({ ...personal, summary: e.target.value })}
                />
              </div>
            )}
          </div>

          {/* EDUCATION */}
          <div className="mb-6">
            <button
              onClick={() => setOpenSection(openSection === "education" ? "" : "education")}
              className="w-full text-left text-lg font-semibold flex justify-between"
            >
              Education
              <span>{openSection === "education" ? "−" : "+"}</span>
            </button>

            {openSection === "education" && (
              <div className="mt-4">

                {education.map((edu, i) => (
                  <div key={i} className="border p-3 mb-4 rounded relative">

                    <button
                      type="button"
                      className="absolute top-2 right-2 text-red-600 text-sm"
                      onClick={() => {
                        if (education.length > 1) {
                          setEducation(education.filter((_, idx) => idx !== i));
                        }
                      }}
                    >
                      ✕
                    </button>

                    <input className="border w-full mb-2 p-2"
                      placeholder="Degree"
                      value={edu.degree}
                      onChange={(e) => {
                        const updated = [...education];
                        updated[i].degree = e.target.value;
                        setEducation(updated);
                      }}
                    />

                    <input className="border w-full mb-2 p-2"
                      placeholder="School"
                      value={edu.school}
                      onChange={(e) => {
                        const updated = [...education];
                        updated[i].school = e.target.value;
                        setEducation(updated);
                      }}
                    />

                    <div className="flex gap-2 mb-2">
                      <input className="border w-full p-2"
                        placeholder="Start Year"
                        value={edu.start}
                        onChange={(e) => {
                          const updated = [...education];
                          updated[i].start = e.target.value;
                          setEducation(updated);
                        }}
                      />
                      <input className="border w-full p-2"
                        placeholder="End Year"
                        value={edu.end}
                        onChange={(e) => {
                          const updated = [...education];
                          updated[i].end = e.target.value;
                          setEducation(updated);
                        }}
                      />
                    </div>

                    <input className="border w-full p-2"
                      placeholder="City"
                      value={edu.city}
                      onChange={(e) => {
                        const updated = [...education];
                        updated[i].city = e.target.value;
                        setEducation(updated);
                      }}
                    />
                  </div>
                ))}

                <button
                  className="text-blue-700 font-semibold"
                  onClick={() => setEducation([...education, { degree: "", school: "", start: "", end: "", city: "" }])}
                >
                  + Add Education
                </button>

              </div>
            )}
          </div>

          {/* INTERNSHIPS */}
          <div className="mb-6">
            <button
              onClick={() => setOpenSection(openSection === "internships" ? "" : "internships")}
              className="w-full text-left text-lg font-semibold flex justify-between"
            >
              Internships
              <span>{openSection === "internships" ? "−" : "+"}</span>
            </button>

            {openSection === "internships" && (
              <div className="mt-4">
                {internships.map((int, i) => (
                  <div key={i} className="border p-3 mb-4 rounded relative">

                    <button
                      type="button"
                      className="absolute top-2 right-2 text-red-600 text-sm"
                      onClick={() => {
                        if (internships.length > 1) {
                          setInternships(internships.filter((_, idx) => idx !== i));
                        }
                      }}
                    >
                      ✕
                    </button>

                    <input
                      className="border w-full mb-2 p-2"
                      placeholder="Role"
                      value={int.role}
                      onChange={(e) => {
                        const updated = [...internships];
                        updated[i].role = e.target.value;
                        setInternships(updated);
                      }}
                    />

                    <input
                      className="border w-full mb-2 p-2"
                      placeholder="Company"
                      value={int.company}
                      onChange={(e) => {
                        const updated = [...internships];
                        updated[i].company = e.target.value;
                        setInternships(updated);
                      }}
                    />

                    <div className="flex gap-2 mb-2">
                      <input
                        type="month"
                        className="border w-full p-2"
                        value={int.start}
                        onChange={(e) => {
                          const updated = [...internships];
                          updated[i].start = e.target.value;
                          setInternships(updated);
                        }}
                      />
                      <input
                        type="month"
                        className="border w-full p-2"
                        value={int.end}
                        onChange={(e) => {
                          const updated = [...internships];
                          updated[i].end = e.target.value;
                          setInternships(updated);
                        }}
                      />
                    </div>

                    {int.bullets.map((b, bi) => (
                      <div key={bi} className="flex gap-2 mb-2">
                        <input
                          className="border w-full p-2"
                          placeholder="Bullet point"
                          value={b}
                          onChange={(e) => {
                            const updated = [...internships];
                            updated[i].bullets[bi] = e.target.value;
                            setInternships(updated);
                          }}
                        />
                        <button
                          type="button"
                          className="text-red-600 px-2"
                          onClick={() => {
                            const updated = [...internships];
                            if (updated[i].bullets.length > 1) {
                              updated[i].bullets =
                                updated[i].bullets.filter((_, idx) => idx !== bi);
                              setInternships(updated);
                            }
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}

                    <button
                      className="text-blue-600 text-sm mt-2"
                      onClick={() => {
                        const updated = [...internships];
                        updated[i].bullets.push("");
                        setInternships(updated);
                      }}
                    >
                      + Add Bullet
                    </button>

                  </div>
                ))}

                <button
                  className="text-blue-700 font-semibold"
                  onClick={() => setInternships([
                    ...internships,
                    { role: "", company: "", start: "", end: "", bullets: [""] }
                  ])}
                >
                  + Add Internship
                </button>
              </div>
            )}
          </div>

          {/* PROJECTS */}
          <div className="mb-6">
            <button
              onClick={() => setOpenSection(openSection === "projects" ? "" : "projects")}
              className="w-full text-left text-lg font-semibold flex justify-between"
            >
              Projects
              <span>{openSection === "projects" ? "−" : "+"}</span>
            </button>

            {openSection === "projects" && (
              <div className="mt-4">
                {projects.map((proj, i) => (
                  <div key={i} className="border p-3 mb-4 rounded relative">

                    <button
                      type="button"
                      className="absolute top-2 right-2 text-red-600 text-sm"
                      onClick={() => {
                        if (projects.length > 1) {
                          setProjects(projects.filter((_, idx) => idx !== i));
                        }
                      }}
                    >
                      ✕
                    </button>

                    <input
                      className="border w-full mb-2 p-2"
                      placeholder="Project Title"
                      value={proj.title}
                      onChange={(e) => {
                        const updated = [...projects];
                        updated[i].title = e.target.value;
                        setProjects(updated);
                      }}
                    />

                    <input
                      className="border w-full mb-2 p-2"
                      placeholder="Tech Stack"
                      value={proj.tech}
                      onChange={(e) => {
                        const updated = [...projects];
                        updated[i].tech = e.target.value;
                        setProjects(updated);
                      }}
                    />

                    {proj.bullets.map((b, bi) => (
                      <div key={bi} className="flex gap-2 mb-2">
                        <input
                          className="border w-full p-2"
                          placeholder="Bullet point"
                          value={b}
                          onChange={(e) => {
                            const updated = [...projects];
                            updated[i].bullets[bi] = e.target.value;
                            setProjects(updated);
                          }}
                        />
                        <button
                          type="button"
                          className="text-red-600 px-2"
                          onClick={() => {
                            const updated = [...projects];
                            if (updated[i].bullets.length > 1) {
                              updated[i].bullets =
                                updated[i].bullets.filter((_, idx) => idx !== bi);
                              setProjects(updated);
                            }
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}

                    <button
                      className="text-blue-600 text-sm mt-2"
                      onClick={() => {
                        const updated = [...projects];
                        updated[i].bullets.push("");
                        setProjects(updated);
                      }}
                    >
                      + Add Bullet
                    </button>

                  </div>
                ))}

                <button
                  className="text-blue-700 font-semibold"
                  onClick={() => setProjects([
                    ...projects,
                    { title: "", tech: "", bullets: [""] }
                  ])}
                >
                  + Add Project
                </button>
              </div>
            )}
          </div>


          {/* EXPERIENCE */}
          <div className="mb-6">
            <button
              onClick={() => setOpenSection(openSection === "experience" ? "" : "experience")}
              className="w-full text-left text-lg font-semibold flex justify-between"
            >
              Experience
              <span>{openSection === "experience" ? "−" : "+"}</span>
            </button>

            {openSection === "experience" && (
              <div className="mt-4">

                {experience.map((exp, i) => (
                  <div key={i} className="border p-3 mb-4 rounded relative">

                    <button
                      type="button"
                      className="absolute top-2 right-2 text-red-600 text-sm"
                      onClick={() => {
                        if (experience.length > 1) {
                          setExperience(experience.filter((_, idx) => idx !== i));
                        }
                      }}
                    >
                      ✕
                    </button>

                    <input className="border w-full mb-2 p-2"
                      placeholder="Role"
                      value={exp.role}
                      onChange={(e) => {
                        const updated = [...experience];
                        updated[i].role = e.target.value;
                        setExperience(updated);
                      }}
                    />

                    <input className="border w-full mb-2 p-2"
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) => {
                        const updated = [...experience];
                        updated[i].company = e.target.value;
                        setExperience(updated);
                      }}
                    />

                    <div className="flex gap-2 mb-2">
                      <input type="month"
                        className="border w-full p-2"
                        value={exp.start}
                        onChange={(e) => {
                          const updated = [...experience];
                          updated[i].start = e.target.value;
                          setExperience(updated);
                        }}
                      />

                      {!exp.currentlyWorking && (
                        <input type="month"
                          className="border w-full p-2"
                          value={exp.end}
                          onChange={(e) => {
                            const updated = [...experience];
                            updated[i].end = e.target.value;
                            setExperience(updated);
                          }}
                        />
                      )}
                    </div>

                    <label className="flex items-center gap-2 mb-2 text-sm">
                      <input type="checkbox"
                        checked={exp.currentlyWorking}
                        onChange={(e) => {
                          const updated = [...experience];
                          updated[i].currentlyWorking = e.target.checked;
                          setExperience(updated);
                        }}
                      />
                      Currently Working Here
                    </label>

                    {exp.bullets.map((b, bi) => (
                      <div key={bi} className="flex gap-2 mb-2">
                        <input
                          className="border w-full p-2"
                          placeholder="Bullet point"
                          value={b}
                          onChange={(e) => {
                            const updated = [...experience];
                            updated[i].bullets[bi] = e.target.value;
                            setExperience(updated);
                          }}
                        />
                        <button
                          type="button"
                          className="text-red-600 px-2"
                          onClick={() => {
                            const updated = [...experience];
                            if (updated[i].bullets.length > 1) {
                              updated[i].bullets =
                                updated[i].bullets.filter((_, idx) => idx !== bi);
                              setExperience(updated);
                            }
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}

                    <button
                      className="text-blue-600 text-sm mt-2"
                      onClick={() => {
                        const updated = [...experience];
                        updated[i].bullets.push("");
                        setExperience(updated);
                      }}
                    >
                      + Add Bullet
                    </button>

                  </div>
                ))}

                <button
                  className="text-blue-700 font-semibold"
                  onClick={() => setExperience([
                    ...experience,
                    { role: "", company: "", start: "", end: "", currentlyWorking: false, bullets: [""] }
                  ])}
                >
                  + Add Experience
                </button>

              </div>
            )}
          </div>

          {/* SKILLS */}
          <div className="mb-6">
            <button
              onClick={() => setOpenSection(openSection === "skills" ? "" : "skills")}
              className="w-full text-left text-lg font-semibold flex justify-between"
            >
              Skills
              <span>{openSection === "skills" ? "−" : "+"}</span>
            </button>

            {openSection === "skills" && (
              <div className="mt-4">

                <div className="flex gap-2 mb-3">
                  <input
                    className="border w-full p-2"
                    placeholder="Add Skill"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                  />
                  <button
                    className="bg-blue-600 text-white px-3 rounded"
                    onClick={() => {
                      if (skillInput.trim()) {
                        setSkills([...skills, skillInput.trim()]);
                        setSkillInput("");
                      }
                    }}
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {skills.map((s, i) => (
                    <div key={i} className="bg-gray-200 px-3 py-1 rounded flex items-center gap-2">
                      {s}
                      <button
                        className="text-red-600"
                        onClick={() => setSkills(skills.filter((_, idx) => idx !== i))}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

              </div>
            )}
          </div>

          {/* CERTIFICATIONS */}
          <div className="mb-6">
            <button
              onClick={() => setOpenSection(openSection === "certifications" ? "" : "certifications")}
              className="w-full text-left text-lg font-semibold flex justify-between"
            >
              Certifications
              <span>{openSection === "certifications" ? "−" : "+"}</span>
            </button>

            {openSection === "certifications" && (
              <div className="mt-4">
                {certifications.map((cert, i) => (
                  <div key={i} className="border p-3 mb-4 rounded relative">

                    <button
                      type="button"
                      className="absolute top-2 right-2 text-red-600 text-sm"
                      onClick={() => {
                        if (certifications.length > 1) {
                          setCertifications(certifications.filter((_, idx) => idx !== i));
                        }
                      }}
                    >
                      ✕
                    </button>

                    <input
                      className="border w-full mb-2 p-2"
                      placeholder="Certification Name"
                      value={cert.name}
                      onChange={(e) => {
                        const updated = [...certifications];
                        updated[i].name = e.target.value;
                        setCertifications(updated);
                      }}
                    />

                    <input
                      className="border w-full mb-2 p-2"
                      placeholder="Organization"
                      value={cert.org}
                      onChange={(e) => {
                        const updated = [...certifications];
                        updated[i].org = e.target.value;
                        setCertifications(updated);
                      }}
                    />

                    <input
                      className="border w-full p-2"
                      placeholder="Year"
                      value={cert.year}
                      onChange={(e) => {
                        const updated = [...certifications];
                        updated[i].year = e.target.value;
                        setCertifications(updated);
                      }}
                    />

                  </div>
                ))}

                <button
                  className="text-blue-700 font-semibold"
                  onClick={() => setCertifications([
                    ...certifications,
                    { name: "", org: "", year: "" }
                  ])}
                >
                  + Add Certification
                </button>
              </div>
            )}
          </div>

          {/* EXTRACURRICULAR */}
          <div className="mb-6">
            <button
              onClick={() => setOpenSection(openSection === "extra" ? "" : "extra")}
              className="w-full text-left text-lg font-semibold flex justify-between"
            >
              Extracurricular Activities
              <span>{openSection === "extra" ? "−" : "+"}</span>
            </button>

            {openSection === "extra" && (
              <div className="mt-4">
                {extra.map((ex, i) => (
                  <div key={i} className="border p-3 mb-4 rounded relative">

                    <button
                      type="button"
                      className="absolute top-2 right-2 text-red-600 text-sm"
                      onClick={() => {
                        if (extra.length > 1) {
                          setExtra(extra.filter((_, idx) => idx !== i));
                        }
                      }}
                    >
                      ✕
                    </button>

                    <input
                      className="border w-full mb-2 p-2"
                      placeholder="Activity / Position"
                      value={ex.title}
                      onChange={(e) => {
                        const updated = [...extra];
                        updated[i].title = e.target.value;
                        setExtra(updated);
                      }}
                    />

                    <textarea
                      className="border w-full p-2"
                      placeholder="Description"
                      value={ex.description}
                      onChange={(e) => {
                        const updated = [...extra];
                        updated[i].description = e.target.value;
                        setExtra(updated);
                      }}
                    />

                  </div>
                ))}

                <button
                  className="text-blue-700 font-semibold"
                  onClick={() => setExtra([
                    ...extra,
                    { title: "", description: "" }
                  ])}
                >
                  + Add Activity
                </button>
              </div>
            )}
          </div>


          <button
            onClick={generatePDF}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl mt-6"
          >
            {loading ? "Generating..." : "Generate PDF"}
          </button>

        </div>

        <div className="flex-1 overflow-auto">
          <Preview />
        </div>

      </div>
    </div>
  );
}
