"use client"

import { FileText } from "lucide-react"
import Navbar from "@/components/navbar/navbar"
import Footer from "@/components/footer/footer"

export default function TermsPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#EDE6F0]">
      {/* TOP BAR */}
      <Navbar />

      {/* HEADER BAR */}
      <div className="bg-[#E4D6B3] py-4">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-6 text-lg font-bold">
          <FileText size={18} />
          Terms of service
        </div>
      </div>

      {/* CONTENT */}
      <section className="mx-auto max-w-5xl space-y-6 px-6 py-10 text-gray-800">
        <div className="space-y-2">
          <p className="font-bold">Welcome to Safi.</p>
          <p>
            By accessing or using the Safi platform, you agree to these Terms of
            Service. If you do not agree, please do not use the platform.
          </p>
        </div>

        {/* 1 */}
        <div className="space-y-2">
          <h3 className="font-bold">1. Use of the Platform</h3>
          <p>
            Safi provides educational content designed for children, with
            accounts managed by parents or guardians.
          </p>

          <ul className="list-disc space-y-1 pl-6">
            <li>
              The platform may be used only for personal, non-commercial
              purposes
            </li>
            <li>You agree to use Safi in a lawful and respectful manner</li>
            <li>
              Parents or guardians are responsible for supervising a child’s use
              of the platform
            </li>
          </ul>
        </div>

        {/* 2 */}
        <div className="space-y-2">
          <h3 className="font-bold">2. Accounts & Access</h3>

          <ul className="list-disc space-y-1 pl-6">
            <li>Parent or guardian consent is required for child accounts</li>
            <li>
              You are responsible for maintaining the confidentiality of your
              account access
            </li>
            <li>
              Safi may suspend or terminate access if these Terms are violated
            </li>
          </ul>
        </div>

        {/* 3 */}
        <div className="space-y-2">
          <h3 className="font-bold">3. Educational Content</h3>
          <p>All content on Safi is provided for educational purposes only.</p>

          <ul className="list-disc space-y-1 pl-6">
            <li>Content may be updated, changed, or removed at any time</li>
            <li>
              We do not guarantee uninterrupted access or specific learning
              outcomes
            </li>
            <li>Content may vary by age category</li>
          </ul>
        </div>

        {/* 4 */}
        <div className="space-y-2">
          <h3 className="font-bold">4. Child Safety</h3>
          <p>Safi is designed with child safety as a core principle.</p>

          <ul className="list-disc space-y-1 pl-6">
            <li>No public profiles or social interaction features</li>
            <li>No advertising or third-party marketing</li>
            <li>No external links intended for children</li>
          </ul>

          <p>Parents and guardians remain responsible for overseeing use.</p>
        </div>

        {/* 5 */}
        <div className="space-y-2">
          <h3 className="font-bold">5. Intellectual Property</h3>
          <p>
            All content, designs, and materials on Safi are owned by Safi or its
            licensors.
          </p>

          <ul className="list-disc space-y-1 pl-6">
            <li>
              You may not copy, modify, distribute, or use content for
              commercial purposes
            </li>
            <li>Use of the platform does not grant ownership of any content</li>
          </ul>
        </div>

        {/* 6 */}
        <div className="space-y-2">
          <h3 className="font-bold">6. Privacy</h3>
          <p>
            Your use of Safi is governed by our Privacy Policy, which explains
            how information is collected and protected. By using the platform,
            you agree to that policy.
          </p>
        </div>

        {/* 7 */}
        <div className="space-y-2">
          <h3 className="font-bold">7. Service Availability</h3>
          <p>Safi is provided “as is” and “as available.”</p>

          <ul className="list-disc space-y-1 pl-6">
            <li>
              We may modify, suspend, or discontinue parts of the platform at
              any time
            </li>
            <li>
              We are not responsible for technical interruptions or data loss
              beyond reasonable control
            </li>
          </ul>
        </div>

        {/* 8 */}
        <div className="space-y-2">
          <h3 className="font-bold">8. Limitation of Liability</h3>
          <p>
            To the extent permitted by law, Safi is not liable for any indirect,
            incidental, or consequential damages arising from the use or
            inability to use the platform.
          </p>
        </div>

        {/* 9 */}
        <div className="space-y-2">
          <h3 className="font-bold">9. Changes to These Terms</h3>
          <p>
            We may update these Terms from time to time. Continued use of the
            platform after changes means you accept the updated Terms.
          </p>
        </div>

        {/* 10 */}
        <div className="space-y-2">
          <h3 className="font-bold">10. Contact us</h3>
          <p>
            If you have questions about these Terms, please contact us at:
            hellosafimoyo@gmail.com
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </main>
  )
}
