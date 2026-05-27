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
          Safi Education Limited, operating as Safi ("Safi", "we", "our", or
          "us"), is committed to protecting the privacy, safety, and dignity of
          children and their families.
        </p>

        <p className="font-semibold text-gray-700">
          This Privacy Policy explains how we collect, use, store, protect, and
          manage personal information when parents, guardians, and children use
          the Safi learning platform, website, or related services.
        </p>

        <p className="font-semibold text-gray-700">
          Safi is designed as a child-focused learning platform. We follow
          privacy-by-design and child-first data protection principles.
        </p>

        {/* 1 */}
        <div className="space-y-2">
          <h3 className="font-bold">1. Information We Collect</h3>

          <p>
            We collect only the information necessary to provide a safe,
            age-appropriate learning experience.
          </p>

          <p>Information provided by a parent or guardian may include:</p>

          <ul className="list-disc space-y-1 pl-6">
            <li>Child's first name, nickname, or preferred display name</li>
            <li>Child's age category or learning age group</li>
            <li>Parent or guardian name</li>
            <li>Parent or guardian email address</li>
            <li>Account login and subscription details</li>
            <li>Communication preferences</li>
          </ul>

          <p>Information collected through platform use may include:</p>

          <ul className="list-disc space-y-1 pl-6">
            <li>Learning progress</li>
            <li>Lesson completion status</li>
            <li>Quiz or activity results</li>
            <li>Achievement badges or milestones</li>
            <li>Basic device, browser, and usage information</li>
            <li>Error logs and security-related information</li>
          </ul>

          <p>We do not intentionally collect:</p>

          <ul className="list-disc space-y-1 pl-6">
            <li>Precise location data</li>
            <li>
              Child's full legal name, unless required for a specific verified
              purpose
            </li>
            <li>Photos of children</li>
            <li>Voice recordings</li>
            <li>Biometric information</li>
            <li>Advertising identifiers</li>
            <li>Data for behavioural advertising</li>
          </ul>
        </div>

        {/* 2 */}
        <div className="space-y-2">
          <h3 className="font-bold">2. How We Use Information</h3>

          <p>We use information to:</p>

          <ul className="list-disc space-y-1 pl-6">
            <li>Create and manage parent-approved child learning accounts</li>
            <li>Provide access to the Safi learning platform</li>
            <li>
              Personalise content according to age category and learning
              progress
            </li>
            <li>Track lesson progress, achievements, and completion</li>
            <li>Improve platform performance and user experience</li>
            <li>
              Communicate important account, safety, or service updates to
              parents or guardians
            </li>
            <li>
              Prevent misuse, fraud, unauthorised access, or harmful activity
            </li>
            <li>Meet legal, regulatory, and compliance obligations</li>
          </ul>

          <p>
            We do not use children's personal information for targeted
            advertising or behavioural marketing.
          </p>
        </div>

        {/* 3 */}
        <div className="space-y-2">
          <h3 className="font-bold">3. Legal Basis for Processing Information</h3>

          <p>
            Where required by applicable law, we rely on one or more lawful
            bases to process personal information, including:
          </p>

          <ul className="list-disc space-y-1 pl-6">
            <li>Parent or guardian consent</li>
            <li>
              Performance of our service agreement with parents or guardians
            </li>
            <li>
              Legitimate interests, such as improving platform safety and
              functionality
            </li>
            <li>Compliance with legal obligations</li>
            <li>
              Protection of the rights, safety, and wellbeing of users
            </li>
          </ul>

          <p>
            For children's personal information, we require parent or guardian
            consent before collecting or using personal data, unless another
            lawful basis applies under relevant data protection law.
          </p>
        </div>

        {/* 4 */}
        <div className="space-y-2">
          <h3 className="font-bold">4. Children's Privacy</h3>

          <p>
            Safi is designed for children and young learners. We take children's
            privacy seriously.
          </p>

          <ul className="list-disc space-y-1 pl-6">
            <li>
              Child accounts must be created or approved by a parent or guardian.
            </li>
            <li>
              We do not knowingly collect personal information directly from
              children without parent or guardian consent.
            </li>
            <li>
              We collect only the minimum information needed to support learning.
            </li>
            <li>
              We do not allow third-party advertising targeted at children.
            </li>
            <li>
              Parents and guardians can review, correct, delete, or restrict the
              use of their child's information.
            </li>
            <li>Parents and guardians may withdraw consent at any time.</li>
          </ul>

          <p>
            If we discover that a child has provided personal information without
            proper parent or guardian consent, we will take reasonable steps to
            delete or restrict that information.
          </p>
        </div>

        {/* 5 */}
        <div className="space-y-2">
          <h3 className="font-bold">5. Information We Do Not Sell</h3>

          <p>
            We do not sell children's or parents' personal information.
          </p>

          <p>
            We also do not share personal information with advertisers or
            marketing companies for targeted advertising.
          </p>
        </div>

        {/* 6 */}
        <div className="space-y-2">
          <h3 className="font-bold">6. When We May Share Information</h3>

          <p>
            We may share limited information only when necessary and appropriate.
            This may include sharing information:
          </p>

          <ul className="list-disc space-y-1 pl-6">
            <li>
              With trusted service providers that help us operate the platform
            </li>
            <li>
              With payment processors, where subscriptions or payments are
              required
            </li>
            <li>
              With cloud hosting, analytics, security, or technical support
              providers
            </li>
            <li>
              With a parent or guardian connected to the child's account
            </li>
            <li>
              When required by law, regulation, court order, or government
              authority
            </li>
            <li>
              When necessary to protect the safety, rights, or security of Safi,
              users, children, families, or the public
            </li>
          </ul>

          <p>
            All service providers who process personal information on our behalf
            are expected to use the data only for the services they provide to
            Safi and to protect it using appropriate security measures.
          </p>
        </div>

        {/* 7 */}
        <div className="space-y-2">
          <h3 className="font-bold">7. Cookies and Similar Technologies</h3>

          <p>
            We may use limited cookies or similar technologies to:
          </p>

          <ul className="list-disc space-y-1 pl-6">
            <li>Keep users signed in</li>
            <li>Support platform functionality</li>
            <li>Remember basic preferences</li>
            <li>Improve user experience</li>
            <li>Track learning progress</li>
            <li>Detect errors and improve platform security</li>
          </ul>

          <p>
            We do not use cookies for behavioural advertising targeted at
            children.
          </p>

          <p>
            Parents and guardians can manage cookies through browser settings.
            Some platform features may not work properly if essential cookies are
            disabled.
          </p>
        </div>

        {/* 8 */}
        <div className="space-y-2">
          <h3 className="font-bold">8. Data Security</h3>

          <p>
            We use appropriate technical and organisational measures to protect
            personal information against unauthorised access, loss, misuse,
            alteration, or disclosure.
          </p>

          <p>These measures may include:</p>

          <ul className="list-disc space-y-1 pl-6">
            <li>Secure hosting and access controls</li>
            <li>Encryption where appropriate</li>
            <li>Limited access to personal information</li>
            <li>Internal data handling rules</li>
            <li>Security monitoring</li>
            <li>Regular review of platform safety and privacy practices</li>
          </ul>

          <p>
            No digital service can guarantee absolute security, but we take
            reasonable steps to protect the information entrusted to us.
          </p>
        </div>

        {/* 9 */}
        <div className="space-y-2">
          <h3 className="font-bold">9. Data Retention</h3>

          <p>
            We retain personal information only for as long as necessary to:
          </p>

          <ul className="list-disc space-y-1 pl-6">
            <li>Provide the Safi learning service</li>
            <li>Maintain learning progress and account records</li>
            <li>
              Meet legal, accounting, tax, or regulatory obligations
            </li>
            <li>Resolve disputes or enforce our terms</li>
            <li>Protect the safety and security of the platform</li>
          </ul>

          <p>
            Parents or guardians may request account deletion at any time. When
            an account is deleted, we will delete or anonymise personal
            information unless we are required to retain certain information by
            law.
          </p>
        </div>

        {/* 10 */}
        <div className="space-y-2">
          <h3 className="font-bold">10. Parental and Guardian Rights</h3>

          <p>Parents and guardians may request to:</p>

          <ul className="list-disc space-y-1 pl-6">
            <li>Access their child's personal information</li>
            <li>Correct inaccurate information</li>
            <li>Delete their child's information</li>
            <li>Withdraw consent</li>
            <li>
              Restrict further collection or use of their child's information
            </li>
            <li>Close a child's learning account</li>
            <li>Manage communication preferences</li>
          </ul>

          <p>
            To exercise these rights, contact us using the details at the end of
            this Privacy Policy.
          </p>

          <p>
            We may need to verify that the person making the request is the
            child's parent or legal guardian before making changes to a child's
            account or data.
          </p>
        </div>

        {/* 11 */}
        <div className="space-y-2">
          <h3 className="font-bold">11. International Users</h3>

          <p>
            Safi is built for African learners and may be accessed from different
            countries.
          </p>

          <p>
            Where personal information is transferred, stored, or processed
            outside the user's country, we will take reasonable steps to ensure
            that appropriate safeguards are applied in line with applicable data
            protection laws.
          </p>
        </div>

        {/* 12 */}
        <div className="space-y-2">
          <h3 className="font-bold">12. Data Breaches</h3>

          <p>
            If we become aware of a personal data breach that may affect users'
            privacy or safety, we will take appropriate steps to investigate,
            contain, and respond to the issue.
          </p>

          <p>
            Where required by law, we will notify affected users, parents or
            guardians, and the appropriate regulatory authority.
          </p>
        </div>

        {/* 13 */}
        <div className="space-y-2">
          <h3 className="font-bold">13. Third-Party Links or Services</h3>

          <p>
            The Safi platform may contain links to third-party websites, payment
            platforms, or services.
          </p>

          <p>
            We are not responsible for the privacy practices of third-party
            services that we do not own or control. Parents and guardians should
            review the privacy policies of any third-party services before using
            them.
          </p>
        </div>

        {/* 14 */}
        <div className="space-y-2">
          <h3 className="font-bold">14. Changes to This Privacy Policy</h3>

          <p>We may update this Privacy Policy from time to time.</p>

          <p>
            If we make material changes, we will notify parents or guardians
            through the platform, by email, or by another appropriate method
            before the changes take effect where required.
          </p>

          <p>
            The updated version will show the latest "Last updated" date.
          </p>
        </div>

        {/* 15 */}
        <div className="space-y-2">
          <h3 className="font-bold">15. Contact Us</h3>

          <p>
            For questions about this Privacy Policy or to exercise privacy
            rights, contact us at:
          </p>

          <ul className="list-disc space-y-1 pl-6">
            <li>
              <span className="font-semibold">Email:</span>{" "}
              contact@safimoyo.com
            </li>
            <li>
              <span className="font-semibold">Company:</span> Safi Education
              Limited
            </li>
            <li>
              <span className="font-semibold">Location:</span> Nigeria
            </li>
          </ul>
        </div>
      </section>

      <Footer />
    </main>
  )
}
