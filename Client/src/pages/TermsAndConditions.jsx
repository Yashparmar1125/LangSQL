import { motion } from 'framer-motion'
import { FileCheck2, Scale, AlertCircle, CheckCircle, ShieldAlert } from 'lucide-react'
import LandingNavbar from '../components/layout/LandingNavbar'
import { Link } from 'react-router-dom'

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0B] text-gray-900 dark:text-white">
      <LandingNavbar />

      <div className="pt-24 pb-20 bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-[#0A0A0B] dark:via-[#0D0D0F] dark:to-[#111113]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12"
        >
          {/* Header */}
          <div className="relative text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 dark:bg-[#00E5FF]/10 border border-blue-500/20 dark:border-[#00E5FF]/20 text-xs font-semibold text-blue-600 dark:text-[#00E5FF]">
              <Scale className="w-4 h-4" />
              <span>User Agreement</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
              Terms & Conditions
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Last Updated: March 2025
            </p>
          </div>

          {/* Core Terms Card */}
          <div className="bg-white/80 dark:bg-[#111113]/80 backdrop-blur-md border border-gray-200/80 dark:border-gray-800/80 rounded-2xl p-6 sm:p-10 shadow-xl space-y-8 text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-blue-500 dark:text-[#00E5FF]" />
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing or using <strong>LangSQL</strong> ("the Service"), you agree to be bound by these Terms and Conditions. 
                If you disagree with any part of these terms, you may not access or use the platform.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-500 dark:text-[#00E5FF]" />
                2. Use of Service & Account Security
              </h2>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li>You are responsible for maintaining the confidentiality of your account credentials and database access passwords.</li>
                <li>You must not use LangSQL for unauthorized penetration testing, malicious SQL injections, or attempting to compromise third-party databases.</li>
                <li>You acknowledge that database connections provided to LangSQL must have appropriate least-privilege permissions assigned by you.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-500 dark:text-[#00E5FF]" />
                3. AI-Generated Queries & Disclaimer
              </h2>
              <div className="p-4 rounded-xl bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20 text-amber-900 dark:text-amber-200">
                <p className="font-medium">
                  <strong>Important Query Execution Notice:</strong> While LangSQL employs advanced AI models and automated schema validation to craft and optimize SQL statements, AI outputs may occasionally contain inaccuracies. 
                  You are solely responsible for reviewing any destructive operations (e.g., <code>DROP</code>, <code>DELETE</code>, <code>TRUNCATE</code>, <code>UPDATE</code>) prior to execution on production databases.
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-blue-500 dark:text-[#00E5FF]" />
                4. Limitation of Liability
              </h2>
              <p>
                To the maximum extent permitted by applicable law, LangSQL and its developers shall not be liable for any indirect, 
                incidental, consequential, or punitive damages, including loss of data, production outages, or profits arising from your 
                use of generated SQL statements or connection utilities.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">5. Intellectual Property</h2>
              <p>
                All rights, code, logos, and UI components associated with LangSQL are the property of LangSQL. 
                You retain complete ownership of your database structures, custom queries, and proprietary data schemas.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">6. Modifications to the Service</h2>
              <p>
                We reserve the right to update, modify, or temporarily discontinue features of the platform with or without notice to improve system security, model capability, or platform performance.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">7. Governing Law & Inquiries</h2>
              <p>
                These Terms shall be governed by and construed in accordance with applicable legal jurisdictions. For questions regarding these terms:
              </p>
              <p className="text-blue-600 dark:text-[#00E5FF] font-semibold">
                legal@langsql.yashparmar.in
              </p>
            </section>

          </div>

          {/* Bottom Back Button */}
          <div className="text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-[#00E5FF] text-white font-medium hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20"
            >
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default TermsAndConditions
