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
      <section className="mx-auto max-w-5xl space-y-6 px-6 py-10 leading-relaxed text-gray-800">
        <div className="space-y-2">
          <p className="font-bold">Welcome to Safi.</p>
          <p>
            These Terms of Service ("Terms") govern your access to and use of
            the Safi platform, website, learning content, applications, and
            related services (together, the "Platform").
          </p>
          <p>
            Safi is operated by Safi Education Limited ("Safi", "we", "our", or
            "us"). By accessing or using the Platform, you agree to these Terms.
            If you do not agree, please do not use the Platform.
          </p>
          <p>
            Where a child uses the Platform, the parent or legal guardian who
            creates, approves, or manages the account accepts these Terms on
            behalf of the child and is responsible for supervising the child's
            use of the Platform.
          </p>
        </div>

        {/* 1 */}
        <div className="space-y-2">
          <h3 className="font-bold">1. Use of the Platform</h3>
          <p>
            Safi provides educational content designed for children and young
            learners, with accounts managed or approved by parents or legal
            guardians.
          </p>

          <ul className="list-disc space-y-1 pl-6">
            <li>
              The Platform may be used only for personal, household, and
              non-commercial learning purposes.
            </li>
            <li>
              You agree to use Safi in a lawful, respectful, and age-appropriate
              manner.
            </li>
            <li>
              Parents and guardians are responsible for supervising a child's
              use of the Platform.
            </li>
            <li>
              You must not misuse, disrupt, reverse engineer, scrape, copy, or
              attempt to gain unauthorised access to any part of the Platform.
            </li>
            <li>
              You must not use the Platform to upload, transmit, or share
              harmful, illegal, abusive, misleading, or inappropriate content.
            </li>
          </ul>
        </div>

        {/* 2 */}
        <div className="space-y-2">
          <h3 className="font-bold">2. Accounts and Access</h3>
          <p>
            Parent or guardian consent is required for child accounts. Parents
            and guardians are responsible for the accuracy of account information
            and for keeping account access secure.
          </p>

          <ul className="list-disc space-y-1 pl-6">
            <li>
              You are responsible for maintaining the confidentiality of your
              login details and account access.
            </li>
            <li>
              You must notify Safi if you believe your account has been accessed
              without authorisation.
            </li>
            <li>
              Safi may suspend, restrict, or terminate access if these Terms are
              violated, if account activity creates safety or security risks, or
              if required by law.
            </li>
            <li>
              Safi may require account verification before making changes to
              child-related information or parental controls.
            </li>
          </ul>
        </div>

        {/* 3 */}
        <div className="space-y-2">
          <h3 className="font-bold">3. Educational Content</h3>
          <p>
            All content on Safi is provided for educational and informational
            purposes only. Safi aims to support learning, curiosity, and
            age-appropriate understanding, but it does not replace school
            instruction, professional advice, or parental guidance.
          </p>

          <ul className="list-disc space-y-1 pl-6">
            <li>
              Content may be updated, changed, expanded, restricted, or removed
              at any time.
            </li>
            <li>
              We do not guarantee uninterrupted access, error-free content, or
              specific learning outcomes.
            </li>
            <li>
              Content, lessons, activities, and recommendations may vary by age
              category, subscription plan, region, device, or product version.
            </li>
            <li>
              Parents and guardians should review content suitability for their
              child's age, learning level, and needs.
            </li>
          </ul>
        </div>

        {/* 4 */}
        <div className="space-y-2">
          <h3 className="font-bold">4. Child Safety</h3>
          <p>Safi is designed with child safety as a core principle.</p>

          <ul className="list-disc space-y-1 pl-6">
            <li>
              Safi does not provide public child profiles or public social
              interaction features.
            </li>
            <li>
              Safi does not serve third-party advertising targeted at children.
            </li>
            <li>
              Safi does not intentionally direct children to external
              third-party websites for unsupervised use.
            </li>
            <li>
              Parents and guardians remain responsible for overseeing access,
              device use, screen time, and learning activity.
            </li>
            <li>
              Safi may take reasonable action to protect children, families,
              users, the Platform, or the public from harmful or unauthorised
              activity.
            </li>
          </ul>
        </div>

        {/* 5 */}
        <div className="space-y-2">
          <h3 className="font-bold">5. Intellectual Property</h3>
          <p>
            All content, designs, videos, scripts, characters, illustrations,
            graphics, branding, text, software, interfaces, features, course
            materials, and other materials on Safi are owned by Safi Education
            Limited or its licensors.
          </p>

          <ul className="list-disc space-y-1 pl-6">
            <li>
              You may not copy, reproduce, modify, distribute, sell, license,
              publish, upload, display, or use Safi content for commercial
              purposes without written permission.
            </li>
            <li>
              Use of the Platform does not transfer ownership of any Safi
              content, intellectual property, software, brand asset, or learning
              material to you.
            </li>
            <li>
              You may use the Platform only for the learning access permitted by
              your account, subscription, or approved plan.
            </li>
            <li>Safi reserves all rights not expressly granted in these Terms.</li>
          </ul>
        </div>

        {/* 6 */}
        <div className="space-y-2">
          <h3 className="font-bold">6. Privacy</h3>
          <p>
            Your use of Safi is governed by our Privacy Policy, which explains
            how information is collected, used, stored, and protected. By using
            the Platform, you agree to the Privacy Policy.
          </p>
        </div>

        {/* 7 */}
        <div className="space-y-2">
          <h3 className="font-bold">7. Service Availability</h3>
          <p>
            Safi is provided on an "as is" and "as available" basis. We aim to
            provide a reliable learning experience, but we cannot guarantee that
            the Platform will always be available, uninterrupted, secure, or
            error-free.
          </p>

          <ul className="list-disc space-y-1 pl-6">
            <li>
              We may modify, suspend, restrict, update, or discontinue parts of
              the Platform at any time.
            </li>
            <li>
              We are not responsible for interruptions, delays, access issues,
              or data loss caused by events beyond our reasonable control.
            </li>
            <li>
              Access may depend on your device, internet connection, browser,
              app version, payment provider, and other third-party services.
            </li>
            <li>
              We may perform maintenance, updates, security checks, or technical
              changes that temporarily affect access.
            </li>
          </ul>
        </div>

        {/* 8 */}
        <div className="space-y-2">
          <h3 className="font-bold">8. Payments, Subscriptions and Refunds</h3>
          <p>
            Safi may offer paid subscriptions, free trials, promotional access,
            family plans, school plans, or other paid learning plans.
          </p>
          <p>
            By subscribing to Safi, you agree to pay the applicable fees shown
            at the time of purchase. Subscription fees, billing cycles, renewal
            terms, and available features will be displayed before payment is
            completed.
          </p>
          <p>
            Unless otherwise stated, subscriptions may renew automatically at
            the end of each billing period. Parents or guardians are responsible
            for cancelling a subscription before the next renewal date if they do
            not wish to continue using the service.
          </p>

          <p className="font-semibold">Refunds</p>
          <p>We aim to handle refund requests fairly and reasonably.</p>

          <p>Refunds may be approved in the following cases:</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              You were charged more than once for the same subscription period.
            </li>
            <li>
              Payment was successful, but access to the paid service was not
              provided.
            </li>
            <li>
              A technical issue caused by Safi prevented meaningful use of the
              paid service, and we were unable to resolve it within a reasonable
              time.
            </li>
            <li>
              A subscription renewal occurred after you had already requested
              cancellation before the renewal date.
            </li>
            <li>A refund is required by applicable law.</li>
          </ul>

          <p>Refunds will generally not be provided where:</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>The paid subscription period has already been used.</li>
            <li>A parent or guardian forgot to cancel before renewal.</li>
            <li>
              A child did not complete the lessons or stopped using the Platform.
            </li>
            <li>
              The user changed their mind after gaining access to paid content.
            </li>
            <li>
              Access was interrupted due to the user's device, internet
              connection, browser, payment provider, or other third-party issue
              outside Safi's reasonable control.
            </li>
          </ul>

          <p>
            Refund requests must be sent to{" "}
            <span className="font-semibold">contact@safimoyo.com</span> with the
            account email, payment reference, date of payment, and reason for
            the request.
          </p>
          <p>
            Approved refunds will be processed through the original payment
            method where possible. Processing times may depend on the payment
            provider, bank, or card issuer.
          </p>
          <p>
            Safi may offer account credit, subscription extension, or another
            reasonable resolution where a refund is not appropriate but support
            is justified.
          </p>
        </div>

        {/* 9 */}
        <div className="space-y-2">
          <h3 className="font-bold">9. Limitation of Liability</h3>
          <p>
            To the fullest extent permitted by law, Safi Education Limited is
            not liable for any indirect, incidental, special, consequential,
            punitive, or exemplary damages arising from your use of, or
            inability to use, the Platform.
          </p>
          <p>
            Safi is not responsible for losses caused by user error, unauthorised
            account access resulting from a user's failure to keep login details
            secure, third-party service failures, device issues, internet
            disruptions, or events beyond our reasonable control.
          </p>
          <p>
            Nothing in these Terms limits liability that cannot legally be
            limited or excluded under applicable law.
          </p>
        </div>

        {/* 10 */}
        <div className="space-y-2">
          <h3 className="font-bold">10. Changes to These Terms</h3>
          <p>
            We may update these Terms from time to time. If we make material
            changes, we may notify parents or guardians through the Platform, by
            email, or by another appropriate method.
          </p>
          <p>
            Continued use of the Platform after changes take effect means you
            accept the updated Terms. The latest version will show the most
            recent "Last updated" date.
          </p>
        </div>

        {/* 11 */}
        <div className="space-y-2">
          <h3 className="font-bold">11. Contact Us</h3>
          <p>
            If you have questions about these Terms, subscriptions,
            cancellations, or refund requests, please contact us at:
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

      {/* FOOTER */}
      <Footer />
    </main>
  )
}
