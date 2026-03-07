import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-8 py-5 max-w-6xl mx-auto">
        <div className="text-xl font-bold text-blue-800">
          ResumeBuilder247
        </div>

        <Link
          href="/builder"
          className="bg-blue-700 text-white px-5 py-2 rounded-lg hover:bg-blue-800"
        >
          Create Resume
        </Link>
      </nav>


      {/* HERO */}
      <section className="max-w-6xl mx-auto px-8 py-20 flex flex-col md:flex-row items-center gap-16">

        <div className="flex-1">
          <h1 className="text-5xl font-bold leading-tight">
            Build a Professional Resume
            <span className="text-blue-700"> in Minutes</span>
          </h1>

          <p className="mt-6 text-lg text-gray-600">
            Create modern resumes with live preview, premium templates,
            and instant PDF download.
          </p>

          <Link
            href="/builder"
            className="inline-block mt-8 bg-blue-700 text-white px-7 py-4 rounded-xl text-lg font-semibold hover:bg-blue-800"
          >
            Start Building Your Resume
          </Link>
        </div>


        {/* RESUME PREVIEW */}
        <div className="flex-1 flex justify-center">

          <div className="bg-white shadow-2xl rounded-xl p-6 w-[320px]">

            <div className="text-xl font-bold text-blue-800">
              Your Name
            </div>

            <div className="text-sm text-gray-500 mb-4">
              email@example.com | +91 9999999999
            </div>

            <div className="h-2 bg-gray-200 mb-2 rounded"></div>
            <div className="h-2 bg-gray-200 mb-2 rounded"></div>
            <div className="h-2 bg-gray-200 mb-6 rounded"></div>

            <div className="text-sm font-semibold text-blue-800 mb-2">
              Experience
            </div>

            <div className="h-2 bg-gray-200 mb-2 rounded"></div>
            <div className="h-2 bg-gray-200 mb-4 rounded"></div>

            <div className="text-sm font-semibold text-blue-800 mb-2">
              Skills
            </div>

            <div className="h-2 bg-gray-200 mb-2 rounded"></div>
            <div className="h-2 bg-gray-200 rounded"></div>

          </div>

        </div>

      </section>


      {/* FEATURES */}
      <section className="bg-white py-20">

        <div className="max-w-6xl mx-auto px-8 text-center">

          <h2 className="text-3xl font-bold">
            Why Use ResumeBuilder247
          </h2>

          <div className="grid md:grid-cols-3 gap-12 mt-12">

            <div>
              <h3 className="font-semibold text-lg">
                Live Resume Preview
              </h3>

              <p className="text-gray-600 mt-2">
                See your resume update instantly while you type.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg">
                Premium Templates
              </h3>

              <p className="text-gray-600 mt-2">
                Choose from clean and professional resume designs.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg">
                Instant PDF Download
              </h3>

              <p className="text-gray-600 mt-2">
                Export your resume as a perfect A4 PDF instantly.
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* TEMPLATE PREVIEW */}
      <section className="py-20">

        <div className="max-w-6xl mx-auto px-8">

          <h2 className="text-3xl font-bold text-center">
            Professional Resume Templates
          </h2>

          <div className="grid md:grid-cols-4 gap-8 mt-12">

            {["Corporate", "Minimal", "Creative", "Elegant"].map((t) => (
              <div
                key={t}
                className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition"
              >
                <div className="h-40 bg-gray-200 rounded mb-4"></div>

                <div className="font-semibold text-center">
                  {t} Template
                </div>
              </div>
            ))}

          </div>

        </div>

      </section>


      {/* CTA */}
      <section className="bg-blue-700 py-20 text-center text-white">

        <h2 className="text-3xl font-bold">
          Ready to Create Your Resume?
        </h2>

        <Link
          href="/builder"
          className="inline-block mt-8 bg-white text-blue-700 px-8 py-4 rounded-xl font-semibold"
        >
          Start Now
        </Link>

      </section>


      {/* FOOTER */}
      <footer className="py-10 text-center text-gray-500">

        ResumeBuilder247 © {new Date().getFullYear()}

      </footer>

    </main>
  );
}