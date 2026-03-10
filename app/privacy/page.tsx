"use client"

import { FileText } from "lucide-react"
import Footer from "@/components/footer/footer"
import Navbar from "@/components/navbar/navbar"

export default function PrivacyPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#EDE6F0]">
      {/* TOP BAR */}
      <Navbar />

      {/* HEADER BAR */}
      <div className="bg-[#E4D6B3] py-4">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-6 text-lg font-bold">
          <FileText size={18} />
          Privacy Policy
        </div>
      </div>

      {/* CONTENT */}
      <section className="mx-auto max-w-5xl space-y-6 px-6 py-10 leading-relaxed text-gray-800">
        <p className="font-semibold text-gray-700">
          Safi (“we”, “our”, or “us”) is committed to protecting the privacy and
          safety of children and their families.
        </p>

        <p className="font-semibold text-gray-700">
          This Privacy Policy explains how information is collected, used, and
          protected when using the Safi platform.
        </p>

        {/* 1 */}
        <div className="space-y-2">
          <h3 className="font-bold">1. Information We Collect</h3>

          <p>
            We collect only what is necessary to provide a safe learning
            experience:
          </p>

          <ul className="list-disc space-y-1 pl-6">
            <li>
              Child’s name or nickname and age category (provided by a parent or
              guardian)
            </li>
            <li>Parent or guardian email address</li>
            <li>Learning progress and activity data</li>
            <li>Basic device and browser information</li>
          </ul>

          <p>
            We do not collect precise location data, full names, photos, voice
            recordings, or advertising identifiers.
          </p>
        </div>

        {/* 2 */}
        <div className="space-y-2">
          <h3 className="font-bold">2. How We Use Information</h3>

          <p>Information is used to:</p>

          <ul className="list-disc space-y-1 pl-6">
            <li>Provide and maintain the learning platform</li>
            <li>Personalise age-appropriate content</li>
            <li>Track learning progress and achievements</li>
            <li>Communicate with parents or guardians</li>
            <li>Ensure child safety and platform security</li>
          </ul>

          <p>We do not use data for advertising or marketing.</p>
        </div>

        {/* 3 */}
        <div className="space-y-2">
          <h3 className="font-bold">3. Children’s Privacy</h3>

          <p>
            Safi is designed for children and follows child-first privacy
            principles.
          </p>

          <ul className="list-disc space-y-1 pl-6">
            <li>Child accounts require parent or guardian consent</li>
            <li>
              We do not knowingly collect personal information from children
              without consent
            </li>
            <li>
              Parents may review, delete, or refuse further collection of their
              child’s information at any time
            </li>
          </ul>
        </div>

        {/* 4 */}
        <div className="space-y-2">
          <h3 className="font-bold">4. Data Sharing</h3>

          <p>
            We do not sell or share personal information for marketing purposes.
          </p>

          <p>Information may be shared only:</p>

          <ul className="list-disc space-y-1 pl-6">
            <li>With parent or guardian consent</li>
            <li>
              With trusted service providers necessary to operate the platform
            </li>
            <li>When required by law</li>
            <li>To protect the safety and rights of users</li>
          </ul>
        </div>

        {/* 5 */}
        <div className="space-y-2">
          <h3 className="font-bold">5. Data Security</h3>

          <p>
            We use appropriate technical and organisational measures to protect
            information from unauthorised access, loss, or misuse. Data is
            stored securely using industry-standard practices.
          </p>
        </div>

        {/* 6 */}
        <div className="space-y-2">
          <h3 className="font-bold">6. Cookies & Tracking</h3>

          <p>We use limited cookies or similar technologies to:</p>

          <ul className="list-disc space-y-1 pl-6">
            <li>Support platform functionality</li>
            <li>Improve user experience</li>
            <li>Track learning progress</li>
          </ul>

          <p>Cookie preferences can be managed through browser settings.</p>
        </div>

        {/* 7 */}
        <div className="space-y-2">
          <h3 className="font-bold">7. Parental Rights</h3>

          <p>Parents and guardians have the right to:</p>

          <ul className="list-disc space-y-1 pl-6">
            <li>Access their child’s information</li>
            <li>Request corrections or deletion</li>
            <li>Withdraw consent</li>
            <li>Control communication preferences</li>
          </ul>
        </div>

        {/* 8 */}
        <div className="space-y-2">
          <h3 className="font-bold">8. Data Retention</h3>

          <p>
            Information is retained only as long as necessary to provide the
            service or meet legal requirements. Account data can be deleted upon
            request.
          </p>
        </div>

        {/* 9 */}
        <div className="space-y-2">
          <h3 className="font-bold">9. Changes to This Policy</h3>

          <p>
            We may update this Privacy Policy from time to time. Material
            changes will be communicated through the platform or by email.
          </p>
        </div>

        {/* 10 */}
        <div className="space-y-2">
          <h3 className="font-bold">10. Contact us</h3>

          <p>
            If you have questions about this Privacy Policy or wish to exercise
            your rights, contact us at: hellosafimoyo@gmail.com
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}
